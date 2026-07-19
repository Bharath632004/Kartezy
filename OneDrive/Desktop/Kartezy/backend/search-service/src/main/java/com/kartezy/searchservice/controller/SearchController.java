package com.kartezy.searchservice.controller;

import com.kartezy.searchservice.document.*;
import com.kartezy.searchservice.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/search") @RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class SearchController {
    private final SearchService searchService;

    @GetMapping("/products")
    @Cacheable(value = "search", key = "#query+':'+#page+':'+#size")
    public ResponseEntity<List<ProductDocument>> searchProducts(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String sort) {
        return ResponseEntity.ok(searchService.searchProducts(query, page, size, category, minPrice, maxPrice, sort));
    }

    @GetMapping("/stores")
    @Cacheable(value = "search", key = "'stores:'+#query+':'+#city")
    public ResponseEntity<List<StoreDocument>> searchStores(
            @RequestParam String query,
            @RequestParam(defaultValue = "") String city) {
        return ResponseEntity.ok(searchService.searchStores(query, city));
    }

    @GetMapping("/autocomplete")
    @Cacheable(value = "search", key = "'ac:'+#prefix")
    public ResponseEntity<List<String>> autocomplete(@RequestParam String prefix) {
        return ResponseEntity.ok(searchService.autocomplete(prefix));
    }

    @GetMapping("/categories")
    @Cacheable(value = "categories")
    public ResponseEntity<List<CategoryDocument>> getCategories(@RequestParam(required = false) String parentId) {
        return ResponseEntity.ok(searchService.getCategories(parentId));
    }

    @GetMapping("/brands")
    @Cacheable(value = "brands")
    public ResponseEntity<List<BrandDocument>> searchBrands(@RequestParam String query) {
        return ResponseEntity.ok(searchService.searchBrands(query));
    }
}
