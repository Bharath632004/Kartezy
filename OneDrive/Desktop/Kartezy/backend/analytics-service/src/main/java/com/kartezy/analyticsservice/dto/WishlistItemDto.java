package com.kartezy.analyticsservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

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
