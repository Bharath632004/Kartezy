import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(
          '/auth/refresh',
          { refreshToken }
        );
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        // If refresh fails, redirect to login
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Service functions for each entity

export const customerService = {
  getList: (params: any) => api.get('/api/users', { params }),
  getDetail: (id: string) => api.get(`/api/users/${id}`),
  blockUser: (id: string) => api.put(`/api/users/${id}/block`),
  unblockUser: (id: string) => api.put(`/api/users/${id}/unblock`),
  deleteUser: (id: string) => api.delete(`/api/users/${id}`),
  getWallet: (id: string) => api.get(`/api/users/${id}/wallet`),
  getOrders: (id: string) => api.get(`/api/users/${id}/orders`),
  getLoginHistory: (id: string) => api.get(`/api/users/${id}/login-history`),
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
