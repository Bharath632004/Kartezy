package com.kartezy.shared.ai;

import java.util.*;

public class SearchModels {

    public static class SearchRequest {
        private String query;
        private String userId;
        private String category;
        private Double minPrice;
        private Double maxPrice;
        private String storeId;
        private List<String> brands;
        private List<String> tags;
        private String sortBy;
        private String sortOrder;
        private int page = 0;
        private int size = 20;
        private Map<String, Object> filters;
        private boolean personalized = true;
        private String searchType;

        public SearchRequest() {}

        public String getQuery() { return query; }
        public void setQuery(String query) { this.query = query; }
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public Double getMinPrice() { return minPrice; }
        public void setMinPrice(Double minPrice) { this.minPrice = minPrice; }
        public Double getMaxPrice() { return maxPrice; }
        public void setMaxPrice(Double maxPrice) { this.maxPrice = maxPrice; }
        public String getStoreId() { return storeId; }
        public void setStoreId(String storeId) { this.storeId = storeId; }
        public List<String> getBrands() { return brands; }
        public void setBrands(List<String> brands) { this.brands = brands; }
        public List<String> getTags() { return tags; }
        public void setTags(List<String> tags) { this.tags = tags; }
        public String getSortBy() { return sortBy; }
        public void setSortBy(String sortBy) { this.sortBy = sortBy; }
        public String getSortOrder() { return sortOrder; }
        public void setSortOrder(String sortOrder) { this.sortOrder = sortOrder; }
        public int getPage() { return page; }
        public void setPage(int page) { this.page = page; }
        public int getSize() { return size; }
        public void setSize(int size) { this.size = size; }
        public Map<String, Object> getFilters() { return filters; }
        public void setFilters(Map<String, Object> filters) { this.filters = filters; }
        public boolean isPersonalized() { return personalized; }
        public void setPersonalized(boolean personalized) { this.personalized = personalized; }
        public String getSearchType() { return searchType; }
        public void setSearchType(String searchType) { this.searchType = searchType; }
    }

    public static class SearchResult {
        private String id;
        private String type;
        private double score;
        private Map<String, Object> source;
        private List<String> highlights;
        private Map<String, Object> metadata;

        public SearchResult() {}

        public SearchResult(String id, String type, double score, Map<String, Object> source) {
            this.id = id;
            this.type = type;
            this.score = score;
            this.source = source;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public double getScore() { return score; }
        public void setScore(double score) { this.score = score; }
        public Map<String, Object> getSource() { return source; }
        public void setSource(Map<String, Object> source) { this.source = source; }
        public List<String> getHighlights() { return highlights; }
        public void setHighlights(List<String> highlights) { this.highlights = highlights; }
        public Map<String, Object> getMetadata() { return metadata; }
        public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
    }

    public static class SpellCorrection {
        private String original;
        private String corrected;
        private double confidence;
        private List<String> alternatives;

        public SpellCorrection(String original, String corrected, double confidence, List<String> alternatives) {
            this.original = original;
            this.corrected = corrected;
            this.confidence = confidence;
            this.alternatives = alternatives;
        }

        public String getOriginal() { return original; }
        public String getCorrected() { return corrected; }
        public double getConfidence() { return confidence; }
        public List<String> getAlternatives() { return alternatives; }
    }

    public static class AutoCompleteSuggestion {
        private String text;
        private String type;
        private double score;
        private String category;
        private Map<String, Object> metadata;

        public AutoCompleteSuggestion(String text, String type, double score) {
            this.text = text;
            this.type = type;
            this.score = score;
        }

        public String getText() { return text; }
        public String getType() { return type; }
        public double getScore() { return score; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public Map<String, Object> getMetadata() { return metadata; }
        public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
    }

    public static class SemanticSearchResult {
        private String id;
        private String text;
        private double semanticScore;
        private double keywordScore;
        private double finalScore;
        private Map<String, Object> metadata;

        public SemanticSearchResult(String id, String text, double semanticScore, double keywordScore) {
            this.id = id;
            this.text = text;
            this.semanticScore = semanticScore;
            this.keywordScore = keywordScore;
            this.finalScore = (semanticScore + keywordScore) / 2.0;
        }

        public String getId() { return id; }
        public String getText() { return text; }
        public double getSemanticScore() { return semanticScore; }
        public double getKeywordScore() { return keywordScore; }
        public double getFinalScore() { return finalScore; }
        public Map<String, Object> getMetadata() { return metadata; }
        public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
    }
}
