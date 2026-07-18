// ============================================================
// Kartezy MongoDB Enterprise Indexes
// Multi-Tenant, Geo-Replication, Session Management
// ============================================================

db = db.getSiblingDB('kartezy');

// ============================================
// Tenant Collections
// ============================================
db.createCollection('tenant_sessions');
db.tenant_sessions.createIndex({ tenantId: 1, userId: 1 });
db.tenant_sessions.createIndex({ sessionToken: 1 }, { unique: true });
db.tenant_sessions.createIndex({ lastActivity: 1 }, { expireAfterSeconds: 86400 });
db.tenant_sessions.createIndex({ tenantId: 1, lastActivity: 1 });

// ============================================
// Geo-Replicated Activity Logs
// ============================================
db.createCollection('geo_activity_logs');
db.geo_activity_logs.createIndex({ tenantId: 1, timestamp: -1 });
db.geo_activity_logs.createIndex({ region: 1, timestamp: -1 });
db.geo_activity_logs.createIndex({ userId: 1, timestamp: -1 });
db.geo_activity_logs.createIndex({ action: 1, timestamp: -1 });
db.geo_activity_logs.createIndex({ timestamp: -1 }, { expireAfterSeconds: 7776000 }); // 90 days TTL

// ============================================
// Multi-Vendor Cart Sessions
// ============================================
db.createCollection('multi_vendor_carts');
db.multi_vendor_carts.createIndex({ userId: 1 }, { unique: true });
db.multi_vendor_carts.createIndex({ tenantId: 1, userId: 1 });
db.multi_vendor_carts.createIndex({ 'items.vendorId': 1 });
db.multi_vendor_carts.createIndex({ updatedAt: 1 }, { expireAfterSeconds: 604800 }); // 7 days TTL

// ============================================
// Translation Cache for i18n
// ============================================
db.createCollection('translation_cache');
db.translation_cache.createIndex({ languageCode: 1, key: 1 }, { unique: true });
db.translation_cache.createIndex({ languageCode: 1 });
db.translation_cache.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 }); // 1 hour TTL

// ============================================
// Warehouse Picklist Sessions
// ============================================
db.createCollection('warehouse_picklists');
db.warehouse_picklists.createIndex({ warehouseId: 1, status: 1 });
db.warehouse_picklists.createIndex({ warehouseId: 1, assignedTo: 1 });
db.warehouse_picklists.createIndex({ orderId: 1 });
db.warehouse_picklists.createIndex({ priority: -1, createdAt: 1 });
db.warehouse_picklists.createIndex({ status: 1 });

// ============================================
// Vendor Performance Cache
// ============================================
db.createCollection('vendor_performance_cache');
db.vendor_performance_cache.createIndex({ vendorId: 1 });
db.vendor_performance_cache.createIndex({ tenantId: 1, score: -1 });
db.vendor_performance_cache.createIndex({ city: 1, score: -1 });
db.vendor_performance_cache.createIndex({ updatedAt: 1 }, { expireAfterSeconds: 3600 }); // 1 hour TTL

// ============================================
// Global Search Index (Multi-Tenant)
// ============================================
db.products.createIndex(
    { tenantId: 1, name: 'text', description: 'text', 'attributes.brand': 'text' },
    { weights: { name: 10, 'attributes.brand': 5, description: 1 }, name: 'product_text_search_tenant' }
);
db.products.createIndex({ tenantId: 1, merchantId: 1, isActive: 1 });
db.products.createIndex({ tenantId: 1, categoryId: 1, isActive: 1 });
db.products.createIndex({ tenantId: 1, 'attributes.tags': 1 });

print('Enterprise MongoDB indexes created successfully');
