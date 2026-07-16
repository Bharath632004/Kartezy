package com.kartezy.pricingservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class DynamicPricingService {

    private static final double BASE_DEMAND_ELASTICITY = -0.5;
    private static final double MIN_PRICE_FACTOR = 0.6;
    private static final double MAX_PRICE_FACTOR = 1.5;
    private static final double COMPETITOR_WEIGHT = 0.3;
    private static final double DEMAND_WEIGHT = 0.35;
    private static final double INVENTORY_WEIGHT = 0.2;
    private static final double TIME_WEIGHT = 0.15;

    private static final Map<String, Double> FESTIVAL_MULTIPLIERS = Map.ofEntries(
            Map.entry("DIWALI", 1.25), Map.entry("CHRISTMAS", 1.20), Map.entry("NEW_YEAR", 1.15),
            Map.entry("EID", 1.15), Map.entry("HOLI", 1.10), Map.entry("DUSSEHRA", 1.10),
            Map.entry("GANESH_CHATURTHI", 1.15), Map.entry("PONGAL", 1.10),
            Map.entry("ONAM", 1.05), Map.entry("VALENTINES", 1.20),
            Map.entry("BLACK_FRIDAY", 0.70), Map.entry("CYBER_MONDAY", 0.75),
            Map.entry("INDEPENDENCE_DAY", 0.85), Map.entry("REPUBLIC_DAY", 0.85)
    );

    private static final Map<Integer, Double> HOUR_MULTIPLIERS = Map.ofEntries(
            Map.entry(0, 0.90), Map.entry(1, 0.85), Map.entry(2, 0.80), Map.entry(3, 0.80),
            Map.entry(4, 0.85), Map.entry(5, 0.90), Map.entry(6, 1.00), Map.entry(7, 1.05),
            Map.entry(8, 1.10), Map.entry(9, 1.15), Map.entry(10, 1.20), Map.entry(11, 1.20),
            Map.entry(12, 1.25), Map.entry(13, 1.20), Map.entry(14, 1.15), Map.entry(15, 1.15),
            Map.entry(16, 1.10), Map.entry(17, 1.15), Map.entry(18, 1.25), Map.entry(19, 1.30),
            Map.entry(20, 1.25), Map.entry(21, 1.15), Map.entry(22, 1.05), Map.entry(23, 0.95)
    );

    private final Map<String, List<Double>> competitorPriceHistory = new HashMap<>();

    @Cacheable(value = "pricingResults", key = "'price_' + #productId + '_' + #storeId + '_' + #userId")
    public Map<String, Object> getDynamicPrice(String productId, String storeId, String userId) {
        log.info("Calculating dynamic price for product: {}, store: {}, user: {}", productId, storeId, userId);
        Random random = new Random((productId + storeId).hashCode());

        double basePrice = 100.0 + random.nextDouble() * 900.0;
        double demandFactor = calculateDemandFactor(productId, storeId);
        double inventoryFactor = calculateInventoryFactor(productId, storeId);
        double competitorFactor = calculateCompetitorFactor(productId, storeId);
        double timeFactor = calculateTimeFactor();
        double userSegmentFactor = calculateUserSegmentFactor(userId);
        double festivalFactor = calculateFestivalFactor();
        double promotionFactor = calculatePromotionFactor(productId, storeId);

        double dynamicPrice = basePrice
                * (1.0 + (demandFactor - 1.0) * DEMAND_WEIGHT)
                * (1.0 + (inventoryFactor - 1.0) * INVENTORY_WEIGHT)
                * (1.0 + (competitorFactor - 1.0) * COMPETITOR_WEIGHT)
                * (1.0 + (timeFactor - 1.0) * TIME_WEIGHT);

        dynamicPrice = Math.max(basePrice * MIN_PRICE_FACTOR, Math.min(basePrice * MAX_PRICE_FACTOR, dynamicPrice));
        dynamicPrice *= festivalFactor;
        dynamicPrice *= promotionFactor;

        double discount = calculateOptimalDiscount(dynamicPrice, basePrice, demandFactor, inventoryFactor);
        double finalPrice = dynamicPrice * (1 - discount);

        String currentFestival = detectActiveFestival();

        Map<String, Object> result = new HashMap<>();
        result.put("productId", productId);
        result.put("storeId", storeId);
        result.put("basePrice", Math.round(basePrice * 100.0) / 100.0);
        result.put("dynamicPrice", Math.round(dynamicPrice * 100.0) / 100.0);
        result.put("finalPrice", Math.round(finalPrice * 100.0) / 100.0);
        result.put("discountPercentage", Math.round(discount * 100.0) / 100.0);
        result.put("factors", Map.of(
                "demandFactor", Math.round(demandFactor * 100.0) / 100.0,
                "inventoryFactor", Math.round(inventoryFactor * 100.0) / 100.0,
                "competitorFactor", Math.round(competitorFactor * 100.0) / 100.0,
                "userSegmentFactor", Math.round(userSegmentFactor * 100.0) / 100.0,
                "timeFactor", Math.round(timeFactor * 100.0) / 100.0,
                "festivalFactor", Math.round(festivalFactor * 100.0) / 100.0,
                "promotionFactor", Math.round(promotionFactor * 100.0) / 100.0
        ));
        result.put("activeFestival", currentFestival);
        result.put("pricingStrategy", determinePricingStrategy(demandFactor, inventoryFactor, timeFactor));
        result.put("validUntil", LocalDateTime.now().plusHours(1).format(DateTimeFormatter.ISO_DATE_TIME));
        result.put("confidence", Math.round((0.7 + random.nextDouble() * 0.2) * 100.0) / 100.0);
        return result;
    }

    public List<Map<String, Object>> getDynamicPrices(List<String> productIds, String storeId, String userId) {
        return productIds.stream()
                .map(pid -> getDynamicPrice(pid, storeId, userId))
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getPricingRules(String storeId) {
        log.info("Getting pricing rules for store: {}", storeId);
        List<Map<String, Object>> rules = new ArrayList<>();

        rules.add(Map.of(
                "ruleId", "RULE-001", "name", "Demand-Based Pricing",
                "type", "DYNAMIC", "enabled", true,
                "description", "Adjust prices based on real-time demand", "priority", 1
        ));
        rules.add(Map.of(
                "ruleId", "RULE-002", "name", "Inventory Clearance",
                "type", "INVENTORY", "enabled", true,
                "description", "Reduce prices for overstocked items", "priority", 2
        ));
        rules.add(Map.of(
                "ruleId", "RULE-003", "name", "Happy Hour Discount",
                "type", "TIME_BASED", "enabled", true,
                "description", "10% discount during 2-5 PM", "priority", 3
        ));
        rules.add(Map.of(
                "ruleId", "RULE-004", "name", "Festival Pricing",
                "type", "FESTIVAL", "enabled", true,
                "description", "Festival-specific price adjustments", "priority", 1
        ));
        rules.add(Map.of(
                "ruleId", "RULE-005", "name", "Segment-Based Pricing",
                "type", "USER_SEGMENT", "enabled", true,
                "description", "Different prices based on customer segment", "priority", 4
        ));

        return rules;
    }

    public Map<String, Object> simulatePriceChange(Map<String, Object> request) {
        log.info("Simulating price change");
        double currentPrice = ((Number) request.getOrDefault("currentPrice", 100.0)).doubleValue();
        double newPrice = ((Number) request.getOrDefault("newPrice", 110.0)).doubleValue();
        double priceChange = (newPrice - currentPrice) / currentPrice;

        double demandElasticity = BASE_DEMAND_ELASTICITY;
        double expectedDemandChange = demandElasticity * priceChange;
        double expectedRevenueChange = (1 + expectedDemandChange) * (1 + priceChange) - 1;

        return Map.of(
                "currentPrice", currentPrice,
                "newPrice", newPrice,
                "priceChangePercentage", Math.round(priceChange * 100.0) / 100.0,
                "expectedDemandChange", Math.round(expectedDemandChange * 100.0) / 100.0,
                "expectedRevenueChange", Math.round(expectedRevenueChange * 100.0) / 100.0,
                "priceElasticity", demandElasticity,
                "confidence", 0.75,
                "recommendation", expectedRevenueChange > 0 ? "PROCEED" : "REVIEW"
        );
    }

    public List<Map<String, Object>> getPriceHistory(String productId, String storeId, int daysBack) {
        log.info("Getting price history for product: {}, store: {}, days: {}", productId, storeId, daysBack);
        List<Map<String, Object>> history = new ArrayList<>();
        Random random = new Random((productId + storeId).hashCode());
        double basePrice = 100.0 + random.nextDouble() * 900.0;

        for (int i = daysBack; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            double priceVariation = basePrice * (0.9 + random.nextDouble() * 0.2);

            history.add(Map.of(
                    "date", date.format(DateTimeFormatter.ISO_DATE),
                    "price", Math.round(priceVariation * 100.0) / 100.0,
                    "currency", "INR"
            ));
        }

        return history;
    }

    public Map<String, String> updatePrices(Map<String, Object> request) {
        String storeId = (String) request.get("storeId");
        log.info("Updating prices for store: {}", storeId);
        return Map.of(
                "status", "PRICE_UPDATE_COMPLETED",
                "storeId", storeId,
                "productsUpdated", String.valueOf(new Random().nextInt(500) + 100),
                "updatedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME)
        );
    }

    public Map<String, Object> getCompetitorPrice(String productId, String competitorId) {
        log.info("Getting competitor price for product: {}, competitor: {}", productId, competitorId);
        Random random = new Random((productId + competitorId).hashCode());
        double competitorPrice = 100.0 + random.nextDouble() * 900.0;

        return Map.of(
                "productId", productId,
                "competitorId", competitorId,
                "competitorName", getCompetitorName(competitorId),
                "competitorPrice", Math.round(competitorPrice * 100.0) / 100.0,
                "ourPrice", Math.round(competitorPrice * (0.9 + random.nextDouble() * 0.2) * 100.0) / 100.0,
                "priceDifference", Math.round((random.nextDouble() * 20 - 10) * 100.0) / 100.0,
                "lastUpdated", LocalDateTime.now().minusHours(random.nextInt(24)).format(DateTimeFormatter.ISO_DATE_TIME)
        );
    }

    public List<Map<String, Object>> getPromotionSuggestions(String storeId) {
        log.info("Generating promotion suggestions for store: {}", storeId);
        Random random = new Random(storeId.hashCode());

        List<Map<String, Object>> suggestions = new ArrayList<>();
        String[] promotionTypes = {"BOGO", "PERCENTAGE_OFF", "FLAT_DISCOUNT", "BUY_MORE_SAVE_MORE", "FREE_SHIPPING"};

        for (int i = 0; i < 5; i++) {
            Map<String, Object> suggestion = new HashMap<>();
            suggestion.put("promotionId", "PROMO-" + (1000 + i));
            suggestion.put("type", promotionTypes[i]);
            suggestion.put("description", getPromotionDescription(promotionTypes[i]));
            suggestion.put("discountDepth", Math.round((0.1 + random.nextDouble() * 0.3) * 100.0) / 100.0);
            suggestion.put("expectedLift", Math.round((0.05 + random.nextDouble() * 0.4) * 100.0) / 100.0);
            suggestion.put("confidence", Math.round((0.6 + random.nextDouble() * 0.3) * 100.0) / 100.0);
            suggestion.put("recommendedProducts", random.nextInt(20) + 5);
            suggestions.add(suggestion);
        }

        return suggestions;
    }

    public Map<String, Object> getDiscountOptimization(String productId, String storeId) {
        log.info("Optimizing discount for product: {}, store: {}", productId, storeId);
        Random random = new Random((productId + storeId).hashCode());

        double optimalDiscount = 0.1 + random.nextDouble() * 0.3;
        double currentDiscount = random.nextDouble() * 0.4;

        return Map.of(
                "productId", productId,
                "storeId", storeId,
                "currentDiscount", Math.round(currentDiscount * 100.0) / 100.0,
                "optimalDiscount", Math.round(optimalDiscount * 100.0) / 100.0,
                "discountGap", Math.round((optimalDiscount - currentDiscount) * 100.0) / 100.0,
                "expectedRevenueLift", Math.round((random.nextDouble() * 0.2) * 100.0) / 100.0,
                "marginImpact", Math.round((-optimalDiscount * 0.8) * 100.0) / 100.0,
                "recommendation", optimalDiscount > currentDiscount ? "INCREASE_DISCOUNT" : "MAINTAIN",
                "confidence", 0.75
        );
    }

    public List<Map<String, Object>> getFestivalPricing(String storeId) {
        log.info("Getting festival pricing for store: {}", storeId);
        List<Map<String, Object>> festivalPrices = new ArrayList<>();

        for (Map.Entry<String, Double> festival : FESTIVAL_MULTIPLIERS.entrySet()) {
            festivalPrices.add(Map.of(
                    "festival", festival.getKey(),
                    "multiplier", festival.getValue(),
                    "isActive", detectActiveFestival().equals(festival.getKey()),
                    "startDate", calculateFestivalDate(festival.getKey()),
                    "endDate", calculateFestivalEndDate(festival.getKey()),
                    "applicableCategories", getFestivalCategories(festival.getKey())
            ));
        }

        return festivalPrices;
    }

    private double calculateDemandFactor(String productId, String storeId) {
        Random random = new Random((productId + storeId + "demand").hashCode());
        return 0.7 + random.nextDouble() * 0.6;
    }

    private double calculateInventoryFactor(String productId, String storeId) {
        Random random = new Random((productId + storeId + "inventory").hashCode());
        double stockLevel = random.nextDouble();
        if (stockLevel < 0.2) return 1.3;
        if (stockLevel < 0.4) return 1.1;
        if (stockLevel > 0.8) return 0.8;
        return 1.0;
    }

    private double calculateCompetitorFactor(String productId, String storeId) {
        List<Double> history = competitorPriceHistory.getOrDefault(productId + ":" + storeId, new ArrayList<>());
        if (history.isEmpty()) return 1.0;
        double avgCompPrice = history.stream().mapToDouble(Double::doubleValue).average().orElse(100);
        double ourPrice = 100.0;
        return Math.max(0.8, Math.min(1.2, ourPrice / avgCompPrice));
    }

    private double calculateTimeFactor() {
        int hour = LocalDateTime.now().getHour();
        return HOUR_MULTIPLIERS.getOrDefault(hour, 1.0);
    }

    private double calculateUserSegmentFactor(String userId) {
        Random random = new Random(userId.hashCode());
        return 0.9 + random.nextDouble() * 0.2;
    }

    private double calculateFestivalFactor() {
        String festival = detectActiveFestival();
        return FESTIVAL_MULTIPLIERS.getOrDefault(festival, 1.0);
    }

    private double calculatePromotionFactor(String productId, String storeId) {
        Random random = new Random((productId + storeId + "promo").hashCode());
        return random.nextDouble() < 0.3 ? 0.85 + random.nextDouble() * 0.1 : 1.0;
    }

    private double calculateOptimalDiscount(double dynamicPrice, double basePrice,
                                             double demandFactor, double inventoryFactor) {
        double discount = 0.0;

        if (inventoryFactor < 0.9) {
            discount = Math.max(discount, (1.0 - inventoryFactor) * 0.3);
        }

        if (demandFactor < 0.8) {
            discount = Math.max(discount, (1.0 - demandFactor) * 0.2);
        }

        int hour = LocalDateTime.now().getHour();
        if (hour >= 14 && hour <= 17) {
            discount = Math.max(discount, 0.10);
        }

        String festival = detectActiveFestival();
        if (!festival.equals("NONE") && FESTIVAL_MULTIPLIERS.get(festival) > 1.0) {
            discount = Math.max(discount, 0.05);
        }

        return Math.min(0.5, discount);
    }

    private String detectActiveFestival() {
        Month currentMonth = LocalDate.now().getMonth();
        DayOfWeek dayOfWeek = LocalDate.now().getDayOfWeek();

        if (currentMonth == Month.OCTOBER || currentMonth == Month.NOVEMBER) {
            if (dayOfWeek == DayOfWeek.SUNDAY) return "DIWALI";
        }
        if (currentMonth == Month.DECEMBER) {
            if (dayOfWeek == DayOfWeek.WEDNESDAY || dayOfWeek == DayOfWeek.THURSDAY) return "CHRISTMAS";
        }
        if (currentMonth == Month.JANUARY) {
            if (dayOfWeek == DayOfWeek.SUNDAY) return "NEW_YEAR";
        }
        if (currentMonth == Month.MARCH) return "HOLI";

        return "NONE";
    }

    private String determinePricingStrategy(double demandFactor, double inventoryFactor, double timeFactor) {
        if (inventoryFactor > 1.2) return "INVENTORY_CLEARANCE";
        if (demandFactor > 1.2) return "PREMIUM_PRICING";
        if (timeFactor > 1.2) return "PEAK_TIME_PRICING";
        if (inventoryFactor < 0.8 && demandFactor < 0.8) return "PROMOTIONAL_PRICING";
        return "STANDARD_PRICING";
    }

    private String getCompetitorName(String competitorId) {
        Map<String, String> competitors = Map.of(
                "COMP-001", "QuickMart", "COMP-002", "ExpressDelivery",
                "COMP-003", "InstantGrocer", "COMP-004", "RapidShop"
        );
        return competitors.getOrDefault(competitorId, "Unknown Competitor");
    }

    private String getPromotionDescription(String type) {
        switch (type) {
            case "BOGO": return "Buy One Get One Free on select items";
            case "PERCENTAGE_OFF": return "20% off on orders above ₹500";
            case "FLAT_DISCOUNT": return "Flat ₹100 off on first order";
            case "BUY_MORE_SAVE_MORE": return "Buy 3 get 10% off, Buy 5 get 20% off";
            case "FREE_SHIPPING": return "Free delivery on orders above ₹299";
            default: return "Limited time offer";
        }
    }

    private String calculateFestivalDate(String festival) {
        return LocalDate.now().plusDays(new Random(festival.hashCode()).nextInt(60))
                .format(DateTimeFormatter.ISO_DATE);
    }

    private String calculateFestivalEndDate(String festival) {
        return LocalDate.now().plusDays(new Random(festival.hashCode()).nextInt(60) + 7)
                .format(DateTimeFormatter.ISO_DATE);
    }

    private List<String> getFestivalCategories(String festival) {
        switch (festival) {
            case "DIWALI": return List.of("Electronics", "Home Decor", "Clothing", "Sweets", "Gifts");
            case "CHRISTMAS": return List.of("Gifts", "Decorations", "Baking Supplies", "Toys");
            case "HOLI": return List.of("Colors", "Water Guns", "Sweets", "White Clothing");
            default: return List.of("Groceries", "Beverages", "Snacks");
        }
    }
}
