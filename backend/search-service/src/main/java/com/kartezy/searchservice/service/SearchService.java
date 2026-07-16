package com.kartezy.searchservice.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.kartezy.searchservice.document.*;
import com.kartezy.searchservice.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.StringReader;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SearchService {

    private final ElasticsearchClient esClient;
    private final ProductElasticsearchRepository productRepository;
    private final StoreElasticsearchRepository storeRepository;
    private final CategoryElasticsearchRepository categoryRepository;
    private final BrandElasticsearchRepository brandRepository;

    // Spell correction dictionary (common product-related words)
    private static final Map<String, String> SPELL_CORRECTIONS = Map.ofEntries(
        Map.entry("grocries", "groceries"), Map.entry("grocery", "groceries"),
        Map.entry("vegitable", "vegetable"), Map.entry("veg", "vegetable"),
        Map.entry("fruites", "fruits"), Map.entry("daliy", "dairy"),
        Map.entry("dairry", "dairy"), Map.entry("beverage", "beverages"),
        Map.entry("snaks", "snacks"), Map.entry("choclates", "chocolate"),
        Map.entry("biscket", "biscuit"), Map.entry("bisquit", "biscuit"),
        Map.entry("shampoo", "shampoo"), Map.entry("deterjent", "detergent"),
        Map.entry("eletronics", "electronics"), Map.entry("electricals", "electronics"),
        Map.entry("stationary", "stationery"), Map.entry("medecine", "medicine"),
        Map.entry("toothpaste", "toothpaste"), Map.entry("tooth brush", "toothbrush"),
        Map.entry("notebook", "notebook"), Map.entry("penciil", "pencil")
    );

    // Synonym groups for query expansion
    private static final Map<String, List<String>> SYNONYMS = Map.ofEntries(
        Map.entry("smartphone", List.of("phone", "mobile", "cellphone", "handset")),
        Map.entry("laptop", List.of("notebook", "computer", "macbook")),
        Map.entry("shoes", List.of("footwear", "sneakers", "sandals")),
        Map.entry("clothes", List.of("clothing", "apparel", "garments", "wear")),
        Map.entry("groceries", List.of("grocery", "food", "provisions", "essentials")),
        Map.entry("vegetables", List.of("veggies", "greens", "produce")),
        Map.entry("fruits", List.of("fruit", "fresh fruit")),
        Map.entry("dairy", List.of("milk", "cheese", "butter", "yogurt", "cream")),
        Map.entry("beverages", List.of("drinks", "soft drinks", "juice", "water", "cola")),
        Map.entry("snacks", List.of("snack", "chips", "namkeen", "munchies")),
        Map.entry("home", List.of("household", "home care", "cleaning")),
        Map.entry("baby", List.of("baby care", "infant", "diapers")),
        Map.entry("personal care", List.of("beauty", "cosmetics", "skincare", "hygiene"))
    );

    public List<ProductDocument> searchProducts(String query, int page, int size, String category,
                                                 Double minPrice, Double maxPrice, String sort) {
        String correctedQuery = spellCorrect(query);
        String expandedQuery = expandWithSynonyms(correctedQuery);

        try {
            var boolQuery = new ArrayList<String>();
            boolQuery.add("{\"multi_match\": {\"query\": \"" + escaped(expandedQuery) + "\", \"fields\": [\"name^3\", \"description^2\", \"sku\", \"brandName\", \"categoryName\", \"tags\"], \"type\": \"cross_fields\", \"operator\": \"or\"}}");
            if (category != null) boolQuery.add("{\"term\": {\"categoryId\": \"" + escaped(category) + "\"}}");
            if (minPrice != null) boolQuery.add("{\"range\": {\"price\": {\"gte\": " + minPrice + "}}}");
            if (maxPrice != null) boolQuery.add("{\"range\": {\"price\": {\"lte\": " + maxPrice + "}}}");

            String mustClauses = String.join(",", boolQuery);
            String sortClause = buildSortClause(sort, expandedQuery);
            String functionScoreClause = buildFunctionScoreClause(expandedQuery);

            String searchQuery = "{\"from\": " + (page * size) + ", \"size\": " + size + ", " + sortClause +
                "\"query\": {\"function_score\": {\"query\": {\"bool\": {\"must\": [" + mustClauses + "]}}, \"functions\": [" + functionScoreClause + "], \"score_mode\": \"multiply\", \"boost_mode\": \"multiply\"}}}";

            SearchResponse<ProductDocument> response = esClient.search(
                s -> s.index("products").withJson(new StringReader(searchQuery)), ProductDocument.class);
            return response.hits().hits().stream().map(h -> h.source()).filter(Objects::nonNull).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Elasticsearch search failed: {}", e.getMessage());
            return productRepository.findByNameContainingIgnoreCase(correctedQuery);
        }
    }

    // === NEW: Personalized search with ranking ===
    public List<ProductDocument> searchProductsPersonalized(String query, int page, int size,
             String category, Double minPrice, Double maxPrice, String userId) {
        List<ProductDocument> results = searchProducts(query, page, size, category, minPrice, maxPrice, null);
        if (userId == null || userId.isEmpty()) return results;
        // Re-rank based on user preferences (simulated)
        int userHash = userId.hashCode();
        results.sort((a, b) -> {
            double scoreA = a.getPopularityScore() * 0.5 + (Math.abs(a.getName().hashCode() % userHash) / (double) Integer.MAX_VALUE) * 0.5;
            double scoreB = b.getPopularityScore() * 0.5 + (Math.abs(b.getName().hashCode() % userHash) / (double) Integer.MAX_VALUE) * 0.5;
            return Double.compare(scoreB, scoreA);
        });
        return results;
    }

    // === NEW: Semantic search with NLP query expansion ===
    public List<ProductDocument> semanticSearch(String query, int page, int size) {
        String corrected = spellCorrect(query);
        String expanded = expandWithSynonyms(corrected);
        // Use the expanded query for broader semantic matching
        return searchProducts(expanded, page, size, null, null, null, null);
    }

    // === NEW: Spell correction ===
    public String spellCorrect(String query) {
        if (query == null || query.isEmpty()) return query;
        String[] words = query.toLowerCase().split("\\s+");
        StringBuilder corrected = new StringBuilder();
        for (int i = 0; i < words.length; i++) {
            String word = words[i];
            // Exact match in dictionary
            if (SPELL_CORRECTIONS.containsKey(word)) {
                word = SPELL_CORRECTIONS.get(word);
            } else {
                // Levenshtein distance fuzzy matching
                String bestMatch = findClosestWord(word, 2);
                if (bestMatch != null) word = bestMatch;
            }
            corrected.append(word);
            if (i < words.length - 1) corrected.append(" ");
        }
        String result = corrected.toString();
        if (!result.equals(query)) {
            log.info("Spell corrected '{}' -> '{}'", query, result);
        }
        return result;
    }

    // === NEW: Query expansion with synonyms ===
    public String expandWithSynonyms(String query) {
        if (query == null || query.isEmpty()) return query;
        String[] words = query.toLowerCase().split("\\s+");
        Set<String> expanded = new LinkedHashSet<>();
        expanded.add(query);
        for (String word : words) {
            if (SYNONYMS.containsKey(word)) {
                String synQuery = query.replace(word, SYNONYMS.get(word).get(0));
                expanded.add(synQuery);
                for (String syn : SYNONYMS.get(word)) {
                    expanded.add(word + " OR " + syn);
                }
            }
        }
        return String.join(" ", expanded);
    }

    public List<StoreDocument> searchStores(String query, String city) {
        String corrected = spellCorrect(query);
        if (city != null && !city.isEmpty()) {
            return storeRepository.findByNameContainingIgnoreCaseAndCity(corrected, city);
        }
        return storeRepository.findByNameContainingIgnoreCase(corrected);
    }

    public List<String> autocomplete(String prefix) {
        String corrected = spellCorrect(prefix);
        return productRepository.findByNameStartingWith(corrected).stream()
            .map(ProductDocument::getName).distinct().limit(10).collect(Collectors.toList());
    }

    public List<CategoryDocument> getCategories(String parentId) {
        if (parentId != null) return categoryRepository.findByParentId(parentId);
        return categoryRepository.findByIsActiveTrue();
    }

    public List<BrandDocument> searchBrands(String query) {
        return brandRepository.findByNameContainingIgnoreCase(spellCorrect(query));
    }

    private String findClosestWord(String word, int maxDistance) {
        String bestMatch = null;
        int bestDistance = maxDistance + 1;
        for (String dictWord : SPELL_CORRECTIONS.keySet()) {
            int dist = levenshteinDistance(word, dictWord);
            if (dist < bestDistance) {
                bestDistance = dist;
                bestMatch = SPELL_CORRECTIONS.get(dictWord);
            }
        }
        return bestMatch;
    }

    private int levenshteinDistance(String a, String b) {
        int[][] dp = new int[a.length() + 1][b.length() + 1];
        for (int i = 0; i <= a.length(); i++) dp[i][0] = i;
        for (int j = 0; j <= b.length(); j++) dp[0][j] = j;
        for (int i = 1; i <= a.length(); i++) {
            for (int j = 1; j <= b.length(); j++) {
                int cost = a.charAt(i - 1) == b.charAt(j - 1) ? 0 : 1;
                dp[i][j] = Math.min(Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1), dp[i - 1][j - 1] + cost);
            }
        }
        return dp[a.length()][b.length()];
    }

    private String buildSortClause(String sort, String query) {
        if (sort != null) {
            return "\"sort\": [{\"" + sort + "\": {\"order\": \"desc\"}}, {\"_score\": {\"order\": \"desc\"}}],";
        }
        return "";
    }

    private String buildFunctionScoreClause(String query) {
        // Boost popular products and recently added products
        return "{\"field_value_factor\": {\"field\": \"popularityScore\", \"factor\": 0.3, \"modifier\": \"log1p\"}}," +
               "{\"field_value_factor\": {\"field\": \"rating\", \"factor\": 0.2, \"modifier\": \"log1p\"}}";
    }

    private String escaped(String s) {
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
