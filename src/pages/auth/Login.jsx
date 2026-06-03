import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState('Customer');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === 'Customer' || role === 'Admin') {
      navigate('/setup/profile');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="split-layout" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Left Side - Banner */}
      <div className="split-left" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000)' }}>
        <div className="split-left-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4rem', color: 'white' }}>
            <div style={{ background: 'white', color: 'var(--color-primary)', padding: '0.25rem', borderRadius: '4px' }}>
              <Leaf size={24} />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Freshlync</span>
          </div>
          <h1>Smart Distribution,<br/><span>Fresh Connection</span></h1>
          <p style={{ fontSize: '1.125rem', opacity: 0.9, maxWidth: '500px', lineHeight: 1.6 }}>
            Optimizing the journey from farm to table with real-time data and sustainable logistics management.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '4rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '1rem', borderRadius: '8px', flex: 1, border: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.25rem' }}>98% Efficient</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Route Optimization</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '1rem', borderRadius: '8px', flex: 1, border: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.25rem' }}>Cold Chain</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>End-to-End Tracking</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="split-right">
        <div style={{ width: '100%', maxWidth: '440px', padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>Access your supply chain dashboard</p>
          </div>

          <div style={{ display: 'flex', background: 'var(--color-background)', borderRadius: '8px', padding: '0.25rem', marginBottom: '2rem' }}>
            {['Customer', 'Supplier', 'Admin'].map(r => (
              <button 
                key={r}
                onClick={() => setRole(r)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: '6px',
                  fontWeight: 500,
                  background: role === r ? 'white' : 'transparent',
                  boxShadow: role === r ? 'var(--shadow-sm)' : 'none',
                  color: role === r ? 'var(--color-text-main)' : 'var(--color-text-muted)'
                }}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Email Address</label>
              <input 
                type="email" 
                className="input-field" 
                placeholder="name@freshlync.com" 
                required 
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
                <a href="#" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-primary)' }}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="input-field" 
                  placeholder="••••••••" 
                  required 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              <input type="checkbox" id="remember" style={{ accentColor: 'var(--color-primary)' }} />
              <label htmlFor="remember" style={{ fontSize: '0.875rem' }}>Remember me for 30 days</label>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginBottom: '2rem' }}>
              Login to Portal
            </button>
          </form>

          <div style={{ textAlign: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              New to Freshlync? <a href="#" style={{ fontWeight: 600 }}>Request Access</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
