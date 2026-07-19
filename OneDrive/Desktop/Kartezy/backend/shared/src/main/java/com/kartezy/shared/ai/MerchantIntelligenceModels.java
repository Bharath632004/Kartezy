package com.kartezy.shared.ai;

import java.util.*;

public class MerchantIntelligenceModels {

    public static class MerchantDashboard {
        private String merchantId;
        private double totalSales;
        private int totalOrders;
        private double averageOrderValue;
        private int customerCount;
        private double returnRate;
        private List<TopProduct> topProducts;
        private List<SalesTrendPoint> salesTrend;
        private double growthRate;
        private double customerRetentionRate;
        private double profitMargin;
        private Map<String, Object> summary;

        public MerchantDashboard(String merchantId) {
            this.merchantId = merchantId;
            this.topProducts = new ArrayList<>();
            this.salesTrend = new ArrayList<>();
            this.summary = new HashMap<>();
        }

        public String getMerchantId() { return merchantId; }
        public double getTotalSales() { return totalSales; }
        public void setTotalSales(double totalSales) { this.totalSales = totalSales; }
        public int getTotalOrders() { return totalOrders; }
        public void setTotalOrders(int totalOrders) { this.totalOrders = totalOrders; }
        public double getAverageOrderValue() { return averageOrderValue; }
        public void setAverageOrderValue(double averageOrderValue) { this.averageOrderValue = averageOrderValue; }
        public int getCustomerCount() { return customerCount; }
        public void setCustomerCount(int customerCount) { this.customerCount = customerCount; }
        public double getReturnRate() { return returnRate; }
        public void setReturnRate(double returnRate) { this.returnRate = returnRate; }
        public List<TopProduct> getTopProducts() { return topProducts; }
        public List<SalesTrendPoint> getSalesTrend() { return salesTrend; }
        public double getGrowthRate() { return growthRate; }
        public void setGrowthRate(double growthRate) { this.growthRate = growthRate; }
        public double getCustomerRetentionRate() { return customerRetentionRate; }
        public void setCustomerRetentionRate(double customerRetentionRate) { this.customerRetentionRate = customerRetentionRate; }
        public double getProfitMargin() { return profitMargin; }
        public void setProfitMargin(double profitMargin) { this.profitMargin = profitMargin; }
        public Map<String, Object> getSummary() { return summary; }
    }

    public static class TopProduct {
        private String productId;
        private String productName;
        private int unitsSold;
        private double revenue;
        private double growthRate;
        private double margin;

        public TopProduct(String productId, String productName, int unitsSold, double revenue) {
            this.productId = productId;
            this.productName = productName;
            this.unitsSold = unitsSold;
            this.revenue = revenue;
        }

        public String getProductId() { return productId; }
        public String getProductName() { return productName; }
        public int getUnitsSold() { return unitsSold; }
        public double getRevenue() { return revenue; }
        public double getGrowthRate() { return growthRate; }
        public void setGrowthRate(double growthRate) { this.growthRate = growthRate; }
        public double getMargin() { return margin; }
        public void setMargin(double margin) { this.margin = margin; }
    }

    public static class SalesTrendPoint {
        private String date;
        private double sales;
        private int orders;
        private double averageOrderValue;

        public SalesTrendPoint(String date, double sales, int orders) {
            this.date = date;
            this.sales = sales;
            this.orders = orders;
        }

        public String getDate() { return date; }
        public double getSales() { return sales; }
        public int getOrders() { return orders; }
        public double getAverageOrderValue() { return averageOrderValue; }
        public void setAverageOrderValue(double averageOrderValue) { this.averageOrderValue = averageOrderValue; }
    }

    public static class SalesForecast {
        private String merchantId;
        private List<ForecastDataPoint> forecast;
        private List<ForecastDataPoint> upperBound;
        private List<ForecastDataPoint> lowerBound;
        private double totalForecastedSales;
        private double confidence;

        public SalesForecast(String merchantId) {
            this.merchantId = merchantId;
            this.forecast = new ArrayList<>();
            this.upperBound = new ArrayList<>();
            this.lowerBound = new ArrayList<>();
        }

        public String getMerchantId() { return merchantId; }
        public List<ForecastDataPoint> getForecast() { return forecast; }
        public List<ForecastDataPoint> getUpperBound() { return upperBound; }
        public List<ForecastDataPoint> getLowerBound() { return lowerBound; }
        public double getTotalForecastedSales() { return totalForecastedSales; }
        public void setTotalForecastedSales(double totalForecastedSales) { this.totalForecastedSales = totalForecastedSales; }
        public double getConfidence() { return confidence; }
        public void setConfidence(double confidence) { this.confidence = confidence; }
    }

    public static class ForecastDataPoint {
        private String date;
        private double value;

        public ForecastDataPoint(String date, double value) {
            this.date = date;
            this.value = value;
        }

        public String getDate() { return date; }
        public double getValue() { return value; }
    }

    public static class InventorySuggestion {
        private String productId;
        private String productName;
        private int currentStock;
        private int suggestedStock;
        private String suggestionType;
        private String reason;
        private double expectedDemandNextWeek;
        private double expectedDemandNextMonth;
        private String supplier;

        public InventorySuggestion(String productId, String productName, int currentStock, int suggestedStock, String suggestionType) {
            this.productId = productId;
            this.productName = productName;
            this.currentStock = currentStock;
            this.suggestedStock = suggestedStock;
            this.suggestionType = suggestionType;
        }

        public String getProductId() { return productId; }
        public String getProductName() { return productName; }
        public int getCurrentStock() { return currentStock; }
        public int getSuggestedStock() { return suggestedStock; }
        public String getSuggestionType() { return suggestionType; }
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
        public double getExpectedDemandNextWeek() { return expectedDemandNextWeek; }
        public void setExpectedDemandNextWeek(double expectedDemandNextWeek) { this.expectedDemandNextWeek = expectedDemandNextWeek; }
        public double getExpectedDemandNextMonth() { return expectedDemandNextMonth; }
        public void setExpectedDemandNextMonth(double expectedDemandNextMonth) { this.expectedDemandNextMonth = expectedDemandNextMonth; }
        public String getSupplier() { return supplier; }
        public void setSupplier(String supplier) { this.supplier = supplier; }
    }

    public static class PricingSuggestion {
        private String productId;
        private double currentPrice;
        private double suggestedPrice;
        private double competitorAvgPrice;
        private double demandElasticity;
        private double expectedSalesImpact;
        private double expectedRevenueImpact;
        private String reason;
        private double confidence;

        public PricingSuggestion(String productId, double currentPrice, double suggestedPrice) {
            this.productId = productId;
            this.currentPrice = currentPrice;
            this.suggestedPrice = suggestedPrice;
        }

        public String getProductId() { return productId; }
        public double getCurrentPrice() { return currentPrice; }
        public double getSuggestedPrice() { return suggestedPrice; }
        public double getCompetitorAvgPrice() { return competitorAvgPrice; }
        public void setCompetitorAvgPrice(double competitorAvgPrice) { this.competitorAvgPrice = competitorAvgPrice; }
        public double getDemandElasticity() { return demandElasticity; }
        public void setDemandElasticity(double demandElasticity) { this.demandElasticity = demandElasticity; }
        public double getExpectedSalesImpact() { return expectedSalesImpact; }
        public void setExpectedSalesImpact(double expectedSalesImpact) { this.expectedSalesImpact = expectedSalesImpact; }
        public double getExpectedRevenueImpact() { return expectedRevenueImpact; }
        public void setExpectedRevenueImpact(double expectedRevenueImpact) { this.expectedRevenueImpact = expectedRevenueImpact; }
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
        public double getConfidence() { return confidence; }
        public void setConfidence(double confidence) { this.confidence = confidence; }
    }

    public static class BusinessGrowthSuggestion {
        private String suggestionId;
        private String category;
        private String suggestion;
        private double expectedImpact;
        private String priority;
        private String implementationDifficulty;
        private List<String> requiredActions;
        private Map<String, Object> metrics;

        public BusinessGrowthSuggestion(String suggestionId, String category, String suggestion, double expectedImpact, String priority) {
            this.suggestionId = suggestionId;
            this.category = category;
            this.suggestion = suggestion;
            this.expectedImpact = expectedImpact;
            this.priority = priority;
            this.requiredActions = new ArrayList<>();
            this.metrics = new HashMap<>();
        }

        public String getSuggestionId() { return suggestionId; }
        public String getCategory() { return category; }
        public String getSuggestion() { return suggestion; }
        public double getExpectedImpact() { return expectedImpact; }
        public String getPriority() { return priority; }
        public String getImplementationDifficulty() { return implementationDifficulty; }
        public void setImplementationDifficulty(String implementationDifficulty) { this.implementationDifficulty = implementationDifficulty; }
        public List<String> getRequiredActions() { return requiredActions; }
        public Map<String, Object> getMetrics() { return metrics; }
    }

    public static class CategoryPerformance {
        private String categoryId;
        private String categoryName;
        private double sales;
        private double growthRate;
        private double margin;
        private double inventoryTurnover;
        private int productCount;
        private double categoryShare;

        public String getCategoryId() { return categoryId; }
        public void setCategoryId(String categoryId) { this.categoryId = categoryId; }
        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
        public double getSales() { return sales; }
        public void setSales(double sales) { this.sales = sales; }
        public double getGrowthRate() { return growthRate; }
        public void setGrowthRate(double growthRate) { this.growthRate = growthRate; }
        public double getMargin() { return margin; }
        public void setMargin(double margin) { this.margin = margin; }
        public double getInventoryTurnover() { return inventoryTurnover; }
        public void setInventoryTurnover(double inventoryTurnover) { this.inventoryTurnover = inventoryTurnover; }
        public int getProductCount() { return productCount; }
        public void setProductCount(int productCount) { this.productCount = productCount; }
        public double getCategoryShare() { return categoryShare; }
        public void setCategoryShare(double categoryShare) { this.categoryShare = categoryShare; }
    }
}
