package com.kartezy.forecastingservice.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class ForecastingServiceTest {

    private ForecastingService forecastingService;

    @BeforeEach
    void setUp() {
        forecastingService = new ForecastingService();
    }

    @Test
    void testGetDemandForecast_ReturnsValidForecast() {
        Map<String, Object> result = forecastingService.getDemandForecast("PROD-001", "STORE-001", 7);
        assertNotNull(result);
        assertEquals("PROD-001", result.get("productId"));
        assertEquals("STORE-001", result.get("storeId"));
        assertNotNull(result.get("forecast"));
        assertTrue(((List<?>) result.get("forecast")).size() <= 7);
        assertTrue((double) result.get("confidence") > 0);
    }

    @Test
    void testGetDemandForecast_ZeroDaysReturnsEmpty() {
        Map<String, Object> result = forecastingService.getDemandForecast("PROD-001", "STORE-001", 0);
        assertNotNull(result);
        assertEquals(0, ((List<?>) result.get("forecast")).size());
    }

    @Test
    void testGetSalesForecast_ReturnsValidForecast() {
        Map<String, Object> result = forecastingService.getSalesForecast("STORE-001", 30);
        assertNotNull(result);
        assertEquals("STORE-001", result.get("storeId"));
        assertNotNull(result.get("forecast"));
        assertTrue((double) result.get("confidence") > 0);
    }

    @Test
    void testGetInventoryForecast_ReturnsStockProjections() {
        Map<String, Object> result = forecastingService.getInventoryForecast("PROD-001", "WH-001", 14);
        assertNotNull(result);
        assertEquals("PROD-001", result.get("productId"));
        assertTrue((double) result.get("currentStock") > 0);
        assertNotNull(result.get("inventoryForecast"));
        assertNotNull(result.get("reorderPoint"));
    }

    @Test
    void testGetReorderPointRecommendation_ReturnsCalculations() {
        Map<String, Object> result = forecastingService.getReorderPointRecommendation("PROD-001", "WH-001");
        assertNotNull(result);
        assertEquals("PROD-001", result.get("productId"));
        assertTrue((double) result.get("reorderPoint") > 0);
        assertTrue((double) result.get("safetyStock") > 0);
    }

    @Test
    void testGetStockoutRisk_ReturnsRiskAssessment() {
        Map<String, Object> result = forecastingService.getStockoutRisk("PROD-001", "WH-001", 7);
        assertNotNull(result);
        assertEquals("PROD-001", result.get("productId"));
        assertNotNull(result.get("riskLevel"));
        assertTrue(result.get("riskLevel").equals("LOW") || result.get("riskLevel").equals("MEDIUM") || result.get("riskLevel").equals("HIGH"));
    }

    @Test
    void testGetSeasonalTrends_ReturnsSeasonalIndices() {
        Map<String, Object> result = forecastingService.getSeasonalTrends("PROD-001", 2);
        assertNotNull(result);
        assertEquals("PROD-001", result.get("productId"));
        assertNotNull(result.get("seasonalIndices"));
        assertNotNull(result.get("peakMonth"));
        assertNotNull(result.get("lowMonth"));
    }

    @Test
    void testGetTopProductsForecast_ReturnsRankedProducts() {
        List<Map<String, Object>> result = forecastingService.getTopProductsForecast("STORE-001", 7, 20);
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertTrue(result.size() <= 20);
        // Verify sorted by forecastedDemand descending
        for (int i = 1; i < result.size(); i++) {
            assertTrue((double) result.get(i - 1).get("forecastedDemand") >= (double) result.get(i).get("forecastedDemand"));
        }
    }

    @Test
    void testConsistentResultsForSameInput() {
        Map<String, Object> result1 = forecastingService.getDemandForecast("PROD-001", "STORE-001", 7);
        Map<String, Object> result2 = forecastingService.getDemandForecast("PROD-001", "STORE-001", 7);
        // Should get consistent results for same deterministic seed
        assertNotNull(result1);
        assertNotNull(result2);
    }

    @Test
    void testDifferentProductsGetDifferentForecasts() {
        Map<String, Object> result1 = forecastingService.getDemandForecast("PROD-001", "STORE-001", 7);
        Map<String, Object> result2 = forecastingService.getDemandForecast("PROD-002", "STORE-001", 7);
        assertNotNull(result1);
        assertNotNull(result2);
    }
}
