package com.kartezy.loyaltyservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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

    @NotBlank @Size(max = 50)
    private String transactionType;

    @Size(max = 500)
    private String description;

    private UUID referenceId;

    private String referenceType;

    private LocalDateTime createdAt;
}
