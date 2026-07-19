package com.kartezy.crm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Table(name = "loyalty_transactions", indexes = {
    @Index(name = "idx_lt_customer", columnList = "customerId"),
    @Index(name = "idx_lt_type", columnList = "transactionType"),
    @Index(name = "idx_lt_expiry", columnList = "expiryDate"),
    @Index(name = "idx_lt_order", columnList = "orderId")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class LoyaltyTransaction extends BaseCrmEntity {

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "transaction_type", nullable = false, length = 30)
    private String transactionType;

    @Column(name = "points")
    private Integer points;

    @Column(name = "balance_before")
    private Integer balanceBefore;

    @Column(name = "balance_after")
    private Integer balanceAfter;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "referral_id")
    private Long referralId;

    @Column(name = "campaign_id")
    private Long campaignId;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "status", length = 30)
    private String status;
}
