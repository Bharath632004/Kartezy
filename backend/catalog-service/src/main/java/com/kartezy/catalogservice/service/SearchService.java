package com.kartezy.catalogservice.service;

import com.kartezy.catalogservice.entity.Product;
import com.kartezy.catalogservice.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

/**
 * Service for searching products using database and Elasticsearch.
 */
@Service
public class SearchService {

    private final ProductRepository productRepository;

    public SearchService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Search products by name or description using database LIKE query.
     */
    public List<Product> searchProducts(String query, int page, int size) {
        if (query == null || query.isBlank()) {
            return Collections.emptyList();
        }
        // Database-backed search with pagination
        return productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                query.trim(), query.trim(),
                org.springframework.data.domain.PageRequest.of(page, size)
        ).getContent();
    }

    /**
     * Search products by category.
     */
    public List<Product> searchByCategory(Long categoryId, int page, int size) {
        return productRepository.findByCategoryId(
                categoryId,
                org.springframework.data.domain.PageRequest.of(page, size)
        ).getContent();
    }

    /**
     * Search products by merchant.
     */
    public List<Product> searchByMerchant(Long merchantId, int page, int size) {
        return productRepository.findByMerchantId(
                merchantId,
                org.springframework.data.domain.PageRequest.of(page, size)
        ).getContent();
    }
}
