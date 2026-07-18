package com.kartezy.shared.security.api;

import com.kartezy.shared.security.api.EnhancedApiSecurityFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

/**
 * API Security configuration with comprehensive protection.
 * Configures CORS, security headers, request validation, and threat protection.
 */
@Configuration
public class ApiSecurityConfig {

    /**
     * Configure CORS with strict security settings.
     */
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOriginPatterns(List.of(
                "https://*.kartezy.com",
                "https://*.kartezy.in",
                "http://localhost:*"
        ));
        config.setAllowedHeaders(List.of(
                "Origin", "Content-Type", "Accept", "Authorization",
                "X-Requested-With", "X-Tenant-Id", "X-Language",
                "X-Currency", "X-Timezone", "X-Idempotency-Key",
                "X-CSRF-Token", "X-API-Key", "X-Device-Id"
        ));
        config.setExposedHeaders(List.of(
                "X-Request-Id", "X-Tenant-Id", "X-Rate-Limit-Remaining",
                "X-Rate-Limit-Reset", "X-Language", "X-Timezone",
                "X-Content-Type-Options"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    /**
     * Enhanced API security filter with full OWASP protection.
     */
    @Bean
    public EnhancedApiSecurityFilter enhancedApiSecurityFilter() {
        return new EnhancedApiSecurityFilter(
                true,  // Block SQL injection
                true,  // Block NoSQL injection
                true,  // Block XSS
                true,  // Block command injection
                true,  // Block path traversal
                true,  // Block SSRF
                true   // Sanitize inputs
        );
    }
}
