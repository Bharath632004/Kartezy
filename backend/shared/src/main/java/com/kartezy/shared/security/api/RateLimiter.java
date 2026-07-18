package com.kartezy.shared.security.api;

import java.util.concurrent.TimeUnit;

/**
 * Interface for rate limiting.
 */
public interface RateLimiter {

    /**
     * Checks if the request is allowed based on the key (e.g., IP address, user ID).
     *
     * @param key   the identifier for the client (e.g., IP address)
     * @param limit the maximum number of requests allowed in the time window
     * @param unit  the time unit for the window
     * @return true if the request is allowed, false if it should be rate-limited
     */
    boolean isAllowed(String key, int limit, long duration, TimeUnit unit);
}