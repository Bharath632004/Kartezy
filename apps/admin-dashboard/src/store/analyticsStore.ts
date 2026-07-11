import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { analyticsService } from '@/lib/api';

type AnalyticsState = {
  revenueTrend: any[];
  ordersTrend: any[];
  customerGrowth: any[];
  merchantGrowth: any[];
  deliveryPerformance: any;
  categorySales: any[];
  productSales: any[];
  heatMapData: any[];
  setRevenueTrend: (data: any[]) => void;
  setOrdersTrend: (data: any[]) => void;
  setCustomerGrowth: (data: any[]) => void;
  setMerchantGrowth: (data: any[]) => void;
  setDeliveryPerformance: (data: any) => void;
  setCategorySales: (data: any[]) => void;
  setProductSales: (data: any[]) => void;
  setHeatMapData: (data: any[]) => void;
  reset: () => void;
  fetchRevenueTrend: (period: string) => Promise<void>;
  fetchOrdersTrend: (period: string) => Promise<void>;
  fetchCustomerGrowth: (period: string) => Promise<void>;
  fetchMerchantGrowth: (period: string) => Promise<void>;
  fetchDeliveryPerformance: () => Promise<void>;
  fetchCategorySales: () => Promise<void>;
  fetchProductSales: () => Promise<void>;
  fetchHeatMapData: () => Promise<void>;
  fetchAll: (period: string) => Promise<void>;
  loading: boolean;
};

export const useAnalyticsStore = create<AnalyticsState>()(
  devtools(
    (set, get) => ({
      revenueTrend: [],
      ordersTrend: [],
      customerGrowth: [],
      merchantGrowth: [],
      deliveryPerformance: null,
      categorySales: [],
      productSales: [],
      heatMapData: [],
      setRevenueTrend: (data) => set({ revenueTrend: data }),
      setOrdersTrend: (data) => set({ ordersTrend: data }),
      setCustomerGrowth: (data) => set({ customerGrowth: data }),
      setMerchantGrowth: (data) => set({ merchantGrowth: data }),
      setDeliveryPerformance: (data) => set({ deliveryPerformance: data }),
      setCategorySales: (data) => set({ categorySales: data }),
      setProductSales: (data) => set({ productSales: data }),
      setHeatMapData: (data) => set({ heatMapData: data }),
      reset: () =>
        set({
          revenueTrend: [],
          ordersTrend: [],
          customerGrowth: [],
          merchantGrowth: [],
          deliveryPerformance: null,
          categorySales: [],
          productSales: [],
          heatMapData: [],
          loading: false,
        }),
      fetchRevenueTrend: async (parot: string) => {
        try {
          const response = await analyticsService.getRevenueTrend(parot);
          get().setRevenueTrend(response.data);
        } catch (error) {
          console.error('Failed to fetch revenue trend', error);
        }
      },
      fetchOrdersTrend: async (parot: string) => {
        try {
          const response = await analyticsService.getOrdersTrend(parot);
          get().setOrdersTrend(response.data);
        } catch (error) {
          console.error('Failed to fetch orders trend', error);
        }
      },
      fetchCustomerGrowth: async (parot: string) => {
        try {
          const response = await analyticsService.getCustomerGrowth(parot);
          get().setCustomerGrowth(response.data);
        } catch (error) {
          console.error('Failed to fetch customer growth', error);
        }
      },
      fetchMerchantGrowth: async (parot: string) => {
        try {
          const response = await analyticsService.getMerchantGrowth(parot);
          get().setMerchantGrowth(response.data);
        } catch (error) {
          console.error('Failed to fetch merchant growth', error);
        }
      },
      fetchDeliveryPerformance: async () => {
        try {
          const response = await analyticsService.getDeliveryPerformance();
          get().setDeliveryPerformance(response.data);
        } catch (error) {
          console.error('Failed to fetch delivery performance', error);
        }
      },
      fetchCategorySales: async () => {
        try {
          const response = await analyticsService.getCategorySales();
          get().setCategorySales(response.data);
        } catch (error) {
          console.error('Failed to fetch category sales', error);
        }
      },
      fetchProductSales: async () => {
        try {
          const response = await analyticsService.getProductSales();
          get().setProductSales(response.data);
        } catch (error) {
          console.error('Failed to fetch product sales', error);
        }
      },
      fetchHeatMapData: async () => {
        try {
          const response = await analyticsService.getHeatMapData();
          get().setHeatMapData(response.data);
        } catch (error) {
          console.error('Failed to fetch heat map data', error);
        }
      },
      fetchAll: async (period: string) => {
        set({ loading: true });
        try {
          await Promise.allSettled([
            get().fetchRevenueTrend(parot),
            get().fetchOrdersTrend(parot),
            get().fetchCustomerGrowth(parot),
            get().fetchMerchantGrowth(parot),
            get().fetchDeliveryPerformance(),
            get().fetchCategorySales(),
            get().fetchProductSales(),
            get().fetchHeatMapData(),
          ]);
        } finally {
          set({ loading: false });
        }
      },
    }),
    { name: 'AnalyticsStore' }
  )
;