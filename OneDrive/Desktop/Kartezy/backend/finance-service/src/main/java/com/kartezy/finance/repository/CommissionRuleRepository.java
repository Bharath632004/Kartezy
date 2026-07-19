package com.kartezy.finance.repository;

import com.kartezy.finance.entity.CommissionRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CommissionRuleRepository extends JpaRepository<CommissionRule, Long> {

    List<CommissionRule> findByMerchantIdAndIsActiveTrue(Long merchantId);

    List<CommissionRule> findByCategoryIdAndIsActiveTrue(Long categoryId);

    List<CommissionRule> findByMerchantIdAndCategoryIdAndIsActiveTrue(Long merchantId, Long categoryId);

    @Query("SELECT c FROM CommissionRule c WHERE c.isActive = true AND c.effectiveFrom <= :date AND (c.effectiveTo IS NULL OR c.effectiveTo >= :date) ORDER BY c.priority")
    List<CommissionRule> findActiveRulesByDate(@Param("date") LocalDate date);

    @Query("SELECT c FROM CommissionRule c WHERE c.merchantId IS NULL AND c.isActive = true ORDER BY c.priority")
    List<CommissionRule> findDefaultRules();
}
