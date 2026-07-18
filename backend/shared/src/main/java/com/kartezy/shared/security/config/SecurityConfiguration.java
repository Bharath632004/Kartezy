package com.kartezy.shared.security.config;

import com.kartezy.shared.security.audit.AuditEventRepository;
import com.kartezy.shared.security.audit.AuditLogService;
import com.kartezy.shared.security.audit.AuditLogServiceImpl;
import com.kartezy.shared.security.api.FixedWindowRateLimiter;
import com.kartezy.shared.security.api.RateLimiter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Conditional;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;

/**
 * Auto-configuration for the Kartezy Security module.
 * <p>
 * This configuration class provides beans for the security features when the required dependencies are present.
 * </p>
 */
@Configuration
public class SecurityConfiguration {

    /**
     * Configures a RateLimiter bean if no other bean of type RateLimiter is defined.
     * Uses an in-memory fixed-window rate limiter.
     */
    @Bean
    @ConditionalOnMissingBean(RateLimiter.class)
    public RateLimiter rateLimiter() {
        return new FixedWindowRateLimiter();
    }

    /**
     * Configures an AuditLogService bean if an AuditEventRepository is present.
     * This allows the audit service to persist events to a database.
     */
    @Bean
    @ConditionalOnBean(AuditEventRepository.class)
    public AuditLogService auditLogService(AuditEventRepository auditEventRepository) {
        return new AuditLogServiceImpl(auditEventRepository);
    }

    // Note: We do not create beans for AESUtil, SecretUtils, etc. as they are stateless utility classes.
    // The SecretsManager implementation is left to the user to provide based on their secret store.
}