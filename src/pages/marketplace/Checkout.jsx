import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Building2, Truck, ChevronRight, Loader } from 'lucide-react';
import SEO from '../../components/SEO';
import { useCart } from '../../context/CartContext';
import { orderService } from '../../services/orderService';

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
  { id: 'bank', label: 'Bank Transfer', icon: Building2 },
  { id: 'net30', label: 'Net 30 Invoice', icon: Truck },
];

export default function Checkout() {
  const navigate     = useNavigate();
  const { cart: cartItems, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [delivery, setDelivery] = useState({
    firstName: '', lastName: '', company: '', email: '',
    address: '', city: '', postcode: '', country: 'United Kingdom',
  });

  const setD = (k, v) => setDelivery(p => ({ ...p, [k]: v }));
  const inputStyle = { width: '100%', padding: '0.7rem 0.875rem', borderRadius: 8, border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) { setError('Your cart is empty.'); return; }
    setLoading(true); setError('');
    try {
      const items = cartItems.map(item => ({
        product:  item.id || item._id,
        name:     item.name,
        price:    parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0,
        quantity: item.quantity,
        unit:     item.unit || 'kg',
      }));
      const order = await orderService.placeOrder({ items, delivery, paymentMethod: payMethod });
      clearCart();
      navigate('/marketplace/order-success', { state: { orderId: order._id, total: order.total } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deliveryComplete = delivery.firstName && delivery.lastName && delivery.email && delivery.address && delivery.city && delivery.postcode;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem' }}>
      <SEO title="Checkout" />
      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Checkout</h2>

      {/* Steps */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '2rem' }}>
        {['Delivery', 'Payment', 'Review'].map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: step > i ? 'var(--color-primary)' : step === i + 1 ? 'var(--color-primary)' : '#E2E8F0', color: step >= i + 1 ? 'white' : 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>{i + 1}</div>
              <span style={{ fontWeight: step === i + 1 ? 700 : 400, color: step === i + 1 ? 'var(--color-text-main)' : 'var(--color-text-muted)', fontSize: '0.875rem' }}>{s}</span>
            </div>
            {i < 2 && <ChevronRight size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />}
          </React.Fragment>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
        {/* Left: Steps */}
        <div>
          {step === 1 && (
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Delivery Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label style={labelStyle}>First Name *</label><input style={inputStyle} value={delivery.firstName} onChange={e => setD('firstName', e.target.value)} required /></div>
                <div><label style={labelStyle}>Last Name *</label><input style={inputStyle} value={delivery.lastName} onChange={e => setD('lastName', e.target.value)} required /></div>
                <div style={{ gridColumn: '1/-1' }}><label style={labelStyle}>Company</label><input style={inputStyle} value={delivery.company} onChange={e => setD('company', e.target.value)} placeholder="(optional)" /></div>
                <div style={{ gridColumn: '1/-1' }}><label style={labelStyle}>Email *</label><input style={inputStyle} type="email" value={delivery.email} onChange={e => setD('email', e.target.value)} required /></div>
                <div style={{ gridColumn: '1/-1' }}><label style={labelStyle}>Address *</label><input style={inputStyle} value={delivery.address} onChange={e => setD('address', e.target.value)} required /></div>
                <div><label style={labelStyle}>City *</label><input style={inputStyle} value={delivery.city} onChange={e => setD('city', e.target.value)} required /></div>
                <div><label style={labelStyle}>Postcode *</label><input style={inputStyle} value={delivery.postcode} onChange={e => setD('postcode', e.target.value)} required /></div>
                <div style={{ gridColumn: '1/-1' }}><label style={labelStyle}>Country</label><input style={inputStyle} value={delivery.country} onChange={e => setD('country', e.target.value)} /></div>
              </div>
              <button className="btn-primary" disabled={!deliveryComplete} onClick={() => setStep(2)} style={{ marginTop: '1.5rem', width: '100%', opacity: deliveryComplete ? 1 : 0.6 }}>Continue to Payment</button>
            </div>
          )}

          {step === 2 && (
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Payment Method</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {PAYMENT_METHODS.map(m => (
                  <button key={m.id} type="button" onClick={() => setPayMethod(m.id)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: 10, border: `2px solid ${payMethod === m.id ? 'var(--color-primary)' : 'var(--color-border)'}`, background: payMethod === m.id ? '#f0fdf4' : 'white', cursor: 'pointer', textAlign: 'left' }}>
                    <m.icon size={22} style={{ color: payMethod === m.id ? 'var(--color-primary)' : 'var(--color-text-muted)' }} />
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{m.label}</span>
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn-secondary" onClick={() => setStep(1)} style={{ flex: 1 }}>Back</button>
                <button className="btn-primary" onClick={() => setStep(3)} style={{ flex: 2 }}>Review Order</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Review & Confirm</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 8, background: '#E2E8F0', overflow: 'hidden', flexShrink: 0 }}>
                      {item.image && <img src={`http://localhost:5000${item.image}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>×{item.quantity} {item.unit}</div>
                    </div>
                    <div style={{ fontWeight: 700 }}>£{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 8, marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  <span>Subtotal</span><span>£{cartTotal?.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                  <span>Delivery</span><span style={{ color: '#16A34A' }}>Free</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                  <span>Total</span><span>£{cartTotal?.toFixed(2)}</span>
                </div>
              </div>
              {error && <div style={{ padding: '0.75rem', background: '#FEE2E2', color: '#991B1B', borderRadius: 8, marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn-secondary" onClick={() => setStep(2)} style={{ flex: 1 }}>Back</button>
                <button className="btn-primary" onClick={handlePlaceOrder} disabled={loading} style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1 }}>
                  {loading ? <><Loader size={16} style={{ animation: 'spin 0.75s linear infinite' }} /> Placing Order...</> : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Order Summary */}
        <div className="card" style={{ position: 'sticky', top: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {cartItems.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>{item.name} ×{item.quantity}</span>
                <span style={{ fontWeight: 600 }}>£{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.875rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
            <span>Total</span>
            <span style={{ color: 'var(--color-primary)' }}>£{cartTotal?.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
