package com.kartezy.finance.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@Table(name = "commission_calculations", indexes = {
    @Index(name = "idx_cc_order", columnList = "orderId"),
    @Index(name = "idx_cc_merchant", columnList = "merchantId"),
    @Index(name = "idx_cc_rule", columnList = "ruleId")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class CommissionCalculation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rule_id")
    private CommissionRule rule;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "order_number", length = 50)
    private String orderNumber;

    @Column(name = "merchant_id")
    private Long merchantId;

    @Column(name = "merchant_name", length = 200)
    private String merchantName;

    @Column(name = "order_amount", precision = 20, scale = 4)
    private BigDecimal orderAmount;

    @Column(name = "calculated_amount", precision = 20, scale = 4)
    private BigDecimal calculatedAmount;

    @Column(name = "commission_rate", precision = 10, scale = 4)
    private BigDecimal commissionRate;

    @Column(name = "commission_type", length = 30)
    private String commissionType;

    @Column(name = "category_name", length = 100)
    private String categoryName;

    @Column(name = "sub_category_name", length = 100)
    private String subCategoryName;

    @Column(name = "status", length = 30)
    private String status;

    @Column(name = "settlement_id")
    private Long settlementId;

    @Column(name = "is_settled")
    private boolean isSettled;

    @Column(name = "notes", length = 500)
    private String notes;
}
