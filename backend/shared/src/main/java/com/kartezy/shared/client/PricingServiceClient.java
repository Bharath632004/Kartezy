package com.kartezy.shared.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@FeignClient(name = "pricing-service", path = "/pricing")
public interface PricingServiceClient {

    @GetMapping("/price")
    Map<String, Object> getDynamicPrice(@RequestParam String productId,
                                        @RequestParam String storeId,
                                        @RequestParam String userId);

    @GetMapping("/price/batch")
    List<Map<String, Object>> getDynamicPrices(@RequestParam List<String> productIds,
                                               @RequestParam String storeId,
                                               @RequestParam String userId);

    @GetMapping("/rules")
    List<Map<String, Object>> getPricingRules(@RequestParam String storeId);

    @PostMapping("/price/simulate")
    Map<String, Object> simulatePriceChange(@RequestBody Map<String, Object> request);

    @GetMapping("/price/history")
    List<Map<String, Object>> getPriceHistory(@RequestParam String productId,
                                              @RequestParam String storeId,
                                              @RequestParam(defaultValue = "30") int daysBack);

    @PostMapping("/price/update")
    Map<String, String> updatePrices(@RequestBody Map<String, Object> request);

    @GetMapping("/price/competitor")
    Map<String, Object> getCompetitorPrice(@RequestParam String productId,
                                           @RequestParam String competitorId);

    @GetMapping("/promotions/suggestions")
    List<Map<String, Object>> getPromotionSuggestions(@RequestParam String storeId);

    @GetMapping("/discount/optimize")
    Map<String, Object> getDiscountOptimization(@RequestParam String productId,
                                                @RequestParam String storeId);

    @GetMapping("/festival")
    List<Map<String, Object>> getFestivalPricing(@RequestParam String storeId);
}
