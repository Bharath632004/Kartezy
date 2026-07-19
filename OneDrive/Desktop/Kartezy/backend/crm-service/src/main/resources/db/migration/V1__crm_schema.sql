-- Kartezy Enterprise CRM - Initial Schema
-- Flyway Migration V1

CREATE TABLE customer_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    first_name VARCHAR(100), last_name VARCHAR(100),
    email VARCHAR(200), phone VARCHAR(20),
    date_of_birth DATE, gender VARCHAR(20),
    city VARCHAR(100), state VARCHAR(100), pincode VARCHAR(10),
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(20,4) DEFAULT 0,
    avg_order_value DECIMAL(20,4) DEFAULT 0,
    lifetime_value DECIMAL(20,4) DEFAULT 0,
    last_order_date TIMESTAMP,
    loyalty_tier VARCHAR(30) DEFAULT 'BRONZE',
    loyalty_points INTEGER DEFAULT 0,
    referral_code VARCHAR(50), referred_by BIGINT,
    referral_count INTEGER DEFAULT 0,
    email_opt_in BOOLEAN DEFAULT FALSE, sms_opt_in BOOLEAN DEFAULT FALSE,
    whatsapp_opt_in BOOLEAN DEFAULT FALSE, push_opt_in BOOLEAN DEFAULT FALSE,
    app_last_seen TIMESTAMP,
    notes VARCHAR(2000), tags VARCHAR(500),
    preferred_categories VARCHAR(500), preferred_merchants VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE, is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

CREATE TABLE merchant_profiles (
    id BIGSERIAL PRIMARY KEY,
    merchant_id BIGINT NOT NULL UNIQUE,
    business_name VARCHAR(200), owner_name VARCHAR(200),
    email VARCHAR(200), phone VARCHAR(20),
    business_category VARCHAR(100), city VARCHAR(100), state VARCHAR(100),
    total_orders INTEGER DEFAULT 0,
    total_revenue DECIMAL(20,4) DEFAULT 0,
    commission_paid DECIMAL(20,4) DEFAULT 0,
    avg_rating DOUBLE PRECISION,
    status VARCHAR(30) DEFAULT 'ACTIVE', tier VARCHAR(30) DEFAULT 'STANDARD',
    last_activity_date TIMESTAMP, account_manager VARCHAR(200),
    notes VARCHAR(2000), tags VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE, is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

CREATE TABLE leads (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100), last_name VARCHAR(100),
    email VARCHAR(200), phone VARCHAR(20),
    company VARCHAR(200), designation VARCHAR(200),
    source VARCHAR(30), status VARCHAR(30) DEFAULT 'NEW',
    lead_score INTEGER DEFAULT 0,
    budget DECIMAL(20,4), interest_category VARCHAR(200),
    message VARCHAR(2000),
    city VARCHAR(100), state VARCHAR(100),
    assigned_to VARCHAR(100), assigned_at TIMESTAMP,
    expected_close_date DATE,
    converted_to_user_id BIGINT, converted_at TIMESTAMP,
    conversion_value DECIMAL(20,4),
    last_contacted_at TIMESTAMP, notes VARCHAR(2000),
    campaign_id BIGINT,
    utm_source VARCHAR(100), utm_medium VARCHAR(100), utm_campaign VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE, is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

CREATE TABLE referrals (
    id BIGSERIAL PRIMARY KEY,
    referrer_id BIGINT NOT NULL, referrer_name VARCHAR(200),
    referee_id BIGINT, referee_name VARCHAR(200),
    referee_email VARCHAR(200), referee_phone VARCHAR(20),
    referral_code VARCHAR(50),
    status VARCHAR(30) DEFAULT 'PENDING',
    reward_type VARCHAR(30), reward_amount DECIMAL(20,4),
    reward_claimed BOOLEAN DEFAULT FALSE, reward_claimed_at TIMESTAMP,
    referrer_reward DECIMAL(20,4), referee_reward DECIMAL(20,4),
    referrer_points INTEGER DEFAULT 0, referee_points INTEGER DEFAULT 0,
    conversion_order_id BIGINT, conversion_at TIMESTAMP,
    notes VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE, is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

CREATE TABLE loyalty_programs (
    id BIGSERIAL PRIMARY KEY,
    program_name VARCHAR(200) NOT NULL, description VARCHAR(1000),
    points_per_rupee INTEGER DEFAULT 1,
    minimum_points_redeem INTEGER DEFAULT 100,
    points_value DECIMAL(20,4) DEFAULT 0.25,
    points_expiry_days INTEGER DEFAULT 365,
    signup_bonus_points INTEGER DEFAULT 100,
    birthday_bonus_points INTEGER DEFAULT 50,
    tier_name_silver VARCHAR(100) DEFAULT 'Silver',
    tier_threshold_silver INTEGER DEFAULT 500,
    tier_name_gold VARCHAR(100) DEFAULT 'Gold',
    tier_threshold_gold INTEGER DEFAULT 2000,
    tier_name_platinum VARCHAR(100) DEFAULT 'Platinum',
    tier_threshold_platinum INTEGER DEFAULT 5000,
    effective_from DATE, effective_to DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE, is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

CREATE TABLE loyalty_transactions (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    transaction_type VARCHAR(30) NOT NULL,
    points INTEGER DEFAULT 0,
    balance_before INTEGER DEFAULT 0, balance_after INTEGER DEFAULT 0,
    description VARCHAR(500),
    order_id BIGINT, referral_id BIGINT, campaign_id BIGINT,
    expiry_date DATE,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE, is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

CREATE TABLE campaigns (
    id BIGSERIAL PRIMARY KEY,
    campaign_name VARCHAR(200) NOT NULL, description VARCHAR(2000),
    channel VARCHAR(30) NOT NULL, campaign_type VARCHAR(50),
    status VARCHAR(30) DEFAULT 'DRAFT',
    segment_id BIGINT, segment_name VARCHAR(200),
    target_audience_size INTEGER,
    subject_line VARCHAR(500), preheader VARCHAR(200),
    sender_name VARCHAR(200), sender_email VARCHAR(200),
    template_id VARCHAR(100),
    content_html TEXT, content_text TEXT,
    scheduled_at TIMESTAMP, sent_at TIMESTAMP, completed_at TIMESTAMP,
    sent_count INTEGER DEFAULT 0, delivered_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0, clicked_count INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,
    conversion_revenue DECIMAL(20,4) DEFAULT 0,
    bounce_count INTEGER DEFAULT 0, unsubscribe_count INTEGER DEFAULT 0,
    complaint_count INTEGER DEFAULT 0,
    budget DECIMAL(20,4), actual_cost DECIMAL(20,4),
    is_ab_test BOOLEAN DEFAULT FALSE, ab_test_winner VARCHAR(50),
    created_by_user VARCHAR(100),
    approved_by VARCHAR(100), approved_at TIMESTAMP,
    notes VARCHAR(2000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE, is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

CREATE TABLE campaign_variants (
    id BIGSERIAL PRIMARY KEY,
    campaign_id BIGINT NOT NULL,
    variant_name VARCHAR(200), variant_type VARCHAR(30),
    subject_line VARCHAR(500), content_html TEXT, content_text TEXT,
    audience_percentage INTEGER,
    sent_count INTEGER DEFAULT 0, opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0, conversion_count INTEGER DEFAULT 0,
    is_winner BOOLEAN DEFAULT FALSE,
    status VARCHAR(30) DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE, is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

CREATE TABLE campaign_interactions (
    id BIGSERIAL PRIMARY KEY,
    campaign_id BIGINT NOT NULL, campaign_variant_id BIGINT,
    customer_id BIGINT,
    recipient_email VARCHAR(200), recipient_phone VARCHAR(20),
    interaction_type VARCHAR(30) NOT NULL,
    interaction_time TIMESTAMP NOT NULL,
    message_id VARCHAR(200),
    device_type VARCHAR(30), platform VARCHAR(30),
    user_agent VARCHAR(500), ip_address VARCHAR(50),
    url_clicked VARCHAR(500), conversion_value DOUBLE PRECISION,
    properties_json JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE, is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

CREATE TABLE coupons (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE, description VARCHAR(500),
    coupon_type VARCHAR(30), discount_type VARCHAR(30),
    discount_value DECIMAL(20,4) DEFAULT 0,
    max_discount DECIMAL(20,4), min_order_value DECIMAL(20,4),
    customer_id BIGINT, customer_name VARCHAR(200), campaign_id BIGINT,
    is_public BOOLEAN DEFAULT FALSE,
    usage_limit INTEGER DEFAULT 1, usage_count INTEGER DEFAULT 0,
    max_uses_per_customer INTEGER DEFAULT 1,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    start_date DATE, expiry_date DATE,
    applicable_categories VARCHAR(500), applicable_merchants VARCHAR(500),
    first_order_only BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP, used_order_id BIGINT,
    notes VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE, is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

CREATE TABLE customer_segments (
    id BIGSERIAL PRIMARY KEY,
    segment_name VARCHAR(200) NOT NULL, description VARCHAR(1000),
    criteria_json JSONB,
    member_count INTEGER DEFAULT 0,
    is_dynamic BOOLEAN DEFAULT FALSE,
    refresh_interval_minutes INTEGER DEFAULT 60,
    last_refreshed_at TIMESTAMP,
    color VARCHAR(20), icon VARCHAR(50),
    created_by_user VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE, is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

CREATE TABLE behavior_events (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    event_type VARCHAR(50) NOT NULL, event_name VARCHAR(200),
    event_time TIMESTAMP NOT NULL,
    session_id VARCHAR(100),
    page_url VARCHAR(500), page_title VARCHAR(500), referrer_url VARCHAR(500),
    user_agent VARCHAR(500), ip_address VARCHAR(50),
    properties_json JSONB,
    product_id BIGINT, category_id BIGINT, merchant_id BIGINT, order_id BIGINT,
    value VARCHAR(500),
    duration_seconds INTEGER,
    device_type VARCHAR(30), platform VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE, is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

CREATE TABLE marketing_automation_rules (
    id BIGSERIAL PRIMARY KEY,
    rule_name VARCHAR(200) NOT NULL, description VARCHAR(1000),
    trigger_event VARCHAR(50), trigger_conditions_json JSONB,
    action_type VARCHAR(50), action_config_json JSONB,
    campaign_id BIGINT, segment_id BIGINT,
    delay_minutes INTEGER DEFAULT 0, priority INTEGER DEFAULT 0,
    execution_count INTEGER DEFAULT 0, last_executed_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE, created_by_user VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100),
    is_deleted BOOLEAN DEFAULT FALSE, version BIGINT DEFAULT 0
);

CREATE TABLE notification_templates (
    id BIGSERIAL PRIMARY KEY,
    template_name VARCHAR(200) NOT NULL, description VARCHAR(500),
    channel VARCHAR(30) NOT NULL,
    subject_line VARCHAR(500), content_html TEXT, content_text TEXT,
    variables_json JSONB,
    thumbnail_url VARCHAR(500),
    is_draft BOOLEAN DEFAULT TRUE,
    category VARCHAR(50), created_by_user VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE, is_deleted BOOLEAN DEFAULT FALSE,
    version BIGINT DEFAULT 0
);

-- Indexes
CREATE INDEX idx_cp_user ON customer_profiles(user_id);
CREATE INDEX idx_cp_city ON customer_profiles(city);
CREATE INDEX idx_cp_tier ON customer_profiles(loyalty_tier);
CREATE INDEX idx_mp_merchant ON merchant_profiles(merchant_id);
CREATE INDEX idx_lead_status ON leads(status);
CREATE INDEX idx_lead_source ON leads(source);
CREATE INDEX idx_lead_score ON leads(lead_score);
CREATE INDEX idx_lead_owner ON leads(assigned_to);
CREATE INDEX idx_ref_referrer ON referrals(referrer_id);
CREATE INDEX idx_ref_code ON referrals(referral_code);
CREATE INDEX idx_ref_status ON referrals(status);
CREATE INDEX idx_camp_status ON campaigns(status);
CREATE INDEX idx_camp_channel ON campaigns(channel);
CREATE INDEX idx_camp_schedule ON campaigns(scheduled_at);
CREATE INDEX idx_coup_code ON coupons(code);
CREATE INDEX idx_coup_customer ON coupons(customer_id);
CREATE INDEX idx_coup_status ON coupons(status);
CREATE INDEX idx_coup_expiry ON coupons(expiry_date);
CREATE INDEX idx_ci_campaign ON campaign_interactions(campaign_id);
CREATE INDEX idx_ci_customer ON campaign_interactions(customer_id);
CREATE INDEX idx_ci_type ON campaign_interactions(interaction_type);
CREATE INDEX idx_ci_time ON campaign_interactions(interaction_time);
CREATE INDEX idx_be_customer ON behavior_events(customer_id);
CREATE INDEX idx_be_type ON behavior_events(event_type);
CREATE INDEX idx_be_time ON behavior_events(event_time);
CREATE INDEX idx_be_session ON behavior_events(session_id);
CREATE INDEX idx_lt_customer ON loyalty_transactions(customer_id);
CREATE INDEX idx_lt_type ON loyalty_transactions(transaction_type);
CREATE INDEX idx_cv_campaign ON campaign_variants(campaign_id);

-- Seed data: Default loyalty program
INSERT INTO loyalty_programs (program_name, description, points_per_rupee, minimum_points_redeem, points_value, points_expiry_days, signup_bonus_points, birthday_bonus_points, is_active)
VALUES ('Kartezy Rewards', 'Default loyalty rewards program', 1, 100, 0.25, 365, 100, 50, true);

-- Seed data: Default segments
INSERT INTO customer_segments (segment_name, description, is_dynamic, color, icon, created_by_user)
VALUES ('All Customers', 'All registered customers', false, '#1976d2', 'People', 'system'),
       ('High Value', 'Customers with >5 orders and >₹10,000 spent', true, '#388e3c', 'Star', 'system'),
       ('At Risk', 'Customers with no orders in last 90 days', true, '#d32f2f', 'Warning', 'system'),
       ('New Users', 'Customers with <3 orders', true, '#f57c00', 'NewReleases', 'system');
