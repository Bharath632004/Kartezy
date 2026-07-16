package com.kartezy.userservice.dto;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;
/**
 * Data Transfer Object for Referral entity
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReferralDto {
    private UUID id;
    @NotNull
    private UUID referrerId; // The user who referred
    @NotNull
    private UUID refereeId; // The user who was referred
    @NotBlank
    @Size(max = 20)
    private String referralCode;
    private LocalDateTime referredAt;
    @Builder.Default
    private boolean rewardClaimed = false;
    private Double rewardAmount;
}
