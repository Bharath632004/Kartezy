import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { analyticsService } from '@/lib/api';

type DashboardState = {
  gmv: number | null;
  revenue: number | null;
  totalOrders: number | null;
  activeOrders: number | null;
  customers: number | null;
  merchants: number | null;
  deliveryPartners: number | null;
  products: number | null;
  categories: number | null;
  inventoryAlerts: number | null;
  refundRequests: number | null;
  supportTickets: number | null;
  walletBalance: number | null;
  activePromotions: number | null;
  todaySales: number | null;
  monthlyRevenue: number | null;
  loading: boolean;
  setStats: (stats: Partial<DashboardState>) => void;
  reset: () => void;
  fetchStats: () => Promise<void>;
};

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set, get) => ({
      gmv: null,
      revenue: null,
      totalOrders: null,
      activeOrders: null,
      customers: null,
      merchants: null,
      deliveryPartners: null,
      products: null,
      categories: null,
      inventoryAlerts: null,
      refundRequests: null,
      supportTickets: null,
      walletBalance: null,
      activePromotions: null,
      todaySales: null,
      monthlyRevenue: null,
      loading: false,
      setStats: (stats) => set((state) => ({ ...state, ...stats })),
      reset: () =>
        set({
          gmv: null,
          revenue: null,
          totalOrders: null,
          activeOrders: null,
          customers: null,
          merchants: null,
          deliveryPartners: null,
          products: null,
          categories: null,
          inventoryAlerts: null,
          refundRequests: null,
          supportTickets: null,
          walletBalance: null,
          activePromotions: null,
          todaySales: null,
          monthlyRevenue: null,
          loading: false,
        }),
      fetchStats: async () => {
        set({ loading: true });
        try {
          const response = await analyticsService.getDashboardStats();
          set({ ...response.data, loading: false });
        } catch (error) {
          set({ loading: false });
          console.error('Failed to fetch dashboard stats', error);
          // Optionally, we can reset or set to null on error
          get().reset();
        }
      },
    }),
    { name: 'DashboardStore' }
  )
);