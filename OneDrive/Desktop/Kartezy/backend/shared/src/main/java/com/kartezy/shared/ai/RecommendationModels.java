package com.kartezy.shared.ai;

import java.time.Instant;
import java.util.*;

public class RecommendationModels {

    public static class RecommendationRequest {
        private String userId;
        private String context;
        private int limit = 10;
        private List<String> excludeIds;
        private Map<String, Object> filters;
        private String recommendationType;

        public RecommendationRequest() {}

        public RecommendationRequest(String userId, String context, int limit) {
            this.userId = userId;
            this.context = context;
            this.limit = limit;
        }

        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        public String getContext() { return context; }
        public void setContext(String context) { this.context = context; }
        public int getLimit() { return limit; }
        public void setLimit(int limit) { this.limit = limit; }
        public List<String> getExcludeIds() { return excludeIds; }
        public void setExcludeIds(List<String> excludeIds) { this.excludeIds = excludeIds; }
        public Map<String, Object> getFilters() { return filters; }
        public void setFilters(Map<String, Object> filters) { this.filters = filters; }
        public String getRecommendationType() { return recommendationType; }
        public void setRecommendationType(String recommendationType) { this.recommendationType = recommendationType; }
    }

    public static class RecommendationResult {
        private String id;
        private String type;
        private String itemId;
        private double score;
        private String reason;
        private Map<String, Object> metadata;
        private double confidence;

        public RecommendationResult() {}

        public RecommendationResult(String id, String type, String itemId, double score, String reason, double confidence) {
            this.id = id;
            this.type = type;
            this.itemId = itemId;
            this.score = score;
            this.reason = reason;
            this.confidence = confidence;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getItemId() { return itemId; }
        public void setItemId(String itemId) { this.itemId = itemId; }
        public double getScore() { return score; }
        public void setScore(double score) { this.score = score; }
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
        public Map<String, Object> getMetadata() { return metadata; }
        public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
        public double getConfidence() { return confidence; }
        public void setConfidence(double confidence) { this.confidence = confidence; }
    }

    public static class ProductScore {
        private String productId;
        private double score;
        private Map<String, Double> featureScores;

        public ProductScore(String productId, double score) {
            this.productId = productId;
            this.score = score;
            this.featureScores = new HashMap<>();
        }

        public String getProductId() { return productId; }
        public double getScore() { return score; }
        public void setScore(double score) { this.score = score; }
        public Map<String, Double> getFeatureScores() { return featureScores; }
        public void addFeatureScore(String name, double value) { featureScores.put(name, value); }
    }

    public static class UserItemMatrix {
        private final Map<String, Map<String, Double>> matrix = new HashMap<>();

        public void addInteraction(String userId, String itemId, double rating) {
            matrix.computeIfAbsent(userId, k -> new HashMap<>()).put(itemId, rating);
        }

        public Map<String, Double> getUserInteractions(String userId) {
            return matrix.getOrDefault(userId, Collections.emptyMap());
        }

        public Set<String> getAllUsers() { return matrix.keySet(); }

        public Set<String> getItemsForUser(String userId) {
            return matrix.getOrDefault(userId, Collections.emptyMap()).keySet();
        }

        public double getRating(String userId, String itemId) {
            Map<String, Double> userInteractions = matrix.get(userId);
            return userInteractions != null ? userInteractions.getOrDefault(itemId, 0.0) : 0.0;
        }
    }

    public static class FrequentlyBoughtTogether {
        private String productId;
        private List<String> pairedProductIds;
        private double confidence;
        private double lift;

        public FrequentlyBoughtTogether(String productId, List<String> pairedProductIds, double confidence, double lift) {
            this.productId = productId;
            this.pairedProductIds = pairedProductIds;
            this.confidence = confidence;
            this.lift = lift;
        }

        public String getProductId() { return productId; }
        public List<String> getPairedProductIds() { return pairedProductIds; }
        public double getConfidence() { return confidence; }
        public double getLift() { return lift; }
    }

    public static class TrendingItem {
        private String itemId;
        private String itemType;
        private double trendScore;
        private double velocity;
        private String timeWindow;
        private long interactionCount;
        private double growthRate;

        public TrendingItem() {}

        public TrendingItem(String itemId, String itemType, double trendScore, double velocity,
                          String timeWindow, long interactionCount, double growthRate) {
            this.itemId = itemId;
            this.itemType = itemType;
            this.trendScore = trendScore;
            this.velocity = velocity;
            this.timeWindow = timeWindow;
            this.interactionCount = interactionCount;
            this.growthRate = growthRate;
        }

        public String getItemId() { return itemId; }
        public String getItemType() { return itemType; }
        public double getTrendScore() { return trendScore; }
        public double getVelocity() { return velocity; }
        public String getTimeWindow() { return timeWindow; }
        public long getInteractionCount() { return interactionCount; }
        public double getGrowthRate() { return growthRate; }
    }

    public static class SeasonalRecommendation {
        private String season;
        private String festival;
        private List<String> productIds;
        private Map<String, Double> relevanceScores;
        private Instant validFrom;
        private Instant validUntil;

        public SeasonalRecommendation(String season, List<String> productIds, Instant validFrom, Instant validUntil) {
            this.season = season;
            this.productIds = productIds;
            this.validFrom = validFrom;
            this.validUntil = validUntil;
            this.relevanceScores = new HashMap<>();
        }

        public String getSeason() { return season; }
        public String getFestival() { return festival; }
        public void setFestival(String festival) { this.festival = festival; }
        public List<String> getProductIds() { return productIds; }
        public Map<String, Double> getRelevanceScores() { return relevanceScores; }
        public Instant getValidFrom() { return validFrom; }
        public Instant getValidUntil() { return validUntil; }
    }

    public static class PersonalizedHomeFeed {
        private String userId;
        private List<HomeSection> sections;
        private Instant generatedAt;

        public PersonalizedHomeFeed(String userId, List<HomeSection> sections) {
            this.userId = userId;
            this.sections = sections;
            this.generatedAt = Instant.now();
        }

        public String getUserId() { return userId; }
        public List<HomeSection> getSections() { return sections; }
        public Instant getGeneratedAt() { return generatedAt; }
    }

    public static class HomeSection {
        private String sectionId;
        private String title;
        private String subtitle;
        private String type;
        private List<String> itemIds;
        private int position;
        private Map<String, Object> metadata;

        public HomeSection(String sectionId, String title, String type, List<String> itemIds, int position) {
            this.sectionId = sectionId;
            this.title = title;
            this.type = type;
            this.itemIds = itemIds;
            this.position = position;
        }

        public String getSectionId() { return sectionId; }
        public String getTitle() { return title; }
        public String getSubtitle() { return subtitle; }
        public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
        public String getType() { return type; }
        public List<String> getItemIds() { return itemIds; }
        public int getPosition() { return position; }
        public Map<String, Object> getMetadata() { return metadata; }
        public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
    }
}
