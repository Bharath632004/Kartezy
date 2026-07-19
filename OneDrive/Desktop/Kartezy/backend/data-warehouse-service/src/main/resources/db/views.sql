-- Kartezy BI Platform - Database Views for Power BI, Looker, Metabase, Apache Superset

CREATE OR REPLACE VIEW bi_revenue AS
SELECT d.order_date, d.merchant_name, d.merchant_category, d.city_name,
    d.total_orders, d.completed_orders, d.cancelled_orders, d.total_revenue,
    d.total_gmv, d.average_order_value, d.platform_commission, d.delivery_fee,
    d.discount_amount, d.unique_customers, d.new_customers
FROM dw_daily_orders_fact d;

CREATE OR REPLACE VIEW bi_customers AS
SELECT d.activity_date, d.city_name, d.total_customers, d.new_registrations,
    d.active_customers, d.total_orders, d.repeat_customers, d.churned_customers,
    d.returning_customers, d.total_spend, d.average_order_value
FROM dw_daily_customer_fact d;

CREATE OR REPLACE VIEW bi_merchants AS
SELECT d.activity_date, d.merchant_name, d.merchant_category, d.city_name,
    d.total_orders, d.completed_orders, d.cancelled_orders, d.total_revenue,
    d.total_commission, d.average_rating, d.total_products, d.active_products,
    d.low_stock_products, d.acceptance_rate, d.fulfilment_rate, d.average_preparation_time
FROM dw_daily_merchant_fact d;

CREATE OR REPLACE VIEW bi_delivery AS
SELECT d.activity_date, d.delivery_partner_name, d.city_name, d.total_deliveries,
    d.completed_deliveries, d.failed_deliveries, d.total_earnings, d.average_delivery_time,
    d.average_distance, d.acceptance_rate, d.average_rating, d.on_time_deliveries,
    d.late_deliveries, d.on_time_rate
FROM dw_daily_delivery_fact d;

CREATE OR REPLACE VIEW bi_products AS
SELECT d.activity_date, d.product_name, d.category_name, d.merchant_name,
    d.units_sold, d.units_returned, d.revenue, d.unit_price, d.total_views,
    d.total_adds_to_cart, d.total_wishlists, d.conversion_rate, d.stock_quantity,
    d.average_rating, d.total_reviews, d.discount_percentage
FROM dw_daily_product_fact d;

CREATE OR REPLACE VIEW bi_cohort_retention AS
SELECT c.cohort_date, c.cohort_type, c.cohort_size,
    c.period0 AS retention_p0, c.period1 AS retention_p1, c.period2 AS retention_p2,
    c.period3 AS retention_p3, c.period4 AS retention_p4, c.period5 AS retention_p5,
    c.period6 AS retention_p6, c.period7 AS retention_p7, c.period8 AS retention_p8,
    c.period9 AS retention_p9, c.period10 AS retention_p10, c.period11 AS retention_p11,
    c.period12 AS retention_p12
FROM dw_customer_cohorts c;

CREATE OR REPLACE VIEW bi_executive_summary AS
SELECT DATE_TRUNC('month', order_date) AS month,
    COUNT(DISTINCT merchant_id) AS active_merchants,
    COUNT(DISTINCT city_name) AS active_cities,
    SUM(total_orders) AS total_orders, SUM(completed_orders) AS completed_orders,
    SUM(total_revenue) AS total_revenue, SUM(total_gmv) AS total_gmv,
    SUM(platform_commission) AS total_commission, SUM(delivery_fee) AS total_delivery_fees,
    SUM(discount_amount) AS total_discounts, SUM(unique_customers) AS unique_customers,
    SUM(new_customers) AS new_customers,
    CASE WHEN SUM(total_orders) > 0 THEN SUM(total_revenue) / SUM(total_orders) ELSE 0 END AS avg_order_value
FROM dw_daily_orders_fact
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY month DESC;
