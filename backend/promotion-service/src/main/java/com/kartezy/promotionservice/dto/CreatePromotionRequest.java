package com.kartezy.promotionservice.dto;

import jakarta.validation.constraints.*;
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
public class CreatePromotionRequest {

    @NotBlank(message = "Promotion code is required")
    @Size(min = 3, max = 50, message = "Code must be 3-50 characters")
    private String code;

    @NotBlank(message = "Title is required")
    @Size(max = 200)
    private String title;

    @Size(max = 500)
    private String description;

    @NotBlank(message = "Type is required")
    private String type;

    @NotBlank(message = "Discount type is required")
    private String discountType;

    @NotNull(message = "Discount value is required")
    @Positive(message = "Discount value must be positive")
    private BigDecimal discountValue;

    @PositiveOrZero(message = "Min order amount must be zero or positive")
    private BigDecimal minOrderAmount;

    @PositiveOrZero(message = "Max discount amount must be zero or positive")
    private BigDecimal maxDiscountAmount;

    @Min(value = 1, message = "Max usage count must be at least 1")
    private int maxUsageCount;

    @Min(value = 1, message = "Max usage per user must be at least 1")
    private int maxUsagePerUser;

    private UUID merchantId;
    private String applicableProductIds;
    private String applicableCategoryIds;

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    private LocalDateTime endDate;
}
