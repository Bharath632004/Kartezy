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
public class WalletDto {
    private UUID id;
    private UUID userId;
    private String walletType;
    private BigDecimal balance;
    private BigDecimal totalDeposited;
    private BigDecimal totalWithdrawn;
    private BigDecimal totalSpent;
    private BigDecimal cashbackEarned;
    private Boolean isActive;
    private Boolean isBlocked;
    private Long transactionCount;
    private LocalDateTime createdAt;
}
