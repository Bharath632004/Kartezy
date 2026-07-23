package com.kartezy.loyaltyservice.controller;

import com.kartezy.loyaltyservice.dto.LoyaltyPointsDto;
import com.kartezy.loyaltyservice.dto.LoyaltyTransactionDto;
import com.kartezy.loyaltyservice.service.LoyaltyService;
import com.kartezy.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/loyalty")
@RequiredArgsConstructor
public class LoyaltyController {

    private final LoyaltyService loyaltyService;

    @GetMapping("/points/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<LoyaltyPointsDto>> getPoints(@PathVariable UUID userId) {
        return ResponseEntity.ok(ApiResponse.success(loyaltyService.getPoints(userId)));
    }

    @PostMapping("/points/{userId}/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<LoyaltyPointsDto>> addPoints(
            @PathVariable UUID userId,
            @RequestParam int points,
            @RequestParam(defaultValue = "Points earned") String description) {
        return ResponseEntity.ok(ApiResponse.success(loyaltyService.addPoints(userId, points, description, null)));
    }

    @PostMapping("/points/{userId}/redeem")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<LoyaltyPointsDto>> redeemPoints(
            @PathVariable UUID userId,
            @RequestParam int points,
            @RequestParam(defaultValue = "Points redeemed") String description) {
        return ResponseEntity.ok(ApiResponse.success(loyaltyService.redeemPoints(userId, points, description)));
    }

    @GetMapping("/transactions/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<LoyaltyTransactionDto>>> getTransactionHistory(@PathVariable UUID userId) {
        return ResponseEntity.ok(ApiResponse.success(loyaltyService.getTransactionHistory(userId)));
    }
}
