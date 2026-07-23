package com.kartezy.wishlistservice.service;

import com.kartezy.wishlistservice.dto.AddToWishlistRequest;
import com.kartezy.wishlistservice.dto.WishlistDto;
import com.kartezy.wishlistservice.dto.WishlistItemDto;
import com.kartezy.wishlistservice.entity.Wishlist;
import com.kartezy.wishlistservice.entity.WishlistItem;
import com.kartezy.wishlistservice.repository.WishlistItemRepository;
import com.kartezy.wishlistservice.repository.WishlistRepository;
import com.kartezy.shared.exception.BadRequestException;
import com.kartezy.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;

    @Transactional
    public WishlistDto addItem(AddToWishlistRequest request) {
        log.info("Adding item to wishlist: userId={}, productId={}", request.getUserId(), request.getProductId());

        Wishlist wishlist = wishlistRepository.findByUserId(request.getUserId())
            .orElseGet(() -> {
                Wishlist newWishlist = Wishlist.builder()
                    .userId(request.getUserId())
                    .name("Default Wishlist")
                    .isDefault(true)
                    .build();
                return wishlistRepository.save(newWishlist);
            });

        if (wishlistItemRepository.existsByWishlistIdAndProductId(wishlist.getId(), request.getProductId())) {
            throw new BadRequestException("Product already in wishlist");
        }

        WishlistItem item = WishlistItem.builder()
            .wishlistId(wishlist.getId())
            .productId(request.getProductId())
            .merchantId(request.getMerchantId())
            .productName(request.getProductName())
            .productImage(request.getProductImage())
            .price(request.getPrice())
            .priceAtAdd(request.getPrice())
            .notes(request.getNotes())
            .build();
        wishlistItemRepository.save(item);

        log.info("Item added to wishlist: wishlistId={}, itemId={}", wishlist.getId(), item.getId());
        return getWishlist(request.getUserId());
    }

    @Transactional
    public void removeItem(UUID userId, UUID productId) {
        Wishlist wishlist = wishlistRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Wishlist not found for user: " + userId));

        wishlistItemRepository.deleteByWishlistIdAndProductId(wishlist.getId(), productId);
        log.info("Item removed from wishlist: userId={}, productId={}", userId, productId);
    }

    public WishlistDto getWishlist(UUID userId) {
        Wishlist wishlist = wishlistRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Wishlist not found for user: " + userId));

        List<WishlistItem> items = wishlistItemRepository.findByWishlistId(wishlist.getId());
        return toWishlistDto(wishlist, items);
    }

    public boolean isInWishlist(UUID userId, UUID productId) {
        return wishlistRepository.findByUserId(userId)
            .map(w -> wishlistItemRepository.existsByWishlistIdAndProductId(w.getId(), productId))
            .orElse(false);
    }

    private WishlistDto toWishlistDto(Wishlist wishlist, List<WishlistItem> items) {
        return WishlistDto.builder()
            .id(wishlist.getId())
            .userId(wishlist.getUserId())
            .name(wishlist.getName())
            .isDefault(wishlist.isDefault())
            .itemCount(items.size())
            .items(items.stream().map(this::toItemDto).collect(Collectors.toList()))
            .createdAt(wishlist.getCreatedAt())
            .updatedAt(wishlist.getUpdatedAt())
            .build();
    }

    private WishlistItemDto toItemDto(WishlistItem item) {
        return WishlistItemDto.builder()
            .id(item.getId())
            .productId(item.getProductId())
            .merchantId(item.getMerchantId())
            .productName(item.getProductName())
            .productImage(item.getProductImage())
            .price(item.getPrice())
            .priceAtAdd(item.getPriceAtAdd())
            .notes(item.getNotes())
            .notified(item.isNotified())
            .createdAt(item.getCreatedAt())
            .build();
    }
}
