import api from './api'

export const rentalAPI = {
  getAll: (params) => api.get('/rentals', { params }),
  getById: (id) => api.get(`/rentals/${id}`),
  create: (data) => api.post('/rentals', data),
  getUserRentals: () => api.get('/rentals/my'),
  return: (id) => api.put(`/rentals/${id}/return`),
  extend: (id, data) => api.put(`/rentals/${id}/extend`, data),
  getAvailable: () => api.get('/rentals/available'),
}

export const aiAPI = {
  chat: (messages) => api.post('/ai/chat', { messages }),
  getHistory: () => api.get('/ai/history'),
  clearHistory: () => api.delete('/ai/history'),
  getUsage: () => api.get('/ai/usage'),
}

export const paymentAPI = {
  createOrder: (data) => api.post('/payments/order', data),
  verify: (data) => api.post('/payments/verify', data),
  upgradePremium: (data) => api.post('/payments/premium', data),
  getHistory: () => api.get('/payments/history'),
}

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my'),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
}

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getOrders: (params) => api.get('/admin/orders', { params }),
  getInventory: () => api.get('/admin/inventory'),
  getRentalAnalytics: () => api.get('/admin/rentals/analytics'),
  getAIStats: () => api.get('/admin/ai/stats'),
  getRevenue: () => api.get('/admin/revenue'),
}
