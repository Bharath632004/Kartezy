package com.kartezy.shared.security.fraud;

import java.util.List;
import java.util.Map;

/**
 * A simple rule-based fraud detector.
 */
public class SimpleFraudDetector implements FraudDetector {

    private static final double HIGH_AMOUNT_THRESHOLD = 1000.0; // Example threshold
    private final List<String> blockedIpAddresses;

    public SimpleFraudDetector(List<String> blockedIpAddresses) {
        this.blockedIpAddresses = blockedIpAddresses;
    }

    @Override
    public FraudCheckResult checkFraud(Map<String, Object> context) {
        double score = 0.0;
        StringBuilder reasonBuilder = new StringBuilder();

        // Check for high amount
        Object amountObj = context.get("amount");
        if (amountObj instanceof Number) {
            double amount = ((Number) amountObj).doubleValue();
            if (amount > HIGH_AMOUNT_THRESHOLD) {
                score += 0.4;
                reasonBuilder.append("High transaction amount; ");
            }
        }

        // Check for blocked IP
        Object ipObj = context.get("ipAddress");
        if (ipObj instanceof String) {
            String ip = (String) ipObj;
            if (blockedIpAddresses.contains(ip)) {
                score += 0.5;
                reasonBuilder.append("Blocked IP address; ");
            }
        }

        // Check for mismatched billing and shipping countries
        Object billingCountryObj = context.get("billingCountry");
        Object shippingCountryObj = context.get("shippingCountry");
        if (billingCountryObj instanceof String && shippingCountryObj instanceof String) {
            String billingCountry = (String) billingCountryObj;
            String shippingCountry = (String) shippingCountryObj;
            if (!billingCountry.equalsIgnoreCase(shippingCountry)) {
                score += 0.3;
                reasonBuilder.append("Billing and shipping countries do not match; ");
            }
        }

        // If no reason was added, set a default
        if (reasonBuilder.length() == 0) {
            reasonBuilder.append("No suspicious factors detected");
        }

        boolean fraudulent = score >= 0.5; // Threshold for considering fraudulent
        return new FraudCheckResult(fraudulent, score, reasonBuilder.toString().trim());
    }
}