package com.kartezy.recommendationservice.controller;

import com.kartezy.recommendationservice.dto.RecommendationDto;
import com.kartezy.recommendationservice.service.RecommendationService;
import com.kartezy.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/products/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<RecommendationDto>>> getProductRecommendations(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(ApiResponse.success(recommendationService.getProductRecommendations(userId, limit)));
    }

    @GetMapping("/stores/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<RecommendationDto>>> getStoreRecommendations(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(ApiResponse.success(recommendationService.getStoreRecommendations(userId, limit)));
    }

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<RecommendationDto>>> getPopularProducts(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(ApiResponse.success(recommendationService.getPopularProducts(limit)));
    }

    @PostMapping("/track")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> trackUserAction(
            @RequestParam UUID userId,
            @RequestParam UUID productId,
            @RequestParam String action) {
        recommendationService.trackUserAction(userId, productId, action);
        return ResponseEntity.ok(ApiResponse.success(null, "Action tracked"));
    }
}
