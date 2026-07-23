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
public class PriceRuleDto {
    private UUID id;
    private UUID productId;
    private UUID merchantId;
    private UUID categoryId;
    private String ruleType;
    private String ruleName;
    private String description;
    private String priceType;
    private BigDecimal priceValue;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private boolean active;
    private Integer priority;
    private LocalDateTime effectiveFrom;
    private LocalDateTime effectiveTo;
    private LocalDateTime createdAt;
}
