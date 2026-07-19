package com.kartezy.crm.repository;

import com.kartezy.crm.entity.MarketingAutomationRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarketingAutomationRuleRepository extends JpaRepository<MarketingAutomationRule, Long> {

    List<MarketingAutomationRule> findByIsActiveTrue();

    List<MarketingAutomationRule> findByTriggerEvent(String triggerEvent);

    List<MarketingAutomationRule> findByActionType(String actionType);
}
