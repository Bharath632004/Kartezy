package com.kartezy.forecastingservice.controller;

import com.kartezy.forecastingservice.service.ForecastingService;
import com.kartezy.shared.ai.ForecastingModels.*;
import com.kartezy.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/forecasts")
@Tag(name = "Forecasting API", description = "AI-powered demand and inventory forecasting")
public class ForecastController {

    private final ForecastingService forecastingService;

    public ForecastController(ForecastingService forecastingService) {
        this.forecastingService = forecastingService;
    }

    @Operation(summary = "Get demand forecast for a product")
    @PostMapping("/demand")
    public ResponseEntity<ApiResponse<ForecastResult>> getDemandForecast(@RequestBody ForecastRequest request) {
        ForecastResult result = forecastingService.forecastDemand(request);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @Operation(summary = "Get reorder point recommendation")
    @GetMapping("/reorder-point")
    public ResponseEntity<ApiResponse<ReorderPoint>> getReorderPoint(
            @RequestParam String productId,
            @RequestParam String warehouseId,
            @RequestParam(required = false, defaultValue = "7") int leadTimeDays,
            @RequestParam(required = false, defaultValue = "0.95") double serviceLevel) {
        ReorderPoint rp = forecastingService.calculateReorderPoint(productId, warehouseId, null, leadTimeDays, serviceLevel);
        return ResponseEntity.ok(ApiResponse.success(rp));
    }

    @Operation(summary = "Get seasonal analysis")
    @GetMapping("/seasonal/{productId}")
    public ResponseEntity<ApiResponse<SeasonalTrend>> getSeasonalTrend(@PathVariable String productId) {
        SeasonalTrend trend = forecastingService.analyzeSeasonality(productId, null);
        return ResponseEntity.ok(ApiResponse.success(trend));
    }

    @Operation(summary = "Get inventory health")
    @GetMapping("/inventory-health")
    public ResponseEntity<ApiResponse<InventoryHealth>> getInventoryHealth(
            @RequestParam String productId,
            @RequestParam int currentStock) {
        InventoryHealth health = forecastingService.analyzeInventoryHealth(productId, currentStock, null, null);
        return ResponseEntity.ok(ApiResponse.success(health));
    }

    @Operation(summary = "Record data point for forecasting")
    @PostMapping("/data-points")
    public ResponseEntity<ApiResponse<Map<String, String>>> recordDataPoint(
            @RequestParam String productId,
            @RequestParam String storeId,
            @RequestParam double value) {
        forecastingService.recordDataPoint(productId, storeId, value);
        return ResponseEntity.ok(ApiResponse.success(Map.of("status", "recorded")));
    }
}
