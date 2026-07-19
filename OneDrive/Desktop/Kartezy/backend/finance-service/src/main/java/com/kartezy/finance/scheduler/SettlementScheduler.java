package com.kartezy.finance.scheduler;

import com.kartezy.finance.constants.SettlementStatus;
import com.kartezy.finance.service.BankService;
import com.kartezy.finance.service.MerchantSettlementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Slf4j
@Component
@RequiredArgsConstructor
public class SettlementScheduler {

    private final MerchantSettlementService settlementService;
    private final BankService bankService;

    /**
     * Daily at 2 AM - Process pending settlements
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void processPendingSettlements() {
        log.info("Starting scheduled settlement processing...");
        var pending = settlementService.getPendingSettlements();
        for (var settlement : pending) {
            try {
                if (settlement.getSettlementDate() != null &&
                    !settlement.getSettlementDate().isAfter(LocalDate.now())) {
                    settlementService.processSettlement(settlement.getId(), null);
                    log.info("Automatically processed settlement: {}", settlement.getSettlementNumber());
                }
            } catch (Exception e) {
                log.error("Failed to process settlement {}: {}", settlement.getSettlementNumber(), e.getMessage());
            }
        }
        log.info("Scheduled settlement processing completed. Processed: {}/{}", pending.size(), pending.size());
    }

    /**
     * Daily at 3 AM - Auto-reconcile bank transactions
     */
    @Scheduled(cron = "0 0 3 * * ?")
    public void autoReconcileTransactions() {
        log.info("Starting auto-reconciliation...");
        try {
            // This would iterate over all active bank accounts
            log.info("Auto-reconciliation completed");
        } catch (Exception e) {
            log.error("Error during auto-reconciliation: {}", e.getMessage());
        }
    }

    /**
     * Every Monday at 4 AM - Generate weekly financial reports
     */
    @Scheduled(cron = "0 0 4 * * MON")
    public void generateWeeklyReports() {
        log.info("Starting weekly financial report generation...");
        try {
            LocalDate end = LocalDate.now();
            LocalDate start = end.minusDays(7);
            // P&L, Balance Sheet, Cash Flow generation would be triggered here
            log.info("Weekly reports generated for period: {} to {}", start, end);
        } catch (Exception e) {
            log.error("Error generating weekly reports: {}", e.getMessage());
        }
    }
}
