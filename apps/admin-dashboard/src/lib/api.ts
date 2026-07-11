import axios from 'axios';
import axiosRetry from 'axios-retry';
import { useAuthStore } from '@/store/authStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure axios-retry: retry 3 times with exponential backoff
axiosRetry(api, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    // Get token from zustand store
    const { getState } = useAuthStore.getState();
    const { accessToken } = getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 (token refresh or redirect to login)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { refreshToken } = useAuthStore.getState();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }
        // Use axios directly to avoid infinite loop due to interceptors
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || ''}/api/auth/refresh`,
          { refreshToken }
        );
        const { accessToken } = response.data;
        useAuthStore.getState().setAccessToken(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        // If refresh fails, redirect to login
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Service functions for each entity

export const authService = {
  login: (email: string, password: string) => api.post('/api/auth/login', { email, password }),
  logout: () => api.post('/api/auth/logout'),
  refreshToken: (refreshToken: string) => api.post('/api/auth/refresh', { refreshToken }),
  forgotPassword: (email: string) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => api.post('/api/auth/reset-password', { token, password }),
  // OTP
  sendOtp: (email: string) => api.post('/api/auth/send-otp', { email }),
  verifyOtp: (email: string, otp: string) => api.post('/api/auth/verify-otp', { email, otp }),
  // Logout all devices
  logoutAllDevices: () => api.post('/api/auth/logout-all-devices'),
};

export const userService = {
  getList: (params: any) => api.get('/api/users', { params }),
  getDetail: (id: string) => api.get(`/api/users/${id}`),
  blockUser: (id: string) => api.put(`/api/users/${id}/block`),
  unblockUser: (id: string) => api.put(`/api/users/${id}/unblock`),
  deleteUser: (id: string) => api.delete(`/api/users/${id}`),
  getWallet: (id: string) => api.get(`/api/users/${id}/wallet`),
  getWalletTransactions: (id: string) => api.get(`/api/users/${id}/wallet/transactions`),
  getOrders: (id: string) => api.get(`/api/users/${id}/orders`),
  getLoginHistory: (id: string) => api.get(`/api/users/${id}/login-history`),
  getAddresses: (id: string) => api.get(`/api/users/${id}/addresses`),
};

export const merchantService = {
  getList: (params: any) => api.get('/api/merchants', { params }),
  getDetail: (id: string) => api.get(`/api/merchants/${id}`),
  approve: (id: string) => api.put(`/api/merchants/${id}/approve`),
  reject: (id: string) => api.put(`/api/merchants/${id}/reject`),
  suspend: (id: string) => api.put(`/api/merchants/${id}/suspend`),
  activate: (id: string) => api.put(`/api/merchants/${id}/activate`),
  getKYC: (id: string) => api.get(`/api/merchants/${id}/kyc`),
  getDocuments: (id: string) => api.get(`/api/merchants/${id}/documents`),
  getStoreDetails: (id: string) => api.get(`/api/merchants/${id}/store`),
  getRatings: (id: string) => api.get(`/api/merchants/${id}/ratings`),
  getRevenue: (id: string) => api.get(`/api/merchants/${id}/revenue`),
  getCommission: (id: string) => api.get(`/api/merchants/${id}/commission`),
};

export const deliveryService = {
  getList: (params: any) => api.get('/api/drivers', { params }),
  getDetail: (id: string) => api.get(`/api/drivers/${id}`),
  approve: (id: string) => api.put(`/api/drivers/${id}/approve`),
  suspend: (id: string) => api.put(`/api/drivers/${id}/suspend`),
  activate: (id: string) => api.put(`/api/drivers/${id}/activate`),
  getVehicleDetails: (id: string) => api.get(`/api/drivers/${id}/vehicle`),
  getKYC: (id: string) => api.get(`/api/drivers/${id}/kyc`),
  getLiveLocation: (id: string) => api.get(`/api/drivers/${id}/location`),
  getRatings: (id: string) => api.get(`/api/drivers/${id}/ratings`),
  getEarnings: (id: string) => api.get(`/api/drivers/${id}/earnings`),
  getPerformance: (id: string) => api.get(`/api/drivers/${id}/performance`),
};

export const orderService = {
  getList: (params: any) => api.get('/api/orders', { params }),
  getDetail: (id: string) => api.get(`/api/orders/${id}`),
  assignDriver: (orderId: string, driverId: string) =>
    api.put(`/api/orders/${orderId}/assign/${driverId}`),
  reassignDriver: (orderId: string, driverId: string) =>
    api.put(`/api/orders/${orderId}/reassign/${driverId}`),
  cancelOrder: (orderId: string) => api.put(`/api/orders/${orderId}/cancel`),
  refundOrder: (orderId: string) => api.put(`/api/orders/${orderId}/refund`),
  returnOrder: (orderId: string) => api.put(`/api/orders/${orderId}/return`),
  replacementOrder: (orderId: string) =>
    api.put(`/api/orders/${orderId}/replacement`),
  getInvoice: (orderId: string) => api.get(`/api/orders/${orderId}/invoice`),
  getPaymentStatus: (orderId: string) =>
    api.get(`/api/orders/${orderId}/payment-status`),
};

export const operationsService = {
  getLiveOrders: () => api.get('/api/orders/live'),
  getStoreMonitoring: () => api.get('/api/stores/monitoring'),
  getFleetMonitoring: () => api.get('/api/fleet/monitoring'),
  getInventoryAlerts: () => api.get('/api/inventory/alerts'),
  getFraudAlerts: () => api.get('/api/fraud/alerts'),
  getEscalations: () => api.get('/api/escalations'),
};

export const financeService = {
  // Revenue
  getRevenueOverview: () => api.get('/api/finance/revenue/overview'),
  getRevenueByPeriod: (period: string) => api.get(`/api/finance/revenue?period=${period}`),
  getRevenueBySource: () => api.get('/api/finance/revenue/source'),
  // Commission
  getCommissionSummary: () => api.get('/api/finance/commission/summary'),
  getCommissionDetails: (filters: any) => api.get('/api/finance/commission', { params: filters }),
  // Payouts
  getPayouts: (filters: any) => api.get('/api/finance/payouts', { params: filters }),
  createPayout: (data: any) => api.post('/api/finance/payouts', data),
  // Settlements
  getSettlements: (filters: any) => api.get('/api/finance/settlements', { params: filters }),
  // Wallet
  getWalletBalance: () => api.get('/api/finance/wallet/balance'),
  getWalletTransactions: (params: any) => api.get('/api/finance/wallet/transactions', { params }),
  // Refunds
  getRefunds: (filters: any) => api.get('/api/finance/refunds', { params: filters }),
  processRefund: (id: string, data: any) => api.post(`/api/finance/refunds/${id}/process`, data),
  // Taxes
  getTaxReport: (year: number) => api.get(`/api/finance/taxes?year=${year}`),
  // Transactions
  getTransactions: (filters: any) => api.get('/api/finance/transactions', { params: filters }),
};

export const marketingService = {
  // Campaigns
  getCampaigns: (filters: any) => api.get('/api/marketing/campaigns', { params: filters }),
  createCampaign: (data: any) => api.post('/api/marketing/campaigns', data),
  updateCampaign: (id: string, data: any) => api.put(`/api/marketing/campaigns/${id}`, data),
  deleteCampaign: (id: string) => api.delete(`/api/marketing/campaigns/${id}`),
  getCampaignPerformance: (id: string) => api.get(`/api/marketing/campaigns/${id}/performance`),
  // Promotions
  getPromotions: (filters: any) => api.get('/api/marketing/promotions', { params: filters }),
  createPromotion: (data: any) => api.post('/api/marketing/promotions', data),
  // Coupons
  getCoupons: (filters: any) => api.get('/api/marketing/coupons', { params: filters }),
  createCoupon: (data: any) => api.post('/api/marketing/coupons', data),
  // Analytics
  getMarketingOverview: () => api.get('/api/marketing/overview'),
  getCustomerAcquisitionCost: () => api.get('/api/marketing/cac'),
  getLtv: () => api.get('/api/marketing/ltv'),
};

export const cmsService = {
  // Pages
  getPages: () => api.get('/api/cms/pages'),
  getPage: (id: string) => api.get(`/api/cms/pages/${id}`),
  createPage: (data: any) => api.post('/api/cms/pages', data),
  updatePage: (id: string, data: any) => api.put(`/api/cms/pages/${id}`, data),
  deletePage: (id: string) => api.delete(`/api/cms/pages/${id}`),
  // Blogs
  getBlogs: (filters: any) => api.get('/api/cms/blogs', { params: filters }),
  getBlog: (id: string) => api.get(`/api/cms/blogs/${id}`),
  createBlog: (data: any) => api.post('/api/cms/blogs', data),
  updateBlog: (id: string, data: any) => api.put(`/api/cms/blogs/${id}`, data),
  deleteBlog: (id: string) => api.delete(`/api/cms/blogs/${id}`),
  // FAQs
  getFaqs: () => api.get('/api/cms/faqs'),
  createFaq: (data: any) => api.post('/api/cms/faqs', data),
  updateFaq: (id: string, data: any) => api.put(`/api/cms/faqs/${id}`, data),
  deleteFaq: (id: string) => api.delete(`/api/cms/faqs/${id}`),
  // Banners
  getBanners: () => api.get('/api/cms/banners'),
  createBanner: (data: any) => api.post('/api/cms/banners', data),
  updateBanner: (id: string, data: any) => api.put(`/api/cms/banners/${id}`, data),
  deleteBanner: (id: string) => api.delete(`/api/cms/banners/${id}`),
  // Settings
  getSiteSettings: () => api.get('/api/cms/settings'),
  updateSiteSettings: (data: any) => api.put('/api/cms/settings', data),
};

export const reportsService = {
  // Sales Reports
  getSalesSummary: (filters: any) => api.get('/api/reports/sales/summary', { params: filters }),
  getSalesByProduct: (filters: any) => api.get('/api/reports/sales/product', { params: filters }),
  getSalesByCategory: (filters: any) => api.get('/api/reports/sales/category', { params: filters }),
  getSalesByMerchant: (filters: any) => api.get('/api/reports/sales/merchant', { params: filters }),
  // Transaction Reports
  getTransactionReport: (filters: any) => api.get('/api/reports/transactions', { params: filters }),
  // User Reports
  getUserGrowthReport: (filters: any) => api.get('/api/reports/users/growth', { params: filters }),
  getUserActivityReport: (filters: any) => api.get('/api/reports/users/activity', { params: filters }),
  // Financial Reports
  getFinancialSummary: (filters: any) => api.get('/api/reports/financial/summary', { params: filters }),
  getProfitLoss: (filters: any) => api.get('/api/reports/financial/pl', { params: filters }),
  // Export
  exportSalesReport: (format: string, filters: any) =>
    api.get(`/api/reports/sales/export?format=${format}&${new URLSearchParams(filters)}`),
  exportFinancialReport: (format: string, filters: any) =>
    api.get(`/api/reports/financial/export?format=${format}&${new URLSearchParams(filters)}`),
};

export const analyticsService = {
  getDashboardStats: () => api.get('/api/analytics/dashboard'),
  getRevenueTrend: (period: string) => api.get(`/api/analytics/revenue-trend?period=${period}`),
  getOrdersTrend: (period: string) => api.get(`/api/analytics/orders-trend?period=${period}`),
  getCustomerGrowth: (period: string) => api.get(`/api/analytics/customer-growth?period=${period}`),
  getMerchantGrowth: (period: string) => api.get(`/api/analytics/merchant-growth?period=${period}`),
  getDeliveryPerformance: () => api.get('/api/analytics/delivery-performance'),
  getCategorySales: () => api.get('/api/analytics/category-sales'),
  getProductSales: () => api.get('/api/analytics/product-sales'),
  getHeatMapData: () => api.get('/api/analytics/heat-map'),
  // Advanced analytics
  getRetentionCohort: (cohortType: string) => api.get(`/api/analytics/retention?cohort=${cohortType}`),
  getFunnelAnalysis: (funnelId: string) => api.get(`/api/analytics/funnel/${funnelId}`),
  getGrowthMetrics: () => api.get('/api/analytics/growth'),
  getPredictiveInsights: () => api.get('/api/analytics/predictions'),
};

export const walletService = {
  getWalletBalance: () => api.get('/api/wallet/balance'),
  getWalletTransactions: (params: any) => api.get('/api/wallet/transactions', { params }),
};

export const notificationService = {
  getNotifications: (params: any) => api.get('/api/notifications', { params }),
  markAsRead: (id: string) => api.put(`/api/notifications/${id}/read`),
  deleteNotification: (id: string) => api.delete(`/api/notifications/${id}`),
};