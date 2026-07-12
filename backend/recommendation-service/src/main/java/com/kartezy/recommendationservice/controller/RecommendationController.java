package com.kartezy.recommendationservice.controller;

import com.kartezy.recommendationservice.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for recommendation service.
 * Provides endpoints for personalized recommendations, product similarity, trending items, etc.
 */
@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    /**
     * Get personalized recommendations for a user.
     * @param userId the user ID
     * @param limit maximum number of recommendations (optional, default 10)
     * @return list of recommended product IDs
     */
    @GetMapping("/personalized/{userId}")
    public ResponseEntity<List<String>> getPersonalizedRecommendations(
            @PathVariable String userId,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(recommendationService.getPersonalizedRecommendations(userId, limit));
    }

    /**
     * Get products similar to a given product.
     * @param productId the product ID
     * @param limit maximum number of recommendations (optional, default 10)
     * @return list of similar product IDs
     */
    @GetMapping("/similar/{productId}")
    public ResponseEntity<List<String>> getSimilarProducts(
            @PathVariable String productId,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(recommendationService.getSimilarProducts(productId, limit));
    }

    /**
     * Get frequently bought together items for a product.
     * @param productId the product ID
     * @param limit maximum number of recommendations (optional, default 10)
     * @return list of product IDs that are frequently bought together
     */
    @GetMapping("/fbt/{productId}")
    public ResponseEntity<List<String>> getFrequentlyBoughtTogether(
            @PathVariable String productId,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(recommendationService.getFrequentlyBoughtTogether(productId, limit));
    }

    /**
     * Get trending products.
     * @param limit maximum number of recommendations (optional, default 10)
     * @return list of trending product IDs
     */
    @GetMapping("/trending")
    public ResponseEntity<List<String>> getTrendingProducts(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(recommendationService.getTrendingProducts(limit));
    }

    /**
     * Get contextual recommendations based on user's recent activity.
     * @param userId the user ID
     * @param limit maximum number of recommendations (optional, default 10)
     * @return list of recommended product IDs
     */
    @GetMapping("/contextual/{userId}")
    public ResponseEntity<List<String>> getContextualRecommendations(
            @PathVariable String userId,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(recommendationService.getContextualRecommendations(userId, limit));
    }
}