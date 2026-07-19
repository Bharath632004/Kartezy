package com.kartezy.crm.controller;

import com.kartezy.crm.entity.Referral;
import com.kartezy.crm.service.ReferralEngineService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/crm/referrals")
@RequiredArgsConstructor
@Tag(name = "Referral Engine", description = "Referral program management and tracking")
public class ReferralController {

    private final ReferralEngineService referralService;

    @PostMapping
    @Operation(summary = "Create a referral")
    public ResponseEntity<Map<String, Object>> createReferral(
        @RequestParam Long referrerId,
        @RequestParam String refereeEmail,
        @RequestParam(required = false) String refereePhone) {
        Referral referral = referralService.createReferral(referrerId, refereeEmail, refereePhone);
        return ResponseEntity.ok(wrapResponse(referral, "Referral created"));
    }

    @PostMapping("/convert")
    @Operation(summary = "Convert a referral")
    public ResponseEntity<Map<String, Object>> convertReferral(
        @RequestParam String code, @RequestParam Long newUserId) {
        Referral referral = referralService.convertReferral(code, newUserId);
        return ResponseEntity.ok(wrapResponse(referral, "Referral converted"));
    }

    @GetMapping("/referrer/{referrerId}")
    @Operation(summary = "Get referrals by referrer")
    public ResponseEntity<Map<String, Object>> getReferrerReferrals(
        @PathVariable Long referrerId, Pageable pageable) {
        Page<Referral> referrals = referralService.getReferrerReferrals(referrerId, pageable);
        return ResponseEntity.ok(wrapResponse(referrals, "Referrals retrieved"));
    }

    @GetMapping("/count/{referrerId}")
    @Operation(summary = "Get referral count for referrer")
    public ResponseEntity<Map<String, Object>> getReferralCount(@PathVariable Long referrerId) {
        long count = referralService.getReferralCount(referrerId);
        return ResponseEntity.ok(wrapResponse(Map.of("count", count), "Referral count retrieved"));
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
