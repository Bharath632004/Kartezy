package com.kartezy.aiservice.controller;

import com.kartezy.aiservice.service.AIServiceFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/v1/personalization")
public class PersonalizationController {

    @Autowired
    private AIServiceFacade aiServiceFacade;

    @GetMapping("/homepage")
    public Map<String, Object> getPersonalizedHomepage(@RequestParam String userId) {
        Random random = new Random(userId.hashCode());
        List<String> recs = aiServiceFacade.getPersonalizedRecommendations(userId, 10);
        return Map.of(
                "banners", generateBanners(random),
                "featuredProducts", !recs.isEmpty() ? recs : List.of("PROD-10001", "PROD-10002", "PROD-10003"),
                "recommendedCategories", Arrays.asList("Groceries", "Dairy", "Beverages", "Snacks"),
                "trendingStores", Arrays.asList("STR-001", "STR-002", "STR-003"),
                "flashDeals", generateFlashDeals(random),
                "recentlyViewed", generateRecentlyViewed(random),
                "personalizedMessage", "Welcome back! Here are some recommendations for you."
        );
    }

    @GetMapping("/search-results")
    public List<Map<String, Object>> getPersonalizedSearchResults(@RequestParam String userId,
                                                                  @RequestParam String query,
                                                                  @RequestParam List<String> baseResults) {
        List<String> recs = aiServiceFacade.getPersonalizedRecommendations(userId, 5);
        List<Map<String, Object>> results = new ArrayList<>();
        for (String rec : recs) {
            results.add(Map.of("productId", rec, "relevanceScore", Math.round((0.5 + new Random().nextDouble() * 0.5) * 100.0) / 100.0, "personalized", true));
        }
        for (String base : baseResults) {
            results.add(Map.of("productId", base, "relevanceScore", 0.5, "personalized", false));
        }
        return results;
    }

    @GetMapping("/product-recommendations")
    public List<Map<String, Object>> getProductRecommendations(@RequestParam String userId,
                                                               @RequestParam String context,
                                                               @RequestParam int limit) {
        List<String> recs = aiServiceFacade.getPersonalizedRecommendations(userId, limit);
        if (recs.isEmpty()) {
            recs = aiServiceFacade.getTrendingProducts(limit);
        }
        List<Map<String, Object>> result = new ArrayList<>();
        for (int i = 0; i < recs.size(); i++) {
            result.add(Map.of("productId", recs.get(i), "rank", i + 1, "context", context, "score", Math.round((0.9 - i * 0.1) * 100.0) / 100.0));
        }
        return result;
    }

    @GetMapping("/coupons")
    public List<Map<String, Object>> getPersonalizedCoupons(@RequestParam String userId) {
        Random random = new Random(userId.hashCode());
        return List.of(
                Map.of("couponId", "CPN-001", "code", "WELCOME15", "discount", 15, "type", "PERCENTAGE", "minOrder", 299, "expiry", LocalDateTime.now().plusDays(7).format(DateTimeFormatter.ISO_DATE)),
                Map.of("couponId", "CPN-002", "code", "FREEDEL", "discount", 0, "type", "FREE_DELIVERY", "minOrder", 199, "expiry", LocalDateTime.now().plusDays(3).format(DateTimeFormatter.ISO_DATE)),
                Map.of("couponId", "CPN-003", "code", "CASH50", "discount", 50, "type", "CASHBACK", "minOrder", 499, "expiry", LocalDateTime.now().plusDays(14).format(DateTimeFormatter.ISO_DATE))
        );
    }

    @GetMapping("/notifications")
    public List<Map<String, Object>> getPersonalizedNotifications(@RequestParam String userId) {
        Random random = new Random(userId.hashCode());
        List<Map<String, Object>> notifications = new ArrayList<>();
        if (random.nextBoolean()) {
            notifications.add(Map.of("type", "order_update", "priority", "HIGH", "message", "Your order is out for delivery", "sendNow", true));
        }
        if (random.nextBoolean()) {
            notifications.add(Map.of("type", "recommendation", "priority", "MEDIUM", "message", "New products based on your preferences", "sendNow", false));
        }
        if (random.nextBoolean()) {
            notifications.add(Map.of("type", "offer", "priority", "LOW", "message", "Weekend special: 20% off on groceries", "sendNow", false));
        }
        return notifications;
    }

    @GetMapping("/pricing")
    public Map<String, Object> getPersonalizedPricing(@RequestParam String userId,
                                                      @RequestParam String productId) {
        Random random = new Random((userId + productId).hashCode());
        double basePrice = 100 + random.nextDouble() * 900;
        double discount = random.nextDouble() * 0.2;
        return Map.of(
                "productId", productId,
                "basePrice", Math.round(basePrice * 100.0) / 100.0,
                "discountPercentage", Math.round(discount * 100.0) / 100.0,
                "finalPrice", Math.round(basePrice * (1 - discount) * 100.0) / 100.0,
                "reason", random.nextBoolean() ? "Loyalty discount" : "Special offer for you"
        );
    }

    @GetMapping("/email/content")
    public Map<String, Object> getPersonalizedEmailContent(@RequestParam String userId,
                                                           @RequestParam String emailType) {
        List<String> recs = aiServiceFacade.getPersonalizedRecommendations(userId, 5);
        return Map.of(
                "subject", "Your personalized recommendations from Kartezy",
                "body", "We've picked some great items just for you based on your preferences and order history.",
                "productRecommendations", recs,
                "ctaUrl", "https://kartezy.com/recommendations",
                "unsubscribeUrl", "https://kartezy.com/unsubscribe"
        );
    }

    @GetMapping("/app/content")
    public Map<String, Object> getPersonalizedAppContent(@RequestParam String userId) {
        Random random = new Random(userId.hashCode());
        return Map.of(
                "theme", random.nextBoolean() ? "light" : "dark",
                "featuredSection", random.nextBoolean() ? "new_arrivals" : "trending",
                "shortcuts", Arrays.asList("Orders", "Favorites", "Wallet", "Support"),
                "homeLayout", "grid",
                "quickReorder", aiServiceFacade.getPersonalizedRecommendations(userId, 3)
        );
    }

    @GetMapping("/search/suggestions")
    public List<String> getPersonalizedSearchSuggestions(@RequestParam String userId,
                                                         @RequestParam String partialQuery) {
        Random random = new Random(userId.hashCode());
        String[] suggestions = {"groceries", "dairy products", "beverages", "snacks", "household items", "personal care", "baby products"};
        List<String> result = new ArrayList<>();
        String lower = partialQuery.toLowerCase();
        for (String s : suggestions) {
            if (s.contains(lower)) {
                result.add(s);
            }
        }
        if (result.isEmpty() && !partialQuery.isEmpty()) {
            result.add(partialQuery + "...");
        }
        return result.isEmpty() ? Arrays.asList(suggestions).subList(0, Math.min(3, suggestions.length)) : result;
    }

    @GetMapping("/category/affinity")
    public Map<String, Double> getCategoryAffinity(@RequestParam String userId) {
        Random random = new Random(userId.hashCode());
        Map<String, Double> affinity = new LinkedHashMap<>();
        String[] categories = {"Groceries", "Dairy", "Beverages", "Snacks", "Household", "Personal Care", "Baby Care", "Electronics"};
        for (String cat : categories) {
            affinity.put(cat, Math.round(random.nextDouble() * 100.0) / 100.0);
        }
        return affinity;
    }

    @GetMapping("/brand/affinity")
    public Map<String, Double> getBrandAffinity(@RequestParam String userId) {
        Random random = new Random(userId.hashCode());
        Map<String, Double> affinity = new LinkedHashMap<>();
        String[] brands = {"Amul", "Britannia", "Nestle", "Pepsi", "Coca-Cola", "HUL", "P&G", "ITC", "Dabur", "Marico"};
        for (String brand : brands) {
            affinity.put(brand, Math.round(random.nextDouble() * 100.0) / 100.0);
        }
        return affinity;
    }

    private List<Map<String, Object>> generateBanners(Random random) {
        return List.of(
                Map.of("bannerId", "BNR-001", "title", "Weekend Special", "subtitle", "20% off on all groceries", "imageUrl", "/banners/weekend.jpg", "ctaUrl", "/offers/weekend"),
                Map.of("bannerId", "BNR-002", "title", "New Arrivals", "subtitle", "Check out the latest products", "imageUrl", "/banners/new.jpg", "ctaUrl", "/products/new")
        );
    }

    private List<Map<String, Object>> generateFlashDeals(Random random) {
        return List.of(
                Map.of("dealId", "DEAL-001", "productId", "PROD-" + (10000 + random.nextInt(5000)), "discount", 30, "timeLeft", 3600),
                Map.of("dealId", "DEAL-002", "productId", "PROD-" + (10000 + random.nextInt(5000)), "discount", 25, "timeLeft", 7200)
        );
    }

    private List<Map<String, Object>> generateRecentlyViewed(Random random) {
        List<Map<String, Object>> viewed = new ArrayList<>();
        for (int i = 0; i < 4; i++) {
            viewed.add(Map.of("productId", "PROD-" + (10000 + random.nextInt(5000)), "viewedAt", LocalDateTime.now().minusHours(random.nextInt(24)).format(DateTimeFormatter.ISO_DATE_TIME)));
        }
        return viewed;
    }
}
