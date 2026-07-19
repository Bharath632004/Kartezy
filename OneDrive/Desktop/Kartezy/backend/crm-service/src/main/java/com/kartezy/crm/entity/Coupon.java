package com.kartezy.crm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons", indexes = {
    @Index(name = "idx_coup_code", columnList = "code", unique = true),
    @Index(name = "idx_coup_customer", columnList = "customerId"),
    @Index(name = "idx_coup_status", columnList = "status"),
    @Index(name = "idx_coup_expiry", columnList = "expiryDate")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Coupon extends BaseCrmEntity {

    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "coupon_type", length = 30)
    private String couponType;

    @Column(name = "discount_type", length = 30)
    private String discountType;

    @Column(name = "discount_value", precision = 20, scale = 4)
    private BigDecimal discountValue;

    @Column(name = "max_discount", precision = 20, scale = 4)
    private BigDecimal maxDiscount;

    @Column(name = "min_order_value", precision = 20, scale = 4)
    private BigDecimal minOrderValue;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "customer_name", length = 200)
    private String customerName;

    @Column(name = "campaign_id")
    private Long campaignId;

    @Column(name = "is_public")
    private boolean isPublic;

    @Column(name = "usage_limit")
    private Integer usageLimit;

    @Column(name = "usage_count")
    private Integer usageCount;

    @Column(name = "max_uses_per_customer")
    private Integer maxUsesPerCustomer;

    @Column(name = "status", length = 30)
    private String status;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "applicable_categories", length = 500)
    private String applicableCategories;

    @Column(name = "applicable_merchants", length = 500)
    private String applicableMerchants;

    @Column(name = "first_order_only")
    private boolean firstOrderOnly;

    @Column(name = "used_at")
    private LocalDateTime usedAt;

    @Column(name = "used_order_id")
    private Long usedOrderId;

    @Column(name = "notes", length = 1000)
    private String notes;
}
