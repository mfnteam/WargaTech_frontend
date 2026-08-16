import api from './api';

export const healthService = {
  async getServices(type) {
    const params = type ? { type } : {};
    const response = await api.get('/api/service', { params });
    return response.data;
  },

  async createBooking(data) {
    const response = await api.post('/api/service', data);
    return response.data;
  },

  async getUserBookings() {
    const response = await api.get('/api/service/user-booking');
    return response.data;
  },

  async getAllBookings() {
    const response = await api.get('/api/service/all-booking');
    return response.data;
  },

  async acceptBooking(id) {
    const response = await api.put(`/api/service/accept-booking/${id}`);
    return response.data;
  },

  async rejectBooking(id) {
    const response = await api.put(`/api/service/reject-booking/${id}`);
    return response.data;
  },
};
