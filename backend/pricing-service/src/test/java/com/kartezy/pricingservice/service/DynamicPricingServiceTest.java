package com.kartezy.pricingservice.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class DynamicPricingServiceTest {

    private DynamicPricingService pricingService;

    @BeforeEach
    void setUp() {
        pricingService = new DynamicPricingService();
    }

    @Test
    void testGetDynamicPrice_ReturnsCompletePriceInfo() {
        Map<String, Object> result = pricingService.getDynamicPrice("PROD-001", "STORE-001", "USR-001");
        assertNotNull(result);
        assertEquals("PROD-001", result.get("productId"));
        assertEquals("STORE-001", result.get("storeId"));
        assertTrue((double) result.get("basePrice") > 0);
        assertTrue((double) result.get("dynamicPrice") > 0);
        assertNotNull(result.get("factors"));
        assertNotNull(result.get("pricingStrategy"));
        assertNotNull(result.get("validUntil"));
    }

    @Test
    void testGetDynamicPrice_DynamicPriceDiffersFromBase() {
        Map<String, Object> result = pricingService.getDynamicPrice("PROD-001", "STORE-001", "USR-001");
        double basePrice = (double) result.get("basePrice");
        double dynamicPrice = (double) result.get("dynamicPrice");
        assertTrue(dynamicPrice != basePrice || (double) result.get("discountPercentage") > 0);
    }

    @Test
    void testGetDynamicPrices_BatchReturnsCorrectCount() {
        List<String> productIds = List.of("PROD-001", "PROD-002", "PROD-003");
        List<Map<String, Object>> results = pricingService.getDynamicPrices(productIds, "STORE-001", "USR-001");
        assertNotNull(results);
        assertEquals(3, results.size());
    }

    @Test
    void testGetPricingRules_ReturnsRules() {
        List<Map<String, Object>> rules = pricingService.getPricingRules("STORE-001");
        assertNotNull(rules);
        assertFalse(rules.isEmpty());
        assertTrue(rules.size() >= 4);
    }

    @Test
    void testSimulatePriceChange_IncreasePrice() {
        Map<String, Object> request = Map.of("currentPrice", 100.0, "newPrice", 120.0);
        Map<String, Object> result = pricingService.simulatePriceChange(request);
        assertNotNull(result);
        assertEquals(100.0, (double) result.get("currentPrice"));
        assertEquals(120.0, (double) result.get("newPrice"));
        assertTrue((double) result.get("priceChangePercentage") > 0);
        assertNotNull(result.get("recommendation"));
    }

    @Test
    void testSimulatePriceChange_DecreasePrice() {
        Map<String, Object> request = Map.of("currentPrice", 100.0, "newPrice", 80.0);
        Map<String, Object> result = pricingService.simulatePriceChange(request);
        assertNotNull(result);
        assertTrue((double) result.get("priceChangePercentage") < 0);
    }

    @Test
    void testGetPriceHistory_ReturnsHistory() {
        List<Map<String, Object>> history = pricingService.getPriceHistory("PROD-001", "STORE-001", 7);
        assertNotNull(history);
        assertEquals(8, history.size()); // 7 days back + today = 8 entries
    }

    @Test
    void testGetPromotionSuggestions_ReturnsSuggestions() {
        List<Map<String, Object>> suggestions = pricingService.getPromotionSuggestions("STORE-001");
        assertNotNull(suggestions);
        assertFalse(suggestions.isEmpty());
    }

    @Test
    void testGetDiscountOptimization_ReturnsOptimization() {
        Map<String, Object> result = pricingService.getDiscountOptimization("PROD-001", "STORE-001");
        assertNotNull(result);
        assertEquals("PROD-001", result.get("productId"));
        assertTrue((double) result.get("currentDiscount") >= 0);
        assertNotNull(result.get("recommendation"));
    }

    @Test
    void testGetFestivalPricing_ReturnsFestivals() {
        List<Map<String, Object>> festivalPrices = pricingService.getFestivalPricing("STORE-001");
        assertNotNull(festivalPrices);
        assertFalse(festivalPrices.isEmpty());
        // Should have DIWALI, CHRISTMAS, etc.
        assertTrue(festivalPrices.stream().anyMatch(f -> f.get("festival").equals("DIWALI")));
    }

    @Test
    void testGetCompetitorPrice_ReturnsComparison() {
        Map<String, Object> result = pricingService.getCompetitorPrice("PROD-001", "COMP-001");
        assertNotNull(result);
        assertEquals("PROD-001", result.get("productId"));
        assertEquals("COMP-001", result.get("competitorId"));
        assertTrue((double) result.get("competitorPrice") > 0);
    }
}
