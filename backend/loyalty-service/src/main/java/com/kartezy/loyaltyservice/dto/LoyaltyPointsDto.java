package com.kartezy.loyaltyservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoyaltyPointsDto {
    @NotNull
    private UUID userId;

    @Min(0)
    private int totalPoints;

    @Min(0)
    private int availablePoints;

    @Min(0)
    private int redeemedPoints;

    @Min(0)
    private int expiredPoints;

    @NotBlank
    private String tier;
}
