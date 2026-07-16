package com.kartezy.forecastingservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ForecastingService {

    private static final double DEFAULT_ALPHA = 0.3;
    private static final double DEFAULT_BETA = 0.1;
    private static final double DEFAULT_GAMMA = 0.1;
    private static final int SEASONAL_PERIOD = 7;
    private static final double SAFETY_STOCK_MULTIPLIER = 1.5;

    public Map<String, Object> getDemandForecast(String productId, String storeId, int daysAhead) {
        log.info("Generating demand forecast for product: {}, store: {}, days: {}", productId, storeId, daysAhead);

        List<Double> historicalDemand = generateHistoricalDemand(productId, storeId);
        List<Double> forecast = holtWintersForecast(historicalDemand, daysAhead);

        List<Map<String, Object>> forecastData = new ArrayList<>();
        for (int i = 0; i < forecast.size(); i++) {
            Map<String, Object> point = new HashMap<>();
            point.put("date", LocalDate.now().plusDays(i + 1).format(DateTimeFormatter.ISO_DATE));
            point.put("forecastValue", Math.round(forecast.get(i) * 100.0) / 100.0);
            point.put("lowerBound", Math.round((forecast.get(i) * 0.8) * 100.0) / 100.0);
            point.put("upperBound", Math.round((forecast.get(i) * 1.2) * 100.0) / 100.0);
            forecastData.add(point);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("productId", productId);
        result.put("storeId", storeId);
        result.put("forecast", forecastData);
        result.put("totalForecast", forecast.stream().mapToDouble(Double::doubleValue).sum());
        result.put("averageDaily", Math.round(forecast.stream().mapToDouble(Double::doubleValue).average().orElse(0) * 100.0) / 100.0);
        result.put("confidence", 0.85);
        result.put("modelVersion", "2.1.0");
        return result;
    }

    public Map<String, Object> getSalesForecast(String storeId, int daysAhead) {
        log.info("Generating sales forecast for store: {}, days: {}", storeId, daysAhead);

        List<Double> historicalSales = generateHistoricalSales(storeId);
        List<Double> forecast = arimaForecast(historicalSales, daysAhead);

        List<Map<String, Object>> forecastData = new ArrayList<>();
        for (int i = 0; i < forecast.size(); i++) {
            Map<String, Object> point = new HashMap<>();
            point.put("date", LocalDate.now().plusDays(i + 1).format(DateTimeFormatter.ISO_DATE));
            point.put("forecastRevenue", Math.round(forecast.get(i) * 100.0) / 100.0);
            point.put("forecastOrders", Math.round((forecast.get(i) / 25.0) * 100.0) / 100.0);
            forecastData.add(point);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("storeId", storeId);
        result.put("forecast", forecastData);
        result.put("totalForecastRevenue", Math.round(forecast.stream().mapToDouble(Double::doubleValue).sum() * 100.0) / 100.0);
        result.put("averageDailyRevenue", Math.round(forecast.stream().mapToDouble(Double::doubleValue).average().orElse(0) * 100.0) / 100.0);
        result.put("growthRate", calculateGrowthRate(historicalSales, forecast));
        result.put("confidence", 0.82);
        result.put("modelVersion", "1.3.0");
        return result;
    }

    public Map<String, Object> getInventoryForecast(String productId, String warehouseId, int daysAhead) {
        log.info("Generating inventory forecast for product: {}, warehouse: {}, days: {}", productId, warehouseId, daysAhead);

        List<Double> historicalDemand = generateHistoricalDemand(productId, warehouseId);
        List<Double> forecast = holtWintersForecast(historicalDemand, daysAhead);
        double currentStock = generateCurrentStock(productId, warehouseId);
        double leadTimeDemand = forecast.stream().limit(3).mapToDouble(Double::doubleValue).sum();
        double safetyStock = leadTimeDemand * 0.3;

        List<Map<String, Object>> inventoryData = new ArrayList<>();
        double runningStock = currentStock;
        for (int i = 0; i < forecast.size(); i++) {
            runningStock -= forecast.get(i);
            double reorderPoint = leadTimeDemand + safetyStock;

            Map<String, Object> point = new HashMap<>();
            point.put("date", LocalDate.now().plusDays(i + 1).format(DateTimeFormatter.ISO_DATE));
            point.put("predictedDemand", Math.round(forecast.get(i) * 100.0) / 100.0);
            point.put("projectedStock", Math.round(Math.max(runningStock, 0) * 100.0) / 100.0);
            point.put("needsReplenishment", runningStock < reorderPoint);
            point.put("stockoutRisk", Math.max(0, 1.0 - (runningStock / (leadTimeDemand * 2))));
            inventoryData.add(point);
        }

        boolean needsReplenishment = runningStock < (leadTimeDemand + safetyStock);
        int daysUntilStockout = runningStock > 0 && forecast.stream().mapToDouble(Double::doubleValue).average().orElse(1) > 0
                ? (int) (runningStock / forecast.stream().mapToDouble(Double::doubleValue).average().orElse(1))
                : 0;

        Map<String, Object> result = new HashMap<>();
        result.put("productId", productId);
        result.put("warehouseId", warehouseId);
        result.put("currentStock", currentStock);
        result.put("inventoryForecast", inventoryData);
        result.put("leadTimeDemand", Math.round(leadTimeDemand * 100.0) / 100.0);
        result.put("safetyStock", Math.round(safetyStock * 100.0) / 100.0);
        result.put("reorderPoint", Math.round((leadTimeDemand + safetyStock) * 100.0) / 100.0);
        result.put("needsReplenishment", needsReplenishment);
        result.put("daysUntilStockout", daysUntilStockout);
        result.put("recommendedOrderQuantity", needsReplenishment
                ? Math.round((leadTimeDemand * 2 + safetyStock - Math.max(runningStock, 0)) * 100.0) / 100.0
                : 0.0);
        return result;
    }

    public Map<String, Object> getReorderPointRecommendation(String productId, String warehouseId) {
        log.info("Calculating reorder point for product: {}, warehouse: {}", productId, warehouseId);

        List<Double> historicalDemand = generateHistoricalDemand(productId, warehouseId);
        double avgDailyDemand = historicalDemand.stream().mapToDouble(Double::doubleValue).average().orElse(10);
        int leadTimeDays = 3;
        double demandVariability = calculateStandardDeviation(historicalDemand);
        double leadTimeDemand = avgDailyDemand * leadTimeDays;
        double safetyStock = SAFETY_STOCK_MULTIPLIER * demandVariability * Math.sqrt(leadTimeDays);
        double reorderPoint = leadTimeDemand + safetyStock;

        Map<String, Object> result = new HashMap<>();
        result.put("productId", productId);
        result.put("warehouseId", warehouseId);
        result.put("averageDailyDemand", Math.round(avgDailyDemand * 100.0) / 100.0);
        result.put("demandVariability", Math.round(demandVariability * 100.0) / 100.0);
        result.put("leadTimeDays", leadTimeDays);
        result.put("leadTimeDemand", Math.round(leadTimeDemand * 100.0) / 100.0);
        result.put("safetyStock", Math.round(safetyStock * 100.0) / 100.0);
        result.put("reorderPoint", Math.round(reorderPoint * 100.0) / 100.0);
        result.put("economicOrderQuantity", Math.round(calculateEOQ(avgDailyDemand * 30, 50, 5) * 100.0) / 100.0);
        result.put("confidence", 0.88);
        return result;
    }

    public Map<String, Object> getStockoutRisk(String productId, String warehouseId, int daysAhead) {
        log.info("Calculating stockout risk for product: {}, warehouse: {}, days: {}", productId, warehouseId, daysAhead);

        List<Double> historicalDemand = generateHistoricalDemand(productId, warehouseId);
        double currentStock = generateCurrentStock(productId, warehouseId);
        double avgDailyDemand = historicalDemand.stream().mapToDouble(Double::doubleValue).average().orElse(10);
        double projectedDemand = avgDailyDemand * daysAhead;
        double stockoutProbability = currentStock <= 0 ? 1.0
                : Math.max(0, 1.0 - (currentStock / projectedDemand));

        LocalDate expectedStockoutDate = currentStock > 0
                ? LocalDate.now().plusDays((int) (currentStock / Math.max(avgDailyDemand, 1)))
                : LocalDate.now();

        Map<String, Object> result = new HashMap<>();
        result.put("productId", productId);
        result.put("warehouseId", warehouseId);
        result.put("currentStock", currentStock);
        result.put("averageDailyDemand", Math.round(avgDailyDemand * 100.0) / 100.0);
        result.put("projectedDemand", Math.round(projectedDemand * 100.0) / 100.0);
        result.put("stockoutProbability", Math.round(stockoutProbability * 100.0) / 100.0);
        result.put("expectedStockoutDate", expectedStockoutDate.format(DateTimeFormatter.ISO_DATE));
        result.put("riskLevel", stockoutProbability < 0.3 ? "LOW"
                : stockoutProbability < 0.6 ? "MEDIUM" : "HIGH");
        result.put("recommendedAction", stockoutProbability > 0.5
                ? "URGENT_REPLENISHMENT" : "MONITOR");
        return result;
    }

    @Cacheable("seasonalTrends")
    public Map<String, Object> getSeasonalTrends(String productId, int yearsBack) {
        log.info("Analyzing seasonal trends for product: {}, years: {}", productId, yearsBack);

        Map<String, Double> seasonalIndices = new HashMap<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};

        Random random = new Random(productId.hashCode());
        for (String month : months) {
            seasonalIndices.put(month, Math.round((0.8 + random.nextDouble() * 0.4) * 100.0) / 100.0);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("productId", productId);
        result.put("seasonalIndices", seasonalIndices);
        result.put("peakMonth", seasonalIndices.entrySet().stream()
                .max(Map.Entry.comparingByValue()).map(Map.Entry::getKey).orElse("Jan"));
        result.put("lowMonth", seasonalIndices.entrySet().stream()
                .min(Map.Entry.comparingByValue()).map(Map.Entry::getKey).orElse("Dec"));
        result.put("trendDirection", "STABLE");
        result.put("seasonalityStrength", 0.72);
        result.put("confidence", 0.80);
        return result;
    }

    public List<Map<String, Object>> getTopProductsForecast(String storeId, int daysAhead, int limit) {
        log.info("Getting top products forecast for store: {}, days: {}, limit: {}", storeId, daysAhead, limit);

        List<Map<String, Object>> topProducts = new ArrayList<>();
        Random random = new Random(storeId.hashCode());

        for (int i = 0; i < limit; i++) {
            String productId = "PROD-" + (10000 + i);
            List<Double> forecast = holtWintersForecast(generateHistoricalDemand(productId, storeId), daysAhead);
            double totalForecast = forecast.stream().mapToDouble(Double::doubleValue).sum();

            Map<String, Object> product = new HashMap<>();
            product.put("productId", productId);
            product.put("forecastedDemand", Math.round(totalForecast * 100.0) / 100.0);
            product.put("growthRate", Math.round((random.nextDouble() * 0.3) * 100.0) / 100.0);
            product.put("rank", i + 1);
            topProducts.add(product);
        }

        topProducts.sort((a, b) -> Double.compare((Double) b.get("forecastedDemand"), (Double) a.get("forecastedDemand")));
        return topProducts;
    }

    // Holt-Winters Exponential Smoothing (Triple Exponential Smoothing)
    private List<Double> holtWintersForecast(List<Double> historical, int steps) {
        int n = historical.size();
        if (n < SEASONAL_PERIOD * 2) {
            return simpleExponentialSmoothing(historical, steps);
        }

        double level = historical.get(0);
        double trend = (historical.get(SEASONAL_PERIOD) - historical.get(0)) / SEASONAL_PERIOD;

        double[] seasonal = new double[SEASONAL_PERIOD];
        for (int i = 0; i < SEASONAL_PERIOD; i++) {
            double sum = 0;
            int count = 0;
            for (int j = i; j < n; j += SEASONAL_PERIOD) {
                sum += historical.get(j);
                count++;
            }
            seasonal[i] = sum / count;
        }

        double seasonalAvg = Arrays.stream(seasonal).average().orElse(1);
        for (int i = 0; i < SEASONAL_PERIOD; i++) {
            seasonal[i] = seasonal[i] / seasonalAvg;
        }

        List<Double> forecast = new ArrayList<>();
        for (int t = 0; t < n; t++) {
            double prevLevel = level;
            double seasonalFactor = seasonal[t % SEASONAL_PERIOD];
            level = DEFAULT_ALPHA * (historical.get(t) / seasonalFactor) + (1 - DEFAULT_ALPHA) * (level + trend);
            trend = DEFAULT_BETA * (level - prevLevel) + (1 - DEFAULT_BETA) * trend;
            seasonal[t % SEASONAL_PERIOD] = DEFAULT_GAMMA * (historical.get(t) / level) + (1 - DEFAULT_GAMMA) * seasonalFactor;
        }

        for (int t = 0; t < steps; t++) {
            double forecastValue = (level + (t + 1) * trend) * seasonal[(n + t) % SEASONAL_PERIOD];
            forecast.add(Math.max(0, forecastValue));
        }

        return forecast;
    }

    // ARIMA-like forecast (simplified Auto-Regressive Integrated Moving Average)
    private List<Double> arimaForecast(List<Double> historical, int steps) {
        int n = historical.size();
        if (n < 2) return generateDefaultForecast(steps);

        List<Double> differenced = new ArrayList<>();
        for (int i = 1; i < n; i++) {
            differenced.add(historical.get(i) - historical.get(i - 1));
        }

        double meanDiff = differenced.stream().mapToDouble(Double::doubleValue).average().orElse(0);
        double lastValue = historical.get(n - 1);

        List<Double> forecast = new ArrayList<>();
        for (int i = 0; i < steps; i++) {
            double nextValue = lastValue + meanDiff;
            nextValue = Math.max(0, nextValue);
            forecast.add(nextValue);
            lastValue = nextValue;
        }

        return forecast;
    }

    private List<Double> simpleExponentialSmoothing(List<Double> historical, int steps) {
        if (historical.isEmpty()) return generateDefaultForecast(steps);

        double lastLevel = historical.get(historical.size() - 1);
        for (int i = historical.size() - 2; i >= 0; i--) {
            lastLevel = DEFAULT_ALPHA * historical.get(i) + (1 - DEFAULT_ALPHA) * lastLevel;
        }

        List<Double> forecast = new ArrayList<>();
        for (int i = 0; i < steps; i++) {
            forecast.add(Math.max(0, lastLevel));
        }
        return forecast;
    }

    private List<Double> generateHistoricalDemand(String productId, String storeId) {
        Random random = new Random((productId + storeId).hashCode());
        List<Double> demand = new ArrayList<>();
        double baseDemand = 20 + random.nextDouble() * 80;
        for (int i = 0; i < 60; i++) {
            double noise = (random.nextDouble() - 0.5) * 20;
            double seasonalEffect = Math.sin(i * 2 * Math.PI / SEASONAL_PERIOD) * 5;
            demand.add(Math.max(0, baseDemand + noise + seasonalEffect));
        }
        return demand;
    }

    private List<Double> generateHistoricalSales(String storeId) {
        Random random = new Random(storeId.hashCode());
        List<Double> sales = new ArrayList<>();
        double baseSales = 500 + random.nextDouble() * 1000;
        double trend = 2.0;
        for (int i = 0; i < 90; i++) {
            double noise = (random.nextDouble() - 0.5) * 100;
            double seasonalEffect = Math.sin(i * 2 * Math.PI / SEASONAL_PERIOD) * 50;
            sales.add(Math.max(100, baseSales + trend * i + noise + seasonalEffect));
        }
        return sales;
    }

    private double generateCurrentStock(String productId, String warehouseId) {
        Random random = new Random((productId + warehouseId).hashCode());
        return 50 + random.nextDouble() * 200;
    }

    private List<Double> generateDefaultForecast(int steps) {
        List<Double> forecast = new ArrayList<>();
        for (int i = 0; i < steps; i++) {
            forecast.add(50.0);
        }
        return forecast;
    }

    private double calculateStandardDeviation(List<Double> values) {
        double mean = values.stream().mapToDouble(Double::doubleValue).average().orElse(0);
        double variance = values.stream()
                .mapToDouble(v -> Math.pow(v - mean, 2))
                .average().orElse(0);
        return Math.sqrt(variance);
    }

    private double calculateEOQ(double annualDemand, double orderCost, double holdingCost) {
        if (holdingCost <= 0) return annualDemand;
        return Math.sqrt((2 * annualDemand * orderCost) / holdingCost);
    }

    private double calculateGrowthRate(List<Double> historical, List<Double> forecast) {
        if (historical.isEmpty() || forecast.isEmpty()) return 0;
        double historicalAvg = historical.stream().mapToDouble(Double::doubleValue).average().orElse(1);
        double forecastAvg = forecast.stream().mapToDouble(Double::doubleValue).average().orElse(0);
        return Math.round(((forecastAvg - historicalAvg) / historicalAvg) * 100.0) / 100.0;
    }
}
