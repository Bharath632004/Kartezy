import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  financeService,
  userService,
  merchantService,
  deliveryService,
  productService,
  categoryService,
  inventoryService,
  marketingService,
  orderService,
  supportService,
} from '@/lib/api';

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
          const [
            financeRes,
            totalOrdersRes,
            activeOrdersRes,
            customersRes,
            merchantsRes,
            deliveryRes,
            productsRes,
            categoriesRes,
            inventoryRes,
            refundsRes,
            supportRes,
            promotionsRes,
            todaySalesRes,
            monthlyRevenueRes,
          ] = await Promise.allSettled([
            financeService.getRevenueOverview(),
            orderService.getList({ limit: 1 }), // total orders
            orderService.getList({ limit: 0, status: 'active' }), // active orders
            userService.getList({ limit: 1 }),
            merchantService.getList({ limit: 1 }),
            deliveryService.getList({ limit: 1 }),
            productService.getList({ limit: 1 }),
            categoryService.getList({ limit: 1 }),
            inventoryService.getAlerts(),
            financeService.getRefunds({ limit: 1 }),
            supportService.getTickets({ limit: 1 }),
            marketingService.getPromotions({ limit: 1 }),
            financeService.getRevenueByPeriod('today'),
            financeService.getRevenueByPeriod('month'),
          ]);

          const getData = (res: PromiseSettledResult<unknown>) =>
            res.status === 'fulfilled' ? res.data : null;

          const financeData = getData(financeRes);
          const totalOrdersData = getData(totalOrdersRes);
          const activeOrdersData = getData(activeOrdersRes);
          const customersData = getData(customersRes);
          const merchantsData = getData(merchantsRes);
          const deliveryData = getData(deliveryRes);
          const productsData = getData(productsRes);
          const categoriesData = getData(categoriesRes);
          const inventoryData = getData(inventoryRes);
          const refundsData = getData(refundsRes);
          const supportData = getData(supportRes);
          const promotionsData = getData(promotionsRes);
          const todaySalesData = getData(todaySalesRes);
          const monthlyRevenueData = getData(monthlyRevenueRes);

          set({
            gmv: financeData?.gmv ?? financeData?.totalGmv ?? null,
            revenue: financeData?.revenue ?? financeData?.totalRevenue ?? null,
            totalOrders:
              totalOrdersData?.total ?? totalOrdersData?.data?.length ?? 0,
            activeOrders:
              activeOrdersData?.total ?? activeOrdersData?.data?.length ?? 0,
            customers:
              customersData?.total ?? customersData?.data?.length ?? 0,
            merchants:
              merchantsData?.total ?? merchantsData?.data?.length ?? 0,
            deliveryPartners:
              deliveryData?.total ?? deliveryData?.data?.length ?? 0,
            products:
              productsData?.total ?? productsData?.data?.length ?? 0,
            categories:
              categoriesData?.total ?? categoriesData?.data?.length ?? 0,
            inventoryAlerts:
              Array.isArray(inventoryData?.data)
                ? inventoryData.data.length
                : 0,
            refundRequests:
              refundsData?.total ?? refundsData?.data?.length ?? 0,
            supportTickets:
              supportData?.total ?? supportData?.data?.length ?? 0,
            activePromotions:
              promotionsData?.total ?? promotionsData?.data?.length ?? 0,
            todaySales: todaySalesData?.totalSales ?? todaySalesData?.amount ?? 0,
            monthlyRevenue:
              monthlyRevenueData?.totalRevenue ??
              monthlyRevenueData?.amount ??
              0,
            loading: false,
          });
        } catch (error) {
          console.error('Error fetching dashboard stats:', error);
          set({ loading: false });
          get().reset();
        }
      },
    }),
    { name: 'DashboardStore' }
  )
);