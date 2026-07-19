package com.kartezy.ops.service;

import com.kartezy.ops.constants.OpsConstants;
import com.kartezy.ops.entity.BusinessRule;
import com.kartezy.ops.exception.OpsException;
import com.kartezy.ops.repository.BusinessRuleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class RulesEngineService {

    private final BusinessRuleRepository businessRuleRepository;

    public List<BusinessRule> getAllRules() {
        return businessRuleRepository.findAll();
    }

    public BusinessRule getRuleById(Long id) {
        return businessRuleRepository.findById(id)
            .orElseThrow(() -> new OpsException("Rule not found: " + id, "RULE_NOT_FOUND"));
    }

    public List<BusinessRule> getRulesByType(String ruleType) {
        return businessRuleRepository.findByRuleTypeAndIsActiveTrue(ruleType);
    }

    @Cacheable(value = OpsConstants.CACHE_RULES, key = "#ruleType + ':' + #scopeType + ':' + #scopeId")
    public Optional<BusinessRule> getRule(String ruleType, String scopeType, Long scopeId) {
        return businessRuleRepository.findByRuleTypeAndScopeTypeAndScopeId(ruleType, scopeType, scopeId);
    }

    @Transactional
    @CacheEvict(value = OpsConstants.CACHE_RULES, allEntries = true)
    public BusinessRule createRule(BusinessRule rule) {
        return businessRuleRepository.save(rule);
    }

    @Transactional
    @CacheEvict(value = OpsConstants.CACHE_RULES, allEntries = true)
    public BusinessRule updateRule(Long id, BusinessRule updated) {
        BusinessRule rule = getRuleById(id);
        rule.setRuleName(updated.getRuleName());
        rule.setRuleExpression(updated.getRuleExpression());
        rule.setNumericValue(updated.getNumericValue());
        rule.setStringValue(updated.getStringValue());
        rule.setPriority(updated.getPriority());
        rule.setIsActive(updated.getIsActive());
        rule.setUpdatedBy(updated.getUpdatedBy());
        return businessRuleRepository.save(rule);
    }

    @Transactional
    @CacheEvict(value = OpsConstants.CACHE_RULES, allEntries = true)
    public void toggleRule(Long id, boolean active) {
        BusinessRule rule = getRuleById(id);
        rule.setIsActive(active);
        businessRuleRepository.save(rule);
    }

    @Transactional
    @CacheEvict(value = OpsConstants.CACHE_RULES, allEntries = true)
    public void deleteRule(Long id) {
        businessRuleRepository.deleteById(id);
    }

    /**
     * Evaluate a commission rule for a given scope
     */
    public BigDecimal evaluateCommission(String scopeType, Long scopeId) {
        var rule = getRule(OpsConstants.RULE_COMMISSION, scopeType, scopeId)
            .or(() -> getRule(OpsConstants.RULE_COMMISSION, "GLOBAL", 0L));

        return rule.map(r -> {
            BigDecimal value = r.getNumericValue() != null ? r.getNumericValue() : OpsConstants.DEFAULT_COMMISSION_RATE;
            // Clamp between min and max
            if (value.compareTo(OpsConstants.DEFAULT_MIN_COMMISSION) < 0) return OpsConstants.DEFAULT_MIN_COMMISSION;
            if (value.compareTo(OpsConstants.DEFAULT_MAX_COMMISSION) > 0) return OpsConstants.DEFAULT_MAX_COMMISSION;
            return value;
        }).orElse(OpsConstants.DEFAULT_COMMISSION_RATE);
    }
}
