package com.kartezy.recommendationservice.service;

import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service for generating recommendations.
 * <b>recommendations</b>.
 * <p>
 * This service is a placeholder and does not contain a real recommendation model.
 * Implementations should plug in a real machine learning model (e.g., collaborative filtering, content-based, hybrid).
 * </p>
 */
@Service
public class RecommendationService {

    /**
     * Get personalized recommendations for a user.
     * @param userId the user ID
     * @param limit maximum number of recommendations
     * @return list of recommended product IDs
     * @throws UnsupportedOperationException if the recommendation model is not implemented
     */
    public List<String> getPersonalizedRecommendations(String userId, int limit) {
        throw new UnsupportedOperationException("Personalized recommendation model not implemented. Please integrate a collaborative filtering or hybrid model.");
    }

    /**
     * Get product recommendations based on product similarity (content-based).
     * @param productId the product ID
     * @param limit maximum number of recommendations
     * @return list of similar product IDs
     * @throws UnsupportedOperationException if the recommendation model is not implemented
     */
    public List<String> getSimilarProducts(String productId, int limit) {
        throw new UnsupportedOperationException("Product similarity model not implemented. Please integrate a content-based model (e.g., using item features, embeddings).");
    }

    /**
     * Get frequently bought together items for a product.
     * @param productId the product ID
     * @param limit maximum number of recommendations
     * @return list of product IDs that are frequently bought together
     * @throws UnsupportedOperationException if the recommendation model is not implemented
     */
    public List<String> getFrequentlyBoughtTogether(String productId, int limit) {
        throw new UnsupportedOperationException("Frequently bought together model not implemented. Please implement association rule mining (e.g., Apriori) on transaction data.");
    }

    /**
     * Get trending products.
     * @param limit maximum number of recommendations
     * @return list of trending product IDs
     * @throws UnsupportedOperationException if the recommendation model is not implemented
     */
    public List<String> getTrendingProducts(int limit) {
        throw new UnsupportedOperationException("Trending products model not implemented. Please implement a popularity-based model with time decay.");
    }

    /**
     * Get recommendations based on user's recent activity (browsing, cart, wishlist).
     * @param userId the user ID
     * @param limit maximum number of recommendations
     * @return list of recommended product IDs
     * @throws UnsupportedOperationException if the recommendation model is not implemented
     */
    public List<String> getContextualRecommendations(String userId, int limit) {
        throw new UnsupportedOperationException("Contextual recommendation model not implemented. Please implement a session-based or hybrid model.");
    }
}