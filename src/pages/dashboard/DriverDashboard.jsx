import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Navigation, Phone, CheckCircle2, Package, Barcode as BarcodeIcon, ShieldCheck, RefreshCw, Layers, Clock, Search, ExternalLink, ChevronRight, Compass, AlertCircle } from 'lucide-react';
import SEO from '../../components/SEO';
import LoadingSpinner from '../../components/LoadingSpinner';
import { orderService } from '../../services/orderService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import BarcodeScannerModal from '../../components/BarcodeScannerModal';

export default function DriverDashboard() {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('active'); // active, completed, all
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDriverOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders({ limit: 50 });
      setOrders(data.orders || []);
      if (data.orders?.length > 0 && !selectedOrder) {
        setSelectedOrder(data.orders[0]);
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

  const handleScanSuccess = (updatedOrder) => {
    fetchDriverOrders();
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

  if (loading) return <LoadingSpinner fullPage message="Initializing Mobile Driver Route Control..." />;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return { bg: '#DCFCE7', text: '#15803D', border: '#86EFAC', icon: '#16A34A' };
      case 'In Transit': return { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD', icon: '#2563EB' };
      default: return { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A', icon: '#D97706' };
    }
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', paddingBottom: '4rem', fontFamily: 'var(--font-sans)' }}>
      <SEO title="Driver Route Control & Logistics Cockpit" />

      {/* ── Ultra-Sleek Logistics Cockpit Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, #022C22 0%, #0F172A 50%, #064E3B 100%)',
        color: 'white', borderRadius: 24, padding: '1.75rem clamp(1rem, 3vw, 2.25rem)', marginBottom: '1.75rem',
        boxShadow: '0 20px 40px rgba(6, 78, 59, 0.25), 0 1px 3px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden',
        border: '1px solid rgba(16, 185, 129, 0.2)'
      }}>
        {/* Glow ambient background elements */}
        <div style={{
          position: 'absolute', top: '-40%', right: '-10%', width: '350px', height: '350px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, transparent 70%)',
          pointerEvents: 'none', borderRadius: '50%'
        }} />
        <div style={{ position: 'absolute', right: -10, bottom: -20, opacity: 0.08, color: 'white', pointerEvents: 'none' }}>
          <Truck size={240} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{
                background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.4)',
                padding: '0.2rem 0.75rem', borderRadius: 20, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.06em',
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34D399', boxShadow: '0 0 10px #34D399' }} />
                ACTIVE LOGISTICS DISPATCH
              </span>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                Vehicle #TRK-9042 · Driver ID: DRV-882A
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.85rem)', fontWeight: 800, color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Truck size={28} style={{ color: '#34D399' }} /> {user?.name || 'Logistics Delivery Driver'}
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginTop: '0.3rem', margin: 0 }}>
              Live Doorstep Scan Dispatch · GPS Navigation & Cold-Chain Manifest Control
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => setIsScannerOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: 'white', border: 'none', padding: '0.8rem 1.4rem', borderRadius: 14,
                fontSize: '0.92rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.45)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <BarcodeIcon size={22} /> 📷 Launch Doorstep Camera Scanner
            </button>
            <button
              onClick={fetchDriverOrders}
              title="Refresh Manifest Queue"
              style={{
                background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.18)',
                padding: '0.8rem 1rem', borderRadius: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* KPI Counter Glass Widgets */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem',
          marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.25rem'
        }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.85rem 1.1rem', borderRadius: 14 }}>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Active Deliveries</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38BDF8', marginTop: '0.15rem' }}>{activeDeliveries.length}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.85rem 1.1rem', borderRadius: 14 }}>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Completed Today</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34D399', marginTop: '0.15rem' }}>{completedDeliveries.length}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.85rem 1.1rem', borderRadius: 14 }}>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Manifest Stops</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FBBF24', marginTop: '0.15rem' }}>{orders.length}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.85rem 1.1rem', borderRadius: 14 }}>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Completion Rate</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#A7F3D0', marginTop: '0.15rem' }}>
              {orders.length > 0 ? `${Math.round((completedDeliveries.length / orders.length) * 100)}%` : '100%'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Split: Dark Satellite Map + Manifest ── */}
      <div className="responsive-split" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1.75rem' }}>
        
        {/* Left Column: Interactive Dark GPS Map & Selected Stop Detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Futuristic Dark GPS Satellite Map Canvas */}
          <div className="card" style={{ padding: '1.35rem', background: '#0F172A', color: 'white', borderColor: '#1E293B', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '0.6rem', margin: 0 }}>
                  <Navigation size={20} style={{ color: '#10B981' }} /> Live GPS Navigation & Route Map
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
                  Optimal Delivery Waypoints · Live Traffic Connected
                </p>
              </div>
              <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.3)', padding: '0.3rem 0.75rem', borderRadius: 20, fontWeight: 700 }}>
                📍 Route #4B Optimised
              </span>
            </div>

            {/* Dark Satellite Vector Map Simulation */}
            <div style={{
              position: 'relative', height: 380, borderRadius: 16, overflow: 'hidden',
              background: '#090D16', border: '1px solid #1E293B',
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}>
              {/* Futuristic Road Networks */}
              <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <path d="M 50 100 Q 190 140 300 220 T 520 320" fill="none" stroke="#10B981" strokeWidth="5" strokeDasharray="8,6" opacity="0.85" />
                <path d="M 140 50 L 200 300 L 410 160 L 480 340" fill="none" stroke="#38BDF8" strokeWidth="3" opacity="0.6" />
                <circle cx="50" cy="100" r="14" fill="rgba(16, 185, 129, 0.2)" />
              </svg>

              {/* Pulsing Driver Truck Marker */}
              <div style={{
                position: 'absolute', top: '25%', left: '12%', transform: 'translate(-50%, -50%)',
                zIndex: 15, background: '#10B981', color: 'white', padding: '0.4rem 0.75rem',
                borderRadius: 20, fontWeight: 800, fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
                boxShadow: '0 0 20px #10B981'
              }}>
                <Truck size={15} /> Live Position (Truck #L-890)
              </div>

              {/* Map Pins for Orders */}
              {filteredOrders.slice(0, 6).map((ord, idx) => {
                const positions = [
                  { top: '30%', left: '26%' },
                  { top: '50%', left: '52%' },
                  { top: '70%', left: '76%' },
                  { top: '35%', left: '80%' },
                  { top: '75%', left: '34%' },
                  { top: '18%', left: '55%' }
                ];
                const pos = positions[idx % positions.length];
                const isSelected = selectedOrder?._id === ord._id;

                const isDelivered = ord.status === 'Delivered';
                const isInTransit = ord.status === 'In Transit';
                const pinColor = isDelivered ? '#10B981' : (isInTransit ? '#3B82F6' : '#F59E0B');

                return (
                  <div
                    key={ord._id}
                    onClick={() => setSelectedOrder(ord)}
                    style={{
                      position: 'absolute', top: pos.top, left: pos.left,
                      transform: 'translate(-50%, -50%)', cursor: 'pointer', zIndex: isSelected ? 20 : 5,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      background: pinColor, color: 'white', borderRadius: '50%',
                      width: isSelected ? 42 : 34, height: isSelected ? 42 : 34,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: isSelected ? '0.95rem' : '0.85rem',
                      boxShadow: isSelected ? `0 0 0 6px rgba(59, 130, 246, 0.4), 0 8px 16px rgba(0,0,0,0.5)` : '0 4px 10px rgba(0,0,0,0.4)',
                      border: isSelected ? '2px solid white' : 'none'
                    }}>
                      {idx + 1}
                    </div>
                    <div style={{
                      background: isSelected ? '#1E293B' : 'rgba(15, 23, 42, 0.92)',
                      color: 'white', padding: '0.2rem 0.5rem', border: `1px solid ${isSelected ? pinColor : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: 6, fontSize: '0.68rem', fontWeight: 700, marginTop: 4, whiteSpace: 'nowrap',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.4)', textAlign: 'center'
                    }}>
                      Stop {idx + 1}: #{ord._id?.slice(-4)?.toUpperCase()}
                    </div>
                  </div>
                );
              })}

              {/* Map HUD Overlay Widget */}
              <div style={{
                position: 'absolute', bottom: 14, left: 14, background: 'rgba(15, 23, 42, 0.92)',
                backdropFilter: 'blur(8px)', padding: '0.5rem 0.9rem', borderRadius: 10,
                fontSize: '0.78rem', fontWeight: 700, color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}>
                <Compass size={16} /> GPS Connected · Speed: 42 km/h · ETA Next Stop: 8 Mins
              </div>
            </div>
          </div>

          {/* Detailed Selected Stop Action Card */}
          {selectedOrder && (
            <div className="card" style={{ padding: '1.5rem', background: '#FFFFFF', borderRadius: 16, border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)' }}>
                    Active Waypoint Control
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                    #{selectedOrder._id?.slice(-6)?.toUpperCase()}
                  </span>
                </div>

                {(() => {
                  const style = getStatusColor(selectedOrder.status);
                  return (
                    <span style={{
                      fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: 20,
                      background: style.bg, color: style.text, border: `1px solid ${style.border}`
                    }}>
                      ● {selectedOrder.status}
                    </span>
                  );
                })()}
              </div>

              {/* Delivery Progress Stepper */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.75rem 0 1.25rem', background: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#475569' }}>1. PENDING DISPATCH</div>
                  <div style={{ height: 4, background: '#10B981', borderRadius: 2, marginTop: 4 }} />
                </div>
                <ChevronRight size={14} style={{ color: '#94A3B8' }} />
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: selectedOrder.status !== 'Pending' ? '#10B981' : '#94A3B8' }}>2. IN TRANSIT</div>
                  <div style={{ height: 4, background: selectedOrder.status !== 'Pending' ? '#10B981' : '#CBD5E1', borderRadius: 2, marginTop: 4 }} />
                </div>
                <ChevronRight size={14} style={{ color: '#94A3B8' }} />
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: selectedOrder.status === 'Delivered' ? '#10B981' : '#94A3B8' }}>3. DOORSTEP DELIVERED</div>
                  <div style={{ height: 4, background: selectedOrder.status === 'Delivered' ? '#10B981' : '#CBD5E1', borderRadius: 2, marginTop: 4 }} />
                </div>
              </div>

              {/* Customer & Address Card */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Customer Contact</div>
                  <h4 style={{ margin: '0.2rem 0 0.4rem', fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                    {selectedOrder.delivery?.firstName ? `${selectedOrder.delivery.firstName} ${selectedOrder.delivery.lastName || ''}` : (selectedOrder.buyer?.name || 'Customer')}
                  </h4>
                  {selectedOrder.delivery?.phone && (
                    <a
                      href={`tel:${selectedOrder.delivery.phone}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}
                    >
                      <Phone size={15} /> {selectedOrder.delivery.phone}
                    </a>
                  )}
                </div>

                <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Delivery Address</div>
                  <p style={{ margin: '0.2rem 0 0.4rem', fontSize: '0.88rem', fontWeight: 700, color: '#1E293B', lineHeight: 1.4 }}>
                    📍 {selectedOrder.delivery?.address || 'Doorstep Street Address'}, {selectedOrder.delivery?.city || 'City'}, {selectedOrder.delivery?.postcode || ''}
                  </p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${selectedOrder.delivery?.address || ''} ${selectedOrder.delivery?.city || ''}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '0.78rem', color: '#2563EB', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}
                  >
                    Open Turn-by-Turn GPS <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              {/* Barcode & Doorstep Action Buttons */}
              <div style={{ background: '#F1F5F9', padding: '1rem', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>DOORSTEP VERIFICATION BARCODE</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--color-primary)', fontSize: '0.95rem', marginTop: '0.1rem' }}>
                    🏷️ {selectedOrder.trackingBarcode || `BC-ORD-${selectedOrder._id?.slice(-6)?.toUpperCase()}`}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setIsScannerOpen(true)}
                    className="btn-primary"
                    style={{ padding: '0.65rem 1.1rem', fontSize: '0.88rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <BarcodeIcon size={18} /> Scan Barcode
                  </button>

                  {selectedOrder.status !== 'Delivered' && (
                    <button
                      onClick={async () => {
                        const bc = selectedOrder.trackingBarcode || `BC-ORD-${selectedOrder._id?.slice(-6)?.toUpperCase()}`;
                        try {
                          const res = await orderService.scanOrderBarcode(bc);
                          showToast(res.message, 'success');
                          fetchDriverOrders();
                        } catch (err) {
                          showToast('Status update failed.', 'error');
                        }
                      }}
                      className="btn-secondary"
                      style={{
                        padding: '0.65rem 1rem', fontSize: '0.88rem', fontWeight: 800,
                        background: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC'
                      }}
                    >
                      {selectedOrder.status === 'Pending' ? '🚚 Start Dispatch' : '📦 Mark Delivered'}
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Right Column: Delivery Manifest List & Quick Actions */}
        <div className="card" style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', background: '#FFFFFF', borderRadius: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.55rem', margin: 0 }}>
              <Package size={20} style={{ color: 'var(--color-primary)' }} /> Delivery Manifest
            </h3>
            <span style={{ fontSize: '0.78rem', background: '#F1F5F9', padding: '0.25rem 0.65rem', borderRadius: 8, fontWeight: 700, color: '#475569' }}>
              {filteredOrders.length} Package{filteredOrders.length === 1 ? '' : 's'}
            </span>
          </div>

          {/* Search Input Bar */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search manifest by customer or barcode..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '0.6rem 0.85rem 0.6rem 2.4rem', borderRadius: 10,
                border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.85rem',
                background: '#F8FAFC'
              }}
            />
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', background: '#F1F5F9', padding: '0.3rem', borderRadius: 10 }}>
            {[
              { id: 'active', label: `Active (${activeDeliveries.length})` },
              { id: 'completed', label: `Completed (${completedDeliveries.length})` },
              { id: 'all', label: `All (${orders.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1, padding: '0.45rem 0.5rem', borderRadius: 8, border: 'none',
                  fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer',
                  background: activeTab === tab.id ? 'white' : 'transparent',
                  color: activeTab === tab.id ? 'var(--color-primary)' : '#64748B',
                  boxShadow: activeTab === tab.id ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* List of Deliveries */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 520, overflowY: 'auto', paddingRight: '0.2rem' }}>
            {filteredOrders.length === 0 ? (
              <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748B', fontSize: '0.88rem' }}>
                <AlertCircle size={32} style={{ color: '#CBD5E1', marginBottom: '0.5rem' }} />
                <p>No manifest items found.</p>
              </div>
            ) : (
              filteredOrders.map((ord, idx) => {
                const isSelected = selectedOrder?._id === ord._id;
                const bc = ord.trackingBarcode || `BC-ORD-${ord._id?.slice(-6)?.toUpperCase()}`;
                const statusStyle = getStatusColor(ord.status);

                return (
                  <div
                    key={ord._id}
                    onClick={() => setSelectedOrder(ord)}
                    style={{
                      padding: '1rem', borderRadius: 12, cursor: 'pointer',
                      border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      background: isSelected ? '#F0FDF4' : '#FFFFFF',
                      boxShadow: isSelected ? '0 4px 12px rgba(21, 128, 61, 0.12)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-mono)' }}>
                        Stop {idx + 1} · #{ord._id?.slice(-6)?.toUpperCase()}
                      </span>
                      <span style={{
                        fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.55rem', borderRadius: 20,
                        background: statusStyle.bg, color: statusStyle.text, border: `1px solid ${statusStyle.border}`
                      }}>
                        {ord.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1E293B' }}>
                      {ord.delivery?.firstName ? `${ord.delivery.firstName} ${ord.delivery.lastName || ''}` : (ord.buyer?.name || 'Customer')}
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={13} /> {ord.delivery?.city || 'Delivery City'} · {ord.items?.length || 1} Package Item(s)
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem', borderTop: '1px dashed #E2E8F0', paddingTop: '0.5rem' }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                        🏷️ {bc}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                        View Details <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>

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

