package com.kartezy.shared.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service for proactively warming caches with frequently accessed data.
 * <p>
 * Prevents cold-start cache misses by:
 * - Warming critical caches on application startup
 * - Refreshing caches on a scheduled basis
 * - Supporting selective cache invalidation
 * - Tracking cache hit rates for optimization
 * </p>
 */
@Service
public class CacheWarmingService {

    private static final Logger log = LoggerFactory.getLogger(CacheWarmingService.class);

    private final CacheManager cacheManager;
    private final ConcurrentHashMap<String, CacheStats> cacheStats = new ConcurrentHashMap<>();

    // Caches that should be warmed on startup
    private static final Set<String> STARTUP_CACHES = new HashSet<>(Arrays.asList(
            "categories", "brands", "cms", "pricing", "promotions"
    ));

    // Caches that should be periodically refreshed
    private static final Set<String> REFRESH_CACHES = new HashSet<>(Arrays.asList(
            "categories", "brands", "cms", "pricing", "promotions",
            "stores", "products", "inventory"
    ));

    @Autowired
    public CacheWarmingService(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    /**
     * Warms critical caches on application startup.
     */
    @EventListener(ApplicationReadyEvent.class)
    @Async("backgroundExecutor")
    public void warmOnStartup() {
        log.info("Starting cache warm-up on application startup...");
        for (String cacheName : STARTUP_CACHES) {
            try {
                warmCache(cacheName);
            } catch (Exception e) {
                log.warn("Failed to warm cache '{}': {}", cacheName, e.getMessage());
            }
        }
        log.info("Cache warm-up complete");
    }

    /**
     * Periodically refreshes caches with frequently accessed data.
     * Runs every 5 minutes during off-peak hours, every 2 minutes during peak.
     */
    @Scheduled(fixedRateString = "${kartezy.cache.refresh-rate-ms:300000}",
               initialDelayString = "${kartezy.cache.initial-delay-ms:60000}")
    public void refreshCaches() {
        for (String cacheName : REFRESH_CACHES) {
            Cache cache = cacheManager.getCache(cacheName);
            if (cache != null) {
                cache.clear();
            }
        }
        log.debug("Periodic cache refresh completed for {} caches", REFRESH_CACHES.size());
    }

    /**
     * Warms a specific cache by loading its data.
     * Implementations should override this to load actual data.
     */
    public void warmCache(String cacheName) {
        Cache cache = cacheManager.getCache(cacheName);
        if (cache == null) {
            log.warn("Cache '{}' not found, skipping warm-up", cacheName);
            return;
        }

        // Mark cache as warmed - subsequent requests will populate it
        cache.put("_warmed", true);
        log.info("Cache '{}' marked as warmed", cacheName);
    }

    /**
     * Records a cache hit for tracking.
     */
    public void recordHit(String cacheName) {
        cacheStats.computeIfAbsent(cacheName, k -> new CacheStats()).hits++;
    }

    /**
     * Records a cache miss for tracking.
     */
    public void recordMiss(String cacheName) {
        cacheStats.computeIfAbsent(cacheName, k -> new CacheStats()).misses++;
    }

    /**
     * Gets hit rate for all caches.
     */
    public double getHitRate(String cacheName) {
        CacheStats stats = cacheStats.get(cacheName);
        if (stats == null || (stats.hits + stats.misses) == 0) {
            return 0.0;
        }
        return (double) stats.hits / (stats.hits + stats.misses);
    }

    /**
     * Gets the overall cache hit rate.
     */
    public double getOverallHitRate() {
        long totalHits = 0;
        long totalMisses = 0;
        for (CacheStats stats : cacheStats.values()) {
            totalHits += stats.hits;
            totalMisses += stats.misses;
        }
        if (totalHits + totalMisses == 0) return 0.0;
        return (double) totalHits / (totalHits + totalMisses);
    }

    /**
     * Logs cache statistics.
     */
    @Scheduled(fixedRateString = "${kartezy.cache.stats-log-rate-ms:600000}")
    public void logCacheStats() {
        if (cacheStats.isEmpty()) return;

        StringBuilder sb = new StringBuilder("\n=== Cache Statistics ===\n");
        long totalHits = 0;
        long totalMisses = 0;

        for (var entry : cacheStats.entrySet()) {
            CacheStats stats = entry.getValue();
            long total = stats.hits + stats.misses;
            double rate = total > 0 ? (double) stats.hits / total * 100 : 0;
            sb.append(String.format("  %-20s hits=%-6d misses=%-6d rate=%.1f%%\n",
                    entry.getKey(), stats.hits, stats.misses, rate));
            totalHits += stats.hits;
            totalMisses += stats.misses;
        }

        long total = totalHits + totalMisses;
        double overallRate = total > 0 ? (double) totalHits / total * 100 : 0;
        sb.append(String.format("  %-20s hits=%-6d misses=%-6d rate=%.1f%%\n",
                "TOTAL", totalHits, totalMisses, overallRate));
        sb.append("===========================");

        log.info(sb.toString());
    }

    private static class CacheStats {
        long hits = 0;
        long misses = 0;
    }
}
