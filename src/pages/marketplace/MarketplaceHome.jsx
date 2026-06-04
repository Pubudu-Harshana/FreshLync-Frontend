import React from 'react';
import { Filter, ArrowUpDown, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import SEO from '../../components/SEO';

export default function MarketplaceHome() {
  const { addToCart } = useCart();

  const products = [
    { name: 'Atlantic Salmon', price: '£24.99/kg', img: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&q=80&w=400', desc: 'Premium grade, sustainably farm-raised in the North Atlantic. Rich in Omega-3.', stock: 'In Stock' },
    { name: 'Organic Broccoli', price: '£4.50/lb', img: 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?auto=format&fit=crop&q=80&w=400', desc: 'Certified organic, pesticide-free heads harvested from local sustainable farms.', stock: 'In Stock' },
    { name: 'Angus Beef', price: '£32.00/kg', img: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&q=80&w=400', desc: 'Prime pasture-raised Angus beef. Hand-cut and aged for 21 days for maximum flavor.', stock: 'In Stock' },
    { name: 'Heirloom Tomatoes', price: '£6.75/lb', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400', desc: 'Mixed variety heirloom tomatoes, non-GMO and vine-ripened for peak sweetness.', stock: 'In Stock' },
    { name: 'Chilean Seabass', price: '£42.00/kg', img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400', desc: 'Wild-caught, MSC certified. Known for its buttery texture and delicate flavor.', stock: 'In Stock' },
    { name: 'Rainbow Carrots', price: '£3.25/ea', img: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&q=80&w=400', desc: 'Artisan bundle of purple, orange, and white carrots. Sweet and crunchy profile.', stock: 'In Stock' },
  ];

  return (
    <>
      <SEO title="Marketplace" />
      {/* Sidebar */}
      <aside style={{ width: '260px', background: 'white', borderRight: '1px solid var(--color-border)', padding: '2rem 1.5rem', flexShrink: 0 }}>
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>Categories</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0.75rem 1rem', background: '#E0E7FF', color: '#3730A3', borderRadius: '8px', fontWeight: 500, border: 'none', cursor: 'pointer' }}>
              <span style={{ display: 'flex', gap: '0.75rem' }}>🐟 Fish</span> <span>›</span>
            </button>
            <button style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', fontWeight: 500, border: 'none', background: 'transparent', cursor: 'pointer' }}>
              <span style={{ display: 'flex', gap: '0.75rem' }}>🥩 Meat</span> <span>›</span>
            </button>
            <button style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', fontWeight: 500, border: 'none', background: 'transparent', cursor: 'pointer' }}>
              <span style={{ display: 'flex', gap: '0.75rem' }}>🥦 Vegetables</span> <span>›</span>
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>Price Range</h4>
          <div style={{ height: '4px', background: '#E2E8F0', borderRadius: '2px', position: 'relative', marginBottom: '1rem' }}>
            <div style={{ position: 'absolute', left: '0', width: '60%', height: '100%', background: 'var(--color-primary)', borderRadius: '2px' }}></div>
            <div style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', background: 'var(--color-primary)', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}></div>
            <div style={{ position: 'absolute', left: '60%', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', background: 'var(--color-primary)', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 500 }}>
            <span>£0</span>
            <span>£10,000</span>
          </div>
        </div>

        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', marginBottom: '0.5rem' }}>Pro Insights</div>
          <p style={{ fontSize: '0.875rem', color: '#14532D', marginBottom: '1rem', lineHeight: 1.5 }}>
            Market prices for Atlantic Salmon are up 5% this week.
          </p>
          <button className="btn-primary" style={{ width: '100%', padding: '0.5rem', fontSize: '0.875rem' }}>View Analytics</button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Fresh Marketplace</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>Sourced directly from certified suppliers.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Filter size={18} /> Filter</button>
            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ArrowUpDown size={18} /> Sort</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {products.map((p, idx) => (
            <div key={idx} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: '200px' }}>
                <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: '#16A34A', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                  {p.stock}
                </div>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem' }}>{p.name}</h3>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{p.price}</div>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '1.5rem', flex: 1 }}>
                  {p.desc}
                </p>
                <button 
                  className="btn-primary" 
                  style={{ width: '100%' }}
                  onClick={() => addToCart(p)}
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
