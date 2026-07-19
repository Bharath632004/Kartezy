package com.kartezy.crm.controller;

import com.kartezy.crm.entity.LoyaltyProgram;
import com.kartezy.crm.entity.LoyaltyTransaction;
import com.kartezy.crm.service.LoyaltyEngineService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/crm/loyalty")
@RequiredArgsConstructor
@Tag(name = "Loyalty Engine", description = "Loyalty points, tiers, and rewards management")
public class LoyaltyController {

    private final LoyaltyEngineService loyaltyService;

    @PostMapping("/programs")
    @Operation(summary = "Create a loyalty program")
    public ResponseEntity<Map<String, Object>> createProgram(@RequestBody LoyaltyProgram program) {
        LoyaltyProgram created = loyaltyService.createProgram(program);
        return ResponseEntity.ok(wrapResponse(created, "Loyalty program created"));
    }

    @PostMapping("/points/award")
    @Operation(summary = "Award loyalty points to a customer")
    public ResponseEntity<Map<String, Object>> awardPoints(
        @RequestParam Long customerId, @RequestParam int points, @RequestParam String description) {
        LoyaltyTransaction txn = loyaltyService.awardPoints(customerId, points, description);
        return ResponseEntity.ok(wrapResponse(txn, "Points awarded"));
    }

    @PostMapping("/points/redeem")
    @Operation(summary = "Redeem loyalty points")
    public ResponseEntity<Map<String, Object>> redeemPoints(
        @RequestParam Long customerId, @RequestParam int points, @RequestParam String description) {
        LoyaltyTransaction txn = loyaltyService.redeemPoints(customerId, points, description);
        return ResponseEntity.ok(wrapResponse(txn, "Points redeemed"));
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
