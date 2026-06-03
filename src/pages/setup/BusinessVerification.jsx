import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Info, CheckCircle2, Shield } from 'lucide-react';

export default function BusinessVerification() {
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ display: 'inline-block', background: 'var(--color-primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '1rem' }}>
        Step 2 of 4
      </div>
      <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Business Verification</h2>
      <p style={{ color: 'var(--color-text-main)', fontSize: '1rem', marginBottom: '2.5rem', maxWidth: '800px', lineHeight: 1.5 }}>
        To ensure security and compliance within the Freshlync supply chain, we need to verify your business identity before activating your warehouse dashboard.
      </p>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Main Form Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Legal Information</h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Company Legal Name</label>
              <input type="text" className="input-field" placeholder="e.g. GreenPath Logistics LLC" />
            </div>
            
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Tax ID (EIN/VAT)</label>
                <input type="text" className="input-field" placeholder="XX-XXXXXXX" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Entity Type</label>
                <select className="input-field" style={{ appearance: 'none', background: 'white url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E") no-repeat right 1rem center' }}>
                  <option>Corporation</option>
                  <option>LLC</option>
                  <option>Partnership</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Registered Business Address</label>
              <textarea className="input-field" placeholder="Street address, City, State, ZIP" rows={3} style={{ resize: 'none' }}></textarea>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Document Upload</h3>
            <div style={{ border: '2px dashed #CBD5E1', borderRadius: '12px', padding: '3rem', textAlign: 'center', background: '#F8FAFC' }}>
              <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: 'var(--shadow-sm)' }}>
                <UploadCloud size={24} color="var(--color-text-main)" />
              </div>
              <h4 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Drop your files here</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                Upload Incorporation Docs, Business License, or Operating Agreement<br/>(PDF/JPG, max 10MB)
              </p>
              <button className="btn-secondary">Select Files</button>
            </div>
          </div>

        </div>

        {/* Side Panel */}
        <div style={{ width: '340px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Why verify card */}
          <div style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative', color: 'white', padding: '2rem 1.5rem', backgroundImage: 'url(https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=600)', backgroundSize: 'cover' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.2))' }}></div>
            <div style={{ position: 'relative', zIndex: 1, marginTop: '4rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Why verify?</h3>
              <p style={{ fontSize: '0.875rem', opacity: 0.9, lineHeight: 1.5 }}>
                Verification allows you to unlock high-volume shipping rates and priority logistical support.
              </p>
            </div>
          </div>

          {/* Checklist */}
          <div style={{ background: '#F1F5F9', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              <Info size={18} /> Compliance Checklist
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem' }}>
                <CheckCircle2 size={18} color="var(--color-text-main)" /> <span>Signed Operating Agreement</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem' }}>
                <CheckCircle2 size={18} color="var(--color-text-main)" /> <span>Federal Tax ID (EIN)</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid var(--color-border)' }}></div> <span>Warehouse Safety Certs (Optional)</span>
              </div>
            </div>
          </div>

          {/* Data Protection */}
          <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '1rem' }}>
            <Shield size={24} color="#64748B" />
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>Data Protection</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Your documents are encrypted and only accessible by compliance officers.
              </div>
            </div>
          </div>

        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
        <button type="button" onClick={() => navigate('/setup/profile')} style={{ color: 'var(--color-text-main)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
          ← Back to Welcome
        </button>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <button style={{ color: 'var(--color-text-main)', fontSize: '0.875rem', fontWeight: 500 }}>Save for Later</button>
          <button type="button" onClick={() => navigate('/setup/team')} className="btn-primary" style={{ background: '#F1F5F9', color: '#94A3B8' }} disabled>
            Continue to Step 3 →
          </button>
        </div>
      </div>
    </div>
  );
}
