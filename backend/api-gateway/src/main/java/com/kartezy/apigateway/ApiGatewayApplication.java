package com.kartezy.apigateway;

import com.kartezy.apigateway.AdvancedRateLimiter;
import com.kartezy.apigateway.ApiThreatProtectionFilter;
import com.kartezy.apigateway.BotProtectionFilter;
import com.kartezy.apigateway.JwtTokenEnhancerFilter;
import com.kartezy.apigateway.Oauth2TokenValidationFilter;
import com.kartezy.apigateway.RequestResponseLogger;
import com.kartezy.apigateway.SecurityGatewayFilterFactory;
import com.kartezy.shared.security.api.EnhancedApiSecurityFilter;
import com.kartezy.shared.security.api.SecurityHeadersConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
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
@SpringBootApplication(scanBasePackages = {"com.kartezy.apigateway", "com.kartezy.shared"})
@EnableDiscoveryClient
public class ApiGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    @Primary
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
                .route("review-service", r -> r.path("/api/reviews/**")
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
                        .uri("lb://review-service"))
                .route("recommendation-service", r -> r.path("/api/recommendations/**")
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
                        .uri("lb://recommendation-service"))
                .route("analytics-service", r -> r.path("/api/analytics/**")
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
                        .uri("lb://analytics-service"))
                .route("voice-service", r -> r.path("/api/voice/**")
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
                        .uri("lb://voice-service"))
                .route("forecasting-service", r -> r.path("/api/forecasting/**")
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
                        .uri("lb://forecasting-service"))
                .route("fraud-detection-service", r -> r.path("/api/fraud-detection/**")
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
                        .uri("lb://fraud-detection-service"))
                .route("chatbot-service", r -> r.path("/api/chatbot/**")
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
                        .uri("lb://chatbot-service"))
                .route("ocr-service", r -> r.path("/api/ocr/**")
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
                        .uri("lb://ocr-service"))
                .route("computer-vision-service", r -> r.path("/api/computer-vision/**")
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
                        .uri("lb://computer-vision-service"))
                .route("nlp-service", r -> r.path("/api/nlp/**")
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
                        .uri("lb://nlp-service"))
                .build();
    }

    @Bean
    @Order(-1) // High precedence
    public SecurityWebFilterChain securityWebFilterChain(org.springframework.security.config.web.server.ServerHttpSecurity http) {
        return http
                .csrf(csrf -> csrf.disable())
                .authorizeExchange(authz -> authz
                        .pathMatchers("/actuator/**").permitAll()
                        .pathMatchers("/v2/api-docs", "/v3/api-docs", "/swagger-resources/**", "/swagger-ui/**", "/swagger-ui.html", "/webjars/**").permitAll()
                        .pathMatchers("/api/auth/**").permitAll()
                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(Customizer.withDefaults())
                )
                .build();
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

    /**
     * Registers the enhanced API security filter as a servlet filter.
     * This provides an additional layer of protection for servlet-based requests.
     */
    @Bean
    public org.springframework.boot.web.servlet.FilterRegistrationBean<EnhancedApiSecurityFilter> loggingFilter(
            EnhancedApiSecurityFilter filter) {
        org.springframework.boot.web.servlet.FilterRegistrationBean<EnhancedApiSecurityFilter> registrationBean
                = new org.springframework.boot.web.servlet.FilterRegistrationBean<>();

        registrationBean.setFilter(filter);
        // Apply to all URLs - adjust as needed for your application
        registrationBean.addUrlPatterns("/*");
        // Set order to ensure it runs early in the filter chain
        registrationBean.setOrder(1);

        return registrationBean;
    }
}