package com.kartezy.searchservice.repository;

import com.kartezy.searchservice.document.ProductDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import java.util.List;

public interface ProductElasticsearchRepository extends ElasticsearchRepository<ProductDocument, String> {
    List<ProductDocument> findByNameContainingIgnoreCase(String name);
    List<ProductDocument> findByNameStartingWith(String prefix);
}
