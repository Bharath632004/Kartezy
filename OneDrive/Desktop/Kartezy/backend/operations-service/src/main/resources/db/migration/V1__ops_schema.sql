-- ============================================================
-- Operations Platform - Initial Schema
-- ============================================================

-- Cities
CREATE TABLE cities (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    state VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    country_code VARCHAR(10) DEFAULT 'IN',
    status VARCHAR(50) NOT NULL DEFAULT 'LAUNCHING',
    launch_date DATE,
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    serviceable_pin_codes INTEGER DEFAULT 0,
    active_merchants INTEGER DEFAULT 0,
    active_customers INTEGER DEFAULT 0,
    notes VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- Zones
CREATE TABLE zones (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    city_id BIGINT NOT NULL REFERENCES cities(id),
    zone_type VARCHAR(50) NOT NULL,
    boundary_geo_json VARCHAR(500),
    estimated_population INTEGER DEFAULT 0,
    coverage_radius_km DECIMAL(10,2) DEFAULT 5.0,
    assigned_delivery_partners INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    center_latitude DECIMAL(10,6),
    center_longitude DECIMAL(10,6),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- Warehouses
CREATE TABLE warehouses (
    id BIGSERIAL PRIMARY KEY,
    warehouse_code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    city_id BIGINT NOT NULL REFERENCES cities(id),
    zone_id BIGINT REFERENCES zones(id),
    address VARCHAR(500) NOT NULL,
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    capacity_sq_ft INTEGER DEFAULT 0,
    used_sq_ft INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    total_bays INTEGER DEFAULT 0,
    occupied_bays INTEGER DEFAULT 0,
    staff_count INTEGER DEFAULT 0,
    operating_hours VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- Merchant Operations
CREATE TABLE merchant_operations (
    id BIGSERIAL PRIMARY KEY,
    merchant_id BIGINT NOT NULL UNIQUE,
    city_id BIGINT NOT NULL REFERENCES cities(id),
    business_name VARCHAR(200) NOT NULL,
    business_type VARCHAR(50) NOT NULL,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'PENDING_VERIFICATION',
    verified_at TIMESTAMP,
    verified_by VARCHAR(100),
    total_orders INTEGER DEFAULT 0,
    avg_rating DECIMAL(3,2) DEFAULT 0,
    sla_breaches INTEGER DEFAULT 0,
    on_time_delivery_rate DOUBLE PRECISION DEFAULT 100.0,
    is_active BOOLEAN DEFAULT TRUE,
    remarks VARCHAR(1000),
    last_order_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- Inventory Operations
CREATE TABLE inventory_operations (
    id BIGSERIAL PRIMARY KEY,
    warehouse_id BIGINT REFERENCES warehouses(id),
    merchant_id BIGINT,
    inventory_type VARCHAR(100),
    total_sku_count INTEGER DEFAULT 0,
    active_sku_count INTEGER DEFAULT 0,
    out_of_stock_sku_count INTEGER DEFAULT 0,
    low_stock_sku_count INTEGER DEFAULT 0,
    health_status VARCHAR(50) NOT NULL,
    stock_accuracy_percent DECIMAL(5,2) DEFAULT 100.00,
    pending_restocks INTEGER DEFAULT 0,
    inbound_shipments INTEGER DEFAULT 0,
    outbound_shipments INTEGER DEFAULT 0,
    last_audit_at TIMESTAMP,
    notes VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- Delivery Operations
CREATE TABLE delivery_operations (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL UNIQUE,
    zone_id BIGINT REFERENCES zones(id),
    delivery_partner_id BIGINT,
    delivery_partner_name VARCHAR(100),
    status VARCHAR(50) NOT NULL,
    assigned_at TIMESTAMP,
    picked_up_at TIMESTAMP,
    delivered_at TIMESTAMP,
    distance_km INTEGER DEFAULT 0,
    estimated_minutes INTEGER DEFAULT 0,
    actual_minutes INTEGER DEFAULT 0,
    is_on_time BOOLEAN DEFAULT TRUE,
    delivery_address VARCHAR(500),
    customer_phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- Customer Operations
CREATE TABLE customer_operations (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL UNIQUE,
    city_id BIGINT REFERENCES cities(id),
    kyc_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    kyc_verified_at TIMESTAMP,
    total_orders INTEGER DEFAULT 0,
    cancelled_orders INTEGER DEFAULT 0,
    returned_orders INTEGER DEFAULT 0,
    support_tickets INTEGER DEFAULT 0,
    customer_lifetime_value DOUBLE PRECISION DEFAULT 0.0,
    is_active BOOLEAN DEFAULT TRUE,
    is_blacklisted BOOLEAN DEFAULT FALSE,
    blacklist_reason VARCHAR(500),
    last_order_at TIMESTAMP,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- Support Tickets
CREATE TABLE support_tickets (
    id BIGSERIAL PRIMARY KEY,
    ticket_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id BIGINT,
    merchant_id BIGINT,
    order_id BIGINT,
    subject VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    assigned_to VARCHAR(100),
    assigned_at TIMESTAMP,
    first_response_at TIMESTAMP,
    resolved_at TIMESTAMP,
    sla_deadline TIMESTAMP,
    sla_breached BOOLEAN DEFAULT FALSE,
    resolution TEXT,
    customer_satisfaction_score INTEGER DEFAULT 0,
    customer_feedback VARCHAR(1000),
    escalation_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- Escalations
CREATE TABLE escalations (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT REFERENCES support_tickets(id),
    incident_id BIGINT,
    escalation_level VARCHAR(50) NOT NULL,
    escalated_by VARCHAR(100),
    escalated_to VARCHAR(100),
    escalated_at TIMESTAMP,
    reason VARCHAR(2000),
    status VARCHAR(50) DEFAULT 'PENDING',
    acknowledged_at TIMESTAMP,
    resolution VARCHAR(2000),
    resolved_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- SLA Records
CREATE TABLE sla_records (
    id BIGSERIAL PRIMARY KEY,
    sla_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BIGINT NOT NULL,
    threshold_minutes INTEGER NOT NULL,
    started_at TIMESTAMP,
    deadline_at TIMESTAMP,
    completed_at TIMESTAMP,
    sla_status VARCHAR(50) NOT NULL DEFAULT 'MET',
    breached_minutes INTEGER DEFAULT 0,
    notes VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- Incidents
CREATE TABLE incidents (
    id BIGSERIAL PRIMARY KEY,
    incident_number VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'NEW',
    reported_by VARCHAR(100),
    reported_at TIMESTAMP,
    assigned_to VARCHAR(100),
    acknowledged_at TIMESTAMP,
    affected_customers INTEGER DEFAULT 0,
    affected_orders INTEGER DEFAULT 0,
    root_cause TEXT,
    resolution TEXT,
    resolved_at TIMESTAMP,
    lessons VARCHAR(2000),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- Business Rules
CREATE TABLE business_rules (
    id BIGSERIAL PRIMARY KEY,
    rule_name VARCHAR(100) NOT NULL,
    rule_type VARCHAR(100) NOT NULL,
    rule_expression VARCHAR(2000),
    description VARCHAR(500),
    scope_type VARCHAR(100),
    scope_id BIGINT,
    numeric_value DECIMAL(10,4),
    string_value VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 0,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- Ops Dashboard Snapshots
CREATE TABLE ops_dashboard (
    id BIGSERIAL PRIMARY KEY,
    city_id BIGINT REFERENCES cities(id),
    snapshot_date TIMESTAMP NOT NULL,
    total_orders INTEGER DEFAULT 0,
    successful_deliveries INTEGER DEFAULT 0,
    failed_deliveries INTEGER DEFAULT 0,
    on_time_deliveries INTEGER DEFAULT 0,
    open_tickets INTEGER DEFAULT 0,
    critical_tickets INTEGER DEFAULT 0,
    sla_breaches INTEGER DEFAULT 0,
    avg_resolution_time_hrs DOUBLE PRECISION DEFAULT 0.0,
    avg_csat_score DOUBLE PRECISION DEFAULT 0.0,
    out_of_stock_items INTEGER DEFAULT 0,
    low_stock_items INTEGER DEFAULT 0,
    inventory_accuracy_pct DOUBLE PRECISION DEFAULT 100.0,
    active_deliveries INTEGER DEFAULT 0,
    available_partners INTEGER DEFAULT 0,
    busy_partners INTEGER DEFAULT 0,
    avg_delivery_time_min DOUBLE PRECISION DEFAULT 0.0,
    warehouse_utilization_pct DOUBLE PRECISION DEFAULT 0.0,
    active_warehouses INTEGER DEFAULT 0,
    pending_verifications INTEGER DEFAULT 0,
    active_merchants INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- Indexes
CREATE INDEX idx_city_status ON cities(status);
CREATE INDEX idx_city_region ON cities(region);
CREATE INDEX idx_zone_city ON zones(city_id);
CREATE INDEX idx_zone_type ON zones(zone_type);
CREATE INDEX idx_wh_city ON warehouses(city_id);
CREATE INDEX idx_wh_status ON warehouses(status);
CREATE INDEX idx_mo_merchant ON merchant_operations(merchant_id);
CREATE INDEX idx_mo_status ON merchant_operations(verification_status);
CREATE INDEX idx_io_warehouse ON inventory_operations(warehouse_id);
CREATE INDEX idx_io_health ON inventory_operations(health_status);
CREATE INDEX idx_del_order ON delivery_operations(order_id);
CREATE INDEX idx_del_partner ON delivery_operations(delivery_partner_id);
CREATE INDEX idx_del_status ON delivery_operations(status);
CREATE INDEX idx_del_date ON delivery_operations(assigned_at);
CREATE INDEX idx_co_customer ON customer_operations(customer_id);
CREATE INDEX idx_co_kyc ON customer_operations(kyc_status);
CREATE INDEX idx_ticket_customer ON support_tickets(customer_id);
CREATE INDEX idx_ticket_status ON support_tickets(status);
CREATE INDEX idx_ticket_priority ON support_tickets(priority);
CREATE INDEX idx_ticket_assigned ON support_tickets(assigned_to);
CREATE INDEX idx_sla_status ON sla_records(sla_status);
CREATE INDEX idx_sla_deadline ON sla_records(deadline_at);
CREATE INDEX idx_inc_severity ON incidents(severity);
CREATE INDEX idx_inc_status ON incidents(status);
CREATE INDEX idx_rule_type ON business_rules(rule_type);
CREATE INDEX idx_dash_date ON ops_dashboard(snapshot_date);
