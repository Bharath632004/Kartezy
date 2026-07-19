package com.kartezy.crm.controller;

import com.kartezy.crm.entity.MarketingAutomationRule;
import com.kartezy.crm.service.MarketingAutomationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/crm/automation")
@RequiredArgsConstructor
@Tag(name = "Marketing Automation", description = "Trigger-based marketing automation rules")
public class AutomationController {

    private final MarketingAutomationService automationService;

    @PostMapping("/rules")
    @Operation(summary = "Create automation rule")
    public ResponseEntity<Map<String, Object>> createRule(@RequestBody MarketingAutomationRule rule) {
        MarketingAutomationRule created = automationService.createRule(rule);
        return ResponseEntity.ok(wrapResponse(created, "Automation rule created"));
    }

    @GetMapping("/rules")
    @Operation(summary = "Get all active rules")
    public ResponseEntity<Map<String, Object>> getActiveRules() {
        List<MarketingAutomationRule> rules = automationService.getActiveRules();
        return ResponseEntity.ok(wrapResponse(rules, "Rules retrieved"));
    }

    @PutMapping("/rules/{id}/toggle")
    @Operation(summary = "Toggle rule active status")
    public ResponseEntity<Map<String, Object>> toggleRule(@PathVariable Long id, @RequestParam boolean active) {
        MarketingAutomationRule rule = automationService.toggleRule(id, active);
        return ResponseEntity.ok(wrapResponse(rule, "Rule toggled"));
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
