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
@Table(name = "referrals", indexes = {
    @Index(name = "idx_ref_referrer", columnList = "referrerId"),
    @Index(name = "idx_ref_referee", columnList = "refereeId"),
    @Index(name = "idx_ref_code", columnList = "referralCode"),
    @Index(name = "idx_ref_status", columnList = "status")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Referral extends BaseCrmEntity {

    @Column(name = "referrer_id", nullable = false)
    private Long referrerId;

    @Column(name = "referrer_name", length = 200)
    private String referrerName;

    @Column(name = "referee_id")
    private Long refereeId;

    @Column(name = "referee_name", length = 200)
    private String refereeName;

    @Column(name = "referee_email", length = 200)
    private String refereeEmail;

    @Column(name = "referee_phone", length = 20)
    private String refereePhone;

    @Column(name = "referral_code", length = 50)
    private String referralCode;

    @Column(name = "status", length = 30)
    private String status;

    @Column(name = "reward_type", length = 30)
    private String rewardType;

    @Column(name = "reward_amount", precision = 20, scale = 4)
    private BigDecimal rewardAmount;

    @Column(name = "reward_claimed")
    private boolean rewardClaimed;

    @Column(name = "reward_claimed_at")
    private LocalDateTime rewardClaimedAt;

    @Column(name = "referrer_reward", precision = 20, scale = 4)
    private BigDecimal referrerReward;

    @Column(name = "referee_reward", precision = 20, scale = 4)
    private BigDecimal refereeReward;

    @Column(name = "referrer_points")
    private Integer referrerPoints;

    @Column(name = "referee_points")
    private Integer refereePoints;

    @Column(name = "conversion_order_id")
    private Long conversionOrderId;

    @Column(name = "conversion_at")
    private LocalDateTime conversionAt;

    @Column(name = "notes", length = 1000)
    private String notes;
}
