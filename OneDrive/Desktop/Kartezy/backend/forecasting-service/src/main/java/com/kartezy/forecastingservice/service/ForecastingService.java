package com.kartezy.forecastingservice.service;

import com.kartezy.shared.ai.ForecastingModels.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class ForecastingService {

    private final Map<String, List<HistoricalDataPoint>> historicalData = new ConcurrentHashMap<>();

    public ForecastResult forecastDemand(ForecastRequest request) {
        String id = UUID.randomUUID().toString();
        String modelType = determineModelType(request.getHistoricalData());
        ForecastResult result = new ForecastResult(id, request.getProductId(), request.getStoreId(), modelType);

        List<HistoricalDataPoint> history = request.getHistoricalData();
        if (history == null || history.isEmpty()) {
            result.setForecast(generateSyntheticForecast(request.getDaysAhead()));
            return result;
        }

        double[] values = history.stream().mapToDouble(HistoricalDataPoint::getValue).toArray();
        Instant lastTimestamp = history.get(history.size() - 1).getTimestamp();

        List<Double> predictions = applyExponentialSmoothing(values, request.getDaysAhead());
        double mse = calculateMSE(values, predictions.subList(0, Math.min(predictions.size(), values.length)));

        Map<String, Double> metrics = new HashMap<>();
        metrics.put("mse", mse);
        metrics.put("mae", calculateMAE(values, predictions.subList(0, Math.min(predictions.size(), values.length))));
        metrics.put("mape", calculateMAPE(values, predictions.subList(0, Math.min(predictions.size(), values.length))));
        result.setMetrics(metrics);

        double stdDev = calculateStdDev(values);
        List<ForecastDataPoint> forecast = new ArrayList<>();
        List<ForecastDataPoint> upperCI = new ArrayList<>();
        List<ForecastDataPoint> lowerCI = new ArrayList<>();

        for (int i = 0; i < request.getDaysAhead(); i++) {
            Instant ts = lastTimestamp.plus(i + 1, ChronoUnit.DAYS);
            double predicted = i < predictions.size() ? predictions.get(i) : values[values.length - 1];
            forecast.add(new ForecastDataPoint(ts, Math.max(0, predicted)));
            if (request.isIncludeConfidenceIntervals()) {
                upperCI.add(new ForecastDataPoint(ts, Math.max(0, predicted + 1.96 * stdDev)));
                lowerCI.add(new ForecastDataPoint(ts, Math.max(0, predicted - 1.96 * stdDev)));
            }
        }

        result.setForecast(forecast);
        result.setConfidenceUpper(upperCI);
        result.setConfidenceLower(lowerCI);
        return result;
    }

    public ReorderPoint calculateReorderPoint(String productId, String warehouseId,
                                              List<HistoricalDataPoint> demandHistory,
                                              int leadTimeDays, double serviceLevel) {
        ReorderPoint rp = new ReorderPoint(productId, warehouseId);

        if (demandHistory == null || demandHistory.isEmpty()) {
            rp.setReorderPoint(10);
            rp.setSafetyStock(5);
            return rp;
        }

        double[] values = demandHistory.stream().mapToDouble(HistoricalDataPoint::getValue).toArray();
        double avgDailyDemand = Arrays.stream(values).average().orElse(0);
        double demandStdDev = calculateStdDev(values);
        double zScore = getZScoreForServiceLevel(serviceLevel);

        rp.setLeadTimeDemand(avgDailyDemand * leadTimeDays);
        rp.setDemandVariability(demandStdDev);
        rp.setSafetyStock((int) Math.ceil(zScore * demandStdDev * Math.sqrt(leadTimeDays)));
        rp.setReorderPoint((int) Math.ceil(avgDailyDemand * leadTimeDays + rp.getSafetyStock()));
        rp.setEconomicOrderQuantity(calculateEOQ(avgDailyDemand * 365, 10, 0.2));

        return rp;
    }

    public SeasonalTrend analyzeSeasonality(String productId, List<HistoricalDataPoint> history) {
        SeasonalTrend trend = new SeasonalTrend(productId);

        if (history == null || history.size() < 30) {
            return trend;
        }

        Map<Integer, List<Double>> monthGroups = new HashMap<>();
        for (HistoricalDataPoint dp : history) {
            int month = dp.getTimestamp().atZone(java.time.ZoneId.systemDefault()).getMonthValue();
            monthGroups.computeIfAbsent(month, k -> new ArrayList<>()).add(dp.getValue());
        }

        double overallAvg = history.stream().mapToDouble(HistoricalDataPoint::getValue).average().orElse(1.0);
        for (Map.Entry<Integer, List<Double>> entry : monthGroups.entrySet()) {
            double monthAvg = entry.getValue().stream().mapToDouble(Double::doubleValue).average().orElse(overallAvg);
            double seasonalIndex = overallAvg > 0 ? monthAvg / overallAvg : 1.0;
            trend.getSeasonalIndices().put("month_" + entry.getKey(), seasonalIndex);
        }

        double[] values = history.stream().mapToDouble(HistoricalDataPoint::getValue).toArray();
        double n = values.length;
        double sumX = n * (n - 1) / 2.0;
        double sumY = Arrays.stream(values).sum();
        double sumXY = 0;
        double sumX2 = 0;
        for (int i = 0; i < n; i++) {
            sumXY += i * values[i];
            sumX2 += i * i;
        }
        trend.setTrendComponent((n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX));
        trend.setSeasonalStrength(calculateSeasonalStrength(trend.getSeasonalIndices()));
        trend.setTrendStrength(Math.abs(trend.getTrendComponent()) > 0.01 ? 0.7 : 0.1);

        return trend;
    }

    public InventoryHealth analyzeInventoryHealth(String productId, int currentStock,
                                                   List<HistoricalDataPoint> salesHistory,
                                                   List<HistoricalDataPoint> expiryData) {
        InventoryHealth health = new InventoryHealth();
        health.setProductId(productId);

        if (salesHistory != null && !salesHistory.isEmpty()) {
            double avgDailySales = salesHistory.stream()
                    .mapToDouble(HistoricalDataPoint::getValue).average().orElse(0);
            health.setTurnoverRate(avgDailySales > 0 ? avgDailySales * 365 / Math.max(currentStock, 1) : 0);
            health.setDaysOfStock(avgDailySales > 0 ? (int) (currentStock / avgDailySales) : 999);

            if (avgDailySales > 0) {
                double[] values = salesHistory.stream().mapToDouble(HistoricalDataPoint::getValue).toArray();
                double stdDev = calculateStdDev(values);
                double cv = stdDev / avgDailySales;
                health.setStockoutRisk(Math.min(1.0, cv * 0.5));
            }

            double salesVelocity = avgDailySales;
            if (currentStock > 0 && salesVelocity > 0) {
                double daysToSell = currentStock / salesVelocity;
                String movement;
                if (daysToSell <= 3) movement = "FAST_MOVING";
                else if (daysToSell <= 7) movement = "MEDIUM_MOVING";
                else if (daysToSell <= 30) movement = "SLOW_MOVING";
                else movement = "NON_MOVING";
                health.setMovementClassification(movement);
            }
        }

        if (expiryData != null && !expiryData.isEmpty()) {
            double avgExpiryDays = expiryData.stream()
                    .mapToDouble(HistoricalDataPoint::getValue).average().orElse(30);
            health.setExpiryRisk(Math.max(0, Math.min(1.0, 30.0 / Math.max(avgExpiryDays, 1))));
        }

        return health;
    }

    public List<HistoricalDataPoint> getHistoricalData(String productId, String storeId) {
        return historicalData.getOrDefault(productId + ":" + storeId, Collections.emptyList());
    }

    public void recordDataPoint(String productId, String storeId, double value) {
        String key = productId + ":" + storeId;
        historicalData.computeIfAbsent(key, k -> Collections.synchronizedList(new ArrayList<>()))
                .add(new HistoricalDataPoint(Instant.now(), value));
    }

    private String determineModelType(List<HistoricalDataPoint> data) {
        if (data == null || data.size() < 10) return "EXPONENTIAL_SMOOTHING";
        double[] values = data.stream().mapToDouble(HistoricalDataPoint::getValue).toArray();
        boolean hasSeasonality = detectSeasonality(values);
        boolean hasTrend = detectTrend(values);
        if (hasSeasonality && hasTrend) return "HOLT_WINTERS";
        if (hasTrend) return "HOLT_LINEAR";
        return "EXPONENTIAL_SMOOTHING";
    }

    private boolean detectSeasonality(double[] values) {
        if (values.length < 14) return false;
        double[] weeklyMeans = new double[7];
        int[] counts = new int[7];
        for (int i = 0; i < values.length; i++) {
            weeklyMeans[i % 7] += values[i];
            counts[i % 7]++;
        }
        for (int i = 0; i < 7; i++) {
            if (counts[i] > 0) weeklyMeans[i] /= counts[i];
        }
        double overallMean = Arrays.stream(values).average().orElse(0);
        if (overallMean == 0) return false;
        for (double mean : weeklyMeans) {
            if (Math.abs(mean - overallMean) / overallMean > 0.2) return true;
        }
        return false;
    }

    private boolean detectTrend(double[] values) {
        if (values.length < 2) return false;
        int n = values.length;
        double firstHalf = 0, secondHalf = 0;
        for (int i = 0; i < n / 2; i++) firstHalf += values[i];
        for (int i = n / 2; i < n; i++) secondHalf += values[i];
        double mean1 = firstHalf / (n / 2);
        double mean2 = secondHalf / (n - n / 2);
        double overallMean = (firstHalf + secondHalf) / n;
        return overallMean > 0 && Math.abs(mean2 - mean1) / overallMean > 0.1;
    }

    private List<Double> applyExponentialSmoothing(double[] values, int horizon) {
        List<Double> predictions = new ArrayList<>();
        if (values.length == 0) {
            for (int i = 0; i < horizon; i++) predictions.add(0.0);
            return predictions;
        }

        double alpha = 0.3;
        double smoothed = values[0];
        for (int i = 1; i < values.length; i++) {
            smoothed = alpha * values[i] + (1 - alpha) * smoothed;
            predictions.add(smoothed);
        }

        double lastValue = smoothed;
        for (int i = 0; i < horizon; i++) {
            predictions.add(lastValue);
        }

        return predictions;
    }

    private List<Double> generateSyntheticForecast(int daysAhead) {
        List<Double> forecast = new ArrayList<>();
        Random random = new Random(42);
        double base = 100;
        for (int i = 0; i < daysAhead; i++) {
            forecast.add(base + random.nextGaussian() * 10);
        }
        return forecast;
    }

    private int calculateEOQ(double annualDemand, double orderingCost, double holdingCostPerUnit) {
        return (int) Math.ceil(Math.sqrt((2 * annualDemand * orderingCost) / Math.max(holdingCostPerUnit, 0.01)));
    }

    private double calculateMSE(double[] actual, List<Double> predicted) {
        double sum = 0;
        int n = Math.min(actual.length, predicted.size());
        for (int i = 0; i < n; i++) {
            sum += Math.pow(actual[i] - predicted.get(i), 2);
        }
        return n > 0 ? sum / n : 0;
    }

    private double calculateMAE(double[] actual, List<Double> predicted) {
        double sum = 0;
        int n = Math.min(actual.length, predicted.size());
        for (int i = 0; i < n; i++) {
            sum += Math.abs(actual[i] - predicted.get(i));
        }
        return n > 0 ? sum / n : 0;
    }

    private double calculateMAPE(double[] actual, List<Double> predicted) {
        double sum = 0;
        int n = Math.min(actual.length, predicted.size());
        int count = 0;
        for (int i = 0; i < n; i++) {
            if (actual[i] != 0) {
                sum += Math.abs((actual[i] - predicted.get(i)) / actual[i]);
                count++;
            }
        }
        return count > 0 ? (sum / count) * 100 : 0;
    }

    private double calculateStdDev(double[] values) {
        double mean = Arrays.stream(values).average().orElse(0);
        double variance = Arrays.stream(values).map(v -> Math.pow(v - mean, 2)).average().orElse(0);
        return Math.sqrt(variance);
    }

    private double getZScoreForServiceLevel(double serviceLevel) {
        if (serviceLevel >= 0.999) return 3.09;
        if (serviceLevel >= 0.995) return 2.58;
        if (serviceLevel >= 0.99) return 2.33;
        if (serviceLevel >= 0.975) return 1.96;
        if (serviceLevel >= 0.95) return 1.65;
        if (serviceLevel >= 0.90) return 1.28;
        if (serviceLevel >= 0.85) return 1.04;
        if (serviceLevel >= 0.80) return 0.84;
        return 0.0;
    }

    private double calculateSeasonalStrength(Map<String, Double> seasonalIndices) {
        if (seasonalIndices.isEmpty()) return 0;
        double maxDev = seasonalIndices.values().stream()
                .mapToDouble(v -> Math.abs(v - 1.0)).max().orElse(0);
        return Math.min(1.0, maxDev);
    }
}
