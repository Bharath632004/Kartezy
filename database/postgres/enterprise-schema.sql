-- ============================================================
-- Kartezy Enterprise Scalability Schema
-- Multi-Tenant, Multi-City, Multi-State, Multi-Country,
-- Multi-Language, Multi-Currency, Multi-Timezone support
-- ============================================================

-- Enterprise schema
CREATE SCHEMA IF NOT EXISTS kartezy_enterprise;

-- ============================================================
-- Geo-Hierarchy: Country -> State -> City
-- ============================================================

CREATE TABLE IF NOT EXISTS kartezy_enterprise.countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(255) UNIQUE NOT NULL,
    iso_code VARCHAR(3) NOT NULL,
    iso_code2 VARCHAR(2),
    calling_code VARCHAR(10) NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    default_locale VARCHAR(10) NOT NULL,
    default_timezone VARCHAR(50) NOT NULL,
    flag_url VARCHAR(500),
    requires_vat BOOLEAN DEFAULT FALSE,
    vat_label VARCHAR(100),
    vat_percentage INTEGER,
    gdpr_enabled BOOLEAN DEFAULT FALSE,
    data_localization_required BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kartezy_enterprise.states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(255) UNIQUE NOT NULL,
    country_id UUID NOT NULL REFERENCES kartezy_enterprise.countries(id) ON DELETE CASCADE,
    state_code VARCHAR(10) NOT NULL,
    tax_percentage INTEGER,
    tax_label VARCHAR(100),
    region VARCHAR(50),
    has_sunday_restrictions BOOLEAN DEFAULT FALSE,
    has_alcohol_restrictions BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kartezy_enterprise.cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(255) UNIQUE NOT NULL,
    state_id UUID NOT NULL REFERENCES kartezy_enterprise.states(id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    timezone VARCHAR(50) NOT NULL,
    is_operational BOOLEAN DEFAULT FALSE,
    delivery_radius_km INTEGER DEFAULT 10,
    max_delivery_distance_km INTEGER DEFAULT 25,
    currency_code VARCHAR(3) NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    is_metro BOOLEAN DEFAULT FALSE,
    population BIGINT,
    operational_address TEXT,
    google_place_id VARCHAR(255),
    requires_special_permit BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_countries_iso ON kartezy_enterprise.countries(iso_code);
CREATE INDEX IF NOT EXISTS idx_states_country ON kartezy_enterprise.states(country_id);
CREATE INDEX IF NOT EXISTS idx_states_code ON kartezy_enterprise.states(state_code);
CREATE INDEX IF NOT EXISTS idx_cities_state ON kartezy_enterprise.cities(state_id);
CREATE INDEX IF NOT EXISTS idx_cities_geo ON kartezy_enterprise.cities(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_cities_operational ON kartezy_enterprise.cities(is_operational) WHERE is_operational = TRUE;

-- ============================================================
-- Multi-Tenant Tables
-- ============================================================

CREATE TABLE IF NOT EXISTS kartezy_enterprise.tenants (
    tenant_id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    schema_name VARCHAR(64),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    tier VARCHAR(20) NOT NULL DEFAULT 'STARTER',
    plan_type VARCHAR(50),
    country_code VARCHAR(3),
    default_language VARCHAR(10) DEFAULT 'en',
    default_currency VARCHAR(3) DEFAULT 'INR',
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    max_users INTEGER DEFAULT 25,
    max_merchants INTEGER DEFAULT 10,
    storage_limit_bytes BIGINT DEFAULT 1073741824,
    white_label_enabled BOOLEAN DEFAULT FALSE,
    logo_url TEXT,
    primary_color VARCHAR(7) DEFAULT '#1a73e8',
    secondary_color VARCHAR(7) DEFAULT '#34a853',
    custom_domain VARCHAR(255),
    features JSONB DEFAULT '[]',
    modules JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kartezy_enterprise.tenant_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL REFERENCES kartezy_enterprise.tenants(tenant_id) ON DELETE CASCADE,
    setting_key VARCHAR(255) NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'STRING',
    is_encrypted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, setting_key)
);

CREATE TABLE IF NOT EXISTS kartezy_enterprise.tenant_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL REFERENCES kartezy_enterprise.tenants(tenant_id) ON DELETE CASCADE,
    api_key_hash VARCHAR(255) NOT NULL,
    api_key_prefix VARCHAR(10) NOT NULL,
    name VARCHAR(255) NOT NULL,
    permissions JSONB DEFAULT '[]',
    allowed_ips TEXT[],
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenants_domain ON kartezy_enterprise.tenants(domain);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON kartezy_enterprise.tenants(status);
CREATE INDEX IF NOT EXISTS idx_tenant_settings ON kartezy_enterprise.tenant_settings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_api_keys ON kartezy_enterprise.tenant_api_keys(tenant_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_tenant_api_keys_hash ON kartezy_enterprise.tenant_api_keys(api_key_hash);

-- ============================================================
-- Franchise Management
-- ============================================================

CREATE TABLE IF NOT EXISTS kartezy_enterprise.franchises (
    franchise_id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES kartezy_enterprise.tenants(tenant_id),
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    registration_number VARCHAR(100),
    tax_id VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    website VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    currency_code VARCHAR(3) DEFAULT 'INR',
    language_code VARCHAR(10) DEFAULT 'en',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    tier VARCHAR(20) DEFAULT 'STANDARD',
    setup_fee DECIMAL(12, 2) DEFAULT 0,
    monthly_fee DECIMAL(12, 2) DEFAULT 0,
    commission_percentage DECIMAL(5, 2) DEFAULT 0,
    revenue_share DECIMAL(5, 2) DEFAULT 0,
    payment_terms VARCHAR(100),
    service_radius_km DOUBLE PRECISION DEFAULT 10,
    max_delivery_distance_km INTEGER DEFAULT 25,
    serviceable_cities TEXT[],
    serviceable_pincodes TEXT[],
    max_merchants INTEGER DEFAULT 50,
    max_delivery_partners INTEGER DEFAULT 100,
    current_merchants INTEGER DEFAULT 0,
    current_delivery_partners INTEGER DEFAULT 0,
    white_label_enabled BOOLEAN DEFAULT FALSE,
    logo_url TEXT,
    brand_name VARCHAR(255),
    primary_color VARCHAR(7),
    secondary_color VARCHAR(7),
    contract_end_date TIMESTAMP WITH TIME ZONE,
    onboarded_at TIMESTAMP WITH TIME ZONE,
    activated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_franchises_tenant ON kartezy_enterprise.franchises(tenant_id);
CREATE INDEX IF NOT EXISTS idx_franchises_status ON kartezy_enterprise.franchises(status);
CREATE INDEX IF NOT EXISTS idx_franchises_city ON kartezy_enterprise.franchises(city);

-- ============================================================
-- Marketplace - Vendors
-- ============================================================

CREATE TABLE IF NOT EXISTS kartezy_enterprise.vendors (
    vendor_id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES kartezy_enterprise.tenants(tenant_id),
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    business_type VARCHAR(50),
    registration_number VARCHAR(100),
    gstin VARCHAR(15),
    pan_number VARCHAR(10),
    email VARCHAR(255),
    phone VARCHAR(20),
    website VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    store_name VARCHAR(255),
    store_description TEXT,
    store_logo TEXT,
    store_banner TEXT,
    store_slug VARCHAR(255) UNIQUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3, 2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    commission_rate DECIMAL(5, 2) DEFAULT 0,
    commission_cap DECIMAL(12, 2),
    settlement_period INTEGER DEFAULT 7,
    settlement_mode VARCHAR(20) DEFAULT 'WEEKLY',
    minimum_payout DECIMAL(12, 2) DEFAULT 100,
    payout_method VARCHAR(50) DEFAULT 'BANK_TRANSFER',
    total_products INTEGER DEFAULT 0,
    active_products INTEGER DEFAULT 0,
    categories TEXT[],
    supported_pincodes TEXT[],
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    is_active BOOLEAN DEFAULT TRUE,
    kyc_completed BOOLEAN DEFAULT FALSE,
    total_orders INTEGER DEFAULT 0,
    total_revenue DECIMAL(14, 2) DEFAULT 0,
    lifetime_revenue DECIMAL(14, 2) DEFAULT 0,
    fulfillment_rate DECIMAL(5, 2) DEFAULT 100,
    cancellation_rate DECIMAL(5, 2) DEFAULT 0,
    return_rate DECIMAL(5, 2) DEFAULT 0,
    onboarded_at TIMESTAMP WITH TIME ZONE,
    last_sale_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kartezy_enterprise.vendor_payouts (
    payout_id VARCHAR(64) PRIMARY KEY,
    vendor_id VARCHAR(64) NOT NULL REFERENCES kartezy_enterprise.vendors(vendor_id),
    amount DECIMAL(14, 2) NOT NULL,
    currency_code VARCHAR(3) DEFAULT 'INR',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    transaction_reference VARCHAR(255),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vendors_tenant ON kartezy_enterprise.vendors(tenant_id);
CREATE INDEX IF NOT EXISTS idx_vendors_slug ON kartezy_enterprise.vendors(store_slug);
CREATE INDEX IF NOT EXISTS idx_vendors_city ON kartezy_enterprise.vendors(city);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON kartezy_enterprise.vendors(status);
CREATE INDEX IF NOT EXISTS idx_vendor_payouts ON kartezy_enterprise.vendor_payouts(vendor_id);

-- ============================================================
-- Warehouse Management
-- ============================================================

CREATE TABLE IF NOT EXISTS kartezy_enterprise.warehouses (
    warehouse_id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES kartezy_enterprise.tenants(tenant_id),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'FULFILLMENT',
    address TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    serviceable_pincodes TEXT[],
    serviceable_cities TEXT[],
    max_delivery_radius_km DOUBLE PRECISION DEFAULT 10,
    priority INTEGER DEFAULT 0,
    total_area_sq_ft DOUBLE PRECISION,
    capacity DOUBLE PRECISION,
    current_utilization DOUBLE PRECISION DEFAULT 0,
    max_picking_stations INTEGER DEFAULT 10,
    active_picking_stations INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_primary BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    operating_hours_start VARCHAR(10) DEFAULT '06:00',
    operating_hours_end VARCHAR(10) DEFAULT '23:00',
    operating_days TEXT[] DEFAULT '{MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY}',
    max_same_day_orders INTEGER DEFAULT 1000,
    current_order_load INTEGER DEFAULT 0,
    picking_accuracy DECIMAL(5, 2) DEFAULT 100,
    avg_picking_time_minutes DECIMAL(6, 2) DEFAULT 5,
    fulfillment_rate DECIMAL(5, 2) DEFAULT 100,
    total_orders_processed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kartezy_enterprise.inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warehouse_id VARCHAR(64) NOT NULL REFERENCES kartezy_enterprise.warehouses(warehouse_id),
    product_id VARCHAR(64) NOT NULL,
    sku VARCHAR(100),
    barcode VARCHAR(100),
    batch_number VARCHAR(100),
    quantity INTEGER NOT NULL DEFAULT 0,
    reserved_quantity INTEGER DEFAULT 0,
    damaged_quantity INTEGER DEFAULT 0,
    returned_quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 10,
    reorder_point INTEGER DEFAULT 20,
    reorder_quantity INTEGER DEFAULT 50,
    zone VARCHAR(50),
    aisle VARCHAR(50),
    shelf VARCHAR(50),
    bin VARCHAR(50),
    unit_cost DECIMAL(12, 2),
    selling_price DECIMAL(12, 2),
    mrp DECIMAL(12, 2),
    manufactured_date TIMESTAMP WITH TIME ZONE,
    expiry_date TIMESTAMP WITH TIME ZONE,
    received_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_counted_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'IN_STOCK',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(warehouse_id, product_id)
);

CREATE TABLE IF NOT EXISTS kartezy_enterprise.stock_transfers (
    transfer_id VARCHAR(64) PRIMARY KEY,
    from_warehouse VARCHAR(64) NOT NULL REFERENCES kartezy_enterprise.warehouses(warehouse_id),
    to_warehouse VARCHAR(64) NOT NULL REFERENCES kartezy_enterprise.warehouses(warehouse_id),
    product_id VARCHAR(64) NOT NULL,
    sku VARCHAR(100),
    quantity INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'REQUESTED',
    reason TEXT,
    reference_number VARCHAR(100),
    tracking_number VARCHAR(100),
    carrier VARCHAR(100),
    driver_id VARCHAR(64),
    vehicle_number VARCHAR(50),
    notes TEXT,
    approved_by VARCHAR(64),
    received_by VARCHAR(64),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    picked_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    received_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_warehouses_tenant ON kartezy_enterprise.warehouses(tenant_id);
CREATE INDEX IF NOT EXISTS idx_warehouses_city ON kartezy_enterprise.warehouses(city);
CREATE INDEX IF NOT EXISTS idx_warehouses_active ON kartezy_enterprise.warehouses(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_inventory_warehouse ON kartezy_enterprise.inventory_items(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON kartezy_enterprise.inventory_items(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON kartezy_enterprise.inventory_items(status);
CREATE INDEX IF NOT EXISTS idx_inventory_low ON kartezy_enterprise.inventory_items(quantity) WHERE quantity <= low_stock_threshold;
CREATE INDEX IF NOT EXISTS idx_stock_transfers_from ON kartezy_enterprise.stock_transfers(from_warehouse);
CREATE INDEX IF NOT EXISTS idx_stock_transfers_to ON kartezy_enterprise.stock_transfers(to_warehouse);
CREATE INDEX IF NOT EXISTS idx_stock_transfers_status ON kartezy_enterprise.stock_transfers(status);

-- ============================================================
-- Vendor Procurement - Purchase Orders
-- ============================================================

CREATE TABLE IF NOT EXISTS kartezy_enterprise.purchase_orders (
    po_number VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES kartezy_enterprise.tenants(tenant_id),
    vendor_id VARCHAR(64) NOT NULL REFERENCES kartezy_enterprise.vendors(vendor_id),
    vendor_name VARCHAR(255),
    warehouse_id VARCHAR(64) REFERENCES kartezy_enterprise.warehouses(warehouse_id),
    created_by VARCHAR(64),
    approved_by VARCHAR(64),
    received_by VARCHAR(64),
    subtotal DECIMAL(14, 2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(14, 2) DEFAULT 0,
    shipping_cost DECIMAL(14, 2) DEFAULT 0,
    discount_amount DECIMAL(14, 2) DEFAULT 0,
    total_amount DECIMAL(14, 2) NOT NULL DEFAULT 0,
    currency_code VARCHAR(3) DEFAULT 'INR',
    delivery_address TEXT,
    shipping_method VARCHAR(100),
    expected_delivery_date TIMESTAMP WITH TIME ZONE,
    actual_delivery_date TIMESTAMP WITH TIME ZONE,
    tracking_number VARCHAR(100),
    payment_terms VARCHAR(100),
    payment_method VARCHAR(50),
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    notes TEXT,
    internal_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    received_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS kartezy_enterprise.po_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_number VARCHAR(64) NOT NULL REFERENCES kartezy_enterprise.purchase_orders(po_number) ON DELETE CASCADE,
    line_number INTEGER NOT NULL,
    sku VARCHAR(100),
    product_name VARCHAR(255),
    product_id VARCHAR(64),
    unit VARCHAR(50),
    quantity INTEGER NOT NULL,
    received_quantity INTEGER DEFAULT 0,
    unit_price DECIMAL(12, 2) NOT NULL,
    total_price DECIMAL(14, 2) NOT NULL,
    tax_rate DECIMAL(5, 2) DEFAULT 0,
    tax_amount DECIMAL(12, 2) DEFAULT 0,
    category VARCHAR(100)
);

CREATE INDEX IF NOT EXISTS idx_po_tenant ON kartezy_enterprise.purchase_orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_po_vendor ON kartezy_enterprise.purchase_orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_po_status ON kartezy_enterprise.purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_po_created ON kartezy_enterprise.purchase_orders(created_at DESC);

-- ============================================================
-- White Label Configuration
-- ============================================================

CREATE TABLE IF NOT EXISTS kartezy_enterprise.white_label_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL REFERENCES kartezy_enterprise.tenants(tenant_id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    tagline VARCHAR(500),
    logo_url TEXT,
    favicon_url TEXT,
    login_page_background TEXT,
    email_header_logo TEXT,
    email_footer_logo TEXT,
    primary_color VARCHAR(7) DEFAULT '#1a73e8',
    secondary_color VARCHAR(7) DEFAULT '#34a853',
    accent_color VARCHAR(7) DEFAULT '#fbbc04',
    background_color VARCHAR(7) DEFAULT '#ffffff',
    text_color VARCHAR(7) DEFAULT '#202124',
    header_color VARCHAR(7) DEFAULT '#1a73e8',
    footer_color VARCHAR(7) DEFAULT '#202124',
    button_color VARCHAR(7) DEFAULT '#1a73e8',
    link_color VARCHAR(7) DEFAULT '#1a73e8',
    error_color VARCHAR(7) DEFAULT '#ea4335',
    success_color VARCHAR(7) DEFAULT '#34a853',
    font_family VARCHAR(100),
    heading_font VARCHAR(100),
    base_font_size INTEGER DEFAULT 16,
    custom_domain VARCHAR(255),
    ssl_enabled BOOLEAN DEFAULT TRUE,
    favicon_domain VARCHAR(255),
    support_email VARCHAR(255),
    support_phone VARCHAR(20),
    support_url VARCHAR(255),
    privacy_policy_url TEXT,
    terms_of_service_url TEXT,
    refund_policy_url TEXT,
    copyright_text TEXT,
    custom_css TEXT,
    custom_js TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    og_image_url TEXT,
    og_title VARCHAR(255),
    facebook_url VARCHAR(255),
    twitter_url VARCHAR(255),
    instagram_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    youtube_url VARCHAR(255),
    feature_flags JSONB DEFAULT '{}',
    is_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id)
);

CREATE INDEX IF NOT EXISTS idx_white_label_tenant ON kartezy_enterprise.white_label_configs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_white_label_domain ON kartezy_enterprise.white_label_configs(custom_domain);

-- ============================================================
-- Exchange Rates (Multi-Currency)
-- ============================================================

CREATE TABLE IF NOT EXISTS kartezy_enterprise.exchange_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_currency VARCHAR(3) NOT NULL,
    to_currency VARCHAR(3) NOT NULL,
    rate DECIMAL(14, 6) NOT NULL,
    source VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_to TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(from_currency, to_currency, valid_from)
);

CREATE INDEX IF NOT EXISTS idx_exchange_rates_pair ON kartezy_enterprise.exchange_rates(from_currency, to_currency);

-- ============================================================
-- Geo-Replication & Regional Routing
-- ============================================================

CREATE TABLE IF NOT EXISTS kartezy_enterprise.geo_replication_regions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    cloud_provider VARCHAR(50),
    cloud_region VARCHAR(50),
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    database_url TEXT,
    redis_url TEXT,
    kafka_bootstrap_servers TEXT,
    service_url TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Insert Seed Data - Default Country (India)
-- ============================================================

INSERT INTO kartezy_enterprise.countries (name, code, iso_code, iso_code2, calling_code, currency_code, default_locale, default_timezone, requires_vat, vat_label, vat_percentage)
VALUES ('India', 'IN', 'IND', 'IN', '+91', 'INR', 'en_IN', 'Asia/Kolkata', TRUE, 'GST', 18)
ON CONFLICT (code) DO NOTHING;

INSERT INTO kartezy_enterprise.countries (name, code, iso_code, iso_code2, calling_code, currency_code, default_locale, default_timezone)
VALUES ('United States', 'US', 'USA', 'US', '+1', 'USD', 'en_US', 'America/New_York')
ON CONFLICT (code) DO NOTHING;

INSERT INTO kartezy_enterprise.countries (name, code, iso_code, iso_code2, calling_code, currency_code, default_locale, default_timezone)
VALUES ('United Arab Emirates', 'AE', 'ARE', 'AE', '+971', 'AED', 'ar_AE', 'Asia/Dubai')
ON CONFLICT (code) DO NOTHING;

-- Default tenant
INSERT INTO kartezy_enterprise.tenants (tenant_id, name, domain, schema_name, status, tier, plan_type, country_code, default_language, default_currency, timezone, max_users, max_merchants)
VALUES ('default', 'Kartezy Default', 'kartezy.com', 'public', 'ACTIVE', 'ENTERPRISE', 'ENTERPRISE', 'IN', 'en', 'INR', 'Asia/Kolkata', 500, 500)
ON CONFLICT (tenant_id) DO NOTHING;

-- Indian states
WITH india AS (SELECT id FROM kartezy_enterprise.countries WHERE code = 'IN')
INSERT INTO kartezy_enterprise.states (name, code, country_id, state_code, tax_percentage, tax_label, region)
SELECT 'Maharashtra', 'MH', india.id, 'MH', 18, 'GST', 'West' FROM india
UNION ALL SELECT 'Karnataka', 'KA', india.id, 'KA', 18, 'GST', 'South' FROM india
UNION ALL SELECT 'Tamil Nadu', 'TN', india.id, 'TN', 18, 'GST', 'South' FROM india
UNION ALL SELECT 'Uttar Pradesh', 'UP', india.id, 'UP', 18, 'GST', 'North' FROM india
UNION ALL SELECT 'Delhi', 'DL', india.id, 'DL', 18, 'GST', 'North' FROM india
UNION ALL SELECT 'Kerala', 'KL', india.id, 'KL', 18, 'GST', 'South' FROM india
UNION ALL SELECT 'Telangana', 'TS', india.id, 'TS', 18, 'GST', 'South' FROM india
UNION ALL SELECT 'West Bengal', 'WB', india.id, 'WB', 18, 'GST', 'East' FROM india
UNION ALL SELECT 'Gujarat', 'GJ', india.id, 'GJ', 18, 'GST', 'West' FROM india
UNION ALL SELECT 'Rajasthan', 'RJ', india.id, 'RJ', 18, 'GST', 'North' FROM india
ON CONFLICT (code) DO NOTHING;
