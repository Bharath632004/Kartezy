package com.kartezy.forecastingservice.controller;

import com.kartezy.forecastingservice.service.ForecastingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/forecast")
public class ForecastingController {

    @Autowired
    private ForecastingService forecastingService;

    @PostMapping("/demand")
    public ResponseEntity<Map<String, Object>> getDemandForecast(
            @RequestBody Map<String, Object> request) {
        String productId = (String) request.get("productId");
        String storeId = (String) request.get("storeId");
        int daysAhead = (int) request.getOrDefault("daysAhead", 7);
        return ResponseEntity.ok(forecastingService.getDemandForecast(productId, storeId, daysAhead));
    }

    @PostMapping("/sales")
    public ResponseEntity<Map<String, Object>> getSalesForecast(
            @RequestBody Map<String, Object> request) {
        String storeId = (String) request.get("storeId");
        int daysAhead = (int) request.getOrDefault("daysAhead", 30);
        return ResponseEntity.ok(forecastingService.getSalesForecast(storeId, daysAhead));
    }

    @PostMapping("/inventory")
    public ResponseEntity<Map<String, Object>> getInventoryForecast(
            @RequestBody Map<String, Object> request) {
        String productId = (String) request.get("productId");
        String warehouseId = (String) request.get("warehouseId");
        int daysAhead = (int) request.getOrDefault("daysAhead", 14);
        return ResponseEntity.ok(forecastingService.getInventoryForecast(productId, warehouseId, daysAhead));
    }

    @PostMapping("/reorder-point")
    public ResponseEntity<Map<String, Object>> getReorderPoint(
            @RequestBody Map<String, Object> request) {
        String productId = (String) request.get("productId");
        String warehouseId = (String) request.get("warehouseId");
        return ResponseEntity.ok(forecastingService.getReorderPointRecommendation(productId, warehouseId));
    }

    @PostMapping("/stockout-risk")
    public ResponseEntity<Map<String, Object>> getStockoutRisk(
            @RequestBody Map<String, Object> request) {
        String productId = (String) request.get("productId");
        String warehouseId = (String) request.get("warehouseId");
        int daysAhead = (int) request.getOrDefault("daysAhead", 7);
        return ResponseEntity.ok(forecastingService.getStockoutRisk(productId, warehouseId, daysAhead));
    }

    @GetMapping("/seasonal-trends/{productId}")
    public ResponseEntity<Map<String, Object>> getSeasonalTrends(
            @PathVariable String productId,
            @RequestParam(defaultValue = "2") int yearsBack) {
        return ResponseEntity.ok(forecastingService.getSeasonalTrends(productId, yearsBack));
    }

    @GetMapping("/top-products/{storeId}")
    public ResponseEntity<List<Map<String, Object>>> getTopProductsForecast(
            @PathVariable String storeId,
            @RequestParam(defaultValue = "7") int daysAhead,
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(forecastingService.getTopProductsForecast(storeId, daysAhead, limit));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "forecasting-service"));
    }
}
