-- ============================================
-- Kartezy Platform - Enhanced Audit Events Table
-- ============================================
-- This migration adds the enhanced audit events table with cryptographic hashing
-- for tamper-evident audit logging.

-- Enhanced Audit Events Table
CREATE TABLE IF NOT EXISTS enhanced_audit_events (
    id UUID PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    principal VARCHAR(255),
    ip_address VARCHAR(45), -- IPv6 max length
    description TEXT,
    outcome VARCHAR(20),
    details TEXT,
    event_timestamp TIMESTAMP NOT NULL,
    previous_hash VARCHAR(64), -- Hash of previous event in chain
    event_hash VARCHAR(64) NOT NULL, -- Hash of this event's content
    schema_version INTEGER NOT NULL DEFAULT 1,
    is_redacted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,

    -- Indexes for common query patterns
    CONSTRAINT chk_schema_version CHECK (schema_version >= 1)
);

CREATE INDEX IF NOT EXISTS idx_enhanced_audit_event_type ON enhanced_audit_events(event_type);
CREATE INDEX IF NOT EXISTS idx_enhanced_audit_principal ON enhanced_audit_events(principal);
CREATE INDEX IF NOT EXISTS idx_enhanced_audit_timestamp ON enhanced_audit_events(event_timestamp);
CREATE INDEX IF NOT EXISTS idx_enhanced_audit_outcome ON enhanced_audit_events(outcome);
CREATE INDEX IF NOT EXISTS idx_enhanced_audit_redacted ON enhanced_audit_events(is_redacted) WHERE is_redacted = false;

-- Note: The original audit_events table is preserved for backward compatibility
-- during migration period. New code should use enhanced_audit_events.