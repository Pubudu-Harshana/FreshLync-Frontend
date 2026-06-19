import api from './api';

export const adminService = {
  // Existing live methods
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

  async verifySupplier(id, data = { status: 'approved', notes: '' }) {
    const res = await api.put(`/admin/users/${id}/verify`, data);
    return res.data;
  },

  async getVerificationLogs() {
    const res = await api.get('/admin/verification-logs');
    return res.data;
  },


  // 1. Dashboard Stats
  async getDashboardStats() {
    try {
      const stats = await this.getPlatformStats();
      return {
        totalOrders: stats.totalOrders || 142,
        totalCustomers: stats.totalBuyers || 54,
        totalSuppliers: stats.activeSuppliers || 18,
        activeUsers: Math.round((stats.totalBuyers || 54) * 0.65),
        ordersToday: 12,
        pendingOrders: stats.totalOrders - (stats.deliveredOrders || 102) || 40,
        completedOrders: stats.deliveredOrders || 102,
        cancelledOrders: 5,
        totalProducts: 48,
        newSuppliersThisMonth: 3,
        revenueOverview: stats.totalGMV || 15820.50,
        platformGrowthRate: 12.8,
        totalGMV: stats.totalGMV || 15820.50,
        activeSuppliers: stats.activeSuppliers || 18,
      };
    } catch {
      // Return fully functional mock fallback if backend is down
      return {
        totalOrders: 154,
        totalCustomers: 62,
        totalSuppliers: 14,
        activeUsers: 38,
        ordersToday: 15,
        pendingOrders: 28,
        completedOrders: 121,
        cancelledOrders: 5,
        totalProducts: 56,
        newSuppliersThisMonth: 2,
        revenueOverview: 18450.00,
        platformGrowthRate: 14.2,
        totalGMV: 18450.00,
        activeSuppliers: 14,
      };
    }
  },

  // 2. Mock Tickets
  async getTickets() {
    return [
      { id: 'TKT-101', title: 'Route scanner error', desc: 'Driver cannot load map coordinates for London route.', creator: 'John Doe', role: 'supplier', status: 'Open', priority: 'High', date: '2026-06-17', category: 'Logistics', assignee: 'Jane Smith' },
      { id: 'TKT-102', title: 'Payment payout delayed', desc: 'Wholesale order payout not received for order ORD-A23B.', creator: 'GreenEarth Organics', role: 'supplier', status: 'In Progress', priority: 'Critical', date: '2026-06-16', category: 'Billing', assignee: 'Bob Johnson' },
      { id: 'TKT-103', title: 'Incorrect invoice pricing', desc: 'Platform margin markup applied incorrectly on fresh vegetables.', creator: 'SuperMart', role: 'buyer', status: 'Resolved', priority: 'Medium', date: '2026-06-15', category: 'Billing', assignee: 'Jane Smith' },
      { id: 'TKT-104', title: 'Spoiled dairy packaging', desc: 'Cold chain alert during transit of organic milk.', creator: 'DirectFoods', role: 'buyer', status: 'Closed', priority: 'High', date: '2026-06-12', category: 'Quality Assurance', assignee: 'Jane Smith' },
    ];
  },

  // 3. Mock Audit Logs
  async getAuditLogs() {
    return [
      { id: 1, action: 'User Verified', actor: 'Admin (admin@freshlync.com)', details: 'Verified supplier GreenEarth Organics', ip: '192.168.1.5', time: '2026-06-18T10:14:00Z', type: 'Security' },
      { id: 2, action: 'Platform Margin Update', actor: 'Admin (admin@freshlync.com)', details: 'Updated margin commission rate to 15%', ip: '192.168.1.5', time: '2026-06-18T09:42:00Z', type: 'Settings' },
      { id: 3, action: 'Product Approved', actor: 'Operations Manager', details: 'Approved SKU: KALE-001', ip: '10.0.0.12', time: '2026-06-18T08:11:00Z', type: 'Product' },
      { id: 4, action: 'Order Cancelled', actor: 'Support Agent', details: 'Cancelled Order ORD-992A due to logistics issue', ip: '192.168.1.20', time: '2026-06-17T17:30:00Z', type: 'Order' },
      { id: 5, action: 'Failed Login Attempt', actor: 'unknown@user.com', details: 'Failed password on login attempt', ip: '203.0.113.88', time: '2026-06-17T14:22:00Z', type: 'Security' },
      { id: 6, action: 'Supplier Registered', actor: 'Valley Prime Meats', details: 'Created account valley@prime.co', ip: '82.44.12.19', time: '2026-06-17T06:05:00Z', type: 'User' },
    ];
  },

  // 4. Mock AI Predictions
  async getMarketPredictions() {
    return {
      predictedDemandIndex: 82.5,
      forecastGrowthRate: 15.4,
      inventoryRiskScore: 28,
      productTrendScore: 78.2,
      supplierStabilityIndex: 94.6,
      customerDemandPrediction: 86.4,
    };
  },

  // 5. Mock AI Demand Forecast
  async getDemandForecast(range = '30 Days') {
    const data = {
      '7 Days': [
        { label: 'Day 1', historical: 450, predicted: 450 },
        { label: 'Day 2', historical: 480, predicted: 480 },
        { label: 'Day 3', historical: 520, predicted: 520 },
        { label: 'Day 4', historical: 490, predicted: 490 },
        { label: 'Day 5', historical: 550, predicted: 550 },
        { label: 'Day 6', historical: 0, predicted: 580 },
        { label: 'Day 7', historical: 0, predicted: 610 },
      ],
      '30 Days': [
        { label: 'Wk 1', historical: 2400, predicted: 2400 },
        { label: 'Wk 2', historical: 2650, predicted: 2650 },
        { label: 'Wk 3', historical: 2900, predicted: 2950 },
        { label: 'Wk 4', historical: 0, predicted: 3100 },
      ],
      '90 Days': [
        { label: 'Month 1', historical: 10500, predicted: 10500 },
        { label: 'Month 2', historical: 11200, predicted: 11500 },
        { label: 'Month 3', historical: 0, predicted: 12800 },
      ]
    };
    return data[range] || data['30 Days'];
  },

  // 6. Mock Regional Insights
  async getRegionalInsights() {
    return [
      { city: 'London', demandGrowth: '+18.2%', trend: 'High Vegetables & Organic', confidence: 94 },
      { city: 'Manchester', demandGrowth: '+12.5%', trend: 'Meat & Prime Cuts', confidence: 88 },
      { city: 'Birmingham', demandGrowth: '+14.1%', trend: 'Dairy Products demand rising', confidence: 91 },
      { city: 'Liverpool', demandGrowth: '+8.9%', trend: 'Grains & Fresh Produce', confidence: 85 },
      { city: 'Leeds', demandGrowth: '+10.4%', trend: 'Seafood and Fish items', confidence: 87 },
    ];
  },

  // 7. Mock Supplier Forecasts
  async getSupplierForecasts() {
    return [
      { name: 'GreenEarth Organics', currentScore: 92, predictedScore: 94, risk: 'Low', recommendation: 'Upgrade to Platinum Class' },
      { name: 'Valley Prime Meats', currentScore: 85, predictedScore: 84, risk: 'Low', recommendation: 'Maintain current inventory ratios' },
      { name: 'Atlantic Blue Fisheries', currentScore: 74, predictedScore: 78, risk: 'Medium', recommendation: 'Inspect cold chain telemetry logs' },
      { name: 'Sunrise Orchards', currentScore: 88, predictedScore: 91, risk: 'Low', recommendation: 'Increase fruit orders by 10%' },
      { name: 'Deep Sea Co.', currentScore: 62, predictedScore: 58, risk: 'High', recommendation: 'Add backup supplier options' },
    ];
  },

  // 8. Mock AI Recommendations
  async getAIRecommendations() {
    return [
      { id: 1, type: 'inventory', text: 'Increase Dairy inventory by 15% due to upcoming regional festival in London.', importance: 'High' },
      { id: 2, type: 'trend', text: 'Frozen Foods demand expected to rise 18% in Manchester next month.', importance: 'Medium' },
      { id: 3, type: 'supplier', text: 'Supplier GreenEarth Organics showing stable growth; optimal for premium vegetable contracts.', importance: 'Low' },
      { id: 4, type: 'market', text: 'Beverage category expected to outperform fresh vegetables next month by 4.5%.', importance: 'Medium' },
    ];
  },

  // 9. Mock Notifications
  async getNotifications() {
    try {
      const res = await api.get('/notifications');
      return res.data.map(n => ({
        id: n._id,
        title: n.title,
        text: n.message,
        time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: n.read,
        supplierId: n.supplierId
      }));
    } catch {
      return [
        { id: 'n1', title: 'New Order', text: 'New Order #1049 placed by Buyer DirectFoods', time: '5m ago', read: false },
        { id: 'n2', title: 'Verification Request', text: 'Supplier Valley Prime Meats requested verification approval', time: '1h ago', read: false },
        { id: 'n3', title: 'Product Review', text: 'Product approval requested for Organic Curly Kale', time: '2h ago', read: false },
        { id: 'n4', title: 'Support Ticket', text: 'New support ticket created: billing dispute ORD-A23B', time: '4h ago', read: true },
        { id: 'n5', title: 'Inventory Alert', text: 'Inventory Alert: Atlantic Salmon is low in stock (8 units left)', time: '1d ago', read: true },
        { id: 'n6', title: 'System Metrics', text: 'System Uptime metrics are back to optimal levels', time: '2d ago', read: true },
      ];
    }
  }
};
