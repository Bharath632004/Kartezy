package com.kartezy.ops.controller;

import com.kartezy.ops.entity.BusinessRule;
import com.kartezy.ops.service.RulesEngineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ops/rules")
@RequiredArgsConstructor
public class RulesController {

    private final RulesEngineService rulesEngineService;

    @GetMapping
    public ResponseEntity<List<BusinessRule>> getAllRules() {
        return ResponseEntity.ok(rulesEngineService.getAllRules());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BusinessRule> getRuleById(@PathVariable Long id) {
        return ResponseEntity.ok(rulesEngineService.getRuleById(id));
    }

    @GetMapping("/type/{ruleType}")
    public ResponseEntity<List<BusinessRule>> getRulesByType(@PathVariable String ruleType) {
        return ResponseEntity.ok(rulesEngineService.getRulesByType(ruleType));
    }

    @PostMapping
    public ResponseEntity<BusinessRule> createRule(@RequestBody BusinessRule rule) {
        return ResponseEntity.ok(rulesEngineService.createRule(rule));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BusinessRule> updateRule(@PathVariable Long id, @RequestBody BusinessRule rule) {
        return ResponseEntity.ok(rulesEngineService.updateRule(id, rule));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Void> toggleRule(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        rulesEngineService.toggleRule(id, body.getOrDefault("active", false));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRule(@PathVariable Long id) {
        rulesEngineService.deleteRule(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/evaluate/commission")
    public ResponseEntity<Map<String, Object>> evaluateCommission(@RequestParam String scopeType, @RequestParam Long scopeId) {
        var rate = rulesEngineService.evaluateCommission(scopeType, scopeId);
        return ResponseEntity.ok(Map.of(
            "commissionRate", rate,
            "scopeType", scopeType,
            "scopeId", scopeId
        ));
    }
}
