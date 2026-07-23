package com.kartezy.analyticsservice.controller;

import com.kartezy.analyticsservice.dto.AnalyticsEventDto;
import com.kartezy.analyticsservice.dto.DashboardMetricsDto;
import com.kartezy.analyticsservice.service.AnalyticsService;
import com.kartezy.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @PostMapping("/events")
    public ResponseEntity<ApiResponse<Void>> trackEvent(@RequestBody AnalyticsEventDto event) {
        analyticsService.trackEvent(event);
        return ResponseEntity.ok(ApiResponse.success(null, "Event tracked"));
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DashboardMetricsDto>> getDashboardMetrics(
            @RequestParam(required = false) LocalDateTime start,
            @RequestParam(required = false) LocalDateTime end) {
        if (start == null) start = LocalDateTime.now().minusDays(7);
        if (end == null) end = LocalDateTime.now();
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getDashboardMetrics(start, end)));
    }
}
