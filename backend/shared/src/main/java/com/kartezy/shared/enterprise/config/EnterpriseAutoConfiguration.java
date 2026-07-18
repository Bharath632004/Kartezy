package com.kartezy.shared.enterprise.config;

import com.kartezy.shared.enterprise.currency.CurrencyResolverFilter;
import com.kartezy.shared.enterprise.i18n.LocaleResolverFilter;
import com.kartezy.shared.enterprise.multitenant.TenantFilter;
import com.kartezy.shared.enterprise.timezone.TimezoneResolverFilter;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.core.Ordered;

/**
 * Auto-configuration for Kartezy Enterprise scalability features.
 * Enables/disables enterprise features via configuration properties.
 * 
 * Properties:
 * - kartezy.enterprise.multitenant.enabled=true
 * - kartezy.enterprise.i18n.enabled=true
 * - kartezy.enterprise.currency.enabled=true
 * - kartezy.enterprise.timezone.enabled=true
 * - kartezy.enterprise.geography.enabled=true
 * - kartezy.enterprise.franchise.enabled=true
 * - kartezy.enterprise.marketplace.enabled=true
 * - kartezy.enterprise.warehouse.enabled=true
 */
@AutoConfiguration
@EnableAspectJAutoProxy
@ComponentScan(basePackages = {
        "com.kartezy.shared.enterprise.multitenant",
        "com.kartezy.shared.enterprise.i18n",
        "com.kartezy.shared.enterprise.currency",
        "com.kartezy.shared.enterprise.timezone",
        "com.kartezy.shared.enterprise.geography",
        "com.kartezy.shared.enterprise.franchise",
        "com.kartezy.shared.enterprise.marketplace",
        "com.kartezy.shared.enterprise.warehouse",
        "com.kartezy.shared.enterprise.vendor",
        "com.kartezy.shared.enterprise.whitelabel"
})
public class EnterpriseAutoConfiguration {

    /**
     * Register enterprise filters in the correct order.
     * 1. TenantFilter - resolve tenant context first
     * 2. LocaleResolverFilter - resolve language
     * 3. CurrencyResolverFilter - resolve currency
     * 4. TimezoneResolverFilter - resolve timezone
     */
    @Bean
    @ConditionalOnProperty(name = "kartezy.enterprise.multitenant.enabled", 
            havingValue = "true", matchIfMissing = true)
    public FilterRegistrationBean<TenantFilter> tenantFilterRegistration(TenantFilter filter) {
        FilterRegistrationBean<TenantFilter> registration = new FilterRegistrationBean<>(filter);
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE);
        registration.addUrlPatterns("/*");
        return registration;
    }

    @Bean
    @ConditionalOnProperty(name = "kartezy.enterprise.i18n.enabled",
            havingValue = "true", matchIfMissing = true)
    public FilterRegistrationBean<LocaleResolverFilter> localeFilterRegistration(LocaleResolverFilter filter) {
        FilterRegistrationBean<LocaleResolverFilter> registration = new FilterRegistrationBean<>(filter);
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE + 1);
        registration.addUrlPatterns("/*");
        return registration;
    }

    @Bean
    @ConditionalOnProperty(name = "kartezy.enterprise.currency.enabled",
            havingValue = "true", matchIfMissing = true)
    public FilterRegistrationBean<CurrencyResolverFilter> currencyFilterRegistration(CurrencyResolverFilter filter) {
        FilterRegistrationBean<CurrencyResolverFilter> registration = new FilterRegistrationBean<>(filter);
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE + 2);
        registration.addUrlPatterns("/*");
        return registration;
    }

    @Bean
    @ConditionalOnProperty(name = "kartezy.enterprise.timezone.enabled",
            havingValue = "true", matchIfMissing = true)
    public FilterRegistrationBean<TimezoneResolverFilter> timezoneFilterRegistration(TimezoneResolverFilter filter) {
        FilterRegistrationBean<TimezoneResolverFilter> registration = new FilterRegistrationBean<>(filter);
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE + 3);
        registration.addUrlPatterns("/*");
        return registration;
    }
}
