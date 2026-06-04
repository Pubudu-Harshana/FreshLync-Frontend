import React from 'react';
import { Package, Filter, Download, ExternalLink } from 'lucide-react';
import SEO from '../../components/SEO';

export default function AdminInventory() {
  const globalInventory = [
    { sku: 'KALE-001', name: 'Organic Curly Kale', supplier: 'GreenEarth Organics', category: 'Leafy Greens', price: '£2.45 / lb', stock: '1250', status: 'Healthy' },
    { sku: 'BEEF-882', name: 'Angus Beef (Prime)', supplier: 'Valley Prime Meats', category: 'Meat', price: '£32.00 / kg', stock: '450', status: 'Healthy' },
    { sku: 'SALM-091', name: 'Atlantic Salmon', supplier: 'Atlantic Blue Fisheries', category: 'Seafood', price: '£24.99 / kg', stock: '85', status: 'Low Stock' },
    { sku: 'PEPP-042', name: 'Mixed Bell Peppers', supplier: 'GreenEarth Organics', category: 'Vegetables', price: '£1.80 / unit', stock: '42', status: 'Low Stock' },
    { sku: 'CHER-112', name: 'Bing Cherries', supplier: 'Sunrise Orchards', category: 'Fruits', price: '£5.50 / lb', stock: '0', status: 'Depleted' },
  ];

  return (
    <div>
      <SEO title="System Inventory" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Global Inventory Directory</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Oversight of all active SKUs across registered suppliers.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} /> Category Filter
          </button>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={18} /> Export Directory
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button style={{ padding: '0.5rem 1rem', background: '#312E81', color: 'white', borderRadius: '999px', fontWeight: 500, border: 'none' }}>All SKUs (14,205)</button>
        <button style={{ padding: '0.5rem 1rem', background: 'white', color: 'var(--color-text-main)', borderRadius: '999px', fontWeight: 500, border: '1px solid var(--color-border)' }}>Low Stock Warning (842)</button>
        <button style={{ padding: '0.5rem 1rem', background: 'white', color: 'var(--color-text-main)', borderRadius: '999px', fontWeight: 500, border: '1px solid var(--color-border)' }}>Depleted (156)</button>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead style={{ background: 'var(--color-background)', color: 'var(--color-text-muted)' }}>
            <tr>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>PRODUCT (SKU)</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>SUPPLIER</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>CATEGORY</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>PRICE</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>GLOBAL STOCK</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>HEALTH</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600 }}></th>
            </tr>
          </thead>
          <tbody>
            {globalInventory.map((p, idx) => (
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
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{p.price}</td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{p.stock}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ 
                    background: p.status === 'Healthy' ? '#DCFCE7' : (p.status === 'Low Stock' ? '#FEF3C7' : '#FEE2E2'), 
                    color: p.status === 'Healthy' ? '#166534' : (p.status === 'Low Stock' ? '#B45309' : '#991B1B'), 
                    padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 
                  }}>
                    {p.status}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                  <button style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <ExternalLink size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          <div>Showing 1-5 of 14,205 global products</div>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button style={{ padding: '0.25rem 0.5rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'white' }}>&lt;</button>
            <button style={{ padding: '0.25rem 0.75rem', background: '#312E81', color: 'white', borderRadius: '4px', border: 'none' }}>1</button>
            <button style={{ padding: '0.25rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'white' }}>2</button>
            <button style={{ padding: '0.25rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'white' }}>3</button>
            <button style={{ padding: '0.25rem 0.5rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'white' }}>&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
