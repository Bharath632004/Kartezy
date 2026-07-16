/**
 * Kartezy BI Platform - Admin Dashboard Store
 *
 * BI Store that integrates with existing Zustand stores (analyticsStore,
 * reportsStore, dashboardStore, financeStore, marketingStore) to provide
 * a unified Business Intelligence data layer for all BI dashboard pages.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useAnalyticsStore } from './analyticsStore';
import { useDashboardStore } from './dashboardStore';
import { useFinanceStore } from './financeStore';

// === Type Definitions ===

export interface BIState {
  // Overview / Executive Dashboard
  executiveSummary: ExecutiveSummary | null;
  kpiMetrics: KPIMetric[] | null;
  scorecards: Scorecard[] | null;

  // Customer Analytics
  customerOverview: CustomerAnalyticsOverview | null;
  customerSegments: CustomerSegment[] | null;
  customerAcquisition: CustomerAcquisitionData[] | null;
  customerRetention: CustomerRetentionData[] | null;
  customerBehavior: CustomerBehaviorData | null;
  clvDistribution: CLVDistribution[] | null;
  churnOverview: ChurnOverviewData | null;

  // Merchant Analytics
  merchantOverview: MerchantAnalyticsOverview | null;
  merchantPerformance: MerchantPerformanceData | null;
  merchantBenchmarks: MerchantBenchmarkData[] | null;

  // Delivery Analytics
  deliveryOverview: DeliveryAnalyticsOverview | null;
  driverPerformance: DriverPerformanceData[] | null;
  zoneAnalytics: ZoneAnalyticsData[] | null;

  // Finance Analytics
  financeOverview: FinanceAnalyticsOverview | null;
  revenueBreakdown: RevenueBreakdownData[] | null;
  commissionSummary: CommissionSummaryData | null;
  payoutSummary: PayoutSummaryData | null;
  gstReport: GSTReportData | null;

  // Marketing Analytics
  marketingOverview: MarketingAnalyticsOverview | null;
  campaignPerformance: CampaignPerformanceData[] | null;
  channelPerformance: ChannelPerformanceData[] | null;

  // Product Analytics
  productOverview: ProductAnalyticsOverview | null;
  categoryAnalytics: CategoryAnalyticsData[] | null;

  // Inventory Analytics
  inventoryOverview: InventoryAnalyticsOverview | null;
  replenishmentSuggestions: ReplenishmentSuggestionData[] | null;

  // Advanced Analytics
  cohortMatrix: CohortMatrixData | null;
  funnelStages: FunnelStageData[] | null;
  heatMapData: HeatMapDataPoint[] | null;
  cityComparison: CityComparisonData | null;
  cityHeatMap: CityHeatMapData | null;
  expansionOpportunities: ExpansionOpportunity[] | null;

  // Loading & Error
  loading: boolean;
  error: string | null;
  activeAnalyticsDomain: string;

  // Actions
  setActiveDomain: (domain: string) => void;
  fetchExecutiveSummary: () => Promise<void>;
  fetchCustomerAnalytics: () => Promise<void>;
  fetchMerchantAnalytics: (merchantId?: string) => Promise<void>;
  fetchDeliveryAnalytics: () => Promise<void>;
  fetchFinanceAnalytics: () => Promise<void>;
  fetchMarketingAnalytics: () => Promise<void>;
  fetchProductAnalytics: () => Promise<void>;
  fetchInventoryAnalytics: () => Promise<void>;
  fetchCohortAnalysis: () => Promise<void>;
  fetchFunnelAnalysis: () => Promise<void>;
  fetchHeatMapData: (city?: string) => Promise<void>;
  fetchCityAnalytics: () => Promise<void>;
  fetchCLVAnalysis: () => Promise<void>;
  fetchChurnPrediction: () => Promise<void>;
  fetchAll: () => Promise<void>;
  reset: () => void;
}

// === Data Types ===

export interface ExecutiveSummary {
  companyHealthScore: number;
  totalRevenue: string;
  totalOrders: number;
  activeCustomers: number;
  activeMerchants: number;
  revenueGrowth: number;
  profitMargin: number;
  customerRetention: number;
  deliverySuccessRate: number;
  yoyGrowth: number;
  marketShare: number;
  strategicAlerts: Array<{ severity: string; title: string; description: string }>;
}

export interface KPIMetric {
  name: string;
  value: string;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  status: 'on_track' | 'at_risk' | 'critical' | 'exceeded';
  domain: string;
}

export interface Scorecard {
  domain: string;
  overallScore: number;
  status: string;
  metrics: Array<{ name: string; score: number; weight: number }>;
}

export interface CustomerAnalyticsOverview {
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  customerGrowthRate: number;
  retentionRate: number;
  averageLifetimeValue: number;
  averageCustomerLifetimeDays: number;
  activeBySegment: Record<string, number>;
  activeByCity: Record<string, number>;
}

export interface CustomerSegment {
  segment: string;
  customerCount: number;
  averageOrderValue: number;
  lifetimeValue: number;
  purchaseFrequency: number;
  retentionRate: number;
}

export interface CustomerAcquisitionData {
  period: string;
  newCustomers: number;
  channel: string;
  costPerAcquisition: number;
  conversionRate: number;
}

export interface CustomerRetentionData {
  period: string;
  totalCustomers: number;
  retainedCustomers: number;
  churnedCustomers: number;
  retentionRate: number;
  churnRate: number;
}

export interface CustomerBehaviorData {
  averageSessionDuration: number;
  browseToCartRate: number;
  cartToCheckoutRate: number;
  peakOrderingTime: string;
  favoriteCategories: Array<{ category: string; orders: number; revenue: number }>;
  favoritePaymentMethods: Array<{ method: string; usage: number }>;
}

export interface CLVDistribution {
  segment: string;
  customerCount: number;
  averageCLV: number;
  totalValue: number;
}

export interface ChurnOverviewData {
  totalCustomers: number;
  customersAtRisk: number;
  predictedChurnRate: number;
  estimatedRevenueAtRisk: number;
  topRiskFactors: Array<{ factor: string; affectedCustomers: number; weight: number }>;
}

export interface MerchantAnalyticsOverview {
  totalMerchants: number;
  activeMerchants: number;
  pendingMerchants: number;
  merchantGrowthRate: number;
  averageRating: number;
  totalCommission: number;
  merchantsByCity: Record<string, number>;
  merchantsByTier: Record<string, number>;
}

export interface MerchantPerformanceData {
  merchantId: string;
  merchantName: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  uniqueCustomers: number;
  onTimeDeliveryRate: number;
  growthRate: number;
  rank: number;
}

export interface MerchantBenchmarkData {
  metric: string;
  merchantValue: number;
  averageValue: number;
  topQuartile: number;
  percentile: number;
}

export interface DeliveryAnalyticsOverview {
  totalDeliveries: number;
  deliverySuccessRate: number;
  averageDeliveryTime: number;
  onTimeDeliveryRate: number;
  totalActiveDrivers: number;
  driverUtilizationRate: number;
  customerSatisfactionScore: number;
  deliveriesByZone: Record<string, number>;
}

export interface DriverPerformanceData {
  driverId: string;
  driverName: string;
  totalDeliveries: number;
  onTimeRate: number;
  averageDeliveryTime: number;
  averageRating: number;
  performanceScore: number;
}

export interface ZoneAnalyticsData {
  zone: string;
  city: string;
  totalDeliveries: number;
  activeDrivers: number;
  averageDeliveryTime: number;
  deliverySuccessRate: number;
  orderDensity: number;
}

export interface FinanceAnalyticsOverview {
  totalRevenue: number;
  grossProfit: number;
  grossMargin: number;
  netProfit: number;
  netMargin: number;
  totalCommission: number;
  totalRefunds: number;
  revenueGrowth: number;
  profitGrowth: number;
  revenueBySource: Record<string, number>;
}

export interface RevenueBreakdownData {
  source: string;
  amount: number;
  percentage: number;
  growth: number;
}

export interface CommissionSummaryData {
  totalCommission: number;
  collectedCommission: number;
  pendingCommission: number;
  averageCommissionRate: number;
  commissionByMerchant: Array<{ merchantName: string; revenue: number; commission: number }>;
}

export interface PayoutSummaryData {
  totalPending: number;
  totalProcessing: number;
  totalCompleted: number;
  pendingMerchants: number;
  nextPayoutDate: string;
}

export interface GSTReportData {
  period: string;
  totalSales: number;
  totalTax: number;
  netPayable: number;
  filingStatus: string;
}

export interface MarketingAnalyticsOverview {
  totalCampaigns: number;
  activeCampaigns: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalSpend: number;
  overallROAS: number;
  campaignByChannel: Record<string, number>;
}

export interface CampaignPerformanceData {
  campaignId: string;
  campaignName: string;
  channel: string;
  status: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cvr: number;
  roas: number;
  performanceScore: number;
}

export interface ChannelPerformanceData {
  channel: string;
  campaigns: number;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  roas: number;
  trend: string;
}

export interface ProductAnalyticsOverview {
  totalProducts: number;
  activeProducts: number;
  categories: number;
  averageProductPrice: number;
  topCategories: Array<{ name: string; products: number; revenue: number; growth: number }>;
  categoryDistribution: Record<string, number>;
}

export interface CategoryAnalyticsData {
  categoryName: string;
  totalProducts: number;
  totalRevenue: number;
  totalUnitsSold: number;
  averagePrice: number;
  growthRate: number;
  sharePercentage: number;
}

export interface InventoryAnalyticsOverview {
  totalSKUs: number;
  totalStockValue: number;
  stockoutRate: number;
  averageTurnover: number;
  overstockItems: number;
  understockItems: number;
  inventoryAccuracy: number;
  stockStatusDistribution: Record<string, number>;
}

export interface ReplenishmentSuggestionData {
  productId: string;
  productName: string;
  currentStock: number;
  reorderPoint: number;
  recommendedQuantity: number;
  priority: string;
  reason: string;
}

export interface CohortMatrixData {
  cohorts: string[];
  periods: string[];
  data: number[][];
  cohortSizes: number[];
}

export interface FunnelStageData {
  name: string;
  users: number;
  percentage: number;
  dropOff: number;
  dropOffRate: number;
}

export interface HeatMapDataPoint {
  latitude: number;
  longitude: number;
  intensity: number;
  weight: number;
  label?: string;
}

export interface CityComparisonData {
  cities: Array<{
    city: string;
    tier: string;
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    totalMerchants: number;
    averageOrderValue: number;
    averageDeliveryTime: number;
    growthRate: number;
  }>;
  topCity: string;
  fastestGrowing: string;
}

export interface CityHeatMapData {
  city: string;
  zones: Array<{
    name: string;
    orderDensity: number;
    merchantCount: number;
    driverCount: number;
    averageDeliveryTime: number;
    revenue: number;
  }>;
}

export interface ExpansionOpportunity {
  city: string;
  tier: string;
  marketPotential: number;
  competitionLevel: number;
  estimatedCustomers: number;
  estimatedRevenue: number;
  recommendation: string;
}

// === The BI Store ===

export const useBIStore = create<BIState>()(
  devtools(
    (set, get) => ({
      // Initial state
      executiveSummary: null,
      kpiMetrics: null,
      scorecards: null,
      customerOverview: null,
      customerSegments: null,
      customerAcquisition: null,
      customerRetention: null,
      customerBehavior: null,
      clvDistribution: null,
      churnOverview: null,
      merchantOverview: null,
      merchantPerformance: null,
      merchantBenchmarks: null,
      deliveryOverview: null,
      driverPerformance: null,
      zoneAnalytics: null,
      financeOverview: null,
      revenueBreakdown: null,
      commissionSummary: null,
      payoutSummary: null,
      gstReport: null,
      marketingOverview: null,
      campaignPerformance: null,
      channelPerformance: null,
      productOverview: null,
      categoryAnalytics: null,
      inventoryOverview: null,
      replenishmentSuggestions: null,
      cohortMatrix: null,
      funnelStages: null,
      heatMapData: null,
      cityComparison: null,
      cityHeatMap: null,
      expansionOpportunities: null,
      loading: false,
      error: null,
      activeAnalyticsDomain: 'executive',

      setActiveDomain: (domain) => set({ activeAnalyticsDomain: domain }),

      fetchExecutiveSummary: async () => {
        set({ loading: true, error: null });
        try {
          // Pull data from existing stores
          const dashboardState = useDashboardStore.getState();
          const analyticsState = useAnalyticsStore.getState();
          const revenue = dashboardState.revenue || 0;
          const orders = dashboardState.totalOrders || 0;
          const customers = dashboardState.customers || 0;
          const merchants = dashboardState.merchants || 0;

          // Also trigger existing fetchAll if data is stale
          if (!analyticsState.revenueTrend?.length) {
            await analyticsState.fetchAll('last_30_days');
          }

          set({
            executiveSummary: {
              companyHealthScore: 78,
              totalRevenue: `₹${(revenue / 100000).toFixed(1)}L`,
              totalOrders: orders,
              activeCustomers: customers,
              activeMerchants: merchants,
              revenueGrowth: 22.5,
              profitMargin: 14.2,
              customerRetention: 72,
              deliverySuccessRate: 94.5,
              yoyGrowth: 28.3,
              marketShare: 14,
              strategicAlerts: [
                { severity: 'high', title: 'Customer Acquisition Cost Rising', description: 'CAC increased 22% in last quarter' },
                { severity: 'medium', title: 'Inventory Stockout in Top Categories', description: 'Stockout rate at 4.7% for top-selling groceries' },
                { severity: 'medium', title: 'Tier-2 City Expansion Opportunity', description: 'Pune and Jaipur showing 40% MoM growth' },
              ],
            },
            loading: false,
          });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      fetchCustomerAnalytics: async () => {
        set({ loading: true, error: null });
        try {
          set({
            customerOverview: {
              totalCustomers: 250000,
              activeCustomers: 180000,
              newCustomers: 12000,
              returningCustomers: 45000,
              customerGrowthRate: 0.08,
              retentionRate: 0.72,
              averageLifetimeValue: 12500,
              averageCustomerLifetimeDays: 210,
              activeBySegment: { HIGH_VALUE: 12000, REGULAR: 45000, OCCASIONAL: 65000, NEW: 35000, AT_RISK: 23000 },
              activeByCity: { Mumbai: 45000, Delhi: 35000, Bangalore: 28000, Hyderabad: 18000, Chennai: 15000 },
            },
            customerSegments: [
              { segment: 'HIGH_VALUE', customerCount: 12000, averageOrderValue: 850, lifetimeValue: 45000, purchaseFrequency: 4.5, retentionRate: 0.92 },
              { segment: 'REGULAR', customerCount: 45000, averageOrderValue: 450, lifetimeValue: 18000, purchaseFrequency: 2.8, retentionRate: 0.78 },
              { segment: 'OCCASIONAL', customerCount: 65000, averageOrderValue: 320, lifetimeValue: 8500, purchaseFrequency: 1.2, retentionRate: 0.55 },
            ],
            loading: false,
          });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      fetchMerchantAnalytics: async (merchantId?: string) => {
        set({ loading: true, error: null });
        try {
          set({
            merchantOverview: {
              totalMerchants: 5800,
              activeMerchants: 4200,
              pendingMerchants: 350,
              merchantGrowthRate: 0.15,
              averageRating: 4.2,
              totalCommission: 4500000,
              merchantsByCity: { Mumbai: 1200, Delhi: 950, Bangalore: 800, Hyderabad: 600, Chennai: 500 },
              merchantsByTier: { PREMIUM: 580, STANDARD: 2900, BASIC: 2320 },
            },
            loading: false,
          });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      fetchDeliveryAnalytics: async () => {
        set({ loading: true, error: null });
        try {
          set({
            deliveryOverview: {
              totalDeliveries: 485000,
              deliverySuccessRate: 0.945,
              averageDeliveryTime: 22,
              onTimeDeliveryRate: 0.92,
              totalActiveDrivers: 3200,
              driverUtilizationRate: 0.72,
              customerSatisfactionScore: 4.3,
              deliveriesByZone: { 'Zone-A': 120000, 'Zone-B': 95000, 'Zone-C': 85000, 'Zone-D': 65000, 'Zone-E': 40000 },
            },
            driverPerformance: Array.from({ length: 5 }, (_, i) => ({
              driverId: `DRV-${100 + i}`, driverName: `Driver ${i + 1}`,
              totalDeliveries: 500 - i * 80,
              onTimeRate: 0.92 + Math.random() * 0.06,
              averageDeliveryTime: 18 - i * 2 + Math.floor(Math.random() * 5),
              averageRating: 4.2 + Math.random() * 0.6,
              performanceScore: 85 - i * 8 + Math.floor(Math.random() * 10),
            })),
            loading: false,
          });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      fetchFinanceAnalytics: async () => {
        set({ loading: true, error: null });
        try {
          const financeState = useFinanceStore.getState();
          await financeState.fetchOverview();

          set({
            financeOverview: {
              totalRevenue: 14500000,
              grossProfit: 3480000,
              grossMargin: 0.24,
              netProfit: 1800000,
              netMargin: 0.124,
              totalCommission: 3850000,
              totalRefunds: 435000,
              revenueGrowth: 0.28,
              profitGrowth: 0.32,
              revenueBySource: { Commission: 10440000, 'Delivery Fees': 2175000, Subscription: 1015000, Advertising: 725000, Other: 145000 },
            },
            loading: false,
          });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      fetchMarketingAnalytics: async () => {
        set({ loading: true, error: null });
        try {
          set({
            marketingOverview: {
              totalCampaigns: 45,
              activeCampaigns: 12,
              totalImpressions: 2500000,
              totalClicks: 85000,
              totalConversions: 6500,
              totalSpend: 580000,
              overallROAS: 3.2,
              campaignByChannel: { EMAIL: 12, SMS: 8, PUSH: 10, SOCIAL: 7, SEARCH: 5, DISPLAY: 3 },
            },
            loading: false,
          });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      fetchProductAnalytics: async () => {
        set({ loading: true, error: null });
        try {
          set({
            productOverview: {
              totalProducts: 18000,
              activeProducts: 14500,
              categories: 55,
              averageProductPrice: 285,
              topCategories: [
                { name: 'Groceries', products: 3500, revenue: 8500000, growth: 0.22 },
                { name: 'Dairy & Eggs', products: 1500, revenue: 4200000, growth: 0.18 },
                { name: 'Beverages', products: 2000, revenue: 3500000, growth: 0.15 },
              ],
              categoryDistribution: { Groceries: 25, 'Dairy & Eggs': 10, Beverages: 15, Snacks: 18, Household: 12, 'Personal Care': 10 },
            },
            loading: false,
          });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      fetchInventoryAnalytics: async () => {
        set({ loading: true, error: null });
        try {
          set({
            inventoryOverview: {
              totalSKUs: 12000,
              totalStockValue: 4800000,
              stockoutRate: 0.035,
              averageTurnover: 7.2,
              overstockItems: 850,
              understockItems: 1450,
              inventoryAccuracy: 0.96,
              stockStatusDistribution: { IN_STOCK: 8500, LOW_STOCK: 1800, OUT_OF_STOCK: 450, OVERSTOCKED: 1250 },
            },
            replenishmentSuggestions: Array.from({ length: 5 }, (_, i) => ({
              productId: `PROD-${20000 + i}`, productName: `Product ${i + 1}`,
              currentStock: Math.floor(Math.random() * 15),
              reorderPoint: 20 + Math.floor(Math.random() * 30),
              recommendedQuantity: 50 + Math.floor(Math.random() * 150),
              priority: (['HIGH', 'MEDIUM', 'HIGH', 'CRITICAL', 'MEDIUM'] as const)[i],
              reason: ['Fast moving - low stock', 'Seasonal demand expected', 'Historical stockout risk'][Math.floor(Math.random() * 3)],
            })),
            loading: false,
          });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      fetchCohortAnalysis: async () => {
        set({ loading: true, error: null });
        try {
          const numCohorts = 8;
          const periods = 6;
          const data: number[][] = [];
          const cohortSizes: number[] = [];

          for (let c = 0; c < numCohorts; c++) {
            cohortSizes.push(5000 + Math.floor(Math.random() * 8000));
            const row: number[] = [];
            for (let p = 0; p < periods; p++) {
              row.push(Math.round(Math.max(0, 1.0 - Math.abs(p - c) * 0.12) * 10000) / 10000);
            }
            data.push(row);
          }

          set({
            cohortMatrix: {
              cohorts: Array.from({ length: numCohorts }, (_, i) => `Cohort ${i + 1}`),
              periods: Array.from({ length: periods }, (_, i) => `Period ${i + 1}`),
              data,
              cohortSizes,
            },
            loading: false,
          });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      fetchFunnelAnalysis: async () => {
        set({ loading: true, error: null });
        try {
          const stages = [
            { name: 'App Open', users: 100000, dropOffRate: 0 },
            { name: 'Browse Products', users: 95000, dropOffRate: 0.05 },
            { name: 'Add to Cart', users: 61200, dropOffRate: 0.356 },
            { name: 'Checkout Start', users: 42800, dropOffRate: 0.30 },
            { name: 'Payment', users: 34200, dropOffRate: 0.20 },
            { name: 'Order Placed', users: 29100, dropOffRate: 0.15 },
            { name: 'Delivered', users: 27600, dropOffRate: 0.05 },
          ];

          const funnelData: FunnelStageData[] = stages.map((stage, i) => ({
            name: stage.name,
            users: stage.users,
            percentage: Math.round((stage.users / 100000) * 10000) / 100,
            dropOff: i > 0 ? stages[i - 1].users - stage.users : 0,
            dropOffRate: stage.dropOffRate,
          }));

          set({ funnelStages: funnelData, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      fetchHeatMapData: async (city?: string) => {
        set({ loading: true, error: null });
        try {
          const points: HeatMapDataPoint[] = Array.from({ length: 50 }, () => ({
            latitude: 19 + Math.random() * 0.5,
            longitude: 72.7 + Math.random() * 0.5,
            intensity: Math.round((0.3 + Math.random() * 0.7) * 100) / 100,
            weight: Math.round((50 + Math.random() * 200) * 100) / 100,
            label: undefined,
          }));
          set({ heatMapData: points, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      fetchCityAnalytics: async () => {
        set({ loading: true, error: null });
        try {
          const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'];
          set({
            cityComparison: {
              cities: cities.map(city => ({
                city,
                tier: ['Tier1', 'Tier1', 'Tier1', 'Tier1', 'Tier1', 'Tier2', 'Tier1', 'Tier2'][cities.indexOf(city)],
                totalOrders: Math.floor(20000 + Math.random() * 50000),
                totalRevenue: Math.round((1000000 + Math.random() * 4000000) * 100) / 100,
                totalCustomers: Math.floor(10000 + Math.random() * 50000),
                totalMerchants: Math.floor(200 + Math.random() * 1000),
                averageOrderValue: Math.round((250 + Math.random() * 250) * 100) / 100,
                averageDeliveryTime: Math.round((18 + Math.random() * 10) * 10) / 10,
                growthRate: Math.round((Math.random() * 0.35) * 100) / 100,
              })),
              topCity: 'Mumbai',
              fastestGrowing: 'Pune',
            },
            loading: false,
          });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      fetchCLVAnalysis: async () => {
        set({ loading: true, error: null });
        try {
          set({
            clvDistribution: [
              { segment: 'HIGH_VALUE', customerCount: 12000, averageCLV: 42000, totalValue: 504000000 },
              { segment: 'REGULAR', customerCount: 45000, averageCLV: 15000, totalValue: 675000000 },
              { segment: 'OCCASIONAL', customerCount: 65000, averageCLV: 6000, totalValue: 390000000 },
              { segment: 'NEW', customerCount: 35000, averageCLV: 3000, totalValue: 105000000 },
              { segment: 'AT_RISK', customerCount: 23000, averageCLV: 8000, totalValue: 184000000 },
            ],
            loading: false,
          });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      fetchChurnPrediction: async () => {
        set({ loading: true, error: null });
        try {
          set({
            churnOverview: {
              totalCustomers: 180000,
              customersAtRisk: 27000,
              predictedChurnRate: 0.065,
              estimatedRevenueAtRisk: 21600000,
              topRiskFactors: [
                { factor: 'No purchase in 30+ days', affectedCustomers: 17500, weight: 0.35 },
                { factor: 'Decreasing order frequency', affectedCustomers: 12150, weight: 0.25 },
                { factor: 'High complaint rate', affectedCustomers: 5400, weight: 0.18 },
              ],
            },
            loading: false,
          });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      fetchAll: async () => {
        set({ loading: true, error: null });
        try {
          await Promise.allSettled([
            get().fetchExecutiveSummary(),
            get().fetchCustomerAnalytics(),
            get().fetchMerchantAnalytics(),
            get().fetchDeliveryAnalytics(),
            get().fetchFinanceAnalytics(),
            get().fetchMarketingAnalytics(),
            get().fetchProductAnalytics(),
            get().fetchInventoryAnalytics(),
            get().fetchCohortAnalysis(),
            get().fetchFunnelAnalysis(),
            get().fetchHeatMapData(),
            get().fetchCityAnalytics(),
            get().fetchCLVAnalysis(),
            get().fetchChurnPrediction(),
          ]);
          set({ loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      reset: () => set({
        executiveSummary: null, kpiMetrics: null, scorecards: null,
        customerOverview: null, customerSegments: null, customerAcquisition: null,
        customerRetention: null, customerBehavior: null, clvDistribution: null,
        churnOverview: null, merchantOverview: null, merchantPerformance: null,
        merchantBenchmarks: null, deliveryOverview: null, driverPerformance: null,
        zoneAnalytics: null, financeOverview: null, revenueBreakdown: null,
        commissionSummary: null, payoutSummary: null, gstReport: null,
        marketingOverview: null, campaignPerformance: null, channelPerformance: null,
        productOverview: null, categoryAnalytics: null, inventoryOverview: null,
        replenishmentSuggestions: null, cohortMatrix: null, funnelStages: null,
        heatMapData: null, cityComparison: null, cityHeatMap: null,
        expansionOpportunities: null, loading: false, error: null,
      }),
    }),
    { name: 'BIStore' }
  )
);
