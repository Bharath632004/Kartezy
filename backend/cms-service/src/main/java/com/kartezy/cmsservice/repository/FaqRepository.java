package com.kartezy.cmsservice.repository;

import com.kartezy.cmsservice.entity.Faq;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface FaqRepository extends JpaRepository<Faq, UUID> {
    List<Faq> findByActiveTrueOrderBySortOrderAsc();
    List<Faq> findByCategoryAndActiveTrueOrderBySortOrderAsc(String category);
    List<String> findDistinctCategoryBy();
}
