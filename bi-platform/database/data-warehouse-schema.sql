-- ==========================================================================
-- Kartezy Enterprise BI Platform - Data Warehouse Schema
-- PostgreSQL 15+ DDL for the complete dimensional data warehouse
-- Schema: kartezy_bi
-- ==========================================================================

CREATE SCHEMA IF NOT EXISTS kartezy_bi;
SET search_path TO kartezy_bi;

-- ==========================================================================
-- DIMENSION TABLES
-- ==========================================================================

-- Date Dimension (SCD 0 - Static)
CREATE TABLE IF NOT EXISTS kartezy_bi.dim_date (
    date_key INTEGER PRIMARY KEY,
    full_date DATE NOT NULL,
    day INTEGER NOT NULL,
    day_name VARCHAR(20) NOT NULL,
    day_of_week INTEGER NOT NULL,
    day_of_year INTEGER NOT NULL,
    week INTEGER NOT NULL,
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    month INTEGER NOT NULL,
    month_name VARCHAR(20) NOT NULL,
    quarter INTEGER NOT NULL,
    year INTEGER NOT NULL,
    year_quarter VARCHAR(10) NOT NULL,
    year_month VARCHAR(10) NOT NULL,
    is_weekend BOOLEAN NOT NULL DEFAULT FALSE,
    is_holiday BOOLEAN NOT NULL DEFAULT FALSE,
    festival_name VARCHAR(100),
    season VARCHAR(20)
);

-- Time Dimension (SCD 0 - Static)
CREATE TABLE IF NOT EXISTS kartezy_bi.dim_time (
    time_key INTEGER PRIMARY KEY,
    full_time TIME NOT NULL,
    hour INTEGER NOT NULL,
    minute INTEGER NOT NULL,
    am_pm VARCHAR(2) NOT NULL,
    period_of_day VARCHAR(20) NOT NULL,
    peak_hour BOOLEAN NOT NULL DEFAULT FALSE
);

-- Customer Dimension (SCD 2)
CREATE TABLE IF NOT EXISTS kartezy_bi.dim_customer (
    customer_key BIGSERIAL PRIMARY KEY,
    customer_id UUID NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    gender VARCHAR(20),
    age_group VARCHAR(20),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    zone VARCHAR(50),
    registration_date DATE NOT NULL,
    customer_segment VARCHAR(50),
    loyalty_tier VARCHAR(20),
    lifetime_value_tier VARCHAR(20),
    acquisition_channel VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    valid_from TIMESTAMP NOT NULL DEFAULT NOW(),
    valid_to TIMESTAMP,
    is_current BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (customer_id, valid_from)
);

-- Merchant Dimension (SCD 2)
CREATE TABLE IF NOT EXISTS kartezy_bi.dim_merchant (
    merchant_key BIGSERIAL PRIMARY KEY,
    merchant_id UUID NOT NULL,
    merchant_name VARCHAR(255) NOT NULL,
    merchant_type VARCHAR(50),
    owner_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zone VARCHAR(50),
    pincode VARCHAR(10),
    commission_rate DECIMAL(5,2),
    rating DECIMAL(2,1),
    status VARCHAR(20) NOT NULL,
    kyc_status VARCHAR(20),
    onboarding_date DATE NOT NULL,
    tier VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    valid_from TIMESTAMP NOT NULL DEFAULT NOW(),
    valid_to TIMESTAMP,
    is_current BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (merchant_id, valid_from)
);

-- Product Dimension (SCD 2)
CREATE TABLE IF NOT EXISTS kartezy_bi.dim_product (
    product_key BIGSERIAL PRIMARY KEY,
    product_id UUID NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    upc VARCHAR(50),
    brand VARCHAR(100),
    category_id UUID,
    category_name VARCHAR(255),
    subcategory_name VARCHAR(255),
    category_path VARCHAR(500),
    unit VARCHAR(50),
    base_price DECIMAL(10,2) NOT NULL,
    current_price DECIMAL(10,2),
    margin_percentage DECIMAL(5,2),
    gst_rate DECIMAL(5,2),
    is_perishable BOOLEAN DEFAULT FALSE,
    shelf_life_days INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    valid_from TIMESTAMP NOT NULL DEFAULT NOW(),
    valid_to TIMESTAMP,
    is_current BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (product_id, valid_from)
);

-- Delivery Partner Dimension (SCD 2)
CREATE TABLE IF NOT EXISTS kartezy_bi.dim_delivery_partner (
    partner_key BIGSERIAL PRIMARY KEY,
    partner_id UUID NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    city VARCHAR(100),
    zone VARCHAR(50),
    vehicle_type VARCHAR(50),
    vehicle_number VARCHAR(20),
    status VARCHAR(20) NOT NULL,
    kyc_status VARCHAR(20),
    rating DECIMAL(2,1),
    total_deliveries INTEGER DEFAULT 0,
    onboarding_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    valid_from TIMESTAMP NOT NULL DEFAULT NOW(),
    valid_to TIMESTAMP,
    is_current BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (partner_id, valid_from)
);

-- Location Dimension (SCD 0 - Static)
CREATE TABLE IF NOT EXISTS kartezy_bi.dim_location (
    location_key BIGSERIAL PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zone VARCHAR(50),
    sector VARCHAR(50),
    pincode VARCHAR(10),
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    region VARCHAR(50),
    metro_city BOOLEAN DEFAULT FALSE,
    tier VARCHAR(20),
    population_density VARCHAR(20)
);

-- Promotion Dimension (SCD 1)
CREATE TABLE IF NOT EXISTS kartezy_bi.dim_promotion (
    promotion_key BIGSERIAL PRIMARY KEY,
    promotion_id UUID NOT NULL UNIQUE,
    promotion_name VARCHAR(255) NOT NULL,
    promotion_code VARCHAR(50),
    promotion_type VARCHAR(50) NOT NULL,
    discount_value DECIMAL(10,2),
    channel VARCHAR(50),
    start_date DATE NOT NULL,
    end_date DATE,
    budget DECIMAL(12,2),
    target_segment VARCHAR(50),
    status VARCHAR(20) NOT NULL
);

-- ==========================================================================
-- FACT TABLES
-- ==========================================================================

-- Orders Fact Table
CREATE TABLE IF NOT EXISTS kartezy_bi.fact_orders (
    order_key BIGSERIAL PRIMARY KEY,
    order_id UUID NOT NULL,
    order_number VARCHAR(50) NOT NULL,
    date_key INTEGER NOT NULL REFERENCES kartezy_bi.dim_date(date_key),
    time_key INTEGER REFERENCES kartezy_bi.dim_time(time_key),
    customer_key BIGINT NOT NULL REFERENCES kartezy_bi.dim_customer(customer_key),
    merchant_key BIGINT NOT NULL REFERENCES kartezy_bi.dim_merchant(merchant_key),
    product_key BIGINT REFERENCES kartezy_bi.dim_product(product_key),
    location_key BIGINT REFERENCES kartezy_bi.dim_location(location_key),
    promotion_key BIGINT REFERENCES kartezy_bi.dim_promotion(promotion_key),
    order_status VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50),
    item_count INTEGER NOT NULL,
    subtotal_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    gmv_amount DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2),
    net_revenue DECIMAL(10,2),
    order_created_at TIMESTAMP NOT NULL,
    order_delivered_at TIMESTAMP,
    delivery_time_minutes INTEGER,
    is_first_order BOOLEAN DEFAULT FALSE,
    is_refunded BOOLEAN DEFAULT FALSE,
    refund_amount DECIMAL(10,2),
    is_returned BOOLEAN DEFAULT FALSE,
    etl_batch_id VARCHAR(50),
    etl_loaded_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Order Line Items Fact Table
CREATE TABLE IF NOT EXISTS kartezy_bi.fact_order_items (
    order_item_key BIGSERIAL PRIMARY KEY,
    order_key BIGINT NOT NULL REFERENCES kartezy_bi.fact_orders(order_key),
    product_key BIGINT NOT NULL REFERENCES kartezy_bi.dim_product(product_key),
    date_key INTEGER NOT NULL REFERENCES kartezy_bi.dim_date(date_key),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    margin_amount DECIMAL(10,2),
    margin_percentage DECIMAL(5,2),
    gst_amount DECIMAL(10,2),
    etl_loaded_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Payments Fact Table
CREATE TABLE IF NOT EXISTS kartezy_bi.fact_payments (
    payment_key BIGSERIAL PRIMARY KEY,
    payment_id UUID NOT NULL,
    order_key BIGINT REFERENCES kartezy_bi.fact_orders(order_key),
    customer_key BIGINT NOT NULL REFERENCES kartezy_bi.dim_customer(customer_key),
    merchant_key BIGINT REFERENCES kartezy_bi.dim_merchant(merchant_key),
    date_key INTEGER NOT NULL REFERENCES kartezy_bi.dim_date(date_key),
    payment_type VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50),
    amount DECIMAL(12,2) NOT NULL,
    fee_amount DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(12,2),
    payment_status VARCHAR(50) NOT NULL,
    razorpay_payment_id VARCHAR(100),
    etl_loaded_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Deliveries Fact Table
CREATE TABLE IF NOT EXISTS kartezy_bi.fact_deliveries (
    delivery_key BIGSERIAL PRIMARY KEY,
    delivery_id UUID NOT NULL,
    order_key BIGINT NOT NULL REFERENCES kartezy_bi.fact_orders(order_key),
    partner_key BIGINT NOT NULL REFERENCES kartezy_bi.dim_delivery_partner(partner_key),
    date_key INTEGER NOT NULL REFERENCES kartezy_bi.dim_date(date_key),
    origin_location_key BIGINT REFERENCES kartezy_bi.dim_location(location_key),
    destination_location_key BIGINT REFERENCES kartezy_bi.dim_location(location_key),
    assigned_at TIMESTAMP,
    picked_up_at TIMESTAMP,
    delivered_at TIMESTAMP,
    pickup_time_minutes INTEGER,
    transit_time_minutes INTEGER,
    total_delivery_time_minutes INTEGER,
    distance_km DECIMAL(8,2),
    delivery_status VARCHAR(50) NOT NULL,
    customer_rating INTEGER,
    delivery_fee DECIMAL(10,2),
    driver_earnings DECIMAL(10,2),
    etl_loaded_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Inventory Fact Table
CREATE TABLE IF NOT EXISTS kartezy_bi.fact_inventory (
    inventory_key BIGSERIAL PRIMARY KEY,
    product_key BIGINT NOT NULL REFERENCES kartezy_bi.dim_product(product_key),
    merchant_key BIGINT NOT NULL REFERENCES kartezy_bi.dim_merchant(merchant_key),
    date_key INTEGER NOT NULL REFERENCES kartezy_bi.dim_date(date_key),
    opening_stock INTEGER NOT NULL,
    closing_stock INTEGER NOT NULL,
    quantity_received INTEGER DEFAULT 0,
    quantity_sold INTEGER DEFAULT 0,
    quantity_damaged INTEGER DEFAULT 0,
    quantity_expired INTEGER DEFAULT 0,
    quantity_returned INTEGER DEFAULT 0,
    reorder_point INTEGER,
    days_until_stockout INTEGER,
    stock_value DECIMAL(12,2),
    etl_loaded_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (product_key, merchant_key, date_key)
);

-- Customer Activity Fact Table
CREATE TABLE IF NOT EXISTS kartezy_bi.fact_customer_activity (
    activity_key BIGSERIAL PRIMARY KEY,
    customer_key BIGINT NOT NULL REFERENCES kartezy_bi.dim_customer(customer_key),
    date_key INTEGER NOT NULL REFERENCES kartezy_bi.dim_date(date_key),
    time_key INTEGER REFERENCES kartezy_bi.dim_time(time_key),
    activity_type VARCHAR(50) NOT NULL,
    activity_source VARCHAR(50),
    product_key BIGINT REFERENCES kartezy_bi.dim_product(product_key),
    session_id VARCHAR(100),
    duration_seconds INTEGER,
    metadata_json JSONB,
    etl_loaded_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Marketing Fact Table
CREATE TABLE IF NOT EXISTS kartezy_bi.fact_marketing (
    marketing_key BIGSERIAL PRIMARY KEY,
    promotion_key BIGINT REFERENCES kartezy_bi.dim_promotion(promotion_key),
    date_key INTEGER NOT NULL REFERENCES kartezy_bi.dim_date(date_key),
    channel VARCHAR(50) NOT NULL,
    impressions BIGINT DEFAULT 0,
    clicks BIGINT DEFAULT 0,
    conversions BIGINT DEFAULT 0,
    click_through_rate DECIMAL(5,4),
    conversion_rate DECIMAL(5,4),
    spend DECIMAL(12,2) DEFAULT 0,
    revenue_attributed DECIMAL(12,2),
    roas DECIMAL(5,2),
    cost_per_click DECIMAL(8,2),
    cost_per_acquisition DECIMAL(8,2),
    etl_loaded_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==========================================================================
-- INDEXES
-- ==========================================================================

-- Fact Orders
CREATE INDEX IF NOT EXISTS idx_fo_customer ON kartezy_bi.fact_orders(customer_key);
CREATE INDEX IF NOT EXISTS idx_fo_merchant ON kartezy_bi.fact_orders(merchant_key);
CREATE INDEX IF NOT EXISTS idx_fo_date ON kartezy_bi.fact_orders(date_key);
CREATE INDEX IF NOT EXISTS idx_fo_status ON kartezy_bi.fact_orders(order_status);
CREATE INDEX IF NOT EXISTS idx_fo_created ON kartezy_bi.fact_orders(order_created_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_fo_order_id ON kartezy_bi.fact_orders(order_id);

-- Fact Order Items
CREATE INDEX IF NOT EXISTS idx_foi_order ON kartezy_bi.fact_order_items(order_key);
CREATE INDEX IF NOT EXISTS idx_foi_product ON kartezy_bi.fact_order_items(product_key);
CREATE INDEX IF NOT EXISTS idx_foi_date ON kartezy_bi.fact_order_items(date_key);

-- Fact Payments
CREATE INDEX IF NOT EXISTS idx_fp_type ON kartezy_bi.fact_payments(payment_type);
CREATE INDEX IF NOT EXISTS idx_fp_date ON kartezy_bi.fact_payments(date_key);
CREATE INDEX IF NOT EXISTS idx_fp_status ON kartezy_bi.fact_payments(payment_status);

-- Fact Deliveries
CREATE INDEX IF NOT EXISTS idx_fd_partner ON kartezy_bi.fact_deliveries(partner_key);
CREATE INDEX IF NOT EXISTS idx_fd_date ON kartezy_bi.fact_deliveries(date_key);
CREATE INDEX IF NOT EXISTS idx_fd_status ON kartezy_bi.fact_deliveries(delivery_status);

-- Fact Inventory
CREATE INDEX IF NOT EXISTS idx_fi_product ON kartezy_bi.fact_inventory(product_key);
CREATE INDEX IF NOT EXISTS idx_fi_merchant ON kartezy_bi.fact_inventory(merchant_key);
CREATE INDEX IF NOT EXISTS idx_fi_date ON kartezy_bi.fact_inventory(date_key);

-- Fact Customer Activity
CREATE INDEX IF NOT EXISTS idx_fca_customer ON kartezy_bi.fact_customer_activity(customer_key);
CREATE INDEX IF NOT EXISTS idx_fca_type ON kartezy_bi.fact_customer_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_fca_date ON kartezy_bi.fact_customer_activity(date_key);

-- Fact Marketing
CREATE INDEX IF NOT EXISTS idx_fm_promotion ON kartezy_bi.fact_marketing(promotion_key);
CREATE INDEX IF NOT EXISTS idx_fm_date ON kartezy_bi.fact_marketing(date_key);
CREATE INDEX IF NOT EXISTS idx_fm_channel ON kartezy_bi.fact_marketing(channel);

-- ==========================================================================
-- MATERIALIZED VIEWS FOR COMMON ANALYTICS QUERIES
-- ==========================================================================

-- Daily Revenue by City
CREATE MATERIALIZED VIEW IF NOT EXISTS kartezy_bi.mv_daily_revenue_by_city AS
SELECT
    d.full_date,
    l.city,
    l.state,
    COUNT(DISTINCT fo.order_id) AS order_count,
    COUNT(DISTINCT fo.customer_key) AS customer_count,
    SUM(fo.total_amount) AS total_revenue,
    SUM(fo.delivery_fee) AS total_delivery_fees,
    SUM(fo.commission_amount) AS total_commission,
    SUM(fo.net_revenue) AS net_revenue,
    AVG(fo.total_amount) AS avg_order_value
FROM kartezy_bi.fact_orders fo
JOIN kartezy_bi.dim_date d ON fo.date_key = d.date_key
JOIN kartezy_bi.dim_location l ON fo.location_key = l.location_key
WHERE fo.order_status = 'DELIVERED'
GROUP BY d.full_date, l.city, l.state;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_daily_rev_city
    ON kartezy_bi.mv_daily_revenue_by_city(full_date, city);

-- Monthly KPIs
CREATE MATERIALIZED VIEW IF NOT EXISTS kartezy_bi.mv_monthly_kpis AS
SELECT
    d.year,
    d.month,
    d.month_name,
    COUNT(DISTINCT fo.order_id) AS total_orders,
    COUNT(DISTINCT fo.customer_key) AS unique_customers,
    COUNT(DISTINCT fo.merchant_key) AS active_merchants,
    SUM(fo.total_amount) AS total_revenue,
    SUM(fo.gmv_amount) AS total_gmv,
    SUM(fo.commission_amount) AS total_commission,
    AVG(fo.total_amount) AS avg_order_value,
    COUNT(DISTINCT CASE WHEN fo.is_first_order THEN fo.customer_key END) AS new_customers,
    COUNT(DISTINCT fd.delivery_id) AS total_deliveries,
    AVG(fd.total_delivery_time_minutes) AS avg_delivery_time,
    AVG(fd.customer_rating) AS avg_delivery_rating
FROM kartezy_bi.fact_orders fo
JOIN kartezy_bi.dim_date d ON fo.date_key = d.date_key
LEFT JOIN kartezy_bi.fact_deliveries fd ON fo.order_key = fd.order_key
GROUP BY d.year, d.month, d.month_name;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_monthly_kpis
    ON kartezy_bi.mv_monthly_kpis(year, month);

-- Top Products (rolling 30 days)
CREATE MATERIALIZED VIEW IF NOT EXISTS kartezy_bi.mv_top_products_30d AS
SELECT
    p.product_name,
    p.category_name,
    p.brand,
    COUNT(DISTINCT foi.order_key) AS order_count,
    SUM(foi.quantity) AS units_sold,
    SUM(foi.total_price) AS revenue,
    SUM(foi.margin_amount) AS gross_margin,
    AVG(foi.unit_price) AS avg_price,
    RANK() OVER (ORDER BY SUM(foi.total_price) DESC) AS sales_rank
FROM kartezy_bi.fact_order_items foi
JOIN kartezy_bi.dim_product p ON foi.product_key = p.product_key
JOIN kartezy_bi.dim_date d ON foi.date_key = d.date_key
WHERE d.full_date >= CURRENT_DATE - INTERVAL '30 days'
AND p.is_current = TRUE
GROUP BY p.product_name, p.category_name, p.brand;

-- ==========================================================================
-- COMPLETE DATA MART VIEWS (for BI tools)
-- ==========================================================================

-- Executive Dashboard View
CREATE OR REPLACE VIEW kartezy_bi.v_executive_dashboard AS
SELECT
    (SELECT SUM(total_amount) FROM kartezy_bi.fact_orders WHERE date_key >= TO_CHAR(CURRENT_DATE - INTERVAL '30 days', 'YYYYMMDD')::int) AS revenue_30d,
    (SELECT COUNT(*) FROM kartezy_bi.fact_orders WHERE date_key >= TO_CHAR(CURRENT_DATE - INTERVAL '30 days', 'YYYYMMDD')::int) AS orders_30d,
    (SELECT COUNT(DISTINCT customer_key) FROM kartezy_bi.fact_orders WHERE date_key >= TO_CHAR(CURRENT_DATE - INTERVAL '30 days', 'YYYYMMDD')::int) AS active_customers_30d,
    (SELECT COUNT(*) FROM kartezy_bi.dim_customer WHERE is_current AND registration_date >= CURRENT_DATE - INTERVAL '30 days') AS new_customers_30d,
    (SELECT AVG(total_amount) FROM kartezy_bi.fact_orders WHERE order_status = 'DELIVERED' AND date_key >= TO_CHAR(CURRENT_DATE - INTERVAL '30 days', 'YYYYMMDD')::int) AS avg_order_value,
    (SELECT COUNT(*) FROM kartezy_bi.fact_deliveries WHERE delivery_status = 'DELIVERED' AND date_key >= TO_CHAR(CURRENT_DATE - INTERVAL '30 days', 'YYYYMMDD')::int) AS deliveries_30d,
    (SELECT AVG(total_delivery_time_minutes) FROM kartezy_bi.fact_deliveries WHERE delivery_status = 'DELIVERED' AND date_key >= TO_CHAR(CURRENT_DATE - INTERVAL '30 days', 'YYYYMMDD')::int) AS avg_delivery_time;

-- Customer 360 View
CREATE OR REPLACE VIEW kartezy_bi.v_customer_360 AS
SELECT
    c.customer_key,
    c.customer_id,
    c.first_name || ' ' || c.last_name AS customer_name,
    c.email,
    c.phone,
    c.city,
    c.customer_segment,
    c.loyalty_tier,
    c.registration_date,
    COUNT(DISTINCT fo.order_id) AS total_orders,
    SUM(fo.total_amount) AS total_revenue,
    AVG(fo.total_amount) AS avg_order_value,
    MAX(fo.order_created_at) AS last_order_date,
    MIN(fo.order_created_at) AS first_order_date,
    COUNT(DISTINCT fo.merchant_key) AS merchants_used,
    SUM(CASE WHEN fo.order_status = 'CANCELLED' THEN 1 ELSE 0 END) AS cancelled_orders,
    SUM(CASE WHEN fo.is_refunded THEN 1 ELSE 0 END) AS refunded_orders
FROM kartezy_bi.dim_customer c
LEFT JOIN kartezy_bi.fact_orders fo ON c.customer_key = fo.customer_key
WHERE c.is_current = TRUE
GROUP BY c.customer_key, c.customer_id, c.first_name, c.last_name, c.email,
         c.phone, c.city, c.customer_segment, c.loyalty_tier, c.registration_date;

-- Merchant Performance View
CREATE OR REPLACE VIEW kartezy_bi.v_merchant_performance AS
SELECT
    m.merchant_key,
    m.merchant_id,
    m.merchant_name,
    m.city,
    m.merchant_type,
    m.tier,
    m.rating,
    COUNT(DISTINCT fo.order_id) AS total_orders,
    SUM(fo.total_amount) AS total_revenue,
    SUM(fo.commission_amount) AS total_commission,
    AVG(fo.total_amount) AS avg_order_value,
    COUNT(DISTINCT fo.customer_key) AS unique_customers,
    SUM(CASE WHEN fo.order_status = 'DELIVERED' THEN 1 ELSE 0 END) AS completed_orders,
    SUM(CASE WHEN fo.order_status = 'CANCELLED' THEN 1 ELSE 0 END) AS cancelled_orders,
    AVG(fd.total_delivery_time_minutes) AS avg_delivery_time,
    AVG(fd.customer_rating) AS avg_delivery_rating
FROM kartezy_bi.dim_merchant m
LEFT JOIN kartezy_bi.fact_orders fo ON m.merchant_key = fo.merchant_key
LEFT JOIN kartezy_bi.fact_deliveries fd ON fo.order_key = fd.order_key
WHERE m.is_current = TRUE
GROUP BY m.merchant_key, m.merchant_id, m.merchant_name, m.city,
         m.merchant_type, m.tier, m.rating;

-- ==========================================================================
-- DATA QUALITY AND MONITORING
-- ==========================================================================

CREATE TABLE IF NOT EXISTS kartezy_bi.etl_audit_log (
    audit_id BIGSERIAL PRIMARY KEY,
    pipeline_name VARCHAR(100) NOT NULL,
    batch_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP,
    rows_extracted INTEGER DEFAULT 0,
    rows_loaded INTEGER DEFAULT 0,
    rows_failed INTEGER DEFAULT 0,
    error_message TEXT,
    duration_seconds INTEGER
);

CREATE INDEX IF NOT EXISTS idx_etl_audit_pipeline ON kartezy_bi.etl_audit_log(pipeline_name);
CREATE INDEX IF NOT EXISTS idx_etl_audit_status ON kartezy_bi.etl_audit_log(status);
CREATE INDEX IF NOT EXISTS idx_etl_audit_started ON kartezy_bi.etl_audit_log(started_at);

-- ==========================================================================
-- COMMENTS
-- ==========================================================================

COMMENT ON SCHEMA kartezy_bi IS 'Kartezy Enterprise Business Intelligence Platform - Data Warehouse';
COMMENT ON TABLE kartezy_bi.dim_date IS 'Date dimension for time-based analysis across all fact tables';
COMMENT ON TABLE kartezy_bi.fact_orders IS 'Core order fact table - single source of truth for order metrics';
COMMENT ON TABLE kartezy_bi.fact_order_items IS 'Order line items for product-level analysis';
COMMENT ON TABLE kartezy_bi.fact_payments IS 'Payment transactions for financial analytics';
COMMENT ON TABLE kartezy_bi.fact_deliveries IS 'Delivery/logistics facts for fleet performance analysis';
COMMENT ON TABLE kartezy_bi.fact_inventory IS 'Daily inventory snapshots for stock analysis';
COMMENT ON TABLE kartezy_bi.fact_customer_activity IS 'Customer behavioral events for funnel and engagement analysis';
COMMENT ON TABLE kartezy_bi.fact_marketing IS 'Marketing campaign performance metrics';

-- ==========================================================================
-- END OF SCHEMA
-- ==========================================================================
