import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Lock } from 'lucide-react';
import SEO from '../../components/SEO';
import LoadingSpinner from '../../components/LoadingSpinner';
import { productService } from '../../services/productService';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = ['Fish', 'Meat', 'Vegetables', 'Dairy', 'Grains', 'Other'];
const UNITS = ['kg', 'lb', 'each', 'box', 'crate', 'litre'];

export default function EditProduct() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm]     = useState({ name: '', category: 'Vegetables', price: '', unit: 'kg', stock: '', minOrder: '1', sku: '', description: '' });
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const p = await productService.getProduct(id);
        const ownerId = p.supplier?._id || p.supplier;
        if (user?.role !== 'admin' && ownerId !== (user?._id || user?.id)) {
          setError('You are not authorised to edit this product.');
        } else {
          setForm({ name: p.name, category: p.category, price: p.price, unit: p.unit, stock: p.stock, minOrder: p.minOrder || 1, sku: p.sku || '', description: p.description || '' });
        }
      } catch { setError('Product not found.'); }
      setLoading(false);
    };
    load();
  }, [id, user]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSaving(true);
    try {
      await productService.updateProduct(id, form);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard/inventory'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product.');
    } finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner fullPage message="Loading product..." />;

  if (success) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: '1rem', textAlign: 'center' }}>
      <CheckCircle size={64} color="#16A34A" />
      <h2 style={{ fontSize: '1.5rem' }}>Product Updated!</h2>
      <p style={{ color: 'var(--color-text-muted)' }}>Redirecting to inventory…</p>
    </div>
  );

  const inputStyle = { width: '100%', padding: '0.7rem 0.875rem', borderRadius: 8, border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' };

  return (
    <div style={{ position: 'relative' }}>
      <SEO title="Edit Product" />

      {user?.role === 'supplier' && user?.verificationStatus !== 'approved' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '6rem 2rem',
          textAlign: 'center',
          borderRadius: '12px',
          minHeight: '400px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#FEF3C7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            color: '#D97706',
          }}>
            <Lock size={32} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 750, color: 'var(--color-text-main)', marginBottom: '0.75rem' }}>
            Account Verification Required
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: '440px', marginBottom: '2rem', lineHeight: 1.6 }}>
            Your account is currently in <strong>{user?.verificationStatus ? user.verificationStatus.replace('_', ' ') : 'unverified'}</strong> status. You must be verified and approved by compliance before you can edit products.
          </p>
          <button type="button" onClick={() => navigate('/dashboard')} className="btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '0.9rem' }}>
            Back to Dashboard
          </button>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
        <button onClick={() => navigate('/dashboard/inventory')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
          <ArrowLeft size={18} /> Back to Inventory
        </button>
        <div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.15rem' }}>Edit Product</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Update product details below.</p>
        </div>
      </div>

      {error && <div style={{ padding: '0.875rem', background: '#FEE2E2', color: '#991B1B', borderRadius: 8, marginBottom: '1.25rem', fontSize: '0.875rem' }}>{error}</div>}

      {!error && (
        <form onSubmit={handleSubmit}>
          <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={labelStyle}>Product Name *</label>
              <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}>SKU</label>
              <input style={inputStyle} value={form.sku} onChange={e => set('sku', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select style={inputStyle} value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Unit</label>
              <select style={inputStyle} value={form.unit} onChange={e => set('unit', e.target.value)}>
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Price (£) *</label>
              <input style={inputStyle} type="number" min="0" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}>Stock *</label>
              <input style={inputStyle} type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}>Min Order</label>
              <input style={inputStyle} type="number" min="1" value={form.minOrder} onChange={e => set('minOrder', e.target.value)} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Description</label>
              <textarea style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn-primary" style={{ padding: '0.8rem 2rem', opacity: saving ? 0.7 : 1 }} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard/inventory')}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
