package com.kartezy.shared.enterprise.multitenant;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Servlet filter that resolves and sets the tenant context for every request.
 * Must be the first filter in the chain.
 */
@Slf4j
@Component
@Order(1)
@RequiredArgsConstructor
public class TenantFilter implements Filter {

    private final TenantService tenantService;

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse,
                         FilterChain filterChain) throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        // Skip tenant resolution for public endpoints
        String path = request.getRequestURI();
        if (isPublicEndpoint(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Resolve tenant
            var tenantIdOpt = TenantResolver.resolveTenantId(request);

            if (tenantIdOpt.isPresent()) {
                String tenantId = tenantIdOpt.get();
                Tenant tenant = tenantService.getTenant(tenantId);

                if (tenant == null) {
                    log.warn("Unknown tenant: {} from IP: {}", tenantId, request.getRemoteAddr());
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unknown tenant");
                    return;
                }

                if (!tenant.isActive()) {
                    log.warn("Inactive tenant: {} (status: {})", tenantId, tenant.getStatus());
                    response.sendError(HttpServletResponse.SC_FORBIDDEN,
                            "Tenant account is " + tenant.getStatus());
                    return;
                }

                TenantContext.setCurrentTenant(tenant);
                log.debug("Tenant context set: {} ({})", tenantId, tenant.getName());

                // Add tenant info to response headers
                response.setHeader("X-Tenant-Id", tenantId);
                response.setHeader("X-Tenant-Tier", tenant.getTier().name());
            }

            filterChain.doFilter(request, response);

        } finally {
            TenantContext.clear();
        }
    }

    private boolean isPublicEndpoint(String path) {
        return path.equals("/") ||
                path.equals("/health") ||
                path.equals("/actuator/health") ||
                path.equals("/actuator/info") ||
                path.startsWith("/api/public/") ||
                path.startsWith("/api/auth/register") ||
                path.startsWith("/api/auth/login") ||
                path.startsWith("/swagger-ui") ||
                path.startsWith("/v3/api-docs") ||
                path.startsWith("/api/tenants/register");
    }
}
