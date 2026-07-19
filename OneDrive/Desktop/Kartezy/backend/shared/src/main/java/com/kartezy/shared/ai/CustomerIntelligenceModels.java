package com.kartezy.shared.ai;

import java.util.*;

public class CustomerIntelligenceModels {

    public static class CustomerProfile {
        private String customerId;
        private double lifetimeValue;
        private double averageOrderValue;
        private double purchaseFrequency;
        private double recency;
        private String customerSegment;
        private List<String> preferredCategories;
        private List<String> preferredBrands;
        private Map<String, Integer> categoryPurchaseCounts;
        private Map<String, Object> communicationPreferences;
        private double engagementScore;
        private double loyaltyScore;
        private String loyaltyTier;

        public CustomerProfile(String customerId) {
            this.customerId = customerId;
            this.preferredCategories = new ArrayList<>();
            this.preferredBrands = new ArrayList<>();
            this.categoryPurchaseCounts = new HashMap<>();
            this.communicationPreferences = new HashMap<>();
        }

        public String getCustomerId() { return customerId; }
        public double getLifetimeValue() { return lifetimeValue; }
        public void setLifetimeValue(double lifetimeValue) { this.lifetimeValue = lifetimeValue; }
        public double getAverageOrderValue() { return averageOrderValue; }
        public void setAverageOrderValue(double averageOrderValue) { this.averageOrderValue = averageOrderValue; }
        public double getPurchaseFrequency() { return purchaseFrequency; }
        public void setPurchaseFrequency(double purchaseFrequency) { this.purchaseFrequency = purchaseFrequency; }
        public double getRecency() { return recency; }
        public void setRecency(double recency) { this.recency = recency; }
        public String getCustomerSegment() { return customerSegment; }
        public void setCustomerSegment(String customerSegment) { this.customerSegment = customerSegment; }
        public List<String> getPreferredCategories() { return preferredCategories; }
        public List<String> getPreferredBrands() { return preferredBrands; }
        public Map<String, Integer> getCategoryPurchaseCounts() { return categoryPurchaseCounts; }
        public Map<String, Object> getCommunicationPreferences() { return communicationPreferences; }
        public double getEngagementScore() { return engagementScore; }
        public void setEngagementScore(double engagementScore) { this.engagementScore = engagementScore; }
        public double getLoyaltyScore() { return loyaltyScore; }
        public void setLoyaltyScore(double loyaltyScore) { this.loyaltyScore = loyaltyScore; }
        public String getLoyaltyTier() { return loyaltyTier; }
        public void setLoyaltyTier(String loyaltyTier) { this.loyaltyTier = loyaltyTier; }
    }

    public static class CustomerSegment {
        private String segmentId;
        private String segmentName;
        private List<String> customerIds;
        private int customerCount;
        private double averageLifetimeValue;
        private double averageOrderValue;
        private double churnRate;
        private Map<String, Object> characteristics;
        private List<String> recommendedStrategies;

        public CustomerSegment(String segmentId, String segmentName) {
            this.segmentId = segmentId;
            this.segmentName = segmentName;
            this.customerIds = new ArrayList<>();
            this.characteristics = new HashMap<>();
            this.recommendedStrategies = new ArrayList<>();
        }

        public String getSegmentId() { return segmentId; }
        public String getSegmentName() { return segmentName; }
        public List<String> getCustomerIds() { return customerIds; }
        public int getCustomerCount() { return customerCount; }
        public void setCustomerCount(int customerCount) { this.customerCount = customerCount; }
        public double getAverageLifetimeValue() { return averageLifetimeValue; }
        public void setAverageLifetimeValue(double averageLifetimeValue) { this.averageLifetimeValue = averageLifetimeValue; }
        public double getAverageOrderValue() { return averageOrderValue; }
        public void setAverageOrderValue(double averageOrderValue) { this.averageOrderValue = averageOrderValue; }
        public double getChurnRate() { return churnRate; }
        public void setChurnRate(double churnRate) { this.churnRate = churnRate; }
        public Map<String, Object> getCharacteristics() { return characteristics; }
        public List<String> getRecommendedStrategies() { return recommendedStrategies; }
    }

    public static class CLVPrediction {
        private String customerId;
        private double predictedCLV;
        private double confidence;
        private double expectedValueNextMonth;
        private double expectedValueNextQuarter;
        private double expectedValueNextYear;
        private Map<String, Double> factorContributions;

        public CLVPrediction(String customerId) {
            this.customerId = customerId;
            this.factorContributions = new HashMap<>();
        }

        public String getCustomerId() { return customerId; }
        public double getPredictedCLV() { return predictedCLV; }
        public void setPredictedCLV(double predictedCLV) { this.predictedCLV = predictedCLV; }
        public double getConfidence() { return confidence; }
        public void setConfidence(double confidence) { this.confidence = confidence; }
        public double getExpectedValueNextMonth() { return expectedValueNextMonth; }
        public void setExpectedValueNextMonth(double expectedValueNextMonth) { this.expectedValueNextMonth = expectedValueNextMonth; }
        public double getExpectedValueNextQuarter() { return expectedValueNextQuarter; }
        public void setExpectedValueNextQuarter(double expectedValueNextQuarter) { this.expectedValueNextQuarter = expectedValueNextQuarter; }
        public double getExpectedValueNextYear() { return expectedValueNextYear; }
        public void setExpectedValueNextYear(double expectedValueNextYear) { this.expectedValueNextYear = expectedValueNextYear; }
        public Map<String, Double> getFactorContributions() { return factorContributions; }
    }

    public static class ChurnPrediction {
        private String customerId;
        private double churnProbability;
        private String churnRiskLevel;
        private List<String> riskFactors;
        private List<String> recommendedActions;
        private double expectedDaysUntilChurn;

        public ChurnPrediction(String customerId, double churnProbability) {
            this.customerId = customerId;
            this.churnProbability = churnProbability;
            this.riskFactors = new ArrayList<>();
            this.recommendedActions = new ArrayList<>();
            this.churnRiskLevel = churnProbability < 0.3 ? "LOW" : churnProbability < 0.6 ? "MEDIUM" : "HIGH";
        }

        public String getCustomerId() { return customerId; }
        public double getChurnProbability() { return churnProbability; }
        public String getChurnRiskLevel() { return churnRiskLevel; }
        public List<String> getRiskFactors() { return riskFactors; }
        public List<String> getRecommendedActions() { return recommendedActions; }
        public double getExpectedDaysUntilChurn() { return expectedDaysUntilChurn; }
        public void setExpectedDaysUntilChurn(double expectedDaysUntilChurn) { this.expectedDaysUntilChurn = expectedDaysUntilChurn; }
    }

    public static class NextPurchasePrediction {
        private String customerId;
        private String predictedProductId;
        private String predictedCategory;
        private double expectedDaysUntilNextPurchase;
        private double confidence;
        private List<String> likelyProducts;
        private Map<String, Double> categoryProbabilities;

        public NextPurchasePrediction(String customerId) {
            this.customerId = customerId;
            this.likelyProducts = new ArrayList<>();
            this.categoryProbabilities = new HashMap<>();
        }

        public String getCustomerId() { return customerId; }
        public String getPredictedProductId() { return predictedProductId; }
        public void setPredictedProductId(String predictedProductId) { this.predictedProductId = predictedProductId; }
        public String getPredictedCategory() { return predictedCategory; }
        public void setPredictedCategory(String predictedCategory) { this.predictedCategory = predictedCategory; }
        public double getExpectedDaysUntilNextPurchase() { return expectedDaysUntilNextPurchase; }
        public void setExpectedDaysUntilNextPurchase(double expectedDaysUntilNextPurchase) { this.expectedDaysUntilNextPurchase = expectedDaysUntilNextPurchase; }
        public double getConfidence() { return confidence; }
        public void setConfidence(double confidence) { this.confidence = confidence; }
        public List<String> getLikelyProducts() { return likelyProducts; }
        public Map<String, Double> getCategoryProbabilities() { return categoryProbabilities; }
    }

    public static class PersonalizedOffer {
        private String offerId;
        private String customerId;
        private String offerType;
        private String description;
        private double discountValue;
        private double expectedRedemptionProbability;
        private double expectedRevenueImpact;
        private String validUntil;
        private Map<String, Object> conditions;

        public PersonalizedOffer(String offerId, String customerId, String offerType, double discountValue) {
            this.offerId = offerId;
            this.customerId = customerId;
            this.offerType = offerType;
            this.discountValue = discountValue;
        }

        public String getOfferId() { return offerId; }
        public String getCustomerId() { return customerId; }
        public String getOfferType() { return offerType; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public double getDiscountValue() { return discountValue; }
        public double getExpectedRedemptionProbability() { return expectedRedemptionProbability; }
        public void setExpectedRedemptionProbability(double expectedRedemptionProbability) { this.expectedRedemptionProbability = expectedRedemptionProbability; }
        public double getExpectedRevenueImpact() { return expectedRevenueImpact; }
        public void setExpectedRevenueImpact(double expectedRevenueImpact) { this.expectedRevenueImpact = expectedRevenueImpact; }
        public String getValidUntil() { return validUntil; }
        public void setValidUntil(String validUntil) { this.validUntil = validUntil; }
        public Map<String, Object> getConditions() { return conditions; }
        public void setConditions(Map<String, Object> conditions) { this.conditions = conditions; }
    }

    public static class EngagementScore {
        private String customerId;
        private double score;
        private String level;
        private Map<String, Double> componentScores;
        private List<String> improvementSuggestions;

        public EngagementScore(String customerId, double score) {
            this.customerId = customerId;
            this.score = score;
            this.level = score >= 0.7 ? "HIGH" : score >= 0.4 ? "MEDIUM" : "LOW";
            this.componentScores = new HashMap<>();
            this.improvementSuggestions = new ArrayList<>();
        }

        public String getCustomerId() { return customerId; }
        public double getScore() { return score; }
        public String getLevel() { return level; }
        public Map<String, Double> getComponentScores() { return componentScores; }
        public List<String> getImprovementSuggestions() { return improvementSuggestions; }
    }
}
