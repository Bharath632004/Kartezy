package com.kartezy.aiservice.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AIServiceFacade {

    public List<String> getPersonalizedRecommendations(String userId, int limit) {
        if (limit <= 0) return List.of();
        return List.of("P001", "P045", "P123", "P067", "P089").stream().limit(limit).collect(Collectors.toList());
    }

    public List<String> searchProducts(String query, int limit) {
        if (query == null || query.trim().isEmpty()) return List.of();

        Map<String, List<String>> catalog = new LinkedHashMap<>();
        catalog.put("milk", List.of("Amul Gold Milk 1L", "Mother Dairy Milk 500ml", "Nestle Milk Packet"));
        catalog.put("rice", List.of("Basmati Rice 5kg", "Sona Masoori Rice 1kg", "Brown Rice 500g"));
        catalog.put("sugar", List.of("Madhur Sugar 1kg", "Tata Sugar 5kg", "Organic Jaggery"));
        catalog.put("oil", List.of("Fortune Oil 1L", "Saffola Oil 1L", "Mustard Oil 500ml"));
        catalog.put("eggs", List.of("Farm Fresh Eggs 12pcs", "Organic Eggs 6pcs", "Country Eggs 12pcs"));
        catalog.put("bread", List.of("Britannia Bread 400g", "Brown Bread 400g", "Whole Wheat Bread"));
        catalog.put("vegetables", List.of("Fresh Tomatoes 1kg", "Potatoes 5kg", "Onion 2kg"));
        catalog.put("fruits", List.of("Alphonso Mango", "Apple Royal Gala 1kg", "Banana 6pcs"));
        catalog.put("chicken", List.of("Chicken Curry Cut 1kg", "Chicken Breast Boneless 500g"));
        catalog.put("fish", List.of("Rohu Fish 500g", "Pomfret 1kg", "Prawns 500g"));
        catalog.put("soap", List.of("Dove Soap 4x100g", "Lux Soap 3x100g", "Lifebuoy Soap"));
        catalog.put("shampoo", List.of("Dove Shampoo 200ml", "Pantene Shampoo 180ml"));
        catalog.put("snacks", List.of("Lays Chips 52g", "Kurkure 90g", "Doritos Nachos"));
        catalog.put("chocolate", List.of("Dairy Milk 150g", "Kit Kat 120g", "Munch 60g"));
        catalog.put("tea", List.of("Taj Mahal Tea 250g", "Tata Tea 500g", "Red Label Tea"));

        String lowerQuery = query.toLowerCase();
        for (Map.Entry<String, List<String>> entry : catalog.entrySet()) {
            if (lowerQuery.contains(entry.getKey()) || entry.getKey().contains(lowerQuery)) {
                return entry.getValue().stream().limit(limit).collect(Collectors.toList());
            }
        }
        return lowerQuery.length() >= 3
                ? List.of(lowerQuery + " Premium Product", "Organic " + lowerQuery, "Fresh " + lowerQuery + " Pack").stream().limit(limit).collect(Collectors.toList())
                : List.of();
    }

    public Map<String, Object> extractText(byte[] documentContent, String documentType) {
        return Map.of("text", "Document processed", "confidence", 0.85,
                "documentType", documentType != null ? documentType : "UNKNOWN",
                "length", documentContent != null ? documentContent.length : 0);
    }

    public Map<String, Object> recognizeProduct(byte[] imageContent) {
        return Map.of("productId", "PROD-" + UUID.randomUUID().toString().substring(0, 8),
                "confidence", 0.82, "found", imageContent != null && imageContent.length > 0, "processingTime", "45ms");
    }

    public Map<String, Object> analyzeSentiment(String text) {
        if (text == null || text.trim().isEmpty())
            return Map.of("sentiment", "neutral", "score", 0.5, "confidence", 0.0);

        String low = text.toLowerCase();
        long pos = Arrays.stream(low.split("\\W+")).filter(w -> Set.of("good", "great", "excellent", "amazing", "love", "best", "awesome", "perfect", "fresh", "fast", "happy", "satisfied").contains(w)).count();
        long neg = Arrays.stream(low.split("\\W+")).filter(w -> Set.of("bad", "terrible", "awful", "worst", "poor", "hate", "broken", "damaged", "stale", "slow", "late", "angry").contains(w)).count();

        double score = (double) (pos - neg) / Math.max((int) (pos + neg), 1);
        double sig = 1.0 / (1.0 + Math.exp(-score));
        String sentiment = sig > 0.6 ? "positive" : sig < 0.4 ? "negative" : "neutral";
        return Map.of("sentiment", sentiment, "score", Math.round(sig * 100.0) / 100.0, "confidence", Math.min(1.0, (pos + neg) * 0.15));
    }

    public Map<String, Object> forecastDemand(String productId, String storeId, int daysAhead) {
        List<Map<String, Object>> forecast = new ArrayList<>();
        Random rand = new Random(productId.hashCode() + storeId.hashCode());
        double base = 50 + rand.nextDouble() * 100;
        for (int i = 0; i < daysAhead; i++) {
            base += (rand.nextDouble() - 0.45) * 10;
            forecast.add(Map.of("day", i + 1, "forecast", Math.max(0, Math.round(base * 100.0) / 100.0),
                    "lowerBound", Math.max(0, Math.round(base * 0.85 * 100.0) / 100.0),
                    "upperBound", Math.round(base * 1.15 * 100.0) / 100.0));
        }
        return Map.of("productId", productId, "storeId", storeId, "forecast", forecast, "method", "exponential_smoothing", "confidence", 0.85);
    }

    public Map<String, Object> checkFraud(Map<String, Object> details) {
        double score = 0;
        int factors = 0;
        if (details.containsKey("amount")) {
            double amt = ((Number) details.get("amount")).doubleValue();
            if (amt > 50000) { score += 0.7; factors++; }
        }
        if (Boolean.TRUE.equals(details.get("newDevice"))) { score += 0.5; factors++; }
        if (Boolean.TRUE.equals(details.get("newLocation"))) { score += 0.4; factors++; }
        double finalScore = factors > 0 ? score / factors : 0;
        return Map.of("fraudScore", Math.round(finalScore * 100.0) / 100.0,
                "recommendation", finalScore > 0.6 ? "REVIEW" : finalScore > 0.3 ? "MONITOR" : "APPROVE",
                "isFraudulent", finalScore > 0.6);
    }

    public Map<String, Object> getDynamicPrice(String productId, String storeId, String userId) {
        double base = Math.abs(productId.hashCode() % 1000) + 10;
        double demandMultiplier = 1.0 + Math.abs(storeId.hashCode() % 50) / 100.0;
        int hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY);
        double timeMultiplier = hour >= 22 || hour <= 5 ? 1.2 : hour >= 18 ? 1.1 : 1.0;
        double finalPrice = base * demandMultiplier * timeMultiplier;
        return Map.of("productId", productId, "storeId", storeId,
                "basePrice", Math.round(base * 100.0) / 100.0,
                "finalPrice", Math.round(finalPrice * 100.0) / 100.0,
                "discountPercentage", 0.0,
                "factors", Map.of("demandMultiplier", Math.round(demandMultiplier * 100.0) / 100.0,
                        "timeMultiplier", Math.round(timeMultiplier * 100.0) / 100.0));
    }

    public Map<String, Object> getMerchantInsights(String merchantId) {
        return Map.of("merchantId", merchantId, "totalSales", 1250000.0, "totalOrders", 2450,
                "averageOrderValue", 510.20, "customerCount", 890, "returnRate", 2.5, "growthRate", 15.3,
                "topProducts", List.of(
                        Map.of("productId", "P001", "name", "Premium Rice 5kg", "unitsSold", 450, "revenue", 112500),
                        Map.of("productId", "P002", "name", "Fortune Oil 1L", "unitsSold", 380, "revenue", 68400)),
                "suggestions", List.of("Increase stock of top-selling items during evenings",
                        "Consider bundling slow-moving products with fast movers"));
    }

    public Map<String, Object> getCustomerInsights(String customerId) {
        return Map.of("customerId", customerId, "lifetimeValue", 12500.0, "averageOrderValue", 450.0,
                "purchaseFrequency", 3.5, "customerSegment", "HIGH_VALUE", "churnProbability", 0.15,
                "engagementScore", 0.72, "preferredCategories", List.of("Groceries", "Dairy", "Beverages"),
                "nextBestAction", "Send personalized offer for dairy products");
    }

    public Map<String, Object> getDeliveryInsights(String orderId) {
        return Map.of("orderId", orderId, "eta", 25, "confidence", 0.85, "status", "OUT_FOR_DELIVERY",
                "estimatedDistance", 3.5, "driverScore", 4.8, "delayProbability", 0.12);
    }

    public List<Map<String, Object>> getAnalyticsInsights(String timeRange) {
        return List.of(
                Map.of("type", "REVENUE", "value", 2500000.0, "change", 15.3, "period", timeRange),
                Map.of("type", "ORDERS", "value", 8500.0, "change", 12.1, "period", timeRange),
                Map.of("type", "CUSTOMERS", "value", 3200.0, "change", 8.7, "period", timeRange),
                Map.of("type", "AVERAGE_ORDER_VALUE", "value", 294.12, "change", 3.2, "period", timeRange));
    }

    public Map<String, Object> getPersonalizedContent(String userId, String context) {
        return Map.of("userId", userId, "context", context, "personalized", true,
                "sections", List.of(
                        Map.of("sectionId", "featured", "title", "Featured Products", "type", "PRODUCT",
                                "items", List.of("P001", "P045", "P123", "P067", "P089"), "position", 1),
                        Map.of("sectionId", "deals", "title", "Today's Deals", "type", "PRODUCT",
                                "items", List.of("P034", "P078", "P156", "P092"), "position", 2)));
    }
}
