package com.kartezy.paymentservice.controller;

import com.kartezy.paymentservice.dto.*;
import com.kartezy.paymentservice.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentServiceController {
    private final PaymentService paymentService;

    @PostMapping("/process")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PaymentDto> processPayment(@Valid @RequestBody PaymentRequestDto request) {
        PaymentDto payment = paymentService.processPayment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(payment);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PaymentDto> getPayment(@PathVariable UUID id) {
        return ResponseEntity.ok(paymentService.getPayment(id));
    }

    @GetMapping("/order/{orderId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PaymentDto> getPaymentByOrderId(@PathVariable UUID orderId) {
        return ResponseEntity.ok(paymentService.getPaymentByOrderId(orderId));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PaymentDto>> getUserPayments(@PathVariable UUID userId) {
        return ResponseEntity.ok(paymentService.getUserPayments(userId));
    }

    @GetMapping("/merchant/{merchantId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentDto>> getMerchantPayments(@PathVariable UUID merchantId) {
        return ResponseEntity.ok(paymentService.getMerchantPayments(merchantId));
    }

    @PostMapping("/{paymentId}/refund")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<RefundDto> processRefund(@PathVariable UUID paymentId,
                                                    @Valid @RequestBody RefundRequestDto request) {
        request.setPaymentId(paymentId);
        return ResponseEntity.ok(paymentService.processRefund(paymentId, request));
    }

    @GetMapping("/{paymentId}/refunds")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<RefundDto>> getPaymentRefunds(@PathVariable UUID paymentId) {
        return ResponseEntity.ok(paymentService.getPaymentRefunds(paymentId));
    }

    @PostMapping("/settlements")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SettlementDto> createSettlement(@Valid @RequestBody SettlementRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(paymentService.createSettlement(request.getMerchantId(), request.getOrderId(), request));
    }

    @PutMapping("/settlements/{settlementId}/process")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SettlementDto> processSettlement(@PathVariable UUID settlementId) {
        return ResponseEntity.ok(paymentService.processSettlement(settlementId));
    }

    @GetMapping("/settlements/merchant/{merchantId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<SettlementDto>> getMerchantSettlements(@PathVariable UUID merchantId) {
        return ResponseEntity.ok(paymentService.getMerchantSettlements(merchantId));
    }

    @GetMapping("/overview")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentOverviewDto> getOverview() {
        return ResponseEntity.ok(paymentService.getOverview());
    }

    @GetMapping("")
    public String home() {
        return "Welcome to payment-service";
    }

    @GetMapping("/health")
    public String health() {
        return "payment-service is healthy";
    }
}
