package com.kartezy.financeservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDto {
    private UUID id;

    @NotBlank @Size(max = 50)
    private String transactionNumber;

    @NotBlank @Size(max = 50)
    private String transactionType;

    @NotNull @Positive
    private BigDecimal amount;

    @Size(max = 10)
    private String currency;

    @NotBlank
    private String status;

    @NotNull
    private UUID userId;

    private UUID merchantId;

    private UUID orderId;

    private UUID referenceId;

    private String referenceType;

    @Size(max = 500)
    private String description;

    private LocalDateTime createdAt;

    private LocalDateTime completedAt;
}
