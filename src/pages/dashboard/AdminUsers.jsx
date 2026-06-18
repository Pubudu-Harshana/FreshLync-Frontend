import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Users, CheckCircle, XCircle, RefreshCw,
  ShieldCheck, Truck, User, Crown, Filter, MoreVertical,
  ChevronLeft, ChevronRight, Mail, Building2, Calendar,
  BadgeCheck,
} from 'lucide-react';
import SEO from '../../components/SEO';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminService } from '../../services/adminService';

const ROLES = [
  { value: '',         label: 'All Roles',  color: '#6B7280', bg: '#F3F4F6' },
  { value: 'buyer',    label: 'Buyers',     color: '#1D4ED8', bg: '#DBEAFE' },
  { value: 'supplier', label: 'Suppliers',  color: '#047857', bg: '#D1FAE5' },
  { value: 'admin',    label: 'Admins',     color: '#6D28D9', bg: '#EDE9FE' },
];

const ROLE_META = {
  buyer:    { icon: User,        color: '#1D4ED8', bg: '#DBEAFE', label: 'Buyer'    },
  supplier: { icon: Truck,       color: '#047857', bg: '#D1FAE5', label: 'Supplier' },
  admin:    { icon: ShieldCheck, color: '#6D28D9', bg: '#EDE9FE', label: 'Admin'    },
};

function RoleBadge({ role }) {
  const meta = ROLE_META[role] || ROLE_META.buyer;
  const Icon = meta.icon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
      background: meta.bg, color: meta.color,
      padding: '0.25rem 0.65rem', borderRadius: 999,
      fontSize: '0.75rem', fontWeight: 700,
    }}>
      <Icon size={12} /> {meta.label}
    </span>
  );
}

function VerifiedBadge({ verified }) {
  return verified ? (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      background: '#D1FAE5', color: '#065F46',
      padding: '0.2rem 0.6rem', borderRadius: 999,
      fontSize: '0.72rem', fontWeight: 700,
    }}>
      <CheckCircle size={11} /> Verified
    </span>
  ) : (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      background: '#FEF3C7', color: '#92400E',
      padding: '0.2rem 0.6rem', borderRadius: 999,
      fontSize: '0.72rem', fontWeight: 700,
    }}>
      <XCircle size={11} /> Unverified
    </span>
  );
}

function Avatar({ name, size = 38 }) {
  const colors = ['#6366F1','#8B5CF6','#EC4899','#14B8A6','#F59E0B','#10B981','#3B82F6','#EF4444'];
  const color = colors[(name?.charCodeAt(0) || 0) % colors.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color, color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 700, flexShrink: 0,
      letterSpacing: '-0.5px',
    }}>
      {name?.slice(0, 2).toUpperCase() || 'NA'}
    </div>
  );
}

export default function AdminUsers() {
  const [users, setUsers]       = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [role, setRole]         = useState('');
  const [page, setPage]         = useState(1);
  const [verifying, setVerifying] = useState(null);
  const [toast, setToast]       = useState(null);
  const LIMIT = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers({ role, search, page, limit: LIMIT });
      setUsers(data.users);
      setTotal(data.total);
    } catch {
      setUsers([]);
    }
    setLoading(false);
  }, [role, search, page]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchUsers();
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => { fetchUsers(); }, [role, page]);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const handleVerify = async (userId, userName) => {
    setVerifying(userId);
    try {
      await adminService.verifySupplier(userId);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isVerified: true } : u));
      showToast(`✅ ${userName} has been verified.`);
    } catch {
      showToast('Failed to verify supplier.', false);
    }
    setVerifying(null);
  };

  const totalPages = Math.ceil(total / LIMIT);
  const counts = { all: total };

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div style={{ position: 'relative' }}>
      <SEO title="User Management" />

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999,
          background: toast.ok ? '#065F46' : '#991B1B',
          color: 'white', padding: '0.875rem 1.5rem',
          borderRadius: 10, fontSize: '0.875rem', fontWeight: 600,
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          animation: 'fadeIn 0.2s ease',
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Users size={22} style={{ color: '#6D28D9' }} /> User Management
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Manage all platform users — buyers, suppliers, and admins.
          </p>
        </div>
        <button
          onClick={fetchUsers}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1.1rem', borderRadius: 8, border: '1px solid var(--color-border)', background: 'white', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
        >
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Stat Chips */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        {ROLES.map(r => (
          <button
            key={r.value}
            onClick={() => { setRole(r.value); setPage(1); }}
            style={{
              padding: '0.45rem 1.1rem', borderRadius: 999, fontWeight: 600, fontSize: '0.82rem',
              cursor: 'pointer', transition: 'all 0.18s ease',
              background: role === r.value ? r.color : 'white',
              color: role === r.value ? 'white' : r.color,
              border: `2px solid ${r.color}`,
              boxShadow: role === r.value ? `0 2px 8px ${r.color}44` : 'none',
            }}
          >
            {r.label} {role === r.value && total > 0 ? `(${total})` : ''}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: 480 }}>
        <Search size={17} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '0.7rem 1rem 0.7rem 2.8rem',
            borderRadius: 10, border: '1px solid var(--color-border)',
            outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box',
            background: 'white',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        />
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontWeight: 700, color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>User</th>
              <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontWeight: 700, color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Role</th>
              <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontWeight: 700, color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Company</th>
              <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontWeight: 700, color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</th>
              <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontWeight: 700, color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Joined</th>
              <th style={{ padding: '0.875rem 1.25rem', textAlign: 'right', fontWeight: 700, color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: '4rem', textAlign: 'center' }}>
                  <LoadingSpinner message="Loading users..." />
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  <Users size={40} style={{ marginBottom: '0.75rem', opacity: 0.3, display: 'block', margin: '0 auto 0.75rem' }} />
                  <div style={{ fontWeight: 600 }}>No users found</div>
                  <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Try adjusting your search or filter</div>
                </td>
              </tr>
            ) : (
              users.map((u, idx) => (
                <tr
                  key={u._id}
                  style={{
                    borderBottom: idx < users.length - 1 ? '1px solid var(--color-border)' : 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* User */}
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                      <Avatar name={u.name} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.15rem' }}>{u.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
                          <Mail size={11} /> {u.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <RoleBadge role={u.role} />
                  </td>

                  {/* Company */}
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                    {u.company ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Building2 size={13} /> {u.company}
                      </div>
                    ) : <span style={{ opacity: 0.45 }}>—</span>}
                  </td>

                  {/* Verified */}
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <VerifiedBadge verified={u.isVerified} />
                  </td>

                  {/* Joined */}
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={13} /> {formatDate(u.createdAt)}
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    {u.role === 'supplier' && !u.isVerified ? (
                      <button
                        onClick={() => handleVerify(u._id, u.name)}
                        disabled={verifying === u._id}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                          padding: '0.45rem 1rem', borderRadius: 8,
                          background: verifying === u._id ? '#E5E7EB' : '#047857',
                          color: verifying === u._id ? '#9CA3AF' : 'white',
                          border: 'none', cursor: verifying === u._id ? 'not-allowed' : 'pointer',
                          fontSize: '0.8rem', fontWeight: 700,
                          transition: 'all 0.18s ease',
                        }}
                      >
                        {verifying === u._id ? (
                          <><RefreshCw size={13} style={{ animation: 'spin 0.8s linear infinite' }} /> Verifying...</>
                        ) : (
                          <><BadgeCheck size={14} /> Verify Supplier</>
                        )}
                      </button>
                    ) : u.isVerified ? (
                      <span style={{ fontSize: '0.78rem', color: '#6B7280', fontStyle: 'italic' }}>
                        {u.role === 'supplier' ? 'Already verified' : '—'}
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div style={{
            padding: '1rem 1.25rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderTop: '1px solid var(--color-border)',
            background: '#FAFAFA',
          }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of <strong>{total}</strong> users
            </div>
            <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ padding: '0.4rem 0.65rem', borderRadius: 7, border: '1px solid var(--color-border)', background: page === 1 ? '#F3F4F6' : 'white', cursor: page === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    style={{
                      padding: '0.4rem 0.75rem', borderRadius: 7, fontWeight: 600, fontSize: '0.85rem',
                      border: page === p ? 'none' : '1px solid var(--color-border)',
                      background: page === p ? '#312E81' : 'white',
                      color: page === p ? 'white' : 'inherit',
                      cursor: 'pointer',
                    }}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{ padding: '0.4rem 0.65rem', borderRadius: 7, border: '1px solid var(--color-border)', background: page === totalPages ? '#F3F4F6' : 'white', cursor: page === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
