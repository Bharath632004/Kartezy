package com.kartezy.finance.entity;

import com.kartezy.finance.constants.CommissionType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "commission_rules", indexes = {
    @Index(name = "idx_cr_merchant", columnList = "merchantId"),
    @Index(name = "idx_cr_category", columnList = "categoryId")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class CommissionRule extends BaseEntity {

    @Column(name = "rule_name", nullable = false, length = 200)
    private String ruleName;

    @Column(name = "description", length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "commission_type", nullable = false, length = 30)
    private CommissionType commissionType;

    @Column(name = "merchant_id")
    private Long merchantId;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "sub_category_id")
    private Long subCategoryId;

    @Column(name = "fixed_amount", precision = 20, scale = 4)
    private BigDecimal fixedAmount;

    @Column(name = "percentage", precision = 10, scale = 4)
    private BigDecimal percentage;

    @Column(name = "min_amount", precision = 20, scale = 4)
    private BigDecimal minAmount;

    @Column(name = "max_amount", precision = 20, scale = 4)
    private BigDecimal maxAmount;

    @Column(name = "tier_from", precision = 20, scale = 4)
    private BigDecimal tierFrom;

    @Column(name = "tier_to", precision = 20, scale = 4)
    private BigDecimal tierTo;

    @Column(name = "priority")
    private Integer priority;

    @Column(name = "effective_from")
    private LocalDate effectiveFrom;

    @Column(name = "effective_to")
    private LocalDate effectiveTo;

    @Column(name = "is_active")
    private boolean isActive;

    @Column(name = "apply_on", length = 30)
    private String applyOn;

    @Column(name = "status", length = 20)
    private String status;
}
