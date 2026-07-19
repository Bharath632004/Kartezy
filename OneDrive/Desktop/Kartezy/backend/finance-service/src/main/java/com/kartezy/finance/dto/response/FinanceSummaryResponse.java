package com.kartezy.finance.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinanceSummaryResponse {
    private BigDecimal totalRevenue;
    private BigDecimal totalExpenses;
    private BigDecimal netProfit;
    private BigDecimal profitMargin;
    private BigDecimal totalOutstanding;
    private BigDecimal totalPayables;
    private BigDecimal gstPayable;
    private BigDecimal cashBalance;
    private BigDecimal walletBalance;
    private Map<String, Long> invoiceStatusCounts;
    private Map<String, Long> settlementStatusCounts;
}
