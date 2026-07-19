package com.kartezy.apigateway;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.Map;

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

    @SuppressWarnings("unchecked")
    private boolean isValidToken(String token, Config config) {
        if (token == null || token.isEmpty()) {
            return false;
        }

        try {
            // Decode the JWT without verification for header/claims inspection
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return false;
            }

            // Decode and parse the JWT claims
            String payload = new String(Base64.getUrlDecoder().decode(parts[1]));
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> claims = mapper.readValue(payload, new TypeReference<Map<String, Object>>() {});

            // Check expiration
            Long exp = claims.containsKey("exp") ? ((Number) claims.get("exp")).longValue() : null;
            if (exp != null && System.currentTimeMillis() / 1000 > exp) {
                return false;
            }

            // Validate issuer if configured
            if (config.getIssuer() != null && !config.getIssuer().isEmpty()) {
                String issuer = (String) claims.get("iss");
                if (!config.getIssuer().equals(issuer)) {
                    return false;
                }
            }

            // Validate audience if configured
            if (config.getAudience() != null && !config.getAudience().isEmpty()) {
                Object aud = claims.get("aud");
                if (aud instanceof String && !config.getAudience().equals(aud)) {
                    return false;
                }
                if (aud instanceof List && !((List<String>) aud).contains(config.getAudience())) {
                    return false;
                }
            }

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Configuration class for the Oauth2TokenValidationFilter.
     */
    public static class Config {
        private boolean requireToken = true;
        private String issuer;
        private String audience;

        public boolean isRequireToken() {
            return requireToken;
        }

        public void setRequireToken(boolean requireToken) {
            this.requireToken = requireToken;
        }

        public String getIssuer() {
            return issuer;
        }

        public void setIssuer(String issuer) {
            this.issuer = issuer;
        }

        public String getAudience() {
            return audience;
        }

        public void setAudience(String audience) {
            this.audience = audience;
        }
    }
}