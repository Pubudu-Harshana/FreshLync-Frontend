import React from 'react';
import { Truck, Map, Clock, ShieldCheck } from 'lucide-react';
import SEO from '../../components/SEO';

export default function Logistics() {
  const partners = [
    { name: 'ColdChain Express', type: 'Refrigerated LTL', rating: '4.9', coverage: 'National (US)', speed: '1-3 Days' },
    { name: 'Fresh Logistics Partners', type: 'Last Mile Delivery', rating: '4.7', coverage: 'West Coast', speed: 'Same Day' },
    { name: 'Global Freight Forwarders', type: 'Ocean & Air', rating: '4.6', coverage: 'International', speed: 'Varies' },
  ];

  return (
    <main style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto' }}>
      <SEO title="Logistics Partners" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Logistics Partners</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>Find verified 3PL and freight partners optimized for perishable goods.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {partners.map((p, idx) => (
          <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#DBEAFE', color: '#1E40AF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Truck size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{p.name}</h3>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{p.type}</div>
              </div>
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Map size={16} color="var(--color-text-muted)" /> <span style={{ fontWeight: 500 }}>Coverage:</span> {p.coverage}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} color="var(--color-text-muted)" /> <span style={{ fontWeight: 500 }}>Avg Speed:</span> {p.speed}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} color="var(--color-text-muted)" /> <span style={{ fontWeight: 500 }}>Temp-Guard Certified</span>
              </div>
            </div>

            <button className="btn-secondary" style={{ width: '100%' }}>Request Quote</button>
          </div>
        ))}
      </div>
    </main>
  );
}
