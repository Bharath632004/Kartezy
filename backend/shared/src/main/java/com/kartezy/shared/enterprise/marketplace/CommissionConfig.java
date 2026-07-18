package com.kartezy.shared.enterprise.marketplace;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Commission management for marketplace operations.
 * Supports multiple commission models: flat, percentage, tiered, category-based.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommissionConfig {

    private String configId;
    private String vendorId;
    private String categoryId;
    private CommissionType type;
    private BigDecimal value; // Percentage or flat amount
    private BigDecimal cap; // Maximum commission
    private BigDecimal minimumCommission;
    private boolean isActive;
    private ZonedDateTime effectiveFrom;
    private ZonedDateTime effectiveTo;

    public enum CommissionType {
        PERCENTAGE, FLAT, TIERED, CATEGORY_BASED, SLAB_BASED
    }

    /**
     * Calculate commission for an order item.
     */
    public BigDecimal calculate(BigDecimal itemPrice, int quantity) {
        BigDecimal totalAmount = itemPrice.multiply(BigDecimal.valueOf(quantity));

        return switch (type) {
            case PERCENTAGE -> {
                BigDecimal commission = totalAmount.multiply(value).divide(BigDecimal.valueOf(100));
                if (cap != null && commission.compareTo(cap) > 0) {
                    yield cap;
                }
                yield commission;
            }
            case FLAT -> value;
            case TIERED -> {
                // Tiered commission based on volume
                if (totalAmount.compareTo(BigDecimal.valueOf(1000)) > 0) {
                    yield totalAmount.multiply(BigDecimal.valueOf(5)).divide(BigDecimal.valueOf(100)); // 5%
                } else if (totalAmount.compareTo(BigDecimal.valueOf(500)) > 0) {
                    yield totalAmount.multiply(BigDecimal.valueOf(8)).divide(BigDecimal.valueOf(100)); // 8%
                } else {
                    yield totalAmount.multiply(BigDecimal.valueOf(10)).divide(BigDecimal.valueOf(100)); // 10%
                }
            }
            default -> BigDecimal.ZERO;
        };
    }

    public record OrderItemCommission(
            String orderItemId,
            String vendorId,
            BigDecimal itemPrice,
            int quantity,
            BigDecimal commissionAmount,
            CommissionType commissionType
    ) {}
}
