// ============================================================
// Kartezy MongoDB Initialization Script
// Creates collections, indexes, and seed data
// ============================================================

// Switch to kartezy database
db = db.getSiblingDB('kartezy');

// ============================================
// Activity Log Collection
// ============================================
db.createCollection('activity_logs');
db.activity_logs.createIndex({ userId: 1, timestamp: -1 });
db.activity_logs.createIndex({ action: 1 });
db.activity_logs.createIndex({ timestamp: -1 }, { expireAfterSeconds: 7776000 }); // 90 days TTL

// ============================================
// Search History Collection
// ============================================
db.createCollection('search_history');
db.search_history.createIndex({ userId: 1, searchedAt: -1 });
db.search_history.createIndex({ query: 'text' });
db.search_history.createIndex({ searchedAt: -1 }, { expireAfterSeconds: 2592000 }); // 30 days TTL

// ============================================
// User Sessions Collection
// ============================================
db.createCollection('user_sessions');
db.user_sessions.createIndex({ userId: 1 });
db.user_sessions.createIndex({ token: 1 }, { unique: true });
db.user_sessions.createIndex({ lastActivity: 1 }, { expireAfterSeconds: 86400 }); // 24 hours TTL

// ============================================
// Chat Messages Collection
// ============================================
db.createCollection('chat_messages');
db.chat_messages.createIndex({ conversationId: 1, createdAt: 1 });
db.chat_messages.createIndex({ userId: 1 });
db.chat_messages.createIndex({ createdAt: -1 });

// ============================================
// Notifications Collection
// ============================================
db.createCollection('notifications');
db.notifications.createIndex({ userId: 1, read: 1, createdAt: -1 });
db.notifications.createIndex({ type: 1 });
db.notifications.createIndex({ createdAt: -1 }, { expireAfterSeconds: 2592000 }); // 30 days TTL

// ============================================
// Delivery Location Updates (Geo-enabled)
// ============================================
db.createCollection('delivery_locations');
db.delivery_locations.createIndex({ partnerId: 1 });
db.delivery_locations.createIndex({ location: '2dsphere' });
db.delivery_locations.createIndex({ updatedAt: -1 }, { expireAfterSeconds: 86400 }); // 24 hours TTL

// ============================================
// Audit Logs Collection
// ============================================
db.createCollection('audit_logs');
db.audit_logs.createIndex({ userId: 1, timestamp: -1 });
db.audit_logs.createIndex({ action: 1 });
db.audit_logs.createIndex({ resource: 1 });
db.audit_logs.createIndex({ timestamp: -1 }, { expireAfterSeconds: 31536000 }); // 365 days TTL

// ============================================
// Cart Sessions Collection
// ============================================
db.createCollection('cart_sessions');
db.cart_sessions.createIndex({ userId: 1 }, { unique: true });
db.cart_sessions.createIndex({ updatedAt: 1 }, { expireAfterSeconds: 604800 }); // 7 days TTL

print('MongoDB initialization completed successfully');
