package com.kartezy.userservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Referral entity for tracking referral relationships between users.
 */
@Entity
@Table(name = "referrals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Referral extends AuditableEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "referrer_id", nullable = false)
    private CustomerProfile referrer; // The user who referred

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "referee_id", nullable = false)
    private CustomerProfile referee; // The user who was referred

    @NotBlank
    @Size(max = 20)
    @Column(name = "referral_code", length = 20, unique = true)
    private String referralCode;

    @Column(name = "referred_at")
    private LocalDateTime referredAt;

    @Column(name = "reward_claimed")
    private boolean rewardClaimed = false;

    @Column(name = "reward_amount")
    private Double rewardAmount;
}
