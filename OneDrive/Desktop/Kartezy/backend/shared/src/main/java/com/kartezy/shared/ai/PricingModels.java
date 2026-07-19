package com.kartezy.shared.ai;

import java.util.*;

public class PricingModels {

    public static class PriceRequest {
        private String productId;
        private String storeId;
        private String userId;
        private String categoryId;
        private int quantity;
        private Map<String, Object> context;

        public PriceRequest() {}

        public String getProductId() { return productId; }
        public void setProductId(String productId) { this.productId = productId; }
        public String getStoreId() { return storeId; }
        public void setStoreId(String storeId) { this.storeId = storeId; }
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        public String getCategoryId() { return categoryId; }
        public void setCategoryId(String categoryId) { this.categoryId = categoryId; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
        public Map<String, Object> getContext() { return context; }
        public void setContext(Map<String, Object> context) { this.context = context; }
    }

    public static class DynamicPrice {
        private String productId;
        private double basePrice;
        private double finalPrice;
        private double discountPercentage;
        private double competitorPrice;
        private double demandMultiplier;
        private double inventoryMultiplier;
        private double timeMultiplier;
        private double userSegmentMultiplier;
        private Map<String, Object> factors;
        private String validUntil;
        private List<PriceTier> tiers;

        public DynamicPrice(String productId, double basePrice) {
            this.productId = productId;
            this.basePrice = basePrice;
            this.finalPrice = basePrice;
            this.demandMultiplier = 1.0;
            this.inventoryMultiplier = 1.0;
            this.timeMultiplier = 1.0;
            this.userSegmentMultiplier = 1.0;
        }

        public String getProductId() { return productId; }
        public double getBasePrice() { return basePrice; }
        public double getFinalPrice() { return finalPrice; }
        public void setFinalPrice(double finalPrice) { this.finalPrice = finalPrice; }
        public double getDiscountPercentage() { return discountPercentage; }
        public void setDiscountPercentage(double discountPercentage) { this.discountPercentage = discountPercentage; }
        public double getCompetitorPrice() { return competitorPrice; }
        public void setCompetitorPrice(double competitorPrice) { this.competitorPrice = competitorPrice; }
        public double getDemandMultiplier() { return demandMultiplier; }
        public void setDemandMultiplier(double demandMultiplier) { this.demandMultiplier = demandMultiplier; }
        public double getInventoryMultiplier() { return inventoryMultiplier; }
        public void setInventoryMultiplier(double inventoryMultiplier) { this.inventoryMultiplier = inventoryMultiplier; }
        public double getTimeMultiplier() { return timeMultiplier; }
        public void setTimeMultiplier(double timeMultiplier) { this.timeMultiplier = timeMultiplier; }
        public double getUserSegmentMultiplier() { return userSegmentMultiplier; }
        public void setUserSegmentMultiplier(double userSegmentMultiplier) { this.userSegmentMultiplier = userSegmentMultiplier; }
        public Map<String, Object> getFactors() { return factors; }
        public void setFactors(Map<String, Object> factors) { this.factors = factors; }
        public String getValidUntil() { return validUntil; }
        public void setValidUntil(String validUntil) { this.validUntil = validUntil; }
        public List<PriceTier> getTiers() { return tiers; }
        public void setTiers(List<PriceTier> tiers) { this.tiers = tiers; }
    }

    public static class PriceTier {
        private int minQuantity;
        private int maxQuantity;
        private double unitPrice;
        private double discount;

        public PriceTier(int minQuantity, int maxQuantity, double unitPrice, double discount) {
            this.minQuantity = minQuantity;
            this.maxQuantity = maxQuantity;
            this.unitPrice = unitPrice;
            this.discount = discount;
        }

        public int getMinQuantity() { return minQuantity; }
        public int getMaxQuantity() { return maxQuantity; }
        public double getUnitPrice() { return unitPrice; }
        public double getDiscount() { return discount; }
    }

    public static class PromotionSuggestion {
        private String promotionType;
        private String productId;
        private double suggestedDiscount;
        private double expectedRevenueImpact;
        private double expectedVolumeImpact;
        private String timing;
        private double confidence;
        private String reason;

        public PromotionSuggestion(String promotionType, String productId, double suggestedDiscount,
                                 double expectedRevenueImpact, double confidence) {
            this.promotionType = promotionType;
            this.productId = productId;
            this.suggestedDiscount = suggestedDiscount;
            this.expectedRevenueImpact = expectedRevenueImpact;
            this.confidence = confidence;
        }

        public String getPromotionType() { return promotionType; }
        public String getProductId() { return productId; }
        public double getSuggestedDiscount() { return suggestedDiscount; }
        public double getExpectedRevenueImpact() { return expectedRevenueImpact; }
        public double getExpectedVolumeImpact() { return expectedVolumeImpact; }
        public void setExpectedVolumeImpact(double expectedVolumeImpact) { this.expectedVolumeImpact = expectedVolumeImpact; }
        public String getTiming() { return timing; }
        public void setTiming(String timing) { this.timing = timing; }
        public double getConfidence() { return confidence; }
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }

    public static class PricingRule {
        private String ruleId;
        private String name;
        private String type;
        private String condition;
        private Map<String, Object> parameters;
        private double priority;
        private boolean active;
        private String storeId;
        private String categoryId;
        private List<String> productIds;

        public PricingRule(String ruleId, String name, String type) {
            this.ruleId = ruleId;
            this.name = name;
            this.type = type;
            this.active = true;
        }

        public String getRuleId() { return ruleId; }
        public String getName() { return name; }
        public String getType() { return type; }
        public String getCondition() { return condition; }
        public void setCondition(String condition) { this.condition = condition; }
        public Map<String, Object> getParameters() { return parameters; }
        public void setParameters(Map<String, Object> parameters) { this.parameters = parameters; }
        public double getPriority() { return priority; }
        public void setPriority(double priority) { this.priority = priority; }
        public boolean isActive() { return active; }
        public void setActive(boolean active) { this.active = active; }
        public String getStoreId() { return storeId; }
        public void setStoreId(String storeId) { this.storeId = storeId; }
        public String getCategoryId() { return categoryId; }
        public void setCategoryId(String categoryId) { this.categoryId = categoryId; }
        public List<String> getProductIds() { return productIds; }
        public void setProductIds(List<String> productIds) { this.productIds = productIds; }
    }

    public static class PriceSimulation {
        private double currentPrice;
        private double newPrice;
        private double expectedDemandChange;
        private double expectedRevenueChange;
        private double priceElasticity;
        private double confidence;

        public PriceSimulation(double currentPrice, double newPrice) {
            this.currentPrice = currentPrice;
            this.newPrice = newPrice;
        }

        public double getCurrentPrice() { return currentPrice; }
        public double getNewPrice() { return newPrice; }
        public double getExpectedDemandChange() { return expectedDemandChange; }
        public void setExpectedDemandChange(double expectedDemandChange) { this.expectedDemandChange = expectedDemandChange; }
        public double getExpectedRevenueChange() { return expectedRevenueChange; }
        public void setExpectedRevenueChange(double expectedRevenueChange) { this.expectedRevenueChange = expectedRevenueChange; }
        public double getPriceElasticity() { return priceElasticity; }
        public void setPriceElasticity(double priceElasticity) { this.priceElasticity = priceElasticity; }
        public double getConfidence() { return confidence; }
        public void setConfidence(double confidence) { this.confidence = confidence; }
    }
}
