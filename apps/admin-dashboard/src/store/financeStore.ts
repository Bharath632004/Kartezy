import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { financeService } from '@/lib/api';

export type FinanceOverview = {
  totalRevenue: number;
  totalRefunds: number;
  netRevenue: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  totalWallets: number;
  activeWallets: number;
  walletBalance: number;
  pendingPayouts: number;
  completedPayouts: number;
  totalCommission: number;
  period: string;
};

export type Transaction = {
  id: string;
  transactionId: string;
  orderId?: string;
  userId?: string;
  amount: number;
  currency: string;
  paymentMethod: 'credit_card' | 'debit_card' | 'upi' | 'cod' | 'wallet' | 'bank_transfer';
  status: 'pending' | 'success' | 'failed' | 'refunded' | 'disputed';
  type: 'charge' | 'refund' | 'payout' | 'commission' | 'wallet_topup' | 'wallet_withdrawal';
  fee: number;
  netAmount: number;
  createdAt: string;
  updatedAt: string;
};

export type Payout = {
  id: string;
  payoutId: string;
  merchantId: string;
  merchantName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  method: 'bank_transfer' | 'upi' | 'wallet';
  reference?: string;
  notes?: string;
  createdAt: string;
  processedAt?: string;
  completedAt?: string;
};

export type FinanceState = {
  overview: FinanceOverview | null;
  transactions: Transaction[];
  payouts: Payout[];
  commissionData: any[];
  walletData: any | null;
  refundsData: any[];
  taxesData: any[];
  settlementsData: any[];
  revenueData: any[];
  transactionsData: any[];
  gstReportsData: any[];
  payoutsData: any[];
  loading: boolean;
  error: string | null;
  setOverview: (overview: FinanceOverview) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setPayouts: (payouts: Payout[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  removeTransaction: (id: string) => void;
  addPayout: (payout: Payout) => void;
  updatePayout: (id: string, payout: Partial<Payout>) => void;
  removePayout: (id: string) => void;
  fetchOverview: () => Promise<void>;
  fetchTransactions: (filters?: any) => Promise<void>;
  fetchPayouts: (filters?: any) => Promise<void>;
  fetchRevenueByPeriod: (period: string) => Promise<void>;
  fetchRevenueBySource: () => Promise<void>;
  fetchCommissionSummary: () => Promise<void>;
  fetchCommissionDetails: (filters: any) => Promise<void>;
  fetchCommissionData: (filters: any) => Promise<void>;
  fetchSettlements: (filters: any) => Promise<void>;
  getWalletBalance: () => Promise<void>;
  getWalletTransactions: (params: any) => Promise<void>;
  fetchRefunds: (filters: any) => Promise<void>;
  processRefund: (id: string, data: any) => Promise<void>;
  getTaxReport: (year: number) => Promise<void>;
  fetchAllFinanceData: () => Promise<void>;
  fetchWalletData: () => Promise<void>;
  fetchRefundsData: (filters: any) => Promise<void>;
  fetchTaxesData: (filters: any) => Promise<void>;
  fetchSettlementsData: (filters: any) => Promise<void>;
  fetchRevenueData: (filters: any) => Promise<void>;
  fetchTransactionsData: (filters: any) => Promise<void>;
  fetchGstReportsData: (filters: any) => Promise<void>;
  fetchPayoutsData: (filters: any) => Promise<void>;
  reset: () => void;
};

export const useFinanceStore = create<FinanceState>()(
  devtools(
    (set, get) => ({
      overview: null,
      transactions: [],
      payouts: [],
      commissionData: [],
      walletData: null,
      refundsData: [],
      taxesData: [],
      settlementsData: [],
      revenueData: [],
      transactionsData: [],
      gstReportsData: [],
      payoutsData: [],
      loading: false,
      error: null,
      setOverview: (overview) => set({ overview }),
      setTransactions: (transactions) => set({ transactions }),
      setPayouts: (payouts) => set({ payouts }),
      addTransaction: (transaction) =>
        set((state) => ({ transactions: [...state.transactions, transaction] })),
      updateTransaction: (id, transaction) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...transaction } : t
          ),
        })),
      removeTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
      addPayout: (payout) =>
        set((state) => ({ payouts: [...state.payouts, payout] })),
      updatePayout: (id, payout) =>
        set((state) => ({
          payouts: state.payouts.map((p) => (p.id === id ? { ...p, ...payout } : p)),
        })),
      removePayout: (id) =>
        set((state) => ({ payouts: state.payouts.filter((p) => p.id !== id) })),
      fetchOverview: async () => {
        set({ loading: true, error: null });
        try {
          const response = await financeService.getRevenueOverview();
          set({ overview: response.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      fetchTransactions: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
          const response = await financeService.getTransactions(filters);
          set({ transactions: response.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      fetchPayouts: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
          const response = await financeService.getPayouts(filters);
          set({ payouts: response.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      fetchRevenueByPeriod: async (period: string) => {
        set({ loading: true, error: null });
        try {
          const response = await financeService.getRevenueByPeriod(period);
          // This would typically update a specific revenue chart/trend data
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      fetchRevenueBySource: async () => {
        set({ loading: true, error: null });
        try {
          const response = await financeService.getRevenueBySource();
          // This would typically update revenue source breakdown
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      fetchCommissionSummary: async () => {
        set({ loading: true, error: null });
        try {
          const response = await financeService.getCommissionSummary();
          // This would typically update commission overview
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      fetchCommissionDetails: async (filters) => {
        set({ loading: true, error: null });
        try {
          const response = await financeService.getCommissionDetails(filters);
          set({ commissionData: response.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      fetchCommissionData: async (filters: any) => {
        set({ loading: true, error: null });
        try {
          const response = await financeService.getCommissionDetails(filters);
          set({ commissionData: response.data, loading: false });
        } catch (error) {
          set({ error: (error as any).message, loading: false });
          throw error;
        }
      },
      fetchSettlements: async (filters) => {
        set({ loading: true, error: null });
        try {
          const response = await financeService.getSettlements(filters);
          set({ loading: false });
        } catch (error) {
          set({ error: (error as any).message, loading: false });
          throw error;
        }
      },
      getWalletBalance: async () => {
        set({ loading: true, error: null });
        try {
          const response = await financeService.getWalletBalance();
          set({ loading: false });
        } catch (error) {
          set({ error: (error as any).message, loading: false });
          throw error;
        }
      },
      getWalletTransactions: async (params) => {
        set({ loading: true, error: null });
        try {
          const response = await financeService.getWalletTransactions(params);
          // This would typically update wallet transactions table
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      fetchRefunds: async (filters) => {
        set({ loading: true, error: null });
        try {
          const response = await financeService.getRefunds(filters);
          // This would typically update refunds table
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      processRefund: async (id, data) => {
        set({ loading: true, error: null });
        try {
          const response = await financeService.processRefund(id, data);
          // This would typically update the specific refund status
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      getTaxReport: async (year) => {
        set({ loading: true, error: null });
        try {
          const response = await financeService.getTaxReport(year);
          // This would typically update tax report data
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      fetchAllFinanceData: async () => {
        set({ loading: true, error: null });
        try {
          await Promise.all([
            get().fetchOverview(),
            get().fetchTransactions(),
            get().fetchPayouts(),
            get().fetchCommissionSummary(),
            get().fetchSettlements({}),
          ]);
          set({ loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      fetchWalletData: async () => {
        set({ loading: true, error: null });
        try {
          const response = await financeService.getWalletBalance();
          set({ walletData: response.data, loading: false });
        } catch (error) {
          set({ error: (error as any).message, loading: false });
          throw error;
        }
      },
      fetchRefundsData: async (filters: any) => {
        set({ loading: true, error: null });
        try {
          const response = await financeService.getRefunds(filters);
          set({ refundsData: response.data, loading: false });
        } catch (error) {
          set({ error: (error as any).message, loading: false });
          throw error;
        }
      },
      fetchTaxesData: async (filters: any) => {
        set({ loading: true, error: null });
        try {
          const response = await financeService.getTaxReport(new Date().getFullYear());
          set({ taxesData: response.data, loading: false });
        } catch (error) {
          set({ error: (error as any).message, loading: false });
          throw error;
        }
      },
      fetchSettlementsData: async (filters: any) => {
        set({ loading: true, error: null });
        try {
          const response = await financeService.getSettlements(filters);
          set({ settlementsData: response.data, loading: false });
        } catch (error) {
          set({ error: (error as any).message, loading: false });
          throw error;
        }
      },
      fetchRevenueData: async (filters: any) => {
        set({ loading: true, error: null });
        try {
          const response = await financeService.getRevenueByPeriod(filters.dateRange || 'last_30_days');
          set({ revenueData: response.data, loading: false });
        } catch (error) {
          set({ error: (error as any).message, loading: false });
          throw error;
        }
      },
      fetchTransactionsData: async (filters: any) => {
        set({ loading: true, error: null });
        try {
          const response = await financeService.getTransactions(filters);
          set({ transactionsData: response.data, loading: false });
        } catch (error) {
          set({ error: (error as any).message, loading: false });
          throw error;
        }
      },
      fetchGstReportsData: async (filters: any) => {
        set({ loading: true, error: null });
        try {
          const response = await financeService.getTaxReport(new Date().getFullYear());
          set({ gstReportsData: response.data, loading: false });
        } catch (error) {
          set({ error: (error as any).message, loading: false });
          throw error;
        }
      },
      fetchPayoutsData: async (filters: any) => {
        set({ loading: true, error: null });
        try {
          const response = await financeService.getPayouts(filters);
          set({ payoutsData: response.data, loading: false });
        } catch (error) {
          set({ error: (error as any).message, loading: false });
          throw error;
        }
      },
      reset: () => {
        set({
          overview: null,
          transactions: [],
          payouts: [],
          loading: false,
          error: null,
        });
      },
    }),
    { name: 'FinanceStore' }
  )
);