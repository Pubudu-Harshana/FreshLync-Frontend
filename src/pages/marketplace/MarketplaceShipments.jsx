import React from 'react';
import { Filter, Download, ExternalLink, MapPin } from 'lucide-react';
import SEO from '../../components/SEO';

export default function MarketplaceShipments() {
  const shipments = [
    { id: 'SHP-9021', date: 'Oct 24, 2023', supplier: 'GreenEarth Organics', origin: 'Salinas, CA', carrier: 'ColdChain Express', total: '£12,400.50', status: 'In Transit' },
    { id: 'SHP-8542', date: 'Oct 21, 2023', supplier: 'Atlantic Blue Fisheries', origin: 'Portland, ME', carrier: 'Global Freight', total: '£48,000.00', status: 'Delivered' },
    { id: 'SHP-8109', date: 'Oct 15, 2023', supplier: 'Valley Prime Meats', origin: 'Omaha, NE', carrier: 'Fresh Logistics', total: '£3,500.25', status: 'Delivered' },
  ];

  return (
    <main style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto' }}>
      <SEO title="My Shipments" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My Shipments</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>Track inbound orders from your suppliers.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} /> Filter
          </button>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button style={{ padding: '0.5rem 1rem', background: 'var(--color-primary)', color: 'white', borderRadius: '999px', fontWeight: 500, border: 'none' }}>All Inbound (3)</button>
        <button style={{ padding: '0.5rem 1rem', background: 'white', color: 'var(--color-text-main)', borderRadius: '999px', fontWeight: 500, border: '1px solid var(--color-border)' }}>In Transit (1)</button>
        <button style={{ padding: '0.5rem 1rem', background: 'white', color: 'var(--color-text-main)', borderRadius: '999px', fontWeight: 500, border: '1px solid var(--color-border)' }}>Delivered (2)</button>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead style={{ background: 'var(--color-background)', color: 'var(--color-text-muted)' }}>
            <tr>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>TRACKING ID</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>DATE</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>SUPPLIER</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>ORIGIN</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>CARRIER</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>STATUS</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600 }}></th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((s, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{s.id}</td>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>{s.date}</td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{s.supplier}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-text-muted)' }}>
                    <MapPin size={14} /> {s.origin}
                  </div>
                </td>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>{s.carrier}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ 
                    background: s.status === 'Delivered' ? '#DCFCE7' : '#DBEAFE', 
                    color: s.status === 'Delivered' ? '#166534' : '#1E40AF', 
                    padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 
                  }}>
                    {s.status}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                  <button style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500, marginLeft: 'auto' }}>
                    Track <ExternalLink size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
