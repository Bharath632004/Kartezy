/**
 * Kartezy Enterprise BI Platform - Executive Dashboard
 *
 * C-suite strategic dashboard providing a holistic view of business health,
 * growth metrics, market position, and strategic recommendations.
 */

import { createBILogger } from '../utils/logger';
import { formatINR, formatPercent, cagr } from '../utils/helpers';

const logger = createBILogger('ExecutiveDashboard');

export interface ExecutiveSummary {
  companyHealthScore: number;
  revenue: { current: number; target: number; previous: number; growth: number; yoyGrowth: number };
  profitability: { grossMargin: number; netMargin: number; ebitda: number; ebitdaMargin: number };
  customers: { total: number; active: number; new: number; churnRate: number; ltv: number; cac: number };
  operations: { orders: number; deliveryRate: number; avgDeliveryTime: number; merchantCount: number };
  market: { cityCount: number; marketShare: number; topCity: string; growthMarkets: string[] };
  strategicAlerts: Array<{ severity: string; title: string; description: string; impact: string; action: string }>;
}

export interface RevenuePerformance {
  ytdRevenue: number;
  projectedRevenue: number;
  revenueAttainment: number;
  quarterlyTrend: Array<{ quarter: string; revenue: number; target: number; attainment: number }>;
  revenueByStream: Array<{ stream: string; amount: number; percentage: number; growth: number }>;
  revenueByGeography: Array<{ city: string; amount: number; percentage: number; growth: number }>;
}

export interface BusinessHealth {
  score: number;
  category: 'strong' | 'good' | 'fair' | 'needs_attention' | 'critical';
  dimensions: Array<{
    name: string;
    score: number;
    weight: number;
    status: string;
    metrics: Array<{ name: string; value: number; benchmark: number }>;
  }>;
  recommendations: Array<{ priority: string; area: string; action: string; expectedImpact: string }>;
}

export class ExecutiveDashboard {
  static getInstance(): ExecutiveDashboard {
    return new ExecutiveDashboard();
  }

  async getExecutiveSummary(): Promise<ExecutiveSummary> {
    const revenue = 50000000 + Math.random() * 20000000;
    const prevRevenue = revenue * (0.75 + Math.random() * 0.15);

    return {
      companyHealthScore: Math.round((70 + Math.random() * 20) * 10) / 10,
      revenue: {
        current: Math.round(revenue * 100) / 100,
        target: Math.round(revenue * 1.2 * 100) / 100,
        previous: Math.round(prevRevenue * 100) / 100,
        growth: Math.round(((revenue - prevRevenue) / prevRevenue) * 10000) / 100,
        yoyGrowth: Math.round((0.25 + Math.random() * 0.20) * 10000) / 100,
      },
      profitability: {
        grossMargin: Math.round((0.22 + Math.random() * 0.08) * 10000) / 100,
        netMargin: Math.round((0.10 + Math.random() * 0.06) * 10000) / 100,
        ebitda: Math.round(revenue * (0.15 + Math.random() * 0.05) * 100) / 100,
        ebitdaMargin: Math.round((0.15 + Math.random() * 0.05) * 10000) / 100,
      },
      customers: {
        total: 150000 + Math.floor(Math.random() * 100000),
        active: 60000 + Math.floor(Math.random() * 40000),
        new: 8000 + Math.floor(Math.random() * 5000),
        churnRate: Math.round((0.05 + Math.random() * 0.04) * 10000) / 100,
        ltv: Math.round((5000 + Math.random() * 5000) * 100) / 100,
        cac: Math.round((200 + Math.random() * 200) * 100) / 100,
      },
      operations: {
        orders: Math.floor(80000 + Math.random() * 40000),
        deliveryRate: Math.round((0.92 + Math.random() * 0.05) * 10000) / 100,
        avgDeliveryTime: Math.round((18 + Math.random() * 8) * 10) / 10,
        merchantCount: 5000 + Math.floor(Math.random() * 3000),
      },
      market: {
        cityCount: 12 + Math.floor(Math.random() * 5),
        marketShare: Math.round((0.12 + Math.random() * 0.08) * 10000) / 100,
        topCity: 'Mumbai',
        growthMarkets: ['Pune', 'Jaipur', 'Lucknow', 'Nagpur'],
      },
      strategicAlerts: [
        { severity: 'high', title: 'Customer Acquisition Cost Rising', description: 'CAC increased 22% in last quarter due to increased ad competition', impact: 'ROAS declining from 3.2x to 2.5x', action: 'Review marketing mix and optimize high-cost channels' },
        { severity: 'medium', title: 'Inventory Stockout in Top Categories', description: 'Stockout rate at 4.7% for top-selling groceries', impact: 'Estimated revenue loss of ₹12L per week', action: 'Implement AI-driven demand forecasting and auto-replenishment' },
        { severity: 'medium', title: 'Tier-2 City Expansion Opportunity', description: 'Pune and Jaipur showing 40% month-over-month growth', impact: 'Potential to double revenue in these markets', action: 'Accelerate merchant onboarding and marketing spend in high-growth cities' },
        { severity: 'low', title: 'Customer NPS Showing Improvement', description: 'NPS improved from 45 to 52 after delivery time improvements', impact: 'Expected 15% improvement in retention', action: 'Continue focus on delivery SLAs and quality' },
      ],
    };
  }

  async getRevenuePerformance(): Promise<RevenuePerformance> {
    const ytd = 45000000;
    return {
      ytdRevenue: Math.round(ytd * 100) / 100,
      projectedRevenue: Math.round(ytd * 1.35 * 100) / 100,
      revenueAttainment: Math.round((ytd / (ytd * 1.35)) * 10000) / 100,
      quarterlyTrend: [
        { quarter: 'Q1 2024', revenue: 12000000, target: 10000000, attainment: 1.2 },
        { quarter: 'Q2 2024', revenue: 13500000, target: 12500000, attainment: 1.08 },
        { quarter: 'Q3 2024', revenue: 14500000, target: 14000000, attainment: 1.04 },
        { quarter: 'Q4 2024 (Projected)', revenue: 16500000, target: 16000000, attainment: 1.03 },
      ],
      revenueByStream: [
        { stream: 'Commission', amount: 38000000, percentage: 0.72, growth: 0.25 },
        { stream: 'Delivery Fees', amount: 8500000, percentage: 0.16, growth: 0.18 },
        { stream: 'Subscription', amount: 3500000, percentage: 0.07, growth: 0.35 },
        { stream: 'Advertising', amount: 2500000, percentage: 0.05, growth: 0.42 },
      ],
      revenueByGeography: [
        { city: 'Mumbai', amount: 15000000, percentage: 0.28, growth: 0.22 },
        { city: 'Delhi', amount: 12000000, percentage: 0.23, growth: 0.18 },
        { city: 'Bangalore', amount: 9500000, percentage: 0.18, growth: 0.25 },
        { city: 'Hyderabad', amount: 6500000, percentage: 0.12, growth: 0.30 },
        { city: 'Chennai', amount: 5000000, percentage: 0.10, growth: 0.15 },
        { city: 'Others', amount: 5000000, percentage: 0.09, growth: 0.35 },
      ],
    };
  }

  async getBusinessHealth(): Promise<BusinessHealth> {
    const score = Math.round((65 + Math.random() * 25) * 10) / 10;
    return {
      score,
      category: score >= 80 ? 'strong' : score >= 70 ? 'good' : score >= 60 ? 'fair' : score >= 50 ? 'needs_attention' : 'critical',
      dimensions: [
        {
          name: 'Financial Performance', score: 82, weight: 0.30, status: 'strong',
          metrics: [
            { name: 'Revenue Growth', value: 0.22, benchmark: 0.15 },
            { name: 'Profit Margin', value: 0.14, benchmark: 0.12 },
            { name: 'Cash Flow', value: 0.18, benchmark: 0.12 },
          ],
        },
        {
          name: 'Customer Metrics', score: 75, weight: 0.25, status: 'good',
          metrics: [
            { name: 'Customer Retention', value: 0.72, benchmark: 0.70 },
            { name: 'NPS Score', value: 52, benchmark: 50 },
            { name: 'LTV/CAC Ratio', value: 3.2, benchmark: 3.0 },
          ],
        },
        {
          name: 'Operational Efficiency', score: 78, weight: 0.20, status: 'good',
          metrics: [
            { name: 'Delivery Success Rate', value: 0.94, benchmark: 0.92 },
            { name: 'Average Delivery Time', value: 22, benchmark: 20 },
            { name: 'Driver Utilization', value: 0.72, benchmark: 0.70 },
          ],
        },
        {
          name: 'Market Position', score: 70, weight: 0.15, status: 'fair',
          metrics: [
            { name: 'Market Share', value: 0.14, benchmark: 0.15 },
            { name: 'City Coverage', value: 15, benchmark: 12 },
            { name: 'Merchant Growth', value: 0.18, benchmark: 0.15 },
          ],
        },
        {
          name: 'Innovation & Growth', score: 68, weight: 0.10, status: 'fair',
          metrics: [
            { name: 'New Features', value: 0.60, benchmark: 0.50 },
            { name: 'AI Adoption', value: 0.45, benchmark: 0.40 },
            { name: 'Automation Rate', value: 0.55, benchmark: 0.50 },
          ],
        },
      ],
      recommendations: [
        { priority: 'HIGH', area: 'Customer Acquisition', action: 'Optimize marketing spend - reallocate budget from low-ROAS channels to high-performing ones', expectedImpact: 'Reduce CAC by 20%, increase ROAS to 4.0x' },
        { priority: 'HIGH', area: 'Inventory Management', action: 'Deploy AI-driven demand forecasting for top 1000 SKUs', expectedImpact: 'Reduce stockouts by 60%, increase revenue by 5%' },
        { priority: 'MEDIUM', area: 'City Expansion', action: 'Launch in 5 new Tier-2 cities with focused marketing and merchant acquisition', expectedImpact: 'Expand TAM by 35%, projected revenue increase of ₹12Cr' },
        { priority: 'MEDIUM', area: 'Customer Retention', action: 'Implement predictive churn engine and automated retention campaigns', expectedImpact: 'Reduce churn by 25%, improve LTV by 18%' },
      ],
    };
  }
}

export default ExecutiveDashboard.getInstance();
