package com.kartezy.shared.security.api;

import java.util.regex.Pattern;

/**
 * Utility class for API security checks, such as input validation for common attack patterns.
 * <p>
 * Note: Input validation should be performed using allow-lists where possible, and
 * output encoding should be used for preventing XSS. This utility provides basic
 * detection patterns is not a substitute for proper security practices.
 * </p>
 */
public final class ApiSecurityUtils {

    private ApiSecurityUtils() {
        // Prevent instantiation
    }

    // Pattern to detect basic SQL injection attempts (simplified)
    private static final Pattern SQL_INJECTION_PATTERN = Pattern.compile(
            "(\\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC|MERGE|CALL)\\b)",
            Pattern.CASE_INSENSITIVE);

    // Pattern to detect basic XSS attempts (simplified)
    private static final Pattern XSS_PATTERN = Pattern.compile(
            "<script>|</script>|<img|<svg|onerror\\s*=|onload\\s*=|javascript:",
            Pattern.CASE_INSENSITIVE);

    /**
     * Checks if the input contains patterns that may indicate an SQL injection attempt.
     *
     * @param input the input string to check
     * @return true if SQL injection patterns are detected, false otherwise
     */
    public static boolean containsSqlInjectionPattern(String input) {
        if (input == null) {
            return false;
        }
        return SQL_INJECTION_PATTERN.matcher(input).find();
    }

    /**
     * Checks if the input contains patterns that may indicate an XSS attempt.
     *
     * @param input the input string to check
     * @return true if XSS patterns are detected, false otherwise
     */
    public static boolean containsXssPattern(String input) {
        if (input == null) {
            return false;
        }
        return XSS_PATTERN.matcher(input).find();
    }

    /**
     * Sanitizes the input for use in an HTML context by escaping basic HTML entities.
     * <p>
     * Note: This is a very basic escape method. For production, use a dedicated library
     * like OWASP Java HTML Sanitizer or the encoding features of your web framework.
     * </p>
     *
     * @param input the input string to escape
     * @return the escaped string
     */
    public static String escapeHtml(String input) {
        if (input == null) {
            return null;
        }
        return input
                .replace("&", "&")
                .replace("<", "<")
                .replace(">", ">")
                .replace("\"", "&quot;")
                .replace("'", "&#39;")
                .replace("/", "&#x2F;");
    }
}