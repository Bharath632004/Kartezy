package com.kartezy.crm.repository;

import com.kartezy.crm.entity.CampaignInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CampaignInteractionRepository extends JpaRepository<CampaignInteraction, Long> {

    List<CampaignInteraction> findByCampaignId(Long campaignId);

    List<CampaignInteraction> findByCustomerIdAndCampaignId(Long customerId, Long campaignId);

    long countByCampaignIdAndInteractionType(Long campaignId, String interactionType);

    @Query("SELECT c.interactionType, COUNT(c) FROM CampaignInteraction c WHERE c.campaignId = :campaignId GROUP BY c.interactionType")
    List<Object[]> getInteractionCountsByType(@Param("campaignId") Long campaignId);

    @Query("SELECT c FROM CampaignInteraction c WHERE c.campaignId = :campaignId AND c.interactionTime >= :since ORDER BY c.interactionTime DESC")
    List<CampaignInteraction> findByCampaignSince(@Param("campaignId") Long campaignId, @Param("since") LocalDateTime since);
}
