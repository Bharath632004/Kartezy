package com.kartezy.finance.controller;

import com.kartezy.finance.entity.FinancialReport;
import com.kartezy.finance.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/finance/reports")
@RequiredArgsConstructor
@Tag(name = "Finance Reports", description = "Dashboard, financial reports, and analytics")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get dashboard summary metrics")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        Map<String, Object> metrics = reportService.getDashboardMetrics();
        return ResponseEntity.ok(wrapResponse(metrics, "Dashboard metrics retrieved"));
    }

    @GetMapping("/recent/{reportType}")
    @Operation(summary = "Get recent reports by type")
    public ResponseEntity<Map<String, Object>> getRecentReports(@PathVariable String reportType) {
        List<FinancialReport> reports = reportService.getRecentReports(reportType, 10);
        return ResponseEntity.ok(wrapResponse(reports, "Recent reports retrieved"));
    }

    @GetMapping("/{reportId}")
    @Operation(summary = "Get report by ID")
    public ResponseEntity<Map<String, Object>> getReport(@PathVariable Long reportId) {
        FinancialReport report = reportService.getReport(reportId);
        return ResponseEntity.ok(wrapResponse(report, "Report retrieved"));
    }

    private Map<String, Object> wrapResponse(Object data, String message) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("data", data);
        response.put("message", message);
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return response;
    }
}
