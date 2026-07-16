package com.kartezy.walletservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WalletTransactionDto {
    private UUID id;
    private UUID walletId;
    private UUID userId;
    private String transactionReference;
    private String transactionType;
    private String category;
    private BigDecimal amount;
    private BigDecimal balanceBefore;
    private BigDecimal balanceAfter;
    private String description;
    private String referenceId;
    private String referenceType;
    private String status;
    private String failureReason;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}
