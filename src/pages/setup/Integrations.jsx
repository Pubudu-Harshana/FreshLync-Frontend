import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, Database, Wifi, Truck } from 'lucide-react';

export default function Integrations() {
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Integrate Your Ecosystem</h2>
          <p style={{ color: 'var(--color-text-main)', fontSize: '1rem', lineHeight: 1.5 }}>
            Finalize your setup by connecting Freshlync to your existing ERP and telemetry providers.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* ERP Integration */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Database size={24} color="var(--color-primary)" />
            <h3 style={{ fontSize: '1.25rem' }}>ERP Integration</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>SAP S/4HANA</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Enterprise Resource Planning</div>
              </div>
              <button className="btn-secondary">Connect</button>
            </div>
            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>Oracle Cloud ERP</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Supply Chain Management</div>
              </div>
              <button className="btn-secondary">Connect</button>
            </div>
          </div>
        </div>

        {/* IoT & Telematics */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Wifi size={24} color="var(--color-primary)" />
            <h3 style={{ fontSize: '1.25rem' }}>IoT & Telematics</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>Samsara</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Fleet Tracking</div>
              </div>
              <button className="btn-secondary">Connect</button>
            </div>
            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>Motive</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>ELD & Compliance</div>
              </div>
              <button className="btn-secondary">Connect</button>
            </div>
          </div>
        </div>

      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
        <button type="button" onClick={() => navigate('/setup/team')} style={{ color: 'var(--color-text-main)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
          ← Back to Team Access
        </button>
        <button type="button" onClick={() => navigate('/setup/preferences')} className="btn-primary">
          Continue to Preferences →
        </button>
      </div>
    </div>
  );
}
