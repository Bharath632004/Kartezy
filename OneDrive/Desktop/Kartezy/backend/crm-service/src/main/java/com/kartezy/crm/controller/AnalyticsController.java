package com.kartezy.crm.controller;

import com.kartezy.crm.service.CampaignAnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/crm/analytics")
@RequiredArgsConstructor
@Tag(name = "Campaign Analytics", description = "Marketing dashboard and campaign performance analytics")
public class AnalyticsController {

    private final CampaignAnalyticsService analyticsService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get marketing dashboard overview")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        Map<String, Object> dashboard = analyticsService.getMarketingDashboard();
        return ResponseEntity.ok(wrapResponse(dashboard, "Dashboard data retrieved"));
    }

    @GetMapping("/campaigns/{campaignId}")
    @Operation(summary = "Get campaign performance metrics")
    public ResponseEntity<Map<String, Object>> getCampaignPerformance(@PathVariable Long campaignId) {
        Map<String, Object> performance = analyticsService.getCampaignPerformance(campaignId);
        return ResponseEntity.ok(wrapResponse(performance, "Campaign performance retrieved"));
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
