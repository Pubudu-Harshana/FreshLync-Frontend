import React from 'react';
import { Activity, Users, Truck, DollarSign, TrendingUp } from 'lucide-react';
import SEO from '../../components/SEO';

export default function AdminDashboardOverview() {
  return (
    <div>
      <SEO title="Admin Dashboard Overview" />
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#DBEAFE', color: '#1E40AF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} />
            </div>
            <div style={{ background: '#DCFCE7', color: '#166534', padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, height: 'max-content' }}>+8.4%</div>
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Total Platform GMV</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>£1,245,800.00</div>
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#F3E8FF', color: '#6B21A8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} />
            </div>
            <div style={{ background: '#DCFCE7', color: '#166534', padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, height: 'max-content' }}>+12 New</div>
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Active Suppliers</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>342</div>
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#FEF9C3', color: '#854D0E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={20} />
            </div>
            <div style={{ background: '#F1F5F9', color: '#475569', padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, height: 'max-content' }}>Global</div>
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Active Shipments</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>1,845</div>
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={20} />
            </div>
            <div style={{ background: '#DCFCE7', color: '#166534', padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, height: 'max-content' }}>99.9%</div>
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>System Uptime</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>Optimal</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><TrendingUp size={18} /> Network Volume (Last 7 Days)</h3>
          
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 1rem' }}>
            {/* Mock Chart Area */}
            {[45, 60, 50, 80, 75, 95, 110].map((height, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '30px' }}>
                <div style={{ width: '100%', height: `${height * 2.2}px`, background: '#312E81', borderRadius: '4px 4px 0 0', opacity: 0.9 }}></div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Pending Alerts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            <div style={{ padding: '1rem', borderLeft: '4px solid #EF4444', background: '#FEF2F2', borderRadius: '0 8px 8px 0' }}>
              <div style={{ fontWeight: 600, color: '#991B1B', marginBottom: '0.25rem' }}>Port Delay Detected</div>
              <div style={{ fontSize: '0.875rem', color: '#7F1D1D' }}>London Gateway experiencing 24h backlog.</div>
            </div>
            <div style={{ padding: '1rem', borderLeft: '4px solid #F59E0B', background: '#FFFBEB', borderRadius: '0 8px 8px 0' }}>
              <div style={{ fontWeight: 600, color: '#92400E', marginBottom: '0.25rem' }}>Supplier Verification</div>
              <div style={{ fontSize: '0.875rem', color: '#78350F' }}>5 new supplier accounts pending compliance check.</div>
            </div>
            <div style={{ padding: '1rem', borderLeft: '4px solid #3B82F6', background: '#EFF6FF', borderRadius: '0 8px 8px 0' }}>
              <div style={{ fontWeight: 600, color: '#1E40AF', marginBottom: '0.25rem' }}>System Update</div>
              <div style={{ fontSize: '0.875rem', color: '#1E3A8A' }}>Scheduled maintenance window in 48 hours.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
