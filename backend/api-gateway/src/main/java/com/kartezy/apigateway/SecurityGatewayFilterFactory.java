package com.kartezy.apigateway;

import com.kartezy.shared.security.api.OwaspTop10Protector;
import com.kartezy.shared.util.SecurityUtils;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Enhanced Gateway Filter Factory that provides comprehensive security filtering for API routes.
 * Protects against common web vulnerabilities and implements rate limiting at the gateway level.
 */
@Component
public class SecurityGatewayFilterFactory extends AbstractGatewayFilterFactory<SecurityGatewayFilterFactory.Config> {

    // In-memory storage for rate limit counters (use Redis in production)
    private final ConcurrentHashMap<String, RateLimitData> rateLimitData = new ConcurrentHashMap<>();

    public SecurityGatewayFilterFactory() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            // Apply rate limiting if enabled
            if (config.isEnableRateLimiting()) {
                String clientId = getClientId(exchange.getRequest());
                String routeId = getRouteId(exchange.getRequest());
                String key = clientId + ":" + routeId;

                RateLimitData data = rateLimitData.computeIfAbsent(key, k -> new RateLimitData());

                synchronized (data) {
                    long now = System.currentTimeMillis();
                    long firstRequestTime = data.getFirstRequestTime();

                    // Reset counter if time window has passed
                    if (now - firstRequestTime > config.getRateLimitDuration().toMillis()) {
                        data.reset(now);
                    }

                    long currentCount = data.incrementAndGet();

                    if (currentCount > config.getRateLimitMaxRequests()) {
                        exchange.getResponse().setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
                        exchange.getResponse().getHeaders().add("Retry-After",
                                String.valueOf(config.getRateLimitDuration().getSeconds()));
                        return exchange.getResponse().setComplete();
                    }
                }
            }

            // Validate the request for security threats
            if (isRequestMalicious(exchange.getRequest())) {
                exchange.getResponse().setStatusCode(HttpStatus.BAD_REQUEST);
                return exchange.getResponse().setComplete();
            }

            return chain.filter(exchange);
        };
    }

    /**
     * Checks if the request contains malicious content.
     *
     * @param request the server request to check
     * @return true if malicious content is detected, false otherwise
     */
    private boolean isRequestMalicious(org.springframework.http.server.reactive.ServerHttpRequest request) {
        // Check query parameters
        if (hasMaliciousParams(request.getQueryParams())) {
            return true;
        }

        // Check headers (be careful with authorization and cookies)
        if (hasMaliciousHeaders(request.getHeaders())) {
            return true;
        }

        // Check path for traversal attempts
        if (containsPathTraversal(request.getPath().value())) {
            return true;
        }

        // Check for suspicious user agent (bot protection)
        if (config.isEnableBotProtection() && isSuspiciousUserAgent(request.getHeaders())) {
            return true;
        }

        return false;
    }

    /**
     * Checks query parameters for malicious content.
     *
     * @param queryParams the query parameters to check
     * @return true if malicious parameters are found, false otherwise
     */
    private boolean hasMaliciousParams(org.springframework.http.server.reactive.ServerHttpRequest.QueryParams queryParams) {
        if (queryParams == null) {
            return false;
        }

        for (String key : queryParams.keySet()) {
            List<String> values = queryParams.get(key);
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
     * Checks headers for malicious content.
     *
     * @param headers the headers to check
     * @return true if malicious headers are found, false otherwise
     */
    private boolean hasMaliciousHeaders(org.springframework.http.HttpHeaders headers) {
        if (headers == null) {
            return false;
        }

        // Check header names (not values to avoid interfering with auth, cookies, etc.)
        for (String headerName : headers.keySet()) {
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
        if (OwaspTop10Protector.containsSqlInjection(value)) {
            return true;
        }

        // Check for NoSQL injection
        if (OwaspTop10Protector.containsNosqlInjection(value)) {
            return true;
        }

        // Check for XSS
        if (OwaspTop10Protector.containsXss(value)) {
            return true;
        }

        // Check for OS command injection
        if (OwaspTop10Protector.containsOsCommandInjection(value)) {
            return true;
        }

        // Check for path traversal
        if (containsPathTraversal(value)) {
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

    /**
     * Checks if the user agent indicates a bot or suspicious client.
     *
     * @param headers the request headers
     * @return true if user agent is suspicious, false otherwise
     */
    private boolean isSuspiciousUserAgent(org.springframework.http.HttpHeaders headers) {
        String userAgent = headers.getFirst(HttpHeaders.USER_AGENT);

        // If no user agent, likely a bot or script
        if (userAgent == null || userAgent.isEmpty()) {
            return config.isBlockEmptyUserAgent();
        }

        // Check against known bot patterns
        String[] commonBotAgents = {
                "curl", "wget", "python", "perl", "ruby", "java", "go-http-client",
                "python-requests", "libwww", "lwp-trivial", "pecl::http", "facebookexternalhit",
                "twitterbot", "slackbot", "whatsapp", "telegrambot", "discordbot"
        };

        String lowerCaseAgent = userAgent.toLowerCase();
        for (String botAgent : commonBotAgents) {
            if (lowerCaseAgent.contains(botAgent.toLowerCase())) {
                return config.isBlockKnownBots();
            }
        }

        // Check for missing headers that real browsers typically send
        if (config.isCheckSuspiciousHeaders()) {
            String acceptEncoding = headers.getFirst(HttpHeaders.ACCEPT_ENCODING);
            String acceptLanguage = headers.getFirst(HttpHeaders.ACCEPT_LANGUAGE);

            // Very basic bot detection - real browsers usually send these
            return (acceptEncoding == null || acceptEncoding.isEmpty()) &&
                   (acceptLanguage == null || acceptLanguage.isEmpty());
        }

        return false;
    }

    /**
     * Extracts client identifier for rate limiting.
     *
     * @param request the server request
     * @return client identifier string
     */
    private String getClientId(org.springframework.http.server.reactive.ServerHttpRequest request) {
        // Use API key, JWT subject, or IP address as client identifier
        String apiKey = request.getHeaders().getFirst("X-API-Key");
        if (apiKey != null && !apiKey.isEmpty()) {
            return apiKey;
        }

        String authHeader = request.getHeaders().getFirst("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // Extract user ID from JWT via shared utility
            String userId = SecurityUtils.extractUserIdFromToken(authHeader);
            if (userId != null) {
                return userId;
            }
        }

        return request.getRemoteAddress().getHostString();
    }

    /**
     * Extracts route identifier from the request path.
     *
     * @param request the server request
     * @return route identifier string
     */
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

    /**
     * Data class to hold rate limit information for a client.
     */
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
     * Configuration class for the SecurityGatewayFilterFactory.
     */
    public static class Config {
        private boolean enableRateLimiting = true;
        private int rateLimitMaxRequests = 100;
        private Duration rateLimitDuration = Duration.ofMinutes(1);
        private boolean enableBotProtection = true;
        private boolean blockEmptyUserAgent = true;
        private boolean blockKnownBots = true;
        private boolean checkSuspiciousHeaders = true;

        public boolean isEnableRateLimiting() {
            return enableRateLimiting;
        }

        public void setEnableRateLimiting(boolean enableRateLimiting) {
            this.enableRateLimiting = enableRateLimiting;
        }

        public int getRateLimitMaxRequests() {
            return rateLimitMaxRequests;
        }

        public void setRateLimitMaxRequests(int rateLimitMaxRequests) {
            this.rateLimitMaxRequests = rateLimitMaxRequests;
        }

        public Duration getRateLimitDuration() {
            return rateLimitDuration;
        }

        public void setRateLimitDuration(Duration rateLimitDuration) {
            this.rateLimitDuration = rateLimitDuration;
        }

        public boolean isEnableBotProtection() {
            return enableBotProtection;
        }

        public void setEnableBotProtection(boolean enableBotProtection) {
            this.enableBotProtection = enableBotProtection;
        }

        public boolean isBlockEmptyUserAgent() {
            return blockEmptyUserAgent;
        }

        public void setBlockEmptyUserAgent(boolean blockEmptyUserAgent) {
            this.blockEmptyUserAgent = blockEmptyUserAgent;
        }

        public boolean isBlockKnownBots() {
            return blockKnownBots;
        }

        public void setBlockKnownBots(boolean blockKnownBots) {
            this.blockKnownBots = blockKnownBots;
        }

        public boolean isCheckSuspiciousHeaders() {
            return checkSuspiciousHeaders;
        }

        public void setCheckSuspiciousHeaders(boolean checkSuspiciousHeaders) {
            this.checkSuspiciousHeaders = checkSuspiciousHeaders;
        }
    }
}