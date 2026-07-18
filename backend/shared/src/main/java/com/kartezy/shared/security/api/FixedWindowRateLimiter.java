package com.kartezy.shared.security.api;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * A simple fixed-window rate limiter using an in-memory cache.
 * <p>
 * Note: This implementation is not suitable for distributed systems without a shared cache.
 * For production use in a cluster, consider using Redis-based rate limiting.
 * </p>
 */
public class FixedWindowRateLimiter implements RateLimiter {

    private static class CacheEntry {
        final AtomicInteger count;
        final long expiryTime;

        CacheEntry(int count, long expiryTime) {
            this.count = new AtomicInteger(count);
            this.expiryTime = expiryTime;
        }
    }

    private final Map<String, CacheEntry> cache = new ConcurrentHashMap<>();
    private final ScheduledThreadPoolExecutor cleanupExecutor = new ScheduledThreadPoolExecutor(1);

    public FixedWindowRateLimiter() {
        // Schedule a cleanup task to remove expired entries every minute
        cleanupExecutor.scheduleAtFixedRate(this::cleanupExpiredEntries, 1, 1, TimeUnit.MINUTES);
    }

    @Override
    public boolean isAllowed(String key, int limit, long duration, TimeUnit unit) {
        long now = System.currentTimeMillis();
        long expiry = now + unit.toMillis(duration);

        CacheEntry entry = cache.compute(key, (k, oldEntry) -> {
            if (oldEntry == null || now > oldEntry.expiryTime) {
                // Expired or not present, start a new window
                return new CacheEntry(1, expiry);
            } else {
                int currentCount = oldEntry.count.incrementAndGet();
                if (currentCount > limit) {
                    // Exceeded the limit
                    return oldEntry;
                }
                return oldEntry;
            }
        });

        // If we created a new entry, it's allowed (count=1)
        // If we updated an existing entry, check if we exceeded the limit
        return entry.count.get() <= limit;
    }

    private void cleanupExpiredEntries() {
        long now = System.currentTimeMillis();
        cache.entrySet().removeIf(entry -> now > entry.getValue().expiryTime);
    }

    /**
     * Shuts down the background cleanup executor.
     * Should be called when the application is shutting down to prevent resource leaks.
     */
    public void destroy() {
        cleanupExecutor.shutdown();
        try {
            if (!cleanupExecutor.awaitTermination(5, TimeUnit.SECONDS)) {
                cleanupExecutor.shutdownNow();
            }
        } catch (InterruptedException e) {
            cleanupExecutor.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}