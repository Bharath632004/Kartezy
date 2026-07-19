package com.kartezy.crm.service;

import com.kartezy.crm.entity.BehaviorEvent;
import com.kartezy.crm.entity.MarketingAutomationRule;
import com.kartezy.crm.exception.CrmException;
import com.kartezy.crm.repository.MarketingAutomationRuleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MarketingAutomationService {

    private final MarketingAutomationRuleRepository ruleRepository;

    @Transactional
    public MarketingAutomationRule createRule(MarketingAutomationRule rule) {
        rule.setExecutionCount(0);
        rule.setActive(true);
        return ruleRepository.save(rule);
    }

    @Transactional(readOnly = true)
    public List<MarketingAutomationRule> getActiveRules() {
        return ruleRepository.findByIsActiveTrue();
    }

    @Transactional(readOnly = true)
    public List<MarketingAutomationRule> getRulesByTrigger(String triggerEvent) {
        return ruleRepository.findByTriggerEvent(triggerEvent);
    }

    @Transactional
    public void evaluateRuleOnEvent(BehaviorEvent event) {
        List<MarketingAutomationRule> rules = ruleRepository.findByTriggerEvent(event.getEventType());

        for (MarketingAutomationRule rule : rules) {
            if (rule.isActive() && evaluateConditions(rule, event)) {
                executeAction(rule, event);
            }
        }
    }

    private boolean evaluateConditions(MarketingAutomationRule rule, BehaviorEvent event) {
        // Parse conditions JSON and evaluate against event
        // Simplified: always returns true for demo
        return true;
    }

    @Transactional
    public void executeAction(MarketingAutomationRule rule, BehaviorEvent event) {
        log.info("Executing automation rule: {} for event: {} customer: {}",
            rule.getRuleName(), event.getEventType(), event.getCustomerId());

        rule.setExecutionCount(rule.getExecutionCount() + 1);
        rule.setLastExecutedAt(LocalDateTime.now());
        ruleRepository.save(rule);

        // Could trigger campaign launch, add to segment, send notification, etc.
    }

    @Transactional
    public MarketingAutomationRule toggleRule(Long ruleId, boolean active) {
        MarketingAutomationRule rule = ruleRepository.findById(ruleId)
            .orElseThrow(() -> new CrmException("Rule not found: " + ruleId));
        rule.setActive(active);
        return ruleRepository.save(rule);
    }
}
