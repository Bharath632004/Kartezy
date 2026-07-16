package com.kartezy.aiservice.controller;

import com.kartezy.aiservice.service.AIServiceFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/v1/customer/insights")
public class CustomerIntelligenceController {

    @Autowired
    private AIServiceFacade aiServiceFacade;

    @GetMapping("/profile")
    public Map<String, Object> getCustomerProfile(@RequestParam String customerId) {
        Random random = new Random(customerId.hashCode());
        String segment = determineCustomerSegment(random);
        return Map.of(
                "customerId", customerId,
                "lifetimeValue", Math.round((500 + random.nextDouble() * 5000) * 100.0) / 100.0,
                "averageOrderValue", Math.round((200 + random.nextDouble() * 800) * 100.0) / 100.0,
                "purchaseFrequency", Math.round((0.5 + random.nextDouble() * 3.0) * 10.0) / 10.0,
                "customerSegment", segment,
                "preferredCategories", getPreferredCategories(random),
                "preferredBrands", getPreferredBrands(random),
                "communicationPreferences", Map.of("email", true, "push", true, "sms", false),
                "loyaltyTier", random.nextDouble() > 0.7 ? "GOLD" : random.nextDouble() > 0.4 ? "SILVER" : "BRONZE"
        );
    }

    @GetMapping("/segments")
    public List<Map<String, Object>> getCustomerSegments(@RequestParam String customerId) {
        return List.of(
                Map.of("segment", "HIGH_VALUE", "probability", 0.15, "description", "Top 15% customers by spend"),
                Map.of("segment", "REGULAR", "probability", 0.35, "description", "Regular purchasers"),
                Map.of("segment", "OCCASIONAL", "probability", 0.30, "description", "Occasional shoppers"),
                Map.of("segment", "NEW", "probability", 0.20, "description", "Recently acquired customers")
        );
    }

    @GetMapping("/lifetime-value/predict")
    public Map<String, Object> predictLifetimeValue(@RequestParam String customerId) {
        Random random = new Random(customerId.hashCode());
        double predictedLtv = 1000 + random.nextDouble() * 10000;
        return Map.of(
                "customerId", customerId,
                "predictedLifetimeValue", Math.round(predictedLtv * 100.0) / 100.0,
                "confidence", Math.round((0.65 + random.nextDouble() * 0.25) * 100.0) / 100.0,
                "timeHorizonMonths", 24,
                "factors", Map.of("avgOrderValue", 0.35, "purchaseFrequency", 0.30, "retentionProbability", 0.25, "categoryAffinity", 0.10)
        );
    }

    @GetMapping("/churn/risk")
    public Map<String, Object> getChurnRisk(@RequestParam String customerId) {
        Random random = new Random(customerId.hashCode());
        double churnProb = random.nextDouble() * 0.5;
        List<String> riskFactors = new ArrayList<>();
        if (churnProb > 0.3) riskFactors.add("LOW_PURCHASE_FREQUENCY");
        if (churnProb > 0.2) riskFactors.add("HIGH_COMPLAINT_RATE");
        if (random.nextDouble() > 0.7) riskFactors.add("COMPETITOR_OFFERS");
        if (random.nextDouble() > 0.8) riskFactors.add("PRICE_SENSITIVITY");

        return Map.of(
                "customerId", customerId,
                "churnProbability", Math.round(churnProb * 100.0) / 100.0,
                "riskLevel", churnProb > 0.3 ? "HIGH" : churnProb > 0.15 ? "MEDIUM" : "LOW",
                "riskFactors", riskFactors,
                "recommendedAction", churnProb > 0.3 ? "SEND_PERSONALIZED_OFFER" : "MAINTAIN_ENGAGEMENT",
                "predictedChurnDate", LocalDate.now().plusDays(30 + random.nextInt(60)).format(DateTimeFormatter.ISO_DATE)
        );
    }

    @GetMapping("/next-purchase/predict")
    public Map<String, Object> predictNextPurchase(@RequestParam String customerId) {
        Random random = new Random(customerId.hashCode());
        String[] categories = {"Groceries", "Dairy", "Beverages", "Snacks", "Household", "Personal Care"};
        String predictedCategory = categories[random.nextInt(categories.length)];
        return Map.of(
                "customerId", customerId,
                "expectedPurchaseDate", LocalDate.now().plusDays(3 + random.nextInt(14)).format(DateTimeFormatter.ISO_DATE),
                "predictedCategory", predictedCategory,
                "predictedProductId", "PROD-" + (10000 + random.nextInt(5000)),
                "confidence", Math.round((0.5 + random.nextDouble() * 0.4) * 100.0) / 100.0,
                "predictedAmount", Math.round((100 + random.nextDouble() * 900) * 100.0) / 100.0
        );
    }

    @GetMapping("/engagement/score")
    public Map<String, Object> getEngagementScore(@RequestParam String customerId) {
        Random random = new Random(customerId.hashCode());
        double score = 0.2 + random.nextDouble() * 0.8;
        String level = score > 0.7 ? "HIGH" : score > 0.4 ? "MEDIUM" : "LOW";
        return Map.of(
                "customerId", customerId,
                "engagementScore", Math.round(score * 100.0) / 100.0,
                "level", level,
                "components", Map.of(
                        "appOpens", Math.round(random.nextDouble() * 100) / 100.0,
                        "timeSpent", Math.round(random.nextDouble() * 100) / 100.0,
                        "purchaseFrequency", Math.round(random.nextDouble() * 100) / 100.0,
                        "featureUsage", Math.round(random.nextDouble() * 100) / 100.0
                )
        );
    }

    @GetMapping("/recommendations/personalized")
    public List<Map<String, Object>> getPersonalizedRecommendations(@RequestParam String customerId,
                                                                    @RequestParam int limit) {
        List<String> recs = aiServiceFacade.getPersonalizedRecommendations(customerId, limit);
        if (recs.isEmpty()) {
            recs = generateFallbackRecommendations(limit);
        }
        List<Map<String, Object>> result = new ArrayList<>();
        for (int i = 0; i < recs.size(); i++) {
            result.add(Map.of(
                    "productId", recs.get(i),
                    "rank", i + 1,
                    "reason", i == 0 ? "Based on your purchase history" : "Popular in your area",
                    "score", Math.round((0.9 - i * 0.1) * 100.0) / 100.0
            ));
        }
        return result;
    }

    @GetMapping("/offers/personalized")
    public List<Map<String, Object>> getPersonalizedOffers(@RequestParam String customerId) {
        Random random = new Random(customerId.hashCode());
        return List.of(
                Map.of("offerId", "OFFER-001", "type", "PERCENTAGE_DISCOUNT", "value", 15, "minOrder", 299, "expiry", LocalDate.now().plusDays(7).toString()),
                Map.of("offerId", "OFFER-002", "type", "FREE_DELIVERY", "value", 0, "minOrder", 199, "expiry", LocalDate.now().plusDays(3).toString()),
                Map.of("offerId", "OFFER-003", "type", "CASHBACK", "value", 50, "minOrder", 499, "expiry", LocalDate.now().plusDays(14).toString())
        );
    }

    @GetMapping("/communication/preferred-channel")
    public String getPreferredCommunicationChannel(@RequestParam String customerId) {
        Random random = new Random(customerId.hashCode());
        String[] channels = {"push", "email", "sms", "whatsapp"};
        return channels[random.nextInt(channels.length)];
    }

    @GetMapping("/feedback/sentiment")
    public Map<String, Object> getFeedbackSentiment(@RequestParam String customerId) {
        Random random = new Random(customerId.hashCode());
        double sentimentScore = -0.5 + random.nextDouble() * 1.5;
        return Map.of(
                "customerId", customerId,
                "sentimentScore", Math.round(Math.max(-1.0, Math.min(1.0, sentimentScore)) * 100.0) / 100.0,
                "overallSentiment", sentimentScore > 0.3 ? "POSITIVE" : sentimentScore < -0.3 ? "NEGATIVE" : "NEUTRAL",
                "positiveMentions", List.of("quick delivery", "good quality", "polite driver"),
                "negativeMentions", sentimentScore < -0.3 ? List.of("late delivery", "missing items") : List.of(),
                "totalFeedbackCount", 10 + random.nextInt(40)
        );
    }

    @GetMapping("/loyalty/score")
    public Map<String, Object> getLoyaltyScore(@RequestParam String customerId) {
        Random random = new Random(customerId.hashCode());
        double score = random.nextDouble() * 100;
        String tier = score > 75 ? "GOLD" : score > 50 ? "SILVER" : score > 25 ? "BRONZE" : "STANDARD";
        return Map.of(
                "customerId", customerId,
                "loyaltyScore", Math.round(score * 100.0) / 100.0,
                "tier", tier,
                "pointsToNextTier", tier.equals("GOLD") ? 0 : (int) (100 - score % 25),
                "benefits", getTierBenefits(tier)
        );
    }

    @GetMapping("/next-best-action")
    public String getNextBestAction(@RequestParam String customerId) {
        Random random = new Random(customerId.hashCode());
        String[] actions = {
                "Send personalized discount for favorite category",
                "Recommend frequently bought together items",
                "Invite to refer a friend program",
                "Offer loyalty points bonus",
                "Send restock reminder for previously purchased items"
        };
        return actions[random.nextInt(actions.length)];
    }

    private String determineCustomerSegment(Random random) {
        double value = random.nextDouble();
        if (value > 0.85) return "HIGH_VALUE";
        if (value > 0.60) return "REGULAR";
        if (value > 0.30) return "OCCASIONAL";
        return "NEW";
    }

    private List<String> getPreferredCategories(Random random) {
        String[] allCategories = {"Groceries", "Dairy", "Beverages", "Snacks", "Household", "Personal Care", "Baby Care", "Pet Supplies"};
        List<String> preferred = new ArrayList<>();
        int count = 2 + random.nextInt(4);
        for (int i = 0; i < count; i++) {
            preferred.add(allCategories[random.nextInt(allCategories.length)]);
        }
        return preferred;
    }

    private List<String> getPreferredBrands(Random random) {
        String[] allBrands = {"Amul", "Britannia", "Nestle", "Pepsi", "Coca-Cola", "HUL", "P&G", "ITC"};
        List<String> preferred = new ArrayList<>();
        int count = 2 + random.nextInt(3);
        for (int i = 0; i < count; i++) {
            preferred.add(allBrands[random.nextInt(allBrands.length)]);
        }
        return preferred;
    }

    private List<String> generateFallbackRecommendations(int limit) {
        List<String> recs = new ArrayList<>();
        for (int i = 0; i < limit; i++) {
            recs.add("REC-" + (10000 + i));
        }
        return recs;
    }

    private String getTierBenefits(String tier) {
        switch (tier) {
            case "GOLD": return "Free delivery, 10% cashback, priority support, exclusive deals";
            case "SILVER": return "Free delivery above ₹199, 5% cashback, priority support";
            case "BRONZE": return "Free delivery above ₹299, 2% cashback";
            default: return "Standard delivery charges";
        }
    }
}
