import api from './api';

export const reportService = {
  async createReport(formData) {
    const response = await api.post('/api/report', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async getUserReports() {
    const response = await api.get('/api/report/user-report');
    return response.data;
  },

  async getAllReports() {
    const response = await api.get('/api/report/all-report');
    return response.data;
  },

  async updateReport(id) {
    const response = await api.put(`/api/report/${id}`);
    return response.data;
  },

  async deleteReport(id) {
    const response = await api.delete(`/api/report/${id}`);
    return response.data;
  },
};
