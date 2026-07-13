import api from './api';

// Products
export const getProducts = async (params?: any) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const searchProducts = async (query: string, params?: any) => {
  const response = await api.get('/search', { params: { q: query, ...params } });
  return response.data;
};

// Categories
export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const getCategoryById = async (id: string) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

// Banners
export const getBanners = async () => {
  const response = await api.get('/banners');
  return response.data;
};

// CMS Pages
export const getPageBySlug = async (slug: string) => {
  const response = await api.get(`/pages/${slug}`);
  return response.data;
};

// FAQ
export const getFAQs = async () => {
  const response = await api.get('/faq');
  return response.data;
};

// Testimonials
export const getTestimonials = async () => {
  const response = await api.get('/testimonials');
  return response.data;
};

// Cities
export const getCities = async () => {
  const response = await api.get('/cities');
  return response.data;
};

// Brands
export const getBrands = async () => {
  const response = await api.get('/brands');
  return response.data;
};

// Blog
export const getBlogPosts = async (params?: any) => {
  const response = await api.get('/blog', { params });
  return response.data;
};

export const getBlogPostBySlug = async (slug: string) => {
  const response = await api.get(`/blog/${slug}`);
  return response.data;
};

// Careers
export const getJobListings = async (params?: any) => {
  const response = await api.get('/careers', { params });
  return response.data;
};

export const getJobById = async (id: string) => {
  const response = await api.get(`/careers/${id}`);
  return response.data;
};

// Auth
export const login = async (data: any) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const register = async (data: any) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

// Cart
export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const addToCart = async (item: any) => {
  const response = await api.post('/cart', item);
  return response.data;
};

export const updateCartItem = async (id: string, data: any) => {
  const response = await api.put(`/cart/${id}`, data);
  return response.data;
};

export const removeFromCart = async (id: string) => {
  const response = await api.delete(`/cart/${id}`);
  return response.data;
};

// Orders
export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const createOrder = async (orderData: any) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getOrderById = async (id: string) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};