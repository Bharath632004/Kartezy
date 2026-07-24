package com.kartezy.shared.config;

import io.github.resilience4j.bulkhead.BulkheadConfig;
import io.github.resilience4j.bulkhead.BulkheadRegistry;
import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import io.github.resilience4j.retry.RetryConfig;
import io.github.resilience4j.retry.RetryRegistry;
import io.github.resilience4j.timelimiter.TimeLimiterConfig;
import io.github.resilience4j.timelimiter.TimeLimiterRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

/**
 * Resilience4j configuration for circuit breakers, retries, bulkheads, and time limiters.
 * <p>
 * Protects downstream services from cascading failures:
 * - Circuit breakers open when failure rate exceeds threshold
 * - Retries with exponential backoff for transient failures
 * - Bulkheads isolate thread pools per downstream service
 * - Time limiters cap waiting time for async operations
 * </p>
 */
@Configuration
public class ResilienceConfig {

    // ======== Circuit Breaker Configurations ========

    @Bean
    public CircuitBreakerRegistry circuitBreakerRegistry() {
        CircuitBreakerRegistry registry = CircuitBreakerRegistry.ofDefaults();

        // Payment service - sensitive to failures, open quickly
        registry.addConfiguration("payment-service", CircuitBreakerConfig.custom()
                .slidingWindowSize(10)
                .failureRateThreshold(30)
                .waitDurationInOpenState(Duration.ofSeconds(30))
                .permittedNumberOfCallsInHalfOpenState(3)
                .slowCallRateThreshold(50)
                .slowCallDurationThreshold(Duration.ofSeconds(5))
                .build());

        // Order service - critical path
        registry.addConfiguration("order-service", CircuitBreakerConfig.custom()
                .slidingWindowSize(20)
                .failureRateThreshold(40)
                .waitDurationInOpenState(Duration.ofSeconds(15))
                .permittedNumberOfCallsInHalfOpenState(5)
                .slowCallDurationThreshold(Duration.ofSeconds(3))
                .build());

        // Catalog service - read-heavy, tolerant
        registry.addConfiguration("catalog-service", CircuitBreakerConfig.custom()
                .slidingWindowSize(30)
                .failureRateThreshold(50)
                .waitDurationInOpenState(Duration.ofSeconds(10))
                .permittedNumberOfCallsInHalfOpenState(5)
                .build());

        // Delivery service - real-time
        registry.addConfiguration("delivery-service", CircuitBreakerConfig.custom()
                .slidingWindowSize(15)
                .failureRateThreshold(35)
                .waitDurationInOpenState(Duration.ofSeconds(20))
                .permittedNumberOfCallsInHalfOpenState(3)
                .build());

        // Notification service - can tolerate longer outages
        registry.addConfiguration("notification-service", CircuitBreakerConfig.custom()
                .slidingWindowSize(10)
                .failureRateThreshold(60)
                .waitDurationInOpenState(Duration.ofSeconds(60))
                .permittedNumberOfCallsInHalfOpenState(2)
                .build());

        return registry;
    }

    // ======== Retry Configurations ========

    @Bean
    public RetryRegistry retryRegistry() {
        RetryRegistry registry = RetryRegistry.ofDefaults();

        // Payment retries - conservative
        registry.addConfiguration("payment-retry", RetryConfig.custom()
                .maxAttempts(3)
                .waitDuration(Duration.ofMillis(500))
                .build());

        // Generic retry - moderate
        registry.addConfiguration("default-retry", RetryConfig.custom()
                .maxAttempts(3)
                .waitDuration(Duration.ofMillis(200))
                .build());

        // Idempotent operations - can retry more
        registry.addConfiguration("idempotent-retry", RetryConfig.custom()
                .maxAttempts(5)
                .waitDuration(Duration.ofMillis(100))
                .build());

        return registry;
    }

    // ======== Bulkhead Configurations ========

    @Bean
    public BulkheadRegistry bulkheadRegistry() {
        BulkheadRegistry registry = BulkheadRegistry.ofDefaults();

        // Payment operations - limited concurrent calls
        registry.addConfiguration("payment-bulkhead", BulkheadConfig.custom()
                .maxConcurrentCalls(5)
                .maxWaitDuration(Duration.ofMillis(500))
                .build());

        // Catalog operations - high concurrency
        registry.addConfiguration("catalog-bulkhead", BulkheadConfig.custom()
                .maxConcurrentCalls(20)
                .maxWaitDuration(Duration.ofMillis(200))
                .build());

        // Order operations
        registry.addConfiguration("order-bulkhead", BulkheadConfig.custom()
                .maxConcurrentCalls(10)
                .maxWaitDuration(Duration.ofMillis(300))
                .build());

        return registry;
    }

    // ======== Time Limiter Configurations ========

    @Bean
    public TimeLimiterRegistry timeLimiterRegistry() {
        TimeLimiterRegistry registry = TimeLimiterRegistry.ofDefaults();

        registry.addConfiguration("default-timeout", TimeLimiterConfig.custom()
                .timeoutDuration(Duration.ofSeconds(30))
                .build());

        registry.addConfiguration("quick-timeout", TimeLimiterConfig.custom()
                .timeoutDuration(Duration.ofSeconds(5))
                .build());

        return registry;
    }
}
