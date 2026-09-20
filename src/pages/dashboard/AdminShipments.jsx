import React, { useState, useEffect, useMemo } from 'react';
import { Filter, Download, ExternalLink, MapPin, RefreshCw, Truck, CheckCircle2, Clock, AlertTriangle, Search, X, Package, ShieldCheck } from 'lucide-react';
import SEO from '../../components/SEO';
import LoadingSpinner from '../../components/LoadingSpinner';
import { orderService } from '../../services/orderService';
import { useNotification } from '../../context/NotificationContext';

const STATUS_STYLE = {
  'Pending Payment Verification': { bg: '#E0F2FE', text: '#0369A1' },
  Pending:      { bg: '#FEF3C7', text: '#B45309' },
  'In Transit': { bg: '#DBEAFE', text: '#1E40AF' },
  Delivered:    { bg: '#DCFCE7', text: '#166534' },
  Cancelled:    { bg: '#FEE2E2', text: '#991B1B' },
};

const CARRIER_OPTIONS = [
  'ColdChain Express',
  'Global Freight Logistics',
  'FreshLync Direct Fleet',
  'Express Road Transport',
  'Mike Johnson (Independent Courier)',
  'Sarah Connor (Independent Courier)',
];

export default function AdminShipments() {
  const { showToast } = useNotification();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('All');
  const [search, setSearch] = useState('');
  const [pendingCarriers, setPendingCarriers] = useState({});
  const [savingCarriers, setSavingCarriers] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState(null);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders({ limit: 100 });
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch system shipments.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const counts = useMemo(() => {
    const totalActive = orders.filter(o => o.status !== 'Cancelled').length;
    const inTransit = orders.filter(o => o.status === 'In Transit').length;
    const pending = orders.filter(o => o.status === 'Pending' || o.status === 'Pending Payment Verification').length;
    const delivered = orders.filter(o => o.status === 'Delivered').length;
    return { totalActive, inTransit, pending, delivered };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      // Tab Filter
      if (filterTab === 'In Transit' && o.status !== 'In Transit') return false;
      if (filterTab === 'Pending' && o.status !== 'Pending' && o.status !== 'Pending Payment Verification') return false;
      if (filterTab === 'Delivered' && o.status !== 'Delivered') return false;

      // Search Query
      if (search.trim()) {
        const q = search.toLowerCase();
        const trackingId = `shp-${o._id.slice(-6)}`.toLowerCase();
        const orderId = `ord-${o._id.slice(-6)}`.toLowerCase();
        const buyerName = (o.buyer?.name || o.delivery?.firstName || '').toLowerCase();
        const destination = (o.delivery?.city || o.delivery?.address || '').toLowerCase();
        const supplier = (o.items?.[0]?.product?.supplier?.businessName || o.items?.[0]?.product?.supplierName || '').toLowerCase();
        return trackingId.includes(q) || orderId.includes(q) || buyerName.includes(q) || destination.includes(q) || supplier.includes(q);
      }
      return true;
    });
  }, [orders, filterTab, search]);

  const handleCarrierSelect = (orderId, carrierName) => {
    setPendingCarriers(prev => ({ ...prev, [orderId]: carrierName }));
  };

  const handleSyncCarriers = async () => {
    setSavingCarriers(true);
    try {
      // Apply pending updates locally
      setOrders(prev => prev.map(o => {
        if (pendingCarriers[o._id]) {
          return { ...o, assignedCarrier: pendingCarriers[o._id] };
        }
        return o;
      }));
      setPendingCarriers({});
      setSyncSuccess(true);
      showToast('Carrier assignments updated successfully!', 'success');
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch {
      showToast('Failed to sync carrier assignments.', 'error');
    } finally {
      setSavingCarriers(false);
    }
  };

  const handleExportCSV = () => {
    if (!filteredOrders.length) {
      showToast('No shipment records to export.', 'info');
      return;
    }
    const header = 'Tracking ID,Order ID,Date,Supplier,Destination,Carrier,Value,Status\n';
    const rows = filteredOrders.map(o => {
      const trackingId = `SHP-${o._id.slice(-6).toUpperCase()}`;
      const orderId = `ORD-${o._id.slice(-6).toUpperCase()}`;
      const date = new Date(o.createdAt).toLocaleDateString('en-GB');
      const supplier = o.items?.[0]?.product?.supplier?.businessName || o.items?.[0]?.product?.supplierName || 'FreshLync Supplier';
      const destination = `${o.delivery?.city || ''} ${o.delivery?.postcode || ''}`.trim() || 'UK';
      const carrier = pendingCarriers[o._id] || o.assignedCarrier || 'ColdChain Express';
      const value = `£${(o.total || 0).toFixed(2)}`;
      return `${trackingId},${orderId},${date},"${supplier}","${destination}","${carrier}",${value},${o.status}`;
    }).join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `shipments-log-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    showToast('Shipments log exported as CSV', 'success');
  };

  if (loading) return <LoadingSpinner fullPage message="Loading global shipment logistics..." />;

  return (
    <div style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-text-main)' }}>
      <SEO title="System Shipments & Logistics" />

      {/* Title & Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '0.25rem' }}>Global Shipments & Logistics</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Live tracking monitor across active cold-chain transit routes network.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {Object.keys(pendingCarriers).length > 0 && (
            <button 
              onClick={handleSyncCarriers} 
              disabled={savingCarriers}
              className="btn-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1.1rem', borderRadius: 8, background: '#16A34A', border: 'none' }}
            >
              <RefreshCw size={15} className={savingCarriers ? 'spin' : ''} />
              Sync Changes ({Object.keys(pendingCarriers).length})
            </button>
          )}

          {syncSuccess && (
            <span style={{ color: '#16A34A', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <CheckCircle2 size={16} /> Synced!
            </span>
          )}

          <button onClick={fetchShipments} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', borderRadius: 8 }}>
            <RefreshCw size={15} /> Refresh
          </button>

          <button onClick={handleExportCSV} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', borderRadius: 8 }}>
            <Download size={15} /> Export Log
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {[
            { id: 'All', label: `All Active (${counts.totalActive})` },
            { id: 'In Transit', label: `In Transit (${counts.inTransit})` },
            { id: 'Pending', label: `Pending / Customs (${counts.pending})` },
            { id: 'Delivered', label: `Delivered (${counts.delivered})` },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setFilterTab(t.id)}
              style={{
                padding: '0.5rem 1.1rem',
                borderRadius: 999,
                fontWeight: 700,
                fontSize: '0.82rem',
                border: filterTab === t.id ? 'none' : '1px solid var(--color-border)',
                background: filterTab === t.id ? '#312E81' : 'white',
                color: filterTab === t.id ? 'white' : 'var(--color-text-main)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search tracking ID, supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem 0.5rem 2.25rem',
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
          {search && (
            <X size={15} onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--color-text-muted)' }} />
          )}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card" style={{ padding: 0, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {filteredOrders.length === 0 ? (
          <div style={{ padding: '3.5rem 2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <Truck size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
            <h4 style={{ fontWeight: 700, marginBottom: '0.25rem', color: 'var(--color-text-main)' }}>No Shipments Found</h4>
            <p style={{ fontSize: '0.875rem' }}>There are no active shipment orders matching your search criteria.</p>
          </div>
        ) : (
          <table style={{ width: '100%', minWidth: '920px', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead style={{ background: 'var(--color-background)', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TRACKING ID</th>
                <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SUPPLIER</th>
                <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DESTINATION</th>
                <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CARRIER / DRIVER</th>
                <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>VALUE</th>
                <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>STATUS</th>
                <th style={{ padding: '0.875rem 1.25rem', textAlign: 'right', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => {
                const trackingId = `SHP-${o._id.slice(-6).toUpperCase()}`;
                const supplierName = o.items?.[0]?.product?.supplier?.businessName 
                  || o.items?.[0]?.product?.supplierName 
                  || 'FreshLync Supplier';
                
                const destinationCity = o.delivery?.city || o.delivery?.address || 'United Kingdom';
                const postcode = o.delivery?.postcode || '';
                const currentCarrier = pendingCarriers[o._id] || o.assignedCarrier || 'ColdChain Express';
                const sc = STATUS_STYLE[o.status] || STATUS_STYLE['Pending'];

                return (
                  <tr key={o._id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.15s ease' }}>
                    {/* Tracking ID */}
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#312E81' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Truck size={15} style={{ color: '#4F46E5' }} />
                        {trackingId}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 500, marginTop: '0.15rem' }}>
                        ORD-{o._id.slice(-6).toUpperCase()}
                      </div>
                    </td>

                    {/* Supplier */}
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>
                      {supplierName}
                    </td>

                    {/* Destination */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text-main)', fontWeight: 600 }}>
                        <MapPin size={14} style={{ color: '#EF4444', flexShrink: 0 }} /> 
                        <span>{destinationCity}</span>
                      </div>
                      {postcode && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginLeft: '1.25rem' }}>
                          {postcode}
                        </div>
                      )}
                    </td>

                    {/* Carrier Selector */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      {o.status === 'Delivered' ? (
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)' }}>{currentCarrier}</span>
                      ) : (
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <select 
                            value={currentCarrier} 
                            onChange={(e) => handleCarrierSelect(o._id, e.target.value)}
                            style={{ 
                              padding: '0.35rem 0.6rem', 
                              borderRadius: '6px', 
                              border: pendingCarriers[o._id] ? '1.5px solid #16A34A' : '1px solid var(--color-border)', 
                              outline: 'none', 
                              background: pendingCarriers[o._id] ? '#F0FDF4' : 'white', 
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              color: 'var(--color-text-main)',
                              cursor: 'pointer',
                              minWidth: '180px'
                            }}
                          >
                            {CARRIER_OPTIONS.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          {pendingCarriers[o._id] && (
                            <span style={{ position: 'absolute', top: '-3px', right: '-3px', background: '#EF4444', color: 'white', width: '8px', height: '8px', borderRadius: '50%' }} />
                          )}
                        </div>
                      )}
                    </td>

                    {/* Value */}
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>
                      £{(o.total || 0).toFixed(2)}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ 
                        background: sc.bg, 
                        color: sc.text, 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '999px', 
                        fontSize: '0.75rem', 
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                      }}>
                        {o.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <button 
                        onClick={() => setSelectedTrackingOrder(o)}
                        style={{ 
                          color: '#312E81', 
                          background: '#EEF2FF', 
                          border: 'none', 
                          padding: '0.35rem 0.8rem',
                          borderRadius: 6,
                          cursor: 'pointer', 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '0.35rem', 
                          fontWeight: 700,
                          fontSize: '0.8rem',
                        }}
                      >
                        Track <ExternalLink size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Tracking Modal */}
      {selectedTrackingOrder && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
          <div style={{
            background: 'white', borderRadius: 16, maxWidth: 540, width: '100%', padding: '1.75rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', position: 'relative'
          }}>
            <button 
              onClick={() => setSelectedTrackingOrder(null)} 
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#F1F5F9', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Truck size={22} style={{ color: '#4F46E5' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Shipment Tracking Timeline</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Tracking ID: SHP-{selectedTrackingOrder._id.slice(-6).toUpperCase()}</p>
              </div>
            </div>

            {/* Details Box */}
            <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Supplier</div>
                <div style={{ fontWeight: 700 }}>{selectedTrackingOrder.items?.[0]?.product?.supplier?.businessName || selectedTrackingOrder.items?.[0]?.product?.supplierName || 'FreshLync Supplier'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Carrier / Fleet</div>
                <div style={{ fontWeight: 700 }}>{pendingCarriers[selectedTrackingOrder._id] || selectedTrackingOrder.assignedCarrier || 'ColdChain Express'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Destination</div>
                <div style={{ fontWeight: 700 }}>{selectedTrackingOrder.delivery?.city || 'United Kingdom'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Current Status</div>
                <div style={{ fontWeight: 700, color: STATUS_STYLE[selectedTrackingOrder.status]?.text }}>{selectedTrackingOrder.status}</div>
              </div>
            </div>

            {/* Timeline Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', paddingLeft: '0.5rem' }}>
              {[
                { title: 'Order Confirmed', desc: 'Order details processed into dispatch system', done: true },
                { title: 'Picked & Packed', desc: 'Temperature-controlled cold-chain packing', done: true },
                { title: 'In Transit', desc: 'Dispatched via carrier to local delivery hub', done: selectedTrackingOrder.status === 'In Transit' || selectedTrackingOrder.status === 'Delivered' },
                { title: 'Delivered', desc: 'Signed & verified at loading dock', done: selectedTrackingOrder.status === 'Delivered' },
              ].map((step, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: step.done ? '#16A34A' : '#E2E8F0',
                    color: step.done ? 'white' : '#64748B',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 800, flexShrink: 0, marginTop: '2px'
                  }}>
                    {step.done ? '✓' : idx + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: step.done ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>{step.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setSelectedTrackingOrder(null)} 
              className="btn-secondary" 
              style={{ width: '100%', marginTop: '1.75rem', padding: '0.65rem', borderRadius: 8, fontWeight: 700 }}
            >
              Close Tracker
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
