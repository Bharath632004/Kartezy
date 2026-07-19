package com.kartezy.finance.service;

import com.kartezy.finance.constants.FinanceConstants;
import com.kartezy.finance.entity.FinancialReport;
import com.kartezy.finance.entity.RevenueRecord;
import com.kartezy.finance.exception.FinanceException;
import com.kartezy.finance.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class RevenueService {

    private final RevenueRecordRepository revenueRepository;
    private final FinancialReportRepository reportRepository;
    private final AccountRepository accountRepository;
    private final LedgerEntryRepository ledgerEntryRepository;
    private final CashFlowEntryRepository cashFlowRepository;

    @Transactional
    public RevenueRecord recordRevenue(RevenueRecord record) {
        record.setStatus("RECORDED");
        if (!record.isRecognized()) {
            record.setRecognitionDate(record.getRevenueDate());
            record.setRecognized(true);
        }
        return revenueRepository.save(record);
    }

    @Transactional(readOnly = true)
    public Page<RevenueRecord> getRevenues(LocalDate from, LocalDate to, Pageable pageable) {
        return revenueRepository.findByRevenueDateBetweenOrderByRevenueDateDesc(from, to, pageable);
    }

    @Transactional(readOnly = true)
    public FinancialReport generateProfitAndLoss(LocalDate from, LocalDate to, Long entityId) {
        log.info("Generating P&L report for period: {} to {}", from, to);

        BigDecimal revenue = revenueRepository.getRecognizedRevenueBetween(from, to);
        BigDecimal grossRevenue = revenueRepository.getGrossRevenueBetween(from, to);
        BigDecimal commissionRevenue = revenueRepository.getTotalCommissionBetween(from, to);

        // Get expense accounts for period
        BigDecimal costOfGoodsSold = ledgerEntryRepository.getBalanceUpToDate(
            accountRepository.findByAccountCode("501001").orElseThrow().getId(), to);

        BigDecimal operatingExpenses = ledgerEntryRepository.getBalanceUpToDate(
            accountRepository.findByAccountCode("502001").orElseThrow().getId(), to);

        BigDecimal grossProfit = grossRevenue.subtract(costOfGoodsSold);
        BigDecimal netProfit = grossProfit.subtract(operatingExpenses);

        String reportName = "P&L Statement " + from + " to " + to;

        FinancialReport report = FinancialReport.builder()
            .reportName(reportName)
            .reportType("PROFIT_LOSS")
            .entityId(entityId)
            .entityType(entityId != null ? "MERCHANT" : "PLATFORM")
            .periodStart(from)
            .periodEnd(to)
            .totalRevenue(grossRevenue)
            .totalExpenses(costOfGoodsSold.add(operatingExpenses))
            .grossProfit(grossProfit)
            .netProfit(netProfit)
            .status("GENERATED")
            .build();

        FinancialReport saved = reportRepository.save(report);
        log.info("P&L generated. Revenue: {}, Expenses: {}, Net Profit: {}", grossRevenue, costOfGoodsSold, netProfit);

        return saved;
    }

    @Transactional(readOnly = true)
    public FinancialReport generateBalanceSheet(LocalDate asOfDate) {
        log.info("Generating Balance Sheet as of: {}", asOfDate);

        BigDecimal totalAssets = accountRepository.getAccountBalance(
            accountRepository.findByAccountCode(FinanceConstants.CASH_ACCOUNT_CODE).orElseThrow().getId());
        BigDecimal totalLiabilities = accountRepository.getAccountBalance(
            accountRepository.findByAccountCode(FinanceConstants.PAYABLE_CODE).orElseThrow().getId());
        BigDecimal totalEquity = totalAssets.subtract(totalLiabilities);

        FinancialReport report = FinancialReport.builder()
            .reportName("Balance Sheet as of " + asOfDate)
            .reportType("BALANCE_SHEET")
            .periodStart(asOfDate)
            .periodEnd(asOfDate)
            .totalAssets(totalAssets)
            .totalLiabilities(totalLiabilities)
            .totalEquity(totalEquity)
            .status("GENERATED")
            .build();

        return reportRepository.save(report);
    }

    @Transactional(readOnly = true)
    public FinancialReport generateCashFlowStatement(LocalDate from, LocalDate to) {
        log.info("Generating Cash Flow Statement for period: {} to {}", from, to);

        BigDecimal operatingCashFlow = cashFlowRepository.getNetCashFlowBetween(from, to);

        // Categorize cash flows
        List<Object[]> categoryFlows = cashFlowRepository.getCashFlowByCategory(from, to);

        BigDecimal operatingCF = BigDecimal.ZERO;
        BigDecimal investingCF = BigDecimal.ZERO;
        BigDecimal financingCF = BigDecimal.ZERO;

        for (Object[] row : categoryFlows) {
            String category = (String) row[0];
            BigDecimal inflow = (BigDecimal) row[1];
            BigDecimal outflow = (BigDecimal) row[2];
            BigDecimal net = inflow.subtract(outflow);

            switch (category != null ? category.toLowerCase() : "") {
                case "operating" -> operatingCF = operatingCF.add(net);
                case "investing" -> investingCF = investingCF.add(net);
                case "financing" -> financingCF = financingCF.add(net);
                default -> operatingCF = operatingCF.add(net);
            }
        }

        FinancialReport report = FinancialReport.builder()
            .reportName("Cash Flow Statement " + from + " to " + to)
            .reportType("CASH_FLOW")
            .periodStart(from)
            .periodEnd(to)
            .operatingCashFlow(operatingCF)
            .investingCashFlow(investingCF)
            .financingCashFlow(financingCF)
            .status("GENERATED")
            .build();

        return reportRepository.save(report);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getRevenueBreakdown(LocalDate start, LocalDate end) {
        Map<String, Object> breakdown = new LinkedHashMap<>();
        breakdown.put("totalRevenue", revenueRepository.getGrossRevenueBetween(start, end));
        breakdown.put("recognizedRevenue", revenueRepository.getRecognizedRevenueBetween(start, end));
        breakdown.put("commissionRevenue", revenueRepository.getTotalCommissionBetween(start, end));

        List<Object[]> byType = revenueRepository.getRevenueBreakdown(start, end);
        Map<String, BigDecimal> typeMap = new LinkedHashMap<>();
        for (Object[] row : byType) {
            typeMap.put((String) row[0], (BigDecimal) row[1]);
        }
        breakdown.put("byType", typeMap);

        return breakdown;
    }
}
