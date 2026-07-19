package com.kartezy.shared.ai;

import com.kartezy.shared.ai.SearchModels.*;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.util.*;

class SearchModelsTest {

    @Test
    void testSearchRequest() {
        SearchRequest request = new SearchRequest();
        request.setQuery("milk");
        request.setUserId("user1");
        request.setCategory("dairy");
        request.setMinPrice(10.0);
        request.setMaxPrice(100.0);
        request.setPage(0);
        request.setSize(20);

        assertEquals("milk", request.getQuery());
        assertEquals("user1", request.getUserId());
        assertEquals("dairy", request.getCategory());
        assertEquals(10.0, request.getMinPrice());
        assertEquals(100.0, request.getMaxPrice());
        assertTrue(request.isPersonalized());
    }

    @Test
    void testSearchResult() {
        Map<String, Object> source = new HashMap<>();
        source.put("name", "Amul Milk");
        source.put("price", 54.0);
        SearchResult result = new SearchResult("p1", "PRODUCT", 0.95, source);
        result.setHighlights(List.of("<em>Milk</em> 1L"));

        assertEquals("p1", result.getId());
        assertEquals("PRODUCT", result.getType());
        assertEquals(0.95, result.getScore());
        assertEquals("Amul Milk", result.getSource().get("name"));
        assertEquals(1, result.getHighlights().size());
    }

    @Test
    void testSpellCorrection() {
        SpellCorrection correction = new SpellCorrection("moblie", "mobile", 0.95, List.of("mobile", "mobile phone"));
        assertEquals("moblie", correction.getOriginal());
        assertEquals("mobile", correction.getCorrected());
        assertEquals(0.95, correction.getConfidence());
        assertEquals(2, correction.getAlternatives().size());
    }

    @Test
    void testAutoCompleteSuggestion() {
        AutoCompleteSuggestion suggestion = new AutoCompleteSuggestion("milk", "product", 0.9);
        suggestion.setCategory("dairy");
        assertEquals("milk", suggestion.getText());
        assertEquals("product", suggestion.getType());
        assertEquals(0.9, suggestion.getScore());
        assertEquals("dairy", suggestion.getCategory());
    }

    @Test
    void testSemanticSearchResult() {
        SemanticSearchResult result = new SemanticSearchResult("p1", "Fresh Milk 1L", 0.9, 0.8);
        assertEquals("p1", result.getId());
        assertEquals("Fresh Milk 1L", result.getText());
        assertEquals(0.9, result.getSemanticScore());
        assertEquals(0.8, result.getKeywordScore());
        assertEquals(0.85, result.getFinalScore(), 0.001);
    }
}
