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

@Slf4j @Service @RequiredArgsConstructor
public class SearchService {
    private final ElasticsearchClient esClient;
    private final ProductElasticsearchRepository productRepository;
    private final StoreElasticsearchRepository storeRepository;
    private final CategoryElasticsearchRepository categoryRepository;
    private final BrandElasticsearchRepository brandRepository;

    public List<ProductDocument> searchProducts(String query, int page, int size, String category,
                                                 Double minPrice, Double maxPrice, String sort) {
        try {
            var boolQuery = new ArrayList<String>();
            boolQuery.add("{\"multi_match\": {\"query\": \"" + query + "\", \"fields\": [\"name^3\", \"description\", \"sku\", \"brandName\", \"categoryName\"]}}");
            if (category != null) boolQuery.add("{\"term\": {\"categoryId\": \"" + category + "\"}}");
            if (minPrice != null) boolQuery.add("{\"range\": {\"price\": {\"gte\": " + minPrice + "}}}");
            if (maxPrice != null) boolQuery.add("{\"range\": {\"price\": {\"lte\": " + maxPrice + "}}}");

            String mustClauses = String.join(",", boolQuery);
            String sortClause = sort != null ? "\"sort\": [{\"" + sort + "\": {\"order\": \"desc\"}}]," : "";

            String searchQuery = "{\"from\": " + (page * size) + ", \"size\": " + size + ", " + sortClause +
                "\"query\": {\"bool\": {\"must\": [" + mustClauses + "]}}}";

            SearchResponse<ProductDocument> response = esClient.search(
                s -> s.index("products").withJson(new StringReader(searchQuery)), ProductDocument.class);
            return response.hits().hits().stream().map(h -> h.source()).filter(Objects::nonNull).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Elasticsearch search failed: {}", e.getMessage());
            return productRepository.findByNameContainingIgnoreCase(query);
        }
    }

    public List<StoreDocument> searchStores(String query, String city) {
        if (city != null && !city.isEmpty()) {
            return storeRepository.findByNameContainingIgnoreCaseAndCity(query, city);
        }
        return storeRepository.findByNameContainingIgnoreCase(query);
    }

    public List<String> autocomplete(String prefix) {
        return productRepository.findByNameStartingWith(prefix).stream()
            .map(ProductDocument::getName).distinct().limit(10).collect(Collectors.toList());
    }

    public List<CategoryDocument> getCategories(String parentId) {
        if (parentId != null) return categoryRepository.findByParentId(parentId);
        return categoryRepository.findByIsActiveTrue();
    }

    public List<BrandDocument> searchBrands(String query) {
        return brandRepository.findByNameContainingIgnoreCase(query);
    }
}
