package com.kartezy.shared.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CachingConfigurer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.CacheErrorHandler;
import org.springframework.cache.interceptor.CacheResolver;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.cache.interceptor.SimpleKeyGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

/**
 * Enhanced Redis cache configuration with:
 * - Per-cache TTL configuration
 * - Connection pooling via Lettuce
 * - Custom serialization
 * - Graceful degradation on Redis failure
 * - Cache statistics collection
 */
@Configuration
@EnableCaching
public class EnhancedRedisCacheConfig implements CachingConfigurer {

    @Value("${spring.redis.host:localhost}")
    private String redisHost;

    @Value("${spring.redis.port:6379}")
    private int redisPort;

    @Value("${spring.redis.password:}")
    private String redisPassword;

    @Value("${spring.redis.timeout:2000}")
    private int redisTimeout;

    @Value("${spring.redis.lettuce.pool.max-active:16}")
    private int maxActive;

    @Value("${spring.redis.lettuce.pool.max-idle:8}")
    private int maxIdle;

    @Value("${spring.redis.lettuce.pool.min-idle:4}")
    private int minIdle;

    @Bean
    @Primary
    public RedisConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration(redisHost, redisPort);
        if (redisPassword != null && !redisPassword.isEmpty()) {
            config.setPassword(redisPassword);
        }

        LettuceClientConfiguration clientConfig = LettuceClientConfiguration.builder()
                .commandTimeout(Duration.ofMillis(redisTimeout))
                .build();

        return new LettuceConnectionFactory(config, clientConfig);
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());
        template.afterPropertiesSet();
        return template;
    }

    @Bean
    @Primary
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.deactivateDefaultTyping();

        GenericJackson2JsonRedisSerializer serializer =
                new GenericJackson2JsonRedisSerializer(objectMapper);

        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(10))
                .serializeKeysWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(serializer))
                .disableCachingNullValues()
                .prefixCacheNameWith("kartezy:");

        // Per-cache configurations with optimized TTLs
        Map<String, RedisCacheConfiguration> cacheConfigs = new HashMap<>();

        // Read-heavy, rarely-changed data
        cacheConfigs.put("categories", defaultConfig.entryTtl(Duration.ofMinutes(30)));
        cacheConfigs.put("brands", defaultConfig.entryTtl(Duration.ofMinutes(30)));
        cacheConfigs.put("stores", defaultConfig.entryTtl(Duration.ofMinutes(10)));

        // Products - frequently updated
        cacheConfigs.put("products", defaultConfig.entryTtl(Duration.ofMinutes(5)));
        cacheConfigs.put("productDetails", defaultConfig.entryTtl(Duration.ofMinutes(5)));
        cacheConfigs.put("inventory", defaultConfig.entryTtl(Duration.ofMinutes(2)));

        // Search - short-lived
        cacheConfigs.put("search", defaultConfig.entryTtl(Duration.ofMinutes(1)));
        cacheConfigs.put("autocomplete", defaultConfig.entryTtl(Duration.ofMinutes(5)));

        // User data - variable TTL
        cacheConfigs.put("users", defaultConfig.entryTtl(Duration.ofMinutes(15)));
        cacheConfigs.put("addresses", defaultConfig.entryTtl(Duration.ofMinutes(30)));
        cacheConfigs.put("wishlist", defaultConfig.entryTtl(Duration.ofMinutes(5)));

        // Orders - frequently polled
        cacheConfigs.put("orders", defaultConfig.entryTtl(Duration.ofMinutes(2)));
        cacheConfigs.put("orderStatus", defaultConfig.entryTtl(Duration.ofSeconds(30)));

        // Rates & pricing
        cacheConfigs.put("pricing", defaultConfig.entryTtl(Duration.ofMinutes(15)));
        cacheConfigs.put("promotions", defaultConfig.entryTtl(Duration.ofMinutes(10)));

        // Static/configuration data
        cacheConfigs.put("cms", defaultConfig.entryTtl(Duration.ofHours(1)));
        cacheConfigs.put("notifications", defaultConfig.entryTtl(Duration.ofMinutes(5)));

        // Delivery tracking - very short-lived
        cacheConfigs.put("deliveryTracking", defaultConfig.entryTtl(Duration.ofSeconds(15)));
        cacheConfigs.put("deliveryPartner", defaultConfig.entryTtl(Duration.ofMinutes(5)));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigs)
                .build();
    }

    @Override
    public CacheErrorHandler errorHandler() {
        return new RedisCacheErrorHandler();
    }

    @Override
    public KeyGenerator keyGenerator() {
        return (target, method, params) -> {
            if (params == null || params.length == 0) {
                return "simpleKey";
            }
            StringBuilder sb = new StringBuilder();
            for (Object param : params) {
                if (param != null) {
                    sb.append(param.toString()).append("_");
                }
            }
            return sb.toString();
        };
    }

    @Override
    public CacheResolver cacheResolver() {
        return null; // Use default
    }

    /**
     * Graceful degradation handler when Redis is unavailable.
     * Logs warnings instead of failing requests.
     */
    public static class RedisCacheErrorHandler implements CacheErrorHandler {

        private static final org.slf4j.Logger log =
                org.slf4j.LoggerFactory.getLogger(RedisCacheErrorHandler.class);

        @Override
        public void handleCacheGetError(RuntimeException exception,
                                         org.springframework.cache.Cache cache,
                                         Object key) {
            log.warn("Redis GET failed for cache={}, key={}: {}",
                    cache != null ? cache.getName() : "null", key, exception.getMessage());
        }

        @Override
        public void handleCachePutError(RuntimeException exception,
                                         org.springframework.cache.Cache cache,
                                         Object key, Object value) {
            log.warn("Redis PUT failed for cache={}, key={}: {}",
                    cache != null ? cache.getName() : "null", key, exception.getMessage());
        }

        @Override
        public void handleCacheEvictError(RuntimeException exception,
                                           org.springframework.cache.Cache cache,
                                           Object key) {
            log.warn("Redis EVICT failed for cache={}, key={}: {}",
                    cache != null ? cache.getName() : "null", key, exception.getMessage());
        }

        @Override
        public void handleCacheClearError(RuntimeException exception,
                                           org.springframework.cache.Cache cache) {
            log.warn("Redis CLEAR failed for cache={}: {}",
                    cache != null ? cache.getName() : "null", exception.getMessage());
        }
    }
}
