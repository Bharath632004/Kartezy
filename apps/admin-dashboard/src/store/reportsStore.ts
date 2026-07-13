import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { reportsService } from '@/lib/api';

export type ReportFilters = {
  dateRange?: string;
  startDate?: string;
  endDate?: string;
  merchantId?: string;
  productId?: string;
  categoryId?: string;
  userId?: string;
  status?: string;
  [key: string]: any;
};

export type ReportData = {
  id: string;
  title: string;
  type: string;
  generatedAt: string;
  data: any;
  format: 'pdf' | 'excel' | 'csv' | 'json';
  fileUrl?: string;
  size?: number;
};

export type SalesReport = {
  period: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    unitsSold: number;
    revenue: number;
  }>;
  topCategories: Array<{
    categoryId: string;
    categoryName: string;
    revenue: number;
    unitsSold: number;
  }>;
  topMerchants: Array<{
    merchantId: string;
    merchantName: string;
    revenue: number;
    orderCount: number;
  }>;
  salesByChannel: Array<{
    channel: string;
    revenue: number;
    percentage: number;
  }>;
  salesByPaymentMethod: Array<{
    method: string;
    revenue: number;
    percentage: number;
  }>;
  dailySales: Array<{
    date: string;
    sales: number;
    orders: number;
    customers: number;
  }>;
};

export type FinancialReport = {
  period: string;
  revenue: number;
  refunds: number;
  netRevenue: number;
  taxes: number;
  fees: number;
  profit: number;
  margin: number;
  cashFlow: number;
  revenueBreakdown: Array<{
    source: string;
    amount: number;
    percentage: number;
  }>;
  expenseBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
};

export type ReportState = {
  reports: ReportData[];
  salesReport: SalesReport | null;
  financialReport: FinancialReport | null;
  loading: boolean;
  error: string | null;
  setReports: (reports: ReportData[]) => void;
  addReport: (report: ReportData) => void;
  updateReport: (id: string, report: Partial<ReportData>) => void;
  removeReport: (id: string) => void;
  setSalesReport: (report: SalesReport) => void;
  setFinancialReport: (report: FinancialReport) => void;
  fetchReports: (type?: string, limit?: number) => Promise<void>;
  getSalesSummary: (filters: ReportFilters) => Promise<void>;
  getSalesByProduct: (filters: ReportFilters) => Promise<void>;
  getSalesByCategory: (filters: ReportFilters) => Promise<void>;
  getSalesByMerchant: (filters: ReportFilters) => Promise<void>;
  getTransactionReport: (filters: ReportFilters) => Promise<void>;
  getUserGrowthReport: (filters: ReportFilters) => Promise<void>;
  getUserActivityReport: (filters: ReportFilters) => Promise<void>;
  getFinancialSummary: (filters: ReportFilters) => Promise<void>;
  getProfitLoss: (filters: ReportFilters) => Promise<void>;
  exportSalesReport: (format: string, filters: ReportFilters) => Promise<string>;
  exportFinancialReport: (format: string, filters: ReportFilters) => Promise<string>;
  generateReport: (type: string, filters: ReportFilters, format: string) => Promise<void>;
  scheduleReport: (type: string, filters: ReportFilters, format: string, frequency: string, recipients: string[]) => Promise<void>;
  getReportHistory: (type?: string) => Promise<void>;
  reset: () => void;
};

export const useReportsStore = create<ReportState>()(
  devtools(
    (set, get) => ({
      reports: [],
      salesReport: null,
      financialReport: null,
      loading: false,
      error: null,
      setReports: (reports) => set({ reports }),
      addReport: (report) =>
        set((state) => ({ reports: [...state.reports, report] })),
      updateReport: (id, report) =>
        set((state) => ({
          reports: state.reports.map((r) =>
            r.id === id ? { ...r, ...report } : r
          ),
        })),
      removeReport: (id) =>
        set((state) => ({
          reports: state.reports.filter((r) => r.id !== id),
        })),
      setSalesReport: (report) => set({ salesReport: report }),
      setFinancialReport: (report) => set({ financialReport: report }),
      fetchReports: async (type = '', limit = 10) => {
        set({ loading: true, error: null });
        try {
          const response = await reportsService.getReports({ type,   limit }));
          set({ reports: response.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getSalesSummary: async (filters) => {
        set({ loading: true, error: null });
        try {
          const response = await reportsService.getSalesSummary(filters);
          set({ salesReport: response.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getSalesByProduct: async (filters) => {
        set({ loading: true, error: null });
        try {
          const response = await reportsService.getSalesByProduct(filters);
          // This would typically update product sales breakdown
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getSalesByCategory: async (filters) => {
        set({ loading: true, error: null });
        try {
          const response = await reportsService.getSalesByCategory(filters);
          // This would typically update category sales breakdown
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getSalesByMerchant: async (filters) => {
        set({ loading: true, error: null });
        try {
          const response = await reportsService.getSalesByMerchant(filters);
          // This would typically update merchant sales breakdown
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getTransactionReport: async (filters) => {
        set({ loading: true, error: null });
        try {
          const response = await reportsService.getTransactionReport(filters);
          // This would typically update transaction report
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getUserGrowthReport: async (filters) => {
        set({ loading: true, error: null });
        try {
          const response = await reportsService.getUserGrowthReport(filters);
          // This would typically update user growth report
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getUserActivityReport: async (filters) => {
        set({ loading: true, error: null });
        try {
          const response = await reportsService.getUserActivityReport(filters);
          // This would typically update user activity report
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getFinancialSummary: async (filters) => {
        set({ loading: true, error: null });
        try {
          const response = await reportsService.getFinancialSummary(filters);
          set({ financialReport: response.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getProfitLoss: async (filters) => {
        set({ loading: true, error: null });
        try {
          const response = await reportsService.getProfitLoss(filters);
          // This would typically update profit/loss report
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      exportSalesReport: async (format, filters) => {
        set({ loading: true, error: null });
        try {
          const response = await reportsService.exportSalesReport(format, filters);
          set({ loading: false });
          return response.data?.fileUrl || '';
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      exportFinancialReport: async (format, filters) => {
        set({ loading: true, error: null });
        try {
          const response = await reportsService.exportFinancialReport(format, filters);
          set({ loading: false });
          return response.data?.fileUrl || '';
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      generateReport: async (type, filters, format) => {
        set({ loading: true, error: null });
        try {
          // Fetch the data that would be displayed in the report
          switch (type) {
            case 'sales':
              await get().getSalesSummary(filters);
              break;
            case 'financial':
              await get().getFinancialSummary(filters);
              break;
            default:
              throw new Error(`Unsupported report type: ${type}`);
          }
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      scheduleReport: async (type, filters, format, frequency, recipients) => {
        set({ loading: true, error: null });
        try {
          await reportsService.scheduleReport({ type, filters, format, frequency, recipients });
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getReportHistory: async (type) => {
        set({ loading: true, error: null });
        try {
          const response = await reportsService.getReportHistory({ type });
          set({ reports: response.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      reset: () => {
        set({
          reports: [],
          salesReport: null,
          financialReport: null,
          loading: false,
          error: null,
        });
      },
    }),
    { name: 'ReportsStore' }
  )
);