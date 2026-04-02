import api from './api'

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
  getByCategory: (cat) => api.get(`/products/category/${cat}`),
  search: (q) => api.get('/products/search', { params: { q } }),
  addReview: (id, data) => api.post(`/products/${id}/reviews`, data),
}
