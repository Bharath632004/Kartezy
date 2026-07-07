package com.kartezy.userservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

/**
 * Referral reward entity for storing rewards earned by users from referrals.
 */
@Entity
@Table(name = "referral_rewards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReferralReward extends AuditableEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_profile_id", nullable = false)
    private CustomerProfile customerProfile;

    @Column(name = "total_referrals")
    private int totalReferrals = 0;

    @Column(name = "successful_referrals")
    private int successfulReferrals = 0;

    @Column(name = "pending_referrals")
    private int pendingReferrals = 0;

    @Column(name = "total_earned")
    private Double totalEarned = 0.0;

    @Column(name = "total_redeemed")
    private Double totalRedeemed = 0.0;

    @Column(name = "available_balance")
    private Double availableBalance = 0.0;
}
