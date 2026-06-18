import api from './api';

export const adminService = {
  async getPlatformStats() {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  async getUsers(params = {}) {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },

  async saveMargin(margin) {
    const res = await api.put('/admin/margin', { margin });
    return res.data;
  },

  async verifySupplier(id) {
    const res = await api.put(`/admin/users/${id}/verify`);
    return res.data;
  },
};
