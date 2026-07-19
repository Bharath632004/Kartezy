package com.kartezy.finance.service;

import com.kartezy.finance.constants.FinanceConstants;
import com.kartezy.finance.entity.FinancialReport;
import com.kartezy.finance.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportService {

    private final FinancialReportRepository reportRepository;
    private final RevenueRecordRepository revenueRepository;
    private final InvoiceRepository invoiceRepository;
    private final MerchantSettlementRepository settlementRepository;
    private final VendorRepository vendorRepository;
    private final AccountRepository accountRepository;
    private final LedgerEntryRepository ledgerEntryRepository;
    private final RevenueService revenueService;

    @Transactional(readOnly = true)
    public FinancialReport generateDashboardSummary() {
        LocalDate today = LocalDate.now();
        LocalDate monthStart = today.withDayOfMonth(1);
        LocalDate lastMonthStart = monthStart.minusMonths(1);
        LocalDate lastMonthEnd = monthStart.minusDays(1);

        BigDecimal currentRevenue = revenueRepository.getRecognizedRevenueBetween(monthStart, today);
        BigDecimal lastMonthRevenue = revenueRepository.getRecognizedRevenueBetween(lastMonthStart, lastMonthEnd);
        BigDecimal totalOutstanding = invoiceRepository.getTotalOutstanding();
        BigDecimal totalVendorOutstanding = vendorRepository.getTotalOutstanding();
        BigDecimal cashBalance = accountRepository.findByAccountCode(FinanceConstants.CASH_ACCOUNT_CODE)
            .map(account -> ledgerEntryRepository.getAccountBalance(account.getId()))
            .orElse(BigDecimal.ZERO);

        FinancialReport report = FinancialReport.builder()
            .reportName("Financial Dashboard Summary")
            .reportType("DASHBOARD")
            .periodStart(monthStart)
            .periodEnd(today)
            .totalRevenue(currentRevenue)
            .status("GENERATED")
            .build();

        return reportRepository.save(report);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardMetrics() {
        LocalDate today = LocalDate.now();
        LocalDate monthStart = today.withDayOfMonth(1);

        Map<String, Object> metrics = new LinkedHashMap<>();
        metrics.put("currentMonthRevenue", revenueRepository.getRecognizedRevenueBetween(monthStart, today));
        metrics.put("totalOutstandingInvoices", invoiceRepository.getTotalOutstanding());
        metrics.put("totalOutstandingVendors", vendorRepository.getTotalOutstanding());
        metrics.put("totalInvoiceCollected", invoiceRepository.getTotalCollected());
        metrics.put("invoiceCountByStatus", getInvoiceStatusCounts());
        metrics.put("settlementCountByStatus", getSettlementStatusCounts());
        return metrics;
    }

    private Map<String, Long> getInvoiceStatusCounts() {
        Map<String, Long> counts = new LinkedHashMap<>();
        for (var status : com.kartezy.finance.constants.InvoiceStatus.values()) {
            counts.put(status.name(), invoiceRepository.countByStatus(status));
        }
        return counts;
    }

    private Map<String, Long> getSettlementStatusCounts() {
        Map<String, Long> counts = new LinkedHashMap<>();
        for (var status : com.kartezy.finance.constants.SettlementStatus.values()) {
            counts.put(status.name(), settlementRepository.countByStatus(status));
        }
        return counts;
    }

    @Transactional(readOnly = true)
    public List<FinancialReport> getRecentReports(String reportType, int limit) {
        return reportRepository.findByReportTypeOrderByPeriodEndDesc(reportType);
    }

    @Transactional(readOnly = true)
    public FinancialReport getReport(Long reportId) {
        return reportRepository.findById(reportId)
            .orElseThrow(() -> new RuntimeException("Report not found: " + reportId));
    }
}
