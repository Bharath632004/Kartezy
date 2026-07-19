package com.kartezy.searchservice.repository;

import com.kartezy.searchservice.document.StoreDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import java.util.List;

public interface StoreElasticsearchRepository extends ElasticsearchRepository<StoreDocument, String> {
    List<StoreDocument> findByNameContainingIgnoreCase(String name);
    List<StoreDocument> findByNameContainingIgnoreCaseAndCity(String name, String city);
}
