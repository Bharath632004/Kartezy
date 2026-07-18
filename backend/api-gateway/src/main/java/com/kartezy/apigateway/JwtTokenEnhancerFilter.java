package com.kartezy.apigateway;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * JWT Token Enhancer Filter for API Gateway.
 * Enhances incoming requests with JWT token information for downstream services.
 */
@Component
public class JwtTokenEnhancerFilter extends AbstractGatewayFilterFactory<JwtTokenEnhancerFilter.Config> {

    public JwtTokenEnhancerFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            // Extract token from Authorization header
            String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
            String token = null;

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring("Bearer ".length());
            }

            if (token != null && !token.isEmpty()) {
                // In a real implementation, you would decode the JWT and extract claims
                // For now, we'll just pass the token through as a header for downstream services
                // The downstream services can then validate and extract claims as needed

                // Add token to headers for downstream services (if configured)
                if (config.isPassTokenThrough()) {
                    ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                        .header("X-Jwt-Token", token)
                        .build();

                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                }

                // Add user ID from token if available (simplified)
                if (config.isAddUserIdHeader()) {
                    // In a real app, decode JWT and extract user ID
                    // String userId = extractUserIdFromToken(token);
                    // For demo, we'll add a placeholder
                    ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                        .header("X-User-ID", "token-user") // Would be extracted from JWT
                        .build();

                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                }
            }

            return chain.filter(exchange);
        };
    }

    // Helper methods for JWT parsing would go here in a real implementation
    private String extractUserIdFromToken(String token) {
        // Implementation would decode JWT and extract user ID claim
        return null;
    }

    private String extractRolesFromToken(String token) {
        // Implementation would decode JWT and extract roles claim
        return null;
    }

    /**
     * Configuration class for the JwtTokenEnhancerFilter.
     */
    public static class Config {
        private boolean passTokenThrough = true;
        private boolean addUserIdHeader = true;

        public boolean isPassTokenThrough() {
            return passTokenThrough;
        }

        public void setPassTokenThrough(boolean passTokenThrough) {
            this.passTokenThrough = passTokenThrough;
        }

        public boolean isAddUserIdHeader() {
            return addUserIdHeader;
        }

        public void setAddUserIdHeader(boolean addUserIdHeader) {
            this.addUserIdHeader = addUserIdHeader;
        }
    }
}