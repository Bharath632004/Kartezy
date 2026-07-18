package com.kartezy.shared.security.api;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class for registering security filters as Servlet filters.
 */
@Configuration
public class SecurityFilterRegistration {

    /**
     * Registers the enhanced API security filter as a servlet filter.
     * This ensures the filter is applied to all incoming requests.
     *
     * @param filter the filter to register
     * @return the filter registration bean
     */
    @Bean
    public FilterRegistrationBean<EnhancedApiSecurityFilter> loggingFilter(
            EnhancedApiSecurityFilter filter) {
        FilterRegistrationBean<EnhancedApiSecurityFilter> registrationBean
                = new FilterRegistrationBean<>();

        registrationBean.setFilter(filter);
        // Apply to all URLs - adjust as needed for your application
        registrationBean.addUrlPatterns("/*");
        // Set order to ensure it runs early in the filter chain
        registrationBean.setOrder(1);

        return registrationBean;
    }
}