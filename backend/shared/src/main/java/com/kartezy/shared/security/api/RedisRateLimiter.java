package com.kartezy.shared.security.api;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.RedisScript;

import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;
import java.util.concurrent.TimeUnit;

/**
 * Distributed Redis-backed rate limiter using the sliding window algorithm.
 * <p>
 * Uses Lua scripting for atomic counter operations.
 * Suitable for production clusters where in-memory rate limiting doesn't work
 * across multiple instances.
 * </p>
 */
public class RedisRateLimiter implements RateLimiter {

    private final RedisTemplate<String, String> redisTemplate;

    private static final String SLIDING_WINDOW_LUA =
            "local key = KEYS[1] " +
            "local now = tonumber(ARGV[1]) " +
            "local window = tonumber(ARGV[2]) " +
            "local limit = tonumber(ARGV[3]) " +
            "local windowStart = now - window " +
            "redis.call('ZREMRANGEBYSCORE', key, 0, windowStart) " +
            "local current = redis.call('ZCARD', key) " +
            "if current < limit then " +
            "  redis.call('ZADD', key, now, now) " +
            "  redis.call('EXPIRE', key, math.ceil(window / 1000) + 1) " +
            "  return 1 " +
            "else " +
            "  return 0 " +
            "end";

    private static final RedisScript<Long> RATE_LIMIT_SCRIPT =
            RedisScript.of(SLIDING_WINDOW_LUA, Long.class);

    private static final String FIXED_WINDOW_LUA =
            "local key = KEYS[1] " +
            "local limit = tonumber(ARGV[1]) " +
            "local ttl = tonumber(ARGV[2]) " +
            "local current = redis.call('INCR', key) " +
            "if current == 1 then " +
            "  redis.call('PEXPIRE', key, ttl) " +
            "end " +
            "if current <= limit then " +
            "  return 1 " +
            "else " +
            "  return 0 " +
            "end";

    private static final RedisScript<Long> FIXED_WINDOW_SCRIPT =
            RedisScript.of(FIXED_WINDOW_LUA, Long.class);

    public RedisRateLimiter(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public boolean isAllowed(String key, int limit, long duration, TimeUnit unit) {
        return slidingWindowIsAllowed(key, limit, unit.toMillis(duration));
    }

    /**
     * Sliding window rate limiting using Redis sorted sets.
     * More accurate than fixed window, prevents burst traffic at window boundaries.
     */
    public boolean slidingWindowIsAllowed(String key, int limit, long windowMillis) {
        String redisKey = "rate_limit:sw:" + key;
        long now = Instant.now().toEpochMilli();

        Long result = redisTemplate.execute(
                RATE_LIMIT_SCRIPT,
                Arrays.asList(redisKey),
                String.valueOf(now),
                String.valueOf(windowMillis),
                String.valueOf(limit)
        );
        return result != null && result == 1;
    }

    /**
     * Simple fixed window rate limiting using Redis INCR + EXPIRE.
     * Less accurate than sliding window but uses less memory.
     */
    public boolean fixedWindowIsAllowed(String key, int limit, long ttlMillis) {
        String redisKey = "rate_limit:fw:" + key;

        Long result = redisTemplate.execute(
                FIXED_WINDOW_SCRIPT,
                Arrays.asList(redisKey),
                String.valueOf(limit),
                String.valueOf(ttlMillis)
        );
        return result != null && result == 1;
    }

    /**
     * Token bucket algorithm for burst-tolerant rate limiting.
     */
    public boolean tryConsume(String key, int tokens, int capacity, double refillPerSecond) {
        String redisKey = "rate_limit:tb:" + key;
        String now = String.valueOf(Instant.now().getEpochSecond());

        String lua = "local key = KEYS[1] " +
                "local tokens = tonumber(ARGV[1]) " +
                "local capacity = tonumber(ARGV[2]) " +
                "local refillRate = tonumber(ARGV[3]) " +
                "local now = tonumber(ARGV[4]) " +
                "local bucket = redis.call('HMGET', key, 'tokens', 'timestamp') " +
                "local currentTokens = tonumber(bucket[1]) or capacity " +
                "local lastRefill = tonumber(bucket[2]) or now " +
                "local elapsed = math.max(0, now - lastRefill) " +
                "local newTokens = math.min(capacity, currentTokens + elapsed * refillRate) " +
                "if newTokens >= tokens then " +
                "  redis.call('HMSET', key, 'tokens', newTokens - tokens, 'timestamp', now) " +
                "  redis.call('EXPIRE', key, 86400) " +
                "  return 1 " +
                "else " +
                "  return 0 " +
                "end";

        Long result = redisTemplate.execute(
                RedisScript.of(lua, Long.class),
                Arrays.asList(redisKey),
                String.valueOf(tokens),
                String.valueOf(capacity),
                String.valueOf(refillPerSecond),
                now
        );
        return result != null && result == 1;
    }

    /**
     * Gets the current count for a rate limit key.
     */
    public long getCurrentCount(String key) {
        String count = redisTemplate.opsForValue().get("rate_limit:fw:" + key);
        return count != null ? Long.parseLong(count) : 0;
    }

    /**
     * Resets the rate limit counter for a key.
     */
    public void reset(String key) {
        redisTemplate.delete("rate_limit:sw:" + key);
        redisTemplate.delete("rate_limit:fw:" + key);
        redisTemplate.delete("rate_limit:tb:" + key);
    }
}
