package com.kartezy.checkoutservice.controller;

import com.kartezy.checkoutservice.dto.CheckoutRequest;
import com.kartezy.checkoutservice.dto.CheckoutResponse;
import com.kartezy.checkoutservice.dto.CheckoutSummaryDto;
import com.kartezy.checkoutservice.service.CheckoutService;
import com.kartezy.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/checkout")
@RequiredArgsConstructor
public class CheckoutController {

    private final CheckoutService checkoutService;

    @PostMapping("/initiate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<CheckoutResponse>> initiateCheckout(
            @Valid @RequestBody CheckoutRequest request) {
        CheckoutResponse response = checkoutService.initiateCheckout(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Checkout initiated successfully"));
    }

    @PostMapping("/{sessionId}/complete")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<CheckoutResponse>> completeCheckout(
            @PathVariable UUID sessionId,
            @RequestParam UUID orderId) {
        CheckoutResponse response = checkoutService.completeCheckout(sessionId, orderId);
        return ResponseEntity.ok(ApiResponse.success(response, "Checkout completed successfully"));
    }

    @PostMapping("/{sessionId}/fail")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> failCheckout(
            @PathVariable UUID sessionId,
            @RequestParam String reason) {
        checkoutService.failCheckout(sessionId, reason);
        return ResponseEntity.ok(ApiResponse.success(null, "Checkout marked as failed"));
    }

    @GetMapping("/{sessionId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<CheckoutResponse>> getCheckoutSession(
            @PathVariable UUID sessionId) {
        CheckoutResponse response = checkoutService.getCheckoutSession(sessionId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{sessionId}/summary")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<CheckoutSummaryDto>> getCheckoutSummary(
            @PathVariable UUID sessionId) {
        CheckoutSummaryDto summary = checkoutService.getCheckoutSummary(sessionId);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
}
