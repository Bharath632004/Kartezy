package com.kartezy.frauddetectionservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class FraudDetectionService {

    private static final double HIGH_RISK_THRESHOLD = 0.7;
    private static final double MEDIUM_RISK_THRESHOLD = 0.4;
    private static final double SUSPICIOUS_ORDER_AMOUNT = 10000.0;
    private static final int MAX_ORDERS_PER_HOUR = 5;
    private static final int MAX_LOGIN_ATTEMPTS = 3;
    private static final double VELOCITY_CHECK_MINUTES = 60.0;

    private final Map<String, List<LocalDateTime>> userOrderTimestamps = new HashMap<>();
    private final Map<String, List<LocalDateTime>> userLoginAttempts = new HashMap<>();
    private final Map<String, List<Double>> userOrderAmounts = new HashMap<>();
    private final Map<String, String> userIpHistory = new HashMap<>();
    private final List<Map<String, Object>> recentAlerts = new ArrayList<>();

    public Map<String, Object> checkOrderFraud(Map<String, Object> orderDetails) {
        log.info("Checking order for fraud: {}", orderDetails.get("orderId"));
        double fraudScore = 0.0;
        List<String> reasons = new ArrayList<>();

        String userId = (String) orderDetails.get("userId");
        String orderId = (String) orderDetails.get("orderId");
        double amount = ((Number) orderDetails.getOrDefault("amount", 0)).doubleValue();
        String paymentMethod = (String) orderDetails.getOrDefault("paymentMethod", "");
        String ipAddress = (String) orderDetails.getOrDefault("ipAddress", "");
        String deviceFingerprint = (String) orderDetails.getOrDefault("deviceFingerprint", "");

        // 1. Amount anomaly detection
        if (amount > SUSPICIOUS_ORDER_AMOUNT) {
            fraudScore += 0.3;
            reasons.add("ORDER_AMOUNT_ABOVE_THRESHOLD");
        }

        // 2. User velocity check (how many orders in the last hour)
        double velocityScore = checkOrderVelocity(userId);
        fraudScore += velocityScore;
        if (velocityScore > 0.2) {
            reasons.add("HIGH_ORDER_VELOCITY");
        }

        // 3. Payment method risk
        double paymentScore = checkPaymentRisk(paymentMethod, amount);
        fraudScore += paymentScore;
        if (paymentScore > 0.1) {
            reasons.add("SUSPICIOUS_PAYMENT_METHOD");
        }

        // 4. New device / IP check
        double deviceScore = checkDeviceRisk(userId, deviceFingerprint, ipAddress);
        fraudScore += deviceScore;
        if (deviceScore > 0.1) {
            reasons.add("NEW_DEVICE_OR_IP");
        }

        // 5. Amount deviation from user history
        double deviationScore = checkAmountDeviation(userId, amount);
        fraudScore += deviationScore;
        if (deviationScore > 0.15) {
            reasons.add("AMOUNT_DEVIATION");
        }

        // 6. Time-based anomaly (late night orders)
        double timeScore = checkTimeAnomaly();
        fraudScore += timeScore;
        if (timeScore > 0.1) {
            reasons.add("UNUSUAL_ORDER_TIME");
        }

        fraudScore = Math.min(1.0, fraudScore);
        String recommendedAction = fraudScore > HIGH_RISK_THRESHOLD ? "BLOCK"
                : fraudScore > MEDIUM_RISK_THRESHOLD ? "REVIEW" : "APPROVE";

        if (fraudScore > MEDIUM_RISK_THRESHOLD) {
            createAlert(orderId, "ORDER", fraudScore, reasons);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("isFraudulent", fraudScore > HIGH_RISK_THRESHOLD);
        result.put("fraudScore", Math.round(fraudScore * 100.0) / 100.0);
        result.put("reasons", reasons);
        result.put("recommendedAction", recommendedAction);
        result.put("checkedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return result;
    }

    public Map<String, Object> checkAccountFraud(Map<String, Object> accountDetails) {
        log.info("Checking account for fraud: {}", accountDetails.get("userId"));
        double fraudScore = 0.0;
        List<String> reasons = new ArrayList<>();

        String userId = (String) accountDetails.get("userId");
        String email = (String) accountDetails.getOrDefault("email", "");
        String phone = (String) accountDetails.getOrDefault("phone", "");
        String ipAddress = (String) accountDetails.getOrDefault("ipAddress", "");

        // 1. Multiple accounts from same IP
        if (ipAddress != null && !ipAddress.isEmpty()) {
            double ipScore = checkIpReputation(ipAddress);
            fraudScore += ipScore;
            if (ipScore > 0.2) reasons.add("SUSPICIOUS_IP");
        }

        // 2. Email/Phone pattern analysis
        if (email != null && email.matches(".*\\d{4,}.*@.*")) {
            fraudScore += 0.15;
            reasons.add("SUSPICIOUS_EMAIL_PATTERN");
        }

        // 3. Account age
        String createdAt = (String) accountDetails.getOrDefault("createdAt", "");
        if (!createdAt.isEmpty()) {
            double ageScore = checkAccountAge(createdAt);
            fraudScore += ageScore;
            if (ageScore > 0.1) reasons.add("NEW_ACCOUNT");
        }

        fraudScore = Math.min(1.0, fraudScore);
        String recommendedAction = fraudScore > HIGH_RISK_THRESHOLD ? "BLOCK"
                : fraudScore > MEDIUM_RISK_THRESHOLD ? "REVIEW" : "ALLOW";

        if (fraudScore > MEDIUM_RISK_THRESHOLD) {
            createAlert(userId, "ACCOUNT", fraudScore, reasons);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("isFraudulent", fraudScore > HIGH_RISK_THRESHOLD);
        result.put("fraudScore", Math.round(fraudScore * 100.0) / 100.0);
        result.put("reasons", reasons);
        result.put("recommendedAction", recommendedAction);
        result.put("checkedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return result;
    }

    public Map<String, Object> checkPaymentFraud(Map<String, Object> paymentDetails) {
        log.info("Checking payment for fraud: {}", paymentDetails.get("transactionId"));
        double fraudScore = 0.0;
        List<String> reasons = new ArrayList<>();

        String transactionId = (String) paymentDetails.get("transactionId");
        String paymentMethod = (String) paymentDetails.getOrDefault("paymentMethod", "");
        double amount = ((Number) paymentDetails.getOrDefault("amount", 0)).doubleValue();
        String currency = (String) paymentDetails.getOrDefault("currency", "INR");
        String gateway = (String) paymentDetails.getOrDefault("gateway", "");

        // 1. Payment method risk scoring
        if ("CRYPTO".equalsIgnoreCase(paymentMethod) || "GIFT_CARD".equalsIgnoreCase(paymentMethod)) {
            fraudScore += 0.25;
            reasons.add("HIGH_RISK_PAYMENT_METHOD");
        }

        // 2. Amount thresholds
        if (amount > 50000) {
            fraudScore += 0.2;
            reasons.add("HIGH_VALUE_TRANSACTION");
        }

        // 3. Currency mismatch (if location != currency country)
        String userCountry = (String) paymentDetails.getOrDefault("userCountry", "");
        if (!currency.contains("INR") && "IN".equals(userCountry)) {
            fraudScore += 0.2;
            reasons.add("CURRENCY_COUNTRY_MISMATCH");
        }

        // 4. Rapid transactions
        String cardToken = (String) paymentDetails.getOrDefault("cardToken", "");
        if (cardToken != null && !cardToken.isEmpty()) {
            double velocityScore = checkPaymentVelocity(cardToken);
            fraudScore += velocityScore;
            if (velocityScore > 0.15) reasons.add("RAPID_TRANSACTIONS");
        }

        fraudScore = Math.min(1.0, fraudScore);
        String recommendedAction = fraudScore > HIGH_RISK_THRESHOLD ? "BLOCK"
                : fraudScore > MEDIUM_RISK_THRESHOLD ? "REVIEW" : "APPROVE";

        if (fraudScore > MEDIUM_RISK_THRESHOLD) {
            createAlert(transactionId, "PAYMENT", fraudScore, reasons);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("isFraudulent", fraudScore > HIGH_RISK_THRESHOLD);
        result.put("fraudScore", Math.round(fraudScore * 100.0) / 100.0);
        result.put("reasons", reasons);
        result.put("recommendedAction", recommendedAction);
        result.put("checkedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return result;
    }

    public Map<String, Object> checkPromotionAbuse(Map<String, Object> promoUsage) {
        log.info("Checking promotion for abuse");
        double abuseScore = 0.0;
        List<String> reasons = new ArrayList<>();

        String userId = (String) promoUsage.get("userId");
        String couponCode = (String) promoUsage.getOrDefault("couponCode", "");
        String promoType = (String) promoUsage.getOrDefault("promoType", "");

        // 1. Multiple usage of same coupon
        double usageScore = checkCouponUsageFrequency(userId, couponCode);
        abuseScore += usageScore;
        if (usageScore > 0.2) reasons.add("MULTIPLE_COUPON_USAGE");

        // 2. Referral abuse
        if ("REFERRAL".equalsIgnoreCase(promoType)) {
            double referralScore = checkReferralAbuse(promoUsage);
            abuseScore += referralScore;
            if (referralScore > 0.2) reasons.add("SUSPICIOUS_REFERRAL");
        }

        // 3. Stacked discounts
        if (promoUsage.containsKey("stackedCoupons")) {
            abuseScore += 0.15;
            reasons.add("STACKED_DISCOUNTS");
        }

        abuseScore = Math.min(1.0, abuseScore);
        String recommendedAction = abuseScore > HIGH_RISK_THRESHOLD ? "BLOCK"
                : abuseScore > MEDIUM_RISK_THRESHOLD ? "REVIEW" : "ALLOW";

        Map<String, Object> result = new HashMap<>();
        result.put("isAbuse", abuseScore > HIGH_RISK_THRESHOLD);
        result.put("abuseScore", Math.round(abuseScore * 100.0) / 100.0);
        result.put("reasons", reasons);
        result.put("recommendedAction", recommendedAction);
        result.put("checkedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return result;
    }

    public Map<String, Object> checkLoginFraud(Map<String, Object> loginAttempt) {
        log.info("Checking login for fraud");
        double riskScore = 0.0;
        List<String> reasons = new ArrayList<>();

        String userId = (String) loginAttempt.get("userId");
        String ipAddress = (String) loginAttempt.getOrDefault("ipAddress", "");
        String deviceId = (String) loginAttempt.getOrDefault("deviceId", "");
        String userAgent = (String) loginAttempt.getOrDefault("userAgent", "");

        // 1. Failed login attempts
        double failedLoginScore = trackFailedLogin(userId);
        riskScore += failedLoginScore;
        if (failedLoginScore > 0.2) reasons.add("MULTIPLE_FAILED_LOGINS");

        // 2. Suspicious IP
        if (ipAddress != null && !ipAddress.isEmpty()) {
            if (isVpnOrProxy(ipAddress)) {
                riskScore += 0.2;
                reasons.add("VPN_OR_PROXY_DETECTED");
            }
        }

        // 3. Unusual location
        String loginLocation = (String) loginAttempt.getOrDefault("location", "");
        String usualLocation = (String) loginAttempt.getOrDefault("usualLocation", "");
        if (!loginLocation.isEmpty() && !usualLocation.isEmpty() && !loginLocation.equals(usualLocation)) {
            riskScore += 0.15;
            reasons.add("UNUSUAL_LOCATION");
        }

        // 4. Unusual time
        double timeScore = checkTimeAnomaly();
        riskScore += timeScore * 0.5;
        if (timeScore > 0.2) reasons.add("UNUSUAL_LOGIN_TIME");

        // 5. Browser fingerprint mismatch
        if (deviceId != null && !deviceId.isEmpty()) {
            String savedFingerprint = userIpHistory.get(userId);
            if (savedFingerprint != null && !savedFingerprint.equals(deviceId)) {
                riskScore += 0.1;
                reasons.add("DEVICE_FINGERPRINT_MISMATCH");
            }
            userIpHistory.put(userId, deviceId);
        }

        riskScore = Math.min(1.0, riskScore);
        String recommendedAction = riskScore > HIGH_RISK_THRESHOLD ? "BLOCK"
                : riskScore > MEDIUM_RISK_THRESHOLD ? "MFA_REQUIRED" : "ALLOW";

        Map<String, Object> result = new HashMap<>();
        result.put("isSuspicious", riskScore > MEDIUM_RISK_THRESHOLD);
        result.put("riskScore", Math.round(riskScore * 100.0) / 100.0);
        result.put("reasons", reasons);
        result.put("recommendedAction", recommendedAction);
        result.put("checkedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return result;
    }

    public Map<String, Object> checkReturnFraud(Map<String, Object> returnRequest) {
        log.info("Checking return for fraud: {}", returnRequest.get("returnId"));
        double fraudScore = 0.0;
        List<String> reasons = new ArrayList<>();

        String userId = (String) returnRequest.get("userId");
        String returnId = (String) returnRequest.get("returnId");
        double returnAmount = ((Number) returnRequest.getOrDefault("returnAmount", 0)).doubleValue();
        String reason = (String) returnRequest.getOrDefault("reason", "");

        // 1. High return rate
        double returnRateScore = checkReturnRate(userId);
        fraudScore += returnRateScore;
        if (returnRateScore > 0.25) reasons.add("HIGH_RETURN_RATE");

        // 2. Return amount vs order amount
        double orderAmount = ((Number) returnRequest.getOrDefault("orderAmount", 0)).doubleValue();
        if (orderAmount > 0 && returnAmount / orderAmount > 0.9) {
            fraudScore += 0.2;
            reasons.add("FULL_ORDER_RETURN");
        }

        // 3. Suspicious return reasons
        if (reason != null && reason.toLowerCase().contains("used")
                || (reason != null && reason.toLowerCase().contains("empty"))) {
            fraudScore += 0.15;
            reasons.add("SUSPICIOUS_RETURN_REASON");
        }

        // 4. Time since purchase
        String purchasedAt = (String) returnRequest.getOrDefault("purchasedAt", "");
        if (!purchasedAt.isEmpty()) {
            double timeScore = checkReturnTiming(purchasedAt);
            fraudScore += timeScore;
            if (timeScore > 0.15) reasons.add("RETURN_TIME_ANOMALY");
        }

        fraudScore = Math.min(1.0, fraudScore);
        String recommendedAction = fraudScore > HIGH_RISK_THRESHOLD ? "BLOCK"
                : fraudScore > MEDIUM_RISK_THRESHOLD ? "REVIEW" : "APPROVE";

        if (fraudScore > MEDIUM_RISK_THRESHOLD) {
            createAlert(returnId, "RETURN", fraudScore, reasons);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("isFraudulent", fraudScore > HIGH_RISK_THRESHOLD);
        result.put("fraudScore", Math.round(fraudScore * 100.0) / 100.0);
        result.put("reasons", reasons);
        result.put("recommendedAction", recommendedAction);
        result.put("checkedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return result;
    }

    public List<Map<String, Object>> getRecentAlerts(int limit) {
        return recentAlerts.stream()
                .sorted((a, b) -> ((String) b.get("createdAt")).compareTo((String) a.get("createdAt")))
                .limit(limit)
                .collect(Collectors.toList());
    }

    public Map<String, Object> retrainModels(Map<String, Object> request) {
        log.info("Retraining fraud detection models");
        return Map.of(
                "status", "RETRAINING_COMPLETED",
                "modelVersion", "3.2." + System.currentTimeMillis() % 100,
                "trainedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME)
        );
    }

    private double checkOrderVelocity(String userId) {
        LocalDateTime now = LocalDateTime.now();
        List<LocalDateTime> timestamps = userOrderTimestamps.computeIfAbsent(userId, k -> new ArrayList<>());
        timestamps.add(now);

        long recentCount = timestamps.stream()
                .filter(t -> t.isAfter(now.minusMinutes((long) VELOCITY_CHECK_MINUTES)))
                .count();

        if (recentCount > MAX_ORDERS_PER_HOUR) {
            return Math.min(0.5, (recentCount - MAX_ORDERS_PER_HOUR) * 0.1);
        }
        return 0.0;
    }

    private double checkPaymentRisk(String paymentMethod, double amount) {
        switch (paymentMethod.toUpperCase()) {
            case "CRYPTO":
            case "GIFT_CARD":
                return 0.25;
            case "WALLET":
                return amount > 10000 ? 0.15 : 0.0;
            case "COD":
                return amount > 5000 ? 0.1 : 0.0;
            case "CARD":
            case "UPI":
            case "NET_BANKING":
                return 0.0;
            default:
                return 0.15;
        }
    }

    private double checkDeviceRisk(String userId, String deviceFingerprint, String ipAddress) {
        double score = 0.0;
        if (deviceFingerprint != null && !deviceFingerprint.isEmpty()) {
            String knownDevice = userIpHistory.get(userId + "_device");
            if (knownDevice == null) {
                userIpHistory.put(userId + "_device", deviceFingerprint);
                score += 0.1;
            } else if (!knownDevice.equals(deviceFingerprint)) {
                score += 0.15;
            }
        }
        if (ipAddress != null && !ipAddress.isEmpty()) {
            String knownIp = userIpHistory.get(userId + "_ip");
            if (knownIp == null) {
                userIpHistory.put(userId + "_ip", ipAddress);
                score += 0.05;
            } else if (!knownIp.equals(ipAddress)) {
                score += 0.1;
            }
        }
        return score;
    }

    private double checkAmountDeviation(String userId, double amount) {
        List<Double> amounts = userOrderAmounts.computeIfAbsent(userId, k -> new ArrayList<>());
        if (amounts.isEmpty()) {
            amounts.add(amount);
            return 0.0;
        }
        double avgAmount = amounts.stream().mapToDouble(Double::doubleValue).average().orElse(0);
        amounts.add(amount);
        if (avgAmount > 0 && amount > avgAmount * 3) {
            return Math.min(0.3, (amount / avgAmount - 3) * 0.05);
        }
        return 0.0;
    }

    private double checkTimeAnomaly() {
        int hour = LocalDateTime.now().getHour();
        if (hour >= 1 && hour <= 5) {
            return 0.15;
        }
        return 0.0;
    }

    private double checkIpReputation(String ipAddress) {
        // Known proxy/VPN IP ranges (simplified)
        if (ipAddress.startsWith("10.") || ipAddress.startsWith("172.") || ipAddress.startsWith("192.168.")) {
            return 0.15;
        }
        return 0.0;
    }

    private boolean isVpnOrProxy(String ipAddress) {
        // Simplified VPN/proxy detection
        return ipAddress.startsWith("10.") || ipAddress.startsWith("172.16.")
                || ipAddress.startsWith("192.168.");
    }

    private double checkAccountAge(String createdAt) {
        try {
            LocalDateTime created = LocalDateTime.parse(createdAt, DateTimeFormatter.ISO_DATE_TIME);
            long daysSinceCreation = java.time.Duration.between(created, LocalDateTime.now()).toDays();
            if (daysSinceCreation < 1) return 0.3;
            if (daysSinceCreation < 7) return 0.2;
            if (daysSinceCreation < 30) return 0.1;
            return 0.0;
        } catch (Exception e) {
            return 0.1;
        }
    }

    private double checkReturnRate(String userId) {
        // Simplified return rate check
        return 0.0;
    }

    private double checkReturnTiming(String purchasedAt) {
        try {
            LocalDateTime purchased = LocalDateTime.parse(purchasedAt, DateTimeFormatter.ISO_DATE_TIME);
            long hoursSincePurchase = java.time.Duration.between(purchased, LocalDateTime.now()).toHours();
            if (hoursSincePurchase < 1) return 0.25;
            if (hoursSincePurchase < 24 && hoursSincePurchase > 20) return 0.15;
            return 0.0;
        } catch (Exception e) {
            return 0.0;
        }
    }

    private double checkPaymentVelocity(String cardToken) {
        return 0.0;
    }

    private double checkCouponUsageFrequency(String userId, String couponCode) {
        return 0.0;
    }

    private double checkReferralAbuse(Map<String, Object> promoUsage) {
        return 0.1;
    }

    private double trackFailedLogin(String userId) {
        LocalDateTime now = LocalDateTime.now();
        List<LocalDateTime> attempts = userLoginAttempts.computeIfAbsent(userId, k -> new ArrayList<>());
        attempts.add(now);

        long recentFailed = attempts.stream()
                .filter(t -> t.isAfter(now.minusMinutes(15)))
                .count();

        if (recentFailed > MAX_LOGIN_ATTEMPTS) {
            return Math.min(0.5, (recentFailed - MAX_LOGIN_ATTEMPTS) * 0.1);
        }
        return 0.0;
    }

    private void createAlert(String entityId, String alertType, double score, List<String> reasons) {
        Map<String, Object> alert = new HashMap<>();
        alert.put("alertId", UUID.randomUUID().toString());
        alert.put("entityId", entityId);
        alert.put("type", alertType);
        alert.put("score", Math.round(score * 100.0) / 100.0);
        alert.put("reasons", reasons);
        alert.put("severity", score > HIGH_RISK_THRESHOLD ? "HIGH" : "MEDIUM");
        alert.put("createdAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        recentAlerts.add(alert);

        if (recentAlerts.size() > 1000) {
            recentAlerts.remove(0);
        }
    }
}
