package com.kartezy.shared.enterprise.multitenant;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Default in-memory implementation of {@link TenantService} used as a fallback
 * when no real TenantService bean is provided (e.g., in the API Gateway).
 * <p>
 * This implementation stores tenants in a concurrent map and is suitable for
 * development and testing. In production, a database-backed implementation
 * should be provided by the specific service module.
 */
@Slf4j
@Service
@ConditionalOnMissingBean(TenantService.class)
public class DefaultTenantService implements TenantService {

    private final TenantCache tenantCache = new TenantCache();
    private final ConcurrentHashMap<String, Tenant> tenantStore = new ConcurrentHashMap<>();

    public DefaultTenantService() {
        log.info("Initialized DefaultTenantService (in-memory fallback)");
        // Create a default tenant for development
        Tenant defaultTenant = Tenant.builder()
                .tenantId("default")
                .name("Default Tenant")
                .status(Tenant.TenantStatus.ACTIVE)
                .tier(Tenant.TenantTier.ENTERPRISE)
                .build();
        tenantStore.put("default", defaultTenant);
        tenantCache.put(defaultTenant);
    }

    @Override
    public Tenant getTenant(String tenantId) {
        Tenant tenant = tenantCache.getById(tenantId);
        if (tenant == null) {
            tenant = tenantStore.get(tenantId);
            if (tenant != null) {
                tenantCache.put(tenant);
            }
        }
        return tenant;
    }

    @Override
    public Tenant getTenantByDomain(String domain) {
        String tenantId = tenantCache.getTenantIdByDomain(domain);
        if (tenantId != null) {
            return getTenant(tenantId);
        }
        return null;
    }

    @Override
    public Tenant createTenant(Tenant tenant) {
        tenantStore.put(tenant.getTenantId(), tenant);
        tenantCache.put(tenant);
        log.info("Created tenant: {} ({})", tenant.getTenantId(), tenant.getName());
        return tenant;
    }

    @Override
    public Tenant updateTenant(String tenantId, Tenant tenant) {
        tenantStore.put(tenantId, tenant);
        tenantCache.evict(tenantId);
        tenantCache.put(tenant);
        log.info("Updated tenant: {} ({})", tenant.getTenantId(), tenant.getName());
        return tenant;
    }

    @Override
    public void deactivateTenant(String tenantId) {
        Tenant tenant = getTenant(tenantId);
        if (tenant != null) {
            Tenant deactivated = Tenant.builder()
                    .tenantId(tenant.getTenantId())
                    .name(tenant.getName())
                    .domain(tenant.getDomain())
                    .status(Tenant.TenantStatus.SUSPENDED)
                    .tier(tenant.getTier())
                    .build();
            tenantStore.put(tenantId, deactivated);
            tenantCache.evict(tenantId);
            tenantCache.put(deactivated);
            log.info("Deactivated tenant: {}", tenantId);
        }
    }

    @Override
    public void activateTenant(String tenantId) {
        Tenant tenant = getTenant(tenantId);
        if (tenant != null) {
            Tenant activated = Tenant.builder()
                    .tenantId(tenant.getTenantId())
                    .name(tenant.getName())
                    .domain(tenant.getDomain())
                    .status(Tenant.TenantStatus.ACTIVE)
                    .tier(tenant.getTier())
                    .build();
            tenantStore.put(tenantId, activated);
            tenantCache.evict(tenantId);
            tenantCache.put(activated);
            log.info("Activated tenant: {}", tenantId);
        }
    }

    @Override
    public boolean isFeatureEnabled(String tenantId, String feature) {
        Tenant tenant = getTenant(tenantId);
        return tenant != null && tenant.hasFeature(feature);
    }

    @Override
    public boolean validateApiKey(String apiKey) {
        // In development mode, accept any non-empty API key
        return apiKey != null && !apiKey.isBlank();
    }

    @Override
    public Set<String> getAllTenantIds() {
        return tenantStore.keySet();
    }

    @Override
    public void evictTenantCache(String tenantId) {
        tenantCache.evict(tenantId);
    }
}
