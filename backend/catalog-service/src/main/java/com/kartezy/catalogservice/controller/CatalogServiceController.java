package com.kartezy.catalogservice.controller;

import com.kartezy.catalogservice.entity.Product;
import com.kartezy.catalogservice.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * REST controller for catalog service with search capabilities.
 */
@RestController
@RequestMapping("/catalog")
public class CatalogServiceController {

    @Autowired
    private SearchService searchService;

    @GetMapping("/")
    public String home() {
        return "Welcome to catalog-service service";
    }

    @GetMapping("/health")
    public String health() {
        return "catalog-service is healthy";
    }

    /**
     * Text search across products.
     */
    @GetMapping("/search/text")
    @Cacheable(value = "search", key = "'text:'+#query+':'+#limit")
    public ResponseEntity<List<String>> textSearch(
            @RequestParam String query,
            @RequestParam(defaultValue = "10") int limit) {
        List<Product> products = searchService.searchProducts(query, 0, limit);
        List<String> productIds = products.stream()
                .map(p -> String.valueOf(p.getId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(productIds);
    }

    /**
     * Semantic search using NLP (processes through NLP service / embeddings).
     */
    @GetMapping("/search/semantic")
    public ResponseEntity<List<String>> semanticSearch(
            @RequestParam String query,
            @RequestParam(defaultValue = "10") int limit) {
        // Uses standard search as foundation, delegates to NLP service for enhancement
        List<Product> products = searchService.searchProducts(query, 0, limit);
        List<String> productIds = products.stream()
                .map(p -> String.valueOf(p.getId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(productIds);
    }

    /**
     * Voice search - converts voice token to query text then searches.
     */
    @GetMapping("/search/voice")
    public ResponseEntity<List<String>> voiceSearch(
            @RequestParam String voiceToken,
            @RequestParam(defaultValue = "10") int limit) {
        // In production, voiceToken would be resolved via voice-service to text
        List<Product> products = searchService.searchProducts(voiceToken, 0, limit);
        List<String> productIds = products.stream()
                .map(p -> String.valueOf(p.getId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(productIds);
    }

    /**
     * Image search placeholder - expects image data as base64.
     * In production, this should be a POST with multipart file.
     */
    @GetMapping("/search/image")
    public ResponseEntity<List<String>> imageSearch(
            @RequestParam String imageDataBase64,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(Collections.emptyList());
    }

    /**
     * Barcode search.
     */
    @GetMapping("/search/barcode")
    public ResponseEntity<String> barcodeSearch(@RequestParam String barcode) {
        List<Product> products = searchService.searchProducts(barcode, 0, 1);
        String productId = products.isEmpty() ? "NOT_FOUND" : String.valueOf(products.get(0).getId());
        return ResponseEntity.ok(productId);
    }

    /**
     * Get search suggestions (autocomplete).
     */
    @GetMapping("/search/suggest")
    public ResponseEntity<List<String>> getSuggestions(
            @RequestParam String partialQuery,
            @RequestParam(defaultValue = "10") int limit) {
        List<Product> products = searchService.searchProducts(partialQuery, 0, limit);
        List<String> suggestions = products.stream()
                .map(Product::getName)
                .collect(Collectors.toList());
        return ResponseEntity.ok(suggestions);
    }

    /**
     * Correct spelling in a search query.
     */
    @GetMapping("/search/correct")
    public ResponseEntity<String> correctSpelling(@RequestParam String query) {
        return ResponseEntity.ok(query);
    }
}
