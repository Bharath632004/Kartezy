package com.kartezy.membershipservice.controller;

import com.kartezy.membershipservice.dto.MembershipDto;
import com.kartezy.membershipservice.dto.MembershipPlanDto;
import com.kartezy.membershipservice.service.MembershipService;
import com.kartezy.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/membership")
@RequiredArgsConstructor
public class MembershipController {

    private final MembershipService membershipService;

    @GetMapping("/plans")
    public ResponseEntity<ApiResponse<List<MembershipPlanDto>>> getAllPlans() {
        return ResponseEntity.ok(ApiResponse.success(membershipService.getAllPlans()));
    }

    @PostMapping("/subscribe")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<MembershipDto>> createMembership(
            @RequestParam UUID userId,
            @RequestParam UUID planId,
            @RequestParam(defaultValue = "FREE") String paymentReference) {
        MembershipDto membership = membershipService.createMembership(userId, planId, paymentReference);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(membership, "Membership created"));
    }

    @GetMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<MembershipDto>> getMembership(@PathVariable UUID userId) {
        return ResponseEntity.ok(ApiResponse.success(membershipService.getMembership(userId)));
    }

    @PostMapping("/{userId}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> cancelMembership(@PathVariable UUID userId) {
        membershipService.cancelMembership(userId);
        return ResponseEntity.ok(ApiResponse.success(null, "Membership cancelled"));
    }
}
