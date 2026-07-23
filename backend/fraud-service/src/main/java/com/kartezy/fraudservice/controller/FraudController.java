package com.kartezy.fraudservice.controller;

import com.kartezy.fraudservice.dto.FraudCheckRequest;
import com.kartezy.fraudservice.dto.FraudCheckResponse;
import com.kartezy.fraudservice.entity.FraudAlert;
import com.kartezy.fraudservice.service.FraudService;
import com.kartezy.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/fraud")
@RequiredArgsConstructor
public class FraudController {

    private final FraudService fraudService;

    @PostMapping("/check")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<FraudCheckResponse>> checkOrder(@RequestBody FraudCheckRequest request) {
        return ResponseEntity.ok(ApiResponse.success(fraudService.checkOrder(request)));
    }

    @GetMapping("/alerts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<FraudAlert>>> getOpenAlerts() {
        return ResponseEntity.ok(ApiResponse.success(fraudService.getOpenAlerts()));
    }

    @PostMapping("/alerts/{alertId}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> resolveAlert(
            @PathVariable UUID alertId,
            @RequestParam String resolution,
            @RequestParam String resolvedBy) {
        fraudService.resolveAlert(alertId, resolution, resolvedBy);
        return ResponseEntity.ok(ApiResponse.success(null, "Alert resolved"));
    }
}
