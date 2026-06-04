import React from 'react';
import { Filter, Download, ExternalLink } from 'lucide-react';
import SEO from '../../components/SEO';

export default function Orders() {
  const orders = [
    { id: 'ORD-7729', date: 'Oct 24, 2023', customer: 'Fresh Market Downtown', total: '£1,240.50', status: 'Pending', items: 14 },
    { id: 'ORD-7728', date: 'Oct 24, 2023', customer: 'Whole Foods Regional', total: '£4,800.00', status: 'In Transit', items: 42 },
    { id: 'ORD-7727', date: 'Oct 23, 2023', customer: 'Bistro 44', total: '£350.25', status: 'Delivered', items: 5 },
    { id: 'ORD-7726', date: 'Oct 23, 2023', customer: 'Local Coop', total: '£890.00', status: 'Delivered', items: 12 },
    { id: 'ORD-7725', date: 'Oct 22, 2023', customer: 'City Restaurants Group', total: '£2,100.00', status: 'Canceled', items: 24 },
  ];

  return (
    <div>
      <SEO title="Orders" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Order Management</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Track and manage incoming marketplace orders.</p>
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
        <button style={{ padding: '0.5rem 1rem', background: 'var(--color-primary)', color: 'white', borderRadius: '999px', fontWeight: 500, border: 'none' }}>All Orders</button>
        <button style={{ padding: '0.5rem 1rem', background: 'white', color: 'var(--color-text-main)', borderRadius: '999px', fontWeight: 500, border: '1px solid var(--color-border)' }}>Pending (4)</button>
        <button style={{ padding: '0.5rem 1rem', background: 'white', color: 'var(--color-text-main)', borderRadius: '999px', fontWeight: 500, border: '1px solid var(--color-border)' }}>In Transit (12)</button>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead style={{ background: 'var(--color-background)', color: 'var(--color-text-muted)' }}>
            <tr>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>ORDER ID</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>DATE</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>CUSTOMER</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>ITEMS</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>TOTAL</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>STATUS</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600 }}></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{o.id}</td>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>{o.date}</td>
                <td style={{ padding: '1rem 1.5rem' }}>{o.customer}</td>
                <td style={{ padding: '1rem 1.5rem' }}>{o.items}</td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{o.total}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ 
                    background: o.status === 'Delivered' ? '#DCFCE7' : (o.status === 'Pending' ? '#FEF3C7' : (o.status === 'In Transit' ? '#DBEAFE' : '#FEE2E2')), 
                    color: o.status === 'Delivered' ? '#166534' : (o.status === 'Pending' ? '#B45309' : (o.status === 'In Transit' ? '#1E40AF' : '#991B1B')), 
                    padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 
                  }}>
                    {o.status}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                  <button style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500, marginLeft: 'auto' }}>
                    View <ExternalLink size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
