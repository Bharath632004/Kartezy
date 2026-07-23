package com.kartezy.wishlistservice.controller;

import com.kartezy.shared.dto.ApiResponse;
import com.kartezy.wishlistservice.dto.AddToWishlistRequest;
import com.kartezy.wishlistservice.dto.WishlistDto;
import com.kartezy.wishlistservice.service.WishlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<WishlistDto>> addItem(@Valid @RequestBody AddToWishlistRequest request) {
        WishlistDto response = wishlistService.addItem(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Item added to wishlist"));
    }

    @DeleteMapping("/{productId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> removeItem(
            @RequestParam UUID userId,
            @PathVariable UUID productId) {
        wishlistService.removeItem(userId, productId);
        return ResponseEntity.ok(ApiResponse.success(null, "Item removed from wishlist"));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<WishlistDto>> getWishlist(@RequestParam UUID userId) {
        WishlistDto wishlist = wishlistService.getWishlist(userId);
        return ResponseEntity.ok(ApiResponse.success(wishlist));
    }

    @GetMapping("/check")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Boolean>> checkInWishlist(
            @RequestParam UUID userId,
            @RequestParam UUID productId) {
        boolean inWishlist = wishlistService.isInWishlist(userId, productId);
        return ResponseEntity.ok(ApiResponse.success(inWishlist));
    }
}
