import axios from 'axios';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';

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
  register: async (email, password, name) => {
    try {
      // 1. Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Atualizar perfil com nome
      await updateProfile(userCredential.user, { displayName: name });
      
      // 3. Obter ID token
      const idToken = await userCredential.user.getIdToken();
      
      // 4. Registrar no backend (Firestore)
      const response = await api.post('/auth/register', { email, password, name, idToken });
      return response;
    } catch (error) {
      // Tratar erros específicos do Firebase
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Este email já está em uso');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Email inválido');
      }
      throw error;
    }
  },
  login: async (email, password) => {
    try {
      // 1. Autenticar com Firebase (valida senha)
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // 2. Obter ID token do Firebase
      const idToken = await userCredential.user.getIdToken();
      
      // 3. Enviar idToken para backend validar e gerar JWT customizado
      const response = await api.post('/auth/login', { email, idToken });
      return response;
    } catch (error) {
      // Firebase retorna erros específicos de autenticação
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        throw new Error('Email ou senha inválidos');
      }
      throw error;
    }
  },
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
