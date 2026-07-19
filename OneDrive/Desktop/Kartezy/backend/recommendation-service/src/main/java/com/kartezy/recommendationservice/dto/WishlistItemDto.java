package com.kartezy.recommendationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

/**
 * Local DTO for WishlistItem used by recommendation-service
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistItemDto {
    private UUID id;
    private UUID wishlistId;
    private String productId;
    private String productName;
    private String productImageUrl;
    private Long addedAt;
}
