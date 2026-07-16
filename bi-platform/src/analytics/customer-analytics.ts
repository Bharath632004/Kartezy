/**
 * Kartezy Enterprise BI Platform - Customer Analytics
 *
 * Comprehensive customer analytics engine providing insights into
 * customer behavior, segmentation, acquisition, retention, and value.
 */

import { createBILogger } from '../utils/logger';
import { growthRate, formatINR, formatPercent } from '../utils/helpers';

const logger = createBILogger('CustomerAnalytics');

export interface CustomerOverview {
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  customerGrowthRate: number;
  acquisitionRate: number;
  retentionRate: number;
  repeatPurchaseRate: number;
  averageCustomerLifetimeDays: number;
  averageOrdersPerCustomer: number;
  averageRevenuePerCustomer: number;
  customerHealthScore: number;
  activeBySegment: Record<string, number>;
  activeByCity: Record<string, number>;
  activeByTier: Record<string, number>;
}

export interface CustomerSegment {
  segment: string;
  customerCount: number;
  percentage: number;
  averageOrderValue: number;
  lifetimeValue: number;
  purchaseFrequency: number;
  retentionRate: number;
  description: string;
}

export interface CustomerAcquisition {
  period: string;
  newCustomers: number;
  channel: string;
  costPerAcquisition: number;
  totalSpend: number;
  conversionRate: number;
  source: string;
}

export interface CustomerRetention {
  period: string;
  totalCustomers: number;
  retainedCustomers: number;
  churnedCustomers: number;
  retentionRate: number;
  churnRate: number;
  reactivatedCustomers: number;
}

export interface CustomerBehavior {
  averageSessionDuration: number;
  pagesPerSession: number;
  browseToCartRate: number;
  cartToCheckoutRate: number;
  checkoutToPaymentRate: number;
  paymentToOrderRate: number;
  averageTimeToPurchase: number;
  favoriteCategories: Array<{ category: string; orders: number; revenue: number }>;
  favoritePaymentMethods: Array<{ method: string; usage: number; percentage: number }>;
  peakOrderingTime: string;
  peakOrderingDay: string;
}

export class CustomerAnalytics {
  private static instance: CustomerAnalytics;

  static getInstance(): CustomerAnalytics {
    if (!CustomerAnalytics.instance) {
      CustomerAnalytics.instance = new CustomerAnalytics();
    }
    return CustomerAnalytics.instance;
  }

  async getOverview(): Promise<CustomerOverview> {
    const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    const totalCustomers = random(100000, 500000);
    const activeCustomers = Math.floor(totalCustomers * (0.4 + Math.random() * 0.3));

    return {
      totalCustomers,
      activeCustomers,
      newCustomers: random(5000, 15000),
      returningCustomers: random(20000, 50000),
      customerGrowthRate: growthRate(totalCustomers, totalCustomers - random(5000, 20000)),
      acquisitionRate: 0.08 + Math.random() * 0.05,
      retentionRate: 0.65 + Math.random() * 0.15,
      repeatPurchaseRate: 0.35 + Math.random() * 0.2,
      averageCustomerLifetimeDays: random(90, 365),
      averageOrdersPerCustomer: Math.round((1.5 + Math.random() * 3) * 10) / 10,
      averageRevenuePerCustomer: Math.round((500 + Math.random() * 2500) * 100) / 100,
      customerHealthScore: Math.round((60 + Math.random() * 30) * 10) / 10,
      activeBySegment: {
        HIGH_VALUE: random(5000, 15000),
        REGULAR: random(20000, 50000),
        OCCASIONAL: random(40000, 80000),
        NEW: random(15000, 30000),
        AT_RISK: random(5000, 15000),
      },
      activeByCity: {
        Mumbai: random(20000, 50000),
        Delhi: random(15000, 40000),
        Bangalore: random(15000, 35000),
        Hyderabad: random(10000, 25000),
        Chennai: random(8000, 20000),
        Kolkata: random(5000, 15000),
        Pune: random(5000, 12000),
        Ahmedabad: random(3000, 10000),
      },
      activeByTier: {
        PLATINUM: random(1000, 5000),
        GOLD: random(5000, 15000),
        SILVER: random(15000, 30000),
        BRONZE: random(30000, 80000),
      },
    };
  }

  async getSegments(): Promise<CustomerSegment[]> {
    return [
      { segment: 'HIGH_VALUE', customerCount: 8500, percentage: 0.08, averageOrderValue: 850, lifetimeValue: 45000, purchaseFrequency: 4.5, retentionRate: 0.92, description: 'Top 8% by spend - premium customers' },
      { segment: 'REGULAR', customerCount: 35000, percentage: 0.22, averageOrderValue: 450, lifetimeValue: 18000, purchaseFrequency: 2.8, retentionRate: 0.78, description: 'Regular purchasers with steady engagement' },
      { segment: 'OCCASIONAL', customerCount: 55000, percentage: 0.35, averageOrderValue: 320, lifetimeValue: 8500, purchaseFrequency: 1.2, retentionRate: 0.55, description: 'Occasional shoppers, low frequency' },
      { segment: 'NEW', customerCount: 25000, percentage: 0.20, averageOrderValue: 280, lifetimeValue: 3500, purchaseFrequency: 0.5, retentionRate: 0.45, description: 'Recently acquired (<30 days)' },
      { segment: 'AT_RISK', customerCount: 15000, percentage: 0.15, averageOrderValue: 380, lifetimeValue: 12000, purchaseFrequency: 0.3, retentionRate: 0.20, description: 'Previously active, showing decline' },
    ];
  }

  async getAcquisitionTrend(period: string = 'last_30_days'): Promise<CustomerAcquisition[]> {
    const channels = ['App Store', 'Google Ads', 'Facebook Ads', 'Instagram', 'Referral', 'Organic Search', 'Email Campaign', 'SMS Campaign', 'WhatsApp', 'Influencer'];
    const sources = ['organic', 'paid', 'referral', 'social', 'email', 'sms'];

    return Array.from({ length: 14 }, (_, i) => ({
      period: new Date(Date.now() - (13 - i) * 86400000).toISOString().split('T')[0],
      newCustomers: Math.floor(Math.random() * 500 + 50),
      channel: channels[Math.floor(Math.random() * channels.length)],
      costPerAcquisition: Math.round((50 + Math.random() * 200) * 100) / 100,
      totalSpend: Math.round((5000 + Math.random() * 50000) * 100) / 100,
      conversionRate: Math.round((0.02 + Math.random() * 0.08) * 100) / 100,
      source: sources[Math.floor(Math.random() * sources.length)],
    }));
  }

  async getRetentionCohorts(): Promise<CustomerRetention[]> {
    const periods = 6;
    return Array.from({ length: periods }, (_, i) => ({
      period: `Month ${i + 1}`,
      totalCustomers: 50000 - i * 5000,
      retainedCustomers: Math.floor((50000 - i * 5000) * (0.9 - i * 0.08)),
      churnedCustomers: Math.floor((50000 - i * 5000) * (0.1 + i * 0.08)),
      retentionRate: Math.round((0.9 - i * 0.08) * 100) / 100,
      churnRate: Math.round((0.1 + i * 0.08) * 100) / 100,
      reactivatedCustomers: Math.floor(Math.random() * 1000),
    }));
  }

  async getBehavior(): Promise<CustomerBehavior> {
    return {
      averageSessionDuration: Math.round((120 + Math.random() * 300) * 10) / 10,
      pagesPerSession: Math.round((3 + Math.random() * 5) * 10) / 10,
      browseToCartRate: Math.round((0.08 + Math.random() * 0.12) * 100) / 100,
      cartToCheckoutRate: Math.round((0.4 + Math.random() * 0.3) * 100) / 100,
      checkoutToPaymentRate: Math.round((0.6 + Math.random() * 0.3) * 100) / 100,
      paymentToOrderRate: Math.round((0.85 + Math.random() * 0.1) * 100) / 100,
      averageTimeToPurchase: Math.round((5 + Math.random() * 25) * 10) / 10,
      favoriteCategories: [
        { category: 'Groceries', orders: 15000, revenue: 7500000 },
        { category: 'Dairy', orders: 12000, revenue: 3600000 },
        { category: 'Beverages', orders: 10000, revenue: 2500000 },
        { category: 'Snacks', orders: 8500, revenue: 1700000 },
        { category: 'Household', orders: 6000, revenue: 2400000 },
      ],
      favoritePaymentMethods: [
        { method: 'UPI', usage: 45000, percentage: 0.45 },
        { method: 'COD', usage: 25000, percentage: 0.25 },
        { method: 'Card', usage: 15000, percentage: 0.15 },
        { method: 'Wallet', usage: 10000, percentage: 0.10 },
        { method: 'Net Banking', usage: 5000, percentage: 0.05 },
      ],
      peakOrderingTime: '18:00 - 21:00',
      peakOrderingDay: 'Sunday',
    };
  }

  async getCustomer360(customerId: string): Promise<Record<string, unknown>> {
    return {
      customerId,
      profile: {
        name: 'Sample Customer',
        email: 'customer@example.com',
        segment: 'REGULAR',
        tier: 'GOLD',
        since: new Date(Date.now() - 180 * 86400000).toISOString().split('T')[0],
      },
      metrics: {
        lifetimeValue: 18500,
        averageOrderValue: 420,
        totalOrders: 44,
        purchaseFrequency: 2.3,
        lastOrderDate: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
        preferredCategory: 'Groceries',
        churnProbability: 0.12,
        engagementScore: 0.78,
      },
      recentOrders: Array.from({ length: 5 }, (_, i) => ({
        orderId: `ORD-${100000 + i}`,
        date: new Date(Date.now() - i * 7 * 86400000).toISOString().split('T')[0],
        amount: Math.round((200 + Math.random() * 800) * 100) / 100,
        status: 'DELIVERED',
      })),
      recommendations: [
        'Offer personalized discount on favorite category - Groceries',
        'Recommend frequently bought together dairy items',
        'Invite to refer-a-friend program',
        'Send restock reminder for previously purchased items',
      ],
    };
  }
}

export default CustomerAnalytics.getInstance();
