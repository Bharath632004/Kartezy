package com.kartezy.pricingservice.controller;

import com.kartezy.pricingservice.dto.*;
import com.kartezy.pricingservice.service.PricingService;
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
@RequestMapping("/api/v1/pricing")
@RequiredArgsConstructor
public class PricingController {

    private final PricingService pricingService;

    @PostMapping("/products")
    @PreAuthorize("hasAnyRole('ADMIN', 'MERCHANT')")
    public ResponseEntity<ApiResponse<ProductPriceDto>> setProductPrice(
            @Valid @RequestBody ProductPriceDto request) {
        ProductPriceDto response = pricingService.setProductPrice(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Product price set successfully"));
    }

    @PostMapping("/calculate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PriceCalculationResponse>> calculatePrice(
            @Valid @RequestBody PriceCalculationRequest request) {
        PriceCalculationResponse response = pricingService.calculatePrice(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/products/{productId}/{merchantId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ProductPriceDto>> getProductPrice(
            @PathVariable UUID productId,
            @PathVariable UUID merchantId) {
        ProductPriceDto price = pricingService.getProductPrice(productId, merchantId);
        return ResponseEntity.ok(ApiResponse.success(price));
    }

    @GetMapping("/rules")
    @PreAuthorize("hasAnyRole('ADMIN', 'MERCHANT')")
    public ResponseEntity<ApiResponse<List<PriceRuleDto>>> getActiveRules() {
        List<PriceRuleDto> rules = pricingService.getActiveRules();
        return ResponseEntity.ok(ApiResponse.success(rules));
    }

    @PostMapping("/rules")
    @PreAuthorize("hasAnyRole('ADMIN', 'MERCHANT')")
    public ResponseEntity<ApiResponse<PriceRuleDto>> createPriceRule(
            @Valid @RequestBody PriceRuleDto request) {
        PriceRuleDto rule = pricingService.createPriceRule(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(rule, "Price rule created successfully"));
    }
}
