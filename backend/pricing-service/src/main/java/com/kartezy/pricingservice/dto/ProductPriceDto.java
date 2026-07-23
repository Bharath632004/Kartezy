package com.kartezy.pricingservice.dto;

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
public class ProductPriceDto {
    private UUID id;
    private UUID productId;
    private UUID merchantId;
    private BigDecimal basePrice;
    private BigDecimal salePrice;
    private BigDecimal wholesalePrice;
    private BigDecimal costPrice;
    private BigDecimal mrp;
    private String currency;
    private BigDecimal marginPercent;
    private boolean active;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
