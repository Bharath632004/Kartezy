package com.kartezy.userservice.dto;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.UUID;
/**
 * Data Transfer Object for LoyaltyPoints entity
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoyaltyPointsDto {
    private UUID id;
    @NotNull
    private UUID customerProfileId;
    @Builder.Default
    private Long currentPoints = 0L;
    @Builder.Default
    private Long totalEarned = 0L;
    @Builder.Default
    private Long totalRedeemed = 0L;
    @NotBlank
    @Size(max = 20)
    private String tier; // BRONZE, SILVER, GOLD, PLATINUM
}
