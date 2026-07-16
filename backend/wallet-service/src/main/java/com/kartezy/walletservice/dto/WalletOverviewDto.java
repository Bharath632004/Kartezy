package com.kartezy.walletservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WalletOverviewDto {
    private long totalWallets;
    private long activeWallets;
    private long blockedWallets;
    private BigDecimal totalBalance;
    private BigDecimal totalDeposited;
    private BigDecimal totalWithdrawn;
    private BigDecimal totalSpent;
    private long pendingTransactions;
}
