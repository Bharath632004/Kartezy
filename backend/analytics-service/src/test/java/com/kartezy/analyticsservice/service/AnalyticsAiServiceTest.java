package com.kartezy.analyticsservice.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class AnalyticsAiServiceTest {

    private AnalyticsAiService analyticsAiService;

    @BeforeEach
    void setUp() {
        analyticsAiService = new AnalyticsAiService();
    }

    @Test
    void testGetBusinessInsights_ReturnsData() {
        Map<String, Object> result = analyticsAiService.getBusinessInsights("last_30_days");
        assertNotNull(result);
        assertTrue((double) result.get("totalRevenue") > 0);
        assertTrue((int) result.get("totalOrders") > 0);
        assertTrue((int) result.get("activeCustomers") > 0);
    }

    @Test
    void testGetCustomerInsights_ReturnsSegments() {
        Map<String, Object> result = analyticsAiService.getCustomerInsights("last_30_days");
        assertNotNull(result);
        assertTrue((int) result.get("newCustomers") >= 0);
        assertTrue((double) result.get("customerRetentionRate") > 0);
        assertNotNull(result.get("topSegments"));
    }

    @Test
    void testGetMerchantInsights_ReturnsMerchantData() {
        Map<String, Object> result = analyticsAiService.getMerchantInsights("MERCH-001", "last_30_days");
        assertNotNull(result);
        assertEquals("MERCH-001", result.get("merchantId"));
        assertTrue((int) result.get("totalOrders") > 0);
    }

    @Test
    void testGetDeliveryInsights_ReturnsDeliveryData() {
        Map<String, Object> result = analyticsAiService.getDeliveryInsights("last_30_days");
        assertNotNull(result);
        assertTrue((double) result.get("onTimeDeliveryRate") > 0);
        assertTrue((int) result.get("totalDeliveries") > 0);
    }

    @Test
    void testGetMarketingInsights_ReturnsMarketingData() {
        Map<String, Object> result = analyticsAiService.getMarketingInsights("last_30_days");
        assertNotNull(result);
        assertTrue((int) result.get("totalCampaigns") > 0);
        assertNotNull(result.get("topChannels"));
    }

    @Test
    void testGetOperationalInsights_ReturnsOpsData() {
        Map<String, Object> result = analyticsAiService.getOperationalInsights("last_30_days");
        assertNotNull(result);
        assertTrue((double) result.get("orderFulfillmentRate") > 0);
    }

    @Test
    void testGetPredictiveAnalytics_ReturnsPredictions() {
        Map<String, Object> result = analyticsAiService.getPredictiveAnalytics(30);
        assertNotNull(result);
        assertTrue((double) result.get("predictedRevenue") > 0);
        assertTrue((int) result.get("predictedOrders") > 0);
        assertNotNull(result.get("recommendedActions"));
    }

    @Test
    void testGetAnomalyDetection_ReturnsAnomalies() {
        Map<String, Object> result = analyticsAiService.getAnomalyDetection("revenue", "last_30_days");
        assertNotNull(result);
        assertEquals("revenue", result.get("metric"));
        assertNotNull(result.get("anomalies"));
        assertNotNull(result.get("overallHealth"));
    }

    @Test
    void testGetCohortAnalysis_ReturnsCohorts() {
        Map<String, Object> result = analyticsAiService.getCohortAnalysis("weekly", "last_2_months");
        assertNotNull(result);
        assertEquals("weekly", result.get("cohortType"));
        assertNotNull(result.get("cohorts"));
    }

    @Test
    void testGetFunnelAnalysis_ReturnsFunnel() {
        Map<String, Object> result = analyticsAiService.getFunnelAnalysis("purchase", "last_30_days");
        assertNotNull(result);
        assertEquals("purchase", result.get("funnelType"));
        assertNotNull(result.get("stages"));
    }

    @Test
    void testGetSalesPrediction_ReturnsPrediction() {
        Map<String, Object> result = analyticsAiService.getSalesPrediction(7);
        assertNotNull(result);
        assertTrue((double) result.get("predictedRevenue") > 0);
    }

    @Test
    void testGetInventoryPrediction_ReturnsPredictions() {
        Map<String, Object> result = analyticsAiService.getInventoryPrediction(7);
        assertNotNull(result);
        assertNotNull(result.get("predictions"));
    }

    @Test
    void testGetDashboardSummary_ReturnsSummary() {
        Map<String, Object> result = analyticsAiService.getDashboardSummary();
        assertNotNull(result);
        assertTrue((double) result.get("totalRevenue") > 0);
        assertTrue((int) result.get("totalOrders") > 0);
    }

    @Test
    void testGetGrowthSuggestions_ReturnsSuggestions() {
        Map<String, Object> result = analyticsAiService.getGrowthSuggestions();
        assertNotNull(result);
        assertNotNull(result.get("suggestions"));
    }

    @Test
    void testTrainModels_ReturnsSuccess() {
        Map<String, Object> result = analyticsAiService.trainModels(Map.of("modelType", "ANALYTICS"));
        assertNotNull(result);
        assertEquals("TRAINING_COMPLETED", result.get("status"));
        assertNotNull(result.get("metrics"));
    }
}
