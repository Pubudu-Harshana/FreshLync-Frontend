import React, { useState, useEffect, useMemo } from 'react';
import { Filter, Download, ExternalLink, MapPin, ChevronDown, ChevronUp, Package, Calendar, RefreshCw } from 'lucide-react';
import SEO from '../../components/SEO';
import LoadingSpinner from '../../components/LoadingSpinner';
import { orderService } from '../../services/orderService';

const STATUS_STYLE = {
  Pending:      { bg: '#FEF3C7', text: '#B45309' },
  'In Transit': { bg: '#DBEAFE', text: '#1E40AF' },
  Delivered:    { bg: '#DCFCE7', text: '#166534' },
  Cancelled:    { bg: '#FEE2E2', text: '#991B1B' },
};

export default function MarketplaceShipments() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders({ limit: 50 });
      setOrders(data.orders || []);
    } catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = useMemo(() => {
    if (statusFilter === 'All') return orders;
    return orders.filter(o => o.status === statusFilter);
  }, [orders, statusFilter]);

  const handleExport = () => {
    const header = 'Order ID,Date,Total,Status,ItemsCount\n';
    const rows = filtered.map(o => {
      const id = o._id.slice(-6).toUpperCase();
      const date = new Date(o.createdAt).toLocaleDateString('en-GB');
      return `ORD-${id},${date},£${o.total?.toFixed(2)},${o.status},${o.items?.length || 0}`;
    }).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-shipments.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <LoadingSpinner fullPage message="Loading shipments..." />;

  return (
    <main style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto' }}>
      <SEO title="My Shipments" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My Shipments</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>Track inbound orders from your suppliers.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary" onClick={fetchOrders} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw size={18} /> Refresh
          </button>
          <button className="btn-secondary" onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['All', 'Pending', 'In Transit', 'Delivered', 'Cancelled'].map(s => {
          const count = s === 'All' ? orders.length : orders.filter(o => o.status === s).length;
          const active = statusFilter === s;
          return (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding: '0.5rem 1rem', borderRadius: '999px', fontWeight: 500, border: active ? 'none' : '1px solid var(--color-border)',
              background: active ? 'var(--color-primary)' : 'white',
              color: active ? 'white' : 'var(--color-text-main)', cursor: 'pointer', transition: 'all 0.2s'
            }}>
              {s} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          No shipments found for this filter.
        </div>
      ) : (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead style={{ background: 'var(--color-background)', color: 'var(--color-text-muted)' }}>
              <tr>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>ORDER ID</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>DATE</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>SUPPLIERS</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>TOTAL VALUE</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>OVERALL STATUS</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => {
                const isOpen = expandedId === o._id;
                const orderId = o._id.slice(-6).toUpperCase();
                const sc = STATUS_STYLE[o.status] || STATUS_STYLE['Pending'];

                // Get unique suppliers in this order
                const suppliersInvolved = [...new Set(o.items?.map(item => item.supplierName || 'Supplier'))];

                return (
                  <React.Fragment key={o._id}>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', cursor: 'pointer', background: isOpen ? '#f0fdf4' : '' }} onClick={() => setExpandedId(isOpen ? null : o._id)}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>ORD-{orderId}</td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>
                        {new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                          {suppliersInvolved.map((sup, i) => (
                            <span key={i} style={{ background: '#e2e8f0', color: '#475569', padding: '0.15rem 0.5rem', borderRadius: 4, fontSize: '0.75rem', fontWeight: 500 }}>
                              {sup}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>£{o.total?.toFixed(2)}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{ 
                          background: sc.bg, 
                          color: sc.text, 
                          padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 
                        }}>
                          {o.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        {isOpen ? <ChevronUp size={16} style={{ color: 'var(--color-text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--color-text-muted)' }} />}
                      </td>
                    </tr>

                    {isOpen && (
                      <tr style={{ background: '#f0fdf4' }}>
                        <td colSpan={6} style={{ padding: '1rem 1.5rem' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                            {/* Products grouped by Supplier with separate statuses */}
                            <div style={{ background: 'white', borderRadius: 10, padding: '1.25rem', border: '1px solid var(--color-border)' }}>
                              <h4 style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Package size={15} style={{ color: 'var(--color-primary)' }} /> Items & Supplier Shipment Statuses
                              </h4>

                              {/* Separate groups for each supplier */}
                              {(o.supplierStatuses || []).map((supStatus, i) => {
                                const supItems = o.items?.filter(item => item.supplier === supStatus.supplier) || [];
                                const supplierName = supItems[0]?.supplierName || 'Supplier';
                                const ssc = STATUS_STYLE[supStatus.status] || STATUS_STYLE['Pending'];

                                return (
                                  <div key={i} style={{ marginBottom: i < o.supplierStatuses.length - 1 ? '1.25rem' : 0, borderBottom: i < o.supplierStatuses.length - 1 ? '1px solid #f1f5f9' : 'none', paddingBottom: i < o.supplierStatuses.length - 1 ? '1rem' : 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)' }}>{supplierName}</span>
                                      <span style={{ background: ssc.bg, color: ssc.text, padding: '0.15rem 0.5rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>
                                        {supStatus.status}
                                      </span>
                                    </div>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                      {supItems.map((item, idx) => (
                                        <li key={idx} style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                                          <span>{item.name} ×{item.quantity} {item.unit}</span>
                                          <span style={{ fontWeight: 500 }}>£{(item.price * item.quantity).toFixed(2)}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                );
                              })}

                              {/* Fallback for legacy orders with no supplierStatuses */}
                              {(!o.supplierStatuses || o.supplierStatuses.length === 0) && (
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                  {o.items?.map((item, idx) => (
                                    <li key={idx} style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                                      <span>{item.name} ×{item.quantity} {item.unit}</span>
                                      <span style={{ fontWeight: 500 }}>£{(item.price * item.quantity).toFixed(2)}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>

                            {/* Delivery & Shipping Info */}
                            <div style={{ background: 'white', borderRadius: 10, padding: '1.25rem', border: '1px solid var(--color-border)' }}>
                              <h4 style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <MapPin size={15} style={{ color: 'var(--color-primary)' }} /> Delivery Details
                              </h4>
                              {o.delivery ? (
                                <div style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
                                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                    {o.delivery.firstName} {o.delivery.lastName}
                                  </div>
                                  <div>{o.delivery.address}</div>
                                  <div>{o.delivery.city}, {o.delivery.postcode}</div>
                                  <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                                    <Calendar size={13} /> Placed: {new Date(o.createdAt).toLocaleDateString('en-GB')}
                                  </div>
                                </div>
                              ) : (
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>No delivery information available.</p>
                              )}
                            </div>
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
    </main>
  );
}
