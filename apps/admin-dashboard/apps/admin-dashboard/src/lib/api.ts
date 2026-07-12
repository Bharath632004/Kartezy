import axios from 'axios';

// Create an axios instance with base URL from environment
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  // You can add default headers here
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If the error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
        if (!refreshToken) throw new Error('No refresh token');

        // Call refresh token endpoint (adjust URL as per your auth service)
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        console.error('Refresh token failed', refreshError);
        // You can redirect to login here
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),

  logout: () =>
    api.post('/auth/logout'),

  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),

  getCurrentUser: () =>
    api.get('/auth/me'),
};

// Dashboard Service
export const dashboardService = {
  getStats: () =>
    api.get('/dashboard/stats'),

  getRecentActivity: () =>
    api.get('/dashboard/recent-activity'),

  getLiveOrders: () =>
    api.get('/dashboard/live-orders'),

  getSystemHealth: () =>
    api.get('/dashboard/system-health'),
};

// Users Service
export const usersService = {
  getUsers: (params?: { page?: number; limit?: number; search?: string; role?: string }) =>
    api.get('/users', { params }),

  getUserById: (id: string) =>
    api.get(`/users/${id}`),

  createUser: (userData: any) =>
    api.post('/users', userData),

  updateUser: (id: string, userData: any) =>
    api.put(`/users/${id}`, userData),

  deleteUser: (id: string) =>
    api.delete(`/users/${id}`),

  toggleUserStatus: (id: string, status: boolean) =>
    api.patch(`/users/${id}/status`, { status }),
};

// Merchants Service
export const merchantsService = {
  getMerchants: (params?: { page?: number; limit?: number; search?: string; status?: string }) =>
    api.get('/merchants', { params }),

  getMerchantById: (id: string) =>
    api.get(`/merchants/${id}`),

  createMerchant: (merchantData: any) =>
    api.post('/merchants', merchantData),

  updateMerchant: (id: string, merchantData: any) =>
    api.put(`/merchants/${id}`, merchantData),

  deleteMerchant: (id: string) =>
    api.delete(`/merchants/${id}`),

  approveMerchant: (id: string) =>
    api.post(`/merchants/${id}/approve`),

  rejectMerchant: (id: string, reason: string) =>
    api.post(`/merchants/${id}/reject`, { reason }),

  getMerchantAnalytics: (id: string) =>
    api.get(`/merchants/${id}/analytics`),
};

// Orders Service
export const ordersService = {
  getOrders: (params?: { page?: number; limit?: number; status?: string; startDate?: string; endDate?: string }) =>
    api.get('/orders', { params }),

  getOrderById: (id: string) =>
    api.get(`/orders/${id}`),

  updateOrderStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),

  assignOrder: (id: string, deliveryPartnerId: string) =>
    api.post(`/orders/${id}/assign`, { deliveryPartnerId }),

  cancelOrder: (id: string, reason: string) =>
    api.post(`/orders/${id}/cancel`, { reason }),

  refundOrder: (id: string, amount: number, reason: string) =>
    api.post(`/orders/${id}/refund`, { amount, reason }),

  getOrderTimeline: (id: string) =>
    api.get(`/orders/${id}/timeline`),
};

// Products Service
export const productsService = {
  getProducts: (params?: { page?: number; limit?: number; search?: string; categoryId?: string }) =>
    api.get('/products', { params }),

  getProductById: (id: string) =>
    api.get(`/products/${id}`),

  createProduct: (productData: any) =>
    api.post('/products', productData),

  updateProduct: (id: string, productData: any) =>
    api.put(`/products/${id}`, productData),

  deleteProduct: (id: string) =>
    api.delete(`/products/${id}`),

  updateProductInventory: (id: string, quantity: number) =>
    api.patch(`/products/${id}/inventory`, { quantity }),

  getProductVariants: (productId: string) =>
    api.get(`/products/${productId}/variants`),
};

// Inventory Service
export const inventoryService = {
  getInventory: (params?: { page?: number; limit?: number; lowStockOnly?: boolean }) =>
    api.get('/inventory', { params }),

  getInventoryItem: (id: string) =>
    api.get(`/inventory/${id}`),

  updateInventoryLevel: (id: string, quantity: number) =>
    api.patch(`/inventory/${id}`, { quantity }),

  getLowStockItems: () =>
    api.get('/inventory/low-stock'),

  getInventoryMovements: (params?: { productId?: string; startDate?: string; endDate?: string }) =>
    api.get('/inventory/movements', { params }),
};

// Finance Service
export const financeService = {
  getRevenue: (params?: { period?: string; startDate?: string; endDate?: string }) =>
    api.get('/finance/revenue', { params }),

  getPayments: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/finance/payments', { params }),

  getRefunds: (params?: { page?: number; limit?: number }) =>
    api.get('/finance/refunds', { params }),

  getWalletTransactions: (params?: { page?: number; limit?: number }) =>
    api.get('/finance/wallet', { params }),

  getSettlements: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/finance/settlements', { params }),

  getTaxReports: (params?: { period?: string }) =>
    api.get('/finance/tax', { params }),
};

// Delivery Service
export const deliveryService = {
  getDeliveryPartners: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/delivery/partners', { params }),

  getDeliveryPartnerById: (id: string) =>
    api.get(`/delivery/partners/${id}`),

  updateDeliveryPartnerStatus: (id: string, status: string) =>
    api.patch(`/delivery/partners/${id}/status`, { status }),

  getDeliveryAssignments: (params?: { deliveryPartnerId?: string; date?: string }) =>
    api.get('/delivery/assignments', { params }),

  getDeliveryEarnings: (params?: { deliveryPartnerId?: string; period?: string }) =>
    api.get('/delivery/earnings', { params }),

  getLiveTracking: (deliveryPartnerId: string) =>
    api.get(`/delivery/tracking/${deliveryPartnerId}`),
};

// Analytics Service
export const analyticsService = {
  getSalesAnalytics: (params?: { period?: string; startDate?: string; endDate?: string }) =>
    api.get('/analytics/sales', { params }),

  getCustomerAnalytics: (params?: { period?: string }) =>
    api.get('/analytics/customers', { params }),

  getProductAnalytics: (params?: { period?: string }) =>
    api.get('/analytics/products', { params }),

  getConversionFunnel: (params?: { startDate?: string; endDate?: string }) =>
    api.get('/analytics/conversion-funnel', { params }),

  getCohortAnalysis: (params?: { cohortType?: string; period?: string }) =>
    api.get('/analytics/cohort', { params }),
};

// Marketing Service
export const marketingService = {
  getCampaigns: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/marketing/campaigns', { params }),

  getCampaignById: (id: string) =>
    api.get(`/marketing/campaigns/${id}`),

  createCampaign: (campaignData: any) =>
    api.post('/marketing/campaigns', campaignData),

  updateCampaign: (id: string, campaignData: any) =>
    api.put(`/marketing/campaigns/${id}`, campaignData),

  deleteCampaign: (id: string) =>
    api.delete(`/marketing/campaigns/${id}`),

  getPromotions: (params?: { page?: number; limit?: number; activeOnly?: boolean }) =>
    api.get('/marketing/promotions', { params }),

  getCoupons: (params?: { page?: number; limit?: number }) =>
    api.get('/marketing/coupons', { params }),

  getReferralProgram: () =>
    api.get('/marketing/referral-program'),
};

// CMS Service
export const cmsService = {
  getPages: (params?: { page?: number; limit?: number; publishedOnly?: boolean }) =>
    api.get('/cms/pages', { params }),

  getPageById: (id: string) =>
    api.get(`/cms/pages/${id}`),

  createPage: (pageData: any) =>
    api.post('/cms/pages', pageData),

  updatePage: (id: string, pageData: any) =>
    api.put(`/cms/pages/${id}`, pageData),

  deletePage: (id: string) =>
    api.delete(`/cms/pages/${id}`),

  getBlogPosts: (params?: { page?: number; limit?: number; publishedOnly?: boolean }) =>
    api.get('/cms/blog', { params }),

  getMediaFiles: (params?: { page?: number; limit?: number }) =>
    api.get('/cms/media', { params }),

  uploadMedia: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/cms/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Reports Service
export const reportsService = {
  getSalesReport: (params?: { period?: string; startDate?: string; endDate?: string }) =>
    api.get('/reports/sales', { params }),

  getInventoryReport: () =>
    api.get('/reports/inventory'),

  getUserReport: () =>
    api.get('/reports/users'),

  getFinancialReport: (params?: { period?: string }) =>
    api.get('/reports/financial', { params }),

  exportReport: (type: string, format: 'PDF' | 'EXCEL' | 'CSV', params?: any) =>
    api.post(`/reports/${type}/export`, { format, ...params }, {
      responseType: 'blob',
    }),
};

// Support Service
export const supportService = {
  getTickets: (params?: { page?: number; limit?: number; status?: string; priority?: string }) =>
    api.get('/support/tickets', { params }),

  getTicketById: (id: string) =>
    api.get(`/support/tickets/${id}`),

  createTicket: (ticketData: any) =>
    api.post('/support/tickets', ticketData),

  updateTicket: (id: string, ticketData: any) =>
    api.put(`/support/tickets/${id}`, ticketData),

  resolveTicket: (id: string, resolution: string) =>
    api.post(`/support/tickets/${id}/resolve`, { resolution }),

  assignTicket: (id: string, agentId: string) =>
    api.post(`/support/tickets/${id}/assign`, { agentId }),

  getKnowledgeBase: (params?: { category?: string; search?: string }) =>
    api.get('/support/kb', { params }),
};

// Settings Service
export const settingsService = {
  getGeneralSettings: () =>
    api.get('/settings/general'),

  updateGeneralSettings: (settingsData: any) =>
    api.put('/settings/general', settingsData),

  getPaymentSettings: () =>
    api.get('/settings/payment'),

  updatePaymentSettings: (settingsData: any) =>
    api.put('/settings/payment', settingsData),

  getNotificationSettings: () =>
    api.get('/settings/notification'),

  updateNotificationSettings: (settingsData: any) =>
    api.put('/settings/notification', settingsData),

  getSecuritySettings: () =>
    api.get('/settings/security'),

  updateSecuritySettings: (settingsData: any) =>
    api.put('/settings/security', settingsData),
};

export default api;