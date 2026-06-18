import React, { useState, useEffect } from 'react';
import { Activity, Users, Truck, DollarSign, TrendingUp, Settings, RefreshCw } from 'lucide-react';
import SEO from '../../components/SEO';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminService } from '../../services/adminService';

export default function AdminDashboardOverview() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [margin, setMargin] = useState(15);
  const [marginSaved, setMarginSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const s = await adminService.getPlatformStats();
        setStats(s);
      } catch { /* silent */ }
      setLoading(false);
    };
    load();
  }, []);

  const handleSaveMargin = async () => {
    try {
      await adminService.saveMargin(margin);
      setMarginSaved(true);
      setTimeout(() => setMarginSaved(false), 3000);
    } catch { alert('Failed to save margin.'); }
  };

  if (loading) return <LoadingSpinner fullPage message="Loading admin dashboard..." />;

  const kpis = [
    { label: 'Total Platform GMV', value: `£${Number(stats?.totalGMV || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`, icon: DollarSign, badge: '+8.4%', bg: '#DBEAFE', color: '#1E40AF' },
    { label: 'Active Suppliers',   value: stats?.activeSuppliers ?? '—', icon: Users,    badge: `${stats?.activeSuppliers ?? 0} total`, bg: '#F3E8FF', color: '#6B21A8' },
    { label: 'Total Orders',       value: stats?.totalOrders ?? '—',    icon: Truck,    badge: 'Platform-wide',  bg: '#FEF9C3', color: '#854D0E' },
    { label: 'System Uptime',      value: '99.9%',                      icon: Activity, badge: 'Optimal',       bg: '#DCFCE7', color: '#166534' },
  ];

  return (
    <div>
      <SEO title="Admin Dashboard" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {kpis.map((k, i) => (
          <div key={i} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <k.icon size={20} style={{ color: k.color }} />
              </div>
              <span style={{ background: '#DCFCE7', color: '#166534', padding: '0.2rem 0.6rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700, height: 'max-content' }}>{k.badge}</span>
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>{k.label}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ minHeight: 300, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><TrendingUp size={18} /> Platform Activity</h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 1rem' }}>
            {[45, 60, 50, 80, 75, 95, 110].map((h, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: 30 }}>
                <div style={{ width: '100%', height: `${h * 1.8}px`, background: '#312E81', borderRadius: '4px 4px 0 0', opacity: 0.85 }} />
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem' }}>Pending Alerts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {[
              { title: 'Port Delay Detected', desc: 'London Gateway experiencing 24h backlog.', color: '#EF4444', bg: '#FEF2F2' },
              { title: 'Supplier Verification', desc: '5 new accounts pending compliance check.', color: '#F59E0B', bg: '#FFFBEB' },
              { title: 'System Update', desc: 'Scheduled maintenance window in 48 hours.', color: '#3B82F6', bg: '#EFF6FF' },
            ].map((a, i) => (
              <div key={i} style={{ padding: '0.875rem', borderLeft: `4px solid ${a.color}`, background: a.bg, borderRadius: '0 8px 8px 0' }}>
                <div style={{ fontWeight: 600, color: a.color, marginBottom: '0.2rem', fontSize: '0.875rem' }}>{a.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{a.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Settings size={18} /> Platform Margin Configuration</h3>
          {marginSaved && <span style={{ color: '#16A34A', fontSize: '0.875rem', fontWeight: 600 }}>Saved!</span>}
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>Set the global markup percentage applied to all wholesale transactions.</p>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', maxWidth: 380 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Global Margin Price (%)</label>
            <input type="number" value={margin} onChange={e => setMargin(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid var(--color-border)', outline: 'none' }} />
          </div>
          <button className="btn-primary" onClick={handleSaveMargin} style={{ padding: '0.75rem 1.5rem', height: 'max-content' }}>Save</button>
        </div>
      </div>
    </div>
  );
}
