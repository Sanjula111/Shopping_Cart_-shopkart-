import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('shopkart_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle global errors (e.g. 401 → logout)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('shopkart_token');
      localStorage.removeItem('shopkart_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register:       (data) => API.post('/auth/register', data),
  login:          (data) => API.post('/auth/login', data),
  getMe:          ()     => API.get('/auth/me'),
  updateProfile:  (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/change-password', data),
};

// ─── Categories ───────────────────────────────────────────────────────────────
export const categoryAPI = {
  getAll:    ()         => API.get('/categories'),
  getOne:    (id)       => API.get(`/categories/${id}`),
  create:    (data)     => API.post('/categories', data),
  update:    (id, data) => API.put(`/categories/${id}`, data),
  remove:    (id)       => API.delete(`/categories/${id}`),
};

// ─── Products ─────────────────────────────────────────────────────────────────
export const productAPI = {
  getAll:      (params) => API.get('/products', { params }),
  getAdminAll: ()       => API.get('/products/admin/all'),
  getOne:      (id)     => API.get(`/products/${id}`),
  create:      (data)   => API.post('/products', data),
  update:      (id, data) => API.put(`/products/${id}`, data),
  remove:      (id)     => API.delete(`/products/${id}`),
};

// ─── Cart ─────────────────────────────────────────────────────────────────────
export const cartAPI = {
  get:    ()                      => API.get('/cart'),
  add:    (productId, quantity)   => API.post('/cart', { productId, quantity }),
  update: (productId, quantity)   => API.put(`/cart/${productId}`, { quantity }),
  remove: (productId)             => API.delete(`/cart/${productId}`),
  clear:  ()                      => API.delete('/cart'),
};

// ─── Orders ───────────────────────────────────────────────────────────────────
export const orderAPI = {
  place:        (data) => API.post('/orders', data),
  getMy:        ()     => API.get('/orders/my'),
  getOne:       (id)   => API.get(`/orders/${id}`),
  getAll:       ()     => API.get('/orders'),
  updateStatus: (id, data) => API.put(`/orders/${id}/status`, data),
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getStats:         ()   => API.get('/admin/stats'),
  getUsers:         ()   => API.get('/admin/users'),
  toggleUserStatus: (id) => API.put(`/admin/users/${id}/toggle`),
};

export default API;
