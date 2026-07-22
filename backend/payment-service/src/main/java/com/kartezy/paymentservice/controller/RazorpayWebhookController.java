package com.kartezy.paymentservice.controller;

import com.kartezy.paymentservice.entity.Payment;
import com.kartezy.paymentservice.integration.RazorpayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.util.stream.Collectors;

/**
 * Controller for handling Razorpay webhook events.
 * Razorpay sends webhook events for payment.captured, payment.failed, order.paid, etc.
 * This endpoint is called by Razorpay's server (not by the frontend).
 */
@Slf4j
@RestController
@RequestMapping("/payments/webhook/razorpay")
@RequiredArgsConstructor
public class RazorpayWebhookController {

    private final RazorpayService razorpayService;

    @PostMapping
    public ResponseEntity<String> handleWebhook(HttpServletRequest request) {
        try {
            String signatureHeader = request.getHeader("x-razorpay-signature");
            String payload;

            try (BufferedReader reader = request.getReader()) {
                payload = reader.lines().collect(Collectors.joining());
            }

            if (payload == null || payload.isEmpty()) {
                log.warn("Empty webhook payload received");
                return ResponseEntity.badRequest().body("Empty payload");
            }

            log.info("Received Razorpay webhook event");
            Payment payment = razorpayService.handleWebhookEvent(payload, signatureHeader);

            if (payment != null) {
                log.info("Webhook processed successfully for payment: {}", payment.getId());
            }

            // Razorpay expects a 200 response to acknowledge receipt
            return ResponseEntity.ok("OK");

        } catch (Exception e) {
            log.error("Error processing webhook: {}", e.getMessage(), e);
            // Return 200 anyway to prevent Razorpay from retrying malformed requests
            return ResponseEntity.ok("OK");
        }
    }
}
