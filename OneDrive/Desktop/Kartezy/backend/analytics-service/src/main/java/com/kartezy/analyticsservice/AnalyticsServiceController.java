package com.kartezy.analyticsservice;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.kartezy.analyticsservice.service.AnalyticsAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * REST controller for analytics service with AI-powered analytics capabilities.
 */
@RestController
@RequestMapping("/analytics")
public class AnalyticsServiceController {
    @Autowired
    private AnalyticsAiService analyticsAiService;

    // Existing endpoints
    @GetMapping("/")
    public String home() {
        return "Welcome to analytics-service service";
    }

    @GetMapping("/health")
    public String health() {
        return "analytics-service is healthy";
    }

    // AI-powered analytics endpoints
    @PostMapping("/insights/business")
    public ResponseEntity<Map<String, Object>> getBusinessInsights(
            @RequestParam(required = false) String parameters) {
        Map<String, Object> params = new HashMap<>();
        if (parameters != null && !parameters.isEmpty()) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                params = objectMapper.readValue(parameters, new TypeReference<Map<String, Object>>() {});
            } catch (JsonProcessingException e) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid JSON parameters"));
            }
        }
        return ResponseEntity.ok(analyticsAiService.generateBusinessInsights(params));
    }

    @PostMapping("/insights/customer")
    public ResponseEntity<Map<String, Object>> getCustomerInsights(
            @RequestParam(required = false) String parameters) {
        Map<String, Object> params = new HashMap<>();
        if (parameters != null && !parameters.isEmpty()) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                params = objectMapper.readValue(parameters, new TypeReference<Map<String, Object>>() {});
            } catch (JsonProcessingException e) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid JSON parameters"));
            }
        }
        return ResponseEntity.ok(analyticsAiService.generateCustomerInsights(params));
    }

    @PostMapping("/insights/merchant")
    public ResponseEntity<Map<String, Object>> getMerchantInsights(
            @RequestParam(required = false) String parameters) {
        Map<String, Object> params = new HashMap<>();
        if (parameters != null && !parameters.isEmpty()) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                params = objectMapper.readValue(parameters, new TypeReference<Map<String, Object>>() {});
            } catch (JsonProcessingException e) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid JSON parameters"));
            }
        }
        return ResponseEntity.ok(analyticsAiService.generateMerchantInsights(params));
    }

    @PostMapping("/insights/delivery")
    public ResponseEntity<Map<String, Object>> getDeliveryInsights(
            @RequestParam(required = false) String parameters) {
        Map<String, Object> params = new HashMap<>();
        if (parameters != null && !parameters.isEmpty()) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                params = objectMapper.readValue(parameters, new TypeReference<Map<String, Object>>() {});
            } catch (JsonProcessingException e) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid JSON parameters"));
            }
        }
        return ResponseEntity.ok(analyticsAiService.generateDeliveryInsights(params));
    }

    @PostMapping("/insights/marketing")
    public ResponseEntity<Map<String, Object>> getMarketingInsights(
            @RequestParam(required = false) String parameters) {
        Map<String, Object> params = new HashMap<>();
        if (parameters != null && !parameters.isEmpty()) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                params = objectMapper.readValue(parameters, new TypeReference<Map<String, Object>>() {});
            } catch (JsonProcessingException e) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid JSON parameters"));
            }
        }
        return ResponseEntity.ok(analyticsAiService.generateMarketingInsights(params));
    }

    @PostMapping("/insights/operational")
    public ResponseEntity<Map<String, Object>> getOperationalInsights(
            @RequestParam(required = false) String parameters) {
        Map<String, Object> params = new HashMap<>();
        if (parameters != null && !parameters.isEmpty()) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                params = objectMapper.readValue(parameters, new TypeReference<Map<String, Object>>() {});
            } catch (JsonProcessingException e) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid JSON parameters"));
            }
        }
        return ResponseEntity.ok(analyticsAiService.generateOperationalInsights(params));
    }

    @PostMapping("/predict")
    public ResponseEntity<Map<String, Object>> predict(
            @RequestParam(required = false) String parameters) {
        Map<String, Object> params = new HashMap<>();
        if (parameters != null && !parameters.isEmpty()) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                params = objectMapper.readValue(parameters, new TypeReference<Map<String, Object>>() {});
            } catch (JsonProcessingException e) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid JSON parameters"));
            }
        }
        return ResponseEntity.ok(analyticsAiService.predictiveAnalytics(params));
    }

    // Standard analytics endpoints expected by frontend
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> result = new HashMap<>();
        result.put("totalRevenue", 125000.0);
        result.put("totalOrders", 1250);
        result.put("totalCustomers", 890);
        result.put("conversionRate", 3.2);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/revenue-trend")
    public ResponseEntity<Map<String, Object>> getRevenueTrend(@RequestParam String period) {
        Map<String, Object> result = new HashMap<>();
        result.put("period", period);
        result.put("data", new java.util.ArrayList<Map<String, Object>>() {{
            add(Map.of("period", "2026-01", "revenue", 10000));
            add(Map.of("period", "2026-02", "revenue", 12000));
            add(Map.of("period", "2026-03", "revenue", 15000));
        }});
        return ResponseEntity.ok(result);
    }

    @GetMapping("/orders-trend")
    public ResponseEntity<Map<String, Object>> getOrdersTrend(@RequestParam String period) {
        Map<String, Object> result = new HashMap<>();
        result.put("period", period);
        result.put("data", new java.util.ArrayList<Map<String, Object>>() {{
            add(Map.of("period", "2026-01", "orders", 100));
            add(Map.of("period", "2026-02", "orders", 120));
            add(Map.of("period", "2026-03", "orders", 150));
        }});
        return ResponseEntity.ok(result);
    }

    @GetMapping("/customer-growth")
    public ResponseEntity<Map<String, Object>> getCustomerGrowth(@RequestParam String period) {
        Map<String, Object> result = new HashMap<>();
        result.put("period", period);
        result.put("data", new java.util.ArrayList<Map<String, Object>>() {{
            add(Map.of("period", "2026-01", "newCustomers", 30));
            add(Map.of("period", "2026-02", "newCustomers", 45));
            add(Map.of("period", "2026-03", "newCustomers", 50));
        }});
        return ResponseEntity.ok(result);
    }

    @GetMapping("/merchant-growth")
    public ResponseEntity<Map<String, Object>> getMerchantGrowth(@RequestParam String period) {
        Map<String, Object> result = new HashMap<>();
        result.put("period", period);
        result.put("data", new java.util.ArrayList<Map<String, Object>>() {{
            add(Map.of("period", "2026-01", "newMerchants", 5));
            add(Map.of("period", "2026-02", "newMerchants", 8));
            add(Map.of("period", "2026-03", "newMerchants", 7));
        }});
        return ResponseEntity.ok(result);
    }

    @GetMapping("/delivery-performance")
    public ResponseEntity<Map<String, Object>> getDeliveryPerformance() {
        Map<String, Object> result = new HashMap<>();
        result.put("onTimeDeliveryRate", 92.5);
        result.put("averageDeliveryTime", 2.4);
        result.put("deliveriesLastWeek", 1200);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/category-sales")
    public ResponseEntity<Map<String, Object>> getCategorySales() {
        Map<String, Object> result = new HashMap<>();
        result.put("data", new java.util.ArrayList<Map<String, Object>>() {{
            add(Map.of("category", "Electronics", "sales", 45000));
            add(Map.of("category", "Fashion", "sales", 30000));
            add(Map.of("category", "Home", "sales", 25000));
        }});
        return ResponseEntity.ok(result);
    }

    @GetMapping("/product-sales")
    public ResponseEntity<Map<String, Object>> getProductSales() {
        Map<String, Object> result = new HashMap<>();
        result.put("data", new java.util.ArrayList<Map<String, Object>>() {{
            add(Map.of("product", "Smartphone X", "sales", 20000));
            add(Map.of("product", "Laptop Pro", "sales", 18000));
            add(Map.of("product", "Headphones Z", "sales", 12000));
        }});
        return ResponseEntity.ok(result);
    }

    @GetMapping("/heat-map")
    public ResponseEntity<Map<String, Object>> getHeatMapData() {
        Map<String, Object> result = new HashMap<>();
        result.put("data", new java.util.ArrayList<java.util.List<Integer>>() {{
            add(java.util.Arrays.asList(10, 20, 30));
            add(java.util.Arrays.asList(15, 25, 35));
            add(java.util.Arrays.asList(12, 22, 32));
        }});
        return ResponseEntity.ok(result);
    }

    @GetMapping("/retention")
    public ResponseEntity<Map<String, Object>> getRetentionCohort(@RequestParam String cohortType) {
        Map<String, Object> result = new HashMap<>();
        result.put("cohortType", cohortType);
        result.put("retentionRates", new java.util.ArrayList<Map<String, Object>>() {{
            add(Map.of("month", 1, "percentage", 80));
            add(Map.of("month", 2, "percentage", 65));
            add(Map.of("month", 3, "percentage", 50));
        }});
        return ResponseEntity.ok(result);
    }

    @GetMapping("/funnel/{funnelId}")
    public ResponseEntity<Map<String, Object>> getFunnelAnalysis(@PathVariable String funnelId) {
        Map<String, Object> result = new HashMap<>();
        result.put("funnelId", funnelId);
        result.put("steps", new java.util.ArrayList<Map<String, Object>>() {{
            add(Map.of("step", "Visits", "count", 1000, "percentage", 100.0));
            add(Map.of("step", "Add to Cart", "count", 300, "percentage", 30.0));
            add(Map.of("step", "Purchase", "count", 150, "percentage", 15.0));
        }});
        return ResponseEntity.ok(result);
    }

    @GetMapping("/growth")
    public ResponseEntity<Map<String, Object>> getGrowthMetrics() {
        Map<String, Object> result = new HashMap<>();
        result.put("monthlyGrowthRate", 12.5);
        result.put("quarterlyGrowthRate", 35.2);
        result.put("yearlyGrowthRate", 120.0);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/predictions")
    public ResponseEntity<Map<String, Object>> getPredictiveInsights() {
        Map<String, Object> result = new HashMap<>();
        result.put("forecast", new java.util.ArrayList<Map<String, Object>>() {{
            add(Map.of("period", "2026-08", "value", 13000));
            add(Map.of("period", "2026-09", "value", 13500));
            add(Map.of("period", "2026-10", "value", 14000));
        }});
        return ResponseEntity.ok(result);
    }
}
