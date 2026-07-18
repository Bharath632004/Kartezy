package com.kartezy.shared.enterprise.whitelabel;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * White Label service that provides brand customization per tenant.
 * Supports full brand theming, custom domains, and feature flags.
 */
@Slf4j
@Service
public class WhiteLabelService {

    private final Map<String, WhiteLabelConfig> configCache = new ConcurrentHashMap<>();

    /**
     * Get white label configuration for a tenant.
     */
    public WhiteLabelConfig getConfig(String tenantId) {
        return configCache.getOrDefault(tenantId, getDefaultConfig());
    }

    /**
     * Apply white label configuration for a tenant.
     */
    public void applyConfig(String tenantId, WhiteLabelConfig config) {
        config.setTenantId(tenantId);
        config.setEnabled(true);
        configCache.put(tenantId, config);
        log.info("White label config applied for tenant: {}", tenantId);
    }

    /**
     * Remove white label configuration (revert to default).
     */
    public void removeConfig(String tenantId) {
        configCache.remove(tenantId);
        log.info("White label config removed for tenant: {}", tenantId);
    }

    /**
     * Check if white label is enabled for a tenant.
     */
    public boolean isWhiteLabelEnabled(String tenantId) {
        WhiteLabelConfig config = configCache.get(tenantId);
        return config != null && config.isEnabled();
    }

    /**
     * Get a specific configuration value.
     */
    public String getConfigValue(String tenantId, String key) {
        WhiteLabelConfig config = configCache.get(tenantId);
        if (config == null) return null;

        return switch (key) {
            case "primaryColor" -> config.getPrimaryColor();
            case "secondaryColor" -> config.getSecondaryColor();
            case "companyName" -> config.getCompanyName();
            case "logoUrl" -> config.getLogoUrl();
            case "customDomain" -> config.getCustomDomain();
            case "fontFamily" -> config.getFontFamily();
            default -> null;
        };
    }

    /**
     * Resolve brand CSS variables for a tenant.
     */
    public Map<String, String> getBrandCssVariables(String tenantId) {
        WhiteLabelConfig config = getConfig(tenantId);
        if (config == null || !config.isEnabled()) {
            return Map.of();
        }

        return Map.of(
                "--brand-primary", config.getPrimaryColor() != null ? config.getPrimaryColor() : "#1a73e8",
                "--brand-secondary", config.getSecondaryColor() != null ? config.getSecondaryColor() : "#34a853",
                "--brand-accent", config.getAccentColor() != null ? config.getAccentColor() : "#fbbc04",
                "--brand-bg", config.getBackgroundColor() != null ? config.getBackgroundColor() : "#ffffff",
                "--brand-text", config.getTextColor() != null ? config.getTextColor() : "#202124",
                "--brand-header", config.getHeaderColor() != null ? config.getHeaderColor() : "#1a73e8",
                "--brand-footer", config.getFooterColor() != null ? config.getFooterColor() : "#202124",
                "--brand-font", config.getFontFamily() != null ? config.getFontFamily() : "'Inter', sans-serif"
        );
    }

    private WhiteLabelConfig getDefaultConfig() {
        return WhiteLabelConfig.builder()
                .companyName("Kartezy")
                .tagline("Your Neighborhood, Delivered.")
                .primaryColor("#1a73e8")
                .secondaryColor("#34a853")
                .accentColor("#fbbc04")
                .enabled(false)
                .build();
    }
}
