package com.kartezy.loyaltyservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoyaltyTransactionDto {
    private UUID id;
    private int points;
    private String transactionType;
    private String description;
    private UUID referenceId;
    private String referenceType;
    private LocalDateTime createdAt;
}
