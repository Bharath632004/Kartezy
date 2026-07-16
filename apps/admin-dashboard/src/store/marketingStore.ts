import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { marketingService } from '@/lib/api';

export type Campaign = {
  id: string;
  name: string;
  description: string;
  type: 'email' | 'sms' | 'push' | 'social' | 'search' | 'display';
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
  startDate: string;
  endDate?: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  targetAudience: {
    ageRange?: string;
    gender?: string[];
    location?: string[];
    interests?: string[];
    behaviors?: string[];
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type Promotion = {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'free_shipping' | 'buy_x_get_y';
  value: number;
  minimumPurchase: number;
  maximumDiscount: number;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  applicableTo: 'all' | 'specific_products' | 'specific_categories' | 'specific_brands';
  productIds?: string[];
  categoryIds?: string[];
  brandIds?: string[];
  usageLimitPerUser: number;
  status: 'active' | 'inactive' | 'expired';
  createdAt: string;
  updatedAt: string;
};

export type Coupon = {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'free_shipping';
  value: number;
  minimumPurchase: number;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  applicableTo: 'all' | 'specific_products' | 'specific_categories';
  productIds?: string[];
  categoryIds?: string[];
  usageLimitPerUser: number;
  status: 'active' | 'inactive' | 'expired';
  createdAt: string;
  updatedAt: string;
};

export type MarketingStats = {
  totalCampaigns: number;
  activeCampaigns: number;
  totalLeads: number;
  totalConversions: number;
  conversionRate: number;
  costPerLead: number;
  costPerAcquisition: number;
  returnOnAdSpend: number;
  emailOpenRate: number;
  emailClickThroughRate: number;
  smsDeliveryRate: number;
  pushOpenRate: number;
};

export type MarketingState = {
  campaigns: Campaign[];
  promotions: Promotion[];
  coupons: Coupon[];
  stats: MarketingStats | null;
  loading: boolean;
  error: string | null;
  setCampaigns: (campaigns: Campaign[]) => void;
  setPromotions: (promotions: Promotion[]) => void;
  setCoupons: (coupons: Coupon[]) => void;
  setStats: (stats: MarketingStats) => void;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, campaign: Partial<Campaign>) => void;
  removeCampaign: (id: string) => void;
  addPromotion: (promotion: Promotion) => void;
  updatePromotion: (id: string, promotion: Partial<Promotion>) => void;
  removePromotion: (id: string) => void;
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (id: string, coupon: Partial<Coupon>) => void;
  removeCoupon: (id: string) => void;
  fetchCampaigns: (filters?: any) => Promise<void>;
  fetchCampaignDetail: (id: string) => Promise<Campaign | null>;
  createCampaign: (data: any) => Promise<void>;
  updateCampaignAPI: (id: string, data: any) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  getCampaignPerformance: (id: string) => Promise<any>;
  fetchPromotions: (filters?: any) => Promise<void>;
  createPromotion: (data: any) => Promise<void>;
  updatePromotionAPI: (id: string, data: any) => Promise<void>;
  deletePromotion: (id: string) => Promise<void>;
  fetchCoupons: (filters?: any) => Promise<void>;
  createCoupon: (data: any) => Promise<void>;
  updateCouponAPI: (id: string, data: any) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  getMarketingOverview: () => Promise<void>;
  getCustomerAcquisitionCost: () => Promise<void>;
  getLtv: () => Promise<void>;
  reset: () => void;
};

export const useMarketingStore = create<MarketingState>()(
  devtools(
    (set, get) => ({
      campaigns: [],
      promotions: [],
      coupons: [],
      stats: null,
      loading: false,
      error: null,
      setCampaigns: (campaigns) => set({ campaigns }),
      setPromotions: (promotions) => set({ promotions }),
      setCoupons: (coupons) => set({ coupons }),
      setStats: (stats) => set({ stats }),
      addCampaign: (campaign) =>
        set((state) => ({ campaigns: [...state.campaigns, campaign] })),
      updateCampaign: (id, campaign) =>
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === id ? { ...c, ...campaign } : c
          ),
        })),
      removeCampaign: (id) =>
        set((state) => ({
          campaigns: state.campaigns.filter((c) => c.id !== id),
        })),
      addPromotion: (promotion) =>
        set((state) => ({ promotions: [...state.promotions, promotion] })),
      updatePromotion: (id, promotion) =>
        set((state) => ({
          promotions: state.promotions.map((p) =>
            p.id === id ? { ...p, ...promotion } : p
          ),
        })),
      removePromotion: (id) =>
        set((state) => ({
          promotions: state.promotions.filter((p) => p.id !== id),
        })),
      addCoupon: (coupon) =>
        set((state) => ({ coupons: [...state.coupons, coupon] })),
      updateCoupon: (id, coupon) =>
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.id === id ? { ...c, ...coupon } : c
          ),
        })),
      removeCoupon: (id) =>
        set((state) => ({
          coupons: state.coupons.filter((c) => c.id !== id),
        })),
      fetchCampaigns: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
          const response = await marketingService.getCampaigns(filters);
          set({ campaigns: response.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      fetchCampaignDetail: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await marketingService.getCampaigns({ id });
          set({ loading: false });
          const data = Array.isArray(response.data) ? response.data[0] : response.data;
          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      createCampaign: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await marketingService.createCampaign(data);
          get().addCampaign(response.data);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      updateCampaignAPI: async (id, data) => {
        set({ loading: true, error: null });
        try {
          await marketingService.updateCampaign(id, data);
          get().updateCampaign(id, data);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      deleteCampaign: async (id) => {
        set({ loading: true, error: null });
        try {
          await marketingService.deleteCampaign(id);
          get().removeCampaign(id);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getCampaignPerformance: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await marketingService.getCampaignPerformance(id);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      fetchPromotions: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
          const response = await marketingService.getPromotions(filters);
          set({ promotions: response.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      createPromotion: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await marketingService.createPromotion(data);
          get().addPromotion(response.data);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      updatePromotionAPI: async (id, data) => {
        set({ loading: true, error: null });
        try {
          await marketingService.updatePromotion(id, data);
          get().updatePromotion(id, data);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      deletePromotion: async (id) => {
        set({ loading: true, error: null });
        try {
          await marketingService.deletePromotion(id);
          get().removePromotion(id);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      fetchCoupons: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
          const response = await marketingService.getCoupons(filters);
          set({ coupons: response.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      createCoupon: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await marketingService.createCoupon(data);
          get().addCoupon(response.data);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      updateCouponAPI: async (id, data) => {
        set({ loading: true, error: null });
        try {
          await marketingService.updateCoupon(id, data);
          get().updateCoupon(id, data);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      deleteCoupon: async (id) => {
        set({ loading: true, error: null });
        try {
          await marketingService.deleteCoupon(id);
          get().removeCoupon(id);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getMarketingOverview: async () => {
        set({ loading: true, error: null });
        try {
          const response = await marketingService.getMarketingOverview();
          set({ stats: response.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getCustomerAcquisitionCost: async () => {
        set({ loading: true, error: null });
        try {
          const response = await marketingService.getCustomerAcquisitionCost();
          // This would typically update CAC metric
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getLtv: async () => {
        set({ loading: true, error: null });
        try {
          const response = await marketingService.getLtv();
          // This would typically update LTV metric
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      reset: () => {
        set({
          campaigns: [],
          promotions: [],
          coupons: [],
          stats: null,
          loading: false,
          error: null,
        });
      },
    }),
    { name: 'MarketingStore' }
  )
);