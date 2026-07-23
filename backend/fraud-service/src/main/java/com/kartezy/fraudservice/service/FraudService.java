package com.kartezy.fraudservice.service;

import com.kartezy.fraudservice.dto.FraudCheckRequest;
import com.kartezy.fraudservice.dto.FraudCheckResponse;
import com.kartezy.fraudservice.entity.FraudRule;
import com.kartezy.fraudservice.entity.FraudAlert;
import com.kartezy.fraudservice.repository.FraudRuleRepository;
import com.kartezy.fraudservice.repository.FraudAlertRepository;
import com.kartezy.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FraudService {

    private final FraudRuleRepository ruleRepository;
    private final FraudAlertRepository alertRepository;

    public FraudCheckResponse checkOrder(FraudCheckRequest request) {
        List<FraudRule> activeRules = ruleRepository.findByActiveTrue();

        double riskScore = 0.0;
        StringBuilder reasons = new StringBuilder();

        for (FraudRule rule : activeRules) {
            boolean triggered = evaluateRule(rule, request);
            if (triggered) {
                riskScore += rule.getRiskWeight();
                if (reasons.length() > 0) reasons.append("; ");
                reasons.append(rule.getRuleName()).append(": ").append(rule.getDescription());
            }
        }

        double finalScore = Math.min(riskScore, 100.0);
        boolean isFraudulent = finalScore >= 50.0;

        if (isFraudulent) {
            createAlert(request, finalScore, reasons.toString());
        }

        return FraudCheckResponse.builder()
            .orderId(request.getOrderId())
            .riskScore(finalScore)
            .isFraudulent(isFraudulent)
            .reasons(reasons.toString())
            .recommendedAction(isFraudulent ? "FLAG_FOR_REVIEW" : "APPROVE")
            .build();
    }

    private boolean evaluateRule(FraudRule rule, FraudCheckRequest request) {
        switch (rule.getRuleType().toUpperCase()) {
            case "MAX_AMOUNT":
                return request.getOrderAmount() != null &&
                    request.getOrderAmount().doubleValue() > Double.parseDouble(rule.getRuleConfig());
            case "NEW_USER":
                return request.isNewUser();
            case "HIGH_VELOCITY":
                long recentOrders = alertRepository.countByUserIdAndCreatedAtAfter(
                    request.getUserId(), LocalDateTime.now().minusHours(1));
                return recentOrders > Integer.parseInt(rule.getRuleConfig());
            default:
                return false;
        }
    }

    @Transactional
    public void createAlert(FraudCheckRequest request, double riskScore, String reasons) {
        FraudAlert alert = FraudAlert.builder()
            .orderId(request.getOrderId())
            .userId(request.getUserId())
            .riskScore(riskScore)
            .reasons(reasons)
            .status("OPEN")
            .build();
        alertRepository.save(alert);
        log.warn("Fraud alert created: orderId={} userId={} riskScore={}", request.getOrderId(), request.getUserId(), riskScore);
    }

    public List<FraudAlert> getOpenAlerts() {
        return alertRepository.findByStatusOrderByCreatedAtDesc("OPEN");
    }

    @Transactional
    public void resolveAlert(UUID alertId, String resolution, String resolvedBy) {
        FraudAlert alert = alertRepository.findById(alertId)
            .orElseThrow(() -> new ResourceNotFoundException("Alert not found: " + alertId));
        alert.setStatus("RESOLVED");
        alert.setResolution(resolution);
        alert.setResolvedBy(resolvedBy);
        alert.setResolvedAt(LocalDateTime.now());
        alertRepository.save(alert);
        log.info("Fraud alert resolved: alertId={} resolution={}", alertId, resolution);
    }
}
