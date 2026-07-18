package com.kartezy.shared.security.api;

import java.util.regex.Pattern;

/**
 * Utility class for protecting against OWASP Top 10 vulnerabilities.
 * <p>
 * Provides methods to detect and prevent common web application security risks
 * as defined by the OWASP Top 10 (2021).
 * </p>
 */
public final class OwaspTop10Protector {

    private OwaspTop10Protector() {
        // Prevent instantiation
    }

    // A1: Broken Access Control
    // Note: Access control is primarily enforced at the framework level (Spring Security)
    // This class focuses on input validation and output encoding

    // A2: Cryptographic Failures
    // Note: Cryptography is handled by dedicated encryption services

    // A3: Injection
    private static final Pattern SQL_INJECTION_PATTERN = Pattern.compile(
            "(\\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC|MERGE|CALL)\\b)",
            Pattern.CASE_INSENSITIVE);

    private static final Pattern NOSQL_INJECTION_PATTERN = Pattern.compile(
            "[$]where|[$]regex|[$]elemMatch|[$]gte|[$]lte|[$]ne|[$]in|[$]nin",
            Pattern.CASE_INSENSITIVE);

    private static final Pattern LDAP_INJECTION_PATTERN = Pattern.compile(
            "[*()\\\\]|\\%(28|29|2a|5c)",
            Pattern.CASE_INSENSITIVE);

    private static final Pattern OS_COMMAND_INJECTION_PATTERN = Pattern.compile(
            "(;\\s*(rm|del|format|fdisk|shutdown|reboot|wget|curl|nc|netcat|bash|sh|cmd|powershell)|\\|\\s*|&&\\s*|\\|\\|\\s*)",
            Pattern.CASE_INSENSITIVE);

    // A3: Injection (continued)
    private static final Pattern XPATH_INJECTION_PATTERN = Pattern.compile(
            "(/|\\\\|\\.\\.|::|\\[|\\]|=|!=|<|>|\\[@|\\])+",
            Pattern.CASE_INSENSITIVE);

    private static final Pattern XQUERY_INJECTION_PATTERN = Pattern.compile(
            "(\\b(FOR|LET|WHERE|ORDER BY|RETURN)\\b)",
            Pattern.CASE_INSENSITIVE);

    // A3: Injection (continued) - HTML/JavaScript
    private static final Pattern XSS_PATTERN = Pattern.compile(
            "<script>|</script>|<img|<svg|onerror\\s*=|onload\\s*=|onclick\\s*=|onmouseover\\s*=|javascript:|data:|vbscript:|expression\\s*\\(|alert\\s*\\(|confirm\\s*\\(|prompt\\s*\\(|eval\\s*\\(|setTimeout\\s*\\(|setInterval\\s*\\(|Function\\s*\\(|\\\\x[0-9a-f]{2}|\\\\u[0-9a-f]{4}",
            Pattern.CASE_INSENSITIVE);

    // A3: Injection (continued) - XML
    private static final Pattern XML_INJECTION_PATTERN = Pattern.compile(
            "<!DOCTYPE|<\\?xml|<\\!\\%\\[CDATA\\[|<\\!\\%|=|<|>|&",
            Pattern.CASE_INSENSITIVE);

    // A3: Injection (continued) - Header Injection
    private static final Pattern HEADER_INJECTION_PATTERN = Pattern.compile(
            "(%0A|%0D|\\r|\\n)",
            Pattern.CASE_INSENSITIVE);

    // A4: Insecure Design
    // Note: This is primarily addressed during design and architecture phases

    // A5: Security Misconfiguration
    // Note: This is addressed through proper configuration and hardening

    // A6: Vulnerable and Outdated Components
    // Note: This is addressed through dependency scanning and updates

    // A7: Identification and Authentication Failures
    // Note: This is handled by authentication and session management systems

    // A8: Software and Data Integrity Failures
    private static final Pattern DESERIALIZATION_PATTERN = Pattern.compile(
            "(rO0|AB ED|AC ED|\\{null\\}|java\\.util\\.|java\\.lang\\.|javax\\.|org\\.apache\\.|com\\.(sun|ibm|oracle)\\.)",
            Pattern.CASE_INSENSITIVE);

    // A9: Security Logging and Monitoring Failures
    // Note: This is handled by the audit logging system

    // A10: Server-Side Request Forgery (SSRF)
    private static final Pattern SSRF_PATTERN = Pattern.compile(
            "(localhost|127\\.|0\\.0\\.0\\.0|\\[::1\\]|0:0:0:0:0:0:0:1|[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3})",
            Pattern.CASE_INSENSITIVE);

    /**
     * Checks if the input contains patterns that may indicate SQL injection.
     *
     * @param input the input string to check
     * @return true if SQL injection patterns are detected, false otherwise
     */
    public static boolean containsSqlInjection(String input) {
        if (input == null) {
            return false;
        }
        return SQL_INJECTION_PATTERN.matcher(input).find();
    }

    /**
     * Checks if the input contains patterns that may indicate NoSQL injection.
     *
     * @param input the input string to check
     * @return true if NoSQL injection patterns are detected, false otherwise
     */
    public static boolean containsNosqlInjection(String input) {
        if (input == null) {
            return false;
        }
        return NOSQL_INJECTION_PATTERN.matcher(input).find();
    }

    /**
     * Checks if the input contains patterns that may indicate LDAP injection.
     *
     * @param input the input string to check
     * @return true if LDAP injection patterns are detected, false otherwise
     */
    public static boolean containsLdapInjection(String input) {
        if (input == null) {
            return false;
        }
        return LDAP_INJECTION_PATTERN.matcher(input).find();
    }

    /**
     * Checks if the input contains patterns that may indicate OS command injection.
     *
     * @param input the input string to check
     * @return true if OS command injection patterns are detected, false otherwise
     */
    public static boolean containsOsCommandInjection(String input) {
        if (input == null) {
            return false;
        }
        return OS_COMMAND_INJECTION_PATTERN.matcher(input).find();
    }

    /**
     * Checks if the input contains patterns that may indicate XPath injection.
     *
     * @param input the input string to check
     * @return true if XPath injection patterns are detected, false otherwise
     */
    public static boolean containsXpathInjection(String input) {
        if (input == null) {
            return false;
        }
        return XPATH_INJECTION_PATTERN.matcher(input).find();
    }

    /**
     * Checks if the input contains patterns that may indicate XQuery injection.
     *
     * @param input the input string to check
     * @return true if XQuery injection patterns are detected, false otherwise
     */
    public static boolean containsXqueryInjection(String input) {
        if (input == null) {
            return false;
        }
        return XQUERY_INJECTION_PATTERN.matcher(input).find();
    }

    /**
     * Checks if the input contains patterns that may indicate Cross-Site Scripting (XSS).
     *
     * @param input the input string to check
     * @return true if XSS patterns are detected, false otherwise
     */
    public static boolean containsXss(String input) {
        if (input == null) {
            return false;
        }
        return XSS_PATTERN.matcher(input).find();
    }

    /**
     * Checks if the input contains patterns that may indicate XML injection.
     *
     * @param input the input string to check
     * @return true if XML injection patterns are detected, false otherwise
     */
    public static boolean containsXmlInjection(String input) {
        if (input == null) {
            return false;
        }
        return XML_INJECTION_PATTERN.matcher(input).find();
    }

    /**
     * Checks if the input contains patterns that may indicate header injection.
     *
     * @param input the input string to check
     * @return true if header injection patterns are detected, false otherwise
     */
    public static boolean containsHeaderInjection(String input) {
        if (input == null) {
            return false;
        }
        return HEADER_INJECTION_PATTERN.matcher(input).find();
    }

    /**
     * Checks if the input contains patterns that may indicate insecure deserialization.
     *
     * @param input the input string to check
     * @return true if deserialization patterns are detected, false otherwise
     */
    public static boolean containsDeserialization(String input) {
        if (input == null) {
            return false;
        }
        return DESERIALIZATION_PATTERN.matcher(input).find();
    }

    /**
     * Checks if the input contains patterns that may indicate Server-Side Request Forgery (SSRF).
     *
     * @param input the input string to check
     * @return true if SSRF patterns are detected, false otherwise
     */
    public static boolean containsSsrf(String input) {
        if (input == null) {
            return false;
        }
        return SSRF_PATTERN.matcher(input).find();
    }

    /**
     * Checks if the input contains any injection patterns.
     *
     * @param input the input string to check
     * @return true if any injection patterns are detected, false otherwise
     */
    public static boolean containsInjection(String input) {
        if (input == null) {
            return false;
        }
        return containsSqlInjection(input) ||
                containsNosqlInjection(input) ||
                containsLdapInjection(input) ||
                containsOsCommandInjection(input) ||
                containsXpathInjection(input) ||
                containsXqueryInjection(input) ||
                containsXss(input) ||
                containsXmlInjection(input);
    }

    /**
     * Sanitizes the input for use in an HTML context by escaping HTML entities.
     * <p>
     * Note: This is a basic escape method. For production, use a dedicated library
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
                .replace("\"", """)
                .replace("'", "'")
                .replace("/", "&#x2F;");
    }

    /**
     * Sanitizes the input for use in a JavaScript string context by escaping
     * characters that have special meaning in JavaScript.
     *
     * @param input the input string to escape
     * @return the escaped string
     */
    public static String escapeJs(String input) {
        if (input == null) {
            return null;
        }
        return input
                .replace("\\", "\\\\")
                .replace("'", "\\'")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t")
                .replace("\b", "\\b")
                .replace("\f", "\\f");
    }

    /**
     * Validates that the input contains only safe characters for a given context.
     *
     * @param input   the input string to validate
     * @param pattern the regex pattern defining allowed characters
     * @return true if the input contains only allowed characters, false otherwise
     */
    public static boolean isValidInput(String input, String pattern) {
        if (input == null || pattern == null) {
            return false;
        }
        return input.matches(pattern);
    }

    /**
     * Validates that the input is a safe URL (helps prevent SSRF).
     *
     * @param url the URL to validate
     * @return true if the URL appears safe, false otherwise
     */
    public static boolean isSafeUrl(String url) {
        if (url == null) {
            return false;
        }
        // Basic check - in production, use a proper URL validator and whitelist allowed domains
        return !containsSsrf(url);
    }
}