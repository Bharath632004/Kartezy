package com.kartezy.crm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "merchant_profiles", indexes = {
    @Index(name = "idx_mp_merchant", columnList = "merchantId", unique = true),
    @Index(name = "idx_mp_email", columnList = "email"),
    @Index(name = "idx_mp_status", columnList = "status")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class MerchantProfile extends BaseCrmEntity {

    @Column(name = "merchant_id", nullable = false, unique = true)
    private Long merchantId;

    @Column(name = "business_name", length = 200)
    private String businessName;

    @Column(name = "owner_name", length = 200)
    private String ownerName;

    @Column(name = "email", length = 200)
    private String email;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "business_category", length = 100)
    private String businessCategory;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "total_orders")
    private Integer totalOrders;

    @Column(name = "total_revenue", precision = 20, scale = 4)
    private BigDecimal totalRevenue;

    @Column(name = "commission_paid", precision = 20, scale = 4)
    private BigDecimal commissionPaid;

    @Column(name = "avg_rating")
    private Double avgRating;

    @Column(name = "status", length = 30)
    private String status;

    @Column(name = "tier", length = 30)
    private String tier;

    @Column(name = "last_activity_date")
    private LocalDateTime lastActivityDate;

    @Column(name = "account_manager", length = 200)
    private String accountManager;

    @Column(name = "notes", length = 2000)
    private String notes;

    @Column(name = "tags", length = 500)
    private String tags;
}
