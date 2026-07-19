package com.kartezy.searchservice.service;

import com.kartezy.shared.ai.SearchModels.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class SearchService {

    private final Map<String, Set<String>> synonymMap = new ConcurrentHashMap<>();
    private final Map<String, List<String>> autoCompleteCache = new ConcurrentHashMap<>();
    private final Map<String, Double> popularQueries = new ConcurrentHashMap<>();

    private static final Pattern WORD_BOUNDARY = Pattern.compile("\\W+");
    private static final Map<String, String> SPELLING_DICT = new ConcurrentHashMap<>();

    public SearchService() {
        initSynonyms();
        initSpellingDictionary();
    }

    public Map<String, Object> search(SearchRequest request) {
        String query = request.getQuery();
        if (query == null || query.trim().isEmpty()) {
            return Map.of("results", Collections.emptyList(), "total", 0);
        }

        String correctedQuery = spellCheck(query);
        List<String> expandedTerms = expandWithSynonyms(correctedQuery);

        List<SearchResult> results = performSemanticSearch(correctedQuery, expandedTerms, request);
        results = applyRanking(results, request);
        results = applyPersonalization(results, request);

        int total = results.size();
        int from = request.getPage() * request.getSize();
        int to = Math.min(from + request.getSize(), results.size());
        List<SearchResult> pageResults = from < results.size() ? results.subList(from, to) : Collections.emptyList();

        Map<String, Object> response = new HashMap<>();
        response.put("results", pageResults);
        response.put("total", total);
        response.put("page", request.getPage());
        response.put("size", request.getSize());
        response.put("correctedQuery", query.equals(correctedQuery) ? null : correctedQuery);
        response.put("suggestions", getSearchSuggestions(query, 5));
        return response;
    }

    public List<AutoCompleteSuggestion> autocomplete(String prefix, int limit) {
        if (prefix == null || prefix.trim().isEmpty()) return Collections.emptyList();

        return autoCompleteCache.entrySet().stream()
                .filter(e -> e.getKey().toLowerCase().startsWith(prefix.toLowerCase()))
                .flatMap(e -> e.getValue().stream()
                        .map(text -> new AutoCompleteSuggestion(text, "query", calculateAutocompleteScore(text, prefix))))
                .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    public SpellCorrection checkSpelling(String text) {
        if (text == null || text.trim().isEmpty()) {
            return new SpellCorrection(text, text, 1.0, Collections.emptyList());
        }

        String[] words = WORD_BOUNDARY.split(text.toLowerCase());
        StringBuilder corrected = new StringBuilder();
        List<String> alternatives = new ArrayList<>();
        int corrections = 0;

        for (String word : words) {
            if (word.isEmpty()) continue;
            String correct = SPELLING_DICT.getOrDefault(word, word);
            if (!correct.equals(word)) {
                corrections++;
                alternatives.add(correct);
            }
            if (corrected.length() > 0) corrected.append(" ");
            corrected.append(correct);
        }

        double confidence = corrections == 0 ? 1.0 : 1.0 / (1.0 + corrections);
        return new SpellCorrection(text, corrected.toString(), confidence, alternatives);
    }

    public Map<String, Object> searchByBarcode(String barcode) {
        return Map.of(
                "barcode", barcode,
                "results", Collections.emptyList(),
                "found", false
        );
    }

    public Map<String, Object> searchByImage(byte[] imageData) {
        return Map.of(
                "results", Collections.emptyList(),
                "method", "image_search",
                "total", 0
        );
    }

    public List<String> getSearchSuggestions(String query, int limit) {
        if (query == null || query.isEmpty()) return Collections.emptyList();
        return autoCompleteCache.entrySet().stream()
                .filter(e -> e.getKey().toLowerCase().contains(query.toLowerCase()))
                .sorted((a, b) -> Double.compare(
                        popularQueries.getOrDefault(b.getKey(), 0.0),
                        popularQueries.getOrDefault(a.getKey(), 0.0)))
                .limit(limit)
                .flatMap(e -> e.getValue().stream())
                .limit(limit)
                .collect(Collectors.toList());
    }

    public void recordSearchFeedback(String query, String resultId, String action, int position) {
        popularQueries.merge(query.toLowerCase(), 1.0, Double::sum);
        updateAutoCompleteCache(query);
    }

    private List<SearchResult> performSemanticSearch(String query, List<String> expandedTerms, SearchRequest request) {
        List<SearchResult> results = new ArrayList<>();
        String queryLower = query.toLowerCase();
        String[] queryTerms = WORD_BOUNDARY.split(queryLower);

        for (int i = 0; i < Math.max(expandedTerms.size(), 1); i++) {
            SemanticSearchResult semantic = new SemanticSearchResult(
                    "product-" + i,
                    expandedTerms.isEmpty() ? query : expandedTerms.get(i),
                    calculateSemanticScore(queryLower, expandedTerms.isEmpty() ? query : expandedTerms.get(i)),
                    calculateKeywordScore(queryTerms, request)
            );
            results.add(new SearchResult(
                    semantic.getId(),
                    "PRODUCT",
                    semantic.getFinalScore(),
                    Map.of("name", query, "relevance", semantic.getFinalScore())
            ));
        }

        return results;
    }

    private double calculateSemanticScore(String query, String term) {
        String[] queryWords = WORD_BOUNDARY.split(query);
        String[] termWords = WORD_BOUNDARY.split(term.toLowerCase());
        long common = Arrays.stream(queryWords)
                .filter(w -> !w.isEmpty())
                .filter(w -> Arrays.asList(termWords).contains(w))
                .count();
        return queryWords.length > 0 ? (double) common / queryWords.length : 0;
    }

    private double calculateKeywordScore(String[] queryTerms, SearchRequest request) {
        double score = 1.0;
        if (request.getCategory() != null) score *= 1.2;
        if (request.getMinPrice() != null || request.getMaxPrice() != null) score *= 1.1;
        if (request.getBrands() != null && !request.getBrands().isEmpty()) score *= 1.3;
        score *= Math.min(1.5, 1.0 + queryTerms.length * 0.1);
        return score;
    }

    private List<SearchResult> applyRanking(List<SearchResult> results, SearchRequest request) {
        String sortBy = request.getSortBy();
        if (sortBy == null) return results;

        switch (sortBy) {
            case "price_asc":
                results.sort(Comparator.comparingDouble(r -> extractPrice(r)));
                break;
            case "price_desc":
                results.sort((a, b) -> Double.compare(extractPrice(b), extractPrice(a)));
                break;
            case "rating":
                results.sort((a, b) -> Double.compare(
                        extractRating(b), extractRating(a)));
                break;
            case "newest":
                results.sort((a, b) -> Long.compare(
                        extractTimestamp(b), extractTimestamp(a)));
                break;
            default:
                results.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));
                break;
        }
        return results;
    }

    private List<SearchResult> applyPersonalization(List<SearchResult> results, SearchRequest request) {
        if (!request.isPersonalized() || request.getUserId() == null) return results;
        results.forEach(r -> r.setScore(r.getScore() * 1.15));
        return results;
    }

    private double extractPrice(SearchResult result) {
        Object price = result.getSource() != null ? result.getSource().get("price") : null;
        return price instanceof Number ? ((Number) price).doubleValue() : 0.0;
    }

    private double extractRating(SearchResult result) {
        Object rating = result.getSource() != null ? result.getSource().get("rating") : null;
        return rating instanceof Number ? ((Number) rating).doubleValue() : 0.0;
    }

    private long extractTimestamp(SearchResult result) {
        Object ts = result.getSource() != null ? result.getSource().get("timestamp") : null;
        return ts instanceof Number ? ((Number) ts).longValue() : 0L;
    }

    private String spellCheck(String query) {
        String[] words = WORD_BOUNDARY.split(query.toLowerCase());
        StringBuilder corrected = new StringBuilder();
        boolean changed = false;

        for (String word : words) {
            if (word.isEmpty()) continue;
            String correct = SPELLING_DICT.getOrDefault(word, word);
            if (!correct.equals(word)) changed = true;
            if (corrected.length() > 0) corrected.append(" ");
            corrected.append(correct);
        }
        return changed ? corrected.toString() : query;
    }

    private List<String> expandWithSynonyms(String query) {
        Set<String> expanded = new LinkedHashSet<>();
        String[] words = WORD_BOUNDARY.split(query.toLowerCase());
        for (String word : words) {
            expanded.add(word);
            Set<String> synonyms = synonymMap.get(word);
            if (synonyms != null) expanded.addAll(synonyms);
        }
        return new ArrayList<>(expanded);
    }

    private double calculateAutocompleteScore(String text, String prefix) {
        double base = popularQueries.getOrDefault(text.toLowerCase(), 1.0);
        double prefixMatch = text.toLowerCase().startsWith(prefix.toLowerCase()) ? 2.0 : 1.0;
        return base * prefixMatch;
    }

    private void updateAutoCompleteCache(String query) {
        String lower = query.toLowerCase();
        for (int i = 1; i <= Math.min(lower.length(), 50); i++) {
            String prefix = lower.substring(0, i);
            autoCompleteCache.computeIfAbsent(prefix, k -> Collections.synchronizedList(new ArrayList<>()))
                    .add(query);
        }
    }

    private void initSynonyms() {
        synonymMap.put("mobile", Set.of("phone", "smartphone", "cellphone", "handset"));
        synonymMap.put("phone", Set.of("mobile", "smartphone", "cellphone", "handset"));
        synonymMap.put("laptop", Set.of("notebook", "computer", "macbook", "ultrabook"));
        synonymMap.put("shoes", Set.of("footwear", "sneakers", "sandals", "boots"));
        synonymMap.put("groceries", Set.of("food", "produce", "groceries", "essentials"));
        synonymMap.put("vegetables", Set.of("veggies", "produce", "greens"));
        synonymMap.put("fruits", Set.of("fruit", "produce", "fresh fruits"));
        synonymMap.put("clothes", Set.of("apparel", "clothing", "garments", "attire"));
        synonymMap.put("medicines", Set.of("drugs", "pharmacy", "medication"));
        synonymMap.put("electronics", Set.of("gadgets", "devices", "tech"));
        synonymMap.put("books", Set.of("novels", "reading", "publications"));
        synonymMap.put("furniture", Set.of("home decor", "furnishings", "home goods"));
        synonymMap.put("snacks", Set.of("chips", "namkeen", "munchies"));
        synonymMap.put("beverages", Set.of("drinks", "cold drinks", "juices", "soft drinks"));
        synonymMap.put("dairy", Set.of("milk", "cheese", "butter", "yogurt"));
        synonymMap.put("bakery", Set.of("bread", "pastries", "cakes", "buns"));
    }

    private void initSpellingDictionary() {
        String[] commonWords = {"rice", "wheat", "sugar", "salt", "oil", "milk", "bread", "butter",
                "apple", "banana", "orange", "mango", "grape", "tomato", "potato", "onion",
                "chicken", "mutton", "fish", "egg", "soap", "shampoo", "cream", "lotion",
                "phone", "mobile", "laptop", "charger", "cable", "bottle", "plate", "cup",
                "shirt", "pant", "shoe", "socks", "watch", "bag", "belt", "hat",
                "book", "pen", "pencil", "paper", "eraser", "sharpener", "scale", "compass",
                "medicine", "tablet", "syrup", "capsule", "bandage", "mask", "glove",
                "chocolate", "biscuit", "cookie", "cake", "icecream", "juice", "water"};
        for (String word : commonWords) {
            SPELLING_DICT.putIfAbsent(word, word);
        }
        SPELLING_DICT.put("moblie", "mobile");
        SPELLING_DICT.put("mobel", "mobile");
        SPELLING_DICT.put("laprop", "laptop");
        SPELLING_DICT.put("labtop", "laptop");
        SPELLING_DICT.put("shirt", "shirt");
        SPELLING_DICT.put("tomatto", "tomato");
        SPELLING_DICT.put("potatto", "potato");
        SPELLING_DICT.put("onon", "onion");
        SPELLING_DICT.put("chikin", "chicken");
        SPELLING_DICT.put("muton", "mutton");
        SPELLING_DICT.put("shampoo", "shampoo");
        SPELLING_DICT.put("butter", "butter");
        SPELLING_DICT.put("bisucit", "biscuit");
        SPELLING_DICT.put("choclates", "chocolate");
        SPELLING_DICT.put("icecream", "icecream");
        SPELLING_DICT.put("vegetabls", "vegetables");
        SPELLING_DICT.put("vegitables", "vegetables");
    }
}
