package com.kartezy.wishlistservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishlistItemDto {
    private UUID id;
    private UUID productId;
    private UUID merchantId;
    private String productName;
    private String productImage;
    private BigDecimal price;
    private BigDecimal priceAtAdd;
    private String notes;
    private boolean notified;
    private LocalDateTime createdAt;
}
