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
    @Builder.Default
    private Long totalReferrals = 0L;
    @Builder.Default
    private Double totalRewardAmount = 0.0;
    @Builder.Default
    private Double availableBalance = 0.0;
    @Builder.Default
    private Double totalWithdrawn = 0.0;
}
