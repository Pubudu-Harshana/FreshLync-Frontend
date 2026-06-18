import React, { useState } from 'react';
import { User, Building2, Mail, Phone, Globe, Upload, Check, Save } from 'lucide-react';
import SEO from '../../components/SEO';

export default function SupplierProfile() {
  const [form, setForm] = useState({
    businessName: 'North Atlantic Co.', contactName: 'James Harrison', email: 'james@northatlantic.co',
    phone: '+44 7700 900123', website: 'https://northatlantic.co', address: '14 Harbour Street, Aberdeen, AB10 1XY',
    description: 'Premium seafood supplier with 20 years of experience in sustainable North Atlantic fisheries.',
    bankName: '', accountNumber: '', sortCode: '', avatar: null,
  });
  const [preview, setPreview] = useState(null);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState('business');

  const set = (f, v) => { setForm(p => ({ ...p, [f]: v })); setSaved(false); };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    set('avatar', file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setTimeout(() => setSaved(true), 600);
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <SEO title="Supplier Profile" />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <label style={{ position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
          <input type="file" accept="image/*" onChange={handleAvatar} style={{ display: 'none' }} />
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: preview ? 'transparent' : 'linear-gradient(135deg, #15803d, #1f9d55)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '3px solid white', boxShadow: '0 4px 16px rgba(21,128,61,0.3)' }}>
            {preview ? <img src={preview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={36} style={{ color: 'white' }} />}
          </div>
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
            <Upload size={12} style={{ color: 'white' }} />
          </div>
        </label>
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>{form.businessName}</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{form.email}</p>
        </div>
        {saved && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#DCFCE7', color: '#16A34A', padding: '0.4rem 0.875rem', borderRadius: 999, fontWeight: 600, fontSize: '0.85rem' }}>
            <Check size={14} /> Saved
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: '1.5rem', gap: '0' }}>
        {[['business', 'Business Info'], ['banking', 'Banking'], ['security', 'Security']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{ padding: '0.75rem 1.5rem', fontWeight: 600, fontSize: '0.9rem', borderBottom: `3px solid ${tab === key ? 'var(--color-primary)' : 'transparent'}`, color: tab === key ? 'var(--color-primary)' : 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave}>
        {tab === 'business' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Building2 size={18} style={{ color: 'var(--color-primary)' }} />
                <h3 style={{ fontSize: '1rem' }}>Company Details</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <PF label="Business Name *"><input className="input-field" value={form.businessName} onChange={e => set('businessName', e.target.value)} /></PF>
                <PF label="Contact Name *"><input className="input-field" value={form.contactName} onChange={e => set('contactName', e.target.value)} /></PF>
                <PF label="Business Email *"><input className="input-field" type="email" value={form.email} onChange={e => set('email', e.target.value)} /></PF>
                <PF label="Phone"><input className="input-field" value={form.phone} onChange={e => set('phone', e.target.value)} /></PF>
                <PF label="Website" colSpan={2}><input className="input-field" value={form.website} onChange={e => set('website', e.target.value)} /></PF>
                <PF label="Address" colSpan={2}><input className="input-field" value={form.address} onChange={e => set('address', e.target.value)} /></PF>
                <PF label="Business Description" colSpan={2}>
                  <textarea className="input-field" value={form.description} onChange={e => set('description', e.target.value)} rows={3} style={{ resize: 'vertical' }} />
                </PF>
              </div>
            </div>
          </div>
        )}

        {tab === 'banking' && (
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem' }}>💳 Banking Details</h3>
            </div>
            <div style={{ background: '#FEF3C7', borderRadius: 10, padding: '0.875rem', fontSize: '0.85rem', color: '#92400E', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              ⚠️ Bank details are encrypted and used solely for payment processing. Never share these credentials with anyone.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <PF label="Bank Name" colSpan={2}><input className="input-field" value={form.bankName} onChange={e => set('bankName', e.target.value)} placeholder="e.g. Barclays Business" /></PF>
              <PF label="Account Number"><input className="input-field" value={form.accountNumber} onChange={e => set('accountNumber', e.target.value)} placeholder="12345678" type="password" /></PF>
              <PF label="Sort Code"><input className="input-field" value={form.sortCode} onChange={e => set('sortCode', e.target.value)} placeholder="00-00-00" /></PF>
            </div>
          </div>
        )}

        {tab === 'security' && (
          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>🔒 Change Password</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <PF label="Current Password"><input className="input-field" type="password" placeholder="••••••••" /></PF>
              <PF label="New Password"><input className="input-field" type="password" placeholder="••••••••" /></PF>
              <PF label="Confirm New Password"><input className="input-field" type="password" placeholder="••••••••" /></PF>
            </div>
          </div>
        )}

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
          <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Save size={16} /> Save Changes
          </button>
          <button type="button" className="btn-secondary">Discard</button>
        </div>
      </form>
    </div>
  );
}

function PF({ label, children, colSpan }) {
  return (
    <div style={{ gridColumn: colSpan ? `span ${colSpan}` : undefined }}>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--color-text-muted)' }}>{label}</label>
      {children}
    </div>
  );
}
