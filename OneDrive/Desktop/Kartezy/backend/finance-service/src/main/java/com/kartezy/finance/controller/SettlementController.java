package com.kartezy.finance.controller;

import com.kartezy.finance.constants.SettlementStatus;
import com.kartezy.finance.entity.MerchantSettlement;
import com.kartezy.finance.entity.SettlementTransaction;
import com.kartezy.finance.service.MerchantSettlementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/finance/settlements")
@RequiredArgsConstructor
@Tag(name = "Merchant Settlements", description = "Merchant settlement processing and management")
public class SettlementController {

    private final MerchantSettlementService settlementService;

    @PostMapping
    @Operation(summary = "Create a merchant settlement")
    public ResponseEntity<Map<String, Object>> createSettlement(
        @RequestParam Long merchantId,
        @RequestParam String merchantName,
        @RequestParam LocalDate cycleStart,
        @RequestParam LocalDate cycleEnd,
        @RequestBody List<SettlementTransaction> transactions) {

        MerchantSettlement settlement = settlementService.createSettlement(
            merchantId, merchantName, cycleStart, cycleEnd, transactions);
        return ResponseEntity.ok(wrapResponse(settlement, "Settlement created"));
    }

    @GetMapping("/merchant/{merchantId}")
    @Operation(summary = "Get settlements for a merchant")
    public ResponseEntity<Map<String, Object>> getMerchantSettlements(
        @PathVariable Long merchantId, Pageable pageable) {
        Page<MerchantSettlement> settlements = settlementService.getMerchantSettlements(merchantId, pageable);
        return ResponseEntity.ok(wrapResponse(settlements, "Settlements retrieved"));
    }

    @GetMapping("/pending")
    @Operation(summary = "Get all pending settlements")
    public ResponseEntity<Map<String, Object>> getPendingSettlements() {
        List<MerchantSettlement> settlements = settlementService.getPendingSettlements();
        return ResponseEntity.ok(wrapResponse(settlements, "Pending settlements retrieved"));
    }

    @PostMapping("/{settlementId}/process")
    @Operation(summary = "Process a settlement (mark as processing)")
    public ResponseEntity<Map<String, Object>> processSettlement(
        @PathVariable Long settlementId,
        @RequestParam(required = false) Long bankAccountId) {
        MerchantSettlement settlement = settlementService.processSettlement(settlementId, bankAccountId);
        return ResponseEntity.ok(wrapResponse(settlement, "Settlement processing initiated"));
    }

    @PostMapping("/{settlementId}/complete")
    @Operation(summary = "Complete a settlement with payment reference")
    public ResponseEntity<Map<String, Object>> completeSettlement(
        @PathVariable Long settlementId,
        @RequestParam String paymentReference) {
        MerchantSettlement settlement = settlementService.completeSettlement(settlementId, paymentReference);
        return ResponseEntity.ok(wrapResponse(settlement, "Settlement completed"));
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
