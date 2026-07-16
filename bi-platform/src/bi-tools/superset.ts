/**
 * Kartezy Enterprise BI Platform - Apache Superset Integration
 *
 * Superset configuration with pre-defined chart templates,
 * dashboard imports, and SQL Lab queries.
 */

export interface SupersetDashboard {
  id: string;
  dashboard_title: string;
  description: string;
  slug: string;
  published: boolean;
  position_json: string;
  css: string;
}

export interface SupersetChart {
  id: string;
  slice_name: string;
  viz_type: string;
  datasource_id: number;
  datasource_type: 'table' | 'query';
  params: Record<string, unknown>;
  query_context: Record<string, unknown>;
}

export const SUPERSET_DATABASES = [
  {
    database_name: 'Kartezy BI Warehouse',
    sqlalchemy_uri: 'postgresql://kartezy:${POSTGRES_PASSWORD}@postgres:5432/kartezy_bi',
    expose_in_sql_lab: true,
    allow_dml: false,
    allow_multi_schema_metadata_fetch: true,
    extra: JSON.stringify({
      metadata_params: {},
      engine_params: { connect_args: { connect_timeout: 10 } },
      schemas_allowed_for_file_upload: ['kartezy_bi'],
    }),
  },
];

export const SUPERSET_PREBUILT_CHARTS: SupersetChart[] = [
  {
    id: 'rev_trend', slice_name: 'Revenue Trend', viz_type: 'line',
    datasource_id: 1, datasource_type: 'table',
    params: {
      granularity_sqla: 'date_key', time_grain_sqla: 'P1M',
      metrics: [{ aggregate: 'SUM', column: 'total_amount' }],
      groupby: ['dim_date__year_month'],
      row_limit: 10000,
    },
    query_context: { datasource: { id: 1, type: 'table' } },
  },
  {
    id: 'orders_by_status', slice_name: 'Orders by Status', viz_type: 'pie',
    datasource_id: 1, datasource_type: 'table',
    params: {
      metrics: [{ aggregate: 'COUNT', column: 'order_id' }],
      groupby: ['order_status'],
      pie_label_type: 'percent',
    },
    query_context: { datasource: { id: 1, type: 'table' } },
  },
  {
    id: 'city_revenue', slice_name: 'Revenue by City', viz_type: 'bar',
    datasource_id: 1, datasource_type: 'table',
    params: {
      metrics: [{ aggregate: 'SUM', column: 'total_amount' }],
      groupby: ['dim_location__city'],
      order_desc: true,
      row_limit: 20,
    },
    query_context: { datasource: { id: 1, type: 'table' } },
  },
  {
    id: 'delivery_heatmap', slice_name: 'Delivery Heat Map', viz_type: 'heatmap',
    datasource_id: 2, datasource_type: 'table',
    params: {
      all_columns_x: 'dim_location__city',
      all_columns_y: 'dim_date__month_name',
      metrics: [{ aggregate: 'COUNT', column: 'delivery_id' }],
      normalized: true,
    },
    query_context: { datasource: { id: 2, type: 'table' } },
  },
];

export const SUPERSET_DASHBOARDS: SupersetDashboard[] = [
  {
    id: 'kartezy_exec', dashboard_title: 'Kartezy Executive Dashboard',
    description: 'Enterprise executive dashboard with real-time KPIs and growth metrics',
    slug: 'kartezy-executive', published: true,
    position_json: JSON.stringify({}), css: '',
  },
  {
    id: 'kartezy_ops', dashboard_title: 'Kartezy Operations Dashboard',
    description: 'Operations and delivery performance monitoring',
    slug: 'kartezy-operations', published: true,
    position_json: JSON.stringify({}), css: '',
  },
  {
    id: 'kartezy_finance', dashboard_title: 'Kartezy Financial Dashboard',
    description: 'Revenue, costs, commissions, and profitability analysis',
    slug: 'kartezy-finance', published: true,
    position_json: JSON.stringify({}), css: '',
  },
];

export function getSupersetImportGuide(): string {
  return `# Apache Superset Import Guide for Kartezy BI

## Prerequisites
- Apache Superset 3.0+ installed
- Access to Superset Admin panel

## Step 1: Add Database Connection
1. Navigate to Data > Databases > + Database
2. Paste the SQLAlchemy URI:
   postgresql://kartezy:PASSWORD@postgres:5432/kartezy_bi
3. Check "Expose in SQL Lab"
4. Allow schema: kartezy_bi
5. Save

## Step 2: Import Dataset
1. Navigate to Data > Datasets
2. Click "+ Dataset"
3. Select "Kartezy BI Warehouse" database
4. Schema: kartezy_bi
5. Add all fact_* and dim_* tables
6. Click "Add"

## Step 3: Import Charts
1. Navigate to Charts > Import Dashboard
2. Upload the kartezy_bi_charts.json export
3. All pre-built charts will be available

## Step 4: Create Dashboards
Create these dashboards by adding charts:

### Executive Dashboard
- Revenue Trend (Line Chart)
- Orders by Status (Pie Chart)
- Top Cities by Revenue (Bar Chart)
- Customer Growth (Line Chart)
- Key Metrics (Scorecard x4)

### Operations Dashboard
- Delivery Performance (Line Chart)
- Delivery Times by Zone (Bar Chart)
- Driver Performance (Table)
- Order Fulfillment Funnel (Funnel Chart)
- Inventory Alerts (Table)

### Financial Dashboard
- Revenue by Source (Bar Chart)
- P&L Summary (Table)
- Commission Analysis (Bar Chart)
- Refund Analysis (Time Series)
- Revenue Forecast (Line with Confidence Band)

## Pre-built SQL Queries for SQL Lab

### Daily Revenue
\`\`\`sql
SELECT d.full_date, SUM(f.total_amount) as revenue, COUNT(*) as orders
FROM kartezy_bi.fact_orders f
JOIN kartezy_bi.dim_date d ON f.date_key = d.date_key
WHERE d.full_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY d.full_date
ORDER BY d.full_date;
\`\`\`

### Top Products
\`\`\`sql
SELECT p.product_name, p.category_name, 
       SUM(f.quantity) as units_sold, SUM(f.total_price) as revenue
FROM kartezy_bi.fact_order_items f
JOIN kartezy_bi.dim_product p ON f.product_key = p.product_key
WHERE p.is_current = true
GROUP BY p.product_name, p.category_name
ORDER BY revenue DESC
LIMIT 20;
\`\`\`

### Customer Cohorts
\`\`\`sql
-- See the cohort analysis query in the metabase module
-- Compatible with PostgreSQL
\`\`\`
`;
}
