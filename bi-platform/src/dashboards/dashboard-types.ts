/**
 * Kartezy Enterprise BI Platform - Dashboard Types
 *
 * Shared types and interfaces for all dashboard components.
 */

export interface PeriodFilter {
  startDate: string;
  endDate: string;
  granularity: 'day' | 'week' | 'month' | 'quarter' | 'year';
  comparison: 'none' | 'previous_period' | 'year_over_year' | 'custom';
}

export interface DataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  category?: string;
  date?: string;
  metadata?: Record<string, unknown>;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    color?: string;
    type?: 'bar' | 'line' | 'area' | 'pie' | 'doughnut';
  }>;
}

export interface TimeSeriesData {
  timestamps: string[];
  values: number[];
  targets?: number[];
  upperBound?: number[];
  lowerBound?: number[];
}

export interface MetricCard {
  id: string;
  title: string;
  value: string;
  secondaryValue?: string;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: string;
  color?: string;
  trend?: 'up' | 'down' | 'stable';
  format: 'currency' | 'percentage' | 'number' | 'time' | 'rating';
  tooltip?: string;
  link?: string;
}

export interface FilterOption {
  id: string;
  label: string;
  type: 'date' | 'select' | 'multi-select' | 'search' | 'range';
  value: string | string[];
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
}

export interface DashboardConfig {
  id: string;
  name: string;
  description: string;
  layout: 'grid' | 'flex' | 'freeform';
  widgets: WidgetConfig[];
  refreshInterval: number;
  filters: FilterOption[];
  permissions: string[];
}

export interface WidgetConfig {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'list' | 'heatmap' | 'cohort' | 'funnel' | 'map';
  title: string;
  size: { width: number; height: number };
  position: { x: number; y: number };
  dataSource: string;
  visualConfig: Record<string, unknown>;
  drillDown?: string;
  refreshInterval?: number;
}

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf' | 'json';
  includeCharts: boolean;
  pageOrientation: 'portrait' | 'landscape';
  pageSize: 'A4' | 'Letter' | 'A3';
  includeFilters: boolean;
  includeTimestamp: boolean;
  branding: {
    logo?: string;
    companyName: string;
    reportTitle: string;
    footer?: string;
  };
}

export const DASHBOARD_DOMAINS = [
  'overview', 'revenue', 'customers', 'merchants',
  'delivery', 'inventory', 'marketing', 'finance',
  'operations', 'quality', 'support',
] as const;

export type DashboardDomain = typeof DASHBOARD_DOMAINS[number];
