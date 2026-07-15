package com.kartezy.searchservice.repository;

import com.kartezy.searchservice.document.BrandDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import java.util.List;

public interface BrandElasticsearchRepository extends ElasticsearchRepository<BrandDocument, String> {
    List<BrandDocument> findByNameContainingIgnoreCase(String name);
}
