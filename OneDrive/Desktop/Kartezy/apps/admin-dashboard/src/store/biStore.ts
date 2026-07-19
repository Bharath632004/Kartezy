import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { biService } from '@/lib/biService';

export type BiState = {
  // Executive Dashboard
  executiveDashboard: any | null;
  // Customer Analytics
  customerAnalytics: any | null;
  cohortData: any[];
  funnelData: any | null;
  clvData: any | null;
  churnData: any | null;
  // Merchant Analytics
  merchantAnalytics: any | null;
  // Delivery Analytics
  deliveryAnalytics: any | null;
  // Product Analytics
  productAnalytics: any | null;
  // Inventory Analytics
  inventoryAnalytics: any | null;
  // Marketing Analytics
  marketingAnalytics: any | null;
  // City Analytics
  cityAnalytics: any | null;
  // Heatmap Data
  heatmapData: any | null;
  // Date Range
  dateRange: { start: string; end: string; preset: string };
  loading: boolean;
  error: string | null;
};

export type BiActions = {
  fetchExecutiveDashboard: () => Promise<void>;
  fetchCustomerAnalytics: () => Promise<void>;
  fetchCohortAnalysis: (cohortType?: string) => Promise<void>;
  fetchFunnelAnalysis: () => Promise<void>;
  fetchCLV: () => Promise<void>;
  fetchChurnPrediction: () => Promise<void>;
  fetchMerchantAnalytics: () => Promise<void>;
  fetchDeliveryAnalytics: () => Promise<void>;
  fetchProductAnalytics: () => Promise<void>;
  fetchInventoryAnalytics: () => Promise<void>;
  fetchMarketingAnalytics: () => Promise<void>;
  fetchCityAnalytics: () => Promise<void>;
  fetchHeatmapData: (days?: number) => Promise<void>;
  setDateRange: (preset: string) => void;
  reset: () => void;
  fetchAll: () => Promise<void>;
};

const getDateRange = (preset: string) => {
  const now = new Date();
  const end = now.toISOString().split('T')[0];
  let start: string;
  switch (preset) {
    case 'today': start = end; break;
    case 'week': start = new Date(now.getTime() - 7 * 86400000).toISOString().split('T')[0]; break;
    case 'month': start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]; break;
    case 'quarter': start = new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString().split('T')[0]; break;
    case 'year': start = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0]; break;
    default: start = new Date(now.getTime() - 30 * 86400000).toISOString().split('T')[0];
  }
  return { start, end, preset };
};

export const useBiStore = create<BiState & BiActions>()(
  devtools((set, get) => ({
    executiveDashboard: null,
    customerAnalytics: null,
    cohortData: [],
    funnelData: null,
    clvData: null,
    churnData: null,
    merchantAnalytics: null,
    deliveryAnalytics: null,
    productAnalytics: null,
    inventoryAnalytics: null,
    marketingAnalytics: null,
    cityAnalytics: null,
    heatmapData: null,
    dateRange: getDateRange('month'),
    loading: false,
    error: null,

    setDateRange: (preset) => set({ dateRange: getDateRange(preset) }),

    fetchExecutiveDashboard: async () => {
      try {
        const res = await biService.getExecutiveDashboard(get().dateRange.start, get().dateRange.end);
        set({ executiveDashboard: res.data });
      } catch (e: any) { set({ error: e.message }); }
    },

    fetchCustomerAnalytics: async () => {
      try {
        const res = await biService.getCustomerAnalytics(get().dateRange.start, get().dateRange.end);
        set({ customerAnalytics: res.data });
      } catch (e: any) { set({ error: e.message }); }
    },

    fetchCohortAnalysis: async (cohortType) => {
      try {
        const res = await biService.getCohortAnalysis(cohortType || 'monthly');
        set({ cohortData: res.data });
      } catch (e: any) { set({ error: e.message }); }
    },

    fetchFunnelAnalysis: async () => {
      try {
        const res = await biService.getFunnelAnalysis();
        set({ funnelData: res.data });
      } catch (e: any) { set({ error: e.message }); }
    },

    fetchCLV: async () => {
      try {
        const res = await biService.getCLV();
        set({ clvData: res.data });
      } catch (e: any) { set({ error: e.message }); }
    },

    fetchChurnPrediction: async () => {
      try {
        const res = await biService.getChurnPrediction();
        set({ churnData: res.data });
      } catch (e: any) { set({ error: e.message }); }
    },

    fetchMerchantAnalytics: async () => {
      try {
        const res = await biService.getMerchantAnalytics(get().dateRange.start, get().dateRange.end);
        set({ merchantAnalytics: res.data });
      } catch (e: any) { set({ error: e.message }); }
    },

    fetchDeliveryAnalytics: async () => {
      try {
        const res = await biService.getDeliveryAnalytics(get().dateRange.start, get().dateRange.end);
        set({ deliveryAnalytics: res.data });
      } catch (e: any) { set({ error: e.message }); }
    },

    fetchProductAnalytics: async () => {
      try {
        const res = await biService.getProductAnalytics(get().dateRange.start, get().dateRange.end);
        set({ productAnalytics: res.data });
      } catch (e: any) { set({ error: e.message }); }
    },

    fetchInventoryAnalytics: async () => {
      try {
        const res = await biService.getInventoryAnalytics();
        set({ inventoryAnalytics: res.data });
      } catch (e: any) { set({ error: e.message }); }
    },

    fetchMarketingAnalytics: async () => {
      try {
        const res = await biService.getMarketingAnalytics();
        set({ marketingAnalytics: res.data });
      } catch (e: any) { set({ error: e.message }); }
    },

    fetchCityAnalytics: async () => {
      try {
        const res = await biService.getCityAnalytics();
        set({ cityAnalytics: res.data });
      } catch (e: any) { set({ error: e.message }); }
    },

    fetchHeatmapData: async (days) => {
      try {
        const res = await biService.getHeatmapData(days || 7);
        set({ heatmapData: res.data });
      } catch (e: any) { set({ error: e.message }); }
    },

    fetchAll: async () => {
      set({ loading: true, error: null });
      try {
        await Promise.allSettled([
          get().fetchExecutiveDashboard(), get().fetchCustomerAnalytics(),
          get().fetchCohortAnalysis(), get().fetchFunnelAnalysis(),
          get().fetchCLV(), get().fetchChurnPrediction(),
          get().fetchMerchantAnalytics(), get().fetchDeliveryAnalytics(),
          get().fetchProductAnalytics(), get().fetchInventoryAnalytics(),
          get().fetchMarketingAnalytics(), get().fetchCityAnalytics(),
          get().fetchHeatmapData(),
        ]);
      } finally { set({ loading: false }); }
    },

    reset: () => set({
      executiveDashboard: null, customerAnalytics: null, cohortData: [],
      funnelData: null, clvData: null, churnData: null, merchantAnalytics: null,
      deliveryAnalytics: null, productAnalytics: null, inventoryAnalytics: null,
      marketingAnalytics: null, cityAnalytics: null, heatmapData: null,
      dateRange: getDateRange('month'), loading: false, error: null,
    }),
  }), { name: 'BiStore' })
);
