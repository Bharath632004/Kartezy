package com.kartezy.shared.enterprise.multitenant;

/**
 * Thread-local tenant context for the Kartezy platform.
 * Supports multi-tenant operations by propagating tenant information
 * across service boundaries.
 */
public final class TenantContext {

    private static final ThreadLocal<Tenant> CURRENT_TENANT = new InheritableThreadLocal<>();
    private static final ThreadLocal<String> CURRENT_TENANT_ID = new InheritableThreadLocal<>();
    private static final ThreadLocal<String> CURRENT_SCHEMA = new InheritableThreadLocal<>();

    private TenantContext() {}

    public static void setCurrentTenant(Tenant tenant) {
        CURRENT_TENANT.set(tenant);
        CURRENT_TENANT_ID.set(tenant != null ? tenant.getTenantId() : null);
        CURRENT_SCHEMA.set(tenant != null ? tenant.getSchemaName() : "public");
    }

    public static void setCurrentTenantId(String tenantId) {
        CURRENT_TENANT_ID.set(tenantId);
    }

    public static Tenant getCurrentTenant() {
        return CURRENT_TENANT.get();
    }

    public static String getCurrentTenantId() {
        String tenantId = CURRENT_TENANT_ID.get();
        if (tenantId == null) {
            throw new IllegalStateException("No tenant context found. " +
                    "Ensure TenantContextFilter is configured.");
        }
        return tenantId;
    }

    public static String getCurrentSchema() {
        String schema = CURRENT_SCHEMA.get();
        return schema != null ? schema : "public";
    }

    public static void clear() {
        CURRENT_TENANT.remove();
        CURRENT_TENANT_ID.remove();
        CURRENT_SCHEMA.remove();
    }

    public static boolean isMultiTenant() {
        return CURRENT_TENANT_ID.get() != null;
    }
}
