package com.kartezy.aiservice.service;

import com.kartezy.aiservice.client.SearchServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class SearchService {

    @Autowired
    private SearchServiceClient searchServiceClient;

    @Autowired
    private AIServiceFacade aiServiceFacade;

    public Map<String, Object> getSuggestions(String query, int limit) {
        try {
            // Enhance suggestions using NLP query understanding
            Map<String, Object> nlpResult = aiServiceFacade.analyzeSentiment(query);
            Map<String, Object> suggestions = searchServiceClient.getSuggestions(query, limit);
            suggestions.put("nlpEnriched", true);
            suggestions.put("queryIntent", nlpResult.getOrDefault("sentiment", "neutral"));
            return suggestions;
        } catch (Exception e) {
            return Map.of("suggestions", List.of(), "query", query, "nlpEnriched", false);
        }
    }

    public Map<String, Object> search(String query, String category, Double minPrice, Double maxPrice, int page, int size) {
        try {
            Map<String, Object> results = searchServiceClient.search(query, category, minPrice, maxPrice, page, size);
            // Enrich results with NLP-based query expansion
            Map<String, Object> intentResult = aiServiceFacade.recognizeIntent(query);
            results.put("nlpEnriched", true);
            results.put("detectedIntent", intentResult.getOrDefault("intent", "unknown"));
            return results;
        } catch (Exception e) {
            return Map.of("results", List.of(), "total", 0, "page", page, "size", size, "query", query, "nlpEnriched", false);
        }
    }

    public List<String> autocomplete(String prefix, int limit) {
        try {
            return searchServiceClient.autocomplete(prefix, limit);
        } catch (Exception e) {
            return List.of();
        }
    }

    public Map<String, Object> recordSearchFeedback(Map<String, Object> feedback) {
        try {
            return searchServiceClient.recordSearchFeedback(feedback);
        } catch (Exception e) {
            return Map.of("status", "failed", "feedbackId", java.util.UUID.randomUUID().toString());
        }
    }
}
