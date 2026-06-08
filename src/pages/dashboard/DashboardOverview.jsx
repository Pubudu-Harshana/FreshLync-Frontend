import React from 'react';
import { LayoutDashboard, Package, ShoppingBag, ShieldCheck, Edit2, Trash2 } from 'lucide-react';
import SEO from '../../components/SEO';

export default function DashboardOverview() {
  const products = [
    { sku: 'KALE-001', name: 'Organic Curly Kale', category: 'Vegetables', price: '£2.45 / kg', stock: '1250', unit: 'kg', status: 'In Stock' },
    { sku: 'PEPP-042', name: 'Mixed Bell Peppers', category: 'Vegetables', price: '£1.80 / kg', stock: '42', unit: 'kg', status: 'Low Stock' },
    { sku: 'BEEF-882', name: 'Angus Beef (Prime)', category: 'Meat', price: '£32.00 / kg', stock: '850', unit: 'kg', status: 'In Stock' },
  ];

  return (
    <div>
      <SEO title="Dashboard Overview" />
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LayoutDashboard size={20} />
            </div>
            <div style={{ background: '#DCFCE7', color: '#166534', padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, height: 'max-content' }}>+12.5%</div>
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Total Sales</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>£142,580.00</div>
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#F1F5F9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={20} />
            </div>
            <div style={{ background: '#F1F5F9', color: '#475569', padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, height: 'max-content' }}>8 Pending</div>
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Orders to Fulfill</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>24</div>
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#FEE2E2', color: '#991B1B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={20} />
            </div>
            <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, height: 'max-content' }}>Critical</div>
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Low Stock Alert</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>03 <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>Items</span></div>
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} />
            </div>
            <div style={{ background: '#DCFCE7', color: '#166534', padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, height: 'max-content' }}>Top Tier</div>
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Supplier Rating</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>4.92 <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>/ 5.0</span></div>
        </div>
      </div>

      {/* Table Area */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Inventory Overview</h3>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Recent updates to stock volumes</div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Export CSV</button>
          </div>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead style={{ background: 'var(--color-background)', color: 'var(--color-text-muted)' }}>
            <tr>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>PRODUCT</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>CATEGORY</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>WHOLESALE PRICE</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>STOCK VOLUME</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#E2E8F0' }}></div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>SKU: {p.sku}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ background: '#E0E7FF', color: '#3730A3', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500 }}>{p.category}</span>
                </td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{p.price}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 600 }}>{p.stock}</span>
                    <span style={{ color: 'var(--color-text-muted)' }}>{p.unit}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ background: p.status === 'In Stock' ? '#DCFCE7' : '#FEE2E2', color: p.status === 'In Stock' ? '#166534' : '#991B1B', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
