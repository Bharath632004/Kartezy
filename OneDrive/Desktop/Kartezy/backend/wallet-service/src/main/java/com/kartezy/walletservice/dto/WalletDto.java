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

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class WalletTransactionDto {
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

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class WalletTopUpRequestDto {
    private UUID userId;
    private BigDecimal amount;
    private String paymentMethod;
    private String description;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class WalletWithdrawRequestDto {
    private UUID userId;
    private BigDecimal amount;
    private String bankAccountNumber;
    private String bankIfscCode;
    private String description;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class WalletTransferRequestDto {
    private UUID fromUserId;
    private UUID toUserId;
    private BigDecimal amount;
    private String description;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class WalletOverviewDto {
    private long totalWallets;
    private long activeWallets;
    private long blockedWallets;
    private BigDecimal totalBalance;
    private BigDecimal totalDeposited;
    private BigDecimal totalWithdrawn;
    private BigDecimal totalSpent;
    private long pendingTransactions;
}
