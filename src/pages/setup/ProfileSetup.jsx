import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle } from 'lucide-react';

export default function ProfileSetup() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Tell us about yourself</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
          Welcome to Freshlync. Let's start by setting up your professional identity.
        </p>

        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-background)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--color-border)' }}>
            <UserCircle size={40} color="var(--color-text-muted)" />
          </div>
          <div>
            <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>Profile Picture</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>JPG or PNG. Max 5MB.</div>
            <button style={{ color: 'var(--color-primary)', fontWeight: 500, fontSize: '0.875rem' }}>Upload photo</button>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); navigate('/setup/verification'); }}>
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Full Name</label>
              <input type="text" className="input-field" placeholder="e.g. Jonathan Aris" required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Job Title</label>
              <input type="text" className="input-field" placeholder="e.g. Operations Manager" required />
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Phone Number</label>
            <div style={{ display: 'flex' }}>
              <div style={{ border: '1px solid var(--color-border)', borderRight: 'none', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md) 0 0 var(--radius-md)', background: 'var(--color-background)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🇺🇸 +1
              </div>
              <input type="tel" className="input-field" style={{ borderRadius: '0 var(--radius-md) var(--radius-md) 0' }} placeholder="(555) 000-0000" required />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
            <button type="button" onClick={() => navigate('/login')} style={{ color: 'var(--color-text-main)', fontSize: '0.875rem' }}>
              ← Back to Login
            </button>
            <button type="submit" className="btn-primary">
              Save & Continue →
            </button>
          </div>
        </form>
      </div>
      
      {/* Progress Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
        {[1, 2, 3, 4].map(step => (
          <div key={step} style={{ width: '40px', height: '4px', borderRadius: '2px', background: step === 1 ? 'var(--color-primary)' : 'var(--color-border)' }}></div>
        ))}
      </div>
    </div>
  );
}
