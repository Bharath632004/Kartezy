package com.kartezy.recommendationservice.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RecommendationService {
    @Autowired private RecommendationEngine recommendationEngine;

    public List<String> getPersonalizedRecommendations(String userId, int limit) {
        return recommendationEngine.getPersonalizedRecommendations(userId, limit).stream().map(Object::toString).collect(Collectors.toList());
    }

    public List<String> getSimilarProducts(String productId, int limit) {
        try { return recommendationEngine.getSimilarProducts(Long.parseLong(productId), limit).stream().map(Object::toString).collect(Collectors.toList());
        } catch (NumberFormatException e) { return List.of(); }
    }

    public List<String> getFrequentlyBoughtTogether(String productId, int limit) {
        try { return recommendationEngine.getFrequentlyBoughtTogether(Long.parseLong(productId), limit).stream().map(Object::toString).collect(Collectors.toList());
        } catch (NumberFormatException e) { return List.of(); }
    }

    public List<String> getTrendingProducts(int limit) {
        return recommendationEngine.getTrendingProducts(limit).stream().map(Object::toString).collect(Collectors.toList());
    }

    public List<String> getContextualRecommendations(String userId, int limit) {
        return recommendationEngine.getContextualRecommendations(userId, limit).stream().map(Object::toString).collect(Collectors.toList());
    }

    // === NEW: Cross-sell ===
    public List<String> getCrossSellRecommendations(String userId, int limit) {
        return recommendationEngine.getCrossSellRecommendations(userId, limit).stream().map(Object::toString).collect(Collectors.toList());
    }

    // === NEW: Upsell ===
    public List<String> getUpsellRecommendations(String userId, int limit) {
        return recommendationEngine.getUpsellRecommendations(userId, limit).stream().map(Object::toString).collect(Collectors.toList());
    }

    // === NEW: Festival recommendations ===
    public List<String> getFestivalRecommendations(String userId, int limit) {
        return recommendationEngine.getFestivalRecommendations(userId, limit).stream().map(Object::toString).collect(Collectors.toList());
    }

    // === NEW: Continue shopping ===
    public List<String> getContinueShopping(String userId, int limit) {
        return recommendationEngine.getContinueShopping(userId, limit).stream().map(Object::toString).collect(Collectors.toList());
    }

    // === NEW: Personalized home feed ===
    public Map<String, List<String>> getPersonalizedHomeFeed(String userId, int limit) {
        Map<String, List<Long>> feed = recommendationEngine.getPersonalizedHomeFeed(userId, limit);
        return feed.entrySet().stream().collect(Collectors.toMap(
                Map.Entry::getKey,
                e -> e.getValue().stream().map(Object::toString).collect(Collectors.toList())
        ));
    }
}
