package com.kartezy.apigateway;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Advanced Rate Limiter for API Gateway.
 * Implements token bucket algorithm for rate limiting.
 */
@Component
public class AdvancedRateLimiter extends AbstractGatewayFilterFactory<AdvancedRateLimiter.Config> {

    // In-memory storage for rate limit counters (use Redis in production)
    private final ConcurrentHashMap<String, RateLimitData> rateLimitData = new ConcurrentHashMap<>();

    public AdvancedRateLimiter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String clientId = getClientId(exchange.getRequest());
            String routeId = getRouteId(exchange.getRequest());
            String key = clientId + ":" + routeId;

            RateLimitData data = rateLimitData.computeIfAbsent(key, k -> new RateLimitData());

            synchronized (data) {
                long now = System.currentTimeMillis();
                long firstRequestTime = data.getFirstRequestTime();

                // Reset counter if time window has passed
                if (now - firstRequestTime > config.getDuration().toMillis()) {
                    data.reset(now);
                }

                long currentCount = data.incrementAndGet();

                if (currentCount > config.getMaxRequests()) {
                    exchange.getResponse().setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
                    exchange.getResponse().getHeaders().add("Retry-After",
                        String.valueOf(config.getDuration().getSeconds()));
                    return exchange.getResponse().setComplete();
                }
            }

            return chain.filter(exchange);
        };
    }

    private String getClientId(org.springframework.http.server.reactive.ServerHttpRequest request) {
        // Use API key, JWT subject, or IP address as client identifier
        String apiKey = request.getHeaders().getFirst("X-API-Key");
        if (apiKey != null && !apiKey.isEmpty()) {
            return apiKey;
        }

        String authHeader = request.getHeaders().getFirst("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // In a real implementation, extract user ID from JWT
            return "jwt-user"; // Placeholder
        }

        return request.getRemoteAddress().getHostString();
    }

    private String getRouteId(org.springframework.http.server.reactive.ServerHttpRequest request) {
        // Extract route identifier from path
        String path = request.getPath().value();
        // Simple route identification - could be enhanced based on actual routes
        if (path.startsWith("/api/auth/")) return "auth";
        if (path.startsWith("/api/users/")) return "users";
        if (path.startsWith("/api/merchants/")) return "merchants";
        if (path.startsWith("/api/catalog/")) return "catalog";
        if (path.startsWith("/api/inventory/")) return "inventory";
        if (path.startsWith("/api/orders/")) return "orders";
        if (path.startsWith("/api/payments/")) return "payments";
        return "default";
    }

    private static class RateLimitData {
        private long firstRequestTime;
        private final AtomicLong requestCount = new AtomicLong(0);

        RateLimitData() {
            this.firstRequestTime = System.currentTimeMillis();
        }

        void reset(long now) {
            this.firstRequestTime = now;
            this.requestCount.set(0);
        }

        long incrementAndGet() {
            return requestCount.incrementAndGet();
        }

        long getFirstRequestTime() {
            return firstRequestTime;
        }
    }

    /**
     * Configuration class for the AdvancedRateLimiter.
     */
    public static class Config {
        private int maxRequests = 100;
        private Duration duration = Duration.ofMinutes(1);

        public int getMaxRequests() {
            return maxRequests;
        }

        public void setMaxRequests(int maxRequests) {
            this.maxRequests = maxRequests;
        }

        public Duration getDuration() {
            return duration;
        }

        public void setDuration(Duration duration) {
            this.duration = duration;
        }
    }
}