package com.kartezy.shared.security.fraud;

import java.util.Map;

/**
 * Interface for detecting fraudulent activities.
 */
public interface FraudDetector {

    /**
     * Checks if the given transaction or event is potentially fraudulent.
     *
     * @param context a map of contextual information (e.g., transaction amount, user ID, IP address, etc.)
     * @return a FraudCheckResult indicating the result of the fraud check
     */
    FraudCheckResult checkFraud(Map<String, Object> context);
}