import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Search, Bell, LayoutDashboard, Truck, Package, Settings, LogOut, Activity, Info, Users, ShoppingBag } from 'lucide-react';

export default function AdminLayout() {
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
    <div className="dashboard-layout" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Sidebar */}
      <aside className="dashboard-sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#312E81', color: 'white', position: 'sticky', top: 0 }}>
        <div style={{ padding: '1.5rem', marginBottom: '1rem' }}>
          <img src="/newlogo.png" alt="Freshlync logo" style={{ height: '80px', width: 'auto', display: 'block' }} />
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 1rem', gap: '0.25rem' }}>
          <NavLink to="/admin" end style={navItemStyle}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/admin/orders" style={navItemStyle}>
            <ShoppingBag size={20} /> Orders
          </NavLink>
          <NavLink to="/admin/shipments" style={navItemStyle}>
            <Truck size={20} /> Shipments
          </NavLink>
          <NavLink to="/admin/inventory" style={navItemStyle}>
            <Package size={20} /> Inventory
          </NavLink>
          <NavLink to="/admin/users" style={navItemStyle}>
            <Users size={20} /> User Management
          </NavLink>
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <NavLink to="/setup/preferences" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>
            <Settings size={20} /> System Settings
          </NavLink>
          <button onClick={() => navigate('/login')} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', color: '#FCA5A5', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', fontWeight: 500 }}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--color-background)' }}>
        <header style={{ height: '72px', background: 'white', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', flexShrink: 0 }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Admin Portal</h1>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Platform Overview & Operations</div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input type="text" placeholder="Search system-wide..." style={{ padding: '0.5rem 1rem 0.5rem 2.5rem', borderRadius: '999px', border: '1px solid var(--color-border)', outline: 'none', width: '300px', background: 'var(--color-background)' }} />
            </div>
            <button style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <Bell size={20} />
            </button>
            <button style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <Info size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/setup/profile')} title="View Profile">
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#E2E8F0', overflow: 'hidden' }}>
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100" alt="Admin User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
