import api from './api';

export const productService = {
  async getProducts(params = {}) {
    const res = await api.get('/products', { params });
    return res.data;
  },

  async getProduct(id) {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },

  async createProduct(formData) {
    const res = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async updateProduct(id, data) {
    const res = await api.put(`/products/${id}`, data);
    return res.data;
  },

  async deleteProduct(id) {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },

  async updateStock(id, stock) {
    const res = await api.patch(`/products/${id}/stock`, { stock });
    return res.data;
  },
};
