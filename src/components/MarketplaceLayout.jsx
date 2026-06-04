import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Leaf, Search, Bell, ShoppingCart, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function MarketplaceLayout() {
  const { cartItemCount } = useCart();
  const navigate = useNavigate();

  const navItemStyle = ({ isActive }) => ({
    color: isActive ? 'var(--color-primary)' : 'var(--color-text-main)',
    borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
    padding: '1.5rem 0',
    fontWeight: isActive ? 600 : 500,
    textDecoration: 'none',
    transition: 'all 0.2s ease'
  });

  return (
    <div style={{ fontFamily: 'var(--font-sans)', minHeight: '100vh', background: 'var(--color-background)', display: 'flex', flexDirection: 'column' }}>
      {/* Topbar */}
      <header style={{ height: '72px', background: 'white', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Leaf size={28} />
            <span style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--color-text-main)' }}>Freshlync</span>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input type="text" placeholder="Search marketplace..." style={{ padding: '0.5rem 1rem 0.5rem 2.5rem', borderRadius: '999px', border: 'none', outline: 'none', width: '300px', background: 'var(--color-background)' }} />
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontSize: '0.875rem' }}>
          <NavLink to="/marketplace" end style={navItemStyle}>Marketplace</NavLink>
          <NavLink to="/marketplace/suppliers" style={navItemStyle}>Suppliers</NavLink>
          <NavLink to="/marketplace/logistics" style={navItemStyle}>Logistics</NavLink>
          <NavLink to="/marketplace/shipments" style={navItemStyle}>My Shipments</NavLink>
          <NavLink to="/marketplace/inventory" style={navItemStyle}>My Inventory</NavLink>
          <NavLink to="/marketplace/analytics" style={navItemStyle}>Analytics</NavLink>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button style={{ position: 'relative', color: 'var(--color-text-main)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--color-primary)', color: 'white', fontSize: '0.65rem', fontWeight: 700, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cartItemCount}
              </span>
            )}
          </button>
          <button style={{ color: 'var(--color-text-main)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Bell size={24} />
          </button>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#E2E8F0', overflow: 'hidden', cursor: 'pointer' }} onClick={() => navigate('/setup/profile')}>
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <button onClick={() => navigate('/login')} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, marginLeft: '0.5rem' }}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
}
