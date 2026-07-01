import api from './api';

const REVIEWS_PATH = '/reviews';

export const reviewService = {
  // Public
  getPublicReviews: async (page = 1, limit = 10) => {
    const res = await api.get(`${REVIEWS_PATH}/public?page=${page}&limit=${limit}`);
    return res.data;
  },
  
  getReviewStats: async () => {
    const res = await api.get(`${REVIEWS_PATH}/stats`);
    return res.data;
  },

  // Product reviews (Public)
  getProductReviews: async (productId, page = 1, limit = 10) => {
    const res = await api.get(`${REVIEWS_PATH}/product/${productId}?page=${page}&limit=${limit}`);
    return res.data;
  },

  getProductReviewStats: async (productId) => {
    const res = await api.get(`${REVIEWS_PATH}/product/${productId}/stats`);
    return res.data;
  },

  // User (authenticated)
  createReview: async (reviewData) => {
    const res = await api.post(`${REVIEWS_PATH}/create`, reviewData);
    return res.data;
  },

  // Admin
  getAllReviews: async (page = 1, limit = 20, status = 'all') => {
    const res = await api.get(`${REVIEWS_PATH}/admin/all?page=${page}&limit=${limit}&status=${status}`);
    return res.data;
  },

  getAdminReviewStats: async () => {
    const res = await api.get(`${REVIEWS_PATH}/admin/stats`);
    return res.data;
  },

  updateReviewStatus: async (id, updates) => {
    const res = await api.put(`${REVIEWS_PATH}/admin/status/${id}`, updates);
    return res.data;
  },

  deleteReview: async (id) => {
    const res = await api.delete(`${REVIEWS_PATH}/admin/${id}`);
    return res.data;
  }
};
