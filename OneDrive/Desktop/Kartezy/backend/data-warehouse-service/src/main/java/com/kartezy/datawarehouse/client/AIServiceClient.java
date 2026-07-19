package com.kartezy.datawarehouse.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.Map;

@FeignClient(name = "ai-service", path = "/api/ai")
public interface AIServiceClient {
    @GetMapping("/forecasting/revenue")
    Map<String, Object> getRevenueForecast(@RequestParam("period") String period);
    @GetMapping("/forecasting/demand")
    Map<String, Object> getDemandForecast(@RequestParam("productId") String productId);
    @GetMapping("/analytics/customer-insights")
    Map<String, Object> getCustomerInsights(@RequestParam("customerId") String customerId);
    @GetMapping("/analytics/churn-prediction")
    Map<String, Object> getChurnPrediction();
    @GetMapping("/analytics/clv")
    Map<String, Object> getCustomerLifetimeValue();
    @GetMapping("/analytics/merchant-insights")
    Map<String, Object> getMerchantInsights(@RequestParam("merchantId") String merchantId);
}
