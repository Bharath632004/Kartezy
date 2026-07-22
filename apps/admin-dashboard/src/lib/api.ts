import axios from 'axios';
import axiosRetry from 'axios-retry';
import { useAuthStore } from '@/store/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure axios-retry: retry 3 times with exponential backoff
axiosRetry(api, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
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
        const response = await axios.post(
          `${API_BASE_URL}/api/auth/refresh`,
          { refreshToken }
        );
        const { accessToken } = response.data;
        useAuthStore.getState().setAccessToken(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── Auth Service ──────────────────────────────────────────────────────────
export const authService = {
  login: (email: string, password: string) => api.post('/api/auth/login', { email, password }),
  logout: () => api.post('/api/auth/logout'),
  refreshToken: (refreshToken: string) => api.post('/api/auth/refresh', { refreshToken }),
  forgotPassword: (email: string) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => api.post('/api/auth/reset-password', { token, password }),
  sendOtp: (email: string) => api.post('/api/auth/send-otp', { email }),
  verifyOtp: (email: string, otp: string) => api.post('/api/auth/verify-otp', { email, otp }),
  logoutAllDevices: () => api.post('/api/auth/logout-all-devices'),
  getMe: () => api.get('/api/auth/me'),
};

// ─── User Service ──────────────────────────────────────────────────────────
export const userService = {
  getList: (params: Record<string, unknown>) => api.get('/api/users', { params }),
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

// ─── Product Service ───────────────────────────────────────────────────────
export const productService = {
  getList: (params: Record<string, unknown>) => api.get('/api/products', { params }),
  getDetail: (id: string) => api.get(`/api/products/${id}`),
  create: (data: Record<string, unknown>) => api.post('/api/products', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/api/products/${id}`, data),
  delete: (id: string) => api.delete(`/api/products/${id}`),
  getLowStock: (params: Record<string, unknown>) => api.get('/api/products/low-stock', { params }),
  updateStock: (id: string, quantity: number) => api.patch(`/api/products/${id}/stock`, { quantity }),
};

// ─── Category Service ──────────────────────────────────────────────────────
export const categoryService = {
  getList: (params: Record<string, unknown>) => api.get('/api/categories', { params }),
  getDetail: (id: string) => api.get(`/api/categories/${id}`),
  create: (data: Record<string, unknown>) => api.post('/api/categories', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/api/categories/${id}`, data),
  delete: (id: string) => api.delete(`/api/categories/${id}`),
};

// ─── Inventory Service ─────────────────────────────────────────────────────
export const inventoryService = {
  getList: (params: Record<string, unknown>) => api.get('/api/inventory', { params }),
  getDetail: (id: string) => api.get(`/api/inventory/${id}`),
  updateStock: (id: string, quantity: number) => api.put(`/api/inventory/${id}/stock`, { quantity }),
  getAlerts: (params: Record<string, unknown>) => api.get('/api/inventory/alerts', { params }),
};

// ─── Merchant Service ──────────────────────────────────────────────────────
export const merchantService = {
  getList: (params: Record<string, unknown>) => api.get('/api/merchants', { params }),
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

// ─── Delivery Service ──────────────────────────────────────────────────────
export const deliveryService = {
  getList: (params: Record<string, unknown>) => api.get('/api/delivery', { params }),
  getDetail: (id: string) => api.get(`/api/delivery/${id}`),
  approve: (id: string) => api.put(`/api/delivery/${id}/approve`),
  suspend: (id: string) => api.put(`/api/delivery/${id}/suspend`),
  activate: (id: string) => api.put(`/api/delivery/${id}/activate`),
  getVehicleDetails: (id: string) => api.get(`/api/delivery/${id}/vehicle`),
  getKYC: (id: string) => api.get(`/api/delivery/${id}/kyc`),
  getLiveLocation: (id: string) => api.get(`/api/delivery/${id}/location`),
  getRatings: (id: string) => api.get(`/api/delivery/${id}/ratings`),
  getEarnings: (id: string) => api.get(`/api/delivery/${id}/earnings`),
  getPerformance: (id: string) => api.get(`/api/delivery/${id}/performance`),
};

// ─── Order Service ─────────────────────────────────────────────────────────
export const orderService = {
  getList: (params: Record<string, unknown>) => api.get('/api/orders', { params }),
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

// ─── Operations Service ────────────────────────────────────────────────────
export const operationsService = {
  getLiveOrders: () => api.get('/api/orders/live'),
  getStoreMonitoring: () => api.get('/api/stores/monitoring'),
  getFleetMonitoring: () => api.get('/api/fleet/monitoring'),
  getInventoryAlerts: () => api.get('/api/inventory/alerts'),
  getFraudAlerts: () => api.get('/api/fraud/alerts'),
  getEscalations: () => api.get('/api/escalations'),
};

// ─── Operations Platform API (new consolidated service) ────────────────────
const OPS_BASE = '/api/operations';

export const operationsApi = {
  // ── Dashboard ─────────────────────────────────────────────────────────
  getDashboard: () => api.get(`${OPS_BASE}/dashboard`),
  getRealtimeMetrics: () => api.get(`${OPS_BASE}/dashboard/realtime`),

  // ── Cities ────────────────────────────────────────────────────────────
  getCities: (filters: Record<string, unknown>) =>
    api.get(`${OPS_BASE}/cities`, { params: filters }),
  getCityById: (id: string) => api.get(`${OPS_BASE}/cities/${id}`),
  updateCity: (id: string, data: Record<string, unknown>) =>
    api.put(`${OPS_BASE}/cities/${id}`, data),

  // ── Zones ─────────────────────────────────────────────────────────────
  getZones: (filters: Record<string, unknown>) =>
    api.get(`${OPS_BASE}/zones`, { params: filters }),
  getZoneById: (id: string) => api.get(`${OPS_BASE}/zones/${id}`),
  createZone: (data: Record<string, unknown>) => api.post(`${OPS_BASE}/zones`, data),
  updateZone: (id: string, data: Record<string, unknown>) =>
    api.put(`${OPS_BASE}/zones/${id}`, data),

  // ── Warehouses ────────────────────────────────────────────────────────
  getWarehouses: (filters: Record<string, unknown>) =>
    api.get(`${OPS_BASE}/warehouses`, { params: filters }),
  getWarehouseById: (id: string) => api.get(`${OPS_BASE}/warehouses/${id}`),
  updateWarehouse: (id: string, data: Record<string, unknown>) =>
    api.put(`${OPS_BASE}/warehouses/${id}`, data),

  // ── Merchants (Ops View) ──────────────────────────────────────────────
  getOpsMerchants: (filters: Record<string, unknown>) =>
    api.get(`${OPS_BASE}/merchants`, { params: filters }),
  updateOpsMerchant: (id: string, data: Record<string, unknown>) =>
    api.put(`${OPS_BASE}/merchants/${id}`, data),

  // ── Inventory (Ops View) ──────────────────────────────────────────────
  getInventoryItems: (filters: Record<string, unknown>) =>
    api.get(`${OPS_BASE}/inventory`, { params: filters }),
  updateInventoryItem: (id: string, data: Record<string, unknown>) =>
    api.put(`${OPS_BASE}/inventory/${id}`, data),

  // ── Delivery (Ops View) ───────────────────────────────────────────────
  getOpsDeliveries: (filters: Record<string, unknown>) =>
    api.get(`${OPS_BASE}/deliveries`, { params: filters }),
  getOpsDeliveryById: (id: string) => api.get(`${OPS_BASE}/deliveries/${id}`),

  // ── Customers (Ops View) ──────────────────────────────────────────────
  getOpsCustomers: (filters: Record<string, unknown>) =>
    api.get(`${OPS_BASE}/customers`, { params: filters }),
  getOpsCustomerById: (id: string) => api.get(`${OPS_BASE}/customers/${id}`),

  // ── Support Tickets ───────────────────────────────────────────────────
  getSupportTickets: (filters: Record<string, unknown>) =>
    api.get(`${OPS_BASE}/support/tickets`, { params: filters }),
  getSupportTicketById: (id: string) => api.get(`${OPS_BASE}/support/tickets/${id}`),
  createSupportTicket: (data: Record<string, unknown>) =>
    api.post(`${OPS_BASE}/support/tickets`, data),
  updateSupportTicket: (id: string, data: Record<string, unknown>) =>
    api.put(`${OPS_BASE}/support/tickets/${id}`, data),
  assignSupportTicket: (ticketId: string, agentId: string) =>
    api.put(`${OPS_BASE}/support/tickets/${ticketId}/assign/${agentId}`),
  resolveSupportTicket: (ticketId: string) =>
    api.put(`${OPS_BASE}/support/tickets/${ticketId}/resolve`),
  getSupportStats: (filters: Record<string, unknown>) =>
    api.get(`${OPS_BASE}/support/stats`, { params: filters }),

  // ── Escalations ───────────────────────────────────────────────────────
  getEscalations: (filters: Record<string, unknown>) =>
    api.get(`${OPS_BASE}/escalations`, { params: filters }),
  acknowledgeEscalation: (id: string) =>
    api.put(`${OPS_BASE}/escalations/${id}/acknowledge`),
  resolveEscalation: (id: string, summary: string) =>
    api.put(`${OPS_BASE}/escalations/${id}/resolve`, { resolutionSummary: summary }),
  addEscalationNote: (id: string, content: string) =>
    api.post(`${OPS_BASE}/escalations/${id}/notes`, { content }),

  // ── SLA Configuration ─────────────────────────────────────────────────
  getSLAConfigs: (filters: Record<string, unknown>) =>
    api.get(`${OPS_BASE}/sla`, { params: filters }),
  createSLAConfig: (data: Record<string, unknown>) =>
    api.post(`${OPS_BASE}/sla`, data),
  updateSLAConfig: (id: string, data: Record<string, unknown>) =>
    api.put(`${OPS_BASE}/sla/${id}`, data),
  getSLAReports: (filters: Record<string, unknown>) =>
    api.get(`${OPS_BASE}/sla/reports`, { params: filters }),

  // ── Incidents ─────────────────────────────────────────────────────────
  getIncidents: (filters: Record<string, unknown>) =>
    api.get(`${OPS_BASE}/incidents`, { params: filters }),
  getIncidentById: (id: string) => api.get(`${OPS_BASE}/incidents/${id}`),
  createIncident: (data: Record<string, unknown>) =>
    api.post(`${OPS_BASE}/incidents`, data),
  updateIncident: (id: string, data: Record<string, unknown>) =>
    api.put(`${OPS_BASE}/incidents/${id}`, data),
  acknowledgeIncident: (id: string) =>
    api.put(`${OPS_BASE}/incidents/${id}/acknowledge`),
  resolveIncident: (id: string, resolution: string, rootCause: string) =>
    api.put(`${OPS_BASE}/incidents/${id}/resolve`, { resolution, rootCause }),

  // ── Business Rules Engine ─────────────────────────────────────────────
  getBusinessRules: (filters: Record<string, unknown>) =>
    api.get(`${OPS_BASE}/rules`, { params: filters }),
  createBusinessRule: (data: Record<string, unknown>) =>
    api.post(`${OPS_BASE}/rules`, data),
  updateBusinessRule: (id: string, data: Record<string, unknown>) =>
    api.put(`${OPS_BASE}/rules/${id}`, data),
  deleteBusinessRule: (id: string) => api.delete(`${OPS_BASE}/rules/${id}`),
  evaluateBusinessRule: (id: string) =>
    api.post(`${OPS_BASE}/rules/${id}/evaluate`),
  validateBusinessRule: (data: Record<string, unknown>) =>
    api.post(`${OPS_BASE}/rules/validate`, data),
} as const;

// ─── Finance Service ───────────────────────────────────────────────────────
const FINANCE_BASE = '/api/analytics/finance';

export const financeService = {
  getRevenueOverview: () => api.get(`${FINANCE_BASE}/revenue/overview`),
  getRevenueByPeriod: (period: string) => api.get(`${FINANCE_BASE}/revenue?period=${period}`),
  getRevenueBySource: () => api.get(`${FINANCE_BASE}/revenue/source`),
  getCommissionSummary: () => api.get(`${FINANCE_BASE}/commission/summary`),
  getCommissionDetails: (filters: Record<string, unknown>) =>
    api.get(`${FINANCE_BASE}/commission`, { params: filters }),
  getPayouts: (filters: Record<string, unknown>) =>
    api.get(`${FINANCE_BASE}/payouts`, { params: filters }),
  createPayout: (data: Record<string, unknown>) => api.post(`${FINANCE_BASE}/payouts`, data),
  getSettlements: (filters: Record<string, unknown>) =>
    api.get(`${FINANCE_BASE}/settlements`, { params: filters }),
  getWalletBalance: () => api.get(`${FINANCE_BASE}/wallet/balance`),
  getWalletTransactions: (params: Record<string, unknown>) =>
    api.get(`${FINANCE_BASE}/wallet/transactions`, { params }),
  getRefunds: (filters: Record<string, unknown>) =>
    api.get(`${FINANCE_BASE}/refunds`, { params: filters }),
  processRefund: (id: string, data: Record<string, unknown>) =>
    api.post(`${FINANCE_BASE}/refunds/${id}/process`, data),
  getTaxReport: (year: number) => api.get(`${FINANCE_BASE}/taxes?year=${year}`),
  getTransactions: (filters: Record<string, unknown>) =>
    api.get(`${FINANCE_BASE}/transactions`, { params: filters }),
};

// ─── Marketing Service ──────────────────────────────────────────────────────
export const marketingService = {
  getCampaigns: (filters: Record<string, unknown>) =>
    api.get('/api/marketing/campaigns', { params: filters }),
  createCampaign: (data: Record<string, unknown>) => api.post('/api/marketing/campaigns', data),
  updateCampaign: (id: string, data: Record<string, unknown>) =>
    api.put(`/api/marketing/campaigns/${id}`, data),
  deleteCampaign: (id: string) => api.delete(`/api/marketing/campaigns/${id}`),
  getCampaignPerformance: (id: string) =>
    api.get(`/api/marketing/campaigns/${id}/performance`),
  getPromotions: (filters: Record<string, unknown>) =>
    api.get('/api/marketing/promotions', { params: filters }),
  createPromotion: (data: Record<string, unknown>) => api.post('/api/marketing/promotions', data),
  getCoupons: (filters: Record<string, unknown>) =>
    api.get('/api/marketing/coupons', { params: filters }),
  createCoupon: (data: Record<string, unknown>) => api.post('/api/marketing/coupons', data),
  getMarketingOverview: () => api.get('/api/marketing/overview'),
  getCustomerAcquisitionCost: () => api.get('/api/marketing/cac'),
  getLtv: () => api.get('/api/marketing/ltv'),
};

// ─── CMS Service ───────────────────────────────────────────────────────────
export const cmsService = {
  getPages: () => api.get('/api/cms/pages'),
  getPage: (id: string) => api.get(`/api/cms/pages/${id}`),
  createPage: (data: Record<string, unknown>) => api.post('/api/cms/pages', data),
  updatePage: (id: string, data: Record<string, unknown>) =>
    api.put(`/api/cms/pages/${id}`, data),
  deletePage: (id: string) => api.delete(`/api/cms/pages/${id}`),
  getBlogs: (filters: Record<string, unknown>) =>
    api.get('/api/cms/blogs', { params: filters }),
  getBlog: (id: string) => api.get(`/api/cms/blogs/${id}`),
  createBlog: (data: Record<string, unknown>) => api.post('/api/cms/blogs', data),
  updateBlog: (id: string, data: Record<string, unknown>) =>
    api.put(`/api/cms/blogs/${id}`, data),
  deleteBlog: (id: string) => api.delete(`/api/cms/blogs/${id}`),
  getFaqs: () => api.get('/api/cms/faqs'),
  createFaq: (data: Record<string, unknown>) => api.post('/api/cms/faqs', data),
  updateFaq: (id: string, data: Record<string, unknown>) =>
    api.put(`/api/cms/faqs/${id}`, data),
  deleteFaq: (id: string) => api.delete(`/api/cms/faqs/${id}`),
  getBanners: () => api.get('/api/cms/banners'),
  createBanner: (data: Record<string, unknown>) => api.post('/api/cms/banners', data),
  updateBanner: (id: string, data: Record<string, unknown>) =>
    api.put(`/api/cms/banners/${id}`, data),
  deleteBanner: (id: string) => api.delete(`/api/cms/banners/${id}`),
  getSiteSettings: () => api.get('/api/cms/settings'),
  updateSiteSettings: (data: Record<string, unknown>) =>
    api.put('/api/cms/settings', data),
};

// ─── Reports Service ───────────────────────────────────────────────────────
export const reportsService = {
  getSalesSummary: (filters: Record<string, unknown>) =>
    api.get('/api/reports/sales/summary', { params: filters }),
  getSalesByProduct: (filters: Record<string, unknown>) =>
    api.get('/api/reports/sales/product', { params: filters }),
  getSalesByCategory: (filters: Record<string, unknown>) =>
    api.get('/api/reports/sales/category', { params: filters }),
  getSalesByMerchant: (filters: Record<string, unknown>) =>
    api.get('/api/reports/sales/merchant', { params: filters }),
  getTransactionReport: (filters: Record<string, unknown>) =>
    api.get('/api/reports/transactions', { params: filters }),
  getUserGrowthReport: (filters: Record<string, unknown>) =>
    api.get('/api/reports/users/growth', { params: filters }),
  getUserActivityReport: (filters: Record<string, unknown>) =>
    api.get('/api/reports/users/activity', { params: filters }),
  getFinancialSummary: (filters: Record<string, unknown>) =>
    api.get('/api/reports/financial/summary', { params: filters }),
  getProfitLoss: (filters: Record<string, unknown>) =>
    api.get('/api/reports/financial/pl', { params: filters }),
  getReports: (filters: Record<string, unknown>) =>
    api.get('/api/reports', { params: filters }),
  getReportHistory: (filters: Record<string, unknown>) =>
    api.get('/api/reports/history', { params: filters }),
  exportSalesReport: (format: string, filters: Record<string, unknown>) =>
    api.get(`/api/reports/sales/export?format=${format}&${new URLSearchParams(filters as Record<string, string>).toString()}`),
  exportFinancialReport: (format: string, filters: Record<string, unknown>) =>
    api.get(`/api/reports/financial/export?format=${format}&${new URLSearchParams(filters as Record<string, string>).toString()}`),
};

// ─── Analytics Service ─────────────────────────────────────────────────────
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
  getRetentionCohort: (cohortType: string) => api.get(`/api/analytics/retention?cohort=${cohortType}`),
  getFunnelAnalysis: (funnelId: string) => api.get(`/api/analytics/funnel/${funnelId}`),
  getGrowthMetrics: () => api.get('/api/analytics/growth'),
  getPredictiveInsights: () => api.get('/api/analytics/predictions'),
};

// ─── Wallet Service ────────────────────────────────────────────────────────
export const walletService = {
  getWalletBalance: () => api.get('/api/wallet/balance'),
  getWalletTransactions: (params: Record<string, unknown>) =>
    api.get('/api/wallet/transactions', { params }),
};

// ─── CRM Service ───────────────────────────────────────────────────────────
const CRM_BASE = '/api/crm';

export const crmService = {
  getCustomers: (filters: Record<string, unknown>) =>
    api.get(`${CRM_BASE}/customers`, { params: filters }),
  getCustomerById: (id: string) => api.get(`${CRM_BASE}/customers/${id}`),
  getCustomerActivities: (customerId: string) =>
    api.get(`${CRM_BASE}/customers/${customerId}/activities`),
  updateCustomer: (id: string, data: Record<string, unknown>) =>
    api.put(`${CRM_BASE}/customers/${id}`, data),
  getLeads: (filters: Record<string, unknown>) =>
    api.get(`${CRM_BASE}/leads`, { params: filters }),
  createLead: (data: Record<string, unknown>) => api.post(`${CRM_BASE}/leads`, data),
  updateLead: (id: string, data: Record<string, unknown>) =>
    api.put(`${CRM_BASE}/leads/${id}`, data),
  deleteLead: (id: string) => api.delete(`${CRM_BASE}/leads/${id}`),
  getWorkflows: (filters: Record<string, unknown>) =>
    api.get(`${CRM_BASE}/workflows`, { params: filters }),
  createWorkflow: (data: Record<string, unknown>) => api.post(`${CRM_BASE}/workflows`, data),
  updateWorkflow: (id: string, data: Record<string, unknown>) =>
    api.put(`${CRM_BASE}/workflows/${id}`, data),
  deleteWorkflow: (id: string) => api.delete(`${CRM_BASE}/workflows/${id}`),
  getSegments: (filters: Record<string, unknown>) =>
    api.get(`${CRM_BASE}/segments`, { params: filters }),
  createSegment: (data: Record<string, unknown>) => api.post(`${CRM_BASE}/segments`, data),
  updateSegment: (id: string, data: Record<string, unknown>) =>
    api.put(`${CRM_BASE}/segments/${id}`, data),
  deleteSegment: (id: string) => api.delete(`${CRM_BASE}/segments/${id}`),
  getRewards: (filters: Record<string, unknown>) =>
    api.get(`${CRM_BASE}/rewards`, { params: filters }),
  createReward: (data: Record<string, unknown>) => api.post(`${CRM_BASE}/rewards`, data),
  updateReward: (id: string, data: Record<string, unknown>) =>
    api.put(`${CRM_BASE}/rewards/${id}`, data),
  deleteReward: (id: string) => api.delete(`${CRM_BASE}/rewards/${id}`),
  getRedemptions: (filters: Record<string, unknown>) =>
    api.get(`${CRM_BASE}/rewards/redemptions`, { params: filters }),
  approveRedemption: (id: string) => api.post(`${CRM_BASE}/rewards/redemptions/${id}/approve`),
  getMarketingAnalytics: () => api.get(`${CRM_BASE}/analytics`),
} as const;

// ─── Notification Service ──────────────────────────────────────────────────
export const notificationService = {
  getNotifications: (params: Record<string, unknown>) => api.get('/api/notifications', { params }),
  markAsRead: (id: string) => api.put(`/api/notifications/${id}/read`),
  deleteNotification: (id: string) => api.delete(`/api/notifications/${id}`),
  updateNotificationSettings: (data: Record<string, unknown>) => api.put('/api/notifications/settings', data),
};

// ─── Support Service ───────────────────────────────────────────────────────
export const supportService = {
  getTickets: (params: Record<string, unknown>) => api.get('/api/support/tickets', { params }),
  getTicket: (id: string) => api.get(`/api/support/tickets/${id}`),
  createTicket: (data: Record<string, unknown>) => api.post('/api/support/tickets', data),
  updateTicket: (id: string, data: Record<string, unknown>) => api.put(`/api/support/tickets/${id}`, data),
  deleteTicket: (id: string) => api.delete(`/api/support/tickets/${id}`),
  assignTicket: (ticketId: string, agentId: string) => api.put(`/api/support/tickets/${ticketId}/assign/${agentId}`),
  resolveTicket: (ticketId: string) => api.put(`/api/support/tickets/${ticketId}/resolve`),
  fetchStats: (params: Record<string, unknown>) => api.get('/api/support/stats', { params }),
  exportTickets: (format: string, filters: Record<string, unknown>) =>
    api.get(`/api/support/export?format=${format}&${new URLSearchParams(filters as Record<string, string>).toString()}`),
  getSettings: () => api.get('/api/support/settings'),
  updateSettings: (data: Record<string, unknown>) => api.put('/api/support/settings', data),
};

// ─── Chat Service ──────────────────────────────────────────────────────────
export const chatService = {
  getMessages: (conversationId: string) => api.get(`/api/chat/${conversationId}/messages`),
  sendMessage: (conversationId: string, data: Record<string, unknown>) => api.post(`/api/chat/${conversationId}/messages`, data),
};

// ─── Knowledge Base Service ────────────────────────────────────────────────
export const knowledgeBaseService = {
  getArticles: (params: Record<string, unknown>) => api.get('/api/knowledge-base', { params }),
  getArticle: (id: string) => api.get(`/api/knowledge-base/${id}`),
  createArticle: (data: Record<string, unknown>) => api.post('/api/knowledge-base', data),
  updateArticle: (id: string, data: Record<string, unknown>) => api.put(`/api/knowledge-base/${id}`, data),
  deleteArticle: (id: string) => api.delete(`/api/knowledge-base/${id}`),
};

// ─── Enterprise Support Platform API ──────────────────────────────────────
const SUPPORT_BASE = '/api/support';

export const supportApi = {
  // ── Dashboard ─────────────────────────────────────────────────────────
  getDashboard: () => api.get(`${SUPPORT_BASE}/dashboard`),
  getRealtimeMetrics: () => api.get(`${SUPPORT_BASE}/dashboard/realtime`),

  // ── Tickets ───────────────────────────────────────────────────────────
  getTickets: (filters: Record<string, unknown>) =>
    api.get(`${SUPPORT_BASE}/tickets`, { params: filters }),
  getTicketById: (id: string) => api.get(`${SUPPORT_BASE}/tickets/${id}`),
  createTicket: (data: Record<string, unknown>) => api.post(`${SUPPORT_BASE}/tickets`, data),
  updateTicket: (id: string, data: Record<string, unknown>) =>
    api.put(`${SUPPORT_BASE}/tickets/${id}`, data),
  deleteTicket: (id: string) => api.delete(`${SUPPORT_BASE}/tickets/${id}`),
  assignTicket: (ticketId: string, agentId: string) =>
    api.put(`${SUPPORT_BASE}/tickets/${ticketId}/assign/${agentId}`),
  resolveTicket: (ticketId: string) =>
    api.put(`${SUPPORT_BASE}/tickets/${ticketId}/resolve`),
  closeTicket: (ticketId: string) =>
    api.put(`${SUPPORT_BASE}/tickets/${ticketId}/close`),
  reopenTicket: (ticketId: string) =>
    api.put(`${SUPPORT_BASE}/tickets/${ticketId}/reopen`),
  addTicketNote: (ticketId: string, content: string) =>
    api.post(`${SUPPORT_BASE}/tickets/${ticketId}/notes`, { content }),
  getTicketActivity: (ticketId: string) =>
    api.get(`${SUPPORT_BASE}/tickets/${ticketId}/activity`),

  // ── Customer Support ──────────────────────────────────────────────────
  getCustomerTickets: (customerId: string, filters: Record<string, unknown>) =>
    api.get(`${SUPPORT_BASE}/customer/${customerId}/tickets`, { params: filters }),
  getCustomerConversations: (customerId: string) =>
    api.get(`${SUPPORT_BASE}/customer/${customerId}/conversations`),
  getCustomerFeedback: (customerId: string) =>
    api.get(`${SUPPORT_BASE}/customer/${customerId}/feedback`),

  // ── Merchant Support ──────────────────────────────────────────────────
  getMerchantTickets: (merchantId: string, filters: Record<string, unknown>) =>
    api.get(`${SUPPORT_BASE}/merchant/${merchantId}/tickets`, { params: filters }),
  getMerchantConversations: (merchantId: string) =>
    api.get(`${SUPPORT_BASE}/merchant/${merchantId}/conversations`),

  // ── Delivery Support ──────────────────────────────────────────────────
  getDeliveryTickets: (driverId: string, filters: Record<string, unknown>) =>
    api.get(`${SUPPORT_BASE}/delivery/${driverId}/tickets`, { params: filters }),

  // ── Live Chat ─────────────────────────────────────────────────────────
  getConversations: (filters: Record<string, unknown>) =>
    api.get(`${SUPPORT_BASE}/chat/conversations`, { params: filters }),
  getConversationMessages: (conversationId: string) =>
    api.get(`${SUPPORT_BASE}/chat/conversations/${conversationId}/messages`),
  sendMessage: (conversationId: string, data: Record<string, unknown>) =>
    api.post(`${SUPPORT_BASE}/chat/conversations/${conversationId}/messages`, data),
  createConversation: (data: Record<string, unknown>) =>
    api.post(`${SUPPORT_BASE}/chat/conversations`, data),
  assignConversation: (conversationId: string, agentId: string) =>
    api.put(`${SUPPORT_BASE}/chat/conversations/${conversationId}/assign/${agentId}`),
  closeConversation: (conversationId: string) =>
    api.put(`${SUPPORT_BASE}/chat/conversations/${conversationId}/close`),

  // ── AI Chatbot ────────────────────────────────────────────────────────
  getBotConversations: (filters: Record<string, unknown>) =>
    api.get(`${SUPPORT_BASE}/bot/conversations`, { params: filters }),
  getBotMetrics: () => api.get(`${SUPPORT_BASE}/bot/metrics`),
  trainBot: (data: Record<string, unknown>) =>
    api.post(`${SUPPORT_BASE}/bot/train`, data),
  getBotIntents: () => api.get(`${SUPPORT_BASE}/bot/intents`),
  updateBotIntent: (intentId: string, data: Record<string, unknown>) =>
    api.put(`${SUPPORT_BASE}/bot/intents/${intentId}`, data),

  // ── Knowledge Base ────────────────────────────────────────────────────
  getArticles: (filters: Record<string, unknown>) =>
    api.get(`${SUPPORT_BASE}/knowledge-base`, { params: filters }),
  getArticleById: (id: string) => api.get(`${SUPPORT_BASE}/knowledge-base/${id}`),
  createArticle: (data: Record<string, unknown>) => api.post(`${SUPPORT_BASE}/knowledge-base`, data),
  updateArticle: (id: string, data: Record<string, unknown>) =>
    api.put(`${SUPPORT_BASE}/knowledge-base/${id}`, data),
  deleteArticle: (id: string) => api.delete(`${SUPPORT_BASE}/knowledge-base/${id}`),
  getArticleCategories: () => api.get(`${SUPPORT_BASE}/knowledge-base/categories`),
  searchArticles: (query: string) => api.get(`${SUPPORT_BASE}/knowledge-base/search?q=${query}`),

  // ── Escalation Workflow ───────────────────────────────────────────────
  getEscalations: (filters: Record<string, unknown>) =>
    api.get(`${SUPPORT_BASE}/escalations`, { params: filters }),
  createEscalation: (data: Record<string, unknown>) =>
    api.post(`${SUPPORT_BASE}/escalations`, data),
  acknowledgeEscalation: (id: string) =>
    api.put(`${SUPPORT_BASE}/escalations/${id}/acknowledge`),
  resolveEscalation: (id: string, summary: string) =>
    api.put(`${SUPPORT_BASE}/escalations/${id}/resolve`, { resolutionSummary: summary }),
  addEscalationNote: (id: string, content: string) =>
    api.post(`${SUPPORT_BASE}/escalations/${id}/notes`, { content }),
  getEscalationMatrix: () => api.get(`${SUPPORT_BASE}/escalations/matrix`),

  // ── SLA ───────────────────────────────────────────────────────────────
  getSLAs: (filters: Record<string, unknown>) =>
    api.get(`${SUPPORT_BASE}/sla`, { params: filters }),
  createSLA: (data: Record<string, unknown>) => api.post(`${SUPPORT_BASE}/sla`, data),
  updateSLA: (id: string, data: Record<string, unknown>) =>
    api.put(`${SUPPORT_BASE}/sla/${id}`, data),
  getSLAReports: (filters: Record<string, unknown>) =>
    api.get(`${SUPPORT_BASE}/sla/reports`, { params: filters }),
  getSLABreaches: (filters: Record<string, unknown>) =>
    api.get(`${SUPPORT_BASE}/sla/breaches`, { params: filters }),

  // ── Email Support ─────────────────────────────────────────────────────
  getEmailTemplates: () => api.get(`${SUPPORT_BASE}/email/templates`),
  createEmailTemplate: (data: Record<string, unknown>) =>
    api.post(`${SUPPORT_BASE}/email/templates`, data),
  updateEmailTemplate: (id: string, data: Record<string, unknown>) =>
    api.put(`${SUPPORT_BASE}/email/templates/${id}`, data),
  deleteEmailTemplate: (id: string) => api.delete(`${SUPPORT_BASE}/email/templates/${id}`),
  getEmailLogs: (filters: Record<string, unknown>) =>
    api.get(`${SUPPORT_BASE}/email/logs`, { params: filters }),
  sendTestEmail: (data: Record<string, unknown>) =>
    api.post(`${SUPPORT_BASE}/email/test`, data),

  // ── Call Center ───────────────────────────────────────────────────────
  getCallLogs: (filters: Record<string, unknown>) =>
    api.get(`${SUPPORT_BASE}/call-center/logs`, { params: filters }),
  getCallQueue: () => api.get(`${SUPPORT_BASE}/call-center/queue`),
  getCallMetrics: () => api.get(`${SUPPORT_BASE}/call-center/metrics`),
  updateCallRouting: (data: Record<string, unknown>) =>
    api.put(`${SUPPORT_BASE}/call-center/routing`, data),
  getIVRConfig: () => api.get(`${SUPPORT_BASE}/call-center/ivr`),
  updateIVRConfig: (data: Record<string, unknown>) =>
    api.put(`${SUPPORT_BASE}/call-center/ivr`, data),

  // ── Feedback & CSAT ───────────────────────────────────────────────────
  getFeedback: (filters: Record<string, unknown>) =>
    api.get(`${SUPPORT_BASE}/feedback`, { params: filters }),
  getCSATMetrics: () => api.get(`${SUPPORT_BASE}/feedback/csat`),
  getCSATByAgent: (agentId: string) =>
    api.get(`${SUPPORT_BASE}/feedback/csat/agent/${agentId}`),
  getCSATByCategory: () => api.get(`${SUPPORT_BASE}/feedback/csat/category`),
  getFeedbackTrend: (period: string) =>
    api.get(`${SUPPORT_BASE}/feedback/trend?period=${period}`),

  // ── NPS ───────────────────────────────────────────────────────────────
  getNPSScore: () => api.get(`${SUPPORT_BASE}/nps/score`),
  getNPSTrend: (period: string) => api.get(`${SUPPORT_BASE}/nps/trend?period=${period}`),
  getNPSResponses: (filters: Record<string, unknown>) =>
    api.get(`${SUPPORT_BASE}/nps/responses`, { params: filters }),
  getNPSBySegment: () => api.get(`${SUPPORT_BASE}/nps/segments`),
  sendNPSSurvey: (customerId: string) =>
    api.post(`${SUPPORT_BASE}/nps/survey/${customerId}`),

  // ── Support Analytics ─────────────────────────────────────────────────
  getAnalyticsOverview: () => api.get(`${SUPPORT_BASE}/analytics/overview`),
  getTicketVolumeAnalytics: (period: string) =>
    api.get(`${SUPPORT_BASE}/analytics/ticket-volume?period=${period}`),
  getResolutionTimeAnalytics: (period: string) =>
    api.get(`${SUPPORT_BASE}/analytics/resolution-time?period=${period}`),
  getAgentPerformanceAnalytics: (filters: Record<string, unknown>) =>
    api.get(`${SUPPORT_BASE}/analytics/agent-performance`, { params: filters }),
  getChannelAnalytics: (period: string) =>
    api.get(`${SUPPORT_BASE}/analytics/channels?period=${period}`),
  getCustomerSatisfactionAnalytics: (period: string) =>
    api.get(`${SUPPORT_BASE}/analytics/satisfaction?period=${period}`),
  getTrendingTopics: () => api.get(`${SUPPORT_BASE}/analytics/trending-topics`),
  getForecast: () => api.get(`${SUPPORT_BASE}/analytics/forecast`),
  exportAnalytics: (format: string, filters: Record<string, unknown>) =>
    api.get(`${SUPPORT_BASE}/analytics/export?format=${format}&${new URLSearchParams(filters as Record<string, string>).toString()}`),

  // ── Admin Support ─────────────────────────────────────────────────────
  getSupportAgents: (filters: Record<string, unknown>) =>
    api.get(`${SUPPORT_BASE}/admin/agents`, { params: filters }),
  getSupportTeams: () => api.get(`${SUPPORT_BASE}/admin/teams`),
  createSupportTeam: (data: Record<string, unknown>) =>
    api.post(`${SUPPORT_BASE}/admin/teams`, data),
  updateSupportTeam: (id: string, data: Record<string, unknown>) =>
    api.put(`${SUPPORT_BASE}/admin/teams/${id}`, data),
  getSupportSettings: () => api.get(`${SUPPORT_BASE}/admin/settings`),
  updateSupportSettings: (data: Record<string, unknown>) =>
    api.put(`${SUPPORT_BASE}/admin/settings`, data),
  getMacros: () => api.get(`${SUPPORT_BASE}/admin/macros`),
  createMacro: (data: Record<string, unknown>) =>
    api.post(`${SUPPORT_BASE}/admin/macros`, data),
  updateMacro: (id: string, data: Record<string, unknown>) =>
    api.put(`${SUPPORT_BASE}/admin/macros/${id}`, data),
  deleteMacro: (id: string) => api.delete(`${SUPPORT_BASE}/admin/macros/${id}`),
  getAutomationRules: () => api.get(`${SUPPORT_BASE}/admin/automation`),
  createAutomationRule: (data: Record<string, unknown>) =>
    api.post(`${SUPPORT_BASE}/admin/automation`, data),
  updateAutomationRule: (id: string, data: Record<string, unknown>) =>
    api.put(`${SUPPORT_BASE}/admin/automation/${id}`, data),
  deleteAutomationRule: (id: string) =>
    api.delete(`${SUPPORT_BASE}/admin/automation/${id}`),
} as const;

// ─── BI Platform Service ───────────────────────────────────────────────────
const BI_BASE = '/api/bi';

export const biService = {
  getExecutiveSummary: () => api.get(`${BI_BASE}/executive/summary`),
  getKPIOverview: (period: string) => api.get(`${BI_BASE}/kpi/overview?period=${period}`),
  getKPIMetricTrend: (metricName: string) => api.get(`${BI_BASE}/kpi/trend/${metricName}`),
  getBusinessHealth: () => api.get(`${BI_BASE}/executive/health`),
  getCustomerOverview: () => api.get(`${BI_BASE}/analytics/customers/overview`),
  getCustomerSegments: () => api.get(`${BI_BASE}/analytics/customers/segments`),
  getCustomerAcquisition: (period: string) => api.get(`${BI_BASE}/analytics/customers/acquisition?period=${period}`),
  getCustomerRetention: (period: string) => api.get(`${BI_BASE}/analytics/customers/retention?period=${period}`),
  getCustomerBehavior: () => api.get(`${BI_BASE}/analytics/customers/behavior`),
  getCustomer360: (customerId: string) => api.get(`${BI_BASE}/analytics/customers/360/${customerId}`),
  getMerchantOverview: () => api.get(`${BI_BASE}/analytics/merchants/overview`),
  getMerchantPerformance: (merchantId: string) => api.get(`${BI_BASE}/analytics/merchants/${merchantId}/performance`),
  getMerchantBenchmarks: (merchantId: string) => api.get(`${BI_BASE}/analytics/merchants/${merchantId}/benchmarks`),
  getDeliveryOverview: () => api.get(`${BI_BASE}/analytics/delivery/overview`),
  getDriverPerformance: (driverId: string) => api.get(`${BI_BASE}/analytics/delivery/drivers/${driverId}`),
  getZoneAnalytics: () => api.get(`${BI_BASE}/analytics/delivery/zones`),
  getDeliveryTrend: (period: string) => api.get(`${BI_BASE}/analytics/delivery/trend?period=${period}`),
  getFinanceOverview: () => api.get(`${BI_BASE}/analytics/finance/overview`),
  getRevenueBreakdown: () => api.get(`${BI_BASE}/analytics/finance/revenue-breakdown`),
  getCommissionSummary: () => api.get(`${BI_BASE}/analytics/finance/commission`),
  getPayoutSummary: () => api.get(`${BI_BASE}/analytics/finance/payouts`),
  getGSTReport: (period: string) => api.get(`${BI_BASE}/analytics/finance/gst?period=${period}`),
  getFinancialForecast: () => api.get(`${BI_BASE}/analytics/finance/forecast`),
  getMarketingOverview: () => api.get(`${BI_BASE}/analytics/marketing/overview`),
  getCampaignPerformance: (campaignId: string) => api.get(`${BI_BASE}/analytics/marketing/campaigns/${campaignId}`),
  getChannelPerformance: () => api.get(`${BI_BASE}/analytics/marketing/channels`),
  getProductOverview: () => api.get(`${BI_BASE}/analytics/products/overview`),
  getProductPerformance: (productId: string) => api.get(`${BI_BASE}/analytics/products/${productId}`),
  getCategoryAnalytics: () => api.get(`${BI_BASE}/analytics/products/categories`),
  getInventoryOverview: () => api.get(`${BI_BASE}/analytics/inventory/overview`),
  getProductInventory: (productId: string) => api.get(`${BI_BASE}/analytics/inventory/${productId}`),
  getReplenishmentSuggestions: () => api.get(`${BI_BASE}/analytics/inventory/replenishment`),
  getCohortMatrix: (cohortType: string) => api.get(`${BI_BASE}/analytics/cohort?type=${cohortType}`),
  getFunnelAnalysis: () => api.get(`${BI_BASE}/analytics/funnel`),
  getFunnelComparison: () => api.get(`${BI_BASE}/analytics/funnel/comparison`),
  getFunnelInsights: () => api.get(`${BI_BASE}/analytics/funnel/insights`),
  getHeatMapData: (city?: string) => api.get(`${BI_BASE}/analytics/heatmap${city ? `?city=${city}` : ''}`),
  getCityPerformance: () => api.get(`${BI_BASE}/analytics/cities`),
  getCityComparison: () => api.get(`${BI_BASE}/analytics/cities/comparison`),
  getCityHeatMap: (city: string) => api.get(`${BI_BASE}/analytics/cities/${city}/heatmap`),
  getExpansionOpportunities: () => api.get(`${BI_BASE}/analytics/cities/expansion-opportunities`),
  getCLVAnalysis: (customerId: string) => api.get(`${BI_BASE}/analytics/clv/${customerId}`),
  getCLVDistribution: () => api.get(`${BI_BASE}/analytics/clv/distribution`),
  getCLVForecast: () => api.get(`${BI_BASE}/analytics/clv/forecast`),
  getChurnOverview: () => api.get(`${BI_BASE}/analytics/churn/overview`),
  getChurnPrediction: (customerId: string) => api.get(`${BI_BASE}/analytics/churn/predict/${customerId}`),
  getChurnSegments: () => api.get(`${BI_BASE}/analytics/churn/segments`),
  generateReport: (type: string, format: string, period: string) =>
    api.post(`${BI_BASE}/reports/generate`, { type, format, period }),
  getReportTemplates: () => api.get(`${BI_BASE}/reports/templates`),
  getReportHistory: () => api.get(`${BI_BASE}/reports/history`),
  exportData: (dataType: string, format: string, filters: Record<string, unknown>) =>
    api.post(`${BI_BASE}/reports/export`, { dataType, format, filters }),
  getBIDashboardEmbedUrl: (tool: string, dashboardId: string) =>
    api.get(`${BI_BASE}/tools/${tool}/embed/${dashboardId}`),
  getPowerBIDatasets: () => api.get(`${BI_BASE}/tools/powerbi/datasets`),
  getLookerExplores: () => api.get(`${BI_BASE}/tools/looker/explores`),
  getMetabaseGuide: () => api.get(`${BI_BASE}/tools/metabase/guide`),
  getSupersetCharts: () => api.get(`${BI_BASE}/tools/superset/charts`),
  getWarehouseStats: () => api.get(`${BI_BASE}/warehouse/stats`),
  getWarehouseSchema: () => api.get(`${BI_BASE}/warehouse/schema`),
  getETLPipelineStatus: () => api.get(`${BI_BASE}/warehouse/etl/status`),
  runETLPipeline: (pipelineId: string) => api.post(`${BI_BASE}/warehouse/etl/run/${pipelineId}`),
  getSyncStatus: () => api.get(`${BI_BASE}/sync/status`),
  triggerSync: () => api.post(`${BI_BASE}/sync/trigger`),
  getIntegrationStatuses: () => api.get(`${BI_BASE}/integrations/status`),
} as const;
