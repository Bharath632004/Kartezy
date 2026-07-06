package com.kartezy.shared.logging;

import org.slf4j.MDC;

/**
 * Utility class for logging operations, particularly for handling correlation IDs.
 */
public class LoggingUtils {

    public static final String CORRELATION_ID_HEADER = "X-Correlation-ID";
    public static final String CORRELATION_ID_MDC_KEY = "correlationId";

    private LoggingUtils() {
        // Prevent instantiation
    }

    /**
     * Puts the correlation ID in the MDC (Mapped Diagnostic Context) for logging.
     *
     * @param correlationId the correlation ID to put in MDC
     */
    public static void putCorrelationId(String correlationId) {
        if (correlationId != null && !correlationId.isEmpty()) {
            MDC.put(CORRELATION_ID_MDC_KEY, correlationId);
        }
    }

    /**
     * Clears the correlation ID from the MDC.
     */
    public static void clearCorrelationId() {
        MDC.remove(CORRELATION_ID_MDC_KEY);
    }

    /**
     * Gets the correlation ID from the MDC.
     *
     * @return the correlation ID, or null if not present
     */
    public static String getCorrelationId() {
        return MDC.get(CORRELATION_ID_MDC_KEY);
    }
}