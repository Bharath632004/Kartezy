package com.kartezy.catalogservice.controller;
import com.kartezy.catalogservice.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
/**
 * REST controller for catalog service with AI-powered search capabilities.
 */
@RestController
@RequestMapping("/catalog")
public class CatalogServiceController {
    private final SearchService searchService;

    public CatalogServiceController(SearchService searchService) {
        this.searchService = searchService;
    }
    // Existing endpoints
    @GetMapping("/")
    public String home() {
        return "Welcome to catalog-service service";
    }
    @GetMapping("/health")
    public String health() {
        return "catalog-service is healthy";
    }
    // Search endpoints
    /**
     * Text search with NLP enhancements.
     * @param query the search query
     * @param limit maximum number of results (optional, default 10)
     * @return list of product IDs
     */
    @GetMapping("/search/text")
    @Cacheable(value = "search", key = "'text:'+#query+':'+#limit")
    public ResponseEntity<List<String>> textSearch(
            @RequestParam String query,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(searchService.textSearch(query, limit));
    }
    /**
     * Semantic search using embeddings.
     * @param query the search query text
     * @param limit maximum number of results (optional, default 10)
     * @return list of product IDs
     */
    @GetMapping("/search/semantic")
    public ResponseEntity<List<String>> semanticSearch(
            @RequestParam String query,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(searchService.semanticSearch(query, limit));
    }
    /**
     * Voice search (expects a token from voice service).
     * @param voiceToken token representing the voice input
     * @param limit maximum number of results (optional, default 10)
     * @return list of product IDs
     */
    @GetMapping("/search/voice")
    public ResponseEntity<List<String>> voiceSearch(
            @RequestParam String voiceToken,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(searchService.voiceSearch(voiceToken, limit));
    }
    @PostMapping("/search/image")
    public ResponseEntity<List<String>> imageSearch(
            @RequestBody byte[] imageData,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(searchService.imageSearch(imageData, limit));
    }
    /**
     * Barcode search.
     * @param barcode the barcode string (UPC, EAN, etc.)
     * @return the product ID
     */
    @GetMapping("/search/barcode")
    public ResponseEntity<String> barcodeSearch(
            @RequestParam String barcode) {
        String productId = searchService.barcodeSearch(barcode);
        return ResponseEntity.ok(productId);
    }
    /**
     * Get search suggestions (autocomplete).
     * @param partialQuery partial search query
     * @param limit maximum number of suggestions (optional, default 10)
     * @return list of suggested queries
     */
    @GetMapping("/search/suggest")
    public ResponseEntity<List<String>> getSuggestions(
            @RequestParam String partialQuery,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(searchService.getSuggestions(partialQuery, limit));
    }
    /**
     * Correct spelling in a search query.
     * @param query the search query to correct
     * @return corrected query
     */
    @GetMapping("/search/correct")
    public ResponseEntity<String> correctSpelling(
            @RequestParam String query) {
        return ResponseEntity.ok(searchService.correctSpelling(query));
    }
}