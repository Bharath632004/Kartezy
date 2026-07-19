package com.kartezy.ops.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import static com.kartezy.ops.constants.OpsConstants.*;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager(
            CACHE_CITIES, CACHE_ZONES, CACHE_RULES, CACHE_SLA, CACHE_DASHBOARD
        );
    }
}
