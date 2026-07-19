package com.kartezy.finance.service;

import com.kartezy.finance.constants.CommissionType;
import com.kartezy.finance.entity.CommissionCalculation;
import com.kartezy.finance.entity.CommissionRule;
import com.kartezy.finance.repository.CommissionCalculationRepository;
import com.kartezy.finance.repository.CommissionRuleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommissionServiceTest {

    @Mock private CommissionRuleRepository ruleRepository;
    @Mock private CommissionCalculationRepository calculationRepository;

    private CommissionService commissionService;

    @BeforeEach
    void setUp() {
        commissionService = new CommissionService(ruleRepository, calculationRepository);
    }

    @Test
    @DisplayName("Should calculate fixed amount commission")
    void calculateCommission_FixedAmount_ShouldReturnFixedAmount() {
        CommissionRule rule = CommissionRule.builder()
            .id(1L).ruleName("Fixed Fee")
            .commissionType(CommissionType.FIXED_AMOUNT)
            .fixedAmount(BigDecimal.valueOf(25))
            .minAmount(BigDecimal.ZERO)
            .maxAmount(BigDecimal.valueOf(25))
            .build();

        when(calculationRepository.save(any(CommissionCalculation.class)))
            .thenAnswer(inv -> inv.getArgument(0));

        CommissionCalculation result = commissionService.calculateCommission(
            rule, 1L, "ORD-001", 100L, "Test Merchant",
            BigDecimal.valueOf(500), "Groceries");

        assertNotNull(result);
        assertEquals("CALCULATED", result.getStatus());
        assertEquals(BigDecimal.valueOf(25).setScale(2, java.math.RoundingMode.HALF_UP),
            result.getCalculatedAmount());
    }

    @Test
    @DisplayName("Should calculate percentage commission")
    void calculateCommission_Percentage_ShouldReturnPercentageOfOrder() {
        CommissionRule rule = CommissionRule.builder()
            .id(1L).ruleName("5% Commission")
            .commissionType(CommissionType.PERCENTAGE_OF_ORDER)
            .percentage(BigDecimal.valueOf(5))
            .build();

        when(calculationRepository.save(any(CommissionCalculation.class)))
            .thenAnswer(inv -> inv.getArgument(0));

        CommissionCalculation result = commissionService.calculateCommission(
            rule, 1L, "ORD-001", 100L, "Test",
            BigDecimal.valueOf(1000), "Electronics");

        assertEquals(BigDecimal.valueOf(50).setScale(2, java.math.RoundingMode.HALF_UP),
            result.getCalculatedAmount());
    }

    @Test
    @DisplayName("Should enforce minimum commission amount")
    void calculateCommission_ShouldEnforceMinAmount() {
        CommissionRule rule = CommissionRule.builder()
            .id(1L).ruleName("Min ₹10 Commission")
            .commissionType(CommissionType.PERCENTAGE_OF_ORDER)
            .percentage(BigDecimal.valueOf(1))
            .minAmount(BigDecimal.valueOf(10))
            .build();

        when(calculationRepository.save(any(CommissionCalculation.class)))
            .thenAnswer(inv -> inv.getArgument(0));

        CommissionCalculation result = commissionService.calculateCommission(
            rule, 1L, "ORD-001", 100L, "Test",
            BigDecimal.valueOf(100), "Small Items");

        // 1% of 100 = 1, but min is 10
        assertEquals(BigDecimal.valueOf(10).setScale(2, java.math.RoundingMode.HALF_UP),
            result.getCalculatedAmount());
    }

    @Test
    @DisplayName("Should enforce maximum commission amount")
    void calculateCommission_ShouldEnforceMaxAmount() {
        CommissionRule rule = CommissionRule.builder()
            .id(1L).ruleName("Max ₹100 Commission")
            .commissionType(CommissionType.PERCENTAGE_OF_ORDER)
            .percentage(BigDecimal.valueOf(10))
            .maxAmount(BigDecimal.valueOf(100))
            .build();

        when(calculationRepository.save(any(CommissionCalculation.class)))
            .thenAnswer(inv -> inv.getArgument(0));

        CommissionCalculation result = commissionService.calculateCommission(
            rule, 1L, "ORD-001", 100L, "Test",
            BigDecimal.valueOf(5000), "Large Items");

        // 10% of 5000 = 500, but max is 100
        assertEquals(BigDecimal.valueOf(100).setScale(2, java.math.RoundingMode.HALF_UP),
            result.getCalculatedAmount());
    }

    @Test
    @DisplayName("Should get merchant-specific rules first, then category, then default")
    void getActiveRules_ShouldPrioritizeMerchantRules() {
        when(ruleRepository.findByMerchantIdAndCategoryIdAndIsActiveTrue(100L, 200L))
            .thenReturn(List.of(CommissionRule.builder().id(1L).ruleName("Merchant+Category").build()));

        List<CommissionRule> result = commissionService.getActiveRules(100L, 200L);
        assertEquals(1, result.size());
        assertEquals("Merchant+Category", result.get(0).getRuleName());
    }

    @Test
    @DisplayName("Should fallback to default rules")
    void getActiveRules_ShouldFallbackToDefault() {
        when(ruleRepository.findByMerchantIdAndCategoryIdAndIsActiveTrue(100L, 200L))
            .thenReturn(List.of());
        when(ruleRepository.findByMerchantIdAndIsActiveTrue(100L))
            .thenReturn(List.of());
        when(ruleRepository.findByCategoryIdAndIsActiveTrue(200L))
            .thenReturn(List.of());
        when(ruleRepository.findDefaultRules())
            .thenReturn(List.of(CommissionRule.builder().id(3L).ruleName("Default Rule").build()));

        List<CommissionRule> result = commissionService.getActiveRules(100L, 200L);
        assertEquals(1, result.size());
        assertEquals("Default Rule", result.get(0).getRuleName());
    }

    @Test
    @DisplayName("Should settle commissions")
    void settleCommissions_ShouldMarkAsSettled() {
        CommissionCalculation calc1 = CommissionCalculation.builder()
            .id(1L).status("CALCULATED").isSettled(false).build();
        CommissionCalculation calc2 = CommissionCalculation.builder()
            .id(2L).status("CALCULATED").isSettled(false).build();

        when(calculationRepository.findUnsettledCommissions())
            .thenReturn(List.of(calc1, calc2));
        when(calculationRepository.saveAll(anyList()))
            .thenAnswer(inv -> inv.getArgument(0));

        List<CommissionCalculation> result = commissionService.settleCommissions(1L);

        assertEquals(2, result.size());
        assertTrue(calc1.isSettled());
        assertTrue(calc2.isSettled());
        assertEquals("SETTLED", calc1.getStatus());
        assertEquals(1L, calc1.getSettlementId());
    }
}
