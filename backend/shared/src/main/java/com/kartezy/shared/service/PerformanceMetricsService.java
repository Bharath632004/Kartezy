package com.kartezy.shared.service;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Service for tracking custom performance metrics and business KPIs.
 * <p>
 * Metrics are exposed via /actuator/prometheus for Prometheus scraping.
 * Includes:
 * - Request latency percentiles (p50, p95, p99)
 * - Business transaction counts
 * - Error rates by type
 * - Cache performance
 * - Database connection pool metrics
 * - Rate limit counters
 * </p>
 */
@Service
public class PerformanceMetricsService {

    private static final Logger log = LoggerFactory.getLogger(PerformanceMetricsService.class);

    private final MeterRegistry meterRegistry;

    // Business counters
    private Counter ordersCreated;
    private Counter ordersCompleted;
    private Counter ordersCancelled;
    private Counter paymentsProcessed;
    private Counter paymentsFailed;
    private Counter loginsSuccessful;
    private Counter loginsFailed;
    private Counter registrationsNew;
    private Counter notificationsSent;

    // Latency timers
    private Timer apiLatency;
    private Timer dbQueryLatency;
    private Timer externalApiLatency;
    private Timer cacheLatency;

    public PerformanceMetricsService(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
    }

    @PostConstruct
    public void init() {
        // Business counters
        ordersCreated = Counter.builder("kartezy.orders.created")
                .description("Total orders created").register(meterRegistry);
        ordersCompleted = Counter.builder("kartezy.orders.completed")
                .description("Total orders delivered").register(meterRegistry);
        ordersCancelled = Counter.builder("kartezy.orders.cancelled")
                .description("Total orders cancelled").register(meterRegistry);
        paymentsProcessed = Counter.builder("kartezy.payments.processed")
                .description("Total payments processed").register(meterRegistry);
        paymentsFailed = Counter.builder("kartezy.payments.failed")
                .description("Total payments failed").register(meterRegistry);
        loginsSuccessful = Counter.builder("kartezy.auth.logins.success")
                .description("Successful logins").register(meterRegistry);
        loginsFailed = Counter.builder("kartezy.auth.logins.failed")
                .description("Failed logins").register(meterRegistry);
        registrationsNew = Counter.builder("kartezy.auth.registrations")
                .description("New user registrations").register(meterRegistry);
        notificationsSent = Counter.builder("kartezy.notifications.sent")
                .description("Total notifications sent").register(meterRegistry);

        // Latency timers
        apiLatency = Timer.builder("kartezy.api.latency")
                .description("API request latency")
                .publishPercentiles(0.5, 0.95, 0.99)
                .publishPercentileHistogram(true)
                .register(meterRegistry);
        dbQueryLatency = Timer.builder("kartezy.db.query.latency")
                .description("Database query latency")
                .publishPercentiles(0.5, 0.95, 0.99)
                .register(meterRegistry);
        externalApiLatency = Timer.builder("kartezy.external.api.latency")
                .description("External API call latency")
                .publishPercentiles(0.5, 0.95, 0.99)
                .register(meterRegistry);
        cacheLatency = Timer.builder("kartezy.cache.latency")
                .description("Cache operation latency")
                .publishPercentiles(0.5, 0.95, 0.99)
                .register(meterRegistry);

        // Track concurrent active users via gauge
        meterRegistry.gauge("kartezy.users.active", new AtomicLong(0));

        log.info("Performance metrics initialized with {} meters",
                meterRegistry.getMeters().size());
    }

    // ======== Order Metrics ========

    public void recordOrderCreated() { ordersCreated.increment(); }
    public void recordOrderCompleted() { ordersCompleted.increment(); }
    public void recordOrderCancelled() { ordersCancelled.increment(); }

    // ======== Payment Metrics ========

    public void recordPaymentProcessed() { paymentsProcessed.increment(); }
    public void recordPaymentFailed() { paymentsFailed.increment(); }

    // ======== Auth Metrics ========

    public void recordLoginSuccess() { loginsSuccessful.increment(); }
    public void recordLoginFailure() { loginsFailed.increment(); }
    public void recordRegistration() { registrationsNew.increment(); }

    // ======== Notification Metrics ========

    public void recordNotificationSent(String channel) {
        notificationsSent.increment();
        meterRegistry.counter("kartezy.notifications.by_channel",
                "channel", channel).increment();
    }

    // ======== Latency Recording ========

    public Timer.Sample startApiTimer() {
        return Timer.start(meterRegistry);
    }

    public void stopApiTimer(Timer.Sample sample) {
        sample.stop(apiLatency);
    }

    public Timer.Sample startDbTimer() {
        return Timer.start(meterRegistry);
    }

    public void stopDbTimer(Timer.Sample sample) {
        sample.stop(dbQueryLatency);
    }

    public Timer.Sample startExternalApiTimer() {
        return Timer.start(meterRegistry);
    }

    public void stopExternalApiTimer(Timer.Sample sample) {
        sample.stop(externalApiLatency);
    }

    // ======== Error Tracking ========

    public void recordError(String service, String errorType) {
        meterRegistry.counter("kartezy.errors.total",
                "service", service, "errorType", errorType).increment();
    }

    // ======== Business KPIs ========

    public void recordRevenue(double amount, String currency) {
        meterRegistry.counter("kartezy.revenue.total",
                "currency", currency).increment(amount);
    }

    public void recordActiveUser(String userId) {
        // Track active users via gauge (updated periodically)
        meterRegistry.gauge("kartezy.users.active",
                java.util.Collections.singletonList(io.micrometer.core.instrument.Tag.of("user", userId)),
                new AtomicLong(1));
    }

    public void recordConcurrentSessions(int count) {
        meterRegistry.gauge("kartezy.sessions.concurrent", new AtomicLong(count));
    }

    /**
     * Gets current meter count for health check.
     */
    public int getMeterCount() {
        return meterRegistry.getMeters().size();
    }
}
