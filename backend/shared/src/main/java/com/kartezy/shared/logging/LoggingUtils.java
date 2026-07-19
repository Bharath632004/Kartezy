package com.kartezy.shared.logging;

import org.slf4j.MDC;

/**
 * Utility class for logging operations, particularly for handling correlation IDs.
 */
public class LoggingUtils {
    public static final String CORRELATION_ID_HEADER = "X-Correlation-ID";
    public static final String CORRELATION_ID_MDC_KEY = "correlationId";
    private LoggingUtils() {}
    public static void putCorrelationId(String correlationId) {
        if (correlationId != null && !correlationId.isEmpty()) {
            MDC.put(CORRELATION_ID_MDC_KEY, correlationId);
        }
    }
    public static void clearCorrelationId() {
        MDC.remove(CORRELATION_ID_MDC_KEY);
    }
    public static String getCorrelationId() {
        return MDC.get(CORRELATION_ID_MDC_KEY);
    }
}