package com.kartezy.searchservice.repository;

import com.kartezy.searchservice.document.CategoryDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import java.util.List;

public interface CategoryElasticsearchRepository extends ElasticsearchRepository<CategoryDocument, String> {
    List<CategoryDocument> findByIsActiveTrue();
    List<CategoryDocument> findByParentId(String parentId);
}
