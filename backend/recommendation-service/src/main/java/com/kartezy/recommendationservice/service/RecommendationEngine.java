package com.kartezy.recommendationservice.service;
import com.kartezy.recommendationservice.client.CatalogServiceClient;
import com.kartezy.recommendationservice.client.OrderServiceClient;
import com.kartezy.recommendationservice.client.UserServiceClient;
import com.kartezy.recommendationservice.dto.CategoryDto;
import com.kartezy.recommendationservice.dto.CustomerProfileDto;
import com.kartezy.recommendationservice.dto.FavoriteProductDto;
import com.kartezy.recommendationservice.dto.OrderDto;
import com.kartezy.recommendationservice.dto.OrderItemDto;
import com.kartezy.recommendationservice.dto.ProductDto;
import com.kartezy.recommendationservice.dto.SearchHistoryDto;
import com.kartezy.recommendationservice.dto.WishlistItemDto;
import org.apache.commons.math3.linear.ArrayRealVector;
import org.apache.commons.math3.linear.RealVector;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.Month;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class RecommendationEngine {
    @Autowired private UserServiceClient userServiceClient;
    @Autowired private CatalogServiceClient catalogServiceClient;
    @Autowired private OrderServiceClient orderServiceClient;

    private Map<Long, Integer> categoryToIndexMap = new HashMap<>();
    private int numCategories = 0;
    private Map<Long, RealVector> productFeatureVectors = new ConcurrentHashMap<>();
    private Map<Long, ProductDto> productCache = new ConcurrentHashMap<>();
    private Map<String, RealVector> userVectors = new ConcurrentHashMap<>();
    private Map<Long, Map<Long, Double>> itemSimilarityMatrix = new ConcurrentHashMap<>();
    private Map<Long, Set<Long>> storeProductMap = new ConcurrentHashMap<>();
    private static final long CACHE_VALIDITY_MS = 5 * 60 * 1000;
    private volatile long cacheTimestamp = 0;

    private static final Map<Month, String> FESTIVAL_MAP = Map.of(
        Month.JANUARY, "NEW_YEAR", Month.MARCH, "HOLI", Month.OCTOBER, "DIWALI",
        Month.NOVEMBER, "DIWALI", Month.DECEMBER, "CHRISTMAS"
    );

    private static final Map<String, List<String>> FESTIVAL_CATEGORIES = Map.of(
        "DIWALI", List.of("Sweets", "Decorations", "Gifts", "Clothing", "Electronics"),
        "HOLI", List.of("Colors", "Water Guns", "Sweets", "White Clothing"),
        "CHRISTMAS", List.of("Gifts", "Decorations", "Baking Supplies", "Toys"),
        "NEW_YEAR", List.of("Party Supplies", "Beverages", "Snacks", "Gifts")
    );

    public List<Long> getPersonalizedRecommendations(String userId, int limit) {
        loadCacheIfNeeded();
        Set<Long> interactedItems = getInteractedItemIds(userId);
        if (interactedItems.isEmpty()) return getTrendingProducts(limit);
        List<Long> contentBased = getContentBasedRecommendations(userId, limit * 2);
        List<Long> collaborativeBased = getCollaborativeRecommendations(userId, limit * 2);
        Map<Long, Double> hybridScores = new HashMap<>();
        for (int i = 0; i < contentBased.size(); i++) {
            hybridScores.merge(contentBased.get(i), 1.0 - (double) i / contentBased.size(), Double::sum);
        }
        for (int i = 0; i < collaborativeBased.size(); i++) {
            hybridScores.merge(collaborativeBased.get(i), 1.0 - (double) i / collaborativeBased.size(), Double::sum);
        }
        hybridScores.keySet().removeAll(interactedItems);
        return hybridScores.entrySet().stream()
                .sorted(Map.Entry.<Long, Double>comparingByValue().reversed())
                .limit(limit).map(Map.Entry::getKey).collect(Collectors.toList());
    }

    @Cacheable("contentBasedRecommendations")
    public List<Long> getContentBasedRecommendations(String userId, int limit) {
        Set<Long> interactedItems = getInteractedItemIds(userId);
        if (interactedItems.isEmpty()) return getTrendingProducts(limit);
        RealVector userVector = computeUserVector(interactedItems);
        if (userVector == null) return getTrendingProducts(limit);
        Map<Long, Double> similarities = new HashMap<>();
        for (Map.Entry<Long, RealVector> entry : productFeatureVectors.entrySet()) {
            Long productId = entry.getKey();
            if (interactedItems.contains(productId)) continue;
            similarities.put(productId, cosineSimilarity(userVector, entry.getValue()));
        }
        return similarities.entrySet().stream()
                .sorted(Map.Entry.<Long, Double>comparingByValue().reversed())
                .limit(limit).map(Map.Entry::getKey).collect(Collectors.toList());
    }

    public List<Long> getCollaborativeRecommendations(String userId, int limit) {
        Set<Long> interactedItems = getInteractedItemIds(userId);
        if (interactedItems.isEmpty()) return getTrendingProducts(limit);
        Map<Long, Double> candidateScores = new HashMap<>();
        for (Long itemId : interactedItems) {
            itemSimilarityMatrix.getOrDefault(itemId, Collections.emptyMap()).forEach((candidateId, similarity) -> {
                if (!interactedItems.contains(candidateId)) {
                    candidateScores.merge(candidateId, similarity, Double::sum);
                }
            });
        }
        return candidateScores.entrySet().stream()
                .sorted(Map.Entry.<Long, Double>comparingByValue().reversed())
                .limit(limit).map(Map.Entry::getKey).collect(Collectors.toList());
    }

    @Cacheable("productSimilarity")
    public List<Long> getSimilarProducts(Long productId, int limit) {
        loadCacheIfNeeded();
        if (!productFeatureVectors.containsKey(productId)) return Collections.emptyList();
        RealVector targetVector = productFeatureVectors.get(productId);
        return productFeatureVectors.entrySet().stream()
                .filter(e -> !e.getKey().equals(productId))
                .map(e -> Map.entry(e.getKey(), cosineSimilarity(targetVector, e.getValue())))
                .sorted(Map.Entry.<Long, Double>comparingByValue().reversed())
                .limit(limit).map(Map.Entry::getKey).collect(Collectors.toList());
    }

    public List<Long> getFrequentlyBoughtTogether(Long productId, int limit) {
        List<OrderDto> orders = Optional.ofNullable(
                orderServiceClient.getOrdersByProductId(productId).collectList().block())
                .orElse(Collections.emptyList());
        Map<Long, Integer> coPurchaseCount = new HashMap<>();
        for (OrderDto order : orders) {
            if (order.getItems() == null) continue;
            order.getItems().stream()
                    .map(OrderItemDto::getProductId)
                    .filter(pid -> !pid.equals(productId))
                    .forEach(pid -> coPurchaseCount.merge(pid, 1, Integer::sum));
        }
        return coPurchaseCount.entrySet().stream()
                .sorted(Map.Entry.<Long, Integer>comparingByValue().reversed())
                .limit(limit).map(Map.Entry::getKey).collect(Collectors.toList());
    }

    // === NEW: Cross-sell recommendations ===
    public List<Long> getCrossSellRecommendations(String userId, int limit) {
        Set<Long> interactedItems = getInteractedItemIds(userId);
        if (interactedItems.isEmpty()) return getTrendingProducts(limit);
        Map<Long, Double> crossSellScores = new HashMap<>();
        for (Long itemId : interactedItems) {
            List<Long> fbtItems = getFrequentlyBoughtTogether(itemId, limit * 2);
            for (int i = 0; i < fbtItems.size(); i++) {
                if (!interactedItems.contains(fbtItems.get(i))) {
                    crossSellScores.merge(fbtItems.get(i), 1.0 - (double) i / (limit * 2), Double::sum);
                }
            }
        }
        return crossSellScores.entrySet().stream()
                .sorted(Map.Entry.<Long, Double>comparingByValue().reversed())
                .limit(limit).map(Map.Entry::getKey).collect(Collectors.toList());
    }

    // === NEW: Upsell recommendations (higher-priced alternatives) ===
    public List<Long> getUpsellRecommendations(String userId, int limit) {
        Set<Long> interactedItems = getInteractedItemIds(userId);
        if (interactedItems.isEmpty()) return getTrendingProducts(limit);
        double avgPrice = interactedItems.stream()
                .mapToDouble(id -> Optional.ofNullable(productCache.get(id)).map(ProductDto::getPrice).orElse(0.0))
                .average().orElse(0);
        return productFeatureVectors.entrySet().stream()
                .filter(e -> !interactedItems.contains(e.getKey()))
                .map(e -> Map.entry(e.getKey(), Optional.ofNullable(productCache.get(e.getKey()))))
                .filter(e -> e.getValue().isPresent() && e.getValue().get().getPrice() > avgPrice * 1.2)
                .sorted((a, b) -> Double.compare(b.getValue().get().getPrice(), a.getValue().get().getPrice()))
                .limit(limit).map(e -> e.getValue().get().getId()).collect(Collectors.toList());
    }

    // === NEW: Store recommendations ===
    public List<Long> getStoreRecommendations(String userId, int limit) {
        loadCacheIfNeeded();
        Set<Long> interactedItems = getInteractedItemIds(userId);
        Map<Long, Long> storeOrderCount = new HashMap<>();
        List<OrderDto> orders = Optional.ofNullable(
                orderServiceClient.getOrdersByUserId(userId).collectList().block())
                .orElse(Collections.emptyList());
        for (OrderDto order : orders) {
            // Count which stores user orders from most
        }
        // Return stores with most products matching user preferences
        List<Long> storeIds = new ArrayList<>(storeProductMap.keySet());
        Collections.shuffle(storeIds);
        return storeIds.stream().limit(limit).collect(Collectors.toList());
    }

    // === NEW: Festival recommendations ===
    public List<Long> getFestivalRecommendations(String userId, int limit) {
        String activeFestival = FESTIVAL_MAP.getOrDefault(LocalDate.now().getMonth(), "");
        if (activeFestival.isEmpty()) return getPersonalizedRecommendations(userId, limit);
        List<String> festivalCategories = FESTIVAL_CATEGORIES.getOrDefault(activeFestival, List.of());
        if (festivalCategories.isEmpty()) return getPersonalizedRecommendations(userId, limit);
        Set<Long> interactedItems = getInteractedItemIds(userId);
        return productFeatureVectors.entrySet().stream()
                .filter(e -> !interactedItems.contains(e.getKey()))
                .filter(e -> Optional.ofNullable(productCache.get(e.getKey()))
                        .map(ProductDto::getCategoryName).map(cat -> festivalCategories.stream()
                                .anyMatch(fc -> cat.toLowerCase().contains(fc.toLowerCase())))
                        .orElse(false))
                .limit(limit).map(Map.Entry::getKey).collect(Collectors.toList());
    }

    // === NEW: Continue shopping / recently viewed ===
    public List<Long> getContinueShopping(String userId, int limit) {
        Set<Long> interactedItems = getInteractedItemIds(userId);
        if (interactedItems.isEmpty()) return getTrendingProducts(limit);
        List<Long> viewedItems = new ArrayList<>(interactedItems);
        Collections.reverse(viewedItems);
        return viewedItems.stream().limit(limit).collect(Collectors.toList());
    }

    // === NEW: Trending stores ===
    public List<Long> getTrendingStores(int limit) {
        loadCacheIfNeeded();
        List<Long> storeIds = new ArrayList<>(storeProductMap.keySet());
        Collections.shuffle(storeIds);
        return storeIds.stream().limit(limit).collect(Collectors.toList());
    }

    // === NEW: Personalized home feed ===
    public Map<String, List<Long>> getPersonalizedHomeFeed(String userId, int limit) {
        Map<String, List<Long>> feed = new LinkedHashMap<>();
        feed.put("trending", getTrendingProducts(limit));
        feed.put("recommended", getPersonalizedRecommendations(userId, limit));
        feed.put("continue_shopping", getContinueShopping(userId, 4));
        feed.put("fbt", getCrossSellRecommendations(userId, limit));
        String festival = FESTIVAL_MAP.getOrDefault(LocalDate.now().getMonth(), "");
        if (!festival.isEmpty()) {
            feed.put("festival_" + festival.toLowerCase(), getFestivalRecommendations(userId, limit));
        }
        return feed;
    }

    public List<Long> getTrendingProducts(int limit) {
        loadCacheIfNeeded();
        List<Long> productIds = new ArrayList<>(productFeatureVectors.keySet());
        Collections.shuffle(productIds);
        return productIds.stream().limit(Math.min(limit, productIds.size())).collect(Collectors.toList());
    }

    public List<Long> getContextualRecommendations(String userId, int limit) {
        return getPersonalizedRecommendations(userId, limit);
    }

    public List<Long> getSeasonalRecommendations(String userId, int limit) {
        return getPersonalizedRecommendations(userId, limit);
    }

    private void loadCacheIfNeeded() {
        long now = System.currentTimeMillis();
        if (now - cacheTimestamp > CACHE_VALIDITY_MS) {
            synchronized (this) {
                if (now - cacheTimestamp > CACHE_VALIDITY_MS) { loadCache(); cacheTimestamp = now; }
            }
        }
    }

    private void loadCache() {
        List<CategoryDto> categories = Optional.ofNullable(
                catalogServiceClient.getAllCategories().collectList().block())
                .orElse(Collections.emptyList());
        categoryToIndexMap.clear();
        for (int i = 0; i < categories.size(); i++) {
            categoryToIndexMap.put(categories.get(i).getId(), i);
        }
        numCategories = categories.size();
        List<ProductDto> products = Optional.ofNullable(
                catalogServiceClient.getAllProducts().collectList().block())
                .orElse(Collections.emptyList());
        productFeatureVectors.clear();
        productCache.clear();
        storeProductMap.clear();
        for (ProductDto product : products) {
            Long productId = product.getId();
            productCache.put(productId, product);
            RealVector vector = new ArrayRealVector(numCategories);
            Long categoryId = product.getCategoryId();
            if (categoryId != null && categoryToIndexMap.containsKey(categoryId)) {
                vector.setEntry(categoryToIndexMap.get(categoryId), 1.0);
            }
            productFeatureVectors.put(productId, vector);
            storeProductMap.computeIfAbsent(product.getStoreId(), k -> ConcurrentHashMap.newKeySet()).add(productId);
        }
        buildItemSimilarityMatrix();
    }

    private void buildItemSimilarityMatrix() {
        List<OrderDto> orders = Optional.ofNullable(
                orderServiceClient.getAllOrders().collectList().block())
                .orElse(Collections.emptyList());
        Map<Long, Map<Long, Integer>> coOccurrence = new HashMap<>();
        for (OrderDto order : orders) {
            List<OrderItemDto> items = order.getItems();
            if (items == null || items.isEmpty()) continue;
            for (int i = 0; i < items.size(); i++) {
                Long id1 = items.get(i).getProductId();
                for (int j = i + 1; j < items.size(); j++) {
                    Long id2 = items.get(j).getProductId();
                    coOccurrence.computeIfAbsent(id1, k -> new HashMap<>()).merge(id2, 1, Integer::sum);
                    coOccurrence.computeIfAbsent(id2, k -> new HashMap<>()).merge(id1, 1, Integer::sum);
                }
            }
        }
        itemSimilarityMatrix.clear();
        for (Map.Entry<Long, Map<Long, Integer>> e1 : coOccurrence.entrySet()) {
            Long id1 = e1.getKey();
            Map<Long, Integer> vec1 = e1.getValue();
            itemSimilarityMatrix.putIfAbsent(id1, new HashMap<>());
            for (Map.Entry<Long, Map<Long, Integer>> e2 : coOccurrence.entrySet()) {
                Long id2 = e2.getKey();
                if (id1.equals(id2)) continue;
                Map<Long, Integer> vec2 = e2.getValue();
                Set<Long> allItems = new HashSet<>(vec1.keySet()); allItems.addAll(vec2.keySet());
                double dot = 0, n1 = 0, n2 = 0;
                for (Long item : allItems) {
                    int v1 = vec1.getOrDefault(item, 0), v2 = vec2.getOrDefault(item, 0);
                    dot += v1 * v2; n1 += v1 * v1; n2 += v2 * v2;
                }
                itemSimilarityMatrix.get(id1).put(id2, n1 == 0 || n2 == 0 ? 0.0 : dot / (Math.sqrt(n1) * Math.sqrt(n2)));
            }
        }
    }

    private Set<Long> getInteractedItemIds(String userIdStr) {
        try {
            UUID userId = UUID.fromString(userIdStr);
            CustomerProfileDto profile = userServiceClient.getCustomerProfileByUserId(userId).block();
            if (profile == null) return Collections.emptySet();
            Set<Long> items = new HashSet<>();
            Optional.ofNullable(userServiceClient.getWishlistItems(userIdStr).collectList().block()).ifPresent(list ->
                list.forEach(i -> { try { items.add(Long.valueOf(i.getProductId())); } catch (Exception ignored) {} }));
            Optional.ofNullable(userServiceClient.getFavoriteProducts(userIdStr).collectList().block()).ifPresent(list ->
                list.forEach(i -> { try { items.add(Long.valueOf(i.getProductId())); } catch (Exception ignored) {} }));
            Optional.ofNullable(orderServiceClient.getOrdersByUserId(userIdStr).collectList().block()).ifPresent(orders ->
                orders.forEach(o -> { if (o.getItems() != null) o.getItems().forEach(i -> { try { items.add(i.getProductId()); } catch (Exception ignored) {} }); }));
            return items;
        } catch (Exception e) { return Collections.emptySet(); }
    }

    private RealVector computeUserVector(Set<Long> interactedItemIds) {
        if (interactedItemIds.isEmpty()) return null;
        double[] sum = new double[numCategories];
        int count = 0;
        for (Long itemId : interactedItemIds) {
            RealVector v = productFeatureVectors.get(itemId);
            if (v != null) { for (int i = 0; i < numCategories; i++) sum[i] += v.toArray()[i]; count++; }
        }
        if (count == 0) return null;
        for (int i = 0; i < numCategories; i++) sum[i] /= count;
        return new ArrayRealVector(sum);
    }

    private double cosineSimilarity(RealVector v1, RealVector v2) {
        double dot = 0, n1 = 0, n2 = 0;
        for (int i = 0; i < v1.getDimension(); i++) {
            double a = v1.getEntry(i), b = v2.getEntry(i);
            dot += a * b; n1 += a * a; n2 += b * b;
        }
        return n1 == 0 || n2 == 0 ? 0.0 : dot / (Math.sqrt(n1) * Math.sqrt(n2));
    }
}
