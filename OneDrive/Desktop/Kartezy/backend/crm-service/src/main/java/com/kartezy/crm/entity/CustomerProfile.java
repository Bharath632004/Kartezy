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
@Table(name = "customer_profiles", indexes = {
    @Index(name = "idx_cp_user", columnList = "userId", unique = true),
    @Index(name = "idx_cp_email", columnList = "email"),
    @Index(name = "idx_cp_phone", columnList = "phone"),
    @Index(name = "idx_cp_city", columnList = "city"),
    @Index(name = "idx_cp_loyalty_tier", columnList = "loyaltyTier")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerProfile extends BaseCrmEntity {

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "first_name", length = 100)
    private String firstName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(name = "email", length = 200)
    private String email;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "gender", length = 20)
    private String gender;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "pincode", length = 10)
    private String pincode;

    @Column(name = "total_orders")
    private Integer totalOrders;

    @Column(name = "total_spent", precision = 20, scale = 4)
    private BigDecimal totalSpent;

    @Column(name = "avg_order_value", precision = 20, scale = 4)
    private BigDecimal avgOrderValue;

    @Column(name = "lifetime_value", precision = 20, scale = 4)
    private BigDecimal lifetimeValue;

    @Column(name = "last_order_date")
    private LocalDateTime lastOrderDate;

    @Column(name = "loyalty_tier", length = 30)
    private String loyaltyTier;

    @Column(name = "loyalty_points")
    private Integer loyaltyPoints;

    @Column(name = "referral_code", length = 50)
    private String referralCode;

    @Column(name = "referred_by")
    private Long referredBy;

    @Column(name = "referral_count")
    private Integer referralCount;

    @Column(name = "email_opt_in")
    private boolean emailOptIn;

    @Column(name = "sms_opt_in")
    private boolean smsOptIn;

    @Column(name = "whatsapp_opt_in")
    private boolean whatsappOptIn;

    @Column(name = "push_opt_in")
    private boolean pushOptIn;

    @Column(name = "app_last_seen")
    private LocalDateTime appLastSeen;

    @Column(name = "notes", length = 2000)
    private String notes;

    @Column(name = "tags", length = 500)
    private String tags;

    @Column(name = "preferred_categories", length = 500)
    private String preferredCategories;

    @Column(name = "preferred_merchants", length = 500)
    private String preferredMerchants;
}
