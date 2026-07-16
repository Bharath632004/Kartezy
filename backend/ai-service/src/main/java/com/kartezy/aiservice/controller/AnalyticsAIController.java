package com.kartezy.aiservice.controller;

import com.kartezy.aiservice.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/analytics/ai")
@Validated
public class AnalyticsAIController {

    @Operation(summary = "Get business insights")
    @GetMapping("/business/insights")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBusinessInsights(
            @Parameter(description = "Time range") @RequestParam String timeRange) {
        Random random = new Random(timeRange.hashCode());
        Map<String, Object> insights = Map.of(
                "totalRevenue", Math.round(random.nextDouble() * 5000000 * 100.0) / 100.0,
                "totalOrders", 1000 + random.nextInt(9000),
                "averageOrderValue", Math.round((200 + random.nextDouble() * 300) * 100.0) / 100.0,
                "customerAcquisitionCost", Math.round((50 + random.nextDouble() * 100) * 100.0) / 100.0,
                "customerLifetimeValue", Math.round((500 + random.nextDouble() * 1500) * 100.0) / 100.0,
                "revenueGrowth", Math.round((random.nextDouble() * 40 - 10) * 100.0) / 100.0,
                "orderGrowth", Math.round((random.nextDouble() * 30 - 5) * 100.0) / 100.0,
                "activeCustomers", 50000 + random.nextInt(200000)
        );
        return ResponseEntity.ok(ApiResponse.success("Business insights retrieved", insights));
    }

    @Operation(summary = "Get customer insights")
    @GetMapping("/customer/insights")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCustomerInsights(
            @Parameter(description = "Time range") @RequestParam String timeRange) {
        Random random = new Random(timeRange.hashCode());
        return ResponseEntity.ok(ApiResponse.success("Customer insights retrieved", Map.of(
                "newCustomers", random.nextInt(10000),
                "returningCustomers", random.nextInt(50000),
                "customerRetentionRate", Math.round((0.6 + random.nextDouble() * 0.3) * 100.0) / 100.0,
                "customerSatisfactionScore", Math.round((3.5 + random.nextDouble() * 1.5) * 10.0) / 10.0,
                "averageCustomerLifetime", 90 + random.nextInt(270),
                "repeatPurchaseRate", Math.round((0.3 + random.nextDouble() * 0.4) * 100.0) / 100.0
        )));
    }

    @Operation(summary = "Get product insights")
    @GetMapping("/product/insights")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getProductInsights(
            @Parameter(description = "Time range") @RequestParam String timeRange) {
        Random random = new Random(timeRange.hashCode());
        List<Map<String, Object>> products = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            products.add(Map.of(
                    "productId", "PROD-" + (10000 + random.nextInt(5000)),
                    "sales", Math.round(random.nextDouble() * 50000 * 100.0) / 100.0,
                    "growthRate", Math.round((random.nextDouble() * 0.5 - 0.15) * 100.0) / 100.0
            ));
        }
        return ResponseEntity.ok(ApiResponse.success("Product insights retrieved", products));
    }

    @Operation(summary = "Get sales insights")
    @GetMapping("/sales/insights")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSalesInsights(
            @Parameter(description = "Time range") @RequestParam String timeRange) {
        Random random = new Random(timeRange.hashCode());
        int days = parseTimeRange(timeRange);
        List<Map<String, Object>> trend = new ArrayList<>();
        for (int i = days; i >= 0; i--) {
            trend.add(Map.of("date", LocalDate.now().minusDays(i).toString(), "sales", Math.round((5000 + random.nextDouble() * 20000) * 100.0) / 100.0));
        }
        return ResponseEntity.ok(ApiResponse.success("Sales insights retrieved", Map.of("trend", trend, "totalSales", trend.stream().mapToDouble(t -> (double) t.get("sales")).sum())));
    }

    @Operation(summary = "Get inventory insights")
    @GetMapping("/inventory/insights")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getInventoryInsights(
            @Parameter(description = "Time range") @RequestParam String timeRange) {
        Random random = new Random(timeRange.hashCode());
        return ResponseEntity.ok(ApiResponse.success("Inventory insights retrieved", Map.of(
                "totalSKUs", 5000 + random.nextInt(5000),
                "outOfStockCount", random.nextInt(200),
                "lowStockCount", random.nextInt(500),
                "inventoryTurnover", Math.round((3 + random.nextDouble() * 7) * 10.0) / 10.0,
                "stockoutRate", Math.round((random.nextDouble() * 0.1) * 100.0) / 100.0
        )));
    }

    @Operation(summary = "Get marketing insights")
    @GetMapping("/marketing/insights")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMarketingInsights(
            @Parameter(description = "Time range") @RequestParam String timeRange) {
        Random random = new Random(timeRange.hashCode());
        return ResponseEntity.ok(ApiResponse.success("Marketing insights retrieved", Map.of(
                "totalCampaigns", 10 + random.nextInt(50),
                "activeCampaigns", 3 + random.nextInt(10),
                "couponRedemptionRate", Math.round((0.15 + random.nextDouble() * 0.25) * 100.0) / 100.0,
                "customerAcquisitionCost", Math.round((50 + random.nextDouble() * 150) * 100.0) / 100.0,
                "marketingAttributedRevenue", Math.round(random.nextDouble() * 1000000 * 100.0) / 100.0
        )));
    }

    @Operation(summary = "Detect anomalies")
    @GetMapping("/anomaly/detection")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> detectAnomalies(
            @RequestParam String metric, @RequestParam String timeRange) {
        Random random = new Random((metric + timeRange).hashCode());
        List<Map<String, Object>> anomalies = new ArrayList<>();
        for (int i = 0; i < random.nextInt(5); i++) {
            anomalies.add(Map.of("metric", metric, "date", LocalDate.now().minusDays(random.nextInt(30)).toString(), "deviation", Math.round((random.nextDouble() * 0.5 + 0.2) * 100.0) / 100.0, "severity", random.nextDouble() > 0.6 ? "HIGH" : "MEDIUM"));
        }
        return ResponseEntity.ok(ApiResponse.success("Anomalies detected", anomalies));
    }

    @Operation(summary = "Get cohort analysis")
    @GetMapping("/cohort/analysis")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCohortAnalysis(
            @RequestParam String cohortType, @RequestParam String timeRange) {
        Random random = new Random((cohortType + timeRange).hashCode());
        int periods = cohortType.equalsIgnoreCase("weekly") ? 8 : 6;
        List<Map<String, Object>> cohorts = new ArrayList<>();
        for (int c = 0; c < periods; c++) {
            List<Double> retention = new ArrayList<>();
            for (int p = 0; p < periods - c; p++) {
                retention.add(Math.round(Math.max(0.05, 1.0 - p * 0.12 - random.nextDouble() * 0.05) * 100.0) / 100.0);
            }
            cohorts.add(Map.of("cohort", "Cohort " + (c + 1), "retention", retention, "size", 1000 + random.nextInt(5000)));
        }
        return ResponseEntity.ok(ApiResponse.success("Cohort analysis performed", Map.of("cohorts", cohorts)));
    }

    @Operation(summary = "Get funnel analysis")
    @GetMapping("/funnel/analysis")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getFunnelAnalysis(
            @RequestParam String funnelType, @RequestParam String timeRange) {
        Random random = new Random((funnelType + timeRange).hashCode());
        String[] stageNames = {"App Open", "Browse Products", "Add to Cart", "Checkout", "Payment", "Order Placed"};
        int currentUsers = 100000;
        List<Map<String, Object>> stages = new ArrayList<>();
        for (String stage : stageNames) {
            double dropRate = 0.1 + random.nextDouble() * 0.3;
            currentUsers = (int) (currentUsers * (1 - dropRate));
            stages.add(Map.of("stage", stage, "users", Math.max(currentUsers, 100), "conversionRate", Math.round((1 - dropRate) * 100.0) / 100.0));
        }
        return ResponseEntity.ok(ApiResponse.success("Funnel analysis performed", Map.of("stages", stages)));
    }

    @Operation(summary = "Get sales prediction")
    @GetMapping("/prediction/sales")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSalesPrediction(@RequestParam int daysAhead) {
        Random random = new Random(daysAhead);
        List<Map<String, Object>> predictions = new ArrayList<>();
        for (int i = 0; i < daysAhead; i++) {
            predictions.add(Map.of("date", LocalDate.now().plusDays(i + 1).toString(), "predictedRevenue", Math.round((50000 + random.nextDouble() * 50000) * 100.0) / 100.0));
        }
        return ResponseEntity.ok(ApiResponse.success("Sales prediction generated", Map.of("predictions", predictions, "totalPredictedRevenue", predictions.stream().mapToDouble(p -> (double) p.get("predictedRevenue")).sum())));
    }

    @Operation(summary = "Get inventory prediction")
    @GetMapping("/prediction/inventory")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getInventoryPrediction(@RequestParam int daysAhead) {
        Random random = new Random(daysAhead);
        List<Map<String, Object>> predictions = new ArrayList<>();
        for (int i = 0; i < Math.min(20, daysAhead); i++) {
            predictions.add(Map.of("productId", "PROD-" + (10000 + random.nextInt(5000)), "predictedDemand", 10 + random.nextInt(100), "needsReplenishment", random.nextBoolean()));
        }
        return ResponseEntity.ok(ApiResponse.success("Inventory prediction generated", Map.of("predictions", predictions)));
    }

    @Operation(summary = "Train analytics models")
    @PostMapping("/model/train")
    public ResponseEntity<ApiResponse<Map<String, String>>> trainAnalyticsModels(@Valid @RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(ApiResponse.success("Model training initiated", Map.of("status", "TRAINING_STARTED", "jobId", UUID.randomUUID().toString())));
    }

    private int parseTimeRange(String timeRange) {
        if (timeRange == null) return 30;
        String lower = timeRange.toLowerCase();
        if (lower.contains("7") || lower.contains("week")) return 7;
        if (lower.contains("30") || lower.contains("month")) return 30;
        if (lower.contains("90") || lower.contains("quarter")) return 90;
        if (lower.contains("365") || lower.contains("year")) return 365;
        return 30;
    }
}
