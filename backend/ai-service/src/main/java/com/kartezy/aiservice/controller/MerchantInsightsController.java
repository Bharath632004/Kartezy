package com.kartezy.aiservice.controller;

import com.kartezy.aiservice.service.AIServiceFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/v1/merchant/insights")
public class MerchantInsightsController {

    @Autowired
    private AIServiceFacade aiServiceFacade;

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard(@RequestParam String merchantId) {
        Random random = new Random(merchantId.hashCode());
        return Map.of(
                "totalSales", Math.round(random.nextDouble() * 500000 * 100.0) / 100.0,
                "totalOrders", 100 + random.nextInt(5000),
                "averageOrderValue", Math.round((200 + random.nextDouble() * 300) * 100.0) / 100.0,
                "customerCount", 50 + random.nextInt(500),
                "returnRate", Math.round(random.nextDouble() * 0.08 * 100.0) / 100.0,
                "topProducts", getTopProducts(merchantId, 5),
                "salesTrend", generateSalesTrend(random),
                "inventoryHealth", random.nextDouble() > 0.3 ? "GOOD" : "NEEDS_ATTENTION"
        );
    }

    @GetMapping("/sales/forecast")
    public Map<String, Object> getSalesForecast(@RequestParam String merchantId,
                                                @RequestParam int daysAhead) {
        Random random = new Random(merchantId.hashCode());
        List<Map<String, Object>> forecast = new ArrayList<>();
        for (int i = 0; i < daysAhead; i++) {
            forecast.add(Map.of(
                    "date", LocalDate.now().plusDays(i + 1).format(DateTimeFormatter.ISO_DATE),
                    "predictedSales", Math.round((1000 + random.nextDouble() * 5000) * 100.0) / 100.0
            ));
        }
        return Map.of(
                "merchantId", merchantId,
                "forecast", forecast,
                "totalForecast", forecast.stream().mapToDouble(f -> (double) f.get("predictedSales")).sum(),
                "confidenceInterval", List.of(0.8, 1.2),
                "growthRate", Math.round((random.nextDouble() * 0.2 - 0.05) * 100.0) / 100.0
        );
    }

    @GetMapping("/revenue/forecast")
    public Map<String, Object> getRevenueForecast(@RequestParam String merchantId,
                                                  @RequestParam int daysAhead) {
        Random random = new Random(merchantId.hashCode());
        List<Map<String, Object>> forecast = new ArrayList<>();
        for (int i = 0; i < daysAhead; i++) {
            forecast.add(Map.of(
                    "date", LocalDate.now().plusDays(i + 1).format(DateTimeFormatter.ISO_DATE),
                    "predictedRevenue", Math.round((5000 + random.nextDouble() * 20000) * 100.0) / 100.0
            ));
        }
        return Map.of(
                "merchantId", merchantId,
                "forecast", forecast,
                "totalRevenue", forecast.stream().mapToDouble(f -> (double) f.get("predictedRevenue")).sum(),
                "confidence", Math.round((0.7 + random.nextDouble() * 0.2) * 100.0) / 100.0
        );
    }

    @GetMapping("/top-products")
    public List<Map<String, Object>> getTopProducts(@RequestParam String merchantId,
                                                    @RequestParam int limit) {
        Random random = new Random(merchantId.hashCode());
        List<Map<String, Object>> products = new ArrayList<>();
        for (int i = 1; i <= limit; i++) {
            products.add(Map.of(
                    "rank", i,
                    "productId", "PROD-" + (10000 + random.nextInt(5000)),
                    "sales", Math.round(random.nextDouble() * 50000 * 100.0) / 100.0,
                    "unitsSold", 50 + random.nextInt(500),
                    "growth", Math.round((random.nextDouble() * 0.5 - 0.15) * 100.0) / 100.0
            ));
        }
        return products;
    }

    @GetMapping("/underperforming-products")
    public List<Map<String, Object>> getUnderperformingProducts(@RequestParam String merchantId,
                                                                @RequestParam int limit) {
        Random random = new Random(merchantId.hashCode());
        List<Map<String, Object>> products = new ArrayList<>();
        for (int i = 1; i <= limit; i++) {
            products.add(Map.of(
                    "rank", i,
                    "productId", "PROD-" + (50000 + random.nextInt(5000)),
                    "sales", Math.round(random.nextDouble() * 1000 * 100.0) / 100.0,
                    "unitsSold", 1 + random.nextInt(20),
                    "issue", random.nextBoolean() ? "LOW_DEMAND" : "HIGH_PRICE",
                    "recommendedAction", "Consider reducing price or bundling with popular items"
            ));
        }
        return products;
    }

    @GetMapping("/customer-insights")
    public Map<String, Object> getCustomerInsights(@RequestParam String merchantId) {
        Random random = new Random(merchantId.hashCode());
        return Map.of(
                "newCustomers", random.nextInt(200),
                "returningCustomers", random.nextInt(500),
                "customerLifetimeValue", Math.round((500 + random.nextDouble() * 2000) * 100.0) / 100.0,
                "customerRetentionRate", Math.round((0.3 + random.nextDouble() * 0.4) * 100.0) / 100.0,
                "topCustomerSegments", List.of(
                        Map.of("segment", "LOYAL", "count", 100 + random.nextInt(200), "percentage", 0.25),
                        Map.of("segment", "REGULAR", "count", 150 + random.nextInt(300), "percentage", 0.40),
                        Map.of("segment", "NEW", "count", 80 + random.nextInt(150), "percentage", 0.35)
                )
        );
    }

    @GetMapping("/growth/suggestions")
    public List<String> getGrowthSuggestions(@RequestParam String merchantId) {
        Random random = new Random(merchantId.hashCode());
        String[] suggestions = {
                "Increase marketing on top-selling products",
                "Optimize pricing for underperforming items",
                "Improve customer retention through loyalty programs",
                "Expand product categories based on demand trends",
                "Offer bundle deals for frequently bought together items",
                "Launch targeted campaigns for high-value customers",
                "Reduce delivery time by optimizing inventory placement",
                "Introduce seasonal products to capture festival demand"
        };
        List<String> selected = new ArrayList<>();
        int count = 3 + random.nextInt(3);
        for (int i = 0; i < count; i++) {
            selected.add(suggestions[random.nextInt(suggestions.length)]);
        }
        return selected;
    }

    @GetMapping("/pricing/suggestions")
    public List<Map<String, Object>> getPricingSuggestions(@RequestParam String merchantId) {
        Random random = new Random(merchantId.hashCode());
        return List.of(
                Map.of("productId", "PROD-" + (10000 + random.nextInt(5000)), "currentPrice", 299, "suggestedPrice", 249, "reason", "Competitor pricing", "expectedImpact", 0.15),
                Map.of("productId", "PROD-" + (10000 + random.nextInt(5000)), "currentPrice", 499, "suggestedPrice", 549, "reason", "High demand", "expectedImpact", 0.08)
        );
    }

    @GetMapping("/inventory/suggestions")
    public List<Map<String, Object>> getInventorySuggestions(@RequestParam String merchantId) {
        Random random = new Random(merchantId.hashCode());
        return List.of(
                Map.of("productId", "PROD-" + (10000 + random.nextInt(5000)), "action", "RESTOCK", "priority", "HIGH", "reason", "Fast moving - 5 days remaining"),
                Map.of("productId", "PROD-" + (10000 + random.nextInt(5000)), "action", "CLEARANCE", "priority", "MEDIUM", "reason", "Slow moving - 90 days in stock")
        );
    }

    @GetMapping("/performance/category")
    public Map<String, Object> getCategoryPerformance(@RequestParam String merchantId,
                                                      @RequestParam String categoryId) {
        Random random = new Random((merchantId + categoryId).hashCode());
        return Map.of(
                "categoryId", categoryId,
                "sales", Math.round(random.nextDouble() * 100000 * 100.0) / 100.0,
                "growthRate", Math.round((random.nextDouble() * 0.4 - 0.1) * 100.0) / 100.0,
                "margin", Math.round((0.15 + random.nextDouble() * 0.25) * 100.0) / 100.0,
                "inventoryTurnover", Math.round((3 + random.nextDouble() * 7) * 10.0) / 10.0,
                "topProduct", "PROD-" + (10000 + random.nextInt(5000))
        );
    }

    @GetMapping("/marketing/roi")
    public Map<String, Object> getMarketingROI(@RequestParam String merchantId) {
        Random random = new Random(merchantId.hashCode());
        return Map.of(
                "totalSpend", Math.round(random.nextDouble() * 50000 * 100.0) / 100.0,
                "returnOnSpend", Math.round((2.0 + random.nextDouble() * 5.0) * 10.0) / 10.0,
                "campaigns", List.of(
                        Map.of("campaign", "Summer Sale", "spend", 15000, "revenue", 45000, "roi", 3.0),
                        Map.of("campaign", "New User Offer", "spend", 20000, "revenue", 80000, "roi", 4.0),
                        Map.of("campaign", "Weekend Flash", "spend", 10000, "revenue", 25000, "roi", 2.5)
                )
        );
    }

    private List<Map<String, Object>> generateSalesTrend(Random random) {
        List<Map<String, Object>> trend = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            trend.add(Map.of(
                    "date", LocalDate.now().minusDays(i * 7).format(DateTimeFormatter.ISO_DATE),
                    "sales", Math.round((10000 + random.nextDouble() * 30000) * 100.0) / 100.0
            ));
        }
        return trend;
    }
}