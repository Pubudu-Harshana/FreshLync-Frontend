import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Search, Bell, LayoutDashboard, Package, ShoppingBag, BarChart3, ShieldCheck, HelpCircle, Settings, LogOut, Info, Plus, User } from 'lucide-react';

export default function DashboardLayout() {
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
    color: isActive ? 'var(--color-primary)' : 'rgba(255,255,255,0.82)',
    transition: 'all 0.2s ease',
  });

  return (
    <div className="dashboard-layout" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Sidebar */}
      <aside className="dashboard-sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--color-primary)', color: 'white', position: 'sticky', top: 0, width: 248 }}>
        <div style={{ padding: '1.25rem 1.5rem', marginBottom: '0.5rem' }}>
          <img src="/newlogo.png" alt="Freshlync logo" style={{ height: '72px', width: 'auto', display: 'block' }} />
        </div>

        {/* Quick Action */}
        <div style={{ padding: '0 1rem', marginBottom: '0.75rem' }}>
          <button
            onClick={() => navigate('/dashboard/add-product')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px dashed rgba(255,255,255,0.4)', borderRadius: 8, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
            <Plus size={16} /> Add Product
          </button>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 1rem', gap: '0.15rem' }}>
          <NavLink to="/dashboard" end style={navItemStyle}><LayoutDashboard size={19} /> Dashboard</NavLink>
          <NavLink to="/dashboard/inventory" style={navItemStyle}><Package size={19} /> Inventory</NavLink>
          <NavLink to="/dashboard/orders" style={navItemStyle}><ShoppingBag size={19} /> Orders</NavLink>
          <NavLink to="/dashboard/analytics" style={navItemStyle}><BarChart3 size={19} /> Analytics</NavLink>
          <NavLink to="/dashboard/compliance" style={navItemStyle}><ShieldCheck size={19} /> Compliance</NavLink>
          <NavLink to="/dashboard/support" style={navItemStyle}><HelpCircle size={19} /> Support</NavLink>
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <NavLink to="/dashboard/profile" style={navItemStyle}><User size={19} /> My Profile</NavLink>
          <NavLink to="/setup/preferences" style={navItemStyle}><Settings size={19} /> Settings</NavLink>
          <button onClick={() => navigate('/login')} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.7rem 1rem', color: '#FCA5A5', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', fontWeight: 500, fontSize: '0.9rem', borderRadius: 8, transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}>
            <LogOut size={19} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--color-background)' }}>
        <header style={{ height: '68px', background: 'white', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', flexShrink: 0 }}>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Supplier Portal</h1>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Welcome back, GreenEarth Organics</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
              <input type="text" placeholder="Search orders, stock..." style={{ padding: '0.45rem 1rem 0.45rem 2.4rem', borderRadius: 999, border: '1px solid var(--color-border)', outline: 'none', width: 260, background: 'var(--color-background)', fontSize: '0.85rem' }} />
            </div>
            <button style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}><Bell size={20} /></button>
            <button style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}><Info size={20} /></button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/dashboard/profile')} title="My Profile">
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#E2E8F0', overflow: 'hidden', border: '2px solid var(--color-primary)' }}>
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
