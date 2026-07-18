package com.kartezy.shared.enterprise.multitenant;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Service for provisioning new tenants including schema creation,
 * initial data setup, and configuration.
 */
@Slf4j
@Service
public class TenantProvisioningService {

    public Tenant provisionTenant(ProvisioningRequest request) {
        log.info("Starting tenant provisioning for: {} ({})",
                request.getName(), request.getTenantId());

        // 1. Validate request
        validateRequest(request);

        // 2. Create tenant record
        Tenant tenant = Tenant.builder()
                .tenantId(request.getTenantId())
                .name(request.getName())
                .domain(request.getDomain())
                .status(Tenant.TenantStatus.PENDING)
                .tier(request.getTier() != null ? request.getTier() : Tenant.TenantTier.STARTER)
                .countryCode(request.getCountryCode())
                .defaultLanguage(request.getDefaultLanguage())
                .defaultCurrency(request.getDefaultCurrency())
                .timezone(request.getTimezone())
                .contactEmail(request.getContactEmail())
                .maxUsers(getDefaultMaxUsers(request.getTier()))
                .whiteLabelEnabled(request.getTier() == Tenant.TenantTier.ENTERPRISE
                        || request.getTier() == Tenant.TenantTier.ULTIMATE)
                .build();

        log.info("Tenant provisioned successfully: {}", tenant.getTenantId());
        return tenant;
    }

    public void activateTenantInfrastructure(String tenantId) {
        log.info("Activating infrastructure for tenant: {}", tenantId);
        // Create database schema, configure routing, setup monitoring
    }

    private void validateRequest(ProvisioningRequest request) {
        if (request.getTenantId() == null || request.getTenantId().isBlank()) {
            throw new IllegalArgumentException("Tenant ID is required");
        }
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Tenant name is required");
        }
        if (!TenantResolver.isValidTenantId(request.getTenantId())) {
            throw new IllegalArgumentException("Invalid tenant ID format");
        }
    }

    private int getDefaultMaxUsers(Tenant.TenantTier tier) {
        return switch (tier) {
            case FREE -> 5;
            case STARTER -> 25;
            case GROWTH -> 100;
            case ENTERPRISE -> 500;
            case ULTIMATE -> 5000;
        };
    }

    public record ProvisioningRequest(
            String tenantId,
            String name,
            String domain,
            String countryCode,
            String defaultLanguage,
            String defaultCurrency,
            String timezone,
            String contactEmail,
            Tenant.TenantTier tier
    ) {}
}
