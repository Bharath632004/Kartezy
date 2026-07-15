package com.kartezy.cmsservice.repository;
import com.kartezy.cmsservice.entity.CmsBanner;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CmsBannerRepository extends JpaRepository<CmsBanner, UUID> {
    List<CmsBanner> findByIsActiveTrueAndPositionOrderBySortOrderAsc(String position);
}
