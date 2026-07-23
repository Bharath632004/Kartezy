package com.kartezy.promotionservice.controller;

import com.kartezy.promotionservice.dto.*;
import com.kartezy.promotionservice.service.PromotionService;
import com.kartezy.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/promotions")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionService promotionService;

    @PostMapping("/validate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PromotionResponse>> validatePromotion(
            @Valid @RequestBody ApplyPromotionRequest request) {
        PromotionResponse response = promotionService.validateAndApply(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/apply")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PromotionResponse>> applyPromotion(
            @Valid @RequestBody ApplyPromotionRequest request) {
        PromotionResponse response = promotionService.applyPromotion(request);
        if (response.isValid()) {
            return ResponseEntity.ok(ApiResponse.success(response, "Promotion applied successfully"));
        }
        return ResponseEntity.badRequest().body(ApiResponse.error(response.getMessage()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MERCHANT')")
    public ResponseEntity<ApiResponse<PromotionDto>> createPromotion(
            @Valid @RequestBody CreatePromotionRequest request) {
        PromotionDto promotion = promotionService.createPromotion(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(promotion, "Promotion created successfully"));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<PromotionDto>>> getActivePromotions() {
        List<PromotionDto> promotions = promotionService.getActivePromotions();
        return ResponseEntity.ok(ApiResponse.success(promotions));
    }

    @GetMapping("/{code}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PromotionDto>> getPromotion(@PathVariable String code) {
        PromotionDto promotion = promotionService.getPromotionByCode(code);
        return ResponseEntity.ok(ApiResponse.success(promotion));
    }

    @PatchMapping("/{code}/deactivate")
    @PreAuthorize("hasAnyRole('ADMIN', 'MERCHANT')")
    public ResponseEntity<ApiResponse<Void>> deactivatePromotion(@PathVariable String code) {
        promotionService.deactivatePromotion(code);
        return ResponseEntity.ok(ApiResponse.success(null, "Promotion deactivated"));
    }
}
