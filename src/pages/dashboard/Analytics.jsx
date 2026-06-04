import React from 'react';
import { TrendingUp, Activity, BarChart2, Calendar } from 'lucide-react';
import SEO from '../../components/SEO';

export default function Analytics() {
  return (
    <div>
      <SEO title="Analytics" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Analytics & Reporting</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Visualize your supply chain performance and market trends.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: 'white', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <Calendar size={16} /> Last 30 Days
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            <TrendingUp size={18} /> Revenue Growth
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>£42,150</div>
          <div style={{ color: '#16A34A', fontSize: '0.875rem', fontWeight: 500 }}>+15.2% vs last month</div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            <Activity size={18} /> Fulfillment Rate
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>98.4%</div>
          <div style={{ color: '#16A34A', fontSize: '0.875rem', fontWeight: 500 }}>+0.5% vs last month</div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            <BarChart2 size={18} /> Average Order Value
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>£1,840</div>
          <div style={{ color: '#EF4444', fontSize: '0.875rem', fontWeight: 500 }}>-2.1% vs last month</div>
        </div>
      </div>

      {/* Mock Chart Area */}
      <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>Revenue vs Volume (Last 6 Months)</h3>
        
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 2rem' }}>
          {/* Simple CSS bars for visualization since we don't have a charting library */}
          {[60, 80, 45, 90, 75, 100].map((height, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '40px' }}>
              <div style={{ width: '100%', height: `${height * 2.5}px`, background: 'var(--color-primary)', borderRadius: '4px 4px 0 0', opacity: 0.8 }}></div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'][i]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
