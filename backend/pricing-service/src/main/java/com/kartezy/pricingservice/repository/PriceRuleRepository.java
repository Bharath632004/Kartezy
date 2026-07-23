package com.kartezy.pricingservice.repository;

import com.kartezy.pricingservice.entity.PriceRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface PriceRuleRepository extends JpaRepository<PriceRule, UUID> {
    List<PriceRule> findByProductIdAndActiveTrue(UUID productId);
    List<PriceRule> findByMerchantIdAndActiveTrue(UUID merchantId);
    List<PriceRule> findByCategoryIdAndActiveTrue(UUID categoryId);
    List<PriceRule> findByRuleTypeAndActiveTrue(String ruleType);

    @Query("SELECT p FROM PriceRule p WHERE p.active = true AND p.effectiveFrom < :now AND (p.effectiveTo > :now OR p.effectiveTo IS NULL)")
    List<PriceRule> findActiveRules(@Param("now") LocalDateTime now);
}
