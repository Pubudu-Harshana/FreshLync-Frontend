import React, { useState, useEffect, useMemo } from 'react';
import { Download, ChevronDown, ChevronUp, Package, MapPin, Calendar, User, RefreshCw, Layers } from 'lucide-react';
import SEO from '../../components/SEO';
import LoadingSpinner from '../../components/LoadingSpinner';
import { orderService } from '../../services/orderService';

const STATUS_TABS = ['All', 'Pending', 'In Transit', 'Delivered', 'Cancelled'];
const STATUS_STYLE = {
  Pending:      { bg: '#FEF3C7', text: '#B45309' },
  'In Transit': { bg: '#DBEAFE', text: '#1E40AF' },
  Delivered:    { bg: '#DCFCE7', text: '#166534' },
  Cancelled:    { bg: '#FEE2E2', text: '#991B1B' },
};

export default function AdminOrders() {
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedId, setExpandedId]     = useState(null);
  const [savingStatus, setSavingStatus] = useState({});

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders({ limit: 100 });
      setOrders(data.orders || []);
    } catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const filtered = useMemo(() =>
    statusFilter === 'All' ? orders : orders.filter(o => o.status === statusFilter),
  [orders, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    setSavingStatus(prev => ({ ...prev, [orderId]: true }));
    try {
      const updated = await orderService.updateStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: updated.status, supplierStatuses: updated.supplierStatuses } : o));
    } catch { alert('Failed to update status.'); }
    setSavingStatus(prev => ({ ...prev, [orderId]: false }));
  };

  const handleExportCSV = () => {
    const header = 'Order ID,Date,Customer,Suppliers,Items,Total,Overall Status\n';
    const rows = filtered.map(o => {
      const id   = o._id.slice(-6).toUpperCase();
      const date = new Date(o.createdAt).toLocaleDateString('en-GB');
      const cust = o.buyer?.name || o.delivery?.firstName || '—';
      const uniqueSuppliers = [...new Set(o.items?.map(i => i.supplierName || 'Unknown Supplier'))].join('; ');
      return `ORD-${id},${date},"${cust}","${uniqueSuppliers}",${o.items?.length || 0},£${o.total?.toFixed(2)},${o.status}`;
    }).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url; a.download = 'admin-orders.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <LoadingSpinner fullPage message="Loading platform orders..." />;

  return (
    <div>
      <SEO title="System Orders" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Global Order Management</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Monitor and update status for all client orders across the platform.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-secondary" onClick={fetchOrders} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem' }}><RefreshCw size={15} /> Refresh</button>
          <button className="btn-secondary" onClick={handleExportCSV} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Download size={16} /> Export CSV</button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {STATUS_TABS.map(s => {
          const count = s === 'All' ? orders.length : orders.filter(o => o.status === s).length;
          const active = statusFilter === s;
          return (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding: '0.45rem 1rem', borderRadius: 999, fontWeight: 600, fontSize: '0.82rem',
              border: `2px solid ${active ? '#312E81' : 'var(--color-border)'}`,
              background: active ? '#312E81' : 'white',
              color: active ? 'white' : 'var(--color-text-muted)', cursor: 'pointer', transition: 'all 0.2s',
            }}>
              {s} <span style={{ opacity: 0.8 }}>({count})</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No platform orders found.</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead style={{ background: 'var(--color-background)' }}>
              <tr>
                {['Order ID', 'Date', 'Customer', 'Suppliers Involved', 'Total', 'Overall Status', ''].map((h, i) => (
                  <th key={i} style={{ padding: '0.875rem 1.25rem', textAlign: i === 6 ? 'right' : 'left', fontWeight: 700, fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => {
                const sc    = STATUS_STYLE[o.status] || STATUS_STYLE['Pending'];
                const isOpen = expandedId === o._id;
                const orderId = o._id.slice(-6).toUpperCase();
                
                // Extract unique supplier names involved in this order
                const involvedSuppliers = [...new Set(o.items?.map(i => i.supplierName || 'Unknown Supplier'))];

                return (
                  <React.Fragment key={o._id}>
                    <tr
                      style={{ borderTop: '1px solid var(--color-border)', cursor: 'pointer', background: isOpen ? '#f5f3ff' : '' }}
                      onClick={() => setExpandedId(isOpen ? null : o._id)}
                      onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = '#f8fafc'; }}
                      onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = ''; }}>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#312E81' }}>ORD-{orderId}</td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text-muted)' }}>{new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td style={{ padding: '1rem 1.25rem' }}>{o.buyer?.name || o.delivery?.firstName || '—'}</td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          {involvedSuppliers.map((sup, idx) => (
                            <span key={idx} style={{ background: '#e0e7ff', color: '#4338ca', padding: '0.15rem 0.5rem', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600 }}>
                              {sup}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>£{o.total?.toFixed(2)}</td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{ background: sc.bg, color: sc.text, padding: '0.25rem 0.7rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>{o.status}</span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        {isOpen ? <ChevronUp size={16} style={{ color: 'var(--color-text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--color-text-muted)' }} />}
                      </td>
                    </tr>

                    {isOpen && (
                      <tr style={{ background: '#f5f3ff' }}>
                        <td colSpan={7} style={{ padding: '0 1.25rem 1.25rem' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', paddingTop: '0.75rem' }}>
                            <div style={{ background: 'white', borderRadius: 10, padding: '1rem', border: '1px solid var(--color-border)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                                <Package size={14} style={{ color: '#312E81' }} />
                                <span style={{ fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>Order Items</span>
                              </div>
                              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {(o.items || []).map((item, i) => (
                                  <li key={i} style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>{item.name} ×{item.quantity} {item.unit}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>({item.supplierName || 'Supplier'})</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div style={{ background: 'white', borderRadius: 10, padding: '1rem', border: '1px solid var(--color-border)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                                <MapPin size={14} style={{ color: '#312E81' }} />
                                <span style={{ fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>Shipping Destination</span>
                              </div>
                              {o.delivery ? (
                                <>
                                  <p style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                                    {o.delivery.firstName} {o.delivery.lastName}<br />
                                    {o.delivery.address}, {o.delivery.city}, {o.delivery.postcode}
                                  </p>
                                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                    <Calendar size={13} /> {new Date(o.createdAt).toLocaleDateString('en-GB')}
                                  </div>
                                </>
                              ) : <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>No delivery info</p>}
                            </div>

                            <div style={{ background: 'white', borderRadius: 10, padding: '1rem', border: '1px solid var(--color-border)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                                <Layers size={14} style={{ color: '#312E81' }} />
                                <span style={{ fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>Supplier Shipments</span>
                              </div>
                              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {(o.supplierStatuses || []).map((supStatus, i) => {
                                  const sc = STATUS_STYLE[supStatus.status] || STATUS_STYLE['Pending'];
                                  const name = o.items?.find(item => item.supplier === supStatus.supplier)?.supplierName || 'Supplier';
                                  return (
                                    <li key={i} style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span style={{ fontWeight: 600 }}>{name}</span>
                                      <span style={{ background: sc.bg, color: sc.text, padding: '0.1rem 0.5rem', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700 }}>
                                        {supStatus.status}
                                      </span>
                                    </li>
                                  );
                                })}
                                {(!o.supplierStatuses || o.supplierStatuses.length === 0) && (
                                  <li style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>No individual status</li>
                                )}
                              </ul>
                            </div>
                          </div>

                          {/* Overall Order Status Update */}
                          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Force overall status:</span>
                            {['Pending', 'In Transit', 'Delivered', 'Cancelled'].map(s => (
                              <button key={s} onClick={(e) => { e.stopPropagation(); handleStatusChange(o._id, s); }} disabled={savingStatus[o._id] || o.status === s}
                                style={{ padding: '0.3rem 0.875rem', borderRadius: 999, border: `1px solid ${STATUS_STYLE[s].text}`, background: o.status === s ? STATUS_STYLE[s].bg : 'white', color: STATUS_STYLE[s].text, fontSize: '0.8rem', fontWeight: 600, cursor: o.status === s ? 'default' : 'pointer', opacity: savingStatus[o._id] ? 0.6 : 1 }}>
                                {savingStatus[o._id] ? '...' : s}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
