package com.kartezy.crm.scheduler;

import com.kartezy.crm.constants.CrmConstants;
import com.kartezy.crm.repository.CampaignRepository;
import com.kartezy.crm.service.LoyaltyEngineService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class CrmScheduler {

    private final LoyaltyEngineService loyaltyEngineService;
    private final CampaignRepository campaignRepository;

    /**
     * Daily at 2 AM - Expire loyalty points
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void expireLoyaltyPoints() {
        log.info("Starting loyalty points expiry check...");
        loyaltyEngineService.checkAndExpirePoints();
        log.info("Loyalty points expiry check completed");
    }

    /**
     * Every 15 minutes - Launch scheduled campaigns
     */
    @Scheduled(cron = "0 */15 * * * ?")
    public void launchScheduledCampaigns() {
        log.info("Checking for scheduled campaigns to launch...");
        var campaigns = campaignRepository.findByStatusAndScheduledAtBefore(
            CrmConstants.CAMPAIGN_SCHEDULED, LocalDateTime.now());
        for (var campaign : campaigns) {
            try {
                campaign.setStatus(CrmConstants.CAMPAIGN_RUNNING);
                campaign.setSentAt(LocalDateTime.now());
                campaignRepository.save(campaign);
                log.info("Auto-launched campaign: {}", campaign.getCampaignName());
            } catch (Exception e) {
                log.error("Failed to launch campaign {}: {}", campaign.getId(), e.getMessage());
            }
        }
        log.info("Scheduled campaign check completed. Launched: {}", campaigns.size());
    }
}
