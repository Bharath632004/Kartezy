package com.kartezy.datawarehouse.controller;

import com.kartezy.datawarehouse.service.WarehouseQueryService;
import com.kartezy.datawarehouse.service.ExportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.nio.file.Files;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/bi")
public class BIQueryController {
    private final WarehouseQueryService queryService;
    private final ExportService exportService;

    public BIQueryController(WarehouseQueryService queryService, ExportService exportService) {
        this.queryService = queryService; this.exportService = exportService;
    }

    @GetMapping("/executive-dashboard")
    public Map<String, Object> executiveDashboard(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return queryService.getExecutiveDashboard(start, end);
    }

    @GetMapping("/customer-analytics")
    public Map<String, Object> customerAnalytics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return queryService.getCustomerAnalytics(start, end);
    }

    @GetMapping("/merchant-analytics")
    public Map<String, Object> merchantAnalytics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return queryService.getMerchantAnalytics(start, end);
    }

    @GetMapping("/delivery-analytics")
    public Map<String, Object> deliveryAnalytics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return queryService.getDeliveryAnalytics(start, end);
    }

    @GetMapping("/product-analytics")
    public Map<String, Object> productAnalytics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return queryService.getProductAnalytics(start, end);
    }

    @GetMapping("/cohort-analysis")
    public List<Map<String, Object>> cohortAnalysis(@RequestParam(defaultValue = "monthly") String cohortType) {
        return queryService.getCohortAnalysis(cohortType);
    }

    @GetMapping("/funnel-analysis")
    public Map<String, Object> funnelAnalysis() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("stage1", Map.of("name", "App Visits", "count", 100000, "conversion", 100.0));
        result.put("stage2", Map.of("name", "Store Browsing", "count", 75000, "conversion", 75.0));
        result.put("stage3", Map.of("name", "Add to Cart", "count", 45000, "conversion", 45.0));
        result.put("stage4", Map.of("name", "Checkout Started", "count", 30000, "conversion", 30.0));
        result.put("stage5", Map.of("name", "Payment Initiated", "count", 25000, "conversion", 25.0));
        result.put("stage6", Map.of("name", "Order Completed", "count", 22000, "conversion", 22.0));
        return result;
    }

    @GetMapping("/clv")
    public Map<String, Object> customerLifetimeValue() {
        Map<String, Object> result = new HashMap<>();
        result.put("averageCLV", 2450.00);
        result.put("medianCLV", 1800.00);
        result.put("top10PercentCLV", 15000.00);
        result.put("clvByCohort", List.of(
            Map.of("cohort", "0-3 months", "clv", 350),
            Map.of("cohort", "3-6 months", "clv", 850),
            Map.of("cohort", "6-12 months", "clv", 1800),
            Map.of("cohort", "12-24 months", "clv", 4200),
            Map.of("cohort", "24+ months", "clv", 8500)
        ));
        return result;
    }

    @GetMapping("/churn-prediction")
    public Map<String, Object> churnPrediction() {
        Map<String, Object> result = new HashMap<>();
        result.put("overallChurnRate", 8.5);
        result.put("predictedChurnNextMonth", 450);
        result.put("churnBySegment", List.of(
            Map.of("segment", "New Users", "churnRate", 12.5, "users", 5000),
            Map.of("segment", "Active Users", "churnRate", 3.2, "users", 25000),
            Map.of("segment", "At Risk", "churnRate", 18.0, "users", 2000),
            Map.of("segment", "High Value", "churnRate", 1.5, "users", 8000)
        ));
        return result;
    }

    @GetMapping("/inventory-analytics")
    public Map<String, Object> inventoryAnalytics() {
        Map<String, Object> result = new HashMap<>();
        result.put("abcAnalysis", List.of(
            Map.of("category", "A (Top 20%)", "items", 120, "revenuePercentage", 70.0),
            Map.of("category", "B (Middle 30%)", "items", 180, "revenuePercentage", 20.0),
            Map.of("category", "C (Bottom 50%)", "items", 300, "revenuePercentage", 10.0)
        ));
        result.put("stockTurnover", List.of(
            Map.of("category", "FMCG", "turnoverDays", 15),
            Map.of("category", "Electronics", "turnoverDays", 45),
            Map.of("category", "Fashion", "turnoverDays", 60),
            Map.of("category", "Home Essentials", "turnoverDays", 30)
        ));
        return result;
    }

    @GetMapping("/city-analytics")
    public Map<String, Object> cityAnalytics() {
        Map<String, Object> result = new HashMap<>();
        result.put("topCities", List.of(
            Map.of("city", "Mumbai", "orders", 125000, "revenue", 12500000.00, "growth", 15.2),
            Map.of("city", "Delhi", "orders", 98000, "revenue", 9800000.00, "growth", 12.8),
            Map.of("city", "Bangalore", "orders", 82000, "revenue", 8200000.00, "growth", 18.5),
            Map.of("city", "Chennai", "orders", 55000, "revenue", 5500000.00, "growth", 10.3),
            Map.of("city", "Pune", "orders", 42000, "revenue", 4200000.00, "growth", 22.1)
        ));
        return result;
    }

    @GetMapping("/heatmap")
    public Map<String, Object> heatmapData(@RequestParam(defaultValue = "7") int days) {
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> hourlyData = new ArrayList<>();
        String[] hours = {"00-03", "03-06", "06-09", "09-12", "12-15", "15-18", "18-21", "21-00"};
        Random rand = new Random(42);
        for (int day = 0; day < days; day++) {
            for (int h = 0; h < hours.length; h++) {
                Map<String, Object> entry = new HashMap<>();
                entry.put("day", day); entry.put("hour", hours[h]); entry.put("orders", 10 + rand.nextInt(90));
                entry.put("revenue", 500 + rand.nextInt(4500));
                hourlyData.add(entry);
            }
        }
        result.put("hourlyOrders", hourlyData);
        result.put("busyHours", List.of("09-12", "12-15", "18-21"));
        result.put("peakDays", List.of("Saturday", "Sunday"));
        return result;
    }

    @GetMapping("/marketing-analytics")
    public Map<String, Object> marketingAnalytics() {
        Map<String, Object> result = new HashMap<>();
        result.put("campaignROI", List.of(
            Map.of("campaign", "Summer Sale", "spend", 50000, "revenue", 250000, "roi", 5.0),
            Map.of("campaign", "Weekend Flash", "spend", 30000, "revenue", 180000, "roi", 6.0),
            Map.of("campaign", "New User Offer", "spend", 75000, "revenue", 300000, "roi", 4.0),
            Map.of("campaign", "Referral Program", "spend", 20000, "revenue", 160000, "roi", 8.0)
        ));
        result.put("customerAcquisitionCost", 185.00);
        result.put("ltvToCacRatio", 5.2);
        return result;
    }

    @SuppressWarnings("unchecked")
    @PostMapping("/export")
    public ResponseEntity<byte[]> exportData(@RequestBody Map<String, Object> request) throws Exception {
        String format = (String) request.getOrDefault("format", "csv");
        String filename = (String) request.getOrDefault("filename", "export");
        List<Map<String, Object>> data = (List<Map<String, Object>>) request.getOrDefault("data", List.of());

        File file;
        String contentType;
        switch (format) {
            case "excel":
            case "xlsx":
                file = exportService.exportToExcel(data, filename);
                contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                break;
            case "pdf":
                file = exportService.exportToPdf(data, filename);
                contentType = "application/pdf";
                break;
            default:
                file = exportService.exportToCsv(data, filename);
                contentType = "text/csv";
        }

        byte[] content = Files.readAllBytes(file.toPath());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(contentType));
        headers.setContentDisposition(ContentDisposition.attachment().filename(file.getName()).build());
        return new ResponseEntity<>(content, headers, HttpStatus.OK);
    }
}
