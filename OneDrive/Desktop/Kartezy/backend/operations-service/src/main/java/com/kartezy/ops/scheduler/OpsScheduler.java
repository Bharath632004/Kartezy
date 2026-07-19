package com.kartezy.ops.scheduler;

import com.kartezy.ops.service.OpsDashboardService;
import com.kartezy.ops.service.SLAService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class OpsScheduler {

    private final SLAService slaService;
    private final OpsDashboardService opsDashboardService;

    /**
     * Every 15 minutes - Check SLA records and mark breaches
     */
    @Scheduled(cron = "0 */15 * * * ?")
    public void checkSlaBreaches() {
        log.info("Starting SLA breach check...");
        try {
            int breached = slaService.checkAndUpdateSlaStatus();
            log.info("SLA breach check completed. New breaches: {}", breached);
        } catch (Exception e) {
            log.error("SLA breach check failed: {}", e.getMessage());
        }
    }

    /**
     * Daily at midnight - Snapshot dashboard metrics
     */
    @Scheduled(cron = "0 0 0 * * ?")
    public void snapshotDashboardMetrics() {
        log.info("Starting daily dashboard snapshot...");
        try {
            opsDashboardService.snapshotDailyMetrics();
            log.info("Daily dashboard snapshot completed");
        } catch (Exception e) {
            log.error("Dashboard snapshot failed: {}", e.getMessage());
        }
    }

    /**
     * Every hour - Log ops health summary
     */
    @Scheduled(cron = "0 0 * * * ?")
    public void logOpsHealthSummary() {
        log.info("Operations health check running...");
        // Just logging - metrics are available via the dashboard API
        log.info("Operations health check completed");
    }
}
