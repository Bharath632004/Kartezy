package com.kartezy.fraudservice.service;

import com.kartezy.fraudservice.entity.FraudEvent;
import com.kartezy.fraudservice.repository.FraudEventRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.*;

/**
 * Enterprise fraud detection service.
 * <p>
 * Detects:
 * - Fake accounts / multiple accounts from same device/IP
 * - Impossible travel (logins from geographically distant locations in short time)
 * - Bot traffic (rapid automated requests)
 * - Coupon/promotion abuse
 * - Wallet abuse (rapid transactions)
 * - Payment fraud (suspicious patterns)
 * - Merchant fraud (fake orders, fake reviews)
 * - Delivery fraud (fake deliveries)
 * - Suspicious order patterns
 * </p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FraudDetectionService {

    private final FraudEventRepository fraudEventRepository;

    // Configuration thresholds
    private static final int MAX_ACCOUNTS_PER_DEVICE = 3;
    private static final int MAX_ACCOUNTS_PER_IP = 5;
    private static final double IMPOSSIBLE_TRAVEL_SPEED_KMH = 900.0; // Max realistic travel speed
    private static final int MAX_LOGIN_ATTEMPTS_PER_MINUTE = 10;
    private static final int MAX_COUPON_REDEMPTIONS_PER_USER = 3;
    private static final int MAX_WALLET_TRANSACTIONS_PER_HOUR = 10;
    private static final int SUSPICIOUS_ORDER_AMOUNT_THRESHOLD = 50000; // ₹50,000

    /**
     * Analyzes a login event for fraud indicators.
     *
     * @return RiskAssessment with score (0-100) and reasons
     */
    public RiskAssessment analyzeLogin(String userId, String ipAddress, String deviceFingerprint,
                                        double latitude, double longitude, String userAgent) {
        int score = 0;
        List<String> reasons = new ArrayList<>();
        Instant now = Instant.now();

        // Check for multiple accounts from same device
        if (deviceFingerprint != null) {
            long accountsOnDevice = fraudEventRepository.countDistinctUsersByDeviceFingerprint(deviceFingerprint);
            if (accountsOnDevice >= MAX_ACCOUNTS_PER_DEVICE) {
                score += 30;
                reasons.add("Multiple accounts from same device: " + accountsOnDevice);
            }
        }

        // Check for multiple accounts from same IP
        if (ipAddress != null) {
            long accountsFromIp = fraudEventRepository.countDistinctUsersByIpAddress(ipAddress);
            if (accountsFromIp >= MAX_ACCOUNTS_PER_IP) {
                score += 25;
                reasons.add("Multiple accounts from same IP: " + accountsFromIp);
            }
        }

        // Check for rapid login attempts
        if (userId != null) {
            long recentLogins = fraudEventRepository.countRecentEventsByUser(
                    userId, "LOGIN", now.minusSeconds(60));
            if (recentLogins > MAX_LOGIN_ATTEMPTS_PER_MINUTE) {
                score += 20;
                reasons.add("Rapid login attempts: " + recentLogins + " in 1 minute");
            }
        }

        return new RiskAssessment(Math.min(score, 100), reasons, score >= 50);
    }

    /**
     * Detects impossible travel - user logging in from geographically
     * distant locations within an unrealistic time frame.
     */
    public Optional<RiskAssessment> detectImpossibleTravel(String userId,
                                                            double newLat, double newLng,
                                                            Instant currentTime) {
        // Get the most recent login location for this user
        Optional<FraudEvent> lastLogin = fraudEventRepository
                .findTopByUserIdAndEventTypeOrderByTimestampDesc(userId, "LOGIN");

        if (lastLogin.isEmpty()) {
            return Optional.empty();
        }

        FraudEvent previous = lastLogin.get();
        Double prevLat = previous.getLatitude();
        Double prevLng = previous.getLongitude();

        if (prevLat == null || prevLng == null) {
            return Optional.empty();
        }

        // Calculate distance between locations (Haversine formula)
        double distance = haversineDistance(prevLat, prevLng, newLat, newLng);

        // If distance is significant (>50km), calculate required travel time
        if (distance > 50) {
            long timeDiffSeconds = Duration.between(previous.getTimestamp(), currentTime).getSeconds();
            if (timeDiffSeconds > 0) {
                double speedKmph = (distance / timeDiffSeconds) * 3600;

                if (speedKmph > IMPOSSIBLE_TRAVEL_SPEED_KMH) {
                    int score = Math.min((int) (speedKmph / 10), 90);
                    String reason = String.format(
                            "Impossible travel: %.0f km in %d min (%.0f km/h)",
                            distance, timeDiffSeconds / 60, speedKmph);

                    log.warn("Impossible travel detected for user {}: {}", userId, reason);
                    return Optional.of(new RiskAssessment(score, List.of(reason), true));
                }
            }
        }

        return Optional.empty();
    }

    /**
     * Analyzes an order for fraud indicators.
     */
    public RiskAssessment analyzeOrder(String userId, double orderAmount,
                                        String couponCode, String paymentMethod,
                                        String shippingAddress, boolean isNewUser) {
        int score = 0;
        List<String> reasons = new ArrayList<>();

        // High-value order from new user
        if (isNewUser && orderAmount > SUSPICIOUS_ORDER_AMOUNT_THRESHOLD) {
            score += 40;
            reasons.add("High-value order from new user: ₹" + orderAmount);
        }

        // Unusual payment method
        if (paymentMethod != null && paymentMethod.equals("COD") && orderAmount > 10000) {
            score += 20;
            reasons.add("High-value COD order: ₹" + orderAmount);
        }

        // Check coupon abuse
        if (couponCode != null) {
            long userCoupons = fraudEventRepository.countRecentEventsByUserAndType(
                    userId, "COUPON_REDEMPTION", Instant.now().minusSeconds(86400));
            if (userCoupons > MAX_COUPON_REDEMPTIONS_PER_USER) {
                score += 25;
                reasons.add("Excessive coupon redemptions: " + userCoupons + " in 24h");
            }
        }

        return new RiskAssessment(Math.min(score, 100), reasons, score >= 50);
    }

    /**
     * Analyzes wallet transactions for abuse.
     */
    public RiskAssessment analyzeWalletTransaction(String userId, double amount, String type) {
        int score = 0;
        List<String> reasons = new ArrayList<>();

        // Rapid transactions
        long recentTransactions = fraudEventRepository.countRecentEventsByUserAndType(
                userId, "WALLET_" + type, Instant.now().minusSeconds(3600));
        if (recentTransactions > MAX_WALLET_TRANSACTIONS_PER_HOUR) {
            score += 30;
            reasons.add("Rapid wallet transactions: " + recentTransactions + " in 1 hour");
        }

        // Unusually large transaction
        if (amount > 100000) {
            score += 20;
            reasons.add("Large wallet transaction: ₹" + amount);
        }

        return new RiskAssessment(Math.min(score, 100), reasons, score >= 50);
    }

    /**
     * Records a fraud event for analysis.
     */
    @Transactional
    public FraudEvent recordEvent(FraudEvent event) {
        event.setId(UUID.randomUUID());
        event.setTimestamp(Instant.now());

        // Calculate risk score
        int riskScore = calculateRiskScore(event);
        event.setRiskScore(riskScore);
        event.setActionRequired(riskScore >= 70);

        FraudEvent saved = fraudEventRepository.save(event);

        if (riskScore >= 70) {
            log.warn("High-risk fraud event: {} for user {} (score: {})",
                    event.getEventType(), event.getUserId(), riskScore);
        }

        return saved;
    }

    /**
     * Gets recent suspicious activity for a user.
     */
    public List<FraudEvent> getSuspiciousActivity(String userId) {
        return fraudEventRepository.findByUserIdAndRiskScoreGreaterThanEqualOrderByTimestampDesc(
                userId, 50);
    }

    /**
     * Gets all recent high-risk events for admin review.
     */
    public List<FraudEvent> getHighRiskEvents() {
        return fraudEventRepository.findByActionRequiredTrueOrderByTimestampDesc();
    }

    private int calculateRiskScore(FraudEvent event) {
        int score = 0;

        switch (event.getEventType()) {
            case "FAKE_ACCOUNT" -> score = 85;
            case "PAYMENT_FRAUD" -> score = 90;
            case "MERCHANT_FRAUD" -> score = 80;
            case "DELIVERY_FRAUD" -> score = 75;
            case "COUPON_ABUSE" -> score = 60;
            case "WALLET_ABUSE" -> score = 65;
            case "SUSPICIOUS_ORDER" -> score = 55;
            case "BOT_TRAFFIC" -> score = 70;
            case "LOGIN" -> {
                // Score from context
                if (event.getRiskScore() > 0) score = event.getRiskScore();
            }
            default -> score = 30;
        }

        return Math.min(score, 100);
    }

    /**
     * Haversine formula to calculate distance between two GPS coordinates in km.
     */
    private double haversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371; // Earth radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // ======== Data Models ========

    public static class RiskAssessment {
        private final int riskScore;
        private final List<String> reasons;
        private final boolean suspicious;

        public RiskAssessment(int riskScore, List<String> reasons, boolean suspicious) {
            this.riskScore = riskScore;
            this.reasons = Collections.unmodifiableList(reasons);
            this.suspicious = suspicious;
        }

        public int getRiskScore() { return riskScore; }
        public List<String> getReasons() { return reasons; }
        public boolean isSuspicious() { return suspicious; }
    }
}
