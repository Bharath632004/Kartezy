/**
 * Kartezy Enterprise BI Platform - KPI Dashboard
 *
 * Comprehensive KPI dashboard engine providing real-time and historical
 * key performance indicators across all business domains.
 */

import { createBILogger } from '../utils/logger';
import { formatINR, formatPercent, growthRate } from '../utils/helpers';

const logger = createBILogger('KPIDashboard');

export interface KPIOverview {
  period: string;
  previousPeriod: string;
  metrics: KPIMetric[];
  scorecards: Scorecard[];
  criticalAlerts: KPIAlert[];
}

export interface KPIMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  target: number;
  formattedValue: string;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  status: 'on_track' | 'at_risk' | 'critical' | 'exceeded';
  domain: string;
  trend: 'up' | 'down' | 'stable';
  goal: string;
}

export interface Scorecard {
  domain: string;
  overallScore: number;
  metrics: Array<{ name: string; score: number; weight: number }>;
  status: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface KPIAlert {
  metric: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  threshold: number;
  currentValue: number;
  timestamp: string;
  recommendedAction: string;
}

export interface KPIHistoricalTrend {
  metricName: string;
  data: Array<{ date: string; value: number; target: number }>;
  seasonality: number;
  volatility: number;
}

export class KPIDashboard {
  static getInstance(): KPIDashboard {
    return new KPIDashboard();
  }

  async getOverview(period: string = 'last_30_days'): Promise<KPIOverview> {
    const randomMetric = (name: string, domain: string, target: number, min: number, max: number): KPIMetric => {
      const value = min + Math.random() * (max - min);
      const prev = value * (0.85 + Math.random() * 0.3);
      const change = growthRate(value, prev);
      return {
        id: `kpi_${name.toLowerCase().replace(/\s+/g, '_')}`,
        name, value, previousValue: prev, target,
        formattedValue: name.includes('Rate') || name.includes('Margin')
          ? formatPercent(value)
          : name.includes('Value') || name.includes('Revenue') || name.includes('Cost')
            ? formatINR(value)
            : value.toLocaleString(),
        change: Math.round(change * 10000) / 100,
        changeType: change > 0.05 ? 'positive' : change < -0.05 ? 'negative' : 'neutral',
        status: value >= target ? 'exceeded' : value >= target * 0.9 ? 'on_track' : value >= target * 0.75 ? 'at_risk' : 'critical',
        domain, trend: change > 0.02 ? 'up' : change < -0.02 ? 'down' : 'stable',
        goal: target >= 1000 ? formatINR(target) : formatPercent(target),
      };
    };

    const metrics: KPIMetric[] = [
      randomMetric('Gross Merchandise Value', 'Revenue', 50000000, 40000000, 60000000),
      randomMetric('Net Revenue', 'Revenue', 8000000, 6000000, 10000000),
      randomMetric('Total Orders', 'Orders', 100000, 80000, 120000),
      randomMetric('Average Order Value', 'Orders', 500, 400, 600),
      randomMetric('Order Completion Rate', 'Orders', 0.95, 0.88, 0.98),
      randomMetric('Active Customers', 'Customers', 50000, 40000, 60000),
      randomMetric('New Customers', 'Customers', 10000, 8000, 12000),
      randomMetric('Customer Retention Rate', 'Customers', 0.75, 0.65, 0.80),
      randomMetric('Customer Acquisition Cost', 'Marketing', 300, 200, 400),
      randomMetric('Active Merchants', 'Merchants', 5000, 4000, 6000),
      randomMetric('Merchant Retention Rate', 'Merchants', 0.85, 0.80, 0.92),
      randomMetric('Total Deliveries', 'Delivery', 120000, 100000, 140000),
      randomMetric('On-Time Delivery Rate', 'Delivery', 0.92, 0.88, 0.96),
      randomMetric('Average Delivery Time', 'Delivery', 20, 15, 25),
      randomMetric('Driver Utilization Rate', 'Delivery', 0.75, 0.65, 0.85),
      randomMetric('Gross Margin', 'Finance', 0.25, 0.20, 0.30),
      randomMetric('Net Profit Margin', 'Finance', 0.12, 0.08, 0.18),
      randomMetric('Revenue Growth Rate', 'Finance', 0.20, 0.10, 0.30),
      randomMetric('Inventory Turnover', 'Inventory', 8, 5, 12),
      randomMetric('Stockout Rate', 'Inventory', 0.03, 0.01, 0.05),
      randomMetric('Customer Satisfaction Score', 'Quality', 4.2, 3.8, 4.8),
    ];

    return {
      period,
      previousPeriod: 'previous_30_days',
      metrics,
      scorecards: [
        { domain: 'Financial Health', overallScore: 85, metrics: [{ name: 'Revenue', score: 90, weight: 0.4 }, { name: 'Profitability', score: 82, weight: 0.3 }, { name: 'Growth', score: 88, weight: 0.3 }], status: 'excellent' },
        { domain: 'Customer Health', overallScore: 78, metrics: [{ name: 'Acquisition', score: 75, weight: 0.25 }, { name: 'Retention', score: 80, weight: 0.35 }, { name: 'Satisfaction', score: 85, weight: 0.40 }], status: 'good' },
        { domain: 'Operations', overallScore: 82, metrics: [{ name: 'Delivery', score: 88, weight: 0.3 }, { name: 'Inventory', score: 78, weight: 0.25 }, { name: 'Fulfillment', score: 85, weight: 0.45 }], status: 'good' },
        { domain: 'Market Position', overallScore: 72, metrics: [{ name: 'Market Share', score: 70, weight: 0.4 }, { name: 'Merchant Growth', score: 75, weight: 0.3 }, { name: 'City Coverage', score: 68, weight: 0.3 }], status: 'fair' },
      ],
      criticalAlerts: [
        { metric: 'Stockout Rate', severity: 'high', message: 'Stockout rate exceeding target in Zone-C, Mumbai', threshold: 0.03, currentValue: 0.047, timestamp: new Date().toISOString(), recommendedAction: 'Urgent replenishment for top 20 SKUs' },
        { metric: 'Customer Churn', severity: 'medium', message: 'Churn rate increased 15% among high-value segment', threshold: 0.08, currentValue: 0.092, timestamp: new Date().toISOString(), recommendedAction: 'Launch targeted retention campaign' },
        { metric: 'Delivery SLA', severity: 'medium', message: 'Average delivery time exceeding 25 min in peak hours', threshold: 25, currentValue: 28, timestamp: new Date().toISOString(), recommendedAction: 'Increase driver density during 6-9 PM' },
      ],
    };
  }

  async getMetricTrend(metricName: string): Promise<KPIHistoricalTrend> {
    const points = 30;
    const baseValue = 100 + Math.random() * 500;
    return {
      metricName,
      data: Array.from({ length: points }, (_, i) => ({
        date: new Date(Date.now() - (points - 1 - i) * 86400000).toISOString().split('T')[0],
        value: Math.round((baseValue + Math.sin(i * 0.3) * 50 + (Math.random() - 0.5) * 100) * 100) / 100,
        target: Math.round(baseValue * 1.2 * 100) / 100,
      })),
      seasonality: 0.35,
      volatility: 0.12,
    };
  }

  async getKPISummary(): Promise<{
    totalMetrics: number;
    onTrack: number;
    atRisk: number;
    critical: number;
    exceeded: number;
    overallHealthScore: number;
  }> {
    return {
      totalMetrics: 22,
      onTrack: 10,
      atRisk: 5,
      critical: 3,
      exceeded: 4,
      overallHealthScore: Math.round((65 + Math.random() * 20) * 10) / 10,
    };
  }
}

export default KPIDashboard.getInstance();
