package com.kartezy.crm.repository;

import com.kartezy.crm.entity.MerchantProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MerchantProfileRepository extends JpaRepository<MerchantProfile, Long> {

    Optional<MerchantProfile> findByMerchantId(Long merchantId);

    Page<MerchantProfile> findByStatus(String status, Pageable pageable);

    Page<MerchantProfile> findByTier(String tier, Pageable pageable);

    List<MerchantProfile> findByAccountManager(String accountManager);

    @Query("SELECT m FROM MerchantProfile m WHERE m.avgRating >= :minRating ORDER BY m.avgRating DESC")
    List<MerchantProfile> findTopRatedMerchants(@Param("minRating") Double minRating);

    @Query("SELECT m FROM MerchantProfile m ORDER BY m.totalRevenue DESC")
    List<MerchantProfile> findTopRevenueMerchants(Pageable pageable);

    long countByStatus(String status);

    long countByTier(String tier);
}
