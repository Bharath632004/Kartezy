package com.kartezy.subscriptionservice.controller;

import com.kartezy.shared.dto.ApiResponse;
import com.kartezy.subscriptionservice.dto.SubscriptionDto;
import com.kartezy.subscriptionservice.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<SubscriptionDto>> createSubscription(@RequestBody SubscriptionDto request) {
        SubscriptionDto sub = subscriptionService.createSubscription(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(sub, "Subscription created"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<SubscriptionDto>> getSubscription(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(subscriptionService.getSubscription(id)));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<SubscriptionDto>>> getUserSubscriptions(@PathVariable UUID userId) {
        return ResponseEntity.ok(ApiResponse.success(subscriptionService.getUserSubscriptions(userId)));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> cancelSubscription(@PathVariable UUID id) {
        subscriptionService.cancelSubscription(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Subscription cancelled"));
    }
}
