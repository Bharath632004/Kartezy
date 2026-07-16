package com.kartezy.pricingservice.controller;

import com.kartezy.pricingservice.service.DynamicPricingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pricing")
public class PricingController {

    @Autowired
    private DynamicPricingService pricingService;

    @GetMapping("/price")
    public ResponseEntity<Map<String, Object>> getDynamicPrice(
            @RequestParam String productId,
            @RequestParam String storeId,
            @RequestParam String userId) {
        return ResponseEntity.ok(pricingService.getDynamicPrice(productId, storeId, userId));
    }

    @GetMapping("/price/batch")
    public ResponseEntity<List<Map<String, Object>>> getDynamicPrices(
            @RequestParam List<String> productIds,
            @RequestParam String storeId,
            @RequestParam String userId) {
        return ResponseEntity.ok(pricingService.getDynamicPrices(productIds, storeId, userId));
    }

    @GetMapping("/rules")
    public ResponseEntity<List<Map<String, Object>>> getPricingRules(
            @RequestParam String storeId) {
        return ResponseEntity.ok(pricingService.getPricingRules(storeId));
    }

    @PostMapping("/price/simulate")
    public ResponseEntity<Map<String, Object>> simulatePriceChange(
            @RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(pricingService.simulatePriceChange(request));
    }

    @GetMapping("/price/history")
    public ResponseEntity<List<Map<String, Object>>> getPriceHistory(
            @RequestParam String productId,
            @RequestParam String storeId,
            @RequestParam(defaultValue = "30") int daysBack) {
        return ResponseEntity.ok(pricingService.getPriceHistory(productId, storeId, daysBack));
    }

    @PostMapping("/price/update")
    public ResponseEntity<Map<String, String>> updatePrices(
            @RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(pricingService.updatePrices(request));
    }

    @GetMapping("/price/competitor")
    public ResponseEntity<Map<String, Object>> getCompetitorPrice(
            @RequestParam String productId,
            @RequestParam String competitorId) {
        return ResponseEntity.ok(pricingService.getCompetitorPrice(productId, competitorId));
    }

    @GetMapping("/promotions/suggestions")
    public ResponseEntity<List<Map<String, Object>>> getPromotionSuggestions(
            @RequestParam String storeId) {
        return ResponseEntity.ok(pricingService.getPromotionSuggestions(storeId));
    }

    @GetMapping("/discount/optimize")
    public ResponseEntity<Map<String, Object>> getDiscountOptimization(
            @RequestParam String productId,
            @RequestParam String storeId) {
        return ResponseEntity.ok(pricingService.getDiscountOptimization(productId, storeId));
    }

    @GetMapping("/festival")
    public ResponseEntity<List<Map<String, Object>>> getFestivalPricing(
            @RequestParam String storeId) {
        return ResponseEntity.ok(pricingService.getFestivalPricing(storeId));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "pricing-service"));
    }
}
