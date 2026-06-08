import React from 'react';
import { Package, Plus, Filter, Edit2, Trash2 } from 'lucide-react';
import SEO from '../../components/SEO';

export default function Inventory() {
  const products = [
    { sku: 'KALE-001', name: 'Organic Curly Kale', category: 'Vegetables', price: '£2.45 / kg', stock: '1250', unit: 'kg', status: 'In Stock' },
    { sku: 'PEPP-042', name: 'Mixed Bell Peppers', category: 'Vegetables', price: '£1.80 / kg', stock: '42', unit: 'kg', status: 'Low Stock' },
    { sku: 'BEEF-882', name: 'Angus Beef (Prime)', category: 'Meat', price: '£32.00 / kg', stock: '850', unit: 'kg', status: 'In Stock' },
    { sku: 'CARR-092', name: 'Rainbow Carrots', category: 'Vegetables', price: '£1.50 / kg', stock: '3200', unit: 'kg', status: 'In Stock' },
    { sku: 'SALM-091', name: 'Atlantic Salmon', category: 'Fish', price: '£24.99 / kg', stock: '0', unit: 'kg', status: 'Out of Stock' },
  ];

  return (
    <div>
      <SEO title="Inventory Management" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Inventory Management</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Manage your products, stock levels, and pricing.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} /> Filter
          </button>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead style={{ background: 'var(--color-background)', color: 'var(--color-text-muted)' }}>
            <tr>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>PRODUCT</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>CATEGORY</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>PRICE</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>STOCK</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>STATUS</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600 }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={24} color="#94A3B8" />
                    </div>
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
                    <input type="text" defaultValue={p.stock} style={{ width: '80px', padding: '0.25rem 0.5rem', border: `1px solid ${p.status === 'Low Stock' || p.status === 'Out of Stock' ? '#FCA5A5' : 'var(--color-border)'}`, borderRadius: '4px' }} />
                    <span style={{ color: 'var(--color-text-muted)' }}>{p.unit}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ 
                    background: p.status === 'In Stock' ? '#DCFCE7' : (p.status === 'Low Stock' ? '#FEF3C7' : '#FEE2E2'), 
                    color: p.status === 'In Stock' ? '#166534' : (p.status === 'Low Stock' ? '#B45309' : '#991B1B'), 
                    padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 
                  }}>
                    {p.status}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                  <button style={{ color: 'var(--color-text-muted)', marginRight: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}><Edit2 size={18} /></button>
                  <button style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          <div>Showing 1-5 of 124 products</div>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button style={{ padding: '0.25rem 0.5rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'white' }}>&lt;</button>
            <button style={{ padding: '0.25rem 0.75rem', background: 'var(--color-primary)', color: 'white', borderRadius: '4px', border: 'none' }}>1</button>
            <button style={{ padding: '0.25rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'white' }}>2</button>
            <button style={{ padding: '0.25rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'white' }}>3</button>
            <button style={{ padding: '0.25rem 0.5rem', border: '1px solid var(--color-border)', borderRadius: '4px', background: 'white' }}>&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
