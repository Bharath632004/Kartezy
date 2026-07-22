package com.kartezy.apigateway;

import com.kartezy.apigateway.AdvancedRateLimiter;
import com.kartezy.apigateway.ApiThreatProtectionFilter;
import com.kartezy.apigateway.BotProtectionFilter;
import com.kartezy.apigateway.JwtTokenEnhancerFilter;
import com.kartezy.apigateway.Oauth2TokenValidationFilter;
import com.kartezy.apigateway.RequestResponseLogger;
import com.kartezy.apigateway.SecurityGatewayFilterFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.Customizer;

import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import java.util.List;

/**
 * Main application class for the API Gateway with enhanced security features.
 */
@SpringBootApplication(scanBasePackages = {"com.kartezy.apigateway"})
@EnableDiscoveryClient
public class ApiGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder,
                                      SecurityGatewayFilterFactory securityFilterFactory,
                                      AdvancedRateLimiter rateLimiter,
                                      BotProtectionFilter botProtectionFilter,
                                      ApiThreatProtectionFilter apiThreatProtectionFilter,
                                      Oauth2TokenValidationFilter oauth2TokenValidationFilter,
                                      JwtTokenEnhancerFilter jwtTokenEnhancerFilter,
                                      RequestResponseLogger requestResponseLogger) {
        return builder.routes()
                // Apply global filters to all routes
                .route("auth-service", r -> r.path("/api/auth/**")
                        .filters(f -> f
                                .filter(securityFilterFactory.apply(new SecurityGatewayFilterFactory.Config()))
                                .filter(apiThreatProtectionFilter.apply(new ApiThreatProtectionFilter.Config()))
                                .filter(botProtectionFilter.apply(new BotProtectionFilter.Config()))
                                .filter(requestResponseLogger.apply(new RequestResponseLogger.Config()))
                                .stripPrefix(1)
                                .filter((exchange, chain) -> {
                                    var request = exchange.getRequest();
                                    var mutatedRequest = request.mutate()
                                            .header("X-Request-ID", java.util.UUID.randomUUID().toString())
                                            .build();
                                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                                }))
                        .uri("lb://auth-service"))
                .route("user-service", r -> r.path("/api/users/**")
                        .filters(f -> f
                                .filter(securityFilterFactory.apply(new SecurityGatewayFilterFactory.Config()))
                                .filter(apiThreatProtectionFilter.apply(new ApiThreatProtectionFilter.Config()))
                                .filter(botProtectionFilter.apply(new BotProtectionFilter.Config()))
                                .filter(oauth2TokenValidationFilter.apply(new Oauth2TokenValidationFilter.Config()))
                                .filter(jwtTokenEnhancerFilter.apply(new JwtTokenEnhancerFilter.Config()))
                                .filter(requestResponseLogger.apply(new RequestResponseLogger.Config()))
                                .stripPrefix(1)
                                .filter((exchange, chain) -> {
                                    var request = exchange.getRequest();
                                    var mutatedRequest = request.mutate()
                                            .header("X-Request-ID", java.util.UUID.randomUUID().toString())
                                            .build();
                                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                                }))
                        .uri("lb://user-service"))
                .route("merchant-service", r -> r.path("/api/merchants/**")
                        .filters(f -> f
                                .filter(securityFilterFactory.apply(new SecurityGatewayFilterFactory.Config()))
                                .filter(apiThreatProtectionFilter.apply(new ApiThreatProtectionFilter.Config()))
                                .filter(botProtectionFilter.apply(new BotProtectionFilter.Config()))
                                .filter(oauth2TokenValidationFilter.apply(new Oauth2TokenValidationFilter.Config()))
                                .filter(jwtTokenEnhancerFilter.apply(new JwtTokenEnhancerFilter.Config()))
                                .filter(requestResponseLogger.apply(new RequestResponseLogger.Config()))
                                .stripPrefix(1)
                                .filter((exchange, chain) -> {
                                    var request = exchange.getRequest();
                                    var mutatedRequest = request.mutate()
                                            .header("X-Request-ID", java.util.UUID.randomUUID().toString())
                                            .build();
                                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                                }))
                        .uri("lb://merchant-service"))
                .route("catalog-service", r -> r.path("/api/catalog/**")
                        .filters(f -> f
                                .filter(securityFilterFactory.apply(new SecurityGatewayFilterFactory.Config()))
                                .filter(apiThreatProtectionFilter.apply(new ApiThreatProtectionFilter.Config()))
                                .filter(botProtectionFilter.apply(new BotProtectionFilter.Config()))
                                .filter(oauth2TokenValidationFilter.apply(new Oauth2TokenValidationFilter.Config()))
                                .filter(jwtTokenEnhancerFilter.apply(new JwtTokenEnhancerFilter.Config()))
                                .filter(requestResponseLogger.apply(new RequestResponseLogger.Config()))
                                .stripPrefix(1)
                                .filter((exchange, chain) -> {
                                    var request = exchange.getRequest();
                                    var mutatedRequest = request.mutate()
                                            .header("X-Request-ID", java.util.UUID.randomUUID().toString())
                                            .build();
                                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                                }))
                        .uri("lb://catalog-service"))
                .route("catalog-products", r -> r.path("/api/products/**")
                        .filters(f -> f
                                .filter(securityFilterFactory.apply(new SecurityGatewayFilterFactory.Config()))
                                .filter(apiThreatProtectionFilter.apply(new ApiThreatProtectionFilter.Config()))
                                .filter(botProtectionFilter.apply(new BotProtectionFilter.Config()))
                                .filter(oauth2TokenValidationFilter.apply(new Oauth2TokenValidationFilter.Config()))
                                .filter(jwtTokenEnhancerFilter.apply(new JwtTokenEnhancerFilter.Config()))
                                .filter(requestResponseLogger.apply(new RequestResponseLogger.Config()))
                                .stripPrefix(1)
                                .filter((exchange, chain) -> {
                                    var request = exchange.getRequest();
                                    var mutatedRequest = request.mutate()
                                            .header("X-Request-ID", java.util.UUID.randomUUID().toString())
                                            .build();
                                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                                }))
                        .uri("lb://catalog-service"))
                .route("catalog-categories", r -> r.path("/api/categories/**")
                        .filters(f -> f
                                .filter(securityFilterFactory.apply(new SecurityGatewayFilterFactory.Config()))
                                .filter(apiThreatProtectionFilter.apply(new ApiThreatProtectionFilter.Config()))
                                .filter(botProtectionFilter.apply(new BotProtectionFilter.Config()))
                                .filter(oauth2TokenValidationFilter.apply(new Oauth2TokenValidationFilter.Config()))
                                .filter(jwtTokenEnhancerFilter.apply(new JwtTokenEnhancerFilter.Config()))
                                .filter(requestResponseLogger.apply(new RequestResponseLogger.Config()))
                                .stripPrefix(1)
                                .filter((exchange, chain) -> {
                                    var request = exchange.getRequest();
                                    var mutatedRequest = request.mutate()
                                            .header("X-Request-ID", java.util.UUID.randomUUID().toString())
                                            .build();
                                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                                }))
                        .uri("lb://catalog-service"))
                .route("inventory-service", r -> r.path("/api/inventory/**")
                        .filters(f -> f
                                .filter(securityFilterFactory.apply(new SecurityGatewayFilterFactory.Config()))
                                .filter(apiThreatProtectionFilter.apply(new ApiThreatProtectionFilter.Config()))
                                .filter(botProtectionFilter.apply(new BotProtectionFilter.Config()))
                                .filter(oauth2TokenValidationFilter.apply(new Oauth2TokenValidationFilter.Config()))
                                .filter(jwtTokenEnhancerFilter.apply(new JwtTokenEnhancerFilter.Config()))
                                .filter(requestResponseLogger.apply(new RequestResponseLogger.Config()))
                                .stripPrefix(1)
                                .filter((exchange, chain) -> {
                                    var request = exchange.getRequest();
                                    var mutatedRequest = request.mutate()
                                            .header("X-Request-ID", java.util.UUID.randomUUID().toString())
                                            .build();
                                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                                }))
                        .uri("lb://inventory-service"))
                .route("order-service", r -> r.path("/api/orders/**")
                        .filters(f -> f
                                .filter(securityFilterFactory.apply(new SecurityGatewayFilterFactory.Config()))
                                .filter(apiThreatProtectionFilter.apply(new ApiThreatProtectionFilter.Config()))
                                .filter(botProtectionFilter.apply(new BotProtectionFilter.Config()))
                                .filter(oauth2TokenValidationFilter.apply(new Oauth2TokenValidationFilter.Config()))
                                .filter(jwtTokenEnhancerFilter.apply(new JwtTokenEnhancerFilter.Config()))
                                .filter(requestResponseLogger.apply(new RequestResponseLogger.Config()))
                                .stripPrefix(1)
                                .filter((exchange, chain) -> {
                                    var request = exchange.getRequest();
                                    var mutatedRequest = request.mutate()
                                            .header("X-Request-ID", java.util.UUID.randomUUID().toString())
                                            .build();
                                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                                }))
                        .uri("lb://order-service"))
                .route("payment-service", r -> r.path("/api/payments/**")
                        .filters(f -> f
                                .filter(securityFilterFactory.apply(new SecurityGatewayFilterFactory.Config()))
                                .filter(apiThreatProtectionFilter.apply(new ApiThreatProtectionFilter.Config()))
                                .filter(botProtectionFilter.apply(new BotProtectionFilter.Config()))
                                .filter(oauth2TokenValidationFilter.apply(new Oauth2TokenValidationFilter.Config()))
                                .filter(jwtTokenEnhancerFilter.apply(new JwtTokenEnhancerFilter.Config()))
                                .filter(requestResponseLogger.apply(new RequestResponseLogger.Config()))
                                .stripPrefix(1)
                                .filter((exchange, chain) -> {
                                    var request = exchange.getRequest();
                                    var mutatedRequest = request.mutate()
                                            .header("X-Request-ID", java.util.UUID.randomUUID().toString())
                                            .build();
                                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                                }))
                        .uri("lb://payment-service"))
                .route("delivery-service", r -> r.path("/api/delivery/**")
                        .filters(f -> f
                                .filter(securityFilterFactory.apply(new SecurityGatewayFilterFactory.Config()))
                                .filter(apiThreatProtectionFilter.apply(new ApiThreatProtectionFilter.Config()))
                                .filter(botProtectionFilter.apply(new BotProtectionFilter.Config()))
                                .filter(oauth2TokenValidationFilter.apply(new Oauth2TokenValidationFilter.Config()))
                                .filter(jwtTokenEnhancerFilter.apply(new JwtTokenEnhancerFilter.Config()))
                                .filter(requestResponseLogger.apply(new RequestResponseLogger.Config()))
                                .stripPrefix(1)
                                .filter((exchange, chain) -> {
                                    var request = exchange.getRequest();
                                    var mutatedRequest = request.mutate()
                                            .header("X-Request-ID", java.util.UUID.randomUUID().toString())
                                            .build();
                                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                                }))
                        .uri("lb://delivery-service"))
                .route("notification-service", r -> r.path("/api/notifications/**")
                        .filters(f -> f
                                .filter(securityFilterFactory.apply(new SecurityGatewayFilterFactory.Config()))
                                .filter(apiThreatProtectionFilter.apply(new ApiThreatProtectionFilter.Config()))
                                .filter(botProtectionFilter.apply(new BotProtectionFilter.Config()))
                                .filter(oauth2TokenValidationFilter.apply(new Oauth2TokenValidationFilter.Config()))
                                .filter(jwtTokenEnhancerFilter.apply(new JwtTokenEnhancerFilter.Config()))
                                .filter(requestResponseLogger.apply(new RequestResponseLogger.Config()))
                                .stripPrefix(1)
                                .filter((exchange, chain) -> {
                                    var request = exchange.getRequest();
                                    var mutatedRequest = request.mutate()
                                            .header("X-Request-ID", java.util.UUID.randomUUID().toString())
                                            .build();
                                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                                }))
                        .uri("lb://notification-service"))
                .route("wallet-service", r -> r.path("/api/wallet/**")
                        .filters(f -> f
                                .filter(securityFilterFactory.apply(new SecurityGatewayFilterFactory.Config()))
                                .filter(apiThreatProtectionFilter.apply(new ApiThreatProtectionFilter.Config()))
                                .filter(botProtectionFilter.apply(new BotProtectionFilter.Config()))
                                .filter(oauth2TokenValidationFilter.apply(new Oauth2TokenValidationFilter.Config()))
                                .filter(jwtTokenEnhancerFilter.apply(new JwtTokenEnhancerFilter.Config()))
                                .filter(requestResponseLogger.apply(new RequestResponseLogger.Config()))
                                .stripPrefix(1)
                                .filter((exchange, chain) -> {
                                    var request = exchange.getRequest();
                                    var mutatedRequest = request.mutate()
                                            .header("X-Request-ID", java.util.UUID.randomUUID().toString())
                                            .build();
                                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                                }))
                        .uri("lb://wallet-service"))
                // Search
                .route("search-service", r -> r.path("/api/search/**")
                        .filters(f -> f
                                .filter(securityFilterFactory.apply(new SecurityGatewayFilterFactory.Config()))
                                .filter(apiThreatProtectionFilter.apply(new ApiThreatProtectionFilter.Config()))
                                .filter(botProtectionFilter.apply(new BotProtectionFilter.Config()))
                                .filter(oauth2TokenValidationFilter.apply(new Oauth2TokenValidationFilter.Config()))
                                .filter(jwtTokenEnhancerFilter.apply(new JwtTokenEnhancerFilter.Config()))
                                .filter(requestResponseLogger.apply(new RequestResponseLogger.Config()))
                                .stripPrefix(1)
                                .filter((exchange, chain) -> {
                                    var request = exchange.getRequest();
                                    var mutatedRequest = request.mutate()
                                            .header("X-Request-ID", java.util.UUID.randomUUID().toString())
                                            .build();
                                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                                }))
                        .uri("lb://search-service"))
                .build();
    }

    @Bean
    @Order(-1) // High precedence
    public SecurityWebFilterChain securityWebFilterChain(
            org.springframework.security.oauth2.jwt.ReactiveJwtDecoder jwtDecoder) {
        var http = org.springframework.security.config.web.server.ServerHttpSecurity.http();
        return http
                .csrf(csrf -> csrf.disable())
                .authorizeExchange(authz -> authz
                        .pathMatchers("/actuator/**").permitAll()
                        .pathMatchers("/v2/api-docs", "/v3/api-docs", "/swagger-resources/**", "/swagger-ui/**", "/swagger-ui.html", "/webjars/**").permitAll()
                        .pathMatchers("/api/auth/**").permitAll()
                        .anyExchange().permitAll()
                )
                .build();
    }

    @Bean
    @ConditionalOnMissingBean
    public org.springframework.security.oauth2.jwt.ReactiveJwtDecoder noopJwtDecoder() {
        // Development-only no-op decoder
        return token -> {
            throw new org.springframework.security.oauth2.jwt.BadJwtException("JWT validation not configured in dev mode");
        };
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsWebFilter(source);
    }

}