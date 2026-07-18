package com.kartezy.shared.security.api;

import com.kartezy.shared.security.audit.EnhancedAuditLogService;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.util.UUID;

/**
 * Comprehensive security audit filter that logs all security-relevant events.
 * Tracks authentication, authorization, data access, and configuration changes.
 */
@Slf4j
@Component
@Order(5)
@RequiredArgsConstructor
public class SecurityAuditFilter implements Filter {

    private final EnhancedAuditLogService auditLogService;

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse,
                         FilterChain filterChain) throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        String requestId = UUID.randomUUID().toString();
        String path = request.getRequestURI();
        String method = request.getMethod();
        String ip = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");
        long startTime = System.currentTimeMillis();

        try {
            // Check for security-sensitive operations
            boolean isSecurityEvent = isSecuritySensitiveOperation(method, path);

            // Add request tracing
            response.setHeader("X-Request-Id", requestId);

            filterChain.doFilter(request, response);

            long duration = System.currentTimeMillis() - startTime;
            int status = response.getStatus();

            // Log security events
            if (isSecurityEvent || status == 403 || status == 401 || status >= 500) {
                auditLogService.logEventWithIntegrity(
                        getSecurityEventType(method, path, status),
                        request.getUserPrincipal() != null ? request.getUserPrincipal().getName() : "anonymous",
                        ip,
                        String.format("%s %s - %d (%dms)", method, path, status, duration),
                        status >= 200 && status < 400 ? "SUCCESS" : "FAILURE",
                        String.format("{\"requestId\":\"%s\",\"userAgent\":\"%s\",\"status\":%d,\"duration\":%d}",
                                requestId, userAgent, status, duration),
                        Instant.now()
                );
            } else if (duration > 1000) {
                // Log slow requests as warnings
                log.warn("Slow request: {} {} took {}ms", method, path, duration);
            }

        } catch (Exception e) {
            log.error("Error processing request: {} {} - {}", method, path, e.getMessage());
            auditLogService.logEventWithIntegrity(
                    "SECURITY_ERROR",
                    request.getUserPrincipal() != null ? request.getUserPrincipal().getName() : "anonymous",
                    ip,
                    "Security filter error: " + e.getMessage(),
                    "FAILURE",
                    String.format("{\"error\":\"%s\"}", e.getMessage()),
                    Instant.now()
            );
            throw e;
        }
    }

    private boolean isSecuritySensitiveOperation(String method, String path) {
        // Authentication & Authorization endpoints
        if (path.contains("/auth/") || path.contains("/login") || path.contains("/logout")) return true;

        // User management
        if (path.contains("/users/") && (method.equals("POST") || method.equals("PUT") || method.equals("DELETE"))) return true;

        // Payment operations
        if (path.contains("/payments/") || path.contains("/wallet/")) return true;

        // Configuration changes
        if (path.contains("/config/") || path.contains("/settings/")) return true;

        // Admin operations
        if (path.contains("/admin/")) return true;

        // Security operations
        if (path.contains("/security/") || path.contains("/mfa/") || path.contains("/keys/")) return true;

        // Data export/import
        if (path.contains("/export") || path.contains("/import")) return true;

        return false;
    }

    private String getSecurityEventType(String method, String path, int status) {
        if (status == 401) return "AUTHENTICATION_FAILURE";
        if (status == 403) return "ACCESS_DENIED";
        if (status >= 500) return "SERVER_ERROR";

        if (path.contains("/login")) return "LOGIN";
        if (path.contains("/logout")) return "LOGOUT";
        if (path.contains("/auth/")) return "AUTH_OPERATION";
        if (path.contains("/payments")) return "PAYMENT_OPERATION";
        if (path.contains("/admin")) return "ADMIN_OPERATION";
        if (path.contains("/mfa")) return "MFA_OPERATION";

        return "API_CALL";
    }
}
