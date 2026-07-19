package com.kartezy.ops.repository;

import com.kartezy.ops.entity.BusinessRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BusinessRuleRepository extends JpaRepository<BusinessRule, Long> {
    List<BusinessRule> findByRuleType(String ruleType);
    List<BusinessRule> findByIsActiveTrue();
    List<BusinessRule> findByRuleTypeAndIsActiveTrue(String ruleType);
    Optional<BusinessRule> findByRuleTypeAndScopeTypeAndScopeId(String ruleType, String scopeType, Long scopeId);
    List<BusinessRule> findByRuleTypeAndScopeType(String ruleType, String scopeType);
}
