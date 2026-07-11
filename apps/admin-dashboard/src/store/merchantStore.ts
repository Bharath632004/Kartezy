import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { merchantService } from '@/lib/api';

export type Merchant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended' | 'inactive';
  storeName: string;
  storeDescription?: string;
  commissionRate: number;
  createdAt: string;
  updatedAt: string;
  kycStatus?: 'pending' | 'approved' | 'rejected';
  isVerified: boolean;
  totalSales: number;
  totalOrders: number;
  rating: number;
};

type MerchantState = {
  merchants: Merchant[];
  loading: boolean;
  error: string | null;
  setMerchants: (merchants: Merchant[]) => void;
  addMerchant: (merchant: Merchant) => void;
  updateMerchant: (id: string, merchant: Partial<Merchant>) => void;
  removeMerchant: (id: string) => void;
  fetchMerchants: (params?: any) => Promise<void>;
  fetchMerchantDetail: (id: string) => Promise<Merchant | null>;
  approveMerchant: (id: string) => Promise<void>;
  rejectMerchant: (id: string) => Promise<void>;
  suspendMerchant: (id: string) => Promise<void>;
  activateMerchant: (id: string) => Promise<void>;
  getKYC: (id: string) => Promise<any>;
  getDocuments: (id: string) => Promise<any>;
  getStoreDetails: (id: string) => Promise<any>;
  getRatings: (id: string) => Promise<any>;
  getRevenue: (id: string) => Promise<any>;
  getCommission: (id: string) => Promise<any>;
  reset: () => void;
};

export const useMerchantStore = create<MerchantState>()(
  devtools(
    (set, get) => ({
      merchants: [],
      loading: false,
      error: null,
      setMerchants: (merchants) => set({ merchants }),
      addMerchant: (merchant) => set((state) => ({ merchants: [...state.merchants, merchant] })),
      updateMerchant: (id, merchant) =>
        set((state) => ({
          merchants: state.merchants.map((m) => (m.id === id ? { ...m, ...merchant } : m)),
        })),
      removeMerchant: (id) =>
        set((state) => ({ merchants: state.merchants.filter((m) => m.id !== id) })),
      fetchMerchants: async (params = {}) => {
        set({ loading: true, error: null });
        try {
          const response = await merchantService.getList(params);
          set({ merchants: response.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      fetchMerchantDetail: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await merchantService.getDetail(id);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      approveMerchant: async (id) => {
        set({ loading: true, error: null });
        try {
          await merchantService.approve(id);
          get().updateMerchant(id, { status: 'approved' });
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      rejectMerchant: async (id) => {
        set({ loading: true, error: null });
        try {
          await merchantService.reject(id);
          get().updateMerchant(id, { status: 'rejected' });
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      suspendMerchant: async (id) => {
        set({ loading: true, error: null });
        try {
          await merchantService.suspend(id);
          get().updateMerchant(id, { status: 'suspended' });
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      activateMerchant: async (id) => {
        set({ loading: true, error: null });
        try {
          await merchantService.activate(id);
          get().updateMerchant(id, { status: 'approved' });
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getKYC: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await merchantService.getKYC(id);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getDocuments: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await merchantService.getDocuments(id);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getStoreDetails: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await merchantService.getStoreDetails(id);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getRatings: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await merchantService.getRatings(id);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getRevenue: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await merchantService.getRevenue(id);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getCommission: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await merchantService.getCommission(id);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      reset: () => {
        set({
          merchants: [],
          loading: false,
          error: null,
        });
      },
    }),
    { name: 'MerchantStore' }
  )
);