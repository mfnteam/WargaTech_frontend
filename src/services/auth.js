import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  async register(data) {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  async logout() {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  async verifyEmail(email, code) {
    const response = await api.post('/api/auth/verify-email', { email, code: parseInt(code) });
    return response.data;
  },

  async resendOTP() {
    const response = await api.post('/api/auth/resend');
    return response.data;
  },
};
