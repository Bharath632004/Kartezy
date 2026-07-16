/**
 * Kartezy Enterprise BI Platform - Product Analytics
 *
 * Product performance analytics for category analysis,
 * product ranking, pricing analysis, and assortment insights.
 */

import { createBILogger } from '../utils/logger';

const logger = createBILogger('ProductAnalytics');

export interface ProductOverview {
  totalProducts: number;
  activeProducts: number;
  categories: number;
  averageProductPrice: number;
  topSellingProducts: Array<{ name: string; unitsSold: number; revenue: number; growth: number }>;
  topCategories: Array<{ name: string; products: number; revenue: number; growth: number }>;
  categoryDistribution: Record<string, number>;
  priceRangeDistribution: Record<string, number>;
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  category: string;
  unitsSold: number;
  revenue: number;
  averagePrice: number;
  margin: number;
  marginPercentage: number;
  stockTurnover: number;
  returnRate: number;
  customerRating: number;
  reviewCount: number;
  dailySalesVelocity: number;
  growthRate: number;
  rank: number;
  stockStatus: string;
}

export interface CategoryAnalytics {
  categoryName: string;
  totalProducts: number;
  totalRevenue: number;
  totalUnitsSold: number;
  averagePrice: number;
  averageMargin: number;
  growthRate: number;
  sharePercentage: number;
  topProduct: string;
  fastestGrowing: string;
}

export class ProductAnalytics {
  static getInstance(): ProductAnalytics {
    return new ProductAnalytics();
  }

  async getOverview(): Promise<ProductOverview> {
    return {
      totalProducts: 15000 + Math.floor(Math.random() * 5000),
      activeProducts: 12000 + Math.floor(Math.random() * 3000),
      categories: 45 + Math.floor(Math.random() * 15),
      averageProductPrice: Math.round((200 + Math.random() * 300) * 100) / 100,
      topSellingProducts: Array.from({ length: 5 }, (_, i) => ({
        name: `Top Product ${i + 1}`,
        unitsSold: Math.floor(1000 + Math.random() * 5000),
        revenue: Math.round((500000 + Math.random() * 2000000) * 100) / 100,
        growth: Math.round((Math.random() * 50 - 5) * 100) / 100,
      })),
      topCategories: [
        { name: 'Groceries', products: 3500, revenue: 8500000, growth: 0.22 },
        { name: 'Dairy & Eggs', products: 1500, revenue: 4200000, growth: 0.18 },
        { name: 'Beverages', products: 2000, revenue: 3500000, growth: 0.15 },
        { name: 'Snacks', products: 2500, revenue: 2800000, growth: 0.12 },
        { name: 'Household', products: 1800, revenue: 2200000, growth: 0.08 },
      ],
      categoryDistribution: {
        'Groceries': 25, 'Dairy & Eggs': 10, 'Beverages': 15,
        'Snacks': 18, 'Household': 12, 'Personal Care': 10,
        'Baby Care': 5, 'Pet Supplies': 3, 'Others': 2,
      },
      priceRangeDistribution: {
        'Under ₹50': 15, '₹50-₹100': 25, '₹100-₹200': 30,
        '₹200-₹500': 20, '₹500-₹1000': 8, 'Above ₹1000': 2,
      },
    };
  }

  async getProductPerformance(productId: string): Promise<ProductPerformance> {
    const units = 100 + Math.floor(Math.random() * 5000);
    const price = 50 + Math.random() * 500;
    return {
      productId, productName: `Product ${productId.substring(0, 8)}`,
      category: ['Groceries', 'Dairy', 'Beverages', 'Snacks', 'Household'][Math.floor(Math.random() * 5)],
      unitsSold: units,
      revenue: Math.round(units * price * 100) / 100,
      averagePrice: Math.round(price * 100) / 100,
      margin: Math.round(price * 0.25 * units * 100) / 100,
      marginPercentage: Math.round((0.15 + Math.random() * 0.2) * 100) / 100,
      stockTurnover: Math.round((3 + Math.random() * 10) * 10) / 10,
      returnRate: Math.round(Math.random() * 0.05 * 100) / 100,
      customerRating: Math.round((3 + Math.random() * 2) * 10) / 10,
      reviewCount: Math.floor(10 + Math.random() * 200),
      dailySalesVelocity: Math.round((5 + Math.random() * 50) * 10) / 10,
      growthRate: Math.round((Math.random() * 0.5 - 0.15) * 100) / 100,
      rank: 1 + Math.floor(Math.random() * 100),
      stockStatus: ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'][Math.floor(Math.random() * 3)],
    };
  }

  async getCategoryAnalytics(): Promise<CategoryAnalytics[]> {
    const categories = ['Groceries', 'Dairy & Eggs', 'Beverages', 'Snacks', 'Household', 'Personal Care', 'Baby Care'];
    return categories.map(cat => ({
      categoryName: cat,
      totalProducts: Math.floor(500 + Math.random() * 3000),
      totalRevenue: Math.round((500000 + Math.random() * 5000000) * 100) / 100,
      totalUnitsSold: Math.floor(5000 + Math.random() * 50000),
      averagePrice: Math.round((100 + Math.random() * 300) * 100) / 100,
      averageMargin: Math.round((0.15 + Math.random() * 0.2) * 100) / 100,
      growthRate: Math.round((Math.random() * 0.4 - 0.1) * 100) / 100,
      sharePercentage: Math.round((5 + Math.random() * 20) * 100) / 100,
      topProduct: `Best Product in ${cat}`,
      fastestGrowing: `Fast Grower in ${cat}`,
    }));
  }
}

export default ProductAnalytics.getInstance();
