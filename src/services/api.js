import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('luxe_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Handle responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message || error.message

    if (status === 401) {
      localStorage.removeItem('luxe_token')
      window.location.href = '/login'
    }

    if (status === 403) {
      console.warn('Access denied:', message)
    }

    if (status === 500) {
      console.error('Server error:', message)
    }

    return Promise.reject(error)
  }
)

export default api