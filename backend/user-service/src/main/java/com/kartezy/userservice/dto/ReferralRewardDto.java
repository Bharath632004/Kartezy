package com.kartezy.userservice.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.util.UUID;

/**
 * Data Transfer Object for ReferralReward entity
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReferralRewardDto {

    private UUID id;

    @NotNull
    private UUID customerProfileId;

    private Long totalReferrals = 0L;

    private Double totalRewardAmount = 0.0;

    private Double availableBalance = 0.0;

    private Double totalWithdrawn = 0.0;
}
