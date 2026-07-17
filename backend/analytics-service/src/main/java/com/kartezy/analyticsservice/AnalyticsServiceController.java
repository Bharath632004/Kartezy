package com.kartezy.analyticsservice;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.kartezy.analyticsservice.service.AnalyticsAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/analytics")
public class AnalyticsServiceController {

    @Autowired
    private AnalyticsAiService analyticsAiService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/")
    public String home() {
        return "Kartezy Analytics Service - AI Powered";
    }

    @GetMapping("/health")
    public String health() {
        return "analytics-service is healthy";
    }

    @PostMapping("/insights/business")
    public ResponseEntity<Map<String, Object>> getBusinessInsights(
            @RequestParam(required = false) String parameters) {
        Map<String, Object> params = parseParams(parameters);
        String timeRange = (String) params.getOrDefault("timeRange", "last_30_days");
        return ResponseEntity.ok(analyticsAiService.getBusinessInsights(timeRange));
    }

    @PostMapping("/insights/customer")
    public ResponseEntity<Map<String, Object>> getCustomerInsights(
            @RequestParam(required = false) String parameters) {
        Map<String, Object> params = parseParams(parameters);
        String timeRange = (String) params.getOrDefault("timeRange", "last_30_days");
        return ResponseEntity.ok(analyticsAiService.getCustomerInsights(timeRange));
    }

    @PostMapping("/insights/merchant")
    public ResponseEntity<Map<String, Object>> getMerchantInsights(
            @RequestParam(required = false) String parameters) {
        Map<String, Object> params = parseParams(parameters);
        String merchantId = (String) params.getOrDefault("merchantId", "default");
        String timeRange = (String) params.getOrDefault("timeRange", "last_30_days");
        return ResponseEntity.ok(analyticsAiService.getMerchantInsights(merchantId, timeRange));
    }

    @PostMapping("/insights/delivery")
    public ResponseEntity<Map<String, Object>> getDeliveryInsights(
            @RequestParam(required = false) String parameters) {
        Map<String, Object> params = parseParams(parameters);
        String timeRange = (String) params.getOrDefault("timeRange", "last_30_days");
        return ResponseEntity.ok(analyticsAiService.getDeliveryInsights(timeRange));
    }

    @PostMapping("/insights/marketing")
    public ResponseEntity<Map<String, Object>> getMarketingInsights(
            @RequestParam(required = false) String parameters) {
        Map<String, Object> params = parseParams(parameters);
        String timeRange = (String) params.getOrDefault("timeRange", "last_30_days");
        return ResponseEntity.ok(analyticsAiService.getMarketingInsights(timeRange));
    }

    @PostMapping("/insights/operational")
    public ResponseEntity<Map<String, Object>> getOperationalInsights(
            @RequestParam(required = false) String parameters) {
        Map<String, Object> params = parseParams(parameters);
        String timeRange = (String) params.getOrDefault("timeRange", "last_30_days");
        return ResponseEntity.ok(analyticsAiService.getOperationalInsights(timeRange));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(analyticsAiService.getDashboardSummary());
    }

    @GetMapping("/predictions")
    public ResponseEntity<Map<String, Object>> getPredictiveInsights() {
        return ResponseEntity.ok(analyticsAiService.getPredictiveAnalytics(30));
    }

    @GetMapping("/growth")
    public ResponseEntity<Map<String, Object>> getGrowthMetrics() {
        return ResponseEntity.ok(analyticsAiService.getGrowthSuggestions());
    }

    @PostMapping("/predict")
    public ResponseEntity<Map<String, Object>> predict(
            @RequestParam(required = false) String parameters) {
        Map<String, Object> params = parseParams(parameters);
        int daysAhead = (int) params.getOrDefault("daysAhead", 30);
        return ResponseEntity.ok(analyticsAiService.getSalesPrediction(daysAhead));
    }

    private Map<String, Object> parseParams(String parameters) {
        if (parameters == null || parameters.isEmpty()) {
            return new HashMap<>();
        }
        try {
            return objectMapper.readValue(parameters, new TypeReference<Map<String, Object>>() {});
        } catch (JsonProcessingException e) {
            return new HashMap<>();
        }
    }

    // Trend endpoints with dynamic data generation
    @GetMapping("/revenue-trend")
    public ResponseEntity<Map<String, Object>> getRevenueTrend(@RequestParam(defaultValue = "monthly") String period) {
        return ResponseEntity.ok(generateTrendData("revenue", period, 10000, 50000));
    }

    @GetMapping("/orders-trend")
    public ResponseEntity<Map<String, Object>> getOrdersTrend(@RequestParam(defaultValue = "monthly") String period) {
        return ResponseEntity.ok(generateTrendData("orders", period, 100, 1000));
    }

    @GetMapping("/customer-growth")
    public ResponseEntity<Map<String, Object>> getCustomerGrowth(@RequestParam(defaultValue = "monthly") String period) {
        return ResponseEntity.ok(generateTrendData("newCustomers", period, 30, 200));
    }

    @GetMapping("/merchant-growth")
    public ResponseEntity<Map<String, Object>> getMerchantGrowth(@RequestParam(defaultValue = "monthly") String period) {
        return ResponseEntity.ok(generateTrendData("newMerchants", period, 5, 30));
    }

    @GetMapping("/delivery-performance")
    public ResponseEntity<Map<String, Object>> getDeliveryPerformance() {
        Random random = new Random();
        Map<String, Object> map = new HashMap<>();
        map.put("onTimeDeliveryRate", Math.round((85 + random.nextDouble() * 15) * 10.0) / 10.0);
        map.put("averageDeliveryTimeMinutes", 20 + random.nextInt(20));
        map.put("deliveriesLastWeek", 800 + random.nextInt(2000));
        map.put("deliverySuccessRate", Math.round((92 + random.nextDouble() * 8) * 10.0) / 10.0);
        return ResponseEntity.ok(map);
    }

    @GetMapping("/category-sales")
    public ResponseEntity<Map<String, Object>> getCategorySales() {
        Map<String, Object> map = new HashMap<>();
        map.put("data", generateCategorySalesData());
        return ResponseEntity.ok(map);
    }

    @GetMapping("/heat-map")
    public ResponseEntity<List<List<Integer>>> getHeatMapData() {
        Random random = new Random();
        List<List<Integer>> data = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            List<Integer> row = new ArrayList<>();
            for (int j = 0; j < 24; j++) {
                row.add(random.nextInt(100));
            }
            data.add(row);
        }
        return ResponseEntity.ok(data);
    }

    @GetMapping("/retention")
    public ResponseEntity<Map<String, Object>> getRetentionCohort(
            @RequestParam(defaultValue = "monthly") String cohortType) {
        return ResponseEntity.ok(analyticsAiService.getCohortAnalysis(cohortType, "last_6_months"));
    }

    @GetMapping("/funnel/{funnelId}")
    public ResponseEntity<Map<String, Object>> getFunnelAnalysis(@PathVariable String funnelId) {
        return ResponseEntity.ok(analyticsAiService.getFunnelAnalysis(funnelId, "last_30_days"));
    }

    private Map<String, Object> generateTrendData(String metric, String period, double minVal, double maxVal) {
        Random random = new Random(period.hashCode());
        int dataPoints = "weekly".equals(period) ? 12 : "daily".equals(period) ? 30 : 6;
        List<Map<String, Object>> data = new ArrayList<>();

        for (int i = 0; i < dataPoints; i++) {
            Map<String, Object> point = new HashMap<>();
            point.put("period", "2026-" + String.format("%02d", (i % 12) + 1));
            point.put(metric, Math.round((minVal + random.nextDouble() * (maxVal - minVal)) * 100.0) / 100.0);
            data.add(point);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("period", period);
        result.put("data", data);
        return result;
    }

    private List<Map<String, Object>> generateCategorySalesData() {
        String[] categories = {"Groceries", "Dairy", "Beverages", "Snacks", "Household",
                "Personal Care", "Baby Care", "Pet Supplies", "Electronics", "Fashion"};
        Random random = new Random();
        return Arrays.stream(categories)
                .map(cat -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("category", cat);
                    map.put("sales", Math.round((10000 + random.nextDouble() * 90000) * 100.0) / 100.0);
                    return map;
                })
                .sorted((a, b) -> Double.compare((Double) b.get("sales"), (Double) a.get("sales")))
                .collect(Collectors.toList());
    }
}
