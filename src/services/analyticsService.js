import api from './api';

export const analyticsService = {
  async getSummary() {
    const res = await api.get('/analytics/summary');
    return res.data;
  },

  async getChartData() {
    const res = await api.get('/analytics/chart');
    return res.data;
  },
};
