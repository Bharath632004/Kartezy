package com.kartezy.crm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "loyalty_programs", indexes = {
    @Index(name = "idx_lp_status", columnList = "isActive")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class LoyaltyProgram extends BaseCrmEntity {

    @Column(name = "program_name", nullable = false, length = 200)
    private String programName;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "points_per_rupee")
    private Integer pointsPerRupee;

    @Column(name = "minimum_points_redeem")
    private Integer minimumPointsRedeem;

    @Column(name = "points_value", precision = 20, scale = 4)
    private BigDecimal pointsValue;

    @Column(name = "points_expiry_days")
    private Integer pointsExpiryDays;

    @Column(name = "signup_bonus_points")
    private Integer signupBonusPoints;

    @Column(name = "birthday_bonus_points")
    private Integer birthdayBonusPoints;

    @Column(name = "tier_name_silver", length = 100)
    private String tierNameSilver;

    @Column(name = "tier_threshold_silver")
    private Integer tierThresholdSilver;

    @Column(name = "tier_name_gold", length = 100)
    private String tierNameGold;

    @Column(name = "tier_threshold_gold")
    private Integer tierThresholdGold;

    @Column(name = "tier_name_platinum", length = 100)
    private String tierNamePlatinum;

    @Column(name = "tier_threshold_platinum")
    private Integer tierThresholdPlatinum;

    @Column(name = "effective_from")
    private LocalDate effectiveFrom;

    @Column(name = "effective_to")
    private LocalDate effectiveTo;
}
