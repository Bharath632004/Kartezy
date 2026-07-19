package com.kartezy.finance.service;

import com.kartezy.finance.constants.CommissionType;
import com.kartezy.finance.constants.FinanceConstants;
import com.kartezy.finance.entity.CommissionCalculation;
import com.kartezy.finance.entity.CommissionRule;
import com.kartezy.finance.exception.FinanceException;
import com.kartezy.finance.repository.CommissionCalculationRepository;
import com.kartezy.finance.repository.CommissionRuleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommissionService {

    private final CommissionRuleRepository ruleRepository;
    private final CommissionCalculationRepository calculationRepository;

    @Transactional(readOnly = true)
    public List<CommissionRule> getActiveRules(Long merchantId, Long categoryId) {
        if (merchantId != null && categoryId != null) {
            List<CommissionRule> rules = ruleRepository.findByMerchantIdAndCategoryIdAndIsActiveTrue(merchantId, categoryId);
            if (!rules.isEmpty()) return rules;
        }
        if (merchantId != null) {
            List<CommissionRule> rules = ruleRepository.findByMerchantIdAndIsActiveTrue(merchantId);
            if (!rules.isEmpty()) return rules;
        }
        if (categoryId != null) {
            List<CommissionRule> rules = ruleRepository.findByCategoryIdAndIsActiveTrue(categoryId);
            if (!rules.isEmpty()) return rules;
        }
        return ruleRepository.findDefaultRules();
    }

    @Transactional
    public CommissionCalculation calculateCommission(CommissionRule rule, Long orderId, String orderNumber,
                                                      Long merchantId, String merchantName,
                                                      BigDecimal orderAmount, String categoryName) {
        BigDecimal calculatedAmount;

        switch (rule.getCommissionType()) {
            case FIXED_AMOUNT:
                calculatedAmount = rule.getFixedAmount() != null ? rule.getFixedAmount() : BigDecimal.ZERO;
                break;

            case PERCENTAGE_OF_ORDER:
                calculatedAmount = orderAmount.multiply(
                    rule.getPercentage().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
                log.info("Calculated percentage commission: {} * {}% = {}", orderAmount, rule.getPercentage(), calculatedAmount);
                break;

            case PERCENTAGE_OF_PROFIT:
                // Simplified: assume profit is 30% of order amount if not provided
                BigDecimal estimatedProfit = orderAmount.multiply(BigDecimal.valueOf(0.3));
                calculatedAmount = estimatedProfit.multiply(
                    rule.getPercentage().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
                break;

            case TIERED_PERCENTAGE:
                calculatedAmount = calculateTieredCommission(rule, orderAmount);
                break;

            case SLAB_BASED:
                calculatedAmount = calculateSlabCommission(rule, orderAmount);
                break;

            case VOLUME_BASED:
                long volume = calculationRepository.countByIsSettledFalse();
                calculatedAmount = calculateVolumeBasedCommission(rule, orderAmount, volume);
                break;

            default:
                calculatedAmount = BigDecimal.ZERO;
        }

        // Apply min/max constraints
        if (rule.getMinAmount() != null && calculatedAmount.compareTo(rule.getMinAmount()) < 0) {
            calculatedAmount = rule.getMinAmount();
        }
        if (rule.getMaxAmount() != null && calculatedAmount.compareTo(rule.getMaxAmount()) > 0) {
            calculatedAmount = rule.getMaxAmount();
        }

        CommissionCalculation calculation = CommissionCalculation.builder()
            .rule(rule)
            .orderId(orderId)
            .orderNumber(orderNumber)
            .merchantId(merchantId)
            .merchantName(merchantName)
            .orderAmount(orderAmount)
            .calculatedAmount(calculatedAmount.setScale(2, RoundingMode.HALF_UP))
            .commissionRate(rule.getPercentage() != null ? rule.getPercentage() :
                rule.getFixedAmount() != null ? rule.getFixedAmount() : BigDecimal.ZERO)
            .commissionType(rule.getCommissionType().name())
            .categoryName(categoryName)
            .status("CALCULATED")
            .isSettled(false)
            .build();

        return calculationRepository.save(calculation);
    }

    private BigDecimal calculateTieredCommission(CommissionRule rule, BigDecimal orderAmount) {
        if (rule.getTierFrom() != null && orderAmount.compareTo(rule.getTierFrom()) < 0) {
            // Below tier, use default percentage
            return orderAmount.multiply(
                rule.getPercentage().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
        }
        if (rule.getTierTo() != null && orderAmount.compareTo(rule.getTierTo()) > 0) {
            // Above tier, use higher rate
            BigDecimal higherRate = rule.getPercentage().add(BigDecimal.valueOf(2));
            return orderAmount.multiply(
                higherRate.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
        }
        // Within tier, use standard rate
        return orderAmount.multiply(
            rule.getPercentage().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
    }

    private BigDecimal calculateSlabCommission(CommissionRule rule, BigDecimal orderAmount) {
        // Simplified slab calculation
        if (orderAmount.compareTo(BigDecimal.valueOf(500)) <= 0) {
            return BigDecimal.ZERO;
        } else if (orderAmount.compareTo(BigDecimal.valueOf(1000)) <= 0) {
            return BigDecimal.valueOf(5);
        } else if (orderAmount.compareTo(BigDecimal.valueOf(5000)) <= 0) {
            return BigDecimal.valueOf(10);
        } else {
            return BigDecimal.valueOf(20);
        }
    }

    private BigDecimal calculateVolumeBasedCommission(CommissionRule rule, BigDecimal orderAmount, long volume) {
        if (volume > 1000) {
            return orderAmount.multiply(BigDecimal.valueOf(0.02)); // 2% for high volume
        } else if (volume > 500) {
            return orderAmount.multiply(BigDecimal.valueOf(0.015)); // 1.5% for medium volume
        } else {
            return orderAmount.multiply(BigDecimal.valueOf(0.01)); // 1% for low volume
        }
    }

    @Transactional
    public List<CommissionCalculation> settleCommissions(Long settlementId) {
        List<CommissionCalculation> unsettled = calculationRepository.findUnsettledCommissions();
        for (CommissionCalculation calc : unsettled) {
            calc.setSettlementId(settlementId);
            calc.setSettled(true);
            calc.setStatus("SETTLED");
        }
        return calculationRepository.saveAll(unsettled);
    }
}
