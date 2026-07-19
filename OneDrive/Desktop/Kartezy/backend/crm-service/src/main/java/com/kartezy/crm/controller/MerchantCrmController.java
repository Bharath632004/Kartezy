package com.kartezy.crm.controller;

import com.kartezy.crm.entity.MerchantProfile;
import com.kartezy.crm.service.MerchantCrmService;
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
@RequestMapping("/api/crm/merchants")
@RequiredArgsConstructor
@Tag(name = "Merchant CRM", description = "Merchant profile management and CRM")
public class MerchantCrmController {

    private final MerchantCrmService merchantService;

    @PostMapping
    @Operation(summary = "Create merchant CRM profile")
    public ResponseEntity<Map<String, Object>> createProfile(@RequestBody MerchantProfile profile) {
        MerchantProfile created = merchantService.createProfile(profile);
        return ResponseEntity.ok(wrapResponse(created, "Merchant profile created"));
    }

    @GetMapping("/{merchantId}")
    @Operation(summary = "Get merchant profile")
    public ResponseEntity<Map<String, Object>> getProfile(@PathVariable Long merchantId) {
        MerchantProfile profile = merchantService.getByMerchantId(merchantId);
        return ResponseEntity.ok(wrapResponse(profile, "Merchant profile retrieved"));
    }

    @GetMapping
    @Operation(summary = "Get merchant profiles with filters")
    public ResponseEntity<Map<String, Object>> getAllProfiles(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String tier,
        Pageable pageable) {
        Page<MerchantProfile> profiles = merchantService.getAll(status, tier, pageable);
        return ResponseEntity.ok(wrapResponse(profiles, "Merchant profiles retrieved"));
    }

    @PutMapping("/{merchantId}")
    @Operation(summary = "Update merchant profile")
    public ResponseEntity<Map<String, Object>> updateProfile(@PathVariable Long merchantId, @RequestBody MerchantProfile updates) {
        MerchantProfile updated = merchantService.updateProfile(merchantId, updates);
        return ResponseEntity.ok(wrapResponse(updated, "Merchant profile updated"));
    }

    @GetMapping("/top-revenue")
    @Operation(summary = "Get top revenue merchants")
    public ResponseEntity<Map<String, Object>> getTopRevenueMerchants() {
        List<MerchantProfile> merchants = merchantService.getTopRevenueMerchants(10);
        return ResponseEntity.ok(wrapResponse(merchants, "Top revenue merchants retrieved"));
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
