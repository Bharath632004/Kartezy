/**
 * Kartezy Enterprise BI Platform - Metabase Integration
 *
 * Metabase auto-discovery configuration with pre-built questions,
 * dashboards, and data model documentation.
 */

export interface MetabaseCard {
  name: string;
  description: string;
  display: 'table' | 'bar' | 'line' | 'pie' | 'scalar' | 'map' | 'funnel' | 'waterfall';
  dataset_query: {
    database: number;
    type: 'query' | 'native';
    query: Record<string, unknown>;
  };
  visualization_settings: Record<string, unknown>;
  collection_id?: number;
}

export const METABASE_DASHBOARDS = [
  {
    id: 1,
    name: 'Kartezy Executive Overview',
    description: 'Real-time executive dashboard with key business metrics',
    cards: [
      { name: 'Revenue Trend', display: 'line', collection: 'Kartezy BI' },
      { name: 'Orders by Status', display: 'pie', collection: 'Kartezy BI' },
      { name: 'Top Merchants', display: 'bar', collection: 'Kartezy BI' },
      { name: 'Customer Growth', display: 'line', collection: 'Kartezy BI' },
    ],
  },
  {
    id: 2,
    name: 'Operational KPIs',
    description: 'Track delivery performance, fleet metrics, and service levels',
    cards: [
      { name: 'Delivery Success Rate', display: 'scalar', collection: 'Kartezy BI' },
      { name: 'Avg Delivery Time by Zone', display: 'bar', collection: 'Kartezy BI' },
      { name: 'Driver Performance', display: 'table', collection: 'Kartezy BI' },
      { name: 'Order Fulfillment Funnel', display: 'funnel', collection: 'Kartezy BI' },
    ],
  },
  {
    id: 3,
    name: 'Financial Reports',
    description: 'Financial performance, revenue breakdown, and forecasting',
    cards: [
      { name: 'Revenue by Source', display: 'pie', collection: 'Kartezy BI' },
      { name: 'P&L Summary', display: 'table', collection: 'Kartezy BI' },
      { name: 'Commission Analysis', display: 'bar', collection: 'Kartezy BI' },
      { name: 'Revenue Forecast', display: 'line', collection: 'Kartezy BI' },
    ],
  },
];

export function getMetabaseSetupGuide(): string {
  return `# Metabase Setup Guide for Kartezy BI

## Step 1: Add Database Connection
1. Go to Admin Settings > Databases > Add Database
2. Database type: PostgreSQL
3. Display name: Kartezy BI
4. Host: postgres (or your PostgreSQL host)
5. Port: 5432
6. Database name: kartezy_bi
7. Database username: kartezy
8. Database password: [your password]
9. Click "Save"

## Step 2: Auto-Sync Schemas
Metabase will automatically discover all tables in the kartezy_bi schema:
- fact_orders, fact_order_items, fact_payments
- fact_deliveries, fact_inventory
- fact_customer_activity, fact_marketing
- dim_date, dim_customer, dim_merchant, dim_product
- dim_delivery_partner, dim_location, dim_promotion

## Step 3: Create Questions
The following questions are pre-defined for quick reporting:

### Revenue Analysis
- Total Revenue by Month (Line Chart)
- Revenue by City (Bar Chart)
- Revenue by Merchant (Bar Chart)
- Average Order Value Trend (Line Chart)

### Customer Analytics  
- Customer Growth by Month (Line Chart)
- Customer by Segment (Pie Chart)
- Top Customers by Revenue (Table)
- Customer Retention Cohort (Custom)

### Delivery Analytics
- Delivery Success Rate (Scalar)
- Average Delivery Time by Zone (Bar Chart)
- Driver Performance Ranking (Table)
- On-Time Delivery Trend (Line Chart)

### Inventory Analytics
- Stock Status Distribution (Pie Chart)
- Low Stock Alerts (Table)
- Inventory Turnover by Category (Bar Chart)
- Days Until Stockout (Scalar)

## Step 4: Create Dashboards
Create dashboards using the questions above:
1. Executive Dashboard - High-level KPIs
2. Operations Dashboard - Delivery and fleet metrics
3. Financial Dashboard - Revenue and profitability
4. Customer Dashboard - Customer insights
5. Merchant Dashboard - Merchant performance

## Step 5: Set Up Subscriptions
Schedule email/Slack subscriptions for automated report delivery:
1. Operations team: Daily delivery performance summary
2. Finance team: Weekly revenue and payout report
3. Executive team: Monthly business review
4. Merchant team: Weekly merchant performance report

## Auto-Discovery SQL Queries

### Revenue YTD
\`\`\`sql
SELECT d.year, d.month_name, 
       SUM(f.total_amount) as revenue,
       COUNT(DISTINCT f.order_id) as orders
FROM kartezy_bi.fact_orders f
JOIN kartezy_bi.dim_date d ON f.date_key = d.date_key
WHERE d.year = EXTRACT(YEAR FROM CURRENT_DATE)
GROUP BY d.year, d.month_name
ORDER BY d.year, d.month;
\`\`\`

### Delivery Performance by Zone
\`\`\`sql
SELECT l.zone, l.city,
       COUNT(*) as deliveries,
       AVG(f.total_delivery_time_minutes) as avg_time,
       AVG(f.customer_rating) as avg_rating
FROM kartezy_bi.fact_deliveries f
JOIN kartezy_bi.dim_location l ON f.destination_location_key = l.location_key
WHERE f.date_key >= TO_CHAR(CURRENT_DATE - INTERVAL '30 days', 'YYYYMMDD')::int
GROUP BY l.zone, l.city
ORDER BY deliveries DESC;
\`\`\`

### Customer Retention Cohort
\`\`\`sql
SELECT 
  TO_CHAR(first_order.first_order_date, 'YYYY-MM') as cohort,
  periods.month_offset,
  COUNT(DISTINCT orders.customer_key) as customers
FROM (
  SELECT customer_key, MIN(order_created_at::date) as first_order_date
  FROM kartezy_bi.fact_orders
  GROUP BY customer_key
) first_order
CROSS JOIN generate_series(0, 6) periods(month_offset)
LEFT JOIN kartezy_bi.fact_orders orders 
  ON orders.customer_key = first_order.customer_key
  AND orders.order_created_at::date >= first_order.first_order_date + (periods.month_offset || ' months')::interval
  AND orders.order_created_at::date < first_order.first_order_date + ((periods.month_offset + 1) || ' months')::interval
GROUP BY cohort, periods.month_offset
ORDER BY cohort, periods.month_offset;
\`\`\`
`;
}

export const METABASE_COLLECTIONS = [
  { name: 'Kartezy BI', description: 'Main collection for all Kartezy business intelligence dashboards and questions', color: '#509EE3' },
  { name: 'Executive Reports', description: 'C-suite and board-level reports', color: '#FFB800' },
  { name: 'Operations', description: 'Daily operations and delivery metrics', color: '#00A5C8' },
  { name: 'Finance', description: 'Financial reporting and analysis', color: '#4CAF50' },
];
