import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Truck, MapPin, Navigation, Phone, CheckCircle2, Package, 
  Barcode as BarcodeIcon, ShieldCheck, RefreshCw, Search, 
  ExternalLink, ChevronRight, Compass, AlertCircle, LogOut, Check
} from 'lucide-react';
import SEO from '../../components/SEO';
import LoadingSpinner from '../../components/LoadingSpinner';
import { orderService } from '../../services/orderService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import BarcodeScannerModal from '../../components/BarcodeScannerModal';

const STATUS_STYLE = {
  Pending:      { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A', dot: '#D97706' },
  'In Transit': { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD', dot: '#2563EB' },
  Delivered:    { bg: '#DCFCE7', text: '#166534', border: '#86EFAC', dot: '#16A34A' },
  Cancelled:    { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA', dot: '#DC2626' }
};

export default function DriverDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useNotification();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('active'); // active, completed, all
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDriverOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders({ limit: 50 });
      const orderList = data.orders || [];
      setOrders(orderList);
      if (orderList.length > 0) {
        setSelectedOrder(prev => {
          if (!prev) return orderList[0];
          const found = orderList.find(o => o._id === prev._id);
          return found || orderList[0];
        });
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load driver dispatch queue.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverOrders();
  }, []);

  const handleScanSuccess = () => {
    fetchDriverOrders();
  };

  const handleQuickStatus = async (order, newStatus) => {
    setActionLoading(true);
    try {
      const bc = order.trackingBarcode || `BC-ORD-${order._id?.slice(-6)?.toUpperCase()}`;
      const res = await orderService.scanOrderBarcode(bc);
      showToast(res.message || `Order status updated to ${newStatus}.`, 'success');
      await fetchDriverOrders();
    } catch (err) {
      showToast(err.response?.data?.message || 'Status update failed.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const activeDeliveries = orders.filter(o => o.status === 'In Transit' || o.status === 'Pending');
  const completedDeliveries = orders.filter(o => o.status === 'Delivered');

  const filteredOrders = orders.filter(o => {
    if (activeTab === 'active' && (o.status !== 'In Transit' && o.status !== 'Pending')) return false;
    if (activeTab === 'completed' && o.status !== 'Delivered') return false;
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = (o.delivery?.firstName || o.buyer?.name || '').toLowerCase();
      const id = (o._id || '').toLowerCase();
      const barcode = (o.trackingBarcode || '').toLowerCase();
      const city = (o.delivery?.city || '').toLowerCase();
      return name.includes(q) || id.includes(q) || barcode.includes(q) || city.includes(q);
    }
    return true;
  });

  const completionRate = orders.length > 0
    ? Math.round((completedDeliveries.length / orders.length) * 100)
    : 100;

  if (loading) return <LoadingSpinner fullPage message="Loading driver portal..." />;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)', fontFamily: 'var(--font-sans)' }}>
      <SEO title="Driver Delivery Portal" />

      {/* ── System UI Top Navigation Bar ── */}
      <header style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          {/* Logo & Portal Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img 
              src="/newlogo.png" 
              alt="FreshLync" 
              style={{ height: 42, width: 'auto', cursor: 'pointer' }}
              onClick={() => navigate('/')}
            />
            <div style={{ height: 24, width: 1, background: 'var(--color-border)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{
                background: '#DCFCE7',
                color: 'var(--color-primary)',
                fontWeight: 700,
                fontSize: '0.75rem',
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <Truck size={13} /> Driver Portal
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Live Logistics
              </span>
            </div>
          </div>

          {/* User Status & Sign Out */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#DCFCE7',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'D'}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                  {user?.name || 'Logistics Driver'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }} /> On Duty
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="btn-secondary"
              style={{
                padding: '0.45rem 0.85rem',
                fontSize: '0.8rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#EF4444',
                borderColor: '#FEE2E2'
              }}
              title="Sign Out"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Container ── */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '1.75rem 1.25rem 4rem' }}>
        
        {/* Page Title & Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-main)', margin: '0 0 0.25rem' }}>
              Delivery Route & Orders
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>
              Navigate active stops, verify shipments, and record doorstep deliveries.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsScannerOpen(true)}
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.6rem 1.15rem' }}
            >
              <BarcodeIcon size={18} /> Scan Barcode
            </button>
            <button
              onClick={fetchDriverOrders}
              className="btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.6rem 1rem' }}
            >
              <RefreshCw size={15} /> Refresh
            </button>
          </div>
        </div>

        {/* ── KPI Stat Cards (System UI Style) ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}>
          {/* Active Deliveries */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Truck size={20} style={{ color: '#2563EB' }} />
              </div>
              <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '0.2rem 0.55rem', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700 }}>
                In Transit
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>Active Deliveries</div>
            <div style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--color-text-main)' }}>{activeDeliveries.length}</div>
          </div>

          {/* Completed Deliveries */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={20} style={{ color: '#16A34A' }} />
              </div>
              <span style={{ background: '#DCFCE7', color: '#166534', padding: '0.2rem 0.55rem', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700 }}>
                Delivered
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>Completed Today</div>
            <div style={{ fontSize: '1.65rem', fontWeight: 700, color: '#16A34A' }}>{completedDeliveries.length}</div>
          </div>

          {/* Total Stops */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={20} style={{ color: '#D97706' }} />
              </div>
              <span style={{ background: '#FEF3C7', color: '#B45309', padding: '0.2rem 0.55rem', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700 }}>
                Manifest
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>Total Stops</div>
            <div style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--color-text-main)' }}>{orders.length}</div>
          </div>

          {/* Completion Rate */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={20} style={{ color: '#059669' }} />
              </div>
              <span style={{ background: '#ECFDF5', color: '#059669', padding: '0.2rem 0.55rem', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700 }}>
                Rate
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>Completion Rate</div>
            <div style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--color-primary)' }}>{completionRate}%</div>
          </div>
        </div>

        {/* ── Main Split Section: Map & Selected Stop + Manifest List ── */}
        <div className="responsive-split" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* Left Column: Route Map & Current Stop Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Route Map Card */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Navigation size={18} style={{ color: 'var(--color-primary)' }} /> Live Route Map
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: '0.15rem 0 0' }}>
                    Waypoints and sequence for assigned deliveries
                  </p>
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: 'var(--color-background)',
                  color: 'var(--color-text-muted)',
                  border: '1px solid var(--color-border)',
                  padding: '0.25rem 0.65rem',
                  borderRadius: 6
                }}>
                  {filteredOrders.length} Waypoints
                </span>
              </div>

              {/* Clean Light-Themed Route Canvas */}
              <div style={{
                position: 'relative',
                height: 320,
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                background: '#F1F5F9',
                border: '1px solid var(--color-border)',
                backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}>
                {/* Styled Vector Road Paths */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                  <path d="M 50 110 Q 180 150 280 210 T 520 280" fill="none" stroke="#10B981" strokeWidth="4" strokeDasharray="6,5" opacity="0.85" />
                  <path d="M 120 60 L 220 260 L 390 140 L 480 300" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeDasharray="4,4" opacity="0.7" />
                </svg>

                {/* Driver Vehicle Indicator */}
                <div style={{
                  position: 'absolute',
                  top: '28%',
                  left: '14%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 15,
                  background: 'var(--color-primary)',
                  color: 'white',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 20,
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: 'var(--shadow-md)'
                }}>
                  <Truck size={14} /> My Vehicle
                </div>

                {/* Stop Waypoint Markers */}
                {filteredOrders.slice(0, 6).map((ord, idx) => {
                  const positions = [
                    { top: '34%', left: '30%' },
                    { top: '55%', left: '50%' },
                    { top: '70%', left: '74%' },
                    { top: '38%', left: '80%' },
                    { top: '72%', left: '32%' },
                    { top: '20%', left: '54%' }
                  ];
                  const pos = positions[idx % positions.length];
                  const isSelected = selectedOrder?._id === ord._id;

                  const isDelivered = ord.status === 'Delivered';
                  const isInTransit = ord.status === 'In Transit';
                  const pinBg = isDelivered ? '#16A34A' : isInTransit ? '#2563EB' : '#D97706';

                  return (
                    <div
                      key={ord._id}
                      onClick={() => setSelectedOrder(ord)}
                      style={{
                        position: 'absolute',
                        top: pos.top,
                        left: pos.left,
                        transform: 'translate(-50%, -50%)',
                        cursor: 'pointer',
                        zIndex: isSelected ? 20 : 5,
                        transition: 'transform 0.15s ease'
                      }}
                    >
                      <div style={{
                        background: pinBg,
                        color: 'white',
                        borderRadius: '50%',
                        width: isSelected ? 36 : 30,
                        height: isSelected ? 36 : 30,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: isSelected ? '0.85rem' : '0.75rem',
                        boxShadow: isSelected ? `0 0 0 4px rgba(21, 128, 61, 0.25), var(--shadow-md)` : 'var(--shadow-sm)',
                        border: isSelected ? '2px solid white' : 'none'
                      }}>
                        {idx + 1}
                      </div>
                      <div style={{
                        background: isSelected ? 'var(--color-primary)' : 'white',
                        color: isSelected ? 'white' : 'var(--color-text-main)',
                        padding: '0.15rem 0.45rem',
                        border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        borderRadius: 4,
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        marginTop: 4,
                        whiteSpace: 'nowrap',
                        boxShadow: 'var(--shadow-sm)',
                        textAlign: 'center'
                      }}>
                        Stop {idx + 1}
                      </div>
                    </div>
                  );
                })}

                {/* Light Status Footer */}
                <div style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 12,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(4px)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 8,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--color-text-main)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <Compass size={14} style={{ color: 'var(--color-primary)' }} /> GPS Active · Route Optimal
                </div>
              </div>
            </div>

            {/* Selected Waypoint Card */}
            {selectedOrder ? (
              <div className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                      Selected Stop Details
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                      #{selectedOrder._id?.slice(-6)?.toUpperCase()}
                    </span>
                  </div>

                  {(() => {
                    const style = STATUS_STYLE[selectedOrder.status] || STATUS_STYLE.Pending;
                    return (
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.65rem',
                        borderRadius: 999,
                        background: style.bg,
                        color: style.text,
                        border: `1px solid ${style.border}`
                      }}>
                        {selectedOrder.status}
                      </span>
                    );
                  })()}
                </div>

                {/* Simple 3-Step Progress Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1.25rem',
                  background: 'var(--color-background)',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)'
                }}>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569' }}>1. ORDER PLACED</div>
                    <div style={{ height: 3, background: '#10B981', borderRadius: 2, marginTop: 4 }} />
                  </div>
                  <ChevronRight size={14} style={{ color: '#94A3B8' }} />
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: selectedOrder.status !== 'Pending' ? '#10B981' : '#94A3B8' }}>2. IN TRANSIT</div>
                    <div style={{ height: 3, background: selectedOrder.status !== 'Pending' ? '#10B981' : '#CBD5E1', borderRadius: 2, marginTop: 4 }} />
                  </div>
                  <ChevronRight size={14} style={{ color: '#94A3B8' }} />
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: selectedOrder.status === 'Delivered' ? '#10B981' : '#94A3B8' }}>3. DELIVERED</div>
                    <div style={{ height: 3, background: selectedOrder.status === 'Delivered' ? '#10B981' : '#CBD5E1', borderRadius: 2, marginTop: 4 }} />
                  </div>
                </div>

                {/* Customer & Address Details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ background: 'var(--color-background)', padding: '0.85rem', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Recipient</div>
                    <div style={{ margin: '0.2rem 0 0.4rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                      {selectedOrder.delivery?.firstName ? `${selectedOrder.delivery.firstName} ${selectedOrder.delivery.lastName || ''}` : (selectedOrder.buyer?.name || 'Customer')}
                    </div>
                    {selectedOrder.delivery?.phone && (
                      <a
                        href={`tel:${selectedOrder.delivery.phone}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.8rem', textDecoration: 'none' }}
                      >
                        <Phone size={13} /> {selectedOrder.delivery.phone}
                      </a>
                    )}
                  </div>

                  <div style={{ background: 'var(--color-background)', padding: '0.85rem', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Delivery Location</div>
                    <div style={{ margin: '0.2rem 0 0.35rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                      📍 {selectedOrder.delivery?.address || 'Street Address'}, {selectedOrder.delivery?.city || 'City'} {selectedOrder.delivery?.postcode || ''}
                    </div>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(`${selectedOrder.delivery?.address || ''} ${selectedOrder.delivery?.city || ''}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}
                    >
                      Open in Google Maps <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                {/* Verification & Action Buttons */}
                <div style={{
                  background: 'var(--color-background)',
                  padding: '0.85rem 1rem',
                  borderRadius: 8,
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>TRACKING BARCODE</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-text-main)', fontSize: '0.88rem' }}>
                      🏷️ {selectedOrder.trackingBarcode || `BC-ORD-${selectedOrder._id?.slice(-6)?.toUpperCase()}`}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setIsScannerOpen(true)}
                      className="btn-primary"
                      style={{ padding: '0.55rem 0.95rem', fontSize: '0.82rem' }}
                    >
                      <BarcodeIcon size={16} /> Scan
                    </button>

                    {selectedOrder.status !== 'Delivered' ? (
                      <button
                        onClick={() => handleQuickStatus(selectedOrder, selectedOrder.status === 'Pending' ? 'In Transit' : 'Delivered')}
                        disabled={actionLoading}
                        className="btn-secondary"
                        style={{
                          padding: '0.55rem 0.95rem',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          background: selectedOrder.status === 'Pending' ? '#DBEAFE' : '#DCFCE7',
                          color: selectedOrder.status === 'Pending' ? '#1E40AF' : '#166534',
                          borderColor: selectedOrder.status === 'Pending' ? '#93C5FD' : '#86EFAC'
                        }}
                      >
                        {selectedOrder.status === 'Pending' ? '🚚 Start Dispatch' : '✓ Mark Delivered'}
                      </button>
                    ) : (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#166534',
                        background: '#DCFCE7',
                        padding: '0.4rem 0.75rem',
                        borderRadius: 6
                      }}>
                        <Check size={14} /> Completed
                      </span>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                Select an order from the manifest to view details and update status.
              </div>
            )}

          </div>

          {/* Right Column: Delivery Manifest List */}
          <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.45rem', margin: 0, color: 'var(--color-text-main)' }}>
                <Package size={18} style={{ color: 'var(--color-primary)' }} /> Delivery Manifest
              </h3>
              <span style={{ fontSize: '0.75rem', background: 'var(--color-background)', padding: '0.2rem 0.5rem', borderRadius: 6, fontWeight: 600, color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
                {filteredOrders.length} Order{filteredOrders.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Search Input Bar */}
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                className="input-field"
                placeholder="Search by customer, city, or barcode..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.4rem', fontSize: '0.82rem', padding: '0.55rem 0.85rem 0.55rem 2.4rem' }}
              />
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--color-background)', padding: '0.25rem', borderRadius: 8, border: '1px solid var(--color-border)' }}>
              {[
                { id: 'active', label: `Active (${activeDeliveries.length})` },
                { id: 'completed', label: `Completed (${completedDeliveries.length})` },
                { id: 'all', label: `All (${orders.length})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: '0.4rem 0.5rem',
                    borderRadius: 6,
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: activeTab === tab.id ? 700 : 500,
                    cursor: 'pointer',
                    background: activeTab === tab.id ? 'white' : 'transparent',
                    color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    boxShadow: activeTab === tab.id ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* List of Orders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: 540, overflowY: 'auto', paddingRight: '0.15rem' }}>
              {filteredOrders.length === 0 ? (
                <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                  <AlertCircle size={28} style={{ color: '#CBD5E1', marginBottom: '0.4rem' }} />
                  <p style={{ margin: 0 }}>No orders found in manifest.</p>
                </div>
              ) : (
                filteredOrders.map((ord, idx) => {
                  const isSelected = selectedOrder?._id === ord._id;
                  const bc = ord.trackingBarcode || `BC-ORD-${ord._id?.slice(-6)?.toUpperCase()}`;
                  const style = STATUS_STYLE[ord.status] || STATUS_STYLE.Pending;

                  return (
                    <div
                      key={ord._id}
                      onClick={() => setSelectedOrder(ord)}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: 8,
                        cursor: 'pointer',
                        border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        background: isSelected ? '#F0FDF4' : 'var(--color-surface)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-main)', fontFamily: 'var(--font-mono)' }}>
                          Stop {idx + 1} · #{ord._id?.slice(-6)?.toUpperCase()}
                        </span>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.5rem',
                          borderRadius: 999,
                          background: style.bg,
                          color: style.text,
                          border: `1px solid ${style.border}`
                        }}>
                          {ord.status}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                        {ord.delivery?.firstName ? `${ord.delivery.firstName} ${ord.delivery.lastName || ''}` : (ord.buyer?.name || 'Customer')}
                      </div>

                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={12} /> {ord.delivery?.city || 'Delivery City'} · {ord.items?.length || 1} Item(s)
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '0.5rem',
                        borderTop: '1px dashed var(--color-border)',
                        paddingTop: '0.4rem'
                      }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                          🏷️ {bc}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#2563EB', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.15rem' }}>
                          Select <ChevronRight size={12} />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

        </div>

      </main>

      {/* Doorstep Barcode Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
        availableOrders={orders}
      />
    </div>
  );
}
