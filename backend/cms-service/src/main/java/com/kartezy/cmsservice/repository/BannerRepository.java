package com.kartezy.cmsservice.repository;

import com.kartezy.cmsservice.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface BannerRepository extends JpaRepository<Banner, UUID> {
    List<Banner> findByActiveTrueAndPositionOrderBySortOrderAsc(String position);
    List<Banner> findByActiveTrueOrderBySortOrderAsc();
}
