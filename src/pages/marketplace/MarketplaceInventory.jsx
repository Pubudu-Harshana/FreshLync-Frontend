import React from 'react';
import { Package, Filter, Download } from 'lucide-react';
import SEO from '../../components/SEO';

export default function MarketplaceInventory() {
  const inventory = [
    { sku: 'SALM-091', name: 'Atlantic Salmon', supplier: 'Atlantic Blue Fisheries', category: 'Seafood', purchasePrice: '£24.99 / kg', stock: '85', unit: 'kg', status: 'In Stock' },
    { sku: 'BEEF-882', name: 'Angus Beef (Prime)', supplier: 'Valley Prime Meats', category: 'Meat', purchasePrice: '£32.00 / kg', stock: '120', unit: 'kg', status: 'In Stock' },
    { sku: 'KALE-001', name: 'Organic Curly Kale', supplier: 'GreenEarth Organics', category: 'Leafy Greens', purchasePrice: '£2.45 / lb', stock: '15', unit: 'lb', status: 'Low Stock' },
  ];

  return (
    <main style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto' }}>
      <SEO title="My Inventory" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My Inventory</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>Track and manage the stock you have purchased.</p>
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

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead style={{ background: 'var(--color-background)', color: 'var(--color-text-muted)' }}>
            <tr>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>PRODUCT</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>SUPPLIER</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>CATEGORY</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>PURCHASE PRICE</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>MY STOCK</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((p, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={20} color="#64748B" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{p.sku}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{p.supplier}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ background: '#E0E7FF', color: '#3730A3', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500 }}>{p.category}</span>
                </td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{p.purchasePrice}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ fontWeight: 600 }}>{p.stock}</span> <span style={{ color: 'var(--color-text-muted)' }}>{p.unit}</span>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ 
                    background: p.status === 'In Stock' ? '#DCFCE7' : '#FEF3C7', 
                    color: p.status === 'In Stock' ? '#166534' : '#B45309', 
                    padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 
                  }}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
