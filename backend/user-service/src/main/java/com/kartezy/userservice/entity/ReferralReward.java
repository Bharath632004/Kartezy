package com.kartezy.userservice.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Email;
import lombok.*;
import com.kartezy.shared.audit.AuditableEntity;
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
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_profile_id", nullable = false)
    private CustomerProfile customerProfile;
    @Column(name = "total_referrals")
    @Builder.Default
    private int totalReferrals = 0;
    @Column(name = "successful_referrals")
    @Builder.Default
    private int successfulReferrals = 0;
    @Column(name = "pending_referrals")
    @Builder.Default
    private int pendingReferrals = 0;
    @Column(name = "total_earned")
    @Builder.Default
    private Double totalEarned = 0.0;
    @Column(name = "total_redeemed")
    @Builder.Default
    private Double totalRedeemed = 0.0;
    @Column(name = "available_balance")
    @Builder.Default
    private Double availableBalance = 0.0;
}
