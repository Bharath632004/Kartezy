package com.kartezy.shared.security.api;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;

/**
 * Security headers configuration for OWASP protection.
 * Adds HSTS, CSP, X-Frame-Options, and other critical security headers
 * via a servlet filter to avoid conflicts with per-service SecurityConfig.
 *
 * IMPORTANT: Each service's SecurityConfig should also configure headers
 * via HttpSecurity.headers(). This filter provides a baseline that runs
 * before Spring Security's filter chain.
 */
@Configuration
public class SecurityHeadersConfig {

    @Bean
    public FilterRegistrationBean<SecurityHeadersFilter> securityHeadersFilter() {
        FilterRegistrationBean<SecurityHeadersFilter> registration =
                new FilterRegistrationBean<>(new SecurityHeadersFilter());
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE + 5);
        registration.addUrlPatterns("/*");
        return registration;
    }

    /**
     * Servlet filter that adds comprehensive security headers to every response.
     * This runs before Spring Security to ensure headers are always present.
     */
    public static class SecurityHeadersFilter implements jakarta.servlet.Filter {

        @Override
        public void doFilter(jakarta.servlet.ServletRequest servletRequest,
                             jakarta.servlet.ServletResponse servletResponse,
                             jakarta.servlet.FilterChain filterChain)
                throws java.io.IOException, jakarta.servlet.ServletException {

            HttpServletResponse response = (HttpServletResponse) servletResponse;

            // HSTS - Strict Transport Security
            response.setHeader("Strict-Transport-Security",
                    "max-age=31536000; includeSubDomains; preload");

            // Content Security Policy
            // Note: 'unsafe-inline' and 'unsafe-eval' are required for Next.js/React dev mode.
            // For production, migrate to nonce-based or hash-based CSP.
            response.setHeader("Content-Security-Policy",
                    "default-src 'self'; " +
                    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.kartezy.com; " +
                    "style-src 'self' 'unsafe-inline' https://*.kartezy.com https://fonts.googleapis.com; " +
                    "img-src 'self' data: https://*.kartezy.com https://*.kartezy.in https://*.amazonaws.com blob:; " +
                    "font-src 'self' https://fonts.gstatic.com https://*.kartezy.com; " +
                    "connect-src 'self' https://*.kartezy.com wss://*.kartezy.com; " +
                    "frame-src 'self' https://*.kartezy.com; " +
                    "object-src 'none'; base-uri 'self'; form-action 'self' https://*.kartezy.com; " +
                    "frame-ancestors 'self'; upgrade-insecure-requests");

            // X-Frame-Options (fallback for older browsers not supporting CSP frame-ancestors)
            response.setHeader("X-Frame-Options", "SAMEORIGIN");

            // X-Content-Type-Options
            response.setHeader("X-Content-Type-Options", "nosniff");

            // X-XSS-Protection
            response.setHeader("X-XSS-Protection", "1; mode=block");

            // Referrer-Policy
            response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

            // Permissions Policy (replaces Feature Policy)
            response.setHeader("Permissions-Policy",
                    "geolocation=(self), microphone=(), camera=(), payment=(self)");

            // Cross-Origin-Embedder-Policy
            response.setHeader("Cross-Origin-Embedder-Policy", "require-corp");

            // Cross-Origin-Opener-Policy
            response.setHeader("Cross-Origin-Opener-Policy", "same-origin");

            // Cross-Origin-Resource-Policy
            response.setHeader("Cross-Origin-Resource-Policy", "same-origin");

            // X-DNS-Prefetch-Control
            response.setHeader("X-DNS-Prefetch-Control", "off");

            // X-Download-Options
            response.setHeader("X-Download-Options", "noopen");

            // X-Permitted-Cross-Domain-Policies
            response.setHeader("X-Permitted-Cross-Domain-Policies", "none");

            // Clear-Site-Data for logout endpoints (set by controllers when needed)
            // response.setHeader("Clear-Site-Data", "\"cache\", \"cookies\", \"storage\"");

            filterChain.doFilter(servletRequest, servletResponse);
        }
    }
}
