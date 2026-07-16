package com.kartezy.analyticsservice.service;

import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class AnalyticsAiService {

    public Map<String, Object> generateBusinessInsights(Map<String, Object> params) {
        String timeRange = (String) params.getOrDefault("timeRange", "last_30_days");
        return getBusinessInsights(timeRange);
    }

    public Map<String, Object> generateCustomerInsights(Map<String, Object> params) {
        String timeRange = (String) params.getOrDefault("timeRange", "last_30_days");
        return getCustomerInsights(timeRange);
    }

    public Map<String, Object> generateMerchantInsights(Map<String, Object> params) {
        String merchantId = (String) params.getOrDefault("merchantId", "default");
        String timeRange = (String) params.getOrDefault("timeRange", "last_30_days");
        return getMerchantInsights(merchantId, timeRange);
    }

    public Map<String, Object> generateDeliveryInsights(Map<String, Object> params) {
        String timeRange = (String) params.getOrDefault("timeRange", "last_30_days");
        return getDeliveryInsights(timeRange);
    }

    public Map<String, Object> generateMarketingInsights(Map<String, Object> params) {
        String timeRange = (String) params.getOrDefault("timeRange", "last_30_days");
        return getMarketingInsights(timeRange);
    }

    public Map<String, Object> generateOperationalInsights(Map<String, Object> params) {
        String timeRange = (String) params.getOrDefault("timeRange", "last_30_days");
        return getOperationalInsights(timeRange);
    }

    public Map<String, Object> predictiveAnalytics(Map<String, Object> params) {
        int daysAhead = (int) params.getOrDefault("daysAhead", 30);
        return getSalesPrediction(daysAhead);
    }
}
