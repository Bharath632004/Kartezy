package com.kartezy.shared.ai;

import java.time.Instant;
import java.util.*;

public class ForecastingModels {

    public static class ForecastRequest {
        private String productId;
        private String storeId;
        private String categoryId;
        private String warehouseId;
        private int daysAhead = 30;
        private String granularity = "DAILY";
        private boolean includeConfidenceIntervals = true;
        private List<HistoricalDataPoint> historicalData;

        public String getProductId() { return productId; }
        public void setProductId(String productId) { this.productId = productId; }
        public String getStoreId() { return storeId; }
        public void setStoreId(String storeId) { this.storeId = storeId; }
        public String getCategoryId() { return categoryId; }
        public void setCategoryId(String categoryId) { this.categoryId = categoryId; }
        public String getWarehouseId() { return warehouseId; }
        public void setWarehouseId(String warehouseId) { this.warehouseId = warehouseId; }
        public int getDaysAhead() { return daysAhead; }
        public void setDaysAhead(int daysAhead) { this.daysAhead = daysAhead; }
        public String getGranularity() { return granularity; }
        public void setGranularity(String granularity) { this.granularity = granularity; }
        public boolean isIncludeConfidenceIntervals() { return includeConfidenceIntervals; }
        public void setIncludeConfidenceIntervals(boolean includeConfidenceIntervals) { this.includeConfidenceIntervals = includeConfidenceIntervals; }
        public List<HistoricalDataPoint> getHistoricalData() { return historicalData; }
        public void setHistoricalData(List<HistoricalDataPoint> historicalData) { this.historicalData = historicalData; }
    }

    public static class HistoricalDataPoint {
        private Instant timestamp;
        private double value;
        private Map<String, Object> attributes;

        public HistoricalDataPoint(Instant timestamp, double value) {
            this.timestamp = timestamp;
            this.value = value;
        }

        public Instant getTimestamp() { return timestamp; }
        public double getValue() { return value; }
        public Map<String, Object> getAttributes() { return attributes; }
        public void setAttributes(Map<String, Object> attributes) { this.attributes = attributes; }
    }

    public static class ForecastResult {
        private String id;
        private String productId;
        private String storeId;
        private String modelType;
        private List<ForecastDataPoint> forecast;
        private List<ForecastDataPoint> confidenceUpper;
        private List<ForecastDataPoint> confidenceLower;
        private double confidenceLevel = 0.95;
        private Map<String, Double> metrics;
        private Instant generatedAt;

        public ForecastResult(String id, String productId, String storeId, String modelType) {
            this.id = id;
            this.productId = productId;
            this.storeId = storeId;
            this.modelType = modelType;
            this.forecast = new ArrayList<>();
            this.generatedAt = Instant.now();
        }

        public String getId() { return id; }
        public String getProductId() { return productId; }
        public String getStoreId() { return storeId; }
        public String getModelType() { return modelType; }
        public List<ForecastDataPoint> getForecast() { return forecast; }
        public void setForecast(List<ForecastDataPoint> forecast) { this.forecast = forecast; }
        public List<ForecastDataPoint> getConfidenceUpper() { return confidenceUpper; }
        public void setConfidenceUpper(List<ForecastDataPoint> confidenceUpper) { this.confidenceUpper = confidenceUpper; }
        public List<ForecastDataPoint> getConfidenceLower() { return confidenceLower; }
        public void setConfidenceLower(List<ForecastDataPoint> confidenceLower) { this.confidenceLower = confidenceLower; }
        public double getConfidenceLevel() { return confidenceLevel; }
        public void setConfidenceLevel(double confidenceLevel) { this.confidenceLevel = confidenceLevel; }
        public Map<String, Double> getMetrics() { return metrics; }
        public void setMetrics(Map<String, Double> metrics) { this.metrics = metrics; }
        public Instant getGeneratedAt() { return generatedAt; }
    }

    public static class ForecastDataPoint {
        private Instant timestamp;
        private double value;
        private double upperBound;
        private double lowerBound;

        public ForecastDataPoint(Instant timestamp, double value) {
            this.timestamp = timestamp;
            this.value = value;
        }

        public Instant getTimestamp() { return timestamp; }
        public double getValue() { return value; }
        public double getUpperBound() { return upperBound; }
        public void setUpperBound(double upperBound) { this.upperBound = upperBound; }
        public double getLowerBound() { return lowerBound; }
        public void setLowerBound(double lowerBound) { this.lowerBound = lowerBound; }
    }

    public static class SeasonalTrend {
        private String productId;
        private Map<String, Double> seasonalIndices;
        private double trendComponent;
        private double seasonalStrength;
        private double trendStrength;

        public SeasonalTrend(String productId) {
            this.productId = productId;
            this.seasonalIndices = new HashMap<>();
        }

        public String getProductId() { return productId; }
        public Map<String, Double> getSeasonalIndices() { return seasonalIndices; }
        public double getTrendComponent() { return trendComponent; }
        public void setTrendComponent(double trendComponent) { this.trendComponent = trendComponent; }
        public double getSeasonalStrength() { return seasonalStrength; }
        public void setSeasonalStrength(double seasonalStrength) { this.seasonalStrength = seasonalStrength; }
        public double getTrendStrength() { return trendStrength; }
        public void setTrendStrength(double trendStrength) { this.trendStrength = trendStrength; }
    }

    public static class ReorderPoint {
        private String productId;
        private String warehouseId;
        private int reorderPoint;
        private int safetyStock;
        private int economicOrderQuantity;
        private double leadTimeDemand;
        private double demandVariability;
        private String suggestedSupplier;

        public ReorderPoint(String productId, String warehouseId) {
            this.productId = productId;
            this.warehouseId = warehouseId;
        }

        public String getProductId() { return productId; }
        public String getWarehouseId() { return warehouseId; }
        public int getReorderPoint() { return reorderPoint; }
        public void setReorderPoint(int reorderPoint) { this.reorderPoint = reorderPoint; }
        public int getSafetyStock() { return safetyStock; }
        public void setSafetyStock(int safetyStock) { this.safetyStock = safetyStock; }
        public int getEconomicOrderQuantity() { return economicOrderQuantity; }
        public void setEconomicOrderQuantity(int economicOrderQuantity) { this.economicOrderQuantity = economicOrderQuantity; }
        public double getLeadTimeDemand() { return leadTimeDemand; }
        public void setLeadTimeDemand(double leadTimeDemand) { this.leadTimeDemand = leadTimeDemand; }
        public double getDemandVariability() { return demandVariability; }
        public void setDemandVariability(double demandVariability) { this.demandVariability = demandVariability; }
        public String getSuggestedSupplier() { return suggestedSupplier; }
        public void setSuggestedSupplier(String suggestedSupplier) { this.suggestedSupplier = suggestedSupplier; }
    }

    public static class InventoryHealth {
        private String productId;
        private String category;
        private double turnoverRate;
        private int daysOfStock;
        private String movementClassification;
        private double expiryRisk;
        private double stockoutRisk;
        private int suggestedReorderQuantity;

        public String getProductId() { return productId; }
        public void setProductId(String productId) { this.productId = productId; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public double getTurnoverRate() { return turnoverRate; }
        public void setTurnoverRate(double turnoverRate) { this.turnoverRate = turnoverRate; }
        public int getDaysOfStock() { return daysOfStock; }
        public void setDaysOfStock(int daysOfStock) { this.daysOfStock = daysOfStock; }
        public String getMovementClassification() { return movementClassification; }
        public void setMovementClassification(String movementClassification) { this.movementClassification = movementClassification; }
        public double getExpiryRisk() { return expiryRisk; }
        public void setExpiryRisk(double expiryRisk) { this.expiryRisk = expiryRisk; }
        public double getStockoutRisk() { return stockoutRisk; }
        public void setStockoutRisk(double stockoutRisk) { this.stockoutRisk = stockoutRisk; }
        public int getSuggestedReorderQuantity() { return suggestedReorderQuantity; }
        public void setSuggestedReorderQuantity(int suggestedReorderQuantity) { this.suggestedReorderQuantity = suggestedReorderQuantity; }
    }
}
