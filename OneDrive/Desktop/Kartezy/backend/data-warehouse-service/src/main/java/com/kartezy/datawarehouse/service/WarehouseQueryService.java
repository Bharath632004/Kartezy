package com.kartezy.datawarehouse.service;

import com.kartezy.datawarehouse.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class WarehouseQueryService {
    private final DailyOrdersFactRepository ordersRepo;
    private final DailyCustomerFactRepository customerRepo;
    private final DailyMerchantFactRepository merchantRepo;
    private final DailyDeliveryFactRepository deliveryRepo;
    private final DailyProductFactRepository productRepo;
    private final CustomerCohortRepository cohortRepo;

    public WarehouseQueryService(DailyOrdersFactRepository ordersRepo, DailyCustomerFactRepository customerRepo, DailyMerchantFactRepository merchantRepo, DailyDeliveryFactRepository deliveryRepo, DailyProductFactRepository productRepo, CustomerCohortRepository cohortRepo) {
        this.ordersRepo = ordersRepo; this.customerRepo = customerRepo; this.merchantRepo = merchantRepo;
        this.deliveryRepo = deliveryRepo; this.productRepo = productRepo; this.cohortRepo = cohortRepo;
    }

    public Map<String, Object> getExecutiveDashboard(LocalDate start, LocalDate end) {
        Map<String, Object> result = new HashMap<>();
        result.put("period", Map.of("start", start.toString(), "end", end.toString()));
        result.put("totalRevenue", ordersRepo.sumRevenueBetween(start, end));
        result.put("totalOrders", ordersRepo.sumOrdersBetween(start, end));
        result.put("totalGmv", ordersRepo.sumGmvBetween(start, end));
        result.put("newCustomers", customerRepo.sumNewRegistrations(start, end));
        result.put("activeCustomers", customerRepo.sumActiveCustomers(start, end));
        result.put("churnedCustomers", customerRepo.sumChurnedCustomers(start, end));
        result.put("revenueTrend", formatTrend(ordersRepo.getDailyRevenueTrend(start, end)));
        result.put("revenueByCategory", formatCategoryData(ordersRepo.getRevenueByCategory(start, end)));
        result.put("cityPerformance", formatCityData(ordersRepo.getCityPerformance(start, end)));
        result.put("customerGrowthTrend", formatCustomerTrend(customerRepo.getCustomerGrowthTrend(start, end)));
        return result;
    }

    public Map<String, Object> getCustomerAnalytics(LocalDate start, LocalDate end) {
        Map<String, Object> result = new HashMap<>();
        result.put("period", Map.of("start", start.toString(), "end", end.toString()));
        result.put("newRegistrations", customerRepo.sumNewRegistrations(start, end));
        result.put("activeCustomers", customerRepo.sumActiveCustomers(start, end));
        result.put("churnedCustomers", customerRepo.sumChurnedCustomers(start, end));
        result.put("growthTrend", formatCustomerTrend(customerRepo.getCustomerGrowthTrend(start, end)));
        result.put("byCity", formatCityCustomerData(customerRepo.getCustomersByCity(start, end)));
        return result;
    }

    public Map<String, Object> getMerchantAnalytics(LocalDate start, LocalDate end) {
        Map<String, Object> result = new HashMap<>();
        result.put("period", Map.of("start", start.toString(), "end", end.toString()));
        result.put("topMerchants", formatTopMerchants(merchantRepo.getTopMerchants(start, end)));
        result.put("categorySummary", formatMerchantCategory(merchantRepo.getMerchantCategorySummary(start, end)));
        result.put("trend", formatMerchantTrend(merchantRepo.getMerchantTrend(start, end)));
        Object[] metrics = merchantRepo.getMerchantEfficiencyMetrics(start, end);
        if (metrics != null) {
            result.put("efficiencyMetrics", Map.of("acceptanceRate", metrics[0], "fulfilmentRate", metrics[1], "avgPrepTime", metrics[2]));
        }
        return result;
    }

    public Map<String, Object> getDeliveryAnalytics(LocalDate start, LocalDate end) {
        Map<String, Object> result = new HashMap<>();
        result.put("period", Map.of("start", start.toString(), "end", end.toString()));
        Object[] summary = deliveryRepo.getDeliverySummary(start, end);
        if (summary != null) {
            result.put("completedDeliveries", summary[0]); result.put("failedDeliveries", summary[1]);
            result.put("totalEarnings", summary[2]); result.put("onTimeRate", summary[3]);
        }
        result.put("topPartners", formatDeliveryPartners(deliveryRepo.getTopDeliveryPartners(start, end)));
        result.put("byCity", formatDeliveryCity(deliveryRepo.getDeliveryByCity(start, end)));
        result.put("trend", formatDeliveryTrend(deliveryRepo.getDeliveryTrend(start, end)));
        return result;
    }

    public Map<String, Object> getProductAnalytics(LocalDate start, LocalDate end) {
        Map<String, Object> result = new HashMap<>();
        result.put("period", Map.of("start", start.toString(), "end", end.toString()));
        result.put("topProducts", formatTopProducts(productRepo.getTopProducts(start, end)));
        result.put("byCategory", formatProductCategory(productRepo.getProductSalesByCategory(start, end)));
        result.put("conversionRates", formatConversionRates(productRepo.getProductConversionRates(start, end)));
        result.put("lowStockProducts", productRepo.getLowStockProducts());
        return result;
    }

    public List<Map<String, Object>> getCohortAnalysis(String cohortType) {
        var cohorts = cohortRepo.findByCohortTypeOrderByCohortDateAsc(cohortType);
        List<Map<String, Object>> result = new ArrayList<>();
        for (var c : cohorts) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("cohortDate", c.getCohortDate().toString());
            entry.put("cohortSize", c.getCohortSize());
            entry.put("cohortType", c.getCohortType());
            List<Double> retention = new ArrayList<>();
            for (int i = 0; i <= 12; i++) retention.add(c.getRetentionRate(i));
            entry.put("retentionRates", retention);
            result.add(entry);
        }
        return result;
    }

    private List<Map<String, Object>> formatTrend(List<Object[]> data) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : data) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("date", row[0] != null ? row[0].toString() : "");
            entry.put("revenue", row[1] != null ? row[1] : 0);
            entry.put("orders", row[2] != null ? row[2] : 0);
            result.add(entry);
        }
        return result;
    }

    private List<Map<String, Object>> formatCategoryData(List<Object[]> data) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : data) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("category", row[0]); entry.put("revenue", row[1]); result.add(entry);
        }
        return result;
    }

    private List<Map<String, Object>> formatCityData(List<Object[]> data) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : data) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("city", row[0]); entry.put("orders", row[1]); entry.put("revenue", row[2]); result.add(entry);
        }
        return result;
    }

    private List<Map<String, Object>> formatCustomerTrend(List<Object[]> data) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : data) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("date", row[0].toString()); entry.put("newRegistrations", row[1]);
            entry.put("activeCustomers", row[2]); entry.put("totalCustomers", row[3]); result.add(entry);
        }
        return result;
    }

    private List<Map<String, Object>> formatCityCustomerData(List<Object[]> data) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : data) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("city", row[0]); entry.put("activeCustom
