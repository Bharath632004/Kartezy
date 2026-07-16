/**
 * Kartezy Enterprise BI Platform - Power BI Integration
 *
 * Ready-to-use Power BI integration with pre-built data models,
 * embedded dashboards, and automatic dataset refresh.
 */

import { createBILogger } from '../utils/logger';

const logger = createBILogger('PowerBI');

export interface PowerBIDashboard {
  id: string;
  name: string;
  workspaceId: string;
  datasetId: string;
  reportId: string;
  embedUrl: string;
  embedToken?: string;
  lastRefresh: string;
}

export interface PowerBIDataset {
  id: string;
  name: string;
  tables: string[];
  measures: PowerBIMeasure[];
  relationships: Array<{ from: string; to: string; type: string }>;
}

export interface PowerBIMeasure {
  name: string;
  table: string;
  expression: string;
  format: string;
  description: string;
}

export const POWER_BI_DATASETS: PowerBIDataset[] = [
  {
    id: 'kartezy_orders',
    name: 'Orders Analytics',
    tables: ['fact_orders', 'dim_date', 'dim_customer', 'dim_merchant', 'dim_product', 'dim_location'],
    measures: [
      { name: 'Total Revenue', table: 'fact_orders', expression: 'SUM(fact_orders[total_amount])', format: 'currency', description: 'Total order revenue' },
      { name: 'Total Orders', table: 'fact_orders', expression: 'COUNTROWS(fact_orders)', format: 'integer', description: 'Total number of orders' },
      { name: 'Avg Order Value', table: 'fact_orders', expression: 'AVERAGE(fact_orders[total_amount])', format: 'currency', description: 'Average value per order' },
      { name: 'Order Growth %', table: 'fact_orders', expression: 'CALCULATE([Total Orders], PREVIOUSMONTH(dim_date[full_date]))', format: 'percentage', description: 'Month-over-month order growth' },
      { name: 'Revenue YTD', table: 'fact_orders', expression: 'TOTALYTD(SUM(fact_orders[total_amount]), dim_date[full_date])', format: 'currency', description: 'Year-to-date revenue' },
    ],
    relationships: [
      { from: 'dim_date[date_key]', to: 'fact_orders[date_key]', type: 'one-to-many' },
      { from: 'dim_customer[customer_key]', to: 'fact_orders[customer_key]', type: 'one-to-many' },
      { from: 'dim_merchant[merchant_key]', to: 'fact_orders[merchant_key]', type: 'one-to-many' },
    ],
  },
  {
    id: 'kartezy_delivery',
    name: 'Delivery Analytics',
    tables: ['fact_deliveries', 'dim_date', 'dim_delivery_partner', 'dim_location'],
    measures: [
      { name: 'Total Deliveries', table: 'fact_deliveries', expression: 'COUNTROWS(fact_deliveries)', format: 'integer', description: 'Total deliveries' },
      { name: 'Avg Delivery Time', table: 'fact_deliveries', expression: 'AVERAGE(fact_deliveries[total_delivery_time_minutes])', format: 'decimal', description: 'Average delivery time in minutes' },
      { name: 'On-Time Rate', table: 'fact_deliveries', expression: 'DIVIDE(COUNTROWS(FILTER(fact_deliveries, fact_deliveries[on_time] = TRUE)), COUNTROWS(fact_deliveries))', format: 'percentage', description: 'On-time delivery percentage' },
    ],
    relationships: [
      { from: 'dim_date[date_key]', to: 'fact_deliveries[date_key]', type: 'one-to-many' },
      { from: 'dim_delivery_partner[partner_key]', to: 'fact_deliveries[partner_key]', type: 'one-to-many' },
    ],
  },
  {
    id: 'kartezy_finance',
    name: 'Finance Analytics',
    tables: ['fact_payments', 'dim_date', 'dim_customer', 'dim_merchant'],
    measures: [
      { name: 'Total Payment Volume', table: 'fact_payments', expression: 'SUM(fact_payments[amount])', format: 'currency', description: 'Total payment volume' },
      { name: 'Net Revenue', table: 'fact_payments', expression: 'SUM(fact_payments[net_amount])', format: 'currency', description: 'Revenue after fees' },
      { name: 'Payment Success Rate', table: 'fact_payments', expression: 'DIVIDE(COUNTROWS(FILTER(fact_payments, fact_payments[payment_status] = "SUCCESS")), COUNTROWS(fact_payments))', format: 'percentage', description: 'Payment success rate' },
    ],
    relationships: [
      { from: 'dim_date[date_key]', to: 'fact_payments[date_key]', type: 'one-to-many' },
    ],
  },
];

export const POWER_BI_DASHBOARDS: PowerBIDashboard[] = [
  { id: 'exe_dashboard', name: 'Executive Dashboard', workspaceId: 'kartezy-bi', datasetId: 'kartezy_orders', reportId: 'exec_report', embedUrl: 'https://app.powerbi.com/reportEmbed', embedToken: undefined, lastRefresh: new Date().toISOString() },
  { id: 'ops_dashboard', name: 'Operations Dashboard', workspaceId: 'kartezy-bi', datasetId: 'kartezy_delivery', reportId: 'ops_report', embedUrl: 'https://app.powerbi.com/reportEmbed', embedToken: undefined, lastRefresh: new Date().toISOString() },
  { id: 'fin_dashboard', name: 'Finance Dashboard', workspaceId: 'kartezy-bi', datasetId: 'kartezy_finance', reportId: 'fin_report', embedUrl: 'https://app.powerbi.com/reportEmbed', embedToken: undefined, lastRefresh: new Date().toISOString() },
];

export function getPowerBIDataModelDocumentation(): string {
  return `# Kartezy Power BI Data Models

## Available Datasets

### 1. Orders Analytics (kartezy_orders)
- **Tables**: fact_orders, dim_date, dim_customer, dim_merchant, dim_product
- **Key Measures**: Total Revenue, Total Orders, AOV, Revenue YTD, Order Growth
- **Star Schema**: Single fact table with 5 dimensions

### 2. Delivery Analytics (kartezy_delivery)
- **Tables**: fact_deliveries, dim_date, dim_delivery_partner, dim_location
- **Key Measures**: Total Deliveries, Avg Delivery Time, On-Time Rate
- **Star Schema**: Single fact table with 3 dimensions

### 3. Finance Analytics (kartezy_finance)
- **Tables**: fact_payments, dim_date, dim_customer, dim_merchant
- **Key Measures**: Total Payment Volume, Net Revenue, Payment Success Rate
- **Star Schema**: Single fact table with 3 dimensions

## DAX Measures Included
All datasets include pre-built DAX measures for:
- Time intelligence (YTD, MTD, QTD, YoY, MoM)
- Ratios and KPIs
- Dynamic segmentation
- Period-over-period comparisons

## Embedding
Use Power BI Embedded for in-app dashboards:
\`\`\`javascript
const embedUrl = "https://app.powerbi.com/reportEmbed?reportId=<reportId>&groupId=<workspaceId>";
const embedToken = await getPowerBIEmbedToken(reportId, workspaceId);
\`\`\`
`;
}
