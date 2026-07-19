package com.kartezy.crm.service;

import com.kartezy.crm.constants.CampaignChannel;
import com.kartezy.crm.constants.CrmConstants;
import com.kartezy.crm.entity.*;
import com.kartezy.crm.exception.CrmException;
import com.kartezy.crm.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final CampaignInteractionRepository interactionRepository;
    private final com.kartezy.crm.repository.CampaignVariantRepository variantRepository;
    private final CustomerProfileRepository customerRepository;

    @Transactional
    public Campaign createCampaign(Campaign campaign) {
        campaign.setStatus(CrmConstants.CAMPAIGN_DRAFT);
        campaign.setSentCount(0);
        campaign.setDeliveredCount(0);
        campaign.setOpenedCount(0);
        campaign.setClickedCount(0);
        campaign.setConversionCount(0);
        campaign.setConversionRevenue(java.math.BigDecimal.ZERO);
        campaign.setBounceCount(0);
        campaign.setUnsubscribeCount(0);
        campaign.setComplaintCount(0);
        campaign.setActualCost(java.math.BigDecimal.ZERO);

        return campaignRepository.save(campaign);
    }

    @Transactional
    public Campaign launchCampaign(Long campaignId) {
        Campaign campaign = campaignRepository.findById(campaignId)
            .orElseThrow(() -> new CrmException("Campaign not found: " + campaignId));

        if (campaign.getScheduledAt() != null && campaign.getScheduledAt().isAfter(LocalDateTime.now())) {
            campaign.setStatus(CrmConstants.CAMPAIGN_SCHEDULED);
        } else {
            campaign.setStatus(CrmConstants.CAMPAIGN_RUNNING);
            campaign.setSentAt(LocalDateTime.now());
        }

        return campaignRepository.save(campaign);
    }

    @Transactional
    public Campaign completeCampaign(Long campaignId) {
        Campaign campaign = campaignRepository.findById(campaignId)
            .orElseThrow(() -> new CrmException("Campaign not found: " + campaignId));
        campaign.setStatus(CrmConstants.CAMPAIGN_COMPLETED);
        campaign.setCompletedAt(LocalDateTime.now());
        return campaignRepository.save(campaign);
    }

    @Transactional
    public CampaignInteraction trackInteraction(Long campaignId, Long customerId, String interactionType) {
        CampaignInteraction interaction = CampaignInteraction.builder()
            .campaignId(campaignId)
            .customerId(customerId)
            .interactionType(interactionType)
            .interactionTime(LocalDateTime.now())
            .build();

        CampaignInteraction saved = interactionRepository.save(interaction);

        // Update campaign counters
        Campaign campaign = campaignRepository.findById(campaignId).orElse(null);
        if (campaign != null) {
            switch (interactionType) {
                case "SENT" -> { campaign.setSentCount(campaign.getSentCount() + 1); campaign.setDeliveredCount(campaign.getDeliveredCount() + 1); }
                case "OPENED" -> campaign.setOpenedCount(campaign.getOpenedCount() + 1);
                case "CLICKED" -> campaign.setClickedCount(campaign.getClickedCount() + 1);
                case "BOUNCE" -> campaign.setBounceCount(campaign.getBounceCount() + 1);
                case "UNSUBSCRIBE" -> campaign.setUnsubscribeCount(campaign.getUnsubscribeCount() + 1);
                case "CONVERSION" -> campaign.setConversionCount(campaign.getConversionCount() + 1);
            }
            campaignRepository.save(campaign);
        }

        return saved;
    }

    @Transactional
    public CampaignVariant createVariant(CampaignVariant variant) {
        Campaign campaign = campaignRepository.findById(variant.getCampaignId())
            .orElseThrow(() -> new CrmException("Campaign not found: " + variant.getCampaignId()));
        campaign.setAbTest(true);
        campaignRepository.save(campaign);

        return variantRepository.save(variant);
    }

    @Transactional(readOnly = true)
    public Page<Campaign> getCampaigns(String status, CampaignChannel channel, Pageable pageable) {
        if (status != null) return campaignRepository.findByStatus(status, pageable);
        if (channel != null) return campaignRepository.findByChannel(channel, pageable);
        return campaignRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Campaign getCampaign(Long id) {
        return campaignRepository.findById(id)
            .orElseThrow(() -> new CrmException("Campaign not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<CustomerProfile> getCampaignTargetAudience(Long campaignId) {
        Campaign campaign = getCampaign(campaignId);
        if (campaign.getSegmentId() != null) {
            // Would filter by segment
        }
        return switch (campaign.getChannel()) {
            case EMAIL -> customerRepository.findEmailOptedIn();
            case SMS -> customerRepository.findSmsOptedIn();
            case WHATSAPP -> customerRepository.findWhatsappOptedIn();
            case PUSH_NOTIFICATION -> customerRepository.findPushOptedIn();
            default -> customerRepository.findAll();
        };
    }

    // CampaignVariantRepository moved to com.kartezy.crm.repository.CampaignVariantRepository
}
