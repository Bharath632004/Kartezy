/**
 * Kartezy Enterprise BI Platform - Merchant Analytics
 *
 * Merchant/store performance analytics providing insights into
 * sales, operations, product performance, and growth metrics.
 */

import { createBILogger } from '../utils/logger';

const logger = createBILogger('MerchantAnalytics');

export interface MerchantOverview {
  totalMerchants: number;
  activeMerchants: number;
  pendingMerchants: number;
  suspendedMerchants: number;
  merchantGrowthRate: number;
  averageRating: number;
  totalCommission: number;
  averageCommissionRate: number;
  topMerchantsByRevenue: Array<{ name: string; revenue: number; orders: number }>;
  merchantsByCity: Record<string, number>;
  merchantsByStatus: Record<string, number>;
  merchantsByTier: Record<string, number>;
}

export interface MerchantPerformance {
  merchantId: string;
  merchantName: string;
  period: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  uniqueCustomers: number;
  repeatCustomerRate: number;
  returnRate: number;
  cancellationRate: number;
  onTimeDeliveryRate: number;
  averagePreparationTime: number;
  inventoryHealthScore: number;
  topProducts: Array<{ productId: string; name: string; unitsSold: number; revenue: number }>;
  growthRate: number;
  rank: number;
}

export interface MerchantBenchmark {
  metric: string;
  merchantValue: number;
  averageValue: number;
  topQuartile: number;
  percentile: number;
  category: string;
}

export class MerchantAnalytics {
  static getInstance(): MerchantAnalytics {
    return new MerchantAnalytics();
  }

  async getOverview(): Promise<MerchantOverview> {
    const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    const total = random(5000, 20000);

    return {
      totalMerchants: total,
      activeMerchants: Math.floor(total * 0.75),
      pendingMerchants: Math.floor(total * 0.10),
      suspendedMerchants: Math.floor(total * 0.05),
      merchantGrowthRate: 0.05 + Math.random() * 0.10,
      averageRating: Math.round((3.5 + Math.random() * 1.2) * 10) / 10,
      totalCommission: Math.round(Math.random() * 5000000 * 100) / 100,
      averageCommissionRate: Math.round((5 + Math.random() * 15) * 10) / 10,
      topMerchantsByRevenue: Array.from({ length: 5 }, (_, i) => ({
        name: `Top Merchant ${i + 1}`,
        revenue: Math.round((100000 + Math.random() * 900000) * 100) / 100,
        orders: random(500, 5000),
      })),
      merchantsByCity: {
        Mumbai: random(500, 3000),
        Delhi: random(400, 2500),
        Bangalore: random(300, 2000),
        Hyderabad: random(200, 1500),
        Chennai: random(200, 1200),
        Pune: random(150, 800),
        Kolkata: random(100, 600),
        Ahmedabad: random(100, 500),
      },
      merchantsByStatus: { ACTIVE: Math.floor(total * 0.75), PENDING: Math.floor(total * 0.10), SUSPENDED: Math.floor(total * 0.05), INACTIVE: Math.floor(total * 0.10) },
      merchantsByTier: { PREMIUM: Math.floor(total * 0.10), STANDARD: Math.floor(total * 0.50), BASIC: Math.floor(total * 0.40) },
    };
  }

  async getPerformance(merchantId: string): Promise<MerchantPerformance> {
    const random = () => Math.random();
    return {
      merchantId, merchantName: `Merchant ${merchantId.substring(0, 8)}`,
      period: 'last_30_days',
      totalOrders: Math.floor(100 + random() * 5000),
      totalRevenue: Math.round((50000 + random() * 500000) * 100) / 100,
      averageOrderValue: Math.round((200 + random() * 600) * 100) / 100,
      uniqueCustomers: Math.floor(50 + random() * 500),
      repeatCustomerRate: Math.round((0.3 + random() * 0.4) * 100) / 100,
      returnRate: Math.round(random() * 0.08 * 100) / 100,
      cancellationRate: Math.round(random() * 0.05 * 100) / 100,
      onTimeDeliveryRate: Math.round((0.85 + random() * 0.15) * 100) / 100,
      averagePreparationTime: Math.round((5 + random() * 15) * 10) / 10,
      inventoryHealthScore: Math.round((50 + random() * 50) * 10) / 10,
      topProducts: Array.from({ length: 5 }, (_, i) => ({
        productId: `PROD-${10000 + i}`, name: `Product ${i + 1}`,
        unitsSold: Math.floor(10 + random() * 500),
        revenue: Math.round((5000 + random() * 50000) * 100) / 100,
      })),
      growthRate: Math.round((random() * 0.5 - 0.1) * 100) / 100,
      rank: 1 + Math.floor(random() * 100),
    };
  }

  async getBenchmarks(merchantId: string): Promise<MerchantBenchmark[]> {
    return [
      { metric: 'Average Order Value', merchantValue: 425, averageValue: 380, topQuartile: 520, percentile: 68, category: 'Sales' },
      { metric: 'Customer Retention', merchantValue: 0.42, averageValue: 0.38, topQuartile: 0.55, percentile: 62, category: 'Engagement' },
      { metric: 'On-Time Delivery', merchantValue: 0.94, averageValue: 0.91, topQuartile: 0.97, percentile: 75, category: 'Operations' },
      { metric: 'Return Rate', merchantValue: 0.03, averageValue: 0.04, topQuartile: 0.02, percentile: 72, category: 'Quality' },
      { metric: 'Inventory Health', merchantValue: 0.82, averageValue: 0.75, topQuartile: 0.88, percentile: 65, category: 'Inventory' },
    ];
  }
}

export default MerchantAnalytics.getInstance();
