package com.kartezy.shared.security.config;

import com.kartezy.shared.security.audit.AuditEventRepository;
import com.kartezy.shared.security.audit.AuditLogService;
import com.kartezy.shared.security.audit.AuditLogServiceImpl;
import com.kartezy.shared.security.audit.EnhancedAuditEventRepository;
import com.kartezy.shared.security.audit.EnhancedAuditLogService;
import com.kartezy.shared.security.audit.EnhancedAuditLogServiceImpl;
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
     * Configures an EnhancedAuditLogService bean if an EnhancedAuditEventRepository is present.
     * This provides tamper-evident audit logging with cryptographic hashing.
     * Falls back to the basic AuditLogService if enhanced repository is not available.
     */
    @Bean
    @ConditionalOnMissingBean
    public AuditLogService auditLogService(AuditEventRepository auditEventRepository,
                                           EnhancedAuditLogService enhancedAuditLogService) {
        // If enhanced service is available, use it (it implements AuditLogService)
        // Otherwise, fall back to basic implementation
        return (enhancedAuditLogService != null) ? enhancedAuditLogService : new AuditLogServiceImpl(auditEventRepository);
    }

    /**
     * Configures an EnhancedAuditLogService bean if an EnhancedAuditEventRepository is present.
     * This provides the enhanced audit logging functionality with integrity protection.
     */
    @Bean
    @ConditionalOnBean(EnhancedAuditEventRepository.class)
    public EnhancedAuditLogService enhancedAuditLogService(EnhancedAuditEventRepository enhancedAuditEventRepository,
                                                           AuditEventRepository auditEventRepository) {
        return new EnhancedAuditLogServiceImpl(enhancedAuditEventRepository, auditEventRepository);
    }

    // Note: We do not create beans for AESUtil, SecretUtils, etc. as they are stateless utility classes.
    // The SecretsManager implementation is left to the user to provide based on their secret store.
}