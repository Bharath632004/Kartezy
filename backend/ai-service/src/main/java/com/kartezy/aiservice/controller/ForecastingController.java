package com.kartezy.aiservice.controller;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/forecast")
public class ForecastingController {

    @GetMapping("/demand")
    public Map<String, Object> getDemandForecast(@RequestParam String productId,
                                                 @RequestParam String storeId,
                                                 @RequestParam int daysAhead) {
        return Map.of(
                "productId", productId,
                "storeId", storeId,
                "forecast", List.of(),
                "confidenceIntervals", List.of(),
                "note", "Demand forecasting available via forecasting-service"
        );
    }

    @GetMapping("/demand/top-products")
    public List<Map<String, Object>> getTopProductsForecast(@RequestParam String storeId,
                                                            @RequestParam int daysAhead) {
        return List.of();
    }

    @GetMapping("/demand/category")
    public Map<String, Object> getCategoryDemandForecast(@RequestParam String categoryId,
                                                         @RequestParam String storeId,
                                                         @RequestParam int daysAhead) {
        return Map.of("categoryId", categoryId, "storeId", storeId, "forecast", List.of());
    }

    @GetMapping("/seasonal/trends")
    public Map<String, Object> getSeasonalTrends(@RequestParam String productId,
                                                 @RequestParam int yearsBack) {
        return Map.of("productId", productId, "seasonalIndices", Map.of(), "trendComponent", 0.0);
    }

    @PostMapping("/model/train")
    public Map<String, String> trainForecastModel(@RequestBody Map<String, Object> request) {
        return Map.of("status", "TRAINING_STARTED", "jobId", java.util.UUID.randomUUID().toString());
    }
}
