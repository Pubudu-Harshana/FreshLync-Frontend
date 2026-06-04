import React from 'react';
import { Search, MapPin, Star, ShieldCheck, Filter } from 'lucide-react';
import SEO from '../../components/SEO';

export default function Suppliers() {
  const suppliers = [
    { name: 'GreenEarth Organics', location: 'Salinas, CA', rating: '4.9', certs: 3, categories: 'Leafy Greens, Root Veg', since: '2019' },
    { name: 'Atlantic Blue Fisheries', location: 'Portland, ME', rating: '4.8', certs: 4, categories: 'Seafood, Shellfish', since: '2015' },
    { name: 'Valley Prime Meats', location: 'Omaha, NE', rating: '4.7', certs: 2, categories: 'Beef, Pork', since: '2010' },
    { name: 'Sunrise Orchards', location: 'Yakima, WA', rating: '4.9', certs: 2, categories: 'Apples, Pears, Cherries', since: '2021' },
  ];

  return (
    <main style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto' }}>
      <SEO title="Suppliers Directory" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Supplier Directory</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>Browse and connect with verified Freshlync network partners.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input type="text" placeholder="Search by name or category..." style={{ padding: '0.5rem 1rem 0.5rem 2.5rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', width: '250px' }} />
          </div>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Filter size={18} /> Filters</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {suppliers.map((s, idx) => (
          <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                  {s.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{s.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    <MapPin size={12} /> {s.location}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Categories:</span>
                <span style={{ fontWeight: 500 }}>{s.categories}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Rating:</span>
                <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#D97706' }}>
                  <Star size={14} fill="currentColor" /> {s.rating}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Compliance:</span>
                <span style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#16A34A' }}>
                  <ShieldCheck size={14} /> {s.certs} Active Certs
                </span>
              </div>
            </div>

            <button className="btn-secondary" style={{ width: '100%' }}>View Profile</button>
          </div>
        ))}
      </div>
    </main>
  );
}
