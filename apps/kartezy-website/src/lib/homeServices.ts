import api from './api';

// Homepage sections
export const getHeroData = async () => {
  const response = await api.get('/home/hero');
  return response.data;
};

export const getFeaturesData = async () => {
  const response = await api.get('/home/features');
  return response.data;
};

export const getHowItWorksData = async () => {
  const response = await api.get('/home/how-it-works');
  return response.data;
};

export const getCategoriesData = async () => {
  const response = await api.get('/home/categories');
  return response.data;
};

export const getDownloadAppData = async () => {
  const response = await api.get('/home/download-app');
  return response.data;
};

export const getTestimonialsData = async () => {
  const response = await api.get('/home/testimonials');
  return response.data;
};

export const getCitiesData = async () => {
  const response = await api.get('/home/cities');
  return response.data;
};

export const getBrandsData = async () => {
  const response = await api.get('/home/brands');
  return response.data;
};

export const getFAQData = async () => {
  const response = await api.get('/home/faq');
  return response.data;
};

export const getNewsletterData = async () => {
  const response = await api.get('/home/newsletter');
  return response.data;
};