package com.kartezy.shared.security.api;

import com.kartezy.shared.security.api.OwaspTop10Protector;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Filter that provides protection against OWASP Top 10 vulnerabilities.
 * <p>
 * This filter examines incoming requests for common attack patterns and
 * can block or sanitize requests based on security policies.
 * </p>
 */
@Component
public class EnhancedApiSecurityFilter extends OncePerRequestFilter {

    private final boolean blockSqlInjection;
    private final boolean blockNosqlInjection;
    private final boolean blockXss;
    private final boolean blockCommandInjection;
    private final boolean blockPathTraversal;
    private final boolean blockSsrf;
    private final boolean sanitizeInputs;

    public EnhancedApiSecurityFilter(
            boolean blockSqlInjection,
            boolean blockNosqlInjection,
            boolean blockXss,
            boolean blockCommandInjection,
            boolean blockPathTraversal,
            boolean blockSsrf,
            boolean sanitizeInputs) {
        this.blockSqlInjection = blockSqlInjection;
        this.blockNosqlInjection = blockNosqlInjection;
        this.blockXss = blockXss;
        this.blockCommandInjection = blockCommandInjection;
        this.blockPathTraversal = blockPathTraversal;
        this.blockSsrf = blockSsrf;
        this.sanitizeInputs = sanitizeInputs;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // Check for malicious patterns in request parameters
        if (hasMaliciousContent(request)) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Potentially malicious request detected");
            return;
        }

        // Continue with the filter chain
        filterChain.doFilter(request, response);
    }

    /**
     * Checks if the request contains potentially malicious content.
     *
     * @param request the HTTP request to check
     * @return true if malicious content is detected, false otherwise
     */
    private boolean hasMaliciousContent(HttpServletRequest request) {
        // Check query parameters
        if (checkParameters(request.getParameterMap())) {
            return true;
        }

        // Check headers (be careful with cookies and authorization headers)
        if (checkHeaders(request.getHeaderNames())) {
            return true;
        }

        // Check for path traversal in the request URI
        if (blockPathTraversal && containsPathTraversal(request.getRequestURI())) {
            return true;
        }

        return false;
    }

    /**
     * Checks a map of parameters for malicious content.
     *
     * @param parameters the parameter map to check
     * @return true if malicious content is found, false otherwise
     */
    private boolean checkParameters(java.util.Map<String, String[]> parameters) {
        if (parameters == null) {
            return false;
        }

        for (String paramName : parameters.keySet()) {
            String[] values = parameters.get(paramName);
            if (values != null) {
                for (String value : values) {
                    if (isMaliciousValue(value)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Checks header names for malicious content.
     * Note: We check header names only, not values, to avoid interfering with
     * legitimate headers like Cookie or Authorization.
     *
     * @param headerNames enumeration of header names
     * @return true if malicious header names are found, false otherwise
     */
    private boolean checkHeaders(java.util.Enumeration<String> headerNames) {
        if (headerNames == null) {
            return false;
        }

        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            if (isMaliciousValue(headerName)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks if a value contains malicious content.
     *
     * @param value the value to check
     * @return true if malicious content is detected, false otherwise
     */
    private boolean isMaliciousValue(String value) {
        if (value == null) {
            return false;
        }

        // Check for SQL injection
        if (blockSqlInjection && OwaspTop10Protector.containsSqlInjection(value)) {
            return true;
        }

        // Check for NoSQL injection
        if (blockNosqlInjection && OwaspTop10Protector.containsNosqlInjection(value)) {
            return true;
        }

        // Check for XSS
        if (blockXss && OwaspTop10Protector.containsXss(value)) {
            return true;
        }

        // Check for OS command injection
        if (blockCommandInjection && OwaspTop10Protector.containsOsCommandInjection(value)) {
            return true;
        }

        // Check for SSRF
        if (blockSsrf && OwaspTop10Protector.containsSsrf(value)) {
            return true;
        }

        return false;
    }

    /**
     * Checks if a string contains path traversal patterns.
     *
     * @param input the string to check
     * @return true if path traversal patterns are detected, false otherwise
     */
    private boolean containsPathTraversal(String input) {
        if (input == null) {
            return false;
        }
        return input.contains("../") || input.contains("..\\") ||
               input.contains("%2e%2e%2f") || input.contains("%2e%2e%5c") ||
               input.contains("..%2f") || input.contains("..%5c");
    }
}