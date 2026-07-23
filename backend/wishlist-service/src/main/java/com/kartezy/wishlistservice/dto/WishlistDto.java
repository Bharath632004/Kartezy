package com.kartezy.wishlistservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishlistDto {
    private UUID id;
    private UUID userId;
    private String name;
    private boolean isDefault;
    private int itemCount;
    private List<WishlistItemDto> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
