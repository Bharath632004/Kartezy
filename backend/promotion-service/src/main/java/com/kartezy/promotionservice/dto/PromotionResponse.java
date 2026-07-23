package com.kartezy.promotionservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PromotionResponse {
    private boolean valid;
    private String code;
    private String title;
    private String description;
    private BigDecimal discountAmount;
    private String discountType;
    private BigDecimal discountedAmount;
    private String message;
}
