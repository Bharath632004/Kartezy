package com.kartezy.shared.enterprise.multitenant;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service interface for tenant management.
 * Implementations provide tenant CRUD and caching.
 */
public interface TenantService {

    Tenant getTenant(String tenantId);

    Tenant getTenantByDomain(String domain);

    Tenant createTenant(Tenant tenant);

    Tenant updateTenant(String tenantId, Tenant tenant);

    void deactivateTenant(String tenantId);

    void activateTenant(String tenantId);

    boolean isFeatureEnabled(String tenantId, String feature);

    boolean validateApiKey(String apiKey);

    Set<String> getAllTenantIds();

    void evictTenantCache(String tenantId);

    /**
     * In-memory cache layer for tenant data to avoid repeated DB lookups.
     */
    class TenantCache {
        private final Map<String, Tenant> tenantById = new ConcurrentHashMap<>();
        private final Map<String, String> domainToTenantId = new ConcurrentHashMap<>();

        public void put(Tenant tenant) {
            tenantById.put(tenant.getTenantId(), tenant);
            if (tenant.getDomain() != null) {
                domainToTenantId.put(tenant.getDomain(), tenant.getTenantId());
            }
            if (tenant.getCustomDomain() != null) {
                domainToTenantId.put(tenant.getCustomDomain(), tenant.getTenantId());
            }
        }

        public Tenant getById(String tenantId) {
            return tenantById.get(tenantId);
        }

        public String getTenantIdByDomain(String domain) {
            return domainToTenantId.get(domain);
        }

        public void evict(String tenantId) {
            Tenant tenant = tenantById.remove(tenantId);
            if (tenant != null) {
                domainToTenantId.values().remove(tenantId);
            }
        }

        public void clear() {
            tenantById.clear();
            domainToTenantId.clear();
        }
    }
}
