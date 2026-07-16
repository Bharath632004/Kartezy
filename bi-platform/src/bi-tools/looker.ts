/**
 * Kartezy Enterprise BI Platform - Looker Integration
 *
 * Ready-to-use Looker integration with LookML model definitions,
 * explores, and pre-built dashboards.
 */

export const LOOKER_EXPLORES = {
  orders: {
    name: 'orders',
    view_name: 'fact_orders',
    description: 'Explore all order-related metrics with dimensions',
    joins: [
      { join: 'dim_date', type: 'left_outer', relationship: 'many_to_one', sql_on: '${fact_orders.date_key} = ${dim_date.date_key}' },
      { join: 'dim_customer', type: 'left_outer', relationship: 'many_to_one', sql_on: '${fact_orders.customer_key} = ${dim_customer.customer_key}' },
      { join: 'dim_merchant', type: 'left_outer', relationship: 'many_to_one', sql_on: '${fact_orders.merchant_key} = ${dim_merchant.merchant_key}' },
      { join: 'dim_product', type: 'left_outer', relationship: 'many_to_one', sql_on: '${fact_orders.product_key} = ${dim_product.product_key}' },
      { join: 'dim_location', type: 'left_outer', relationship: 'many_to_one', sql_on: '${fact_orders.location_key} = ${dim_location.location_key}' },
    ],
  },
  deliveries: {
    name: 'deliveries',
    view_name: 'fact_deliveries',
    description: 'Explore delivery and logistics metrics',
    joins: [
      { join: 'dim_date', type: 'left_outer', relationship: 'many_to_one', sql_on: '${fact_deliveries.date_key} = ${dim_date.date_key}' },
      { join: 'dim_delivery_partner', type: 'left_outer', relationship: 'many_to_one', sql_on: '${fact_deliveries.partner_key} = ${dim_delivery_partner.partner_key}' },
      { join: 'dim_location', type: 'left_outer', relationship: 'many_to_one', sql_on: '${fact_deliveries.destination_location_key} = ${dim_location.location_key}' },
    ],
  },
};

export function getLookerModelYAML(): string {
  return `# Kartezy BI Platform - Looker Model
# Connection: kartezy_postgres (PostgreSQL 15+)
# Schema: kartezy_bi

connection: "kartezy_postgres"

include: "//views/**/*.view.lkml"
include: "//dashboards/**/*.dashboard.lookml"

datagroup: kartezy_default {
  max_cache_age: "1 hour"
  sql_trigger: SELECT MAX(etl_loaded_at) FROM kartezy_bi.fact_orders;;
}

explore: +orders {
  label: "Orders Analysis"
  group_label: "Kartezy BI"
  description: "Complete order analytics with customer, merchant, product, date, and location dimensions"
}

explore: +deliveries {
  label: "Delivery Analysis"
  group_label: "Kartezy BI"
  description: "Delivery performance analytics with driver, date, and location dimensions"
}

explore: payments {
  view_name: fact_payments
  label: "Payments Analysis"
  group_label: "Kartezy BI"
  join: dim_date {
    sql_on: \${fact_payments.date_key} = \${dim_date.date_key} ;;
    relationship: many_to_one
  }
  join: dim_customer {
    sql_on: \${fact_payments.customer_key} = \${dim_customer.customer_key} ;;
    relationship: many_to_one
  }
}

explore: customer_activity {
  view_name: fact_customer_activity
  label: "Customer Activity"
  group_label: "Kartezy BI"
  join: dim_date {
    sql_on: \${fact_customer_activity.date_key} = \${dim_date.date_key} ;;
    relationship: many_to_one
  }
  join: dim_customer {
    sql_on: \${fact_customer_activity.customer_key} = \${dim_customer.customer_key} ;;
    relationship: many_to_one
  }
}

explore: inventory {
  view_name: fact_inventory
  label: "Inventory Analysis"
  group_label: "Kartezy BI"
  join: dim_date {
    sql_on: \${fact_inventory.date_key} = \${dim_date.date_key} ;;
    relationship: many_to_one
  }
  join: dim_product {
    sql_on: \${fact_inventory.product_key} = \${dim_product.product_key} ;;
    relationship: many_to_one
  }
}

explore: marketing {
  view_name: fact_marketing
  label: "Marketing Analytics"
  group_label: "Kartezy BI"
  join: dim_date {
    sql_on: \${fact_marketing.date_key} = \${dim_date.date_key} ;;
    relationship: many_to_one
  }
  join: dim_promotion {
    sql_on: \${fact_marketing.promotion_key} = \${dim_promotion.promotion_key} ;;
    relationship: many_to_one
  }
}
`;
}

export function getLookerViewYAML(viewName: string, tableName: string, measures: string[]): string {
  return `# Auto-generated Looker view for ${tableName}
view: ${viewName} {
  sql_table_name: kartezy_bi.${tableName} ;;

  dimension_group: created {
    type: time
    timeframes: [raw, date, week, month, quarter, year]
    sql: \${TABLE}.etl_loaded_at ;;
  }

  ${measures.map(m => `measure: ${m} {
    type: count
    sql: \${TABLE}.${m} ;;
  }`).join('\n\n  ')}

  # Add specific dimensions from the table schema
  set: detail {
    fields: [created_date, created_month, created_quarter, created_year]
  }
}
`;
}

export const LOOKER_DASHBOARDS = [
  { id: 'kartezy_executive_overview', title: 'Executive Overview', description: 'C-suite dashboard with revenue, customers, orders, and growth metrics', model: 'kartezy_bi' },
  { id: 'kartezy_operations', title: 'Operations Dashboard', description: 'Delivery performance, fleet management, and zone analytics', model: 'kartezy_bi' },
  { id: 'kartezy_finance', title: 'Finance Dashboard', description: 'Revenue breakdown, commission, payouts, and tax reports', model: 'kartezy_bi' },
];
