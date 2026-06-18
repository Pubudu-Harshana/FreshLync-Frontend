import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bell, ShoppingCart, LogOut, Info, Store, Users, Truck, Package, Activity, Settings, LayoutGrid } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ChatbotWidget from './ChatbotWidget';

export default function MarketplaceLayout() {
  const { cartItemCount } = useCart();
  const navigate = useNavigate();

  const navItemStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    padding: '0.7rem 1rem',
    borderRadius: '8px',
    fontWeight: 500,
    fontSize: '0.9rem',
    textDecoration: 'none',
    background: isActive ? 'rgba(255,255,255,0.92)' : 'transparent',
    color: isActive ? '#047857' : 'rgba(255,255,255,0.82)',
    transition: 'all 0.2s ease',
  });

  return (
    <div className="dashboard-layout" style={{ fontFamily: 'var(--font-sans)', display: 'flex' }}>
      {/* Sidebar */}
      <aside className="dashboard-sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#047857', color: 'white', position: 'sticky', top: 0, width: 248, flexShrink: 0 }}>
        <div style={{ padding: '1.25rem 1.5rem', marginBottom: '0.5rem' }}>
          <img src="/newlogo.png" alt="Freshlync logo" style={{ height: '72px', width: 'auto', display: 'block' }} />
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 1rem', gap: '0.15rem' }}>
          <NavLink to="/marketplace" end style={navItemStyle}><Store size={19} /> Marketplace</NavLink>
          <NavLink to="/marketplace/suppliers" style={navItemStyle}><Users size={19} /> Suppliers</NavLink>
          <NavLink to="/marketplace/logistics" style={navItemStyle}><Truck size={19} /> Logistics</NavLink>
          <NavLink to="/marketplace/shipments" style={navItemStyle}><LayoutGrid size={19} /> My Shipments</NavLink>
          <NavLink to="/marketplace/inventory" style={navItemStyle}><Package size={19} /> My Inventory</NavLink>
          <NavLink to="/marketplace/analytics" style={navItemStyle}><Activity size={19} /> Analytics</NavLink>

          {/* Cart shortcut */}
          <NavLink to="/marketplace/cart" style={({ isActive }) => ({ ...navItemStyle({ isActive }), marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '1rem' })}>
            <div style={{ position: 'relative' }}>
              <ShoppingCart size={19} />
              {cartItemCount > 0 && (
                <span style={{ position: 'absolute', top: -8, right: -8, background: '#f25c54', color: 'white', fontSize: '0.6rem', fontWeight: 800, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </div>
            Cart {cartItemCount > 0 && `(${cartItemCount})`}
          </NavLink>
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <NavLink to="/setup/preferences" style={navItemStyle}><Settings size={19} /> Settings</NavLink>
          <button onClick={() => navigate('/login')} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.7rem 1rem', color: '#FCA5A5', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', fontWeight: 500, fontSize: '0.9rem', borderRadius: 8 }}>
            <LogOut size={19} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--color-background)' }}>
        <header style={{ height: '68px', background: 'white', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', flexShrink: 0 }}>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Marketplace</h1>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Discover premium fish, meat, and vegetables</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Cart button in header */}
            <button onClick={() => navigate('/marketplace/cart')} style={{ position: 'relative', color: 'var(--color-text-main)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem' }}>
              <ShoppingCart size={22} />
              {cartItemCount > 0 && (
                <span style={{ position: 'absolute', top: 0, right: 0, background: 'var(--color-primary)', color: 'white', fontSize: '0.6rem', fontWeight: 800, width: 17, height: 17, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </button>
            <button style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}><Bell size={20} /></button>
            <button style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}><Info size={20} /></button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/setup/profile')} title="View Profile">
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#E2E8F0', overflow: 'hidden', border: '2px solid #047857' }}>
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </div>
      </main>

      {/* AI Chatbot Widget — customer-facing only */}
      <ChatbotWidget />
    </div>
  );
}
