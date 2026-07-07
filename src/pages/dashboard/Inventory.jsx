import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight, X, RefreshCw, Upload } from 'lucide-react';
import SEO from '../../components/SEO';
import ConfirmModal from '../../components/ConfirmModal';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { productService } from '../../services/productService';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { getImageUrl } from '../../services/api';

const PAGE_SIZE = 8;
const CATEGORIES = ['All', 'Fish', 'Meat', 'Vegetables', 'Dairy', 'Grains', 'Other'];

const statusColor = {
  'In Stock':     { bg: '#DCFCE7', text: '#166534' },
  'Low Stock':    { bg: '#FEF3C7', text: '#B45309' },
  'Out of Stock': { bg: '#FEE2E2', text: '#991B1B' },
};

export default function Inventory() {
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [search, setSearch]         = useState('');
  const [category, setCategory]     = useState('All');
  const [page, setPage]             = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [stockSaving, setStockSaving]   = useState({});
  const [appealTarget, setAppealTarget] = useState(null);
  const [appealReason, setAppealReason] = useState('');
  const [appealSubmitting, setAppealSubmitting] = useState(false);

  const csvInputRef = useRef(null);
  const [csvProducts, setCsvProducts] = useState([]);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvUploading, setCsvUploading] = useState(false);
  const [csvProgress, setCsvProgress] = useState(0);
  const [csvLogs, setCsvLogs] = useState([]);

  // Client-side CSV line parser supporting quotes, commas, and escapes
  const parseCSV = (text) => {
    const lines = [];
    let row = [""];
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      const next = text[i + 1];
      if (c === '"') {
        if (inQuotes && next === '"') {
          row[row.length - 1] += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        row.push('');
      } else if ((c === '\r' || c === '\n') && !inQuotes) {
        if (c === '\r' && next === '\n') {
          i++;
        }
        lines.push(row);
        row = [''];
      } else {
        row[row.length - 1] += c;
      }
    }
    if (row.length > 1 || row[0] !== '') {
      lines.push(row);
    }
    return lines;
  };

  const handleCSVSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const rows = parseCSV(text);
        if (rows.length < 2) {
          showToast('CSV file is empty or missing data rows.', 'error');
          return;
        }

        const headers = rows[0].map(h => h.trim().toLowerCase());
        const nameIdx = headers.indexOf('name');
        const catIdx = headers.indexOf('category');
        const priceIdx = headers.indexOf('price');
        const unitIdx = headers.indexOf('unit');
        const stockIdx = headers.indexOf('stock');
        const minOrderIdx = headers.indexOf('minorder');
        const skuIdx = headers.indexOf('sku');
        const descIdx = headers.indexOf('description');

        if (nameIdx === -1 || catIdx === -1 || priceIdx === -1 || stockIdx === -1) {
          showToast('CSV must contain Name, Category, Price, and Stock columns.', 'error');
          return;
        }

        const parsedProducts = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (row.length < 4 || row.every(val => val.trim() === '')) continue;

          const name = row[nameIdx]?.trim() || '';
          const category = row[catIdx]?.trim() || 'Other';
          const price = row[priceIdx]?.trim() || '';
          const unit = unitIdx !== -1 ? (row[unitIdx]?.trim() || 'kg') : 'kg';
          const stock = row[stockIdx]?.trim() || '';
          const minOrder = minOrderIdx !== -1 ? (row[minOrderIdx]?.trim() || '1') : '1';
          const sku = skuIdx !== -1 ? (row[skuIdx]?.trim() || '') : '';
          const description = descIdx !== -1 ? (row[descIdx]?.trim() || '') : '';

          parsedProducts.push({
            name,
            category,
            price,
            unit,
            stock,
            minOrder,
            sku,
            description,
            lineNum: i + 1
          });
        }

        if (parsedProducts.length === 0) {
          showToast('No valid product rows found in CSV.', 'error');
          return;
        }

        setCsvProducts(parsedProducts);
        setCsvLogs([]);
        setCsvProgress(0);
        setShowCsvModal(true);
      } catch (err) {
        showToast('Failed to parse CSV file.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset file input
  };

  const handleCSVUpload = async () => {
    setCsvUploading(true);
    setCsvLogs([]);
    let successCount = 0;
    let failCount = 0;
    const logs = [];

    for (let i = 0; i < csvProducts.length; i++) {
      const p = csvProducts[i];
      const lineMsg = `Line ${p.lineNum} ("${p.name}"):`;
      
      let sku = p.sku;
      if (!sku) {
        const existingList = [...products];
        let prefix = p.name.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 4);
        if (!prefix) prefix = 'PROD';
        const matching = existingList
          .map(ep => (ep.sku || '').toUpperCase())
          .filter(esku => esku.startsWith(prefix + '-'));
        let maxNum = 0;
        matching.forEach(esku => {
          const parts = esku.split('-');
          const numPart = parseInt(parts[1], 10);
          if (!isNaN(numPart) && numPart > maxNum) maxNum = numPart;
        });
        sku = `${prefix}-${String(maxNum + 1).padStart(3, '0')}`;
      }

      const fd = new FormData();
      fd.append('name', p.name);
      fd.append('category', p.category);
      fd.append('price', p.price);
      fd.append('unit', p.unit);
      fd.append('stock', p.stock);
      fd.append('minOrder', p.minOrder);
      fd.append('sku', sku);
      fd.append('description', p.description);

      try {
        await productService.createProduct(fd);
        successCount++;
        logs.push({ type: 'success', text: `${lineMsg} Created successfully.` });
      } catch (err) {
        failCount++;
        const errMsg = err.response?.data?.message || 'Error occurred.';
        logs.push({ type: 'error', text: `${lineMsg} Failed - ${errMsg}` });
      }

      setCsvProgress(Math.round(((i + 1) / csvProducts.length) * 100));
      setCsvLogs([...logs]);
    }

    setCsvUploading(false);
    showToast(`Bulk upload finished. ${successCount} succeeded, ${failCount} failed.`, successCount > 0 ? 'success' : 'error');
    fetchProducts();
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      if (user && (user.id || user._id)) {
        const params = { limit: 100 };
        params.supplierId = user._id || user.id;
        const data = await productService.getProducts(params);
        setProducts(data.products || []);
      }
    } catch {
      setError('Failed to fetch products');
      showToast('Failed to fetch products.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchProducts();
    }
  }, [user, authLoading]);

  const filtered = useMemo(() => products.filter(p => {
    const q = search.toLowerCase();
    return (category === 'All' || p.category === category) &&
      (p.name.toLowerCase().includes(q) || (p.sku || '').toLowerCase().includes(q));
  }), [products, search, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleDelete = async () => {
    try {
      await productService.deleteProduct(deleteTarget._id);
      setProducts(prev => prev.filter(p => p._id !== deleteTarget._id));
      showToast(`Product "${deleteTarget.name}" deleted successfully.`, 'success');
    } catch { 
      showToast('Delete failed.', 'error'); 
    }
    setDeleteTarget(null);
  };

  const handleAppealSubmit = async (e) => {
    e.preventDefault();
    if (!appealReason.trim()) {
      showToast('Please enter a reason for the appeal.', 'error');
      return;
    }
    setAppealSubmitting(true);
    try {
      await productService.appealProduct(appealTarget._id, appealReason);
      showToast(`Appeal submitted successfully for "${appealTarget.name}".`, 'success');
      setAppealTarget(null);
      setAppealReason('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit appeal.', 'error');
    } finally {
      setAppealSubmitting(false);
    }
  };

  const handleStockChange = async (product, newStock) => {
    const n = parseInt(newStock, 10);
    setProducts(prev => prev.map(p => p._id === product._id ? { ...p, stock: isNaN(n) ? p.stock : n } : p));
    setStockSaving(prev => ({ ...prev, [product._id]: true }));
    try {
      await productService.updateStock(product._id, n);
    } catch { /* silent */ }
    setStockSaving(prev => ({ ...prev, [product._id]: false }));
  };

  if (loading || authLoading) return <LoadingSpinner fullPage message="Loading inventory..." />;

  return (
    <div>
      <SEO title="Inventory Management" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>Inventory</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            {products.length} products · {products.filter(p => p.stock < 50 && p.stock > 0).length} low stock
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-secondary" onClick={fetchProducts} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem' }}>
            <RefreshCw size={15} /> Refresh
          </button>
          <button className="btn-secondary" onClick={() => csvInputRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem' }}>
            <Upload size={15} /> Import CSV
          </button>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => navigate('/dashboard/add-product')}>
            <Plus size={18} /> Add Product
          </button>
          <input 
            type="file" 
            ref={csvInputRef} 
            accept=".csv" 
            style={{ display: 'none' }} 
            onChange={handleCSVSelect} 
          />
        </div>
      </div>

      {error && <div style={{ padding: '1rem', background: '#FEE2E2', color: '#991B1B', borderRadius: 8, marginBottom: '1rem' }}>{error}</div>}

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
          <input className="input-field" placeholder="Search products or SKU..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ paddingLeft: '2.5rem' }} />
          {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}><X size={14} /></button>}
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => { setCategory(cat); setPage(1); }} style={{
              padding: '0.45rem 0.875rem', borderRadius: 999, fontWeight: 600, fontSize: '0.8rem',
              border: `2px solid ${category === cat ? 'var(--color-primary)' : 'var(--color-border)'}`,
              background: category === cat ? 'var(--color-primary)' : 'white',
              color: category === cat ? 'white' : 'var(--color-text-muted)', cursor: 'pointer', transition: 'all 0.2s',
            }}>{cat}</button>
          ))}
        </div>
      </div>

      {pageItems.length === 0 ? (
        <EmptyState icon={Package} title="No products found" subtitle="Add a product or adjust your search." action={() => navigate('/dashboard/add-product')} actionLabel="Add Product" />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead style={{ background: 'var(--color-background)' }}>
              <tr>
                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h, i) => (
                  <th key={h} style={{ padding: '0.875rem 1.25rem', textAlign: i === 5 ? 'right' : 'left', fontWeight: 700, fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageItems.map(p => {
                const status = p.stock === 0 ? 'Out of Stock' : p.stock < 50 ? 'Low Stock' : 'In Stock';
                const sc = statusColor[status];
                return (
                  <tr key={p._id} style={{ borderTop: '1px solid var(--color-border)', background: p.isActive === false ? '#FAF5F5' : '', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = p.isActive === false ? '#F5EEEE' : '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = p.isActive === false ? '#FAF5F5' : ''}>
                    <td style={{ padding: '0.875rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 8, background: '#E2E8F0', overflow: 'hidden', flexShrink: 0 }}>
                          {p.image ? <img src={getImageUrl(p.image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={20} color="#94A3B8" style={{ margin: '10px' }} />}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{p.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>SKU: {p.sku || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem' }}>
                      <span style={{ background: '#E0E7FF', color: '#3730A3', padding: '0.2rem 0.6rem', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600 }}>{p.category}</span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', fontWeight: 600 }}>£{Number(p.price).toFixed(2)} / {p.unit}</td>
                    <td style={{ padding: '0.875rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <input type="number" min="0" value={p.stock}
                          onChange={e => handleStockChange(p, e.target.value)}
                          style={{ width: 72, padding: '0.25rem 0.4rem', border: `1px solid ${status !== 'In Stock' ? '#FCA5A5' : 'var(--color-border)'}`, borderRadius: 6, fontSize: '0.875rem', textAlign: 'right' }} />
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{p.unit}</span>
                        {stockSaving[p._id] && <span style={{ fontSize: '0.7rem', color: 'var(--color-primary)' }}>Saving…</span>}
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem' }}>
                      {p.isActive === false ? (
                        <span style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.2rem 0.65rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>Flagged / Rejected</span>
                      ) : (
                        <span style={{ background: sc.bg, color: sc.text, padding: '0.2rem 0.65rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>{status}</span>
                      )}
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>
                      {(user?.role === 'admin' || (p.supplier?._id || p.supplier) === (user?._id || user?.id)) ? (
                        <>
                          {p.isActive === false && (
                            <button 
                              title="Appeal Rejection" 
                              onClick={() => setAppealTarget(p)} 
                              style={{ 
                                padding: '0.25rem 0.6rem', 
                                borderRadius: 6, 
                                border: 'none', 
                                background: '#EFF6FF', 
                                color: '#2563EB', 
                                cursor: 'pointer', 
                                marginRight: '0.5rem',
                                fontSize: '0.75rem',
                                fontWeight: 700
                              }}
                            >
                              Appeal
                            </button>
                          )}
                          <button title="Edit" onClick={() => navigate(`/dashboard/edit-product/${p._id}`)} style={{ padding: '0.35rem', borderRadius: 6, border: 'none', background: '#EDE9FE', color: '#7C3AED', cursor: 'pointer', marginRight: '0.5rem' }}><Edit2 size={15} /></button>
                          <button title="Delete" onClick={() => setDeleteTarget(p)} style={{ padding: '0.35rem', borderRadius: 6, border: 'none', background: '#FEE2E2', color: '#DC2626', cursor: 'pointer' }}><Trash2 size={15} /></button>
                        </>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', background: '#F1F5F9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>View Only</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ padding: '0.875rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', background: 'var(--color-background)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Showing {((safePage - 1) * PAGE_SIZE) + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1} style={{ padding: '0.35rem 0.6rem', border: '1px solid var(--color-border)', borderRadius: 6, background: 'white', cursor: safePage === 1 ? 'not-allowed' : 'pointer', opacity: safePage === 1 ? 0.4 : 1 }}><ChevronLeft size={15} /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)} style={{ padding: '0.35rem 0.65rem', borderRadius: 6, border: `1px solid ${n === safePage ? 'var(--color-primary)' : 'var(--color-border)'}`, background: n === safePage ? 'var(--color-primary)' : 'white', color: n === safePage ? 'white' : 'var(--color-text-main)', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>{n}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} style={{ padding: '0.35rem 0.6rem', border: '1px solid var(--color-border)', borderRadius: 6, background: 'white', cursor: safePage === totalPages ? 'not-allowed' : 'pointer', opacity: safePage === totalPages ? 0.4 : 1 }}><ChevronRight size={15} /></button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={!!deleteTarget} title="Delete Product" message={`Delete "${deleteTarget?.name}"? This cannot be undone.`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      
      {/* Appeal Rejection Modal */}
      {appealTarget && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '1.75rem', boxShadow: 'var(--shadow-xl)', animation: 'slideUp 0.2s ease-out' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Appeal Listing Rejection</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Explain why <strong>{appealTarget.name}</strong> should be re-approved. Administrators will review your request.
            </p>
            <form onSubmit={handleAppealSubmit}>
              <textarea
                className="input-field"
                placeholder="Describe corrections, attach compliance details or notes..."
                value={appealReason}
                onChange={e => setAppealReason(e.target.value)}
                required
                rows={4}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 8, outline: 'none', resize: 'vertical', fontSize: '0.875rem', marginBottom: '1.25rem', fontFamily: 'inherit', border: '1px solid var(--color-border)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn-secondary" onClick={() => { setAppealTarget(null); setAppealReason(''); }} disabled={appealSubmitting}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={appealSubmitting}>
                  {appealSubmitting ? 'Submitting...' : 'Submit Appeal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Preview and Progress Modal */}
      {showCsvModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '640px', padding: '1.75rem', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--color-border)', borderRadius: '12px', background: 'white' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Bulk Import Products</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Verify product list parsed from CSV file before proceeding with the upload.
            </p>

            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1.25rem', border: '1px solid var(--color-border)', borderRadius: 8, padding: '0.5rem', minHeight: '200px' }}>
              {csvUploading || csvProgress > 0 ? (
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Uploading Progress: {csvProgress}%</div>
                  <div style={{ width: '100%', height: 10, background: 'var(--color-border)', borderRadius: 5, overflow: 'hidden', marginBottom: '1rem' }}>
                    <div style={{ width: `${csvProgress}%`, height: '100%', background: 'var(--color-primary)', transition: 'width 0.2s' }}></div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '200px', overflowY: 'auto', fontSize: '0.8rem' }}>
                    {csvLogs.map((log, idx) => (
                      <div key={idx} style={{ color: log.type === 'success' ? '#166534' : '#991B1B', background: log.type === 'success' ? '#DCFCE7' : '#FEE2E2', padding: '0.4rem 0.6rem', borderRadius: 4 }}>
                        {log.text}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-background)', textAlign: 'left' }}>
                      <th style={{ padding: '0.5rem' }}>Name</th>
                      <th style={{ padding: '0.5rem' }}>Category</th>
                      <th style={{ padding: '0.5rem' }}>Price</th>
                      <th style={{ padding: '0.5rem' }}>Stock</th>
                      <th style={{ padding: '0.5rem' }}>Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {csvProducts.map((p, idx) => (
                      <tr key={idx} style={{ borderTop: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '0.5rem', fontWeight: 600 }}>{p.name}</td>
                        <td style={{ padding: '0.5rem' }}>{p.category}</td>
                        <td style={{ padding: '0.5rem' }}>£{p.price}</td>
                        <td style={{ padding: '0.5rem' }}>{p.stock}</td>
                        <td style={{ padding: '0.5rem' }}>{p.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn-secondary" onClick={() => setShowCsvModal(false)} disabled={csvUploading}>
                {csvProgress === 100 ? 'Close' : 'Cancel'}
              </button>
              {csvProgress < 100 && (
                <button type="button" className="btn-primary" onClick={handleCSVUpload} disabled={csvUploading}>
                  {csvUploading ? 'Uploading...' : `Upload ${csvProducts.length} Products`}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
