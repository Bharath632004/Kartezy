package com.kartezy.crm.controller;

import com.kartezy.crm.constants.CampaignChannel;
import com.kartezy.crm.entity.Campaign;
import com.kartezy.crm.entity.CampaignVariant;
import com.kartezy.crm.entity.CustomerProfile;
import com.kartezy.crm.service.CampaignService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/crm/campaigns")
@RequiredArgsConstructor
@Tag(name = "Campaigns", description = "Email, SMS, WhatsApp, and Push notification campaigns")
public class CampaignController {

    private final CampaignService campaignService;

    @PostMapping
    @Operation(summary = "Create a marketing campaign")
    public ResponseEntity<Map<String, Object>> createCampaign(@RequestBody Campaign campaign) {
        Campaign created = campaignService.createCampaign(campaign);
        return ResponseEntity.ok(wrapResponse(created, "Campaign created"));
    }

    @GetMapping
    @Operation(summary = "Get campaigns with filters")
    public ResponseEntity<Map<String, Object>> getCampaigns(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) CampaignChannel channel,
        Pageable pageable) {
        Page<Campaign> campaigns = campaignService.getCampaigns(status, channel, pageable);
        return ResponseEntity.ok(wrapResponse(campaigns, "Campaigns retrieved"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get campaign details")
    public ResponseEntity<Map<String, Object>> getCampaign(@PathVariable Long id) {
        Campaign campaign = campaignService.getCampaign(id);
        return ResponseEntity.ok(wrapResponse(campaign, "Campaign retrieved"));
    }

    @PostMapping("/{id}/launch")
    @Operation(summary = "Launch a campaign")
    public ResponseEntity<Map<String, Object>> launchCampaign(@PathVariable Long id) {
        Campaign campaign = campaignService.launchCampaign(id);
        return ResponseEntity.ok(wrapResponse(campaign, "Campaign launched"));
    }

    @PostMapping("/{id}/complete")
    @Operation(summary = "Complete a campaign")
    public ResponseEntity<Map<String, Object>> completeCampaign(@PathVariable Long id) {
        Campaign campaign = campaignService.completeCampaign(id);
        return ResponseEntity.ok(wrapResponse(campaign, "Campaign completed"));
    }

    @PostMapping("/{id}/track/{customerId}/{type}")
    @Operation(summary = "Track campaign interaction")
    public ResponseEntity<Map<String, Object>> trackInteraction(
        @PathVariable Long id, @PathVariable Long customerId, @PathVariable String type) {
        var interaction = campaignService.trackInteraction(id, customerId, type);
        return ResponseEntity.ok(wrapResponse(interaction, "Interaction tracked"));
    }

    @PostMapping("/variants")
    @Operation(summary = "Create A/B test variant")
    public ResponseEntity<Map<String, Object>> createVariant(@RequestBody CampaignVariant variant) {
        CampaignVariant created = campaignService.createVariant(variant);
        return ResponseEntity.ok(wrapResponse(created, "Variant created"));
    }

    @GetMapping("/{id}/audience")
    @Operation(summary = "Get target audience for campaign")
    public ResponseEntity<Map<String, Object>> getTargetAudience(@PathVariable Long id) {
        List<CustomerProfile> audience = campaignService.getCampaignTargetAudience(id);
        return ResponseEntity.ok(wrapResponse(audience, "Target audience retrieved"));
    }

    private Map<String, Object> wrapResponse(Object data, String message) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("data", data);
        response.put("message", message);
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return response;
    }
}
