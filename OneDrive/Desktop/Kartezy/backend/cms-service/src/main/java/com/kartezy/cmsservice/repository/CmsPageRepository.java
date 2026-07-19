package com.kartezy.cmsservice.repository;
import com.kartezy.cmsservice.entity.CmsPage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CmsPageRepository extends JpaRepository<CmsPage, UUID> {
    List<CmsPage> findByStatusOrderBySortOrderAsc(String status);
    List<CmsPage> findByIsPublishedTrueOrderBySortOrderAsc();
}
