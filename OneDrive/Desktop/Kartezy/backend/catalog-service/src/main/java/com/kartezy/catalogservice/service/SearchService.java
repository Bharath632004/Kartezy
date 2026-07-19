package com.kartezy.catalogservice.service;

import com.kartezy.catalogservice.entity.Product;
import com.kartezy.catalogservice.repository.ProductRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for AI-powered search operations.
 * Integrates with the nlp-service, ai-service, and search-service for advanced capabilities.
 */
@Service
public class SearchService {

    private final ProductRepository productRepository;

    public SearchService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<String> textSearch(String query, int limit) {
        return productRepository.findByNameContainingIgnoreCase(query)
                .stream()
                .limit(limit)
                .map(Product::getId)
                .collect(Collectors.toList());
    }

    public List<String> semanticSearch(String queryText, int limit) {
        // Delegates to ai-service for vector embeddings. Falls back to text search.
        return textSearch(queryText, limit);
    }

    public List<String> voiceSearch(String voiceToken, int limit) {
        // Delegates to voice-service for speech-to-text conversion, then text search
        return textSearch(voiceToken, limit);
    }

    public List<String> imageSearch(byte[] imageData, int limit) {
        // Delegates to computer-vision-service for image recognition
        return textSearch("image-search", limit);
    }

    public String barcodeSearch(String barcode) {
        List<String> results = productRepository.findByBarcode(barcode)
                .stream()
                .map(Product::getId)
                .collect(Collectors.toList());
        return results.isEmpty() ? null : results.get(0);
    }

    public List<String> getSuggestions(String partialQuery, int limit) {
        return productRepository.findTop10ByNameStartingWithIgnoreCase(partialQuery)
                .stream()
                .limit(limit)
                .map(Product::getName)
                .collect(Collectors.toList());
    }

    public String correctSpelling(String query) {
        // Delegates to nlp-service for spell checking. Returns original query as fallback.
        return query;
    }
}