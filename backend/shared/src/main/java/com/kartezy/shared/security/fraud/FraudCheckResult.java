package com.kartezy.shared.security.fraud;

import java.util.Map;

/**
 * Result of a fraud check.
 */
public class FraudCheckResult {

    private final boolean fraudulent;
    private final double score; // 0.0 to 1.0, where 1.0 is definitely fraudulent
    private final String reason;

    public FraudCheckResult(boolean fraudulent, double score, String reason) {
        this.fraudulent = fraudulent;
        this.score = score;
        this.reason = reason;
    }

    public boolean isFraudulent() {
        return fraudulent;
    }

    public double getScore() {
        return score;
    }

    public String getReason() {
        return reason;
    }
}