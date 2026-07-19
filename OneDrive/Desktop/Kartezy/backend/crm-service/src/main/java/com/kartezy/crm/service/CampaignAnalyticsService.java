package com.kartezy.crm.service;

import com.kartezy.crm.entity.Campaign;
import com.kartezy.crm.repository.CampaignRepository;
import com.kartezy.crm.repository.CouponRepository;
import com.kartezy.crm.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CampaignAnalyticsService {

    private final CampaignRepository campaignRepository;
    private final LeadRepository leadRepository;
    private final CouponRepository couponRepository;

    @Transactional(readOnly = true)
    public Map<String, Object> getMarketingDashboard() {
        Map<String, Object> dashboard = new LinkedHashMap<>();

        // Campaign overview
        dashboard.put("totalCampaigns", campaignRepository.count());
        dashboard.put("runningCampaigns", campaignRepository.countByStatus("RUNNING"));
        dashboard.put("draftCampaigns", campaignRepository.countByStatus("DRAFT"));
        dashboard.put("scheduledCampaigns", campaignRepository.countByStatus("SCHEDULED"));
        dashboard.put("completedCampaigns", campaignRepository.countByStatus("COMPLETED"));

        // Revenue
        dashboard.put("totalConversionRevenue", campaignRepository.getTotalConversionRevenue());

        // Leads
        dashboard.put("totalLeads", leadRepository.count());
        dashboard.put("convertedLeads", leadRepository.countByStatus("CONVERTED"));

        // Campaign stats by channel
        List<Object[]> channelStats = campaignRepository.getCampaignStatsByChannel();
        Map<String, Object> channelMap = new LinkedHashMap<>();
        for (Object[] row : channelStats) {
            Map<String, Object> stats = new LinkedHashMap<>();
            stats.put("count", row[1]);
            stats.put("sent", row[2]);
            stats.put("conversions", row[3]);
            channelMap.put(((Enum<?>) row[0]).name(), stats);
        }
        dashboard.put("byChannel", channelMap);

        // Recent campaigns
        List<Campaign> recent = campaignRepository.findRecentCampaigns(
            LocalDateTime.now().minusDays(30), org.springframework.data.domain.PageRequest.of(0, 10));
        dashboard.put("recentCampaigns", recent);

        return dashboard;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getCampaignPerformance(Long campaignId) {
        Campaign campaign = campaignRepository.findById(campaignId).orElse(null);
        if (campaign == null) return Map.of();

        Map<String, Object> perf = new LinkedHashMap<>();
        perf.put("campaign", campaign);
        perf.put("sent", campaign.getSentCount());
        perf.put("delivered", campaign.getDeliveredCount());
        perf.put("opened", campaign.getOpenedCount());
        perf.put("clicked", campaign.getClickedCount());
        perf.put("conversions", campaign.getConversionCount());
        perf.put("revenue", campaign.getConversionRevenue());
        perf.put("bounces", campaign.getBounceCount());
        perf.put("unsubscribes", campaign.getUnsubscribeCount());

        // Rates
        if (campaign.getSentCount() > 0) {
            perf.put("openRate", String.format("%.1f%%", (double) campaign.getOpenedCount() / campaign.getSentCount() * 100));
            perf.put("clickRate", String.format("%.1f%%", (double) campaign.getClickedCount() / campaign.getSentCount() * 100));
            perf.put("conversionRate", String.format("%.1f%%", (double) campaign.getConversionCount() / campaign.getSentCount() * 100));
            perf.put("bounceRate", String.format("%.1f%%", (double) campaign.getBounceCount() / campaign.getSentCount() * 100));
        }

        return perf;
    }
}
