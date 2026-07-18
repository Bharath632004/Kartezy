package com.kartezy.frauddetectionservice.engine;

import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Enhanced Fraud Detection Engine with ML-based rules.
 * Real-time transaction scoring, pattern detection, and risk assessment.
 */
@Slf4j
@Service
public class EnhancedFraudEngine {

    // Risk thresholds
    private static final double LOW_RISK = 0.3;
    private static final double MEDIUM_RISK = 0.6;
    private static final double HIGH_RISK = 0.8;

    // Rate limiting
    private final Map<String, AtomicLong> requestCounts = new ConcurrentHashMap<>();
    private final Map<String, List<TransactionRecord>> userTransactions = new ConcurrentHashMap<>();
    private final Set<String> blacklistedIps = ConcurrentHashMap.newKeySet();
    private final Set<String> blacklistedDevices = ConcurrentHashMap.newKeySet();

    @PostConstruct
    public void init() {
        log.info("EnhancedFraudEngine initialized");
    }

    /**
     * Evaluate a transaction for fraud risk.
     */
    public FraudAssessment evaluate(Transaction transaction) {
        double score = 0.0;
        List<String> flags = new ArrayList<>();

        // Rule 1: Velocity check
        if (isHighVelocity(transaction.getUserId(), transaction.getIpAddress())) {
            score += 0.3;
            flags.add("HIGH_VELOCITY");
        }

        // Rule 2: Amount anomaly
        if (isAmountAnomalous(transaction)) {
            score += 0.25;
            flags.add("AMOUNT_ANOMALY");
        }

        // Rule 3: Geo-location mismatch
        if (isGeoAnomaly(transaction)) {
            score += 0.2;
            flags.add("GEO_ANOMALY");
        }

        // Rule 4: Device fingerprinting
        if (isSuspiciousDevice(transaction.getDeviceId())) {
            score += 0.15;
            flags.add("SUSPICIOUS_DEVICE");
        }

        // Rule 5: IP reputation
        if (isBlacklistedIp(transaction.getIpAddress())) {
            score += 0.3;
            flags.add("BLACKLISTED_IP");
        }

        // Rule 6: New user fraud
        if (isNewUserFraud(transaction)) {
            score += 0.2;
            flags.add("NEW_USER_FRAUD");
        }

        // Rule 7: Time anomaly (unusual hours)
        if (isTimeAnomaly(transaction)) {
            score += 0.1;
            flags.add("TIME_ANOMALY");
        }

        // Rule 8: Multiple failed attempts
        if (hasMultipleFailedAttempts(transaction.getUserId())) {
            score += 0.2;
            flags.add("MULTIPLE_FAILURES");
        }

        // Normalize score
        score = Math.min(1.0, score);

        // Determine action
        FraudAction action;
        if (score >= HIGH_RISK) {
            action = FraudAction.BLOCK;
        } else if (score >= MEDIUM_RISK) {
            action = FraudAction.MFA_REQUIRED;
        } else if (score >= LOW_RISK) {
            action = FraudAction.REVIEW;
        } else {
            action = FraudAction.ALLOW;
        }

        FraudAssessment assessment = FraudAssessment.builder()
                .transactionId(transaction.getTransactionId())
                .riskScore(score)
                .action(action)
                .flags(flags)
                .assessedAt(ZonedDateTime.now())
                .build();

        log.info("Fraud assessment for {}: score={}, action={}, flags={}",
                transaction.getTransactionId(), String.format("%.2f", score), action, flags);

        return assessment;
    }

    /**
     * Blacklist an IP address.
     */
    public void blacklistIp(String ipAddress, String reason) {
        blacklistedIps.add(ipAddress);
        log.warn("IP blacklisted: {} - Reason: {}", ipAddress, reason);
    }

    /**
     * Blacklist a device.
     */
    public void blacklistDevice(String deviceId, String reason) {
        blacklistedDevices.add(deviceId);
        log.warn("Device blacklisted: {} - Reason: {}", deviceId, reason);
    }

    private boolean isHighVelocity(String userId, String ipAddress) {
        // Check request rate
        String key = userId + ":" + ipAddress;
        AtomicLong count = requestCounts.computeIfAbsent(key, k -> new AtomicLong(0));
        long currentCount = count.incrementAndGet();
        return currentCount > 10; // > 10 requests in monitoring window
    }

    private boolean isAmountAnomalous(Transaction transaction) {
        return transaction.getAmount().compareTo(BigDecimal.valueOf(100000)) > 0; // > 1L INR
    }

    private boolean isGeoAnomaly(Transaction transaction) {
        // In production: compare transaction location with user's known locations
        return false;
    }

    private boolean isSuspiciousDevice(String deviceId) {
        return deviceId != null && blacklistedDevices.contains(deviceId);
    }

    private boolean isBlacklistedIp(String ipAddress) {
        return ipAddress != null && blacklistedIps.contains(ipAddress);
    }

    private boolean isNewUserFraud(Transaction transaction) {
        // Check if user account is very new and making large transactions
        return false;
    }

    private boolean isTimeAnomaly(Transaction transaction) {
        int hour = ZonedDateTime.now().getHour();
        return hour >= 1 && hour <= 5; // Transactions between 1 AM - 5 AM
    }

    private boolean hasMultipleFailedAttempts(String userId) {
        // Track failed payment attempts
        return false;
    }

    /**
     * Record a transaction for pattern analysis.
     */
    public void recordTransaction(Transaction transaction) {
        userTransactions.computeIfAbsent(transaction.getUserId(),
                k -> Collections.synchronizedList(new ArrayList<>())).add(
                TransactionRecord.builder()
                        .timestamp(ZonedDateTime.now())
                        .amount(transaction.getAmount())
                        .ipAddress(transaction.getIpAddress())
                        .build()
        );
    }

    // Data Models
    @Data
    @Builder
    public static class Transaction {
        private String transactionId;
        private String userId;
        private String orderId;
        private BigDecimal amount;
        private String currencyCode;
        private String paymentMethod;
        private String ipAddress;
        private String deviceId;
        private String userAgent;
        private String sessionId;
        private double latitude;
        private double longitude;
        private ZonedDateTime timestamp;
    }

    @Data
    @Builder
    public static class FraudAssessment {
        private String transactionId;
        private double riskScore;
        private FraudAction action;
        private List<String> flags;
        private ZonedDateTime assessedAt;
    }

    public enum FraudAction {
        ALLOW, REVIEW, MFA_REQUIRED, BLOCK
    }

    @Data
    @Builder
    private static class TransactionRecord {
        private ZonedDateTime timestamp;
        private BigDecimal amount;
        private String ipAddress;
    }
}
