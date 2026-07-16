/**
 * Kartezy Enterprise BI Platform - Data Warehouse Schemas
 *
 * Complete dimensional data warehouse schema definitions for the BI platform.
 * Implements a star-schema design optimized for analytical queries.
 */

export interface DWTable {
  name: string;
  schema: string;
  type: 'fact' | 'dimension' | 'aggregate' | 'view' | 'materialized_view';
  description: string;
  columns: DWColumn[];
  partitions?: string[];
  indexes?: DWIndex[];
  rowEstimate?: number;
}

export interface DWColumn {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey?: boolean;
  foreignKey?: { table: string; column: string };
  default?: string;
  description: string;
}

export interface DWIndex {
  name: string;
  columns: string[];
  unique?: boolean;
  method?: 'btree' | 'hash' | 'gin' | 'gist' | 'brin';
}

// ====================
// DIMENSION TABLES
// ====================

export const dimDate: DWTable = {
  name: 'dim_date',
  schema: 'kartezy_bi',
  type: 'dimension',
  description: 'Date dimension for time-based analysis - supports drill-down from year to day',
  columns: [
    { name: 'date_key', type: 'INTEGER', nullable: false, primaryKey: true, description: 'Surrogate key in YYYYMMDD format' },
    { name: 'full_date', type: 'DATE', nullable: false, description: 'Full date value' },
    { name: 'day', type: 'INTEGER', nullable: false, description: 'Day of month (1-31)' },
    { name: 'day_name', type: 'VARCHAR(20)', nullable: false, description: 'Day name (Monday-Sunday)' },
    { name: 'day_of_week', type: 'INTEGER', nullable: false, description: 'Day of week (1=Monday, 7=Sunday)' },
    { name: 'day_of_year', type: 'INTEGER', nullable: false, description: 'Day of year (1-366)' },
    { name: 'week', type: 'INTEGER', nullable: false, description: 'Week number of year' },
    { name: 'week_start_date', type: 'DATE', nullable: false, description: 'Week start date (Monday)' },
    { name: 'week_end_date', type: 'DATE', nullable: false, description: 'Week end date (Sunday)' },
    { name: 'month', type: 'INTEGER', nullable: false, description: 'Month number (1-12)' },
    { name: 'month_name', type: 'VARCHAR(20)', nullable: false, description: 'Month name' },
    { name: 'quarter', type: 'INTEGER', nullable: false, description: 'Quarter (1-4)' },
    { name: 'year', type: 'INTEGER', nullable: false, description: 'Year' },
    { name: 'year_quarter', type: 'VARCHAR(10)', nullable: false, description: 'Year-Quarter (e.g., 2024-Q1)' },
    { name: 'year_month', type: 'VARCHAR(10)', nullable: false, description: 'Year-Month (e.g., 2024-01)' },
    { name: 'is_weekend', type: 'BOOLEAN', nullable: false, description: 'Is weekend day' },
    { name: 'is_holiday', type: 'BOOLEAN', nullable: false, default: 'FALSE', description: 'Is Indian public holiday' },
    { name: 'festival_name', type: 'VARCHAR(100)', nullable: true, description: 'Festival name if applicable' },
    { name: 'season', type: 'VARCHAR(20)', nullable: true, description: 'Season (Summer, Monsoon, Winter, Spring, Autumn)' },
  ],
  indexes: [
    { name: 'idx_dim_date_year_month', columns: ['year', 'month'] },
    { name: 'idx_dim_date_quarter', columns: ['year', 'quarter'] },
    { name: 'idx_dim_date_week', columns: ['year', 'week'] },
  ],
};

export const dimTime: DWTable = {
  name: 'dim_time',
  schema: 'kartezy_bi',
  type: 'dimension',
  description: 'Time dimension for intra-day analysis',
  columns: [
    { name: 'time_key', type: 'INTEGER', nullable: false, primaryKey: true, description: 'Time key in HHMMSS format' },
    { name: 'full_time', type: 'TIME', nullable: false, description: 'Full time value' },
    { name: 'hour', type: 'INTEGER', nullable: false, description: 'Hour (0-23)' },
    { name: 'hour_12', type: 'INTEGER', nullable: false, description: 'Hour in 12-hour format' },
    { name: 'am_pm', type: 'VARCHAR(2)', nullable: false, description: 'AM or PM' },
    { name: 'minute', type: 'INTEGER', nullable: false, description: 'Minute (0-59)' },
    { name: 'period_of_day', type: 'VARCHAR(20)', nullable: false, description: 'Early Morning/Morning/Afternoon/Evening/Night/Late Night' },
    { name: 'peak_hour', type: 'BOOLEAN', nullable: false, description: 'Is peak ordering hour' },
  ],
};

export const dimCustomer: DWTable = {
  name: 'dim_customer',
  schema: 'kartezy_bi',
  type: 'dimension',
  description: 'Customer dimension with demographics, segmentation, and behavioral attributes',
  columns: [
    { name: 'customer_key', type: 'BIGSERIAL', nullable: false, primaryKey: true, description: 'Surrogate key' },
    { name: 'customer_id', type: 'UUID', nullable: false, description: 'Source system customer ID' },
    { name: 'first_name', type: 'VARCHAR(100)', nullable: true, description: 'First name' },
    { name: 'last_name', type: 'VARCHAR(100)', nullable: true, description: 'Last name' },
    { name: 'email', type: 'VARCHAR(255)', nullable: false, description: 'Email address' },
    { name: 'phone', type: 'VARCHAR(20)', nullable: true, description: 'Phone number' },
    { name: 'gender', type: 'VARCHAR(20)', nullable: true, description: 'Gender' },
    { name: 'age_group', type: 'VARCHAR(20)', nullable: true, description: 'Age group (18-24, 25-34, 35-44, 45-54, 55+)' },
    { name: 'city', type: 'VARCHAR(100)', nullable: true, description: 'City' },
    { name: 'state', type: 'VARCHAR(100)', nullable: true, description: 'State' },
    { name: 'pincode', type: 'VARCHAR(10)', nullable: true, description: 'Pincode/ZIP' },
    { name: 'zone', type: 'VARCHAR(50)', nullable: true, description: 'Delivery zone' },
    { name: 'registration_date', type: 'DATE', nullable: false, description: 'Customer registration date' },
    { name: 'customer_segment', type: 'VARCHAR(50)', nullable: true, description: 'Segment: HIGH_VALUE/REGULAR/OCCASIONAL/NEW/AT_RISK' },
    { name: 'loyalty_tier', type: 'VARCHAR(20)', nullable: true, description: 'Loyalty tier: PLATINUM/GOLD/SILVER/BRONZE' },
    { name: 'lifetime_value_tier', type: 'VARCHAR(20)', nullable: true, description: 'LTV tier' },
    { name: 'acquisition_channel', type: 'VARCHAR(50)', nullable: true, description: 'How customer was acquired' },
    { name: 'is_active', type: 'BOOLEAN', nullable: false, default: 'TRUE', description: 'Is customer active' },
    { name: 'is_verified', type: 'BOOLEAN', nullable: false, default: 'FALSE', description: 'Is customer verified' },
    { name: 'valid_from', type: 'TIMESTAMP', nullable: false, description: 'SCD2 valid from' },
    { name: 'valid_to', type: 'TIMESTAMP', nullable: true, description: 'SCD2 valid to' },
    { name: 'is_current', type: 'BOOLEAN', nullable: false, default: 'TRUE', description: 'SCD2 current flag' },
  ],
  indexes: [
    { name: 'idx_dim_customer_id', columns: ['customer_id'], unique: true },
    { name: 'idx_dim_customer_email', columns: ['email'] },
    { name: 'idx_dim_customer_city', columns: ['city'] },
    { name: 'idx_dim_customer_segment', columns: ['customer_segment'] },
    { name: 'idx_dim_customer_zone', columns: ['zone'] },
  ],
};

export const dimMerchant: DWTable = {
  name: 'dim_merchant',
  schema: 'kartezy_bi',
  type: 'dimension',
  description: 'Merchant/store dimension for multi-tenant analytics',
  columns: [
    { name: 'merchant_key', type: 'BIGSERIAL', nullable: false, primaryKey: true, description: 'Surrogate key' },
    { name: 'merchant_id', type: 'UUID', nullable: false, description: 'Source system merchant ID' },
    { name: 'merchant_name', type: 'VARCHAR(255)', nullable: false, description: 'Merchant/store name' },
    { name: 'merchant_type', type: 'VARCHAR(50)', nullable: true, description: 'Type: GROCERY/DAIRY/PHARMACY/etc.' },
    { name: 'owner_name', type: 'VARCHAR(255)', nullable: true, description: 'Owner name' },
    { name: 'email', type: 'VARCHAR(255)', nullable: true, description: 'Business email' },
    { name: 'phone', type: 'VARCHAR(20)', nullable: true, description: 'Business phone' },
    { name: 'city', type: 'VARCHAR(100)', nullable: false, description: 'City' },
    { name: 'state', type: 'VARCHAR(100)', nullable: false, description: 'State' },
    { name: 'zone', type: 'VARCHAR(50)', nullable: true, description: 'Delivery zone' },
    { name: 'pincode', type: 'VARCHAR(10)', nullable: true, description: 'Pincode' },
    { name: 'commission_rate', type: 'DECIMAL(5,2)', nullable: true, description: 'Commission rate percentage' },
    { name: 'rating', type: 'DECIMAL(2,1)', nullable: true, description: 'Average merchant rating' },
    { name: 'status', type: 'VARCHAR(20)', nullable: false, description: 'Status: ACTIVE/SUSPENDED/PENDING/INACTIVE' },
    { name: 'kyc_status', type: 'VARCHAR(20)', nullable: true, description: 'KYC status: VERIFIED/PENDING/REJECTED' },
    { name: 'onboarding_date', type: 'DATE', nullable: false, description: 'Merchant onboarding date' },
    { name: 'tier', type: 'VARCHAR(20)', nullable: true, description: 'Merchant tier: PREMIUM/STANDARD/BASIC' },
    { name: 'is_active', type: 'BOOLEAN', nullable: false, default: 'TRUE', description: 'Is merchant active' },
    { name: 'valid_from', type: 'TIMESTAMP', nullable: false, description: 'SCD2 valid from' },
    { name: 'valid_to', type: 'TIMESTAMP', nullable: true, description: 'SCD2 valid to' },
    { name: 'is_current', type: 'BOOLEAN', nullable: false, default: 'TRUE', description: 'SCD2 current flag' },
  ],
  indexes: [
    { name: 'idx_dim_merchant_id', columns: ['merchant_id'], unique: true },
    { name: 'idx_dim_merchant_city', columns: ['city'] },
    { name: 'idx_dim_merchant_status', columns: ['status'] },
    { name: 'idx_dim_merchant_tier', columns: ['tier'] },
  ],
};

export const dimProduct: DWTable = {
  name: 'dim_product',
  schema: 'kartezy_bi',
  type: 'dimension',
  description: 'Product dimension with category hierarchy for product analytics',
  columns: [
    { name: 'product_key', type: 'BIGSERIAL', nullable: false, primaryKey: true, description: 'Surrogate key' },
    { name: 'product_id', type: 'UUID', nullable: false, description: 'Source system product ID' },
    { name: 'product_name', type: 'VARCHAR(255)', nullable: false, description: 'Product name' },
    { name: 'sku', type: 'VARCHAR(100)', nullable: true, description: 'Stock keeping unit' },
    { name: 'upc', type: 'VARCHAR(50)', nullable: true, description: 'Universal product code' },
    { name: 'brand', type: 'VARCHAR(100)', nullable: true, description: 'Brand name' },
    { name: 'category_id', type: 'UUID', nullable: true, description: 'Category ID' },
    { name: 'category_name', type: 'VARCHAR(255)', nullable: true, description: 'Category name' },
    { name: 'subcategory_name', type: 'VARCHAR(255)', nullable: true, description: 'Subcategory name' },
    { name: 'category_path', type: 'VARCHAR(500)', nullable: true, description: 'Full category path' },
    { name: 'unit', type: 'VARCHAR(50)', nullable: true, description: 'Unit (kg, pcs, ltr, etc.)' },
    { name: 'base_price', type: 'DECIMAL(10,2)', nullable: false, description: 'Base price' },
    { name: 'current_price', type: 'DECIMAL(10,2)', nullable: true, description: 'Current selling price' },
    { name: 'margin_percentage', type: 'DECIMAL(5,2)', nullable: true, description: 'Margin percentage' },
    { name: 'gst_rate', type: 'DECIMAL(5,2)', nullable: true, description: 'GST rate percentage' },
    { name: 'is_perishable', type: 'BOOLEAN', nullable: true, default: 'FALSE', description: 'Is perishable item' },
    { name: 'shelf_life_days', type: 'INTEGER', nullable: true, description: 'Shelf life in days' },
    { name: 'is_active', type: 'BOOLEAN', nullable: false, default: 'TRUE', description: 'Is product active' },
    { name: 'valid_from', type: 'TIMESTAMP', nullable: false, description: 'SCD2 valid from' },
    { name: 'valid_to', type: 'TIMESTAMP', nullable: true, description: 'SCD2 valid to' },
    { name: 'is_current', type: 'BOOLEAN', nullable: false, default: 'TRUE', description: 'SCD2 current flag' },
  ],
  indexes: [
    { name: 'idx_dim_product_id', columns: ['product_id'], unique: true },
    { name: 'idx_dim_product_sku', columns: ['sku'], unique: true },
    { name: 'idx_dim_product_category', columns: ['category_name'] },
    { name: 'idx_dim_product_brand', columns: ['brand'] },
  ],
};

export const dimDeliveryPartner: DWTable = {
  name: 'dim_delivery_partner',
  schema: 'kartezy_bi',
  type: 'dimension',
  description: 'Delivery driver/partner dimension for fleet analytics',
  columns: [
    { name: 'partner_key', type: 'BIGSERIAL', nullable: false, primaryKey: true, description: 'Surrogate key' },
    { name: 'partner_id', type: 'UUID', nullable: false, description: 'Source system partner ID' },
    { name: 'first_name', type: 'VARCHAR(100)', nullable: true, description: 'First name' },
    { name: 'last_name', type: 'VARCHAR(100)', nullable: true, description: 'Last name' },
    { name: 'phone', type: 'VARCHAR(20)', nullable: false, description: 'Phone number' },
    { name: 'email', type: 'VARCHAR(255)', nullable: true, description: 'Email address' },
    { name: 'city', type: 'VARCHAR(100)', nullable: true, description: 'City of operation' },
    { name: 'zone', type: 'VARCHAR(50)', nullable: true, description: 'Assigned zone' },
    { name: 'vehicle_type', type: 'VARCHAR(50)', nullable: true, description: 'Vehicle type (Bike/Scooter/Cycle/Car)' },
    { name: 'vehicle_number', type: 'VARCHAR(20)', nullable: true, description: 'Vehicle registration number' },
    { name: 'status', type: 'VARCHAR(20)', nullable: false, description: 'Status: ACTIVE/INACTIVE/SUSPENDED/BUSY' },
    { name: 'kyc_status', type: 'VARCHAR(20)', nullable: true, description: 'KYC status' },
    { name: 'rating', type: 'DECIMAL(2,1)', nullable: true, description: 'Average rating' },
    { name: 'total_deliveries', type: 'INTEGER', nullable: true, default: '0', description: 'Lifetime total deliveries' },
    { name: 'onboarding_date', type: 'DATE', nullable: false, description: 'Onboarding date' },
    { name: 'is_active', type: 'BOOLEAN', nullable: false, default: 'TRUE', description: 'Is active' },
    { name: 'valid_from', type: 'TIMESTAMP', nullable: false, description: 'SCD2 valid from' },
    { name: 'valid_to', type: 'TIMESTAMP', nullable: true, description: 'SCD2 valid to' },
    { name: 'is_current', type: 'BOOLEAN', nullable: false, default: 'TRUE', description: 'SCD2 current flag' },
  ],
  indexes: [
    { name: 'idx_dim_partner_id', columns: ['partner_id'], unique: true },
    { name: 'idx_dim_partner_zone', columns: ['zone'] },
    { name: 'idx_dim_partner_status', columns: ['status'] },
  ],
};

export const dimLocation: DWTable = {
  name: 'dim_location',
  schema: 'kartezy_bi',
  type: 'dimension',
  description: 'Geographic location dimension for city/zone/area-level analytics and heat maps',
  columns: [
    { name: 'location_key', type: 'BIGSERIAL', nullable: false, primaryKey: true, description: 'Surrogate key' },
    { name: 'city', type: 'VARCHAR(100)', nullable: false, description: 'City name' },
    { name: 'state', type: 'VARCHAR(100)', nullable: false, description: 'State name' },
    { name: 'zone', type: 'VARCHAR(50)', nullable: true, description: 'Delivery zone' },
    { name: 'sector', type: 'VARCHAR(50)', nullable: true, description: 'Sector within zone' },
    { name: 'pincode', type: 'VARCHAR(10)', nullable: true, description: 'Pincode' },
    { name: 'latitude', type: 'DECIMAL(10,7)', nullable: true, description: 'Latitude for geo analysis' },
    { name: 'longitude', type: 'DECIMAL(10,7)', nullable: true, description: 'Longitude for geo analysis' },
    { name: 'region', type: 'VARCHAR(50)', nullable: true, description: 'Region: North/South/East/West/Central' },
    { name: 'metro_city', type: 'BOOLEAN', nullable: true, default: 'FALSE', description: 'Is metro city' },
    { name: 'tier', type: 'VARCHAR(20)', nullable: true, description: 'City tier: Tier1/Tier2/Tier3' },
    { name: 'population_density', type: 'VARCHAR(20)', nullable: true, description: 'Population density category' },
  ],
  indexes: [
    { name: 'idx_dim_location_city', columns: ['city'] },
    { name: 'idx_dim_location_zone', columns: ['zone'] },
    { name: 'idx_dim_location_pincode', columns: ['pincode'] },
    { name: 'idx_dim_location_region', columns: ['region'] },
  ],
};

export const dimPromotion: DWTable = {
  name: 'dim_promotion',
  schema: 'kartezy_bi',
  type: 'dimension',
  description: 'Promotion/campaign dimension for marketing analytics',
  columns: [
    { name: 'promotion_key', type: 'BIGSERIAL', nullable: false, primaryKey: true, description: 'Surrogate key' },
    { name: 'promotion_id', type: 'UUID', nullable: false, description: 'Source promotion ID' },
    { name: 'promotion_name', type: 'VARCHAR(255)', nullable: false, description: 'Promotion/campaign name' },
    { name: 'promotion_code', type: 'VARCHAR(50)', nullable: true, description: 'Promotion code' },
    { name: 'promotion_type', type: 'VARCHAR(50)', nullable: false, description: 'Type: PERCENTAGE/FIXED/FREE_SHIPPING/BUY_X_GET_Y' },
    { name: 'discount_value', type: 'DECIMAL(10,2)', nullable: true, description: 'Discount value' },
    { name: 'channel', type: 'VARCHAR(50)', nullable: true, description: 'Channel: EMAIL/SMS/PUSH/SOCIAL/SEARCH/DISPLAY' },
    { name: 'start_date', type: 'DATE', nullable: false, description: 'Promotion start date' },
    { name: 'end_date', type: 'DATE', nullable: true, description: 'Promotion end date' },
    { name: 'budget', type: 'DECIMAL(12,2)', nullable: true, description: 'Campaign budget' },
    { name: 'target_segment', type: 'VARCHAR(50)', nullable: true, description: 'Target customer segment' },
    { name: 'status', type: 'VARCHAR(20)', nullable: false, description: 'Status: ACTIVE/SCHEDULED/EXPIRED/PAUSED' },
  ],
  indexes: [
    { name: 'idx_dim_promotion_id', columns: ['promotion_id'], unique: true },
    { name: 'idx_dim_promotion_type', columns: ['promotion_type'] },
    { name: 'idx_dim_promotion_dates', columns: ['start_date', 'end_date'] },
  ],
};

// ====================
// FACT TABLES
// ====================

export const factOrders: DWTable = {
  name: 'fact_orders',
  schema: 'kartezy_bi',
  type: 'fact',
  description: 'Core order fact table - single source of truth for all order-related metrics',
  columns: [
    { name: 'order_key', type: 'BIGSERIAL', nullable: false, primaryKey: true, description: 'Surrogate key' },
    { name: 'order_id', type: 'UUID', nullable: false, description: 'Source order ID' },
    { name: 'order_number', type: 'VARCHAR(50)', nullable: false, description: 'Order number' },
    { name: 'date_key', type: 'INTEGER', nullable: false, foreignKey: { table: 'dim_date', column: 'date_key' }, description: 'Order date' },
    { name: 'time_key', type: 'INTEGER', nullable: true, foreignKey: { table: 'dim_time', column: 'time_key' }, description: 'Order time' },
    { name: 'customer_key', type: 'BIGINT', nullable: false, foreignKey: { table: 'dim_customer', column: 'customer_key' }, description: 'Customer' },
    { name: 'merchant_key', type: 'BIGINT', nullable: false, foreignKey: { table: 'dim_merchant', column: 'merchant_key' }, description: 'Merchant' },
    { name: 'product_key', type: 'BIGINT', nullable: true, foreignKey: { table: 'dim_product', column: 'product_key' }, description: 'Primary product' },
    { name: 'location_key', type: 'BIGINT', nullable: true, foreignKey: { table: 'dim_location', column: 'location_key' }, description: 'Delivery location' },
    { name: 'promotion_key', type: 'BIGINT', nullable: true, foreignKey: { table: 'dim_promotion', column: 'promotion_key' }, description: 'Applied promotion' },
    { name: 'order_status', type: 'VARCHAR(50)', nullable: false, description: 'Order status: PENDING/CONFIRMED/PREPARING/OUT_FOR_DELIVERY/DELIVERED/CANCELLED/RETURNED' },
    { name: 'payment_status', type: 'VARCHAR(50)', nullable: false, description: 'Payment status' },
    { name: 'payment_method', type: 'VARCHAR(50)', nullable: true, description: 'Payment method: UPI/CARD/COD/WALLET' },
    { name: 'item_count', type: 'INTEGER', nullable: false, description: 'Number of items in order' },
    { name: 'subtotal_amount', type: 'DECIMAL(10,2)', nullable: false, description: 'Subtotal amount' },
    { name: 'discount_amount', type: 'DECIMAL(10,2)', nullable: true, default: '0', description: 'Discount applied' },
    { name: 'delivery_fee', type: 'DECIMAL(10,2)', nullable: true, default: '0', description: 'Delivery fee' },
    { name: 'tax_amount', type: 'DECIMAL(10,2)', nullable: true, default: '0', description: 'Tax amount' },
    { name: 'total_amount', type: 'DECIMAL(10,2)', nullable: false, description: 'Total order amount' },
    { name: 'gmv_amount', type: 'DECIMAL(10,2)', nullable: false, description: 'Gross merchandise value' },
    { name: 'commission_amount', type: 'DECIMAL(10,2)', nullable: true, description: 'Platform commission' },
    { name: 'net_revenue', type: 'DECIMAL(10,2)', nullable: true, description: 'Net revenue after commission' },
    { name: 'order_created_at', type: 'TIMESTAMP', nullable: false, description: 'Order creation timestamp' },
    { name: 'order_delivered_at', type: 'TIMESTAMP', nullable: true, description: 'Delivery timestamp' },
    { name: 'delivery_time_minutes', type: 'INTEGER', nullable: true, description: 'Delivery time in minutes' },
    { name: 'is_first_order', type: 'BOOLEAN', nullable: true, default: 'FALSE', description: 'Is customer first order' },
    { name: 'is_refunded', type: 'BOOLEAN', nullable: true, default: 'FALSE', description: 'Is order refunded' },
    { name: 'refund_amount', type: 'DECIMAL(10,2)', nullable: true, description: 'Refund amount if applicable' },
    { name: 'is_returned', type: 'BOOLEAN', nullable: true, default: 'FALSE', description: 'Is order returned' },
    { name: 'etl_batch_id', type: 'VARCHAR(50)', nullable: true, description: 'ETL batch identifier' },
    { name: 'etl_loaded_at', type: 'TIMESTAMP', nullable: false, default: 'NOW()', description: 'ETL load timestamp' },
  ],
  partitions: ['date_key'],
  indexes: [
    { name: 'idx_fact_orders_id', columns: ['order_id'], unique: true },
    { name: 'idx_fact_orders_customer', columns: ['customer_key'] },
    { name: 'idx_fact_orders_merchant', columns: ['merchant_key'] },
    { name: 'idx_fact_orders_status', columns: ['order_status'] },
    { name: 'idx_fact_orders_date', columns: ['date_key'] },
    { name: 'idx_fact_orders_created', columns: ['order_created_at'] },
  ],
  rowEstimate: 50000000,
};

export const factOrderItems: DWTable = {
  name: 'fact_order_items',
  schema: 'kartezy_bi',
  type: 'fact',
  description: 'Order line items fact table for detailed product-level analysis',
  columns: [
    { name: 'order_item_key', type: 'BIGSERIAL', nullable: false, primaryKey: true, description: 'Surrogate key' },
    { name: 'order_key', type: 'BIGINT', nullable: false, foreignKey: { table: 'fact_orders', column: 'order_key' }, description: 'Parent order' },
    { name: 'product_key', type: 'BIGINT', nullable: false, foreignKey: { table: 'dim_product', column: 'product_key' }, description: 'Product' },
    { name: 'date_key', type: 'INTEGER', nullable: false, foreignKey: { table: 'dim_date', column: 'date_key' }, description: 'Order date' },
    { name: 'quantity', type: 'INTEGER', nullable: false, description: 'Quantity ordered' },
    { name: 'unit_price', type: 'DECIMAL(10,2)', nullable: false, description: 'Unit price at time of order' },
    { name: 'total_price', type: 'DECIMAL(10,2)', nullable: false, description: 'Line total' },
    { name: 'discount_amount', type: 'DECIMAL(10,2)', nullable: true, default: '0', description: 'Line discount' },
    { name: 'margin_amount', type: 'DECIMAL(10,2)', nullable: true, description: 'Margin on line item' },
    { name: 'margin_percentage', type: 'DECIMAL(5,2)', nullable: true, description: 'Margin percentage' },
    { name: 'gst_amount', type: 'DECIMAL(10,2)', nullable: true, description: 'GST on line item' },
    { name: 'etl_loaded_at', type: 'TIMESTAMP', nullable: false, default: 'NOW()', description: 'ETL load timestamp' },
  ],
  indexes: [
    { name: 'idx_fact_oi_order', columns: ['order_key'] },
    { name: 'idx_fact_oi_product', columns: ['product_key'] },
    { name: 'idx_fact_oi_date', columns: ['date_key'] },
  ],
  rowEstimate: 150000000,
};

export const factPayments: DWTable = {
  name: 'fact_payments',
  schema: 'kartezy_bi',
  type: 'fact',
  description: 'Payment transactions fact table for financial analytics',
  columns: [
    { name: 'payment_key', type: 'BIGSERIAL', nullable: false, primaryKey: true, description: 'Surrogate key' },
    { name: 'payment_id', type: 'UUID', nullable: false, description: 'Source payment ID' },
    { name: 'order_key', type: 'BIGINT', nullable: true, foreignKey: { table: 'fact_orders', column: 'order_key' }, description: 'Related order' },
    { name: 'customer_key', type: 'BIGINT', nullable: false, foreignKey: { table: 'dim_customer', column: 'customer_key' }, description: 'Customer' },
    { name: 'merchant_key', type: 'BIGINT', nullable: true, foreignKey: { table: 'dim_merchant', column: 'merchant_key' }, description: 'Merchant' },
    { name: 'date_key', type: 'INTEGER', nullable: false, foreignKey: { table: 'dim_date', column: 'date_key' }, description: 'Payment date' },
    { name: 'payment_type', type: 'VARCHAR(50)', nullable: false, description: 'Type: CHARGE/REFUND/PAYOUT/COMMISSION/WALLET' },
    { name: 'payment_method', type: 'VARCHAR(50)', nullable: true, description: 'Method: UPI/CARD/COD/WALLET/BANK_TRANSFER' },
    { name: 'amount', type: 'DECIMAL(12,2)', nullable: false, description: 'Transaction amount' },
    { name: 'fee_amount', type: 'DECIMAL(10,2)', nullable: true, default: '0', description: 'Processing fee' },
    { name: 'net_amount', type: 'DECIMAL(12,2)', nullable: true, description: 'Net amount after fees' },
    { name: 'payment_status', type: 'VARCHAR(50)', nullable: false, description: 'Status: PENDING/SUCCESS/FAILED/REFUNDED' },
    { name: 'razorpay_payment_id', type: 'VARCHAR(100)', nullable: true, description: 'Razorpay payment ID' },
    { name: 'etl_loaded_at', type: 'TIMESTAMP', nullable: false, default: 'NOW()', description: 'ETL load timestamp' },
  ],
  indexes: [
    { name: 'idx_fact_payments_id', columns: ['payment_id'], unique: true },
    { name: 'idx_fact_payments_order', columns: ['order_key'] },
    { name: 'idx_fact_payments_type', columns: ['payment_type'] },
    { name: 'idx_fact_payments_date', columns: ['date_key'] },
    { name: 'idx_fact_payments_status', columns: ['payment_status'] },
  ],
  rowEstimate: 80000000,
};

export const factDeliveries: DWTable = {
  name: 'fact_deliveries',
  schema: 'kartezy_bi',
  type: 'fact',
  description: 'Delivery fact table for logistics and fleet analytics',
  columns: [
    { name: 'delivery_key', type: 'BIGSERIAL', nullable: false, primaryKey: true, description: 'Surrogate key' },
    { name: 'delivery_id', type: 'UUID', nullable: false, description: 'Source delivery ID' },
    { name: 'order_key', type: 'BIGINT', nullable: false, foreignKey: { table: 'fact_orders', column: 'order_key' }, description: 'Related order' },
    { name: 'partner_key', type: 'BIGINT', nullable: false, foreignKey: { table: 'dim_delivery_partner', column: 'partner_key' }, description: 'Delivery partner' },
    { name: 'date_key', type: 'INTEGER', nullable: false, foreignKey: { table: 'dim_date', column: 'date_key' }, description: 'Delivery date' },
    { name: 'origin_location_key', type: 'BIGINT', nullable: true, foreignKey: { table: 'dim_location', column: 'location_key' }, description: 'Pickup location' },
    { name: 'destination_location_key', type: 'BIGINT', nullable: true, foreignKey: { table: 'dim_location', column: 'location_key' }, description: 'Drop location' },
    { name: 'assigned_at', type: 'TIMESTAMP', nullable: true, description: 'Driver assigned' },
    { name: 'picked_up_at', type: 'TIMESTAMP', nullable: true, description: 'Order picked up from merchant' },
    { name: 'delivered_at', type: 'TIMESTAMP', nullable: true, description: 'Delivered to customer' },
    { name: 'pickup_time_minutes', type: 'INTEGER', nullable: true, description: 'Time from assignment to pickup' },
    { name: 'transit_time_minutes', type: 'INTEGER', nullable: true, description: 'Time from pickup to delivery' },
    { name: 'total_delivery_time_minutes', type: 'INTEGER', nullable: true, description: 'Total delivery time' },
    { name: 'distance_km', type: 'DECIMAL(8,2)', nullable: true, description: 'Delivery distance in km' },
    { name: 'delivery_status', type: 'VARCHAR(50)', nullable: false, description: 'Status: ASSIGNED/PICKED_UP/IN_TRANSIT/DELIVERED/FAILED' },
    { name: 'customer_rating', type: 'INTEGER', nullable: true, description: 'Customer rating (1-5)' },
    { name: 'delivery_fee', type: 'DECIMAL(10,2)', nullable: true, description: 'Delivery fee for this trip' },
    { name: 'driver_earnings', type: 'DECIMAL(10,2)', nullable: true, description: 'Driver earnings' },
    { name: 'etl_loaded_at', type: 'TIMESTAMP', nullable: false, default: 'NOW()', description: 'ETL load timestamp' },
  ],
  indexes: [
    { name: 'idx_fact_delivery_id', columns: ['delivery_id'], unique: true },
    { name: 'idx_fact_delivery_order', columns: ['order_key'] },
    { name: 'idx_fact_delivery_partner', columns: ['partner_key'] },
    { name: 'idx_fact_delivery_date', columns: ['date_key'] },
    { name: 'idx_fact_delivery_status', columns: ['delivery_status'] },
  ],
  rowEstimate: 50000000,
};

export const factInventory: DWTable = {
  name: 'fact_inventory',
  schema: 'kartezy_bi',
  type: 'fact',
  description: 'Inventory snapshot fact table for inventory analytics (daily snapshots)',
  columns: [
    { name: 'inventory_key', type: 'BIGSERIAL', nullable: false, primaryKey: true, description: 'Surrogate key' },
    { name: 'product_key', type: 'BIGINT', nullable: false, foreignKey: { table: 'dim_product', column: 'product_key' }, description: 'Product' },
    { name: 'merchant_key', type: 'BIGINT', nullable: false, foreignKey: { table: 'dim_merchant', column: 'merchant_key' }, description: 'Merchant/store' },
    { name: 'date_key', type: 'INTEGER', nullable: false, foreignKey: { table: 'dim_date', column: 'date_key' }, description: 'Snapshot date' },
    { name: 'opening_stock', type: 'INTEGER', nullable: false, description: 'Stock at start of day' },
    { name: 'closing_stock', type: 'INTEGER', nullable: false, description: 'Stock at end of day' },
    { name: 'quantity_received', type: 'INTEGER', nullable: true, default: '0', description: 'Stock received during day' },
    { name: 'quantity_sold', type: 'INTEGER', nullable: true, default: '0', description: 'Stock sold during day' },
    { name: 'quantity_damaged', type: 'INTEGER', nullable: true, default: '0', description: 'Stock damaged during day' },
    { name: 'quantity_expired', type: 'INTEGER', nullable: true, default: '0', description: 'Stock expired during day' },
    { name: 'quantity_returned', type: 'INTEGER', nullable: true, default: '0', description: 'Stock returned during day' },
    { name: 'reorder_point', type: 'INTEGER', nullable: true, description: 'Reorder level' },
    { name: 'days_until_stockout', type: 'INTEGER', nullable: true, description: 'Days until stockout at current rate' },
    { name: 'stock_value', type: 'DECIMAL(12,2)', nullable: true, description: 'Value of closing stock' },
    { name: 'etl_loaded_at', type: 'TIMESTAMP', nullable: false, default: 'NOW()', description: 'ETL load timestamp' },
  ],
  indexes: [
    { name: 'idx_fact_inv_product', columns: ['product_key'] },
    { name: 'idx_fact_inv_merchant', columns: ['merchant_key'] },
    { name: 'idx_fact_inv_date', columns: ['date_key'] },
    { name: 'idx_fact_inv_lookup', columns: ['product_key', 'merchant_key', 'date_key'], unique: true },
  ],
  rowEstimate: 100000000,
};

export const factCustomerActivity: DWTable = {
  name: 'fact_customer_activity',
  schema: 'kartezy_bi',
  type: 'fact',
  description: 'Customer activity/event fact table for behavioral analytics',
  columns: [
    { name: 'activity_key', type: 'BIGSERIAL', nullable: false, primaryKey: true, description: 'Surrogate key' },
    { name: 'customer_key', type: 'BIGINT', nullable: false, foreignKey: { table: 'dim_customer', column: 'customer_key' }, description: 'Customer' },
    { name: 'date_key', type: 'INTEGER', nullable: false, foreignKey: { table: 'dim_date', column: 'date_key' }, description: 'Activity date' },
    { name: 'time_key', type: 'INTEGER', nullable: true, foreignKey: { table: 'dim_time', column: 'time_key' }, description: 'Activity time' },
    { name: 'activity_type', type: 'VARCHAR(50)', nullable: false, description: 'APP_OPEN/SEARCH/VIEW_CATEGORY/VIEW_PRODUCT/ADD_TO_CART/REMOVE_FROM_CART/CHECKOUT_START/PAYMENT_INIT/ORDER_PLACED/ORDER_CANCELLED/LOGIN/LOGOUT/SHARE/REFERRAL' },
    { name: 'activity_source', type: 'VARCHAR(50)', nullable: true, description: 'Source: APP/WEB/REFERRAL' },
    { name: 'product_key', type: 'BIGINT', nullable: true, foreignKey: { table: 'dim_product', column: 'product_key' }, description: 'Related product if applicable' },
    { name: 'session_id', type: 'VARCHAR(100)', nullable: true, description: 'Session identifier' },
    { name: 'duration_seconds', type: 'INTEGER', nullable: true, description: 'Duration if applicable' },
    { name: 'metadata_json', type: 'JSONB', nullable: true, description: 'Additional activity metadata' },
    { name: 'etl_loaded_at', type: 'TIMESTAMP', nullable: false, default: 'NOW()', description: 'ETL load timestamp' },
  ],
  indexes: [
    { name: 'idx_fact_ca_customer', columns: ['customer_key'] },
    { name: 'idx_fact_ca_type', columns: ['activity_type'] },
    { name: 'idx_fact_ca_date', columns: ['date_key'] },
    { name: 'idx_fact_ca_session', columns: ['session_id'] },
  ],
  rowEstimate: 500000000,
};

export const factMarketing: DWTable = {
  name: 'fact_marketing',
  schema: 'kartezy_bi',
  type: 'fact',
  description: 'Marketing campaign performance fact table',
  columns: [
    { name: 'marketing_key', type: 'BIGSERIAL', nullable: false, primaryKey: true, description: 'Surrogate key' },
    { name: 'promotion_key', type: 'BIGINT', nullable: true, foreignKey: { table: 'dim_promotion', column: 'promotion_key' }, description: 'Promotion/campaign' },
    { name: 'date_key', type: 'INTEGER', nullable: false, foreignKey: { table: 'dim_date', column: 'date_key' }, description: 'Date' },
    { name: 'channel', type: 'VARCHAR(50)', nullable: false, description: 'Channel: EMAIL/SMS/PUSH/SOCIAL/SEARCH/DISPLAY' },
    { name: 'impressions', type: 'BIGINT', nullable: true, default: '0', description: 'Number of impressions' },
    { name: 'clicks', type: 'BIGINT', nullable: true, default: '0', description: 'Number of clicks' },
    { name: 'conversions', type: 'BIGINT', nullable: true, default: '0', description: 'Number of conversions' },
    { name: 'click_through_rate', type: 'DECIMAL(5,4)', nullable: true, description: 'CTR = clicks/impressions' },
    { name: 'conversion_rate', type: 'DECIMAL(5,4)', nullable: true, description: 'CVR = conversions/clicks' },
    { name: 'spend', type: 'DECIMAL(12,2)', nullable: true, default: '0', description: 'Amount spent' },
    { name: 'revenue_attributed', type: 'DECIMAL(12,2)', nullable: true, description: 'Revenue attributed to campaign' },
    { name: 'roas', type: 'DECIMAL(5,2)', nullable: true, description: 'Return on ad spend' },
    { name: 'cost_per_click', type: 'DECIMAL(8,2)', nullable: true, description: 'Cost per click' },
    { name: 'cost_per_acquisition', type: 'DECIMAL(8,2)', nullable: true, description: 'Cost per acquisition' },
    { name: 'etl_loaded_at', type: 'TIMESTAMP', nullable: false, default: 'NOW()', description: 'ETL load timestamp' },
  ],
  indexes: [
    { name: 'idx_fact_mktg_promotion', columns: ['promotion_key'] },
    { name: 'idx_fact_mktg_date', columns: ['date_key'] },
    { name: 'idx_fact_mktg_channel', columns: ['channel'] },
  ],
  rowEstimate: 10000000,
};

// ====================
// ALL TABLES EXPORT
// ====================

export const allDWTables: DWTable[] = [
  dimDate, dimTime, dimCustomer, dimMerchant, dimProduct,
  dimDeliveryPartner, dimLocation, dimPromotion,
  factOrders, factOrderItems, factPayments, factDeliveries,
  factInventory, factCustomerActivity, factMarketing,
];

export function getTableByName(name: string): DWTable | undefined {
  return allDWTables.find(t => t.name === name);
}

export function getFactTables(): DWTable[] {
  return allDWTables.filter(t => t.type === 'fact');
}

export function getDimensionTables(): DWTable[] {
  return allDWTables.filter(t => t.type === 'dimension');
}

/** Generate SQL CREATE TABLE statement for a DW table */
export function generateCreateTableSQL(table: DWTable): string {
  const cols = table.columns.map(col => {
    let def = `  ${col.name} ${col.type}`;
    if (!col.nullable) def += ' NOT NULL';
    if (col.default) def += ` DEFAULT ${col.default}`;
    if (col.primaryKey) def += ' PRIMARY KEY';
    if (col.foreignKey) def += ` REFERENCES ${col.foreignKey.table}(${col.foreignKey.column})`;
    return def;
  });

  let sql = `CREATE TABLE IF NOT EXISTS ${table.schema}.${table.name} (\n${cols.join(',\n')}\n);\n\n`;

  // Indexes
  for (const idx of table.indexes || []) {
    const unique = idx.unique ? 'UNIQUE ' : '';
    const method = idx.method ? ` USING ${idx.method}` : '';
    sql += `CREATE ${unique}INDEX IF NOT EXISTS ${idx.name} ON ${table.schema}.${table.name}${method} (${idx.columns.join(', ')});\n`;
  }

  // Partitions
  if (table.partitions) {
    sql += `\n-- Table should be partitioned by: ${table.partitions.join(', ')}\n`;
    sql += `-- ALTER TABLE ${table.schema}.${table.name} ADD PRIMARY KEY (${table.columns.filter(c => c.primaryKey).map(c => c.name).join(', ')});\n`;
  }

  return sql;
}

/** Generate complete warehouse DDL */
export function generateWarehouseDDL(): string {
  let ddl = `-- ============================================================\n`;
  ddl += `-- Kartezy Enterprise BI Platform - Data Warehouse Schema DDL\n`;
  ddl += `-- Generated for PostgreSQL 15+\n`;
  ddl += `-- ============================================================\n\n`;

  ddl += `CREATE SCHEMA IF NOT EXISTS kartezy_bi;\n\n`;

  for (const table of allDWTables) {
    ddl += `-- ${table.description}\n`;
    ddl += generateCreateTableSQL(table);
    ddl += '\n';
  }

  ddl += `-- ============================================================\n`;
  ddl += `-- END OF DATA WAREHOUSE SCHEMA\n`;
  ddl += `-- ============================================================\n`;

  return ddl;
}
