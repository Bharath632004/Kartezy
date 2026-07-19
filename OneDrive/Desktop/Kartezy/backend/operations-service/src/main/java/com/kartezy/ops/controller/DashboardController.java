package com.kartezy.ops.controller;

import com.kartezy.ops.service.OpsDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ops/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final OpsDashboardService opsDashboardService;

    @GetMapping("/live")
    public ResponseEntity<Map<String, Object>> getLiveDashboard() {
        return ResponseEntity.ok(opsDashboardService.getLiveDashboard());
    }

    @PostMapping("/snapshot")
    public ResponseEntity<Map<String, String>> triggerSnapshot() {
        opsDashboardService.snapshotDailyMetrics();
        return ResponseEntity.ok(Map.of("message", "Dashboard snapshot triggered successfully"));
    }
}
