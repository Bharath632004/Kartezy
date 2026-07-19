package com.kartezy.crm.repository;

import com.kartezy.crm.entity.CampaignVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampaignVariantRepository extends JpaRepository<CampaignVariant, Long> {
    List<CampaignVariant> findByCampaignId(Long campaignId);
}
