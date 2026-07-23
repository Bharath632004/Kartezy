package com.kartezy.cartservice.controller;

import com.kartezy.cartservice.dto.*;
import com.kartezy.cartservice.entity.Cart;
import com.kartezy.cartservice.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartDto> getCart(@RequestParam(required = false) String userId) {
        UUID userUuid = (userId == null || userId.isEmpty()) ? null : UUID.fromString(userId);
        Cart cart = cartService.getCart(userUuid);
        return ResponseEntity.ok(cartService.toDto(cart));
    }

    @PostMapping("/add")
    public ResponseEntity<CartDto> addToCart(@Valid @RequestBody AddToCartRequest request) {
        Cart cart = cartService.addToCart(
                request.getUserId(),
                request.getProductId(),
                request.getQuantity(),
                request.getProductName(),
                request.getProductImage(),
                request.getUnitPrice(),
                request.getVariants()
        );
        return ResponseEntity.ok(cartService.toDto(cart));
    }

    @PutMapping("/item/{cartItemId}")
    public ResponseEntity<CartDto> updateCartItem(
            @PathVariable String cartItemId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        Cart cart = cartService.updateCartItem(cartItemId, request.getQuantity());
        return ResponseEntity.ok(cartService.toDto(cart));
    }

    @DeleteMapping("/item/{cartItemId}")
    public ResponseEntity<CartDto> removeCartItem(@PathVariable String cartItemId) {
        Cart cart = cartService.removeCartItem(cartItemId);
        return ResponseEntity.ok(cartService.toDto(cart));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<CartDto> clearCart(@RequestParam(required = false) String userId) {
        UUID userUuid = (userId == null || userId.isEmpty()) ? null : UUID.fromString(userId);
        Cart cart = cartService.clearCart(userUuid);
        return ResponseEntity.ok(cartService.toDto(cart));
    }

    @PostMapping("/apply-coupon")
    public ResponseEntity<CartDto> applyCoupon(@Valid @RequestBody ApplyCouponRequest request) {
        Cart cart = cartService.applyCoupon(request.getCouponCode());
        return ResponseEntity.ok(cartService.toDto(cart));
    }

    @PostMapping("/remove-coupon")
    public ResponseEntity<CartDto> removeCoupon() {
        Cart cart = cartService.removeCoupon();
        return ResponseEntity.ok(cartService.toDto(cart));
    }

    @PostMapping("/save-for-later")
    public ResponseEntity<CartDto> saveForLater(@Valid @RequestBody SaveForLaterRequest request) {
        Cart cart = cartService.saveForLater(request.getCartItemId());
        return ResponseEntity.ok(cartService.toDto(cart));
    }

    @PostMapping("/move-to-wishlist")
    public ResponseEntity<CartDto> moveToWishlist(@Valid @RequestBody MoveToWishlistRequest request) {
        Cart cart = cartService.moveToWishlist(request.getCartItemId());
        return ResponseEntity.ok(cartService.toDto(cart));
    }

    @PostMapping("/restore-from-save-for-later")
    public ResponseEntity<CartDto> restoreFromSaveForLater(@Valid @RequestBody RestoreFromSaveForLaterRequest request) {
        Cart cart = cartService.restoreFromSaveForLater(request.getCartItemId());
        return ResponseEntity.ok(cartService.toDto(cart));
    }

    // This endpoint is kept for backward compatibility with the mobile app
    @PostMapping("/update-wallet")
    public ResponseEntity<CartDto> updateWalletAmount(@Valid @RequestBody UpdateWalletAmountRequest request) {
        UUID userUuid = (request.getUserId() == null || request.getUserId().isEmpty())
                ? null : UUID.fromString(request.getUserId());
        Cart cart = cartService.updateWalletAmount(userUuid, request.getAmount());
        return ResponseEntity.ok(cartService.toDto(cart));
    }

    @PostMapping("/merge-guest-cart")
    public ResponseEntity<CartDto> mergeGuestCart(@Valid @RequestBody MergeGuestCartRequest request) {
        Cart cart = cartService.mergeGuestCart(
                UUID.fromString(request.getGuestCartId()),
                UUID.fromString(request.getUserId())
        );
        return ResponseEntity.ok(cartService.toDto(cart));
    }

    @PutMapping("/item/{cartItemId}/variants")
    public ResponseEntity<CartDto> updateCartItemVariants(
            @PathVariable String cartItemId,
            @Valid @RequestBody UpdateCartItemVariantsRequest request) {
        Cart cart = cartService.updateCartItemVariants(cartItemId, request.getVariants());
        return ResponseEntity.ok(cartService.toDto(cart));
    }
}
