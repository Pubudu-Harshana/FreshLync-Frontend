import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Leaf, Search, Bell, ShoppingCart, LogOut, Info, Store, Users, Truck, Package, Activity, Settings, LayoutGrid } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function MarketplaceLayout() {
  const { cartItemCount } = useCart();
  const navigate = useNavigate();

  const navItemStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontWeight: 500,
    textDecoration: 'none',
    background: isActive ? 'rgba(255,255,255,0.9)' : 'transparent',
    color: isActive ? 'var(--color-text-main)' : 'rgba(255,255,255,0.8)',
    transition: 'all 0.2s ease'
  });

  return (
    <div className="dashboard-layout" style={{ fontFamily: 'var(--font-sans)', display: 'flex' }}>
      {/* Sidebar */}
      <aside className="dashboard-sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#047857', color: 'white', position: 'sticky', top: 0, minWidth: '250px' }}>
        <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ background: 'white', color: '#047857', padding: '0.25rem', borderRadius: '4px' }}>
            <Leaf size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>Freshlync</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>Buyer Portal</div>
          </div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 1rem', gap: '0.25rem' }}>
          <NavLink to="/marketplace" end style={navItemStyle}>
            <Store size={20} /> Marketplace
          </NavLink>
          <NavLink to="/marketplace/suppliers" style={navItemStyle}>
            <Users size={20} /> Suppliers
          </NavLink>
          <NavLink to="/marketplace/logistics" style={navItemStyle}>
            <Truck size={20} /> Logistics
          </NavLink>
          <NavLink to="/marketplace/shipments" style={navItemStyle}>
            <LayoutGrid size={20} /> My Shipments
          </NavLink>
          <NavLink to="/marketplace/inventory" style={navItemStyle}>
            <Package size={20} /> My Inventory
          </NavLink>
          <NavLink to="/marketplace/analytics" style={navItemStyle}>
            <Activity size={20} /> Analytics
          </NavLink>
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <NavLink to="/setup/preferences" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', borderRadius: '8px' }}>
            <Settings size={20} /> Settings
          </NavLink>
          <button onClick={() => navigate('/login')} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', color: '#FCA5A5', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', fontWeight: 500, borderRadius: '8px' }}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--color-background)' }}>
        <header style={{ height: '72px', background: 'white', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', flexShrink: 0 }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Marketplace</h1>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Discover premium fish, meat, and vegetables</div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input type="text" placeholder="Search marketplace..." style={{ padding: '0.5rem 1rem 0.5rem 2.5rem', borderRadius: '999px', border: '1px solid var(--color-border)', outline: 'none', width: '300px', background: 'var(--color-background)' }} />
            </div>
            
            <button style={{ position: 'relative', color: 'var(--color-text-main)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--color-primary)', color: 'white', fontSize: '0.65rem', fontWeight: 700, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cartItemCount}
                </span>
              )}
            </button>
            <button style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <Bell size={20} />
            </button>
            <button style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <Info size={20} />
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/setup/profile')} title="View Profile">
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#E2E8F0', overflow: 'hidden' }}>
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
