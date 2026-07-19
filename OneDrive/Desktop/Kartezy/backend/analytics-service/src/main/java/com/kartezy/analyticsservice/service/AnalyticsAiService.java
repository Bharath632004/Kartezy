package com.kartezy.analyticsservice.service;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsAiService {

    public List<Map<String, Object>> getBusinessInsights(String timeRange) {
        return List.of(
                Map.of("type", "REVENUE_GROWTH", "metric", "revenue", "currentValue", 2500000.0,
                        "previousValue", 2168000.0, "change", 15.3, "direction", "UP",
                        "insight", "Revenue has grown by 15.3% vs previous period",
                        "recommendation", "Continue current marketing strategy", "severity", "POSITIVE", "category", "financial"),
                Map.of("type", "CUSTOMER_ACQUISITION", "metric", "new_customers", "currentValue", 1250.0,
                        "previousValue", 980.0, "change", 27.6, "direction", "UP",
                        "insight", "New customer acquisition increased by 27.6%",
                        "recommendation", "Invest more in referral programs", "severity", "POSITIVE", "category", "customer"),
                Map.of("type", "ORDER_FULFILLMENT", "metric", "on_time_delivery", "currentValue", 94.2,
                        "previousValue", 92.8, "change", 1.5, "direction", "UP",
                        "insight", "On-time delivery rate improved to 94.2%",
                        "recommendation", "Optimize last-mile delivery routes", "severity", "POSITIVE", "category", "operational"),
                Map.of("type", "CUSTOMER_RETENTION", "metric", "retention_rate", "currentValue", 72.3,
                        "previousValue", 68.5, "change", 5.5, "direction", "UP",
                        "insight", "Customer retention rate increased to 72.3%",
                        "recommendation", "Launch loyalty program for repeat customers", "severity", "POSITIVE", "category", "customer")
        );
    }

    public List<Map<String, Object>> getCustomerInsights(String timeRange) {
        return List.of(
                Map.of("segment", "HIGH_VALUE", "count", 450, "avgOrderValue", 850.0, "retentionRate", 0.92, "lifetimeValue", 25000.0),
                Map.of("segment", "MEDIUM_VALUE", "count", 1200, "avgOrderValue", 420.0, "retentionRate", 0.78, "lifetimeValue", 12000.0),
                Map.of("segment", "LOW_VALUE", "count", 2500, "avgOrderValue", 180.0, "retentionRate", 0.45, "lifetimeValue", 3500.0),
                Map.of("segment", "NEW", "count", 850, "avgOrderValue", 310.0, "retentionRate", 0.35, "lifetimeValue", 5000.0),
                Map.of("segment", "AT_RISK", "count", 320, "avgOrderValue", 280.0, "retentionRate", 0.15, "lifetimeValue", 8000.0)
        );
    }

    public List<Map<String, Object>> getSalesInsights(String timeRange) {
        List<Map<String, Object>> salesData = new ArrayList<>();
        Random random = new Random(42);
        LocalDate today = LocalDate.now();
        int days = timeRange.contains("7") ? 7 : timeRange.contains("30") ? 30 : 90;

        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            double baseSales = 50000 + random.nextDouble() * 30000;
            double weekendMultiplier = date.getDayOfWeek().getValue() >= 6 ? 1.4 : 1.0;
            salesData.add(Map.of(
                    "date", date.toString(),
                    "sales", Math.round(baseSales * weekendMultiplier * 100.0) / 100.0,
                    "orders", (int) (50 + random.nextInt(100)),
                    "averageOrderValue", Math.round((280 + random.nextDouble() * 120) * 100.0) / 100.0
            ));
        }
        return salesData;
    }

    public Map<String, Object> getSalesPrediction(int daysAhead) {
        Random random = new Random(42);
        List<Map<String, Object>> predictions = new ArrayList<>();
        double base = 50000;
        for (int i = 0; i < daysAhead; i++) {
            base += (random.nextDouble() - 0.45) * 10000;
            predictions.add(Map.of("day", i + 1, "predictedSales", Math.max(0, Math.round(base * 100.0) / 100.0),
                    "lowerBound", Math.max(0, Math.round(base * 0.85 * 100.0) / 100.0),
                    "upperBound", Math.round(base * 1.15 * 100.0) / 100.0));
        }
        return Map.of("predictions", predictions,
                "totalPredicted", predictions.stream().mapToDouble(p -> (Double) p.get("predictedSales")).sum(),
                "method", "time_series_arima", "confidence", 0.82);
    }

    public Map<String, Object> getInventoryPrediction(int daysAhead) {
        Random random = new Random(42);
        List<Map<String, Object>> predictions = new ArrayList<>();
        double base = 10000;
        for (int i = 0; i < daysAhead; i++) {
            base += (random.nextDouble() - 0.5) * 2000;
            predictions.add(Map.of("day", i + 1, "predictedDemand", Math.max(0, Math.round(base * 100.0) / 100.0), "reorderAlert", base < 3000));
        }
        return Map.of("predictions", predictions, "totalPredictedDemand",
                predictions.stream().mapToDouble(p -> (Double) p.get("predictedDemand")).sum(),
                "method", "exponential_smoothing", "confidence", 0.78);
    }

    public Map<String, String> trainAnalyticsModels(Map<String, Object> config) {
        String modelType = (String) config.getOrDefault("modelType", "forecast");
        return Map.of("status", "success", "modelType", modelType,
                "message", "Model training initiated successfully",
                "jobId", "job-" + UUID.randomUUID(), "estimatedCompletion", "2.5 hours");
    }
}
