package com.kartezy.recommendationservice.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
/**
 * Service for generating recommendations.
 * Implements personalized recommendations, product similarity, frequently bought together,
 * trending products, and contextual recommendations using content-based filtering.
 */
@Service
public class RecommendationService {
    @Autowired
    private RecommendationEngine recommendationEngine;
    /**
     * Get personalized recommendations for a user using content-based filtering.
     * @param userId the user ID (UUID string)
     * @param limit maximum number of recommendations
     * @return list of recommended product IDs as strings
     */
    public List<String> getPersonalizedRecommendations(String userId, int limit) {
        List<Long> recommendedIds = recommendationEngine.getPersonalizedRecommendations(userId, limit);
        return recommendedIds.stream()
                .map(Object::toString)
                .collect(Collectors.toList());
    }
    /**
     * Get product recommendations based on product similarity (content-based).
     * @param productId the product ID as string
     * @param limit maximum number of recommendations
     * @return list of similar product IDs as strings
     */
    public List<String> getSimilarProducts(String productId, int limit) {
        try {
            Long id = Long.parseLong(productId);
            List<Long> similarIds = recommendationEngine.getSimilarProducts(id, limit);
            return similarIds.stream()
                    .map(Object::toString)
                    .collect(Collectors.toList());
        } catch (NumberFormatException e) {
            return List.of();
        }
    }
    /**
     * Get frequently bought together items for a product.
     * This implementation uses association rules on order items (simplified).
     * @param productId the product ID as string
     * @param limit maximum number of recommendations
     * @return list of product IDs that are frequently bought together as strings
     */
    public List<String> getFrequentlyBoughtTogether(String productId, int limit) {
        try {
            Long id = Long.parseLong(productId);
            // For now, return empty list as we need order-items data from order-service
            // In a full implementation, we would query order-service for order items
            // and apply association rule mining (e.g., Apriori algorithm)
            List<Long> fbtIds = recommendationEngine.getFrequentlyBoughtTogether(id, limit);
            return fbtIds.stream()
                    .map(Object::toString)
                    .collect(Collectors.toList());
        } catch (NumberFormatException e) {
            return List.of();
        }
    }
    /**
     * Get trending products based on recent interactions and popularity.
     * @param limit maximum number of recommendations
     * @return list of trending product IDs as strings
     */
    public List<String> getTrendingProducts(int limit) {
        List<Long> trendingIds = recommendationEngine.getTrendingProducts(limit);
        return trendingIds.stream()
                .map(Object::toString)
                .collect(Collectors.toList());
    }
    /**
     * Get recommendations based on user's recent activity (browsing, cart, wishlist).
     * Uses the same content-based filtering as personalized recommendations.
     * @param userId the user ID (UUID string)
     * @param limit maximum number of recommendations
     * @return list of recommended product IDs as strings
     */
    public List<String> getContextualRecommendations(String userId, int limit) {
        List<Long> recommendedIds = recommendationEngine.getContextualRecommendations(userId, limit);
        return recommendedIds.stream()
                .map(Object::toString)
                .collect(Collectors.toList());
    }
}