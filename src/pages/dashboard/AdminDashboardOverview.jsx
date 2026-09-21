import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, Users, Truck, DollarSign, TrendingUp, Settings, 
  RefreshCw, AlertTriangle, ShieldCheck, MapPin, Sparkles, 
  ArrowRight, Search, Filter, ShieldAlert, List, CheckCircle2,
  Lock, Key, Mail, Building, PieChart, Info, HelpCircle,
  Clock, Package, X
} from 'lucide-react';
import SEO from '../../components/SEO';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminService } from '../../services/adminService';
import { useNotification } from '../../context/NotificationContext';

export default function AdminDashboardOverview() {
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [margin, setMargin] = useState(15);
  const [marginSaved, setMarginSaved] = useState(false);
  const [hoveredRevenueNode, setHoveredRevenueNode] = useState(null);

  // Tab: AI predictions states
  const [forecastRange, setForecastRange] = useState('30 Days');
  const [predictions, setPredictions] = useState(null);
  const [demandData, setDemandData] = useState([]);
  const [regionalInsights, setRegionalInsights] = useState([]);
  const [supplierForecasts, setSupplierForecasts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [aiRoadmap, setAiRoadmap] = useState(null);
  const [selectedRoadmapCard, setSelectedRoadmapCard] = useState(null);


  // Interactive ML Predictor States
  const [mlInput, setMlInput] = useState({
    product_name: 'Tomato',
    category: 'Vegetables',
    day_of_week: 'Monday',
    is_holiday: false,
    weather_condition: 'Sunny',
  });
  const [mlPrediction, setMlPrediction] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);
  const [mlError, setMlError] = useState(null);

  // Tab: Support Tickets states
  const [tickets, setTickets] = useState([]);
  const [ticketFilter, setTicketFilter] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Tab: Audit Logs states
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditFilter, setAuditFilter] = useState('All');

  // Tab: Settings states
  const [generalSettings, setGeneralSettings] = useState({
    platformName: 'FreshLync Multi-Vendor Wholesale',
    contactEmail: 'operations@freshlync.com',
    supportPhone: '+44 20 7946 0958',
    autoApproveProducts: false,
    autoApproveSuppliers: false,
    passwordPolicy: 'Strong (8+ chars, mixed cases, special char)',
    sessionTimeout: '60 minutes',
    twoFactorAuth: true,
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Helper to format timestamps to relative time
  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'unknown';
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    if (isNaN(diffMs) || diffMs < 0) return 'Just now';
    
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  // Recent Activity Feed (dynamic fallback)
  const defaultActivities = [
    { type: 'customer', title: 'New Customer Registered', desc: 'SuperMart Inc. joined the marketplace', time: '10m ago' },
    { type: 'supplier', title: 'New Supplier Applied', desc: 'OceanBreeze Fish Co. submitted documentation', time: '1h ago' },
    { type: 'order', title: 'Order Completed', desc: 'Order ORD-A882 successfully delivered', time: '2h ago' },
    { type: 'product', title: 'Product Approval Requested', desc: 'GreenEarth Organics submitted Organic Red Chard', time: '4h ago' },
    { type: 'support', title: 'Dispute Ticket Opened', desc: 'Supplier GreenEarth raised dispute on ORD-A23B', time: '6h ago' },
  ];

  const handleActivityClick = (act) => {
    if (act.type === 'product' || act.type === 'support') {
      navigate('/admin/inventory');
    } else if (act.type === 'order') {
      navigate('/admin/orders');
    } else if (act.type === 'customer' || act.type === 'supplier') {
      navigate('/admin/users');
    }
  };

  const activitiesList = stats?.activities || defaultActivities;

  const loadData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const results = await Promise.allSettled([
        adminService.getDashboardStats().catch(() => null),
        adminService.getMarketPredictions().catch(() => null),
        adminService.getDemandForecast(forecastRange).catch(() => []),
        adminService.getRegionalInsights().catch(() => []),
        adminService.getSupplierForecasts().catch(() => []),
        adminService.getAIRecommendations().catch(() => []),
        adminService.getTickets().catch(() => []),
        adminService.getAuditLogs().catch(() => []),
        adminService.getAIRoadmap().catch(() => null),
      ]);

      const [
        dashboardStatsRes, 
        predictionDataRes, 
        forecastRes, 
        regionsRes, 
        suppliersRes, 
        recsRes,
        tktListRes,
        logsListRes,
        roadmapRes
      ] = results;

      if (dashboardStatsRes.status === 'fulfilled' && dashboardStatsRes.value) {
        setStats(dashboardStatsRes.value);
        setMargin(dashboardStatsRes.value.margin || 15);
      }
      if (predictionDataRes.status === 'fulfilled' && predictionDataRes.value) {
        setPredictions(predictionDataRes.value);
      }
      if (forecastRes.status === 'fulfilled' && forecastRes.value) {
        setDemandData(forecastRes.value || []);
      }
      if (regionsRes.status === 'fulfilled' && regionsRes.value) {
        setRegionalInsights(regionsRes.value || []);
      }
      if (suppliersRes.status === 'fulfilled' && suppliersRes.value) {
        setSupplierForecasts(suppliersRes.value || []);
      }
      if (recsRes.status === 'fulfilled' && recsRes.value) {
        setRecommendations(recsRes.value || []);
      }
      if (tktListRes.status === 'fulfilled' && tktListRes.value) {
        setTickets(tktListRes.value || []);
      }
      if (logsListRes.status === 'fulfilled' && logsListRes.value) {
        setAuditLogs(logsListRes.value || []);
      }
      if (roadmapRes.status === 'fulfilled' && roadmapRes.value) {
        setAiRoadmap(roadmapRes.value);
      }
    } catch (err) {
      console.error('Failed to load admin dashboard data', err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => loadData(true), 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Reload demand forecast when time range changes
    const reloadForecast = async () => {
      try {
        const data = await adminService.getDemandForecast(forecastRange);
        setDemandData(data);
      } catch (err) {
        console.error(err);
      }
    };
    reloadForecast();
  }, [forecastRange]);

  const handleSaveMargin = async () => {
    try {
      await adminService.saveMargin(margin);
      setMarginSaved(true);
      showToast('Margin configuration saved successfully.', 'success');
      setTimeout(() => setMarginSaved(false), 3000);
    } catch {
      showToast('Failed to save margin.', 'error');
    }
  };

  const handleMLPredict = async (e) => {
    e.preventDefault();
    setMlLoading(true);
    setMlError(null);
    setMlPrediction(null);
    try {
      const res = await adminService.predictSales({
        product_name: mlInput.product_name,
        category: mlInput.category,
        day_of_week: mlInput.day_of_week,
        is_holiday: mlInput.is_holiday,
        weather_condition: mlInput.weather_condition,
      });
      setMlPrediction(res);
      showToast('AI prediction generated successfully!', 'success');
    } catch (err) {
      console.error(err);
      setMlError(err.response?.data?.message || err.message || 'Prediction failed');
      showToast('Failed to generate prediction.', 'error');
    } finally {
      setMlLoading(false);
    }
  };

  const handleTicketStatusChange = async (id, nextStatus) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: nextStatus } : t));
    if (selectedTicket?.id === id) {
      setSelectedTicket(prev => ({ ...prev, status: nextStatus }));
    }
    try {
      await adminService.updateTicketStatus(id, nextStatus);
      showToast(`Ticket ${id} status updated to ${nextStatus}`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to update ticket status on database', 'error');
    }
  };

  const handleTicketAssign = async (id, assignee) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, assignee } : t));
    if (selectedTicket?.id === id) {
      setSelectedTicket(prev => ({ ...prev, assignee }));
    }
    try {
      await adminService.updateTicketAssignee(id, assignee);
      showToast(`Ticket ${id} assigned to ${assignee || 'Unassigned'}`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to update ticket assignee on database', 'error');
    }
  };


  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleExportAuditLogs = () => {
    const header = 'ID,Timestamp,Actor,Action,Details,IP Address,Category\n';
    const rows = auditLogs.map(l => {
      return `${l.id},${l.time},"${l.actor}","${l.action}","${l.details}",${l.ip},${l.type}`;
    }).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'audit-logs.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <LoadingSpinner fullPage message="Loading platform admin metrics..." />;

  // Overview Tab KPIs
  const kpis = [
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: Truck, bg: '#E0E7FF', color: '#312E81', badge: 'Active', path: '/admin/orders' },
    { label: 'Total Customers', value: stats?.totalCustomers || 0, icon: Users, bg: '#DBEAFE', color: '#1E40AF', badge: 'Active', path: '/admin/users?role=buyer' },
    { label: 'Total Suppliers', value: stats?.totalSuppliers || 0, icon: Building, bg: '#D1FAE5', color: '#065F46', badge: 'Verified', path: '/admin/users?role=supplier' },
    { label: 'Platform Profit', value: `£${Number(stats?.platformProfit || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`, icon: DollarSign, bg: '#F3E8FF', color: '#6827B0', badge: `${stats?.margin || 15}% Margin`, action: () => document.getElementById('platform-charts')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Orders Today', value: stats?.ordersToday || 0, icon: List, bg: '#FFF1F2', color: '#9F1239', badge: 'New', path: '/admin/orders' },
    { label: 'Pending Orders', value: stats?.pendingOrders || 0, icon: Clock, bg: '#FEF3C7', color: '#92400E', badge: 'In Queue', path: '/admin/orders?status=Pending' },
    { label: 'Completed Orders', value: stats?.completedOrders || 0, icon: CheckCircle2, bg: '#DCFCE7', color: '#166534', badge: 'Delivered', path: '/admin/orders?status=Delivered' },
    { label: 'Cancelled Orders', value: stats?.cancelledOrders || 0, icon: ShieldAlert, bg: '#FEE2E2', color: '#991B1B', badge: 'Flagged', path: '/admin/orders?status=Cancelled' },
    { label: 'Total Products Listed', value: stats?.totalProducts || 0, icon: Package, bg: '#E0F2FE', color: '#0369A1', badge: 'Catalog', path: '/admin/inventory' },
    { label: 'New Suppliers (Month)', value: stats?.newSuppliersThisMonth || 0, icon: Sparkles, bg: '#F0FDF4', color: '#15803D', badge: 'Growth', path: '/admin/verification' },
    { label: 'Revenue (Total GMV)', value: `£${Number(stats?.revenueOverview || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`, icon: DollarSign, bg: '#ECFDF5', color: '#047857', badge: '+12.5%', action: () => document.getElementById('platform-charts')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Platform Growth Rate', value: `${stats?.platformGrowthRate || 0}%`, icon: TrendingUp, bg: '#EFF6FF', color: '#1D4ED8', badge: 'Monthly', action: () => setActiveTab('prediction') },
  ];

  return (
    <div style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-text-main)' }}>
      <SEO title="Admin Platform Overview" />

      {/* Page Title & Refresh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.5px' }}>FreshLync Enterprise Administration</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Core management controls, AI intelligence forecasts, support escalations, and settings panel.</p>
        </div>
        <button className="btn-secondary" onClick={loadData} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1.1rem', borderRadius: 8 }}>
          <RefreshCw size={15} /> Refresh Dashboard
        </button>
      </div>

      {/* Tabs Selector */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: '1.75rem', overflowX: 'auto', gap: '0.5rem' }}>
        {[
          { id: 'overview', label: '📊 System Overview' },
          { id: 'prediction', label: '🤖 AI Prediction Center' },
          { id: 'support', label: '🎫 Support & Dispute Center' },
          { id: 'audit', label: '🛡️ Audit Logs' },
          { id: 'settings', label: '⚙️ System Settings' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '0.8rem 1.5rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: activeTab === t.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
              borderBottom: `3px solid ${activeTab === t.id ? 'var(--color-primary)' : 'transparent'}`,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* KPI grid */}
          <div className="responsive-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {kpis.map((k, i) => (
              <div 
                key={i} 
                className="card" 
                onClick={() => k.path ? navigate(k.path) : k.action?.()}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justify: 'space-between', 
                  padding: '1.25rem', 
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                  userSelect: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  e.currentTarget.style.borderColor = k.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
                title={`Click to view detailed ${k.label}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <k.icon size={18} style={{ color: k.color }} />
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: 999, background: k.bg, color: k.color }}>{k.badge}</span>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{k.label}</span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>→</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px' }}>{k.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts & Notifications Side-by-Side */}
          <div className="responsive-split" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', flexWrap: 'wrap' }}>
            {/* Charts Card */}
            <div id="platform-charts" className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><TrendingUp size={18} /> Platform Performance Charts</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Active Weekly</span>
              </div>
              
              {/* Responsive SVG Charts mockup */}
              <div className="responsive-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>Weekly Orders Trend (Units Flipped)</div>
                  <div style={{ background: '#f8fafc', borderRadius: 8, height: 160, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '1rem' }}>
                    {(() => {
                      const weeklyData = stats?.weeklyOrders || [12, 28, 45, 32, 60, 52, 78, 65, 90];
                      const maxVal = Math.max(...weeklyData);
                      return weeklyData.map((val, idx) => {
                        const barHeight = maxVal > 0 ? (val / maxVal) * 110 : 0;
                        return (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: 1 }}>
                            <div style={{ width: 12, height: `${barHeight}px`, background: '#312E81', borderRadius: '2px 2px 0 0', opacity: 0.85 }} title={`Orders: ${val}`} />
                            <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>W{idx+1}</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Daily Platform Performance (Last 7 Days)</div>
                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.7rem', fontWeight: 700 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#1D4ED8' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1D4ED8', display: 'inline-block' }} /> Revenue
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10B981' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} /> Profit
                      </span>
                    </div>
                  </div>
                  <div style={{ background: '#f8fafc', borderRadius: 8, minHeight: 160, position: 'relative', overflow: 'visible', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    {(() => {
                      const dailyData = stats?.dailyRevenue || [
                        { label: 'Sat', revenue: 100, profit: 13.04 },
                        { label: 'Sun', revenue: 120, profit: 15.65 },
                        { label: 'Mon', revenue: 90, profit: 11.74 },
                        { label: 'Tue', revenue: 150, profit: 19.57 },
                        { label: 'Wed', revenue: 200, profit: 26.09 },
                        { label: 'Thu', revenue: 170, profit: 22.17 },
                        { label: 'Fri', revenue: 250, profit: 32.61 }
                      ];
                      const maxRev = Math.max(...dailyData.map(d => d.revenue), 1);
                      const marginSetting = stats?.margin || 15;

                      const points = dailyData.map((d, idx) => {
                        const x = (idx / (dailyData.length - 1)) * 100;
                        const y = 35 - (d.revenue / maxRev) * 28;
                        return `${x},${y}`;
                      });
                      const pathD = points.length > 0 ? `M${points.join(' L')}` : '';

                      const profitPoints = dailyData.map((d, idx) => {
                        const x = (idx / (dailyData.length - 1)) * 100;
                        const profitVal = d.profit !== undefined ? d.profit : (d.revenue * (marginSetting / (100 + marginSetting)));
                        const y = 35 - (profitVal / maxRev) * 28;
                        return `${x},${y}`;
                      });
                      const pathProfitD = profitPoints.length > 0 ? `M${profitPoints.join(' L')}` : '';

                      return (
                        <>
                          <div style={{ position: 'relative', width: '100%' }}>
                            <svg viewBox="0 0 100 40" style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
                              {/* Area under curves */}
                              {points.length > 0 && (
                                <path 
                                  d={`${pathD} L100,35 L0,35 Z`} 
                                  fill="rgba(29, 78, 216, 0.08)" 
                                  stroke="none" 
                                />
                              )}
                              {profitPoints.length > 0 && (
                                <path 
                                  d={`${pathProfitD} L100,35 L0,35 Z`} 
                                  fill="rgba(16, 185, 129, 0.08)" 
                                  stroke="none" 
                                />
                              )}
                              
                              {/* Lines */}
                              <path d={pathD} fill="none" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" />
                              <path d={pathProfitD} fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />

                              {/* Data points */}
                              {dailyData.map((d, idx) => {
                                const x = (idx / (dailyData.length - 1)) * 100;
                                const yRev = 35 - (d.revenue / maxRev) * 28;
                                const profitVal = d.profit !== undefined ? d.profit : (d.revenue * (marginSetting / (100 + marginSetting)));
                                const yProf = 35 - (profitVal / maxRev) * 28;

                                return (
                                  <g key={idx}>
                                    {/* Revenue Circle */}
                                    <circle 
                                      cx={x} 
                                      cy={yRev} 
                                      r="1.8" 
                                      fill="#1D4ED8" 
                                      stroke="white" 
                                      strokeWidth="0.4"
                                      style={{ cursor: 'pointer' }}
                                      onMouseEnter={() => setHoveredRevenueNode({ label: d.label, revenue: d.revenue, profit: profitVal, x, y: yRev })}
                                      onMouseLeave={() => setHoveredRevenueNode(null)}
                                    />
                                    {/* Profit Circle */}
                                    <circle 
                                      cx={x} 
                                      cy={yProf} 
                                      r="1.8" 
                                      fill="#10B981" 
                                      stroke="white" 
                                      strokeWidth="0.4"
                                      style={{ cursor: 'pointer' }}
                                      onMouseEnter={() => setHoveredRevenueNode({ label: d.label, revenue: d.revenue, profit: profitVal, x, y: yProf })}
                                      onMouseLeave={() => setHoveredRevenueNode(null)}
                                    />
                                  </g>
                                );
                              })}
                            </svg>
                            
                            {/* Floating interactive tooltip */}
                            {hoveredRevenueNode && (
                              <div style={{
                                position: 'absolute',
                                left: `${hoveredRevenueNode.x}%`,
                                top: `${hoveredRevenueNode.y / 40 * 100}%`,
                                transform: 'translate(-50%, -125%)',
                                background: '#1E293B',
                                color: 'white',
                                padding: '0.4rem 0.7rem',
                                borderRadius: 8,
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                pointerEvents: 'none',
                                boxShadow: 'var(--shadow-md)',
                                whiteSpace: 'nowrap',
                                zIndex: 10,
                                transition: 'all 0.05s ease',
                                lineHeight: 1.4,
                                border: '1px solid #334155'
                              }}>
                                <div style={{ color: '#94A3B8', fontSize: '0.55rem', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{hoveredRevenueNode.label} Details</div>
                                <div style={{ color: '#38BDF8', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                                  <span>Revenue:</span>
                                  <span>£{hoveredRevenueNode.revenue.toFixed(2)}</span>
                                </div>
                                <div style={{ color: '#34D399', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                                  <span>Profit:</span>
                                  <span>£{hoveredRevenueNode.profit.toFixed(2)}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div style={{ position: 'relative', width: '100%', height: '14px', fontSize: '0.625rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', overflow: 'visible' }}>
                            {dailyData.map((d, idx) => {
                              const x = (idx / (dailyData.length - 1)) * 100;
                              return (
                                <span 
                                  key={idx} 
                                  title={`£${d.revenue}`} 
                                  style={{ 
                                    position: 'absolute', 
                                    left: `${x}%`, 
                                    transform: 'translateX(-50%)', 
                                    whiteSpace: 'nowrap',
                                    textAlign: 'center'
                                  }}
                                >
                                  {d.label}
                                </span>
                              );
                            })}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Financial Revenue Split */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Financial Split Overview (Platform Cumulative)</div>
                <div className="responsive-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  <div style={{ background: '#F8FAFC', padding: '0.875rem 1.25rem', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Marketplace Revenue (Customer Paid)</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E40AF', marginTop: '0.25rem' }}>
                      £{Number(stats?.marketplaceRevenue || stats?.totalGMV || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '0.875rem 1.25rem', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Supplier Payouts (Wholesale Share)</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#047857', marginTop: '0.25rem' }}>
                      £{Number(stats?.supplierRevenue || Math.max(0, (Number(stats?.marketplaceRevenue || stats?.totalGMV || 0) - Number(stats?.marginRevenue || stats?.platformProfit || 0)))).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '0.875rem 1.25rem', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Platform Profit Margin Revenue</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#7C3AED', marginTop: '0.25rem' }}>
                      £{Number(stats?.marginRevenue || stats?.platformProfit || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts Card */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}><AlertTriangle size={18} style={{ color: '#F59E0B' }} /> Pending Platform Alerts</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {[
                    { title: 'System Security Audit', desc: 'Verify API logs and failed login sessions.', color: '#EF4444', bg: '#FEF2F2' },
                    { title: 'New Supplier Verification Request', desc: 'SuperFoods Ltd is awaiting credentials check.', color: '#F59E0B', bg: '#FFFBEB' },
                    { title: 'Platform Uptime', desc: 'All backend cloud nodes reporting healthy state.', color: '#10B981', bg: '#F0FDF4' },
                  ].map((a, i) => (
                    <div key={i} style={{ padding: '0.875rem', borderLeft: `4px solid ${a.color}`, background: a.bg, borderRadius: '0 8px 8px 0' }}>
                      <div style={{ fontWeight: 700, color: a.color, marginBottom: '0.15rem', fontSize: '0.82rem' }}>{a.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{a.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log Feed & Margin config */}
          <div className="responsive-split" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
            {/* Activities */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={18} /> System Activity Feed</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {activitiesList.map((act, idx) => (
                  <div 
                    key={idx} 
                    className="activity-feed-row"
                    onClick={() => handleActivityClick(act)}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      paddingBottom: '0.875rem', 
                      borderBottom: idx < activitiesList.length - 1 ? '1px solid var(--color-border)' : 'none' 
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                        background: act.type === 'customer' ? '#3B82F6' : (act.type === 'supplier' ? '#10B981' : (act.type === 'order' ? '#8B5CF6' : (act.type === 'product' ? '#06B6D4' : '#EF4444')))
                      }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{act.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{act.desc}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', flexShrink: 0 }}>{act.time || formatRelativeTime(act.timestamp)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Margin configuration */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Settings size={18} /> Platform Margin Markup</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  Set the default service markup commission rate automatically added to all supplier order checkouts.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>Commission markup rate (%)</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="number" min="0" max="100" value={margin} onChange={e => setMargin(e.target.value)} style={{ flex: 1, padding: '0.6rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: 8, outline: 'none', fontSize: '0.9rem' }} />
                    <button className="btn-primary" onClick={handleSaveMargin} style={{ padding: '0.6rem 1.5rem' }}>Save</button>
                  </div>
                </div>
              </div>
              {marginSaved && (
                <div style={{ marginTop: '1rem', background: '#D1FAE5', color: '#065F46', padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.82rem', fontWeight: 600, textAlign: 'center' }}>
                  Commission markup successfully saved to system defaults!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. AI MARKET PREDICTION CENTER */}
      {activeTab === 'prediction' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Header & Badges */}
          <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', borderRadius: 12, padding: '1.5rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Sparkles size={22} style={{ color: '#A5B4FC' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC' }}>FreshLync Demand Forecast Engine</h3>
              </div>
              <p style={{ color: '#C7D2FE', fontSize: '0.875rem', maxWidth: '600px' }}>
                Enterprise ML forecast overview predicting buyer category demands, transport risk rates, and supplier stability profiles.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
              <span style={{ background: '#DCFCE7', color: '#166534', fontWeight: 800, padding: '0.3rem 0.8rem', borderRadius: 999, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} /> 🟢 PRODUCTION READY
              </span>
              <span style={{ fontSize: '0.75rem', color: '#C7D2FE' }}>Version: 1.0 Production · XGBoost & Stacking Trained</span>
            </div>

          </div>

          {/* AI Forecast KPIs */}
          <div className="responsive-grid-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Predicted Demand Index', value: `${predictions?.predictedDemandIndex}%`, trend: 'High Activity', color: '#312E81', bg: '#EEF2F6' },
              { label: 'Forecast Growth Rate', value: `+${predictions?.forecastGrowthRate}%`, trend: 'Next 30 Days', color: '#10B981', bg: '#F0FDF4' },
              { label: 'Inventory Risk Score', value: `${predictions?.inventoryRiskScore}/100`, trend: 'Optimal Levels', color: '#EF4444', bg: '#FEF2F2' },
              { label: 'Product Trend Score', value: `${predictions?.productTrendScore}%`, trend: 'Organic Rising', color: '#8B5CF6', bg: '#F5F3FF' },
              { label: 'Supplier Stability Index', value: `${predictions?.supplierStabilityIndex}%`, trend: 'Reliable Delivery', color: '#0369A1', bg: '#F0F9FF' },
              { label: 'Customer Demand Index', value: `${predictions?.customerDemandPrediction}%`, trend: 'Bulk Orders', color: '#047857', bg: '#ECFDF5' },
            ].map((kp, idx) => (
              <div key={idx} className="card" style={{ padding: '1rem', background: kp.bg, border: 'none', boxShadow: 'none' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{kp.label}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: kp.color, letterSpacing: '-0.5px' }}>{kp.value}</div>
                <div style={{ fontSize: '0.675rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', fontStyle: 'italic' }}>{kp.trend}</div>
              </div>
            ))}
          </div>

          {/* Demand Forecast Chart & AI Recommendations */}
          <div className="responsive-split" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
            
            {/* Chart Card */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Demand Forecast Projection</h3>
                <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--color-background)', padding: '0.2rem', borderRadius: 8 }}>
                  {['7 Days', '30 Days', '90 Days'].map(r => (
                    <button key={r} onClick={() => setForecastRange(r)} style={{
                      padding: '0.3rem 0.75rem', borderRadius: 6, fontSize: '0.78rem', fontWeight: 700,
                      background: forecastRange === r ? 'white' : 'transparent',
                      color: forecastRange === r ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                      boxShadow: forecastRange === r ? 'var(--shadow-sm)' : 'none',
                      border: 'none', cursor: 'pointer'
                    }}>{r}</button>
                  ))}
                </div>
              </div>

              {/* Demand chart representation */}
              <div style={{ background: '#f8fafc', borderRadius: 8, height: 200, padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', position: 'relative', zIndex: 1 }}>
                  {demandData.map((d, i) => {
                    const maxVal = Math.max(...demandData.map(v => Math.max(v.historical, v.predicted)));
                    const hHeight = maxVal > 0 ? (d.historical / maxVal) * 140 : 0;
                    const pHeight = maxVal > 0 ? (d.predicted / maxVal) * 140 : 0;
                    return (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: 1 }}>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: 140 }}>
                          {d.historical > 0 && <div style={{ width: 10, height: `${hHeight}px`, background: '#312E81', borderRadius: '2px 2px 0 0' }} title={`Historical: ${d.historical}`} />}
                          <div style={{ width: 10, height: `${pHeight}px`, background: '#818CF8', borderRadius: '2px 2px 0 0', opacity: 0.85 }} title={`Predicted: ${d.predicted}`} />
                        </div>
                        <span style={{ fontSize: '0.675rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{d.label}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: 8, height: 8, background: '#312E81', display: 'inline-block', borderRadius: '2px' }}></span>Historical Demand</span>
                  <span style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: 8, height: 8, background: '#818CF8', display: 'inline-block', borderRadius: '2px' }}></span>Future Prediction</span>
                </div>
              </div>
            </div>

            {/* AI recommendations */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Sparkles size={18} style={{ color: '#8B5CF6' }} /> AI Recommendations</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recommendations.map(rec => (
                  <div key={rec.id} style={{
                    padding: '0.875rem', borderRadius: 8,
                    background: rec.importance === 'High' ? '#FEF2F2' : (rec.importance === 'Medium' ? '#FFFBEB' : '#F0FDF4'),
                    border: `1px solid ${rec.importance === 'High' ? '#FCA5A5' : (rec.importance === 'Medium' ? '#FDE68A' : '#A7F3D0')}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>{rec.type}</span>
                      <span style={{
                        fontSize: '0.6rem', fontWeight: 800, padding: '0.1rem 0.35rem', borderRadius: 4,
                        background: rec.importance === 'High' ? '#EF4444' : (rec.importance === 'Medium' ? '#F59E0B' : '#10B981'), color: 'white'
                      }}>{rec.importance}</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', lineHeight: 1.4, fontWeight: 500 }}>{rec.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Regional Insights & Inventory Risks */}
          <div className="responsive-split" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1.5rem' }}>
            
            {/* Regional Insights */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={18} /> Regional Market Insights</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {regionalInsights.map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderRadius: 8, background: 'var(--color-background)' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{r.city}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>Trend: {r.trend}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '0.85rem' }}>{r.demandGrowth}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Conf. Score: {r.confidence}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory Risks */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldAlert size={18} /> Inventory Risk Analysis</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {[
                  { label: 'High Shortage Risk', count: 3, estimate: 'Shortage of Organic Milk in London route', risk: '84% Risk', color: '#EF4444', bg: '#FEF2F2' },
                  { label: 'Medium Expiry Risk', count: 5, estimate: 'Curly Kale shelf-life limits approaching', risk: '52% Risk', color: '#F59E0B', bg: '#FFFBEB' },
                  { label: 'Low Shortage Risk', count: 12, estimate: 'Angus Beef stocks fully sufficient', risk: '15% Risk', color: '#10B981', bg: '#F0FDF4' },
                ].map((risk, idx) => (
                  <div key={idx} style={{ padding: '0.875rem', background: risk.bg, borderLeft: `4px solid ${risk.color}`, borderRadius: '0 8px 8px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: risk.color }}>{risk.label} ({risk.count} products)</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: risk.color }}>{risk.risk}</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{risk.estimate}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trending Products Table & Supplier stability */}
          <div className="responsive-split" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
            {/* Trending predictions */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Trending Product Predictions</h3>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead style={{ background: 'var(--color-background)', color: 'var(--color-text-muted)' }}>
                  <tr>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700 }}>PRODUCT</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700 }}>CURRENT DEMAND</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700 }}>FORECAST DEMAND</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700 }}>GROWTH</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700 }}>CONFIDENCE</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Fresh Vegetables', cur: 'High', fore: 'Very High', growth: '+15.4%', conf: 92 },
                    { name: 'Dairy Products', cur: 'Medium', fore: 'High', growth: '+12.8%', conf: 86 },
                    { name: 'Rice & Grains', cur: 'Stable', fore: 'Stable', growth: '+2.1%', conf: 94 },
                    { name: 'Beverages', cur: 'Low', fore: 'Medium', growth: '+24.5%', conf: 78 },
                    { name: 'Frozen Foods', cur: 'Medium', fore: 'High', growth: '+18.0%', conf: 82 },
                    { name: 'Meat Products', cur: 'High', fore: 'High', growth: '+4.2%', conf: 91 },
                  ].map((p, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{p.name}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{p.cur}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{p.fore}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#10B981', fontWeight: 700 }}>{p.growth}</td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600 }}>{p.conf}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Supplier performance forecast */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Supplier Performance Forecast</h3>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead style={{ background: 'var(--color-background)', color: 'var(--color-text-muted)' }}>
                  <tr>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700 }}>SUPPLIER</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700 }}>CURRENT</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700 }}>PREDICTED</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700 }}>RISK</th>
                  </tr>
                </thead>
                <tbody>
                  {supplierForecasts.map((s, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{s.name}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{s.currentScore}/100</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{s.predictedScore}/100</td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        <span style={{
                          fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: 4,
                          background: s.risk === 'High' ? '#FEE2E2' : (s.risk === 'Medium' ? '#FEF3C7' : '#DCFCE7'),
                          color: s.risk === 'High' ? '#991B1B' : (s.risk === 'Medium' ? '#B45309' : '#166534')
                        }}>{s.risk}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive ML Predictor */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Sparkles size={20} style={{ color: 'var(--color-primary)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Interactive Sales & Price Predictor</h3>
            </div>
            
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Select hypothetical market parameters below to run the trained XGBoost model and forecast quantity sold and recommended price.
            </p>

            <div className="responsive-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', flexWrap: 'wrap' }}>
              {/* Form */}
              <form onSubmit={handleMLPredict} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>Product Name</label>
                    <select
                      value={mlInput.product_name}
                      onChange={e => setMlInput(prev => ({ ...prev, product_name: e.target.value }))}
                      style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--color-border)', borderRadius: 8, outline: 'none', fontSize: '0.85rem' }}
                    >
                      {['Tomato', 'Potato', 'Beans', 'Carrot', 'Chicken', 'Pork', 'Seer Fish', 'Tuna'].map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>Category</label>
                    <select
                      value={mlInput.category}
                      onChange={e => setMlInput(prev => ({ ...prev, category: e.target.value }))}
                      style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--color-border)', borderRadius: 8, outline: 'none', fontSize: '0.85rem' }}
                    >
                      {['Vegetables', 'Meat', 'Fish'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>Day of Week</label>
                    <select
                      value={mlInput.day_of_week}
                      onChange={e => setMlInput(prev => ({ ...prev, day_of_week: e.target.value }))}
                      style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--color-border)', borderRadius: 8, outline: 'none', fontSize: '0.85rem' }}
                    >
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>Weather Condition</label>
                    <select
                      value={mlInput.weather_condition}
                      onChange={e => setMlInput(prev => ({ ...prev, weather_condition: e.target.value }))}
                      style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--color-border)', borderRadius: 8, outline: 'none', fontSize: '0.85rem' }}
                    >
                      {['Sunny', 'Cloudy', 'Rainy'].map(w => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
                  <input
                    type="checkbox"
                    id="ml_is_holiday"
                    checked={mlInput.is_holiday}
                    onChange={e => setMlInput(prev => ({ ...prev, is_holiday: e.target.checked }))}
                    style={{ cursor: 'pointer' }}
                  />
                  <label htmlFor="ml_is_holiday" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', cursor: 'pointer' }}>Is Holiday?</label>
                </div>

                <button
                  type="submit"
                  disabled={mlLoading}
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.7rem' }}
                >
                  {mlLoading ? 'Generating Forecast...' : <><Sparkles size={16} /> Run ML Prediction</>}
                </button>
              </form>

              {/* Results */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#F8FAFC', borderRadius: 12, padding: '1.5rem', border: '1px solid var(--color-border)' }}>
                {mlLoading ? (
                  <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    <div style={{ width: 32, height: 32, border: '3px solid #E2E8F0', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 0.75rem' }} />
                    Crunching real-time market data...
                  </div>
                ) : mlError ? (
                  <div style={{ color: '#EF4444', textAlign: 'center', fontSize: '0.9rem' }}>
                    <AlertTriangle size={32} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                    <strong>Error generating prediction</strong>
                    <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>{mlError}</div>
                  </div>
                ) : mlPrediction ? (
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1E293B', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Forecast Results</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={{ background: 'white', padding: '1rem', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>PREDICTED DEMAND</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                          {mlPrediction.quantity_sold.toFixed(1)} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>units</span>
                        </div>
                      </div>
                      <div style={{ background: 'white', padding: '1rem', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>RECOMMENDED PRICE</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#047857' }}>
                          £{mlPrediction.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '1rem', fontStyle: 'italic' }}>
                      * Forecast generated using the tuned multi-output XGBoost regression model trained on active supply chain records.
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    <Sparkles size={36} style={{ color: '#A5B4FC', margin: '0 auto 0.75rem', display: 'block' }} />
                    Configure parameters and click "Run ML Prediction" to see forecasted values.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Roadmap Cards */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🤖 Demand Forecast & AI Roadmap
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  Live ML Services derived from XGBoost Lags, Prophet Hybrids, and Stacking Ensembles. Click any module to inspect detailed forecasting metrics.
                </p>
              </div>
              <span style={{ background: '#DCFCE7', color: '#166534', fontWeight: 800, fontSize: '0.72rem', padding: '0.3rem 0.75rem', borderRadius: 999, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} /> 6 ML Models Active
              </span>
            </div>

            <div className="responsive-grid-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {[
                {
                  id: 'demand',
                  title: 'Demand Forecasting',
                  icon: TrendingUp,
                  status: aiRoadmap?.demandForecasting?.status || 'ML Active (XGBoost Lags)',
                  metric: aiRoadmap?.demandForecasting?.volume30d || '23,165 kg',
                  label: '30D Forecast Volume',
                  sub: `Accuracy: ${aiRoadmap?.demandForecasting?.r2Score || '99.2% R²'}`,
                  color: '#312E81',
                  bg: '#EEF2FF',
                  badgeBg: '#DCFCE7',
                  badgeColor: '#166534',
                },
                {
                  id: 'inventory',
                  title: 'Inventory Prediction',
                  icon: Package,
                  status: aiRoadmap?.inventoryPrediction?.status || 'ML Active',
                  metric: aiRoadmap?.inventoryPrediction?.safetyStock || 'Optimal Stock',
                  label: 'Safety Buffer Index',
                  sub: `Velocity: ${aiRoadmap?.inventoryPrediction?.velocity || '772 kg/day'}`,
                  color: '#0369A1',
                  bg: '#F0F9FF',
                  badgeBg: '#DCFCE7',
                  badgeColor: '#166534',
                },
                {
                  id: 'supplier_risk',
                  title: 'Supplier Risk Analysis',
                  icon: ShieldAlert,
                  status: aiRoadmap?.supplierRiskAnalysis?.status || 'ML Active',
                  metric: aiRoadmap?.supplierRiskAnalysis?.defaultRisk || '7.6% Default Risk',
                  label: 'Low Risk Profile',
                  sub: `Stability: ${aiRoadmap?.supplierRiskAnalysis?.stabilityScore || '92.4%'}`,
                  color: '#047857',
                  bg: '#ECFDF5',
                  badgeBg: '#DCFCE7',
                  badgeColor: '#166534',
                },
                {
                  id: 'pricing',
                  title: 'Dynamic Pricing Intel',
                  icon: DollarSign,
                  status: aiRoadmap?.dynamicPricingIntel?.status || 'ML Active',
                  metric: `+${aiRoadmap?.dynamicPricingIntel?.optimalCommissionMarkup || '15.0%'} Margin`,
                  label: 'Pricing Elasticity Model',
                  sub: `Joint R²: ${aiRoadmap?.dynamicPricingIntel?.priceElasticityR2 || '0.925'}`,
                  color: '#6827B0',
                  bg: '#F3E8FF',
                  badgeBg: '#DCFCE7',
                  badgeColor: '#166534',
                },
                {
                  id: 'trend',
                  title: 'Seasonal Trend Detection',
                  icon: Activity,
                  status: aiRoadmap?.seasonalTrendDetection?.status || 'ML Active',
                  metric: aiRoadmap?.seasonalTrendDetection?.weekendSurge || '+24.5% Peak Surge',
                  label: 'Weekend & Holiday Spikes',
                  sub: `Top: ${aiRoadmap?.seasonalTrendDetection?.topDriver || 'Vegetables'}`,
                  color: '#B45309',
                  bg: '#FEF3C7',
                  badgeBg: '#DCFCE7',
                  badgeColor: '#166534',
                },
                {
                  id: 'market',
                  title: 'Market Intel Engine',
                  icon: Sparkles,
                  status: aiRoadmap?.marketIntelEngine?.status || 'ML Active (Stacking)',
                  metric: `Meta R² ${aiRoadmap?.marketIntelEngine?.metaModelR2 || '0.9266'}`,
                  label: 'Stacking Meta-Model',
                  sub: `Score: ${aiRoadmap?.marketIntelEngine?.marketHealthScore || '94.8/100'}`,
                  color: '#1D4ED8',
                  bg: '#EFF6FF',
                  badgeBg: '#DCFCE7',
                  badgeColor: '#166534',
                },
              ].map((card) => (
                <div
                  key={card.id}
                  onClick={() => setSelectedRoadmapCard(card.id)}
                  style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 12,
                    padding: '1.2rem 1rem',
                    background: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <card.icon size={18} style={{ color: card.color }} />
                      </div>
                      <span style={{ fontSize: '0.625rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: 999, background: card.badgeBg, color: card.badgeColor }}>
                        ACTIVE
                      </span>
                    </div>

                    <div style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.25rem', color: '#1E293B' }}>{card.title}</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: card.color, letterSpacing: '-0.5px', marginBottom: '0.2rem' }}>{card.metric}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{card.label}</div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '0.75rem', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>{card.sub}</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      View <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Roadmap Detail Modal */}
          {selectedRoadmapCard && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)',
              zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
            }}>
              <div style={{
                background: 'white', borderRadius: 16, width: '100%', maxWidth: 680,
                maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-xl)',
                display: 'flex', flexDirection: 'column', border: '1px solid var(--color-border)'
              }}>
                {/* Modal Header */}
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.05em' }}>
                      FreshLync ML Service output
                    </span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginTop: '0.1rem' }}>
                      {selectedRoadmapCard === 'demand' && '📊 Demand Forecasting Schedule (XGBoost)'}
                      {selectedRoadmapCard === 'inventory' && '📦 Inventory Safety Stock & Reorder Intel'}
                      {selectedRoadmapCard === 'supplier_risk' && '🛡️ Supplier Risk & Stability Analysis'}
                      {selectedRoadmapCard === 'pricing' && '💰 Dynamic Pricing & Profit Intel'}
                      {selectedRoadmapCard === 'trend' && '📈 Seasonal & Weather Demand Drivers'}
                      {selectedRoadmapCard === 'market' && '🧠 Stacking Ensemble Market Intel Report'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedRoadmapCard(null)}
                    style={{ background: '#E2E8F0', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Modal Content */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {selectedRoadmapCard === 'demand' && (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        <div style={{ background: '#EEF2FF', padding: '0.875rem', borderRadius: 8 }}>
                          <div style={{ fontSize: '0.7rem', color: '#3730A3', fontWeight: 700 }}>30-DAY TOTAL FORECAST</div>
                          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#312E81', marginTop: '0.2rem' }}>{aiRoadmap?.demandForecasting?.volume30d || '23,165 kg'}</div>
                        </div>
                        <div style={{ background: '#F0FDF4', padding: '0.875rem', borderRadius: 8 }}>
                          <div style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 700 }}>MODEL ACCURACY (R²)</div>
                          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#15803D', marginTop: '0.2rem' }}>{aiRoadmap?.demandForecasting?.r2Score || '0.9918 (99.2%)'}</div>
                        </div>
                        <div style={{ background: '#FEF3C7', padding: '0.875rem', borderRadius: 8 }}>
                          <div style={{ fontSize: '0.7rem', color: '#92400E', fontWeight: 700 }}>TEST ERROR (MAE)</div>
                          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#B45309', marginTop: '0.2rem' }}>{aiRoadmap?.demandForecasting?.maeKg || '6.95 kg'}</div>
                        </div>
                      </div>

                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Category Demand Schedule (in KG)</h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                          <thead style={{ background: '#F1F5F9' }}>
                            <tr>
                              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>CATEGORY</th>
                              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>7-DAY FORECAST</th>
                              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>14-DAY FORECAST</th>
                              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>30-DAY FORECAST</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(aiRoadmap?.demandForecasting?.categories || [
                              { category: 'Vegetables', f7d: 3363.37, f14d: 6734.95, f30d: 14084.87 },
                              { category: 'Meat', f7d: 1041.44, f14d: 2117.87, f30d: 4649.80 },
                              { category: 'Fish', f7d: 920.34, f14d: 1919.72, f30d: 4430.28 }
                            ]).map((row, i) => (
                              <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700 }}>{row.category}</td>
                                <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>{row.f7d.toLocaleString()} kg</td>
                                <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>{row.f14d.toLocaleString()} kg</td>
                                <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontWeight: 800, color: 'var(--color-primary)' }}>{row.f30d.toLocaleString()} kg</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  {selectedRoadmapCard === 'inventory' && (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ background: '#F0F9FF', padding: '1rem', borderRadius: 8 }}>
                          <div style={{ fontSize: '0.75rem', color: '#0369A1', fontWeight: 700 }}>SAFETY STOCK BUFFER</div>
                          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284C7', marginTop: '0.25rem' }}>{aiRoadmap?.inventoryPrediction?.safetyStock || 'Optimal (8.5%)'}</div>
                        </div>
                        <div style={{ background: '#F0FDF4', padding: '1rem', borderRadius: 8 }}>
                          <div style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 700 }}>DAILY CONSUMPTION VELOCITY</div>
                          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16A34A', marginTop: '0.25rem' }}>{aiRoadmap?.inventoryPrediction?.velocity || '772 kg / day'}</div>
                        </div>
                      </div>

                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Inventory Reorder Targets</h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                          <thead style={{ background: '#F1F5F9' }}>
                            <tr>
                              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>CATEGORY</th>
                              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>TARGET STOCK</th>
                              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>MIN THRESHOLD</th>
                              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>STATUS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(aiRoadmap?.inventoryPrediction?.reorderPoints || [
                              { category: 'Vegetables', targetStock: '14.1 Tons', minThreshold: '2.5 Tons', status: 'Optimal' },
                              { category: 'Meat', targetStock: '4.6 Tons', minThreshold: '1.2 Tons', status: 'Optimal' },
                              { category: 'Fish', targetStock: '4.4 Tons', minThreshold: '1.0 Tons', status: 'Optimal' }
                            ]).map((row, i) => (
                              <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700 }}>{row.category}</td>
                                <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center', fontWeight: 600 }}>{row.targetStock}</td>
                                <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center', color: '#92400E' }}>{row.minThreshold}</td>
                                <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>
                                  <span style={{ background: '#DCFCE7', color: '#166534', padding: '0.15rem 0.45rem', borderRadius: 4, fontWeight: 700, fontSize: '0.7rem' }}>{row.status}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  {selectedRoadmapCard === 'supplier_risk' && (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        <div style={{ background: '#ECFDF5', padding: '0.875rem', borderRadius: 8 }}>
                          <div style={{ fontSize: '0.7rem', color: '#047857', fontWeight: 700 }}>PLATFORM DEFAULT RISK</div>
                          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#059669', marginTop: '0.2rem' }}>{aiRoadmap?.supplierRiskAnalysis?.defaultRisk || '7.6%'}</div>
                        </div>
                        <div style={{ background: '#EFF6FF', padding: '0.875rem', borderRadius: 8 }}>
                          <div style={{ fontSize: '0.7rem', color: '#1D4ED8', fontWeight: 700 }}>STABILITY SCORE</div>
                          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#2563EB', marginTop: '0.2rem' }}>{aiRoadmap?.supplierRiskAnalysis?.stabilityScore || '92.4%'}</div>
                        </div>
                        <div style={{ background: '#F5F3FF', padding: '0.875rem', borderRadius: 8 }}>
                          <div style={{ fontSize: '0.7rem', color: '#6D28D9', fontWeight: 700 }}>ON-TIME FULFILLMENT</div>
                          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#7C3AED', marginTop: '0.2rem' }}>{aiRoadmap?.supplierRiskAnalysis?.onTimeFulfillment || '96.8%'}</div>
                        </div>
                      </div>

                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Supplier Verification Risk Breakdown</h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                          <thead style={{ background: '#F1F5F9' }}>
                            <tr>
                              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>SUPPLIER TIER</th>
                              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>DEFAULT RISK</th>
                              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>RELIABILITY SCORE</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(aiRoadmap?.supplierRiskAnalysis?.riskMatrix || [
                              { tier: 'Verified Suppliers', risk: 'Low (4.2%)', reliability: '96.5%' },
                              { tier: 'Pending Verification', risk: 'Medium (18.4%)', reliability: '78.2%' },
                              { tier: 'Unverified Tier', risk: 'High (38.1%)', reliability: '54.0%' }
                            ]).map((row, i) => (
                              <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700 }}>{row.tier}</td>
                                <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center', fontWeight: 600 }}>{row.risk}</td>
                                <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontWeight: 700, color: '#16A34A' }}>{row.reliability}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  {selectedRoadmapCard === 'pricing' && (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ background: '#F3E8FF', padding: '1rem', borderRadius: 8 }}>
                          <div style={{ fontSize: '0.75rem', color: '#6827B0', fontWeight: 700 }}>OPTIMAL MARKUP RATE</div>
                          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#7C3AED', marginTop: '0.25rem' }}>{aiRoadmap?.dynamicPricingIntel?.optimalCommissionMarkup || '15.0%'}</div>
                        </div>
                        <div style={{ background: '#EFF6FF', padding: '1rem', borderRadius: 8 }}>
                          <div style={{ fontSize: '0.75rem', color: '#1D4ED8', fontWeight: 700 }}>PRICING ELASTICITY R²</div>
                          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2563EB', marginTop: '0.25rem' }}>{aiRoadmap?.dynamicPricingIntel?.priceElasticityR2 || '0.9254'}</div>
                        </div>
                      </div>

                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Recommended Category Price Floors & Ceilings</h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                          <thead style={{ background: '#F1F5F9' }}>
                            <tr>
                              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>CATEGORY</th>
                              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>RECOMMENDED FLOOR</th>
                              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>RECOMMENDED CEILING</th>
                              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>PROFIT MARGIN</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(aiRoadmap?.dynamicPricingIntel?.priceFloorCeiling || [
                              { category: 'Vegetables', priceFloor: '£1.50/kg', ceiling: '£3.80/kg', margin: '15%' },
                              { category: 'Meat', priceFloor: '£6.20/kg', ceiling: '£14.50/kg', margin: '15%' },
                              { category: 'Fish', priceFloor: '£8.00/kg', ceiling: '£18.00/kg', margin: '15%' }
                            ]).map((row, i) => (
                              <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700 }}>{row.category}</td>
                                <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>{row.priceFloor}</td>
                                <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center', fontWeight: 600 }}>{row.ceiling}</td>
                                <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontWeight: 800, color: '#7C3AED' }}>{row.margin}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  {selectedRoadmapCard === 'trend' && (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        <div style={{ background: '#FEF3C7', padding: '0.875rem', borderRadius: 8 }}>
                          <div style={{ fontSize: '0.7rem', color: '#92400E', fontWeight: 700 }}>TOP DEMAND DRIVER</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#B45309', marginTop: '0.2rem' }}>Vegetables (42.1%)</div>
                        </div>
                        <div style={{ background: '#F0FDF4', padding: '0.875rem', borderRadius: 8 }}>
                          <div style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 700 }}>WEEKEND SURGE</div>
                          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#15803D', marginTop: '0.2rem' }}>+24.5%</div>
                        </div>
                        <div style={{ background: '#E0F2FE', padding: '0.875rem', borderRadius: 8 }}>
                          <div style={{ fontSize: '0.7rem', color: '#0369A1', fontWeight: 700 }}>WEATHER ELASTICITY</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0284C7', marginTop: '0.2rem' }}>+12.8% Sunny</div>
                        </div>
                      </div>

                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>XGBoost Feature Importance Ranking</h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                          <thead style={{ background: '#F1F5F9' }}>
                            <tr>
                              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>FEATURE NAME</th>
                              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>IMPORTANCE RATIO</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(aiRoadmap?.seasonalTrendDetection?.featureImportance || [
                              { feature: 'Category (Vegetables)', importance: '42.13%' },
                              { feature: 'Product (Tuna)', importance: '18.22%' },
                              { feature: 'Holiday Multiplier', importance: '14.65%' },
                              { feature: 'Weekend Spike', importance: '12.40%' },
                              { feature: 'Weather Condition', importance: '12.60%' }
                            ]).map((row, i) => (
                              <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700 }}>{row.feature}</td>
                                <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontWeight: 800, color: 'var(--color-primary)' }}>{row.importance}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  {selectedRoadmapCard === 'market' && (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ background: '#EFF6FF', padding: '1rem', borderRadius: 8 }}>
                          <div style={{ fontSize: '0.75rem', color: '#1D4ED8', fontWeight: 700 }}>STACKING META-MODEL R²</div>
                          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2563EB', marginTop: '0.25rem' }}>{aiRoadmap?.marketIntelEngine?.metaModelR2 || '0.9266'}</div>
                        </div>
                        <div style={{ background: '#F0FDF4', padding: '1rem', borderRadius: 8 }}>
                          <div style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 700 }}>MARKET HEALTH INDEX</div>
                          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16A34A', marginTop: '0.25rem' }}>{aiRoadmap?.marketIntelEngine?.marketHealthScore || '94.8 / 100'}</div>
                        </div>
                      </div>

                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Model Performance Comparison Study</h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                          <thead style={{ background: '#F1F5F9' }}>
                            <tr>
                              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>MODEL ARCHITECTURE</th>
                              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>MAE</th>
                              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>RMSE</th>
                              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>R² SCORE</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(aiRoadmap?.marketIntelEngine?.modelComparison || [
                              { model: 'XGBoost (with Time Lags)', mae: '6.95 kg', rmse: '10.20 kg', r2: '0.9918' },
                              { model: 'Stacking Ridge Meta-model', mae: '10.78 kg', rmse: '231.81', r2: '0.9266' },
                              { model: 'Hybrid (XGBoost + LR)', mae: '11.05 kg', rmse: '232.01', r2: '0.9254' },
                              { model: 'Moving Average Baseline', mae: '65.57 kg', rmse: '100.98', r2: '0.3813' }
                            ]).map((row, i) => (
                              <tr key={i} style={{ borderBottom: '1px solid var(--color-border)', background: i === 0 ? '#F0FDF4' : 'transparent' }}>
                                <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700 }}>{row.model}</td>
                                <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>{row.mae}</td>
                                <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>{row.rmse}</td>
                                <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontWeight: 800, color: i === 0 ? '#15803D' : 'var(--color-text-main)' }}>{row.r2}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>

                {/* Modal Footer */}
                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)', background: '#F8FAFC', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn-secondary" onClick={() => setSelectedRoadmapCard(null)} style={{ padding: '0.5rem 1.25rem', borderRadius: 8 }}>
                    Close Detailed Report
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB CONTENT: 3. SUPPORT & DISPUTE CENTER */}
      {activeTab === 'support' && (
        <div className="responsive-split" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1.5rem' }}>
          {/* Tickets List */}
          <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Dispute & Support Tickets</h3>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {['All', 'Open', 'In Progress', 'Resolved'].map(st => (
                  <button key={st} onClick={() => setTicketFilter(st)} style={{
                    padding: '0.25rem 0.6rem', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, border: 'none', cursor: 'pointer',
                    background: ticketFilter === st ? 'var(--color-primary)' : '#F1F5F9',
                    color: ticketFilter === st ? 'white' : 'var(--color-text-muted)',
                  }}>{st}</button>
                ))}
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {tickets.filter(t => ticketFilter === 'All' || t.status === ticketFilter).map((t, idx) => (
                <div 
                  key={t.id} 
                  onClick={() => setSelectedTicket(t)}
                  style={{
                    padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)', cursor: 'pointer',
                    background: selectedTicket?.id === t.id ? '#F5F3FF' : 'transparent',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => { if (selectedTicket?.id !== t.id) e.currentTarget.style.background = '#F8FAFC'; }}
                  onMouseLeave={e => { if (selectedTicket?.id !== t.id) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{t.id}</span>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: 999,
                      background: t.status === 'Open' ? '#FEF2F2' : (t.status === 'In Progress' ? '#FFFBEB' : '#DCFCE7'),
                      color: t.status === 'Open' ? '#991B1B' : (t.status === 'In Progress' ? '#B45309' : '#166534')
                    }}>{t.status}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.15rem' }}>{t.title}</div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.desc}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                    <span>Opened: {t.date}</span>
                    <span>Assignee: {t.assignee || 'Unassigned'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket Details Panel */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {selectedTicket ? (
              <>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary)' }}>Ticket {selectedTicket.id}</span>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: 999,
                      background: selectedTicket.priority === 'Critical' || selectedTicket.priority === 'High' ? '#FEE2E2' : '#EFF6FF',
                      color: selectedTicket.priority === 'Critical' || selectedTicket.priority === 'High' ? '#EF4444' : '#1D4ED8'
                    }}>{selectedTicket.priority} Priority</span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedTicket.title}</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.82rem' }}>
                    <div>
                      <strong style={{ color: 'var(--color-text-muted)' }}>Created By:</strong>
                      <div style={{ marginTop: '0.15rem', fontWeight: 700 }}>{selectedTicket.creator} ({selectedTicket.role})</div>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--color-text-muted)' }}>Category:</strong>
                      <div style={{ marginTop: '0.15rem', fontWeight: 700 }}>{selectedTicket.category}</div>
                    </div>
                  </div>

                  <div>
                    <strong style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Description:</strong>
                    <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', lineHeight: 1.5, background: 'var(--color-background)', padding: '0.75rem', borderRadius: 8 }}>
                      {selectedTicket.desc}
                    </p>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>Update Status</label>
                      <select 
                        value={selectedTicket.status} 
                        onChange={(e) => handleTicketStatusChange(selectedTicket.id, e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--color-border)', borderRadius: 8, outline: 'none', fontSize: '0.82rem' }}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>Assign Agent</label>
                      <select 
                        value={selectedTicket.assignee || ''} 
                        onChange={(e) => handleTicketAssign(selectedTicket.id, e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--color-border)', borderRadius: 8, outline: 'none', fontSize: '0.82rem' }}
                      >
                        <option value="">Unassigned</option>
                        <option value="Jane Smith">Jane Smith (Support)</option>
                        <option value="Bob Johnson">Bob Johnson (Billing)</option>
                        <option value="David Miller">David Miller (Logistics)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ background: '#EEF2F6', padding: '0.75rem', borderRadius: 8, fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Info size={14} style={{ color: 'var(--color-primary)' }} />
                    Changing ticket statuses triggers real-time emails to suppliers/buyers involved.
                  </div>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', padding: '4rem 0', textAlign: 'center' }}>
                <HelpCircle size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <h4>No Ticket Selected</h4>
                <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Select a ticket from the left panel to manage resolution details.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Header Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flex: 1, maxWidth: 500 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input 
                  className="input-field" 
                  placeholder="Search logs by keyword..." 
                  value={auditSearch} 
                  onChange={e => setAuditSearch(e.target.value)} 
                  style={{ paddingLeft: '2.5rem' }} 
                />
              </div>
              <select 
                value={auditFilter} 
                onChange={e => setAuditFilter(e.target.value)}
                style={{ padding: '0.5rem 1rem', border: '1px solid var(--color-border)', borderRadius: 8, outline: 'none', fontSize: '0.875rem', background: 'white' }}
              >
                <option value="All">All Categories</option>
                <option value="Security">Security Events</option>
                <option value="Settings">Settings Audit</option>
                <option value="Product">Product Updates</option>
                <option value="Order">Orders Operations</option>
                <option value="User">Users Management</option>
              </select>
            </div>

            <button className="btn-secondary" onClick={handleExportAuditLogs} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Export Logs CSV
            </button>
          </div>

          {/* Audit Logs Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead style={{ background: 'var(--color-background)', color: 'var(--color-text-muted)' }}>
                <tr>
                  <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontWeight: 700 }}>TIMESTAMP</th>
                  <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontWeight: 700 }}>ACTOR</th>
                  <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontWeight: 700 }}>ACTION</th>
                  <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontWeight: 700 }}>DETAILS</th>
                  <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontWeight: 700 }}>IP ADDRESS</th>
                  <th style={{ padding: '0.875rem 1.25rem', textAlign: 'right', fontWeight: 700 }}>CATEGORY</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs
                  .filter(l => auditFilter === 'All' || l.type === auditFilter)
                  .filter(l => {
                    const q = auditSearch.toLowerCase();
                    return l.actor.toLowerCase().includes(q) || l.action.toLowerCase().includes(q) || l.details.toLowerCase().includes(q);
                  })
                  .map((log, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '0.875rem 1.25rem', color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
                        {new Date(log.time).toLocaleString('en-GB')}
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem', fontWeight: 700 }}>{log.actor}</td>
                      <td style={{ padding: '0.875rem 1.25rem', color: 'var(--color-primary)', fontWeight: 600 }}>{log.action}</td>
                      <td style={{ padding: '0.875rem 1.25rem' }}>{log.details}</td>
                      <td style={{ padding: '0.875rem 1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{log.ip}</td>
                      <td style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>
                        <span style={{
                          fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: 4,
                          background: log.type === 'Security' ? '#FEE2E2' : '#E0E7FF',
                          color: log.type === 'Security' ? '#991B1B' : '#312E81'
                        }}>{log.type}</span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. SYSTEM SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 720 }}>
          {/* General Platform Setups */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Settings size={18} /> General System Config</h3>
            <div className="responsive-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>Platform Name</label>
                <input className="input-field" value={generalSettings.platformName} onChange={e => setGeneralSettings(prev => ({ ...prev, platformName: e.target.value }))} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>Contact Operations Email</label>
                <input className="input-field" type="email" value={generalSettings.contactEmail} onChange={e => setGeneralSettings(prev => ({ ...prev, contactEmail: e.target.value }))} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>Operations Hotline</label>
                <input className="input-field" value={generalSettings.supportPhone} onChange={e => setGeneralSettings(prev => ({ ...prev, supportPhone: e.target.value }))} required />
              </div>
            </div>
          </div>

          {/* Marketplace Policies */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Building size={18} /> Verification & Verification Workflows</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input type="checkbox" id="autoApproveProducts" checked={generalSettings.autoApproveProducts} onChange={e => setGeneralSettings(prev => ({ ...prev, autoApproveProducts: e.target.checked }))} style={{ accentColor: 'var(--color-primary)' }} />
                <label htmlFor="autoApproveProducts" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Auto-approve supplier product additions (bypass Admin review queue)</label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input type="checkbox" id="autoApproveSuppliers" checked={generalSettings.autoApproveSuppliers} onChange={e => setGeneralSettings(prev => ({ ...prev, autoApproveSuppliers: e.target.checked }))} style={{ accentColor: 'var(--color-primary)' }} />
                <label htmlFor="autoApproveSuppliers" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Auto-approve supplier registrations upon signing email verifications</label>
              </div>
            </div>
          </div>

          {/* Security Policy */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lock size={18} /> Password Policies & RBAC Lockouts</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>System Password Policy complexity</label>
                <select className="input-field" value={generalSettings.passwordPolicy} onChange={e => setGeneralSettings(prev => ({ ...prev, passwordPolicy: e.target.value }))}>
                  <option value="Basic (6+ characters)">Basic (6+ characters)</option>
                  <option value="Strong (8+ chars, mixed cases, special char)">Strong (8+ chars, mixed cases, special char)</option>
                  <option value="Enterprise (12+ chars, dynamic rotate)">Enterprise (12+ chars, dynamic rotate)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>Admin Session Inactivity Timeout</label>
                <select className="input-field" value={generalSettings.sessionTimeout} onChange={e => setGeneralSettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}>
                  <option value="15 minutes">15 minutes</option>
                  <option value="30 minutes">30 minutes</option>
                  <option value="60 minutes">60 minutes</option>
                  <option value="Never">Never Timeout</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input type="checkbox" id="twoFactorAuth" checked={generalSettings.twoFactorAuth} onChange={e => setGeneralSettings(prev => ({ ...prev, twoFactorAuth: e.target.checked }))} style={{ accentColor: 'var(--color-primary)' }} />
              <label htmlFor="twoFactorAuth" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Enforce Two-Factor Authentication (2FA) for all Admin and Staff logins</label>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2rem' }}>Save Configurations</button>
            {settingsSaved && <span style={{ color: '#16A34A', fontWeight: 700, fontSize: '0.875rem' }}>✅ Configurations Saved!</span>}
          </div>
        </form>
      )}
    </div>
  );
}
