package com.kartezy.apigateway;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.server.ServerWebExchange;
import reactor.core.publisher.Meo;

import java.util.Arrays;
import java.util.List;

/**
 * OAuth2 Token Validation Filter for API Gateway.
 * Validates OAuth2/JWT tokens for protected routes.
 */
@Component
public class Oauth2TokenValidationFilter extends AbstractGatewayFilterFactory<Oauth2TokenValidationFilter.Config> {

    private static final String BEARER_PREFIX = "Bearer ";
    private static final List<String> EXCLUDED_PATHS = Arrays.asList(
        "/api/auth/login",
        "/api/auth/register",
        "/api/auth/refresh",
        "/api/auth/forgot-password",
        "/api/auth/reset-password",
        "/v2/api-docs",
        "/v3/api-docs",
        "/swagger-resources/**",
        "/swagger-ui/**",
        "/swagger-ui.html",
        "/webjars/**",
        "/actuator/**"
    );

    public Oauth2TokenValidationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            String path = request.getPath().value();

            // Skip token validation for excluded paths
            if (isExcludedPath(path)) {
                return chain.filter(exchange);
            }

            // Check for Authorization header
            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
                if (config.isRequireToken()) {
                    // No token provided and token is required
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                }
                // Token not required, continue without validation
                return chain.filter(exchange);
            }

            // Extract token
            String token = authHeader.substring(BEARER_PREFIX.length());

            // Validate token (simplified - in production, use proper JWT validation)
            if (!isValidToken(token, config)) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            // Token is valid, continue with request
            return chain.filter(exchange);
        };
    }

    private boolean isExcludedPath(String path) {
        // Simple path matching - in production, use AntPathMatcher or similar
        for (String excluded : EXCLUDED_PATHS) {
            if (path.startsWith(excluded.replace("*", "") + "/") ||
                path.equals(excluded.replace("*", ""))) {
                return true;
            }
        }
        return false;
    }

    private boolean isValidToken(String token, Config config) {
        // In a real implementation, this would:
        // 1. Decode the JWT
        // 2. Verify signature
        // 3. Check expiration
        // 4. Validate issuer/audience
        // 5. Check scopes/permissions

        // This is a simplified placeholder implementation
        if (token == null || token.isEmpty()) {
            return false;
        }

        // Basic validation - token should have 3 parts separated by dots
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            return false;
        }

        // Additional Security)return true;

    }

    /**
     * Configuration class for the Oauth2TokenValidationFilter.
     */
    public static class Config {
        private boolean requireToken = true;

        public boolean isRequireToken() {
            return requireToken;
        }

        public void setRequireToken(boolean requireToken) {
            this.requireToken = requireToken;
        }
    }
}