package com.kartezy.finance.controller;

import com.kartezy.finance.entity.CommissionRule;
import com.kartezy.finance.entity.CommissionCalculation;
import com.kartezy.finance.service.CommissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/finance/commissions")
@RequiredArgsConstructor
@Tag(name = "Commission Engine", description = "Commission rule configuration and calculation")
public class CommissionController {

    private final CommissionService commissionService;

    @GetMapping("/rules")
    @Operation(summary = "Get active commission rules for merchant/category")
    public ResponseEntity<Map<String, Object>> getActiveRules(
        @RequestParam(required = false) Long merchantId,
        @RequestParam(required = false) Long categoryId) {
        List<CommissionRule> rules = commissionService.getActiveRules(merchantId, categoryId);
        return ResponseEntity.ok(wrapResponse(rules, "Commission rules retrieved"));
    }

    @PostMapping("/calculate")
    @Operation(summary = "Calculate commission for an order")
    public ResponseEntity<Map<String, Object>> calculateCommission(
        @RequestParam Long ruleId,
        @RequestParam Long orderId,
        @RequestParam String orderNumber,
        @RequestParam Long merchantId,
        @RequestParam String merchantName,
        @RequestParam BigDecimal orderAmount,
        @RequestParam(required = false) String categoryName) {

        CommissionRule rule = commissionService.getActiveRules(merchantId, null)
            .stream().filter(r -> r.getId().equals(ruleId)).findFirst()
            .orElseThrow(() -> new RuntimeException("Rule not found"));

        CommissionCalculation calculation = commissionService.calculateCommission(
            rule, orderId, orderNumber, merchantId, merchantName, orderAmount, categoryName);
        return ResponseEntity.ok(wrapResponse(calculation, "Commission calculated"));
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
