package com.kartezy.datawarehouse.controller;

import com.kartezy.datawarehouse.service.FinanceAnalyticsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/bi")
public class FinanceController {
    private final FinanceAnalyticsService financeService;

    public FinanceController(FinanceAnalyticsService financeService) {
        this.financeService = financeService;
    }

    @GetMapping("/finance-analytics")
    public Map<String, Object> financeAnalytics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return financeService.getFinanceOverview(start, end);
    }
}
