package com.kartezy.cartservice.service;

import com.kartezy.cartservice.dto.*;
import com.kartezy.cartservice.entity.Cart;
import com.kartezy.cartservice.entity.CartItem;
import com.kartezy.cartservice.repository.CartRepository;
import com.kartezy.cartservice.repository.CartItemRepository;
import com.kartezy.shared.exception.ResourceNotFoundException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ObjectMapper objectMapper;

    private Cart getOrCreateCart(UUID userId) {
        if (userId == null) {
            Cart cart = new Cart();
            cart.setId(UUID.randomUUID().toString());
            return cart;
        }
        return cartRepository.findByUserId(userId.toString())
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUserId(userId.toString());
                    return cartRepository.save(cart);
                });
    }

    // Ensures a new (unsaved) guest cart is persisted before adding items.
    private Cart ensurePersisted(Cart cart) {
        if (cart.getId() != null && !cartRepository.existsById(cart.getId())) {
            return cartRepository.save(cart);
        }
        return cart;
    }

    private String variantsToJson(Map<String, String> variants) {
        if (variants == null || variants.isEmpty()) {
            return "{}";
        }
        try {
            return objectMapper.writeValueAsString(variants);
        } catch (JsonProcessingException e) {
            log.warn("Failed to serialize variants, using empty JSON", e);
            return "{}";
        }
    }

    private Map<String, String> jsonToVariants(String json) {
        if (json == null || json.isEmpty() || json.equals("{}")) {
            return Collections.emptyMap();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, String>>() {});
        } catch (JsonProcessingException e) {
            log.warn("Failed to deserialize variants, returning empty map", e);
            return Collections.emptyMap();
        }
    }

    @Transactional
    public Cart getCart(UUID userId) {
        return getOrCreateCart(userId);
    }

    @Transactional
    public Cart addToCart(String userId, String productId, int quantity,
                          String productName, String productImage, double unitPrice,
                          Map<String, String> variants) {
        UUID userUuid = (userId == null || userId.isEmpty()) ? null : UUID.fromString(userId);
        Cart cart = getOrCreateCart(userUuid);
        cart = ensurePersisted(cart);

        String variantsJson = variantsToJson(variants);

        Optional<CartItem> existingItem = findCartItemByProductAndVariants(cart.getId(), productId, variantsJson);
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + quantity;
            item.setQuantity(newQuantity);
            item.setTotalPrice(unitPrice * newQuantity);
            item.setProductName(productName);
            item.setProductImage(productImage);
            item.setUnitPrice(unitPrice);
            cartItemRepository.save(item);
        } else {
            CartItem cartItem = CartItem.builder()
                    .id(UUID.randomUUID().toString())
                    .cartId(cart.getId())
                    .productId(productId)
                    .productName(productName)
                    .productImage(productImage)
                    .unitPrice(unitPrice)
                    .quantity(quantity)
                    .totalPrice(unitPrice * quantity)
                    .variants(variantsJson)
                    .savedForLater(false)
                    .build();
            cartItemRepository.save(cartItem);
        }

        return cart;
    }

    private Optional<CartItem> findCartItemByProductAndVariants(String cartId, String productId, String variantsJson) {
        List<CartItem> items = cartItemRepository.findByCartId(cartId);
        for (CartItem item : items) {
            if (item.getProductId().equals(productId) && item.getVariants().equals(variantsJson)) {
                return Optional.of(item);
            }
        }
        return Optional.empty();
    }

    @Transactional
    public Cart updateCartItem(String cartItemId, int quantity) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found: " + cartItemId));
        item.setQuantity(quantity);
        item.setTotalPrice(item.getUnitPrice() * quantity);
        cartItemRepository.save(item);
        return cartRepository.findById(item.getCartId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
    }

    @Transactional
    public Cart removeCartItem(String cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found: " + cartItemId));
        String cartId = item.getCartId();
        cartItemRepository.deleteById(cartItemId);
        return cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
    }

    @Transactional
    public Cart clearCart(UUID userId) {
        if (userId == null) {
            return new Cart();
        }
        Cart cart = cartRepository.findByUserId(userId.toString())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user: " + userId));
        cartItemRepository.deleteByCartId(cart.getId());
        cart.setCouponCode(null);
        cart.setDiscountAmount(0);
        cart.setTipAmount(0);
        cart.setWalletAmount(0);
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart applyCoupon(String couponCode) {
        Cart cart = getOrCreateCart(null);
        cart = ensurePersisted(cart);
        cart.setCouponCode(couponCode);

        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
        double subtotal = items.stream().mapToDouble(CartItem::getTotalPrice).sum();
        double discount = subtotal * 0.10;
        cart.setDiscountAmount(discount);

        return cartRepository.save(cart);
    }

    @Transactional
    public Cart removeCoupon() {
        Cart cart = getOrCreateCart(null);
        cart = ensurePersisted(cart);
        cart.setCouponCode(null);
        cart.setDiscountAmount(0);
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart saveForLater(String cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found: " + cartItemId));
        item.setSavedForLater(true);
        cartItemRepository.save(item);
        return cartRepository.findById(item.getCartId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
    }

    @Transactional
    public Cart moveToWishlist(String cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found: " + cartItemId));
        String cartId = item.getCartId();
        cartItemRepository.deleteById(cartItemId);
        return cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
    }

    @Transactional
    public Cart restoreFromSaveForLater(String cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found: " + cartItemId));
        item.setSavedForLater(false);
        cartItemRepository.save(item);
        return cartRepository.findById(item.getCartId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
    }

    @Transactional
    public Cart updateWalletAmount(UUID userId, double amount) {
        Cart cart = getOrCreateCart(userId);
        cart = ensurePersisted(cart);
        cart.setWalletAmount(amount);
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart updateCartItemVariants(String cartItemId, Map<String, String> variants) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found: " + cartItemId));
        item.setVariants(variantsToJson(variants));
        cartItemRepository.save(item);
        return cartRepository.findById(item.getCartId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
    }

    @Transactional
    public Cart mergeGuestCart(UUID guestCartId, UUID userId) {
        Cart guestCart = cartRepository.findById(guestCartId.toString())
                .orElseThrow(() -> new ResourceNotFoundException("Guest cart not found: " + guestCartId));
        Cart userCart = getOrCreateCart(userId);

        List<CartItem> guestItems = cartItemRepository.findByCartId(guestCart.getId());
        for (CartItem item : guestItems) {
            Optional<CartItem> existing = findCartItemByProductAndVariants(userCart.getId(), item.getProductId(), item.getVariants());
            if (existing.isPresent()) {
                CartItem existingItem = existing.get();
                existingItem.setQuantity(existingItem.getQuantity() + item.getQuantity());
                existingItem.setTotalPrice(existingItem.getUnitPrice() * existingItem.getQuantity());
                cartItemRepository.save(existingItem);
                cartItemRepository.deleteById(item.getId());
            } else {
                item.setCartId(userCart.getId());
                cartItemRepository.save(item);
            }
        }

        cartItemRepository.deleteByCartId(guestCart.getId());
        cartRepository.deleteById(guestCart.getId());

        return userCart;
    }

    public CartDto toDto(Cart cart) {
        if (cart == null || cart.getId() == null) {
            return CartDto.builder()
                    .items(Collections.emptyList())
                    .itemCount(0)
                    .subtotal(0)
                    .totalAmount(0)
                    .netAmount(0)
                    .deliveryCharges(0)
                    .build();
        }

        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
        List<CartItem> activeItems = items.stream()
                .filter(item -> !item.isSavedForLater())
                .collect(Collectors.toList());
        List<CartItem> savedItems = items.stream()
                .filter(CartItem::isSavedForLater)
                .collect(Collectors.toList());

        List<CartItemDto> activeItemDtos = activeItems.stream()
                .map(this::toItemDto)
                .collect(Collectors.toList());
        List<CartItemDto> savedItemDtos = savedItems.stream()
                .map(this::toItemDto)
                .collect(Collectors.toList());

        double subtotal = activeItems.stream().mapToDouble(CartItem::getTotalPrice).sum();
        double deliveryFee = subtotal > 500 ? 0 : 20;
        double platformFee = 5;
        double packagingFee = activeItems.size() * 2;
        double gst = subtotal * 0.05;
        double discount = cart.getDiscountAmount();
        double tip = cart.getTipAmount();
        double wallet = cart.getWalletAmount();

        double total = subtotal + deliveryFee + platformFee + packagingFee + gst + tip - wallet - discount;
        double netAmount = Math.max(total, 0);

        return CartDto.builder()
                .id(cart.getId())
                .userId(cart.getUserId())
                .items(activeItemDtos)
                .savedForLaterItems(savedItemDtos)
                .couponCode(cart.getCouponCode())
                .discountAmount(discount)
                .subtotal(subtotal)
                .totalAmount(subtotal) // Mobile app expects 'totalAmount' = subtotal
                .itemCount(activeItems.size())
                .deliveryCharges(deliveryFee)
                .platformFee(platformFee)
                .packagingFee(packagingFee)
                .gstAmount(gst)
                .tipAmount(tip)
                .walletAmount(wallet)
                .netAmount(netAmount)
                .build();
    }

    private CartItemDto toItemDto(CartItem item) {
        return CartItemDto.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .productName(item.getProductName())
                .productImage(item.getProductImage())
                .unitPrice(item.getUnitPrice())
                .quantity(item.getQuantity())
                .totalPrice(item.getTotalPrice())
                .variants(jsonToVariants(item.getVariants()))
                .savedForLater(item.isSavedForLater())
                .build();
    }
}
