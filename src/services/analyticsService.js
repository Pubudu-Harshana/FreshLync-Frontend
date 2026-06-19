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

  async getEarnings() {
    // Simulated mock endpoint data for supplier earnings
    return {
      revenueSummary: {
        totalEarned: 18450.50,
        pendingPayout: 1250.00,
        availablePayout: 4320.50,
        completedPayout: 12880.00
      },
      payouts: [
        { id: 'PAY-7821', date: 'Jun 15, 2026', amount: 1540.00, method: 'Direct Deposit', status: 'Completed' },
        { id: 'PAY-7802', date: 'Jun 01, 2026', amount: 2450.50, method: 'Direct Deposit', status: 'Completed' },
        { id: 'PAY-7756', date: 'May 15, 2026', amount: 3120.00, method: 'Direct Deposit', status: 'Completed' },
        { id: 'PAY-7711', date: 'May 01, 2026', amount: 2890.00, method: 'Direct Deposit', status: 'Completed' },
        { id: 'PAY-7622', date: 'Apr 15, 2026', amount: 2879.50, method: 'Direct Deposit', status: 'Completed' }
      ],
      breakdown: [
        { orderId: 'ORD-9019', date: 'Jun 17, 2026', amount: 350.25, fee: 35.02, net: 315.23, status: 'Pending' },
        { orderId: 'ORD-9018', date: 'Jun 16, 2026', amount: 890.00, fee: 89.00, net: 801.00, status: 'Pending' },
        { orderId: 'ORD-9017', date: 'Jun 14, 2026', amount: 1200.00, fee: 120.00, net: 1080.00, status: 'Available' },
        { orderId: 'ORD-9012', date: 'Jun 12, 2026', amount: 450.00, fee: 45.00, net: 405.00, status: 'Paid' }
      ]
    };
  },

  async getNotifications() {
    try {
      const res = await api.get('/notifications');
      return res.data.map(n => ({
        ...n,
        id: n._id
      }));
    } catch {
      return [
        { id: '1', title: 'New Order Received', message: 'You have a new order ORD-9019 for Organic Curly Kale.', type: 'order', read: false, createdAt: new Date(Date.now() - 15 * 60 * 1000) },
        { id: '2', title: 'Low Stock Alert', message: 'Your stock for Mixed Bell Peppers is below 50 units (currently 42).', type: 'stock', read: false, createdAt: new Date(Date.now() - 2 * 3600 * 1000) },
        { id: '3', title: 'Profile Verified', message: 'Your supplier profile verification has been approved by Admin.', type: 'system', read: true, createdAt: new Date(Date.now() - 24 * 3600 * 1000) },
        { id: '4', title: 'Payout Scheduled', message: 'Your payout of £1,540.00 is scheduled for processing.', type: 'payout', read: true, createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000) }
      ];
    }
  },

  async markNotificationAsRead(id) {
    const res = await api.put(`/notifications/${id}/read`);
    return res.data;
  },

  async markAllNotificationsAsRead() {
    const res = await api.put('/notifications/read-all');
    return res.data;
  },

  async deleteNotification(id) {
    const res = await api.delete(`/notifications/${id}`);
    return res.data;
  }

};
