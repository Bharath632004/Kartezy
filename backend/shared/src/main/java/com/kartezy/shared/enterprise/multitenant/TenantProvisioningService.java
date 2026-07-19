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
                request.name(), request.tenantId());

        // 1. Validate request
        validateRequest(request);

        // 2. Create tenant record
        Tenant tenant = Tenant.builder()
                .tenantId(request.tenantId())
                .name(request.name())
                .domain(request.domain())
                .status(Tenant.TenantStatus.PENDING)
                .tier(request.tier() != null ? request.tier() : Tenant.TenantTier.STARTER)
                .countryCode(request.countryCode())
                .defaultLanguage(request.defaultLanguage())
                .defaultCurrency(request.defaultCurrency())
                .timezone(request.timezone())
                .contactEmail(request.contactEmail())
                .maxUsers(getDefaultMaxUsers(request.tier()))
                .whiteLabelEnabled(request.tier() == Tenant.TenantTier.ENTERPRISE
                        || request.tier() == Tenant.TenantTier.ULTIMATE)
                .build();

        log.info("Tenant provisioned successfully: {}", tenant.getTenantId());
        return tenant;
    }

    public void activateTenantInfrastructure(String tenantId) {
        log.info("Activating infrastructure for tenant: {}", tenantId);
        // Create database schema, configure routing, setup monitoring
    }

    private void validateRequest(ProvisioningRequest request) {
        if (request.tenantId() == null || request.tenantId().isBlank()) {
            throw new IllegalArgumentException("Tenant ID is required");
        }
        if (request.name() == null || request.name().isBlank()) {
            throw new IllegalArgumentException("Tenant name is required");
        }
        if (!TenantResolver.isValidTenantId(request.tenantId())) {
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
