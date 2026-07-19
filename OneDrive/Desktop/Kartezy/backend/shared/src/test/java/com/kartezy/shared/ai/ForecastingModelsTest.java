package com.kartezy.shared.ai;

import com.kartezy.shared.ai.ForecastingModels.*;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.time.Instant;
import java.util.*;

class ForecastingModelsTest {

    @Test
    void testForecastRequest() {
        ForecastRequest request = new ForecastRequest();
        request.setProductId("p1");
        request.setStoreId("s1");
        request.setDaysAhead(30);
        request.setGranularity("DAILY");
        request.setIncludeConfidenceIntervals(true);

        assertEquals("p1", request.getProductId());
        assertEquals("s1", request.getStoreId());
        assertEquals(30, request.getDaysAhead());
        assertTrue(request.isIncludeConfidenceIntervals());
    }

    @Test
    void testHistoricalDataPoint() {
        Instant now = Instant.now();
        HistoricalDataPoint dp = new HistoricalDataPoint(now, 150.0);
        dp.setAttributes(Map.of("promotion", true));
        assertEquals(now, dp.getTimestamp());
        assertEquals(150.0, dp.getValue());
        assertTrue((Boolean) dp.getAttributes().get("promotion"));
    }

    @Test
    void testForecastResult() {
        ForecastResult result = new ForecastResult("f1", "p1", "s1", "EXPONENTIAL_SMOOTHING");
        result.setConfidenceLevel(0.95);
        result.setMetrics(Map.of("mse", 125.0, "mae", 8.5));

        Instant now = Instant.now();
        result.getForecast().add(new ForecastDataPoint(now, 100.0));
        result.getForecast().add(new ForecastDataPoint(now.plusSeconds(86400), 105.0));

        assertEquals("f1", result.getId());
        assertEquals("p1", result.getProductId());
        assertEquals(2, result.getForecast().size());
        assertEquals(125.0, result.getMetrics().get("mse"));
        assertNotNull(result.getGeneratedAt());
    }

    @Test
    void testForecastDataPoint() {
        ForecastDataPoint point = new ForecastDataPoint(Instant.now(), 100.0);
        point.setUpperBound(120.0);
        point.setLowerBound(80.0);
        assertEquals(100.0, point.getValue());
        assertEquals(120.0, point.getUpperBound());
        assertEquals(80.0, point.getLowerBound());
    }

    @Test
    void testReorderPoint() {
        ReorderPoint rp = new ReorderPoint("p1", "w1");
        rp.setReorderPoint(50);
        rp.setSafetyStock(20);
        rp.setEconomicOrderQuantity(200);
        assertEquals("p1", rp.getProductId());
        assertEquals("w1", rp.getWarehouseId());
        assertEquals(50, rp.getReorderPoint());
        assertEquals(20, rp.getSafetyStock());
        assertEquals(200, rp.getEconomicOrderQuantity());
    }

    @Test
    void testInventoryHealth() {
        InventoryHealth health = new InventoryHealth();
        health.setProductId("p1");
        health.setMovementClassification("FAST_MOVING");
        health.setTurnoverRate(12.5);
        health.setDaysOfStock(5);
        health.setExpiryRisk(0.1);
        health.setStockoutRisk(0.05);
        assertEquals("FAST_MOVING", health.getMovementClassification());
        assertEquals(12.5, health.getTurnoverRate());
        assertEquals(0.1, health.getExpiryRisk());
    }
}
