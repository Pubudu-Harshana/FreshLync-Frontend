import api from './api';

export const orderService = {
  async getOrders(params = {}) {
    const res = await api.get('/orders', { params });
    return res.data;
  },

  async getOrder(id) {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },

  async getSupplierOrders(params = {}) {
    return this.getOrders(params);
  },

  async placeOrder(data) {
    const res = await api.post('/orders', data);
    return res.data;
  },

  async updateStatus(id, status) {
    const res = await api.put(`/orders/${id}/status`, { status });
    return res.data;
  },

  async updateOrderStatus(id, status) {
    return this.updateStatus(id, status);
  },
};
