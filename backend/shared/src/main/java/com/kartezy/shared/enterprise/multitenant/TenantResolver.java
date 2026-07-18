package com.kartezy.shared.enterprise.multitenant;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

import java.util.Optional;
import java.util.regex.Pattern;

/**
 * Resolves the current tenant from various sources:
 * - HTTP Header (X-Tenant-Id)
 * - Subdomain (tenant.kartezy.com)
 * - Custom Domain (tenant.com)
 * - JWT Claims
 * - API Key
 */
@Slf4j
public final class TenantResolver {

    private static final Pattern SUBDOMAIN_PATTERN =
            Pattern.compile("^([a-zA-Z0-9-]+)\\.kartezy\\.com$");
    private static final Pattern CUSTOM_DOMAIN_PATTERN =
            Pattern.compile("^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\\.[a-zA-Z]{2,}$");

    private TenantResolver() {}

    /**
     * Resolve tenant ID from HTTP request.
     * Priority: Header > Subdomain > Custom Domain > API Key
     */
    public static Optional<String> resolveTenantId(HttpServletRequest request) {
        // 1. Check X-Tenant-Id header
        String tenantId = request.getHeader("X-Tenant-Id");
        if (tenantId != null && !tenantId.isBlank()) {
            log.debug("Resolved tenant from header: {}", tenantId);
            return Optional.of(tenantId);
        }

        // 2. Check X-Tenant header
        tenantId = request.getHeader("X-Tenant");
        if (tenantId != null && !tenantId.isBlank()) {
            log.debug("Resolved tenant from X-Tenant header: {}", tenantId);
            return Optional.of(tenantId);
        }

        // 3. Resolve from subdomain
        String host = request.getServerName();
        if (host != null) {
            var matcher = SUBDOMAIN_PATTERN.matcher(host);
            if (matcher.matches()) {
                tenantId = matcher.group(1);
                log.debug("Resolved tenant from subdomain: {} -> {}", host, tenantId);
                return Optional.of(tenantId);
            }
        }

        // 4. Check Authorization header for API Key
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // JWT token may contain tenant claim
            // This would be decoded by the auth service
        }

        return Optional.empty();
    }

    /**
     * Extract tenant ID from a custom domain.
     */
    public static String extractFromDomain(String domain) {
        if (domain == null || domain.isBlank()) return null;
        // Remove protocol and path
        String cleanDomain = domain.replaceFirst("https?://", "")
                .replaceFirst("/.*$", "")
                .toLowerCase();
        return cleanDomain;
    }

    /**
     * Validate tenant ID format.
     */
    public static boolean isValidTenantId(String tenantId) {
        return tenantId != null &&
                tenantId.matches("^[a-zA-Z0-9_-]{3,64}$");
    }
}
