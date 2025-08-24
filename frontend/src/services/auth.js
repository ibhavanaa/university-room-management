// src/services/auth.js
import api from './api';

export const authService = {
  login: (email, password) => {
    return api.post('/api/auth/login', { email, password });
  },

  register: (userData) => {
    return api.post('/api/auth/register', userData);
  },

  getProfile: () => {
    return api.get('/api/auth/profile');
  }
};