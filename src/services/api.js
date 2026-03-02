import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const authApi = {
  login: (email, password) =>
    api.post('/api/auth/login', { email, password }),

  register: (username, email, password) =>
    api.post('/api/auth/register', { username, email, password }),

  getMe: () =>
    api.get('/api/auth/me'),

  forgotPassword: (email) =>
    api.post('/api/auth/forgot-password', { email }),

  verifyOtp: (email, code) =>
    api.post('/api/auth/verify-otp', { email, code }),

  resetPassword: (email, code, new_password) =>
    api.post('/api/auth/reset-password', { email, code, new_password }),
}

export const calculationApi = {
  save: (role, normalized, raw) =>
    api.post('/api/calculations', { role, normalized, raw }),

  getAll: (limit = 20, offset = 0) =>
    api.get('/api/calculations', { params: { limit, offset } }),

  getOne: (id) =>
    api.get(`/api/calculations/${id}`),

  remove: (id) =>
    api.delete(`/api/calculations/${id}`),
}

export default api
