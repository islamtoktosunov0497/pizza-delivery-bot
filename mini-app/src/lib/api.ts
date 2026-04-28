import axios from 'axios';

// Uses Next.js API routes which proxy to the backend server-side
const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

export const getCategories = async (lang?: string) => {
  const response = await api.get('/categories', { params: { lang } });
  return response.data;
};

export const getProducts = async (lang?: string) => {
  const response = await api.get('/products', { params: { lang } });
  return response.data;
};

export const createOrder = async (orderData: any) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getUserOrders = async (telegramId: string | number, lang?: string) => {
  const response = await api.get(`/orders/${telegramId}`, { params: { lang } });
  return response.data;
};

export default api;
