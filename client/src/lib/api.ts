import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shopManagerToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Sale endpoints
export const saleApi = {
  getAll: () => api.get('/sales'),
  create: (data: { type: 'cash' | 'mobile_banking'; amount: number }) =>
    api.post('/sales', data),
  delete: (id: string) => api.delete(`/sales/${id}`),
  getStats: () => api.get('/sales/stats/overview'),
  getTodayBreakdown: () => api.get('/sales/today/breakdown'),
  getChart: () => api.get('/sales/chart/last7days'),
};

// Expense endpoints
export const expenseApi = {
  getAll: () => api.get('/expenses'),
  create: (data: { reason: string; amount: number }) =>
    api.post('/expenses', data),
  delete: (id: string) => api.delete(`/expenses/${id}`),
  getStats: () => api.get('/expenses/stats/overview'),
};

// Credit endpoints
export const creditApi = {
  getAll: () => api.get('/credits'),
  create: (data: { ownerName: string; amount: number }) =>
    api.post('/credits', data),
  update: (id: string, data: { isPaid: boolean }) =>
    api.patch(`/credits/${id}`, data),
  delete: (id: string) => api.delete(`/credits/${id}`),
  getStats: () => api.get('/credits/stats/outstanding'),
};

export default api;
