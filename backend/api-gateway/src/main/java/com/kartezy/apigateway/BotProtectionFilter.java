package com.kartezy.apigateway;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.regex.Pattern;

/**
 * Bot Protection Filter for API Gateway.
 * Detects and blocks automated bots, scrapers, and malicious clients.
 */
@Component
public class BotProtectionFilter extends AbstractGatewayFilterFactory<BotProtectionFilter.Config> {

    private static final String[] COMMON_BOT_AGENTS = {
        "curl", "wget", "python", "perl", "ruby", "java", "go-http-client",
        "python-requests", "libwww", "lwp-trivial", "pecl::http", "facebookexternalhit",
        "twitterbot", "slackbot", "whatsapp", "telegrambot", "discordbot",
        "bot", "bot*", "*bot*", "crawler", "spider", "scraper"
    };

    private static final Pattern[] BOT_AGENT_PATTERNS;

    static {
        BOT_AGENT_PATTERNS = new Pattern[COMMON_BOT_AGENTS.length];
        for (int i = 0; i < COMMON_BOT_AGENTS.length; i++) {
            String patternStr = COMMON_BOT_AGENTS[i].replace("*", ".*");
            BOT_AGENT_PATTERNS[i] = Pattern.compile(patternStr, Pattern.CASE_INSENSITIVE);
        }
    }

    public BotProtectionFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String userAgent = exchange.getRequest().getHeaders().getFirst(HttpHeaders.USER_AGENT);

            // If no user agent, likely a bot or script
            if (userAgent == null || userAgent.isEmpty()) {
                if (config.isBlockEmptyUserAgent()) {
                    exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                    return exchange.getResponse().setComplete();
                }
            }

            // Check against known bot patterns
            if (userAgent != null && !userAgent.isEmpty()) {
                for (Pattern pattern : BOT_AGENT_PATTERNS) {
                    if (pattern.matcher(userAgent).find()) {
                        if (config.isBlockKnownBots()) {
                            exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                            return exchange.getResponse().setComplete();
                        }
                    }
                }
            }

            // Check for missing Accept header (common in basic bots)
            if (config.isRequireAcceptHeader()) {
                String acceptHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.ACCEPT);
                if (acceptHeader == null || acceptHeader.isEmpty()) {
                    exchange.getResponse().setStatusCode(HttpStatus.BAD_REQUEST);
                    return exchange.getResponse().setComplete();
                }
            }

            // Check for suspicious headers
            if (config.isCheckSuspiciousHeaders()) {
                if (hasSuspiciousHeaders(exchange.getRequest().getHeaders())) {
                    exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                    return exchange.getResponse().setComplete();
                }
            }

            return chain.filter(exchange);
        };
    }

    private boolean hasSuspiciousHeaders(HttpHeaders headers) {
        // Check for missing or suspicious headers that bots often lack
        // Real browsers typically send these headers

        // Check for commonly missing headers in basic HTTP clients
        String acceptEncoding = headers.getFirst(HttpHeaders.ACCEPT_ENCODING);
        String acceptLanguage = headers.getFirst(HttpHeaders.ACCEPT_LANGUAGE);

        // Very basic bot detection - real browsers usually send these
        if ((acceptEncoding == null || acceptEncoding.isEmpty()) &&
            (acceptLanguage == null || acceptLanguage.isEmpty())) {
            return true;
        }

        return false;
    }

    /**
     * Configuration class for the BotProtectionFilter.
     */
    public static class Config {
        private boolean blockEmptyUserAgent = true;
        private boolean blockKnownBots = true;
        private boolean requireAcceptHeader = true;
        private boolean checkSuspiciousHeaders = true;

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

        public boolean isRequireAcceptHeader() {
            return requireAcceptHeader;
        }

        public void setRequireAcceptHeader(boolean requireAcceptHeader) {
            this.requireAcceptHeader = requireAcceptHeader;
        }

        public boolean isCheckSuspiciousHeaders() {
            return checkSuspiciousHeaders;
        }

        public void setCheckSuspiciousHeaders(boolean checkSuspiciousHeaders) {
            this.checkSuspiciousHeaders = checkSuspiciousHeaders;
        }
    }
}