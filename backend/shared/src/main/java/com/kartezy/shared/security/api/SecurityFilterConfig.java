package com.kartezy.shared.security.api;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class for registering security filters and interceptors.
 */
@Configuration
public class SecurityFilterConfig {

    /**
     * Registers the enhanced API security filter.
     * In a real application, this would be registered as a Filter bean.
     * For simplicity in this example, we're showing how it would be configured.
     */
    @Bean
    public EnhancedApiSecurityFilter enhancedApiSecurityFilter() {
        // These values would typically come from configuration properties
        return new EnhancedApiSecurityFilter(
                true,  // blockSqlInjection
                true,  // blockNosqlInjection
                true,  // blockXss
                true,  // blockCommandInjection
                true,  // blockPathTraversal
                true,  // blockSsrf
                false  // sanitizeInputs (we choose to block rather than sanitize)
        );
    }
}