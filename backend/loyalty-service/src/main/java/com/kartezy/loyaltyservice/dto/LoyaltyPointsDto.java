package com.kartezy.loyaltyservice.dto;

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
    private UUID userId;
    private int totalPoints;
    private int availablePoints;
    private int redeemedPoints;
    private int expiredPoints;
    private String tier;
}
