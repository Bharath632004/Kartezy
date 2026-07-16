-- ============================================================
-- Kartezy Database Initialization Script
-- PostgreSQL initialization for development/staging
-- Production migrations managed via Flyway in backend/shared/
-- ============================================================

-- Create schemas
CREATE SCHEMA IF NOT EXISTS kartezy_auth;
CREATE SCHEMA IF NOT EXISTS kartezy_catalog;
CREATE SCHEMA IF NOT EXISTS kartezy_orders;
CREATE SCHEMA IF NOT EXISTS kartezy_payments;
CREATE SCHEMA IF NOT EXISTS kartezy_delivery;
CREATE SCHEMA IF NOT EXISTS kartezy_notifications;
CREATE SCHEMA IF NOT EXISTS kartezy_analytics;

-- Set search path
SET search_path TO public, kartezy_auth, kartezy_catalog, kartezy_orders, kartezy_payments, kartezy_delivery, kartezy_notifications, kartezy_analytics;

-- Auth schema tables
CREATE TABLE IF NOT EXISTS kartezy_auth.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'CUSTOMER',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kartezy_auth.refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES kartezy_auth.users(id) ON DELETE CASCADE,
    token VARCHAR(512) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revoked BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS kartezy_auth.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kartezy_auth.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS kartezy_auth.role_permissions (
    role_id UUID REFERENCES kartezy_auth.roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES kartezy_auth.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- Catalog schema tables
CREATE TABLE IF NOT EXISTS kartezy_catalog.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES kartezy_catalog.categories(id),
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kartezy_catalog.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL,
    category_id UUID REFERENCES kartezy_catalog.categories(id),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    compare_price DECIMAL(10, 2),
    unit VARCHAR(50),
    quantity INT,
    image_url TEXT,
    images JSONB DEFAULT '[]',
    attributes JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    is_available BOOLEAN DEFAULT TRUE,
    average_rating DECIMAL(3, 2) DEFAULT 0,
    review_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders schema tables
CREATE TABLE IF NOT EXISTS kartezy_orders.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL,
    merchant_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    subtotal DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    delivery_fee DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    delivery_address JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON kartezy_auth.users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON kartezy_auth.users(phone);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON kartezy_auth.refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON kartezy_auth.refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_products_merchant ON kartezy_catalog.products(merchant_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON kartezy_catalog.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON kartezy_catalog.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON kartezy_catalog.products(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_categories_slug ON kartezy_catalog.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON kartezy_catalog.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON kartezy_orders.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_merchant ON kartezy_orders.orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON kartezy_orders.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON kartezy_orders.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_number ON kartezy_orders.orders(order_number);

-- Insert default roles
INSERT INTO kartezy_auth.roles (name, description)
VALUES 
    ('SUPER_ADMIN', 'Full system access'),
    ('ADMIN', 'Administrative access'),
    ('MERCHANT', 'Merchant access'),
    ('DELIVERY_PARTNER', 'Delivery partner access'),
    ('CUSTOMER', 'Customer access')
ON CONFLICT (name) DO NOTHING;
