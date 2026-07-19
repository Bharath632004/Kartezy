import api from './api';

const BI_BASE = '/api/bi';

export const biService = {
  getExecutiveDashboard: (start: string, end: string) =>
    api.get(BI_BASE + '/executive-dashboard', { params: { start, end } }),
  getCustomerAnalytics: (start: string, end: string) =>
    api.get(BI_BASE + '/customer-analytics', { params: { start, end } }),
  getMerchantAnalytics: (start: string, end: string) =>
    api.get(BI_BASE + '/merchant-analytics', { params: { start, end } }),
  getDeliveryAnalytics: (start: string, end: string) =>
    api.get(BI_BASE + '/delivery-analytics', { params: { start, end } }),
  getProductAnalytics: (start: string, end: string) =>
    api.get(BI_BASE + '/product-analytics', { params: { start, end } }),
  getCohortAnalysis: (cohortType: string) =>
    api.get(BI_BASE + '/cohort-analysis', { params: { cohortType } }),
  getFunnelAnalysis: () => api.get(BI_BASE + '/funnel-analysis'),
  getCLV: () => api.get(BI_BASE + '/clv'),
  getChurnPrediction: () => api.get(BI_BASE + '/churn-prediction'),
  getInventoryAnalytics: () => api.get(BI_BASE + '/inventory-analytics'),
  getCityAnalytics: () => api.get(BI_BASE + '/city-analytics'),
  getMarketingAnalytics: () => api.get(BI_BASE + '/marketing-analytics'),
  getHeatmapData: (days: number) =>
    api.get(BI_BASE + '/heatmap', { params: { days } }),
  exportData: (data: any[], format: string, filename: string) =>
    api.post(BI_BASE + '/export', { data, format, filename }, { responseType: 'blob' }),
};
