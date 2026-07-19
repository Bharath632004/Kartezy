package com.kartezy.crm.repository;

import com.kartezy.crm.constants.CampaignChannel;
import com.kartezy.crm.entity.Campaign;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Long> {

    Page<Campaign> findByStatus(String status, Pageable pageable);

    Page<Campaign> findByChannel(CampaignChannel channel, Pageable pageable);

    List<Campaign> findByStatusAndScheduledAtBefore(String status, LocalDateTime dateTime);

    @Query("SELECT c FROM Campaign c WHERE c.status = 'RUNNING' AND c.isAbTest = true")
    List<Campaign> findActiveAbTests();

    @Query("SELECT COALESCE(SUM(c.conversionRevenue), 0) FROM Campaign c WHERE c.status = 'COMPLETED'")
    BigDecimal getTotalConversionRevenue();

    @Query("SELECT c.channel, COUNT(c), COALESCE(SUM(c.sentCount), 0), COALESCE(SUM(c.conversionCount), 0) FROM Campaign c GROUP BY c.channel")
    List<Object[]> getCampaignStatsByChannel();

    @Query("SELECT c FROM Campaign c WHERE c.createdAt >= :since ORDER BY c.createdAt DESC")
    List<Campaign> findRecentCampaigns(@Param("since") LocalDateTime since, Pageable pageable);

    long countByStatus(String status);
}
