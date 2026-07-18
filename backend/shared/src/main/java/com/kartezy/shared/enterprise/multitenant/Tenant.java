package com.kartezy.shared.enterprise.multitenant;

import lombok.*;
import java.time.ZonedDateTime;
import java.util.Set;

/**
 * Tenant entity for the Kartezy multi-tenant platform.
 * Each tenant represents an isolated business entity (franchise, enterprise, etc.)
 * with its own data isolation, branding, and configuration.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Tenant {

    private String tenantId;
    private String name;
    private String domain;
    private String schemaName;
    private TenantStatus status;
    private TenantTier tier;
    private String planType;
    private String countryCode;
    private String defaultLanguage;
    private String defaultCurrency;
    private String timezone;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
    private String contactEmail;
    private String contactPhone;
    private Integer maxUsers;
    private Integer maxMerchants;
    private Long storageLimitBytes;
    private Boolean whiteLabelEnabled;
    private String logoUrl;
    private String primaryColor;
    private String secondaryColor;
    private String customDomain;
    private Set<String> features;
    private Set<String> modules;

    public enum TenantStatus {
        ACTIVE, SUSPENDED, TRIAL, EXPIRED, PENDING
    }

    public enum TenantTier {
        FREE, STARTER, GROWTH, ENTERPRISE, ULTIMATE
    }

    public boolean isActive() {
        return status == TenantStatus.ACTIVE || status == TenantStatus.TRIAL;
    }

    public boolean hasFeature(String feature) {
        return features != null && features.contains(feature);
    }

    public boolean isWhiteLabel() {
        return whiteLabelEnabled != null && whiteLabelEnabled;
    }
}
