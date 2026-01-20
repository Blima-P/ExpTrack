import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API URL configurada:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adicionar token ao header de cada requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  register: (email, password, name) =>
    api.post('/auth/register', { email, password, name }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  getMe: () =>
    api.get('/auth/me'),
  resetPassword: (email) =>
    api.post('/auth/reset-password', { email }),
};

// Category Service
export const categoryService = {
  getCategories: () =>
    api.get('/categories'),
  createCategory: (name, color) =>
    api.post('/categories', { name, color }),
  updateCategory: (id, name, color) =>
    api.put(`/categories/${id}`, { name, color }),
  deleteCategory: (id) =>
    api.delete(`/categories/${id}`),
};

// Expense Service
export const expenseService = {
  getExpenses: (categoryId = null) => {
    const params = {};
    if (categoryId) {
      params.categoryId = categoryId;
    }
    return api.get('/expenses', { params });
  },
  createExpense: (value, description, categoryId) =>
    api.post('/expenses', { amount: value, description, categoryId }),
  updateExpense: (id, value, description, categoryId) =>
    api.put(`/expenses/${id}`, { amount: value, description, categoryId }),
  deleteExpense: (id) =>
    api.delete(`/expenses/${id}`),
};

// User Service
export const userService = {
  getProfile: () =>
    api.get('/users/profile'),
  updateProfile: (name, email) =>
    api.put('/users/profile', { name, email }),
};

export default api;
