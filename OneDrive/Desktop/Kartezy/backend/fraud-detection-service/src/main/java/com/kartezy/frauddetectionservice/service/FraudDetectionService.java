package com.kartezy.frauddetectionservice.service;

import com.kartezy.shared.ai.FraudDetectionModels.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class FraudDetectionService {

    private final Map<String, UserBehaviorProfile> userBehaviorProfiles = new ConcurrentHashMap<>();
    private final Map<String, List<FraudAlert>> fraudAlerts = new ConcurrentHashMap<>();
    private final Map<String, Set<String>> deviceUserMap = new ConcurrentHashMap<>();
    private final Map<String, Set<String>> ipUserMap = new ConcurrentHashMap<>();

    private static final double ORDER_FRAUD_THRESHOLD = 0.7;
    private static final double ACCOUNT_FRAUD_THRESHOLD = 0.6;
    private static final double PAYMENT_FRAUD_THRESHOLD = 0.75;
    private static final double PROMOTION_ABUSE_THRESHOLD = 0.65;

    public FraudCheckResult checkOrder(FraudCheckRequest request) {
        FraudCheckResult result = new FraudCheckResult(request.getTransactionId());
        double totalScore = 0;
        int factors = 0;

        double velocityScore = checkOrderVelocity(request);
        result.addFactor("order_velocity", velocityScore);
        totalScore += velocityScore * 0.25;
        factors++;

        double amountScore = checkAmountAnomaly(request);
        result.addFactor("amount_anomaly", amountScore);
        totalScore += amountScore * 0.20;
        factors++;

        double locationScore = checkLocationAnomaly(request);
        result.addFactor("location_anomaly", locationScore);
        totalScore += locationScore * 0.15;
        factors++;

        double deviceScore = checkDeviceAnomaly(request);
        result.addFactor("device_anomaly", deviceScore);
        totalScore += deviceScore * 0.15;
        factors++;

        double timeScore = checkTimeAnomaly(request);
        result.addFactor("time_anomaly", timeScore);
        totalScore += timeScore * 0.10;
        factors++;

        double historicalScore = checkHistoricalBehavior(request);
        result.addFactor("historical_behavior", historicalScore);
        totalScore += historicalScore * 0.15;
        factors++;

        result.setFraudScore(factors > 0 ? totalScore / factors : 0);
        result.setRiskScore(result.getFraudScore());

        if (result.getFraudScore() >= ORDER_FRAUD_THRESHOLD) {
            result.setFraudulent(true);
            result.setRecommendedAction("REVIEW");
            result.setSeverity("HIGH");
            result.addReason("Fraud score exceeds threshold: " + String.format("%.2f", result.getFraudScore()));
        } else if (result.getFraudScore() >= ORDER_FRAUD_THRESHOLD * 0.7) {
            result.setRecommendedAction("MONITOR");
            result.setSeverity("MEDIUM");
        } else {
            result.setRecommendedAction("APPROVE");
            result.setSeverity("LOW");
        }

        if (result.getFraudScore() > 0.5) {
            generateAlert(request, "ORDER_FRAUD", result.getFraudScore());
        }

        return result;
    }

    public FraudCheckResult checkAccount(FraudCheckRequest request) {
        FraudCheckResult result = new FraudCheckResult(request.getTransactionId());
        double totalScore = 0;
        int factors = 0;

        double deviceVelocityScore = checkDeviceVelocity(request);
        result.addFactor("device_velocity", deviceVelocityScore);
        totalScore += deviceVelocityScore * 0.30;
        factors++;

        double ipScore = checkIPReputation(request);
        result.addFactor("ip_reputation", ipScore);
        totalScore += ipScore * 0.25;
        factors++;

        double patternScore = checkRegistrationPattern(request);
        result.addFactor("registration_pattern", patternScore);
        totalScore += patternScore * 0.25;
        factors++;

        double dataScore = checkDataConsistency(request);
        result.addFactor("data_consistency", dataScore);
        totalScore += dataScore * 0.20;
        factors++;

        result.setFraudScore(factors > 0 ? totalScore / factors : 0);
        result.setRiskScore(result.getFraudScore());

        if (result.getFraudScore() >= ACCOUNT_FRAUD_THRESHOLD) {
            result.setFraudulent(true);
            result.setRecommendedAction("BLOCK");
            result.setSeverity("HIGH");
            result.addReason("Suspicious account pattern detected");
        } else if (result.getFraudScore() >= ACCOUNT_FRAUD_THRESHOLD * 0.6) {
            result.setRecommendedAction("REVIEW");
            result.setSeverity("MEDIUM");
        } else {
            result.setRecommendedAction("ALLOW");
            result.setSeverity("LOW");
        }

        return result;
    }

    public FraudCheckResult checkPayment(FraudCheckRequest request) {
        FraudCheckResult result = new FraudCheckResult(request.getTransactionId());
        double totalScore = 0;
        int factors = 0;

        double amountScore = checkPaymentAmountAnomaly(request);
        result.addFactor("payment_amount", amountScore);
        totalScore += amountScore * 0.25;
        factors++;

        double methodScore = checkPaymentMethodAnomaly(request);
        result.addFactor("payment_method", methodScore);
        totalScore += methodScore * 0.20;
        factors++;

        double binScore = checkBINReputation(request);
        result.addFactor("bin_reputation", binScore);
        totalScore += binScore * 0.20;
        factors++;

        double duplicateScore = checkDuplicatePayment(request);
        result.addFactor("duplicate_payment", duplicateScore);
        totalScore += duplicateScore * 0.20;
        factors++;

        double speedScore = checkTransactionSpeed(request);
        result.addFactor("transaction_speed", speedScore);
        totalScore += speedScore * 0.15;
        factors++;

        result.setFraudScore(factors > 0 ? totalScore / factors : 0);
        result.setRiskScore(result.getFraudScore());

        if (result.getFraudScore() >= PAYMENT_FRAUD_THRESHOLD) {
            result.setFraudulent(true);
            result.setRecommendedAction("DECLINE");
            result.setSeverity("CRITICAL");
            result.addReason("High-risk payment detected");
        } else if (result.getFraudScore() >= PAYMENT_FRAUD_THRESHOLD * 0.7) {
            result.setRecommendedAction("REVIEW");
            result.setSeverity("HIGH");
        } else {
            result.setRecommendedAction("APPROVE");
            result.setSeverity("LOW");
        }

        return result;
    }

    public FraudCheckResult checkPromotionAbuse(FraudCheckRequest request) {
        FraudCheckResult result = new FraudCheckResult(request.getTransactionId());
        double totalScore = 0;
        int factors = 0;

        double usageFrequencyScore = checkPromoUsageFrequency(request);
        result.addFactor("usage_frequency", usageFrequencyScore);
        totalScore += usageFrequencyScore * 0.30;
        factors++;

        double accountVelocityScore = checkAccountPromoVelocity(request);
        result.addFactor("account_velocity", accountVelocityScore);
        totalScore += accountVelocityScore * 0.25;
        factors++;

        double patternScore = checkPromoUsagePattern(request);
        result.addFactor("usage_pattern", patternScore);
        totalScore += patternScore * 0.25;
        factors++;

        double devicePatternScore = checkPromoDevicePattern(request);
        result.addFactor("device_pattern", devicePatternScore);
        totalScore += devicePatternScore * 0.20;
        factors++;

        result.setFraudScore(factors > 0 ? totalScore / factors : 0);
        result.setRiskScore(result.getFraudScore());

        if (result.getFraudScore() >= PROMOTION_ABUSE_THRESHOLD) {
            result.setFraudulent(true);
            result.setRecommendedAction("BLOCK");
            result.setSeverity("HIGH");
            result.addReason("Promotion abuse pattern detected");
        } else {
            result.setRecommendedAction("ALLOW");
            result.setSeverity("LOW");
        }

        return result;
    }

    public FraudCheckResult checkLogin(FraudCheckRequest request) {
        FraudCheckResult result = new FraudCheckResult(request.getTransactionId());
        double totalScore = 0;
        int factors = 0;

        double velocityScore = checkLoginVelocity(request);
        result.addFactor("login_velocity", velocityScore);
        totalScore += velocityScore * 0.30;
        factors++;

        double geoScore = checkGeoAnomaly(request);
        result.addFactor("geo_anomaly", geoScore);
        totalScore += geoScore * 0.25;
        factors++;

        double deviceScore = checkLoginDeviceAnomaly(request);
        result.addFactor("device_anomaly", deviceScore);
        totalScore += deviceScore * 0.25;
        factors++;

        double timeScore = checkLoginTimeAnomaly(request);
        result.addFactor("time_anomaly", timeScore);
        totalScore += timeScore * 0.20;
        factors++;

        result.setFraudScore(factors > 0 ? totalScore / factors : 0);

        if (result.getFraudScore() > 0.8) {
            result.setRecommendedAction("BLOCK");
            result.setSeverity("CRITICAL");
            result.addReason("Multiple suspicious login indicators");
        } else if (result.getFraudScore() > 0.5) {
            result.setRecommendedAction("CHALLENGE");
            result.setSeverity("HIGH");
            result.addReason("Suspicious login attempt");
        } else {
            result.setRecommendedAction("ALLOW");
            result.setSeverity("LOW");
        }

        return result;
    }

    public FraudCheckResult checkReturn(FraudCheckRequest request) {
        FraudCheckResult result = new FraudCheckResult(request.getTransactionId());
        double totalScore = 0;
        int factors = 0;

        double returnFrequencyScore = checkReturnFrequency(request);
        result.addFactor("return_frequency", returnFrequencyScore);
        totalScore += returnFrequencyScore * 0.35;
        factors++;

        double returnValueScore = checkReturnValueAnomaly(request);
        result.addFactor("return_value", returnValueScore);
        totalScore += returnValueScore * 0.30;
        factors++;

        double returnPatternScore = checkReturnPattern(request);
        result.addFactor("return_pattern", returnPatternScore);
        totalScore += returnPatternScore * 0.35;
        factors++;

        result.setFraudScore(factors > 0 ? totalScore / factors : 0);

        if (result.getFraudScore() > 0.7) {
            result.setFraudulent(true);
            result.setRecommendedAction("INVESTIGATE");
            result.setSeverity("HIGH");
            result.addReason("Suspicious return pattern detected");
        } else {
            result.setRecommendedAction("APPROVE");
            result.setSeverity("LOW");
        }

        return result;
    }

    public void updateBehaviorProfile(String userId, FraudCheckRequest request) {
        UserBehaviorProfile profile = userBehaviorProfiles.computeIfAbsent(userId, UserBehaviorProfile::new);
        if (request.getAmount() > 0) {
            double currentAvg = profile.getAverageOrderValue();
            profile.setAverageOrderValue(currentAvg > 0 ? (currentAvg * 0.7 + request.getAmount() * 0.3) : request.getAmount());
        }
        if (request.getDeviceId() != null && !profile.getTypicalDevices().contains(request.getDeviceId())) {
            profile.getTypicalDevices().add(request.getDeviceId());
        }
        if (request.getPaymentMethod() != null && !profile.getTypicalPaymentMethods().contains(request.getPaymentMethod())) {
            profile.getTypicalPaymentMethods().add(request.getPaymentMethod());
        }
        if (request.getLocation() != null) {
            profile.setTypicalLocation(request.getLocation());
        }
        if (request.getDeviceId() != null) {
            deviceUserMap.computeIfAbsent(request.getDeviceId(), k -> ConcurrentHashMap.newKeySet()).add(userId);
        }
        if (request.getIpAddress() != null) {
            ipUserMap.computeIfAbsent(request.getIpAddress(), k -> ConcurrentHashMap.newKeySet()).add(userId);
        }
    }

    private double checkOrderVelocity(FraudCheckRequest request) {
        return Math.min(1.0, Math.random() * 0.3);
    }

    private double checkAmountAnomaly(FraudCheckRequest request) {
        UserBehaviorProfile profile = userBehaviorProfiles.get(request.getUserId());
        if (profile == null || profile.getAverageOrderValue() == 0) return 0.1;
        double ratio = profile.getAverageOrderValue() > 0 ? request.getAmount() / profile.getAverageOrderValue() : 1;
        return Math.min(1.0, Math.max(0, (ratio - 2) / 8));
    }

    private double checkLocationAnomaly(FraudCheckRequest request) {
        UserBehaviorProfile profile = userBehaviorProfiles.get(request.getUserId());
        if (profile == null || profile.getTypicalLocation() == null) return 0.1;
        return request.getLocation() != null && !request.getLocation().equals(profile.getTypicalLocation()) ? 0.6 : 0.1;
    }

    private double checkDeviceAnomaly(FraudCheckRequest request) {
        UserBehaviorProfile profile = userBehaviorProfiles.get(request.getUserId());
        if (profile == null || profile.getTypicalDevices().isEmpty()) return 0.1;
        return request.getDeviceId() != null && !profile.getTypicalDevices().contains(request.getDeviceId()) ? 0.5 : 0.1;
    }

    private double checkTimeAnomaly(FraudCheckRequest request) {
        Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(request.getTimestamp() > 0 ? request.getTimestamp() : System.currentTimeMillis());
        int hour = cal.get(Calendar.HOUR_OF_DAY);
        return (hour >= 1 && hour <= 5) ? 0.4 : 0.1;
    }

    private double checkHistoricalBehavior(FraudCheckRequest request) {
        return Math.min(1.0, Math.random() * 0.4);
    }

    private double checkDeviceVelocity(FraudCheckRequest request) {
        if (request.getDeviceId() == null) return 0.1;
        Set<String> users = deviceUserMap.get(request.getDeviceId());
        return users != null && users.size() > 5 ? Math.min(1.0, (users.size() - 5) * 0.1) : 0.1;
    }

    private double checkIPReputation(FraudCheckRequest request) {
        if (request.getIpAddress() == null) return 0.0;
        Set<String> users = ipUserMap.get(request.getIpAddress());
        return users != null && users.size() > 3 ? Math.min(1.0, (users.size() - 3) * 0.15) : 0.0;
    }

    private double checkRegistrationPattern(FraudCheckRequest request) {
        return Math.min(1.0, Math.random() * 0.3);
    }

    private double checkDataConsistency(FraudCheckRequest request) {
        return Math.min(1.0, Math.random() * 0.2);
    }

    private double checkPaymentAmountAnomaly(FraudCheckRequest request) {
        return Math.min(1.0, Math.random() * 0.3);
    }

    private double checkPaymentMethodAnomaly(FraudCheckRequest request) {
        UserBehaviorProfile profile = userBehaviorProfiles.get(request.getUserId());
        if (profile == null || profile.getTypicalPaymentMethods().isEmpty()) return 0.2;
        return request.getPaymentMethod() != null && !profile.getTypicalPaymentMethods().contains(request.getPaymentMethod()) ? 0.7 : 0.1;
    }

    private double checkBINReputation(FraudCheckRequest request) {
        return Math.min(1.0, Math.random() * 0.2);
    }

    private double checkDuplicatePayment(FraudCheckRequest request) {
        return Math.min(1.0, Math.random() * 0.2);
    }

    private double checkTransactionSpeed(FraudCheckRequest request) {
        return Math.min(1.0, Math.random() * 0.2);
    }

    private double checkPromoUsageFrequency(FraudCheckRequest request) {
        return Math.min(1.0, Math.random() * 0.4);
    }

    private double checkAccountPromoVelocity(FraudCheckRequest request) {
        if (request.getDeviceId() == null) return 0.0;
        Set<String> users = deviceUserMap.get(request.getDeviceId());
        return users != null && users.size() > 2 ? Math.min(1.0, users.size() * 0.15) : 0.0;
    }

    private double checkPromoUsagePattern(FraudCheckRequest request) {
        return Math.min(1.0, Math.random() * 0.3);
    }

    private double checkPromoDevicePattern(FraudCheckRequest request) {
        return Math.min(1.0, Math.random() * 0.3);
    }

    private double checkLoginVelocity(FraudCheckRequest request) {
        return Math.min(1.0, Math.random() * 0.3);
    }

    private double checkGeoAnomaly(FraudCheckRequest request) {
        return Math.min(1.0, Math.random() * 0.3);
    }

    private double checkLoginDeviceAnomaly(FraudCheckRequest request) {
        UserBehaviorProfile profile = userBehaviorProfiles.get(request.getUserId());
        if (profile == null || profile.getTypicalDevices().isEmpty()) return 0.3;
        return request.getDeviceId() != null && !profile.getTypicalDevices().contains(request.getDeviceId()) ? 0.8 : 0.1;
    }

    private double checkLoginTimeAnomaly(FraudCheckRequest request) {
        return checkTimeAnomaly(request);
    }

    private double checkReturnFrequency(FraudCheckRequest request) {
        return Math.min(1.0, Math.random() * 0.3);
    }

    private double checkReturnValueAnomaly(FraudCheckRequest request) {
        return Math.min(1.0, Math.random() * 0.3);
    }

    private double checkReturnPattern(FraudCheckRequest request) {
        return Math.min(1.0, Math.random() * 0.3);
    }

    private void generateAlert(FraudCheckRequest request, String alertType, double score) {
        FraudAlert alert = new FraudAlert(
                UUID.randomUUID().toString(),
                request.getTransactionId(),
                request.getUserId(),
                alertType,
                score > 0.8 ? "CRITICAL" : "HIGH",
                "Fraud detected: " + alertType,
                score
        );
        fraudAlerts.computeIfAbsent(request.getUserId(), k -> Collections.synchronizedList(new ArrayList<>())).add(alert);
    }

    public List<FraudAlert> getRecentAlerts(int limit) {
        return fraudAlerts.values().stream()
                .flatMap(List::stream)
                .sorted((a, b) -> Long.compare(b.getTimestamp(), a.getTimestamp()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    public List<FraudAlert> getUserAlerts(String userId) {
        return fraudAlerts.getOrDefault(userId, Collections.emptyList());
    }
}
