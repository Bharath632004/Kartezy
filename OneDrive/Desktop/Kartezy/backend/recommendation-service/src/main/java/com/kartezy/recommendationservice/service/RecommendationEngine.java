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
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
/**
 * Enhanced recommendation engine that implements collaborative filtering, content-based filtering, and hybrid recommendation.
 */
@Service
public class RecommendationEngine {
    @Autowired
    private UserServiceClient userServiceClient;
    @Autowired
    private CatalogServiceClient catalogServiceClient;
    @Autowired
    private OrderServiceClient orderServiceClient;
    // Cache for category to index mapping
    private Map<Long, Integer> categoryToIndexMap = new HashMap<>();
    private int numCategories = 0;
    // Cache for product feature vectors (content-based)
    private Map<Long, RealVector> productFeatureVectors = new ConcurrentHashMap<>();
    // Cache for product details
    private Map<Long, ProductDto> productCache = new ConcurrentHashMap<>();
    // Cache for user vectors (collaborative filtering)
    private Map<String, RealVector> userVectors = new ConcurrentHashMap<>();
    // Cache for item-item similarity matrix (collaborative filtering)
    private Map<Long, Map<Long, Double>> itemSimilarityMatrix = new ConcurrentHashMap<>();
    // Timestamp for cache validity (5 minutes)
    private static final long CACHE_VALIDITY_MS = 5 * 60 * 1000;
    private volatile long cacheTimestamp = 0;
    /**
     * Get personalized recommendations for a user using hybrid approach.
     * Combines content-based and collaborative filtering.
     *
     * @param userId the user ID (as string)
     * @param limit  maximum number of recommendations
     * @return list of recommended product IDs
     */
    public List<Long> getPersonalizedRecommendations(String userId, int limit) {
        loadCacheIfNeeded();
        Set<Long> interactedItems = getInteractedItemIds(userId);
        if (interactedItems.isEmpty()) {
            // If no interactions, return trending products
            return getTrendingProducts(limit);
        }
        // Get content-based recommendations
        List<Long> contentBased = getContentBasedRecommendations(userId, limit * 2); // Get more for blending
        // Get collaborative filtering recommendations
        List<Long> collaborativeBased = getCollaborativeRecommendations(userId, limit * 2);
        // Combine and rank (simple hybrid: combine scores)
        Map<Long, Double> hybridScores = new HashMap<>();
        // Add content-based scores (normalized)
        for (int i = 0; i < contentBased.size(); i++) {
            Long productId = contentBased.get(i);
            double score = 1.0 - (double) i / contentBased.size(); // Higher rank -> higher score
            hybridScores.merge(productId, score, Double::sum);
        }
        // Add collaborative-based scores (normalized)
        for (int i = 0; i < collaborativeBased.size(); i++) {
            Long productId = collaborativeBased.get(i);
            double score = 1.0 - (double) i / collaborativeBased.size();
            hybridScores.merge(productId, score, Double::sum);
        }
        // Remove items the user has already interacted with
        hybridScores.keySet().removeAll(interactedItems);
        // Sort by score descending and return top 'limit'
        return hybridScores.entrySet()
                .stream()
                .sorted(Map.Entry.<Long, Double>comparingByValue().reversed())
                .limit(limit)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }
    /**
     * Get content-based recommendations for a user.
     * @param userId the user ID
     * @param limit  maximum number of recommendations
     * @return list of recommended product IDs
     */
    @Cacheable("contentBasedRecommendations")
    public List<Long> getContentBasedRecommendations(String userId, int limit) {
        Set<Long> interactedItems = getInteractedItemIds(userId);
        if (interactedItems.isEmpty()) {
            return getTrendingProducts(limit);
        }
        RealVector userVector = computeUserVector(interactedItems);
        if (userVector == null) {
            return getTrendingProducts(limit);
        }
        Map<Long, Double> similarities = new HashMap<>();
        for (Map.Entry<Long, RealVector> entry : productFeatureVectors.entrySet()) {
            Long productId = entry.getKey();
            if (interactedItems.contains(productId)) {
                continue;
            }
            RealVector productVector = entry.getValue();
            double similarity = cosineSimilarity(userVector, productVector);
            similarities.put(productId, similarity);
        }
        return similarities.entrySet()
                .stream()
                .sorted(Map.Entry.<Long, Double>comparingByValue().reversed())
                .limit(limit)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }
    /**
     * Get collaborative filtering recommendations for a user (item-based).
     * @param userId the user ID
     * @param limit  maximum number of recommendations
     * @return list of recommended product IDs
     */
    public List<Long> getCollaborativeRecommendations(String userId, int limit) {
        Set<Long> interactedItems = getInteractedItemIds(userId);
        if (interactedItems.isEmpty()) {
            return getTrendingProducts(limit);
        }
        // Compute user vector from interaction matrix (we'll use a simple approach: average of interacted item vectors)
        // For simplicity, we'll use the same user vector as in content-based but we could have a separate CF user vector.
        // Instead, we'll use item-based CF: for each interacted item, get similar items and aggregate.
        Map<Long, Double> candidateScores = new HashMap<>();
        for (Long itemId : interactedItems) {
            Map<Long, Double> similarItems = itemSimilarityMatrix.getOrDefault(itemId, Collections.emptyMap());
            for (Map.Entry<Long, Double> entry : similarItems.entrySet()) {
                Long candidateId = entry.getKey();
                if (interactedItems.contains(candidateId)) {
                    continue;
                }
                double similarity = entry.getValue();
                candidateScores.merge(candidateId, similarity, Double::sum);
            }
        }
        // Normalize scores by the number of interacted items that contributed
        // (optional, we can leave as is)
        return candidateScores.entrySet()
                .stream()
                .sorted(Map.Entry.<Long, Double>comparingByValue().reversed())
                .limit(limit)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }
    /**
     * Get product recommendations based on product similarity (content-based).
     * @param productId the product ID
     * @param limit     maximum number of recommendations
     * @return list of similar product IDs
     */
    @Cacheable("productSimilarity")
    public List<Long> getSimilarProducts(Long productId, int limit) {
        loadCacheIfNeeded();
        if (!productFeatureVectors.containsKey(productId)) {
            return Collections.emptyList();
        }
        RealVector targetVector = productFeatureVectors.get(productId);
        Map<Long, Double> similarities = new HashMap<>();
        for (Map.Entry<Long, RealVector> entry : productFeatureVectors.entrySet()) {
            Long id = entry.getKey();
            if (id.equals(productId)) continue;
            RealVector vector = entry.getValue();
            double cosine = cosineSimilarity(targetVector, vector);
            similarities.put(id, cosine);
        }
        return similarities.entrySet()
                .stream()
                .sorted(Map.Entry.<Long, Double>comparingByValue().reversed())
                .limit(limit)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }
    /**
     * Get frequently bought together items for a product.
     * This uses association rules from order items.
     * @param productId the product ID
     * @param limit     maximum number of recommendations
     * @return list of product IDs that are frequently bought together
     */
    public List<Long> getFrequentlyBoughtTogether(Long productId, int limit) {
        // We'll get orders that contain this product and then find other items in those orders
        List<OrderDto> orders = orderServiceClient.getOrdersByProductId(productId)
                .collectList()
                .block();
        if (orders == null) {
            orders = Collections.emptyList();
        }
        Map<Long, Integer> coPurchaseCount = new HashMap<>();
        for (OrderDto order : orders) {
            List<OrderItemDto> items = order.getItems();
            if (items == null) continue;
            for (OrderItemDto item : items) {
                Long otherProductId = item.getProductId();
                if (!otherProductId.equals(productId)) {
                    coPurchaseCount.merge(otherProductId, 1, Integer::sum);
                }
            }
        }
        return coPurchaseCount.entrySet()
                .stream()
                .sorted(Map.Entry.<Long, Integer>comparingByValue().reversed())
                .limit(limit)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }
    /**
     * Get trending products based on recent interactions and sales.
     * @param limit maximum number of recommendations
     * @return list of trending product IDs
     */
    public List<Long> getTrendingProducts(int limit) {
        loadCacheIfNeeded();
        // We'll use a combination of recent views, purchases, and ratings.
        // For simplicity, we'll return a random set of products (as before) but we can improve.
        List<Long> productIds = new ArrayList<>(productFeatureVectors.keySet());
        Collections.shuffle(productIds); // Randomize for variety
        return productIds.stream()
                .limit(Math.min(limit, productIds.size()))
                .collect(Collectors.toList());
    }
    /**
     * Get recommendations based on user's recent activity (browsing, cart, wishlist).
     * We'll use the same as personalized recommendations for now.
     * @param userId the user ID
     * @param limit  maximum number of recommendations
     * @return list of recommended product IDs
     */
    public List<Long> getContextualRecommendations(String userId, int limit) {
        return getPersonalizedRecommendations(userId, limit);
    }
    /**
     * Get recommendations based on seasonal trends, festivals, etc.
     * This would involve adjusting scores based on time of year, etc.
     * For now, we return trending products.
     * @param userId the user ID
     * @param limit  maximum number of recommendations
     * @return list of recommended product IDs
     */
    public List<Long> getSeasonalRecommendations(String userId, int limit) {
        // In a real system, we would adjust the scores based on season, festival, etc.
        // For simplicity, we delegate to personalized recommendations.
        return getPersonalizedRecommendations(userId, limit);
    }
    // Helper methods
    private void loadCacheIfNeeded() {
        long now = System.currentTimeMillis();
        if (now - cacheTimestamp > CACHE_VALIDITY_MS) {
            synchronized (this) {
                if (now - cacheTimestamp > CACHE_VALIDITY_MS) {
                    loadCache();
                    cacheTimestamp = now;
                }
            }
        }
    }
    private void loadCache() {
        // Load categories and create mapping
        List<CategoryDto> categories = catalogServiceClient.getAllCategories()
                .collectList()
                .block();
        if (categories == null) {
            categories = Collections.emptyList();
        }
        categoryToIndexMap.clear();
        for (int i = 0; i < categories.size(); i++) {
            categoryToIndexMap.put(categories.get(i).getId(), i);
        }
        numCategories = categories.size();
        // Load all products and compute feature vectors
        List<ProductDto> products = catalogServiceClient.getAllProducts()
                .collectList()
                .block();
        if (products == null) {
            products = Collections.emptyList();
        }
        productFeatureVectors.clear();
        productCache.clear();
        for (ProductDto product : products) {
            Long productId = product.getId();
            productCache.put(productId, product);
            // Create feature vector: one-hot encoding of category
            RealVector vector = new ArrayRealVector(numCategories);
            Long categoryId = product.getCategoryId();
            if (categoryId != null && categoryToIndexMap.containsKey(categoryId)) {
                int index = categoryToIndexMap.get(categoryId);
                vector.setEntry(index, 1.0);
            }
            // If no category, the vector remains zeros (we could use a default category)
            productFeatureVectors.put(productId, vector);
        }
        // Build item-item similarity matrix for collaborative filtering
        buildItemSimilarityMatrix();
    }
    /**
     * Build item-item similarity matrix based on co-purchase and co-view data.
     * This is a simplified item-based collaborative filtering.
     */
    private void buildItemSimilarityMatrix() {
        // We'll use order items to compute co-occurrence.
        // In a real system, we would also use views, cart additions, etc.
        List<OrderDto> orders = orderServiceClient.getAllOrders()
                .collectList()
                .block();
        if (orders == null) {
            orders = Collections.emptyList();
        }
        Map<Long, Map<Long, Integer>> coOccurrence = new HashMap<>();
        Map<Long, Integer> itemCounts = new HashMap<>();
        for (OrderDto order : orders) {
            List<OrderItemDto> items = order.getItems();
            if (items == null || items.isEmpty()) continue;
            // We'll consider each pair of items in the same order
            for (int i = 0; i < items.size(); i++) {
                OrderItemDto item1 = items.get(i);
                Long id1 = item1.getProductId();
                itemCounts.merge(id1, 1, Integer::sum);
                for (int j = i + 1; j < items.size(); j++) {
                    OrderItemDto item2 = items.get(j);
                    Long id2 = item2.getProductId();
                    itemCounts.merge(id2, 1, Integer::sum);
                    coOccurrence.computeIfAbsent(id1, k -> new HashMap<>()).merge(id2, 1, Integer::sum);
                    coOccurrence.computeIfAbsent(id2, k -> new HashMap<>()).merge(id1, 1, Integer::sum);
                }
            }
        }
        // Compute similarity using cosine similarity on co-occurrence vectors
        itemSimilarityMatrix.clear();
        for (Map.Entry<Long, Map<Long, Integer>> entry1 : coOccurrence.entrySet()) {
            Long itemId1 = entry1.getKey();
            Map<Long, Integer> vec1 = entry1.getValue();
            itemSimilarityMatrix.putIfAbsent(itemId1, new HashMap<>());
            for (Map.Entry<Long, Map<Long, Integer>> entry2 : coOccurrence.entrySet()) {
                Long itemId2 = entry2.getKey();
                if (itemId1.equals(itemId2)) continue;
                Map<Long, Integer> vec2 = entry2.getValue();
                double dotProduct = 0.0;
                double normA = 0.0;
                double normB = 0.0;
                // We'll compute the dot product of the co-occurrence vectors
                // Get all unique item ids from both vectors
                Set<Long> allItems = new HashSet<>(vec1.keySet());
                allItems.addAll(vec2.keySet());
                for (Long itemId : allItems) {
                    Integer val1 = vec1.getOrDefault(itemId, 0);
                    Integer val2 = vec2.getOrDefault(itemId, 0);
                    dotProduct += val1 * val2;
                    normA += Math.pow(val1, 2);
                    normB += Math.pow(val2, 2);
                }
                if (normA == 0 || normB == 0) {
                    itemSimilarityMatrix.get(itemId1).put(itemId2, 0.0);
                } else {
                    double similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
                    itemSimilarityMatrix.get(itemId1).put(itemId2, similarity);
                }
            }
        }
    }
    private Set<Long> getInteractedItemIds(String userIdStr) {
        try {
            UUID userId = UUID.fromString(userIdStr);
            // Get customer profile by userId
            CustomerProfileDto customerProfileDto = userServiceClient.getCustomerProfileByUserId(userId).block();
            if (customerProfileDto == null) {
                return Collections.emptySet();
            }
            Set<Long> interactedItems = new HashSet<>();
            // Wishlist items
            var wishlistItemsFlux = userServiceClient.getWishlistItems(userIdStr);
            List<WishlistItemDto> wishlistItems = wishlistItemsFlux.collectList().block();
            if (wishlistItems != null) {
                for (WishlistItemDto item : wishlistItems) {
                    try {
                        Long productId = Long.valueOf(item.getProductId());
                        interactedItems.add(productId);
                    } catch (NumberFormatException e) {
                        // Ignore if not a number
                    }
                }
            }
            // Favorite products
            var favoriteProductsFlux = userServiceClient.getFavoriteProducts(userIdStr);
            List<FavoriteProductDto> favoriteProducts = favoriteProductsFlux.collectList().block();
            if (favoriteProducts != null) {
                for (FavoriteProductDto item : favoriteProducts) {
                    try {
                        Long productId = Long.valueOf(item.getProductId());
                        interactedItems.add(productId);
                    } catch (NumberFormatException e) {
                        // Ignore
                    }
                }
            }
            // Search history: we have clickedResultId
            var searchHistoryFlux = userServiceClient.getSearchHistory(userIdStr);
            List<SearchHistoryDto> searchHistory = searchHistoryFlux.collectList().block();
            if (searchHistory != null) {
                for (SearchHistoryDto item : searchHistory) {
                    String clickedResultId = item.getClickedResultId();
                    if (clickedResultId != null && !clickedResultId.isEmpty()) {
                        try {
                            Long productId = Long.valueOf(clickedResultId);
                            interactedItems.add(productId);
                        } catch (NumberFormatException e) {
                            // Ignore
                        }
                    }
                }
            }
            // Orders: we have order items
            var ordersFlux = orderServiceClient.getOrdersByUserId(userIdStr);
            List<OrderDto> orders = ordersFlux.collectList().block();
            if (orders != null) {
                for (OrderDto order : orders) {
                    List<OrderItemDto> items = order.getItems();
                    if (items != null) {
                        for (OrderItemDto item : items) {
                            try {
                                Long productId = Long.valueOf(item.getProductId());
                                interactedItems.add(productId);
                            } catch (NumberFormatException e) {
                                // Ignore
                            }
                        }
                    }
                }
            }
            return interactedItems;
        } catch (IllegalArgumentException e) {
            // Invalid UUID
            return Collections.emptySet();
        }
    }
    private RealVector computeUserVector(Set<Long> interactedItemIds) {
        if (interactedItemIds.isEmpty()) {
            return null;
        }
        // Sum vectors
        double[] sum = new double[numCategories];
        int count = 0;
        for (Long itemId : interactedItemIds) {
            RealVector vector = productFeatureVectors.get(itemId);
            if (vector != null) {
                double[] vecArray = vector.toArray();
                for (int i = 0; i < numCategories; i++) {
                    sum[i] += vecArray[i];
                }
                count++;
            }
        }
        if (count == 0) {
            return null;
        }
        // Average
        for (int i = 0; i < numCategories; i++) {
            sum[i] /= count;
        }
        return new ArrayRealVector(sum);
    }
    private double cosineSimilarity(RealVector v1, RealVector v2) {
        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;
        for (int i = 0; i < v1.getDimension(); i++) {
            double val1 = v1.getEntry(i);
            double val2 = v2.getEntry(i);
            dotProduct += val1 * val2;
            normA += Math.pow(val1, 2);
            normB += Math.pow(val2, 2);
        }
        if (normA == 0.0 || normB == 0.0) {
            return 0.0;
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}