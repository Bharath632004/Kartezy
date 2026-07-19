package com.kartezy.merchantservice.controller;

import com.kartezy.merchantservice.dto.*;
import com.kartezy.merchantservice.service.StoreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/merchants")
@RequiredArgsConstructor
public class MerchantController {
    private final StoreService storeService;

    // Store endpoints
    @PostMapping("/stores")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<StoreResponseDto> createStore(@Valid @RequestBody StoreCreateRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(storeService.createStore(request));
    }

    @PutMapping("/stores/{storeId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<StoreResponseDto> updateStore(@PathVariable UUID storeId,
                                                         @Valid @RequestBody StoreCreateRequestDto request) {
        return ResponseEntity.ok(storeService.updateStore(storeId, request));
    }

    @GetMapping("/stores/{storeId}")
    public ResponseEntity<StoreResponseDto> getStore(@PathVariable UUID storeId,
                                                      @RequestParam(required = false) UUID userId) {
        return ResponseEntity.ok(storeService.getStore(storeId, userId));
    }

    @GetMapping("/{merchantId}/store")
    public ResponseEntity<StoreResponseDto> getStoreByMerchantId(@PathVariable UUID merchantId) {
        return ResponseEntity.ok(storeService.getStoreByMerchantId(merchantId));
    }

    @GetMapping("/stores")
    public ResponseEntity<List<StoreResponseDto>> getAllStores() {
        return ResponseEntity.ok(storeService.getAllStores());
    }

    @GetMapping("/stores/nearby")
    public ResponseEntity<List<StoreResponseDto>> getNearbyStores(@RequestParam(defaultValue = "") String city) {
        return ResponseEntity.ok(storeService.getNearbyStores(city));
    }

    @GetMapping("/stores/category/{category}")
    public ResponseEntity<List<StoreResponseDto>> getStoresByCategory(@PathVariable String category) {
        return ResponseEntity.ok(storeService.getStoresByCategory(category));
    }

    @GetMapping("/stores/featured")
    public ResponseEntity<List<StoreResponseDto>> getFeaturedStores() {
        return ResponseEntity.ok(storeService.getFeaturedStores());
    }

    @PutMapping("/stores/{storeId}/toggle-status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<StoreResponseDto> toggleStoreStatus(@PathVariable UUID storeId,
                                                               @RequestParam boolean isOpen) {
        return ResponseEntity.ok(storeService.toggleStoreStatus(storeId, isOpen));
    }

    @PutMapping("/stores/{storeId}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StoreResponseDto> verifyStore(@PathVariable UUID storeId) {
        return ResponseEntity.ok(storeService.verifyStore(storeId));
    }

    @PostMapping("/stores/{storeId}/follow")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> followStore(@PathVariable UUID storeId, @RequestParam UUID userId) {
        storeService.followStore(storeId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/stores/{storeId}/unfollow")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> unfollowStore(@PathVariable UUID storeId, @RequestParam UUID userId) {
        storeService.unfollowStore(storeId, userId);
        return ResponseEntity.ok().build();
    }
}
