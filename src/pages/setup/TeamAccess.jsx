import React from 'react';
import { UserPlus, Info, Trash2, RefreshCw } from 'lucide-react';

export default function TeamAccess() {
  const invitations = [
    { initials: 'JS', email: 'j.smith@freshlync.com', name: 'Julian Smith', role: 'Driver', date: 'Oct 24, 2023', status: 'Waiting' },
    { initials: 'MR', email: 'm.rodriguez@logistics.net', name: 'Maria Rodriguez', role: 'Manager', date: 'Oct 23, 2023', status: 'Waiting' },
    { initials: 'KL', email: 'k.lee@freshlync.com', name: 'Kevin Lee', role: 'Viewer', date: 'Oct 22, 2023', status: 'Expired' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Invite Your Team</h2>
          <p style={{ color: 'var(--color-text-main)', fontSize: '1rem', lineHeight: 1.5 }}>
            Assign roles and permissions to streamline your supply chain management.
          </p>
        </div>
        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Info size={16} /> Step 3 of 4
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginBottom: '2rem' }}>
        {/* Invite Form */}
        <div className="card" style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <UserPlus size={24} color="var(--color-text-main)" />
            <h3 style={{ fontSize: '1.25rem' }}>Send Invitations</h3>
          </div>
          
          <div style={{ borderBottom: '1px solid var(--color-border)', marginBottom: '1.5rem' }}></div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Email Address</label>
            <input type="email" className="input-field" placeholder="colleague@freshlync.com" />
          </div>
          
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Assign Role</label>
              <select className="input-field" style={{ appearance: 'none', background: 'white url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E") no-repeat right 1rem center' }}>
                <option>Manager</option>
                <option>Admin</option>
                <option>Driver</option>
                <option>Viewer</option>
              </select>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
              <button className="btn-primary" style={{ width: '100%', background: '#F8FAFC', color: 'var(--color-border)', pointerEvents: 'none' }}>
                Send Invite
              </button>
            </div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <Shield size={16} color="var(--color-text-main)" style={{ marginTop: '0.125rem' }} />
            <div style={{ color: 'var(--color-text-main)', lineHeight: 1.5 }}>
              <strong>Manager Role:</strong> Full access to inventory, shipments, and analytics. Cannot manage billing or global team settings.
            </div>
          </div>
        </div>

        {/* Roles Side Panel */}
        <div style={{ width: '340px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ background: 'var(--color-primary)', color: 'white', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              <Info size={18} /> Role Permissions
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.2)', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
              <span>Admin</span> <span style={{ fontWeight: 600 }}>Full Control</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.2)', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
              <span>Manager</span> <span style={{ fontWeight: 600 }}>Operations Only</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.2)', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
              <span>Driver</span> <span style={{ fontWeight: 600 }}>Mobile App Access</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span>Viewer</span> <span style={{ fontWeight: 600 }}>Read-only Data</span>
            </div>
          </div>

          <div style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative', color: 'white', padding: '2rem 1.5rem', backgroundImage: 'url(https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600)', backgroundSize: 'cover' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.85)' }}></div>
            <div style={{ position: 'relative', zIndex: 1, color: 'var(--color-text-main)' }}>
              <p style={{ fontStyle: 'italic', fontWeight: 500, fontSize: '1.125rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                "Efficiency starts with a synchronized team."
              </p>
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Freshlync Logistics Wisdom</div>
            </div>
          </div>

        </div>
      </div>

      {/* Pending Invitations */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <UserPlus size={24} color="var(--color-text-main)" />
            <h3 style={{ fontSize: '1.25rem' }}>Pending Invitations</h3>
          </div>
          <div style={{ background: '#F1F5F9', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
            3 Invitations Active
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', textAlign: 'left' }}>
              <th style={{ padding: '1rem 0', fontWeight: 500 }}>RECIPIENT</th>
              <th style={{ padding: '1rem 0', fontWeight: 500 }}>ROLE</th>
              <th style={{ padding: '1rem 0', fontWeight: 500 }}>SENT ON</th>
              <th style={{ padding: '1rem 0', fontWeight: 500 }}>STATUS</th>
              <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {invitations.map((inv, idx) => (
              <tr key={idx} style={{ borderBottom: idx !== invitations.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                <td style={{ padding: '1rem 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                      {inv.initials}
                    </div>
                    <div>
                      <div style={{ color: 'var(--color-text-main)' }}>{inv.email}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{inv.name}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1rem 0' }}>
                  <span style={{ background: '#F1F5F9', padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 500 }}>{inv.role}</span>
                </td>
                <td style={{ padding: '1rem 0', color: 'var(--color-text-main)' }}>{inv.date}</td>
                <td style={{ padding: '1rem 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, color: inv.status === 'Waiting' ? 'var(--color-text-main)' : '#EF4444' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: inv.status === 'Waiting' ? '#F59E0B' : '#EF4444' }}></div>
                    {inv.status}
                  </div>
                </td>
                <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                  {inv.status === 'Waiting' ? (
                    <button style={{ color: 'var(--color-text-muted)', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  ) : (
                    <button style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-text-main)', fontWeight: 500, cursor: 'pointer' }}>
                      <RefreshCw size={14} /> Resend
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
