import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import SEO from '../../components/SEO';
import { useAuth } from '../../context/AuthContext';

const DUMMY_CREDENTIALS = [
  { role: 'Customer', email: 'customer@freshlync.com', password: 'Customer@123', icon: User, color: '#3b82f6' },
  { role: 'Supplier', email: 'supplier@freshlync.com', password: 'Supplier@123', icon: Truck, color: '#10b981' },
  { role: 'Admin', email: 'admin@freshlync.com', password: 'Admin@1234', icon: ShieldCheck, color: '#8b5cf6' },
];

export default function Login() {
  const navigate   = useNavigate();
  const { login }  = useAuth();
  const [role, setRole]           = useState('Customer');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'buyer')    navigate('/marketplace');
      else if (user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFill = (cred) => {
    setRole(cred.role);
    setEmail(cred.email);
    setPassword(cred.password);
  };

  return (
    <div className="split-layout" style={{ fontFamily: 'var(--font-sans)' }}>
      <SEO title="Login" />
      {/* Left Side - Banner */}
      <div className="split-left" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000)' }}>
        <div className="split-left-content">
          <div style={{ marginBottom: '4rem' }}>
            <img src="/newlogo.png" alt="Freshlync logo" style={{ height: '80px', width: 'auto', display: 'block' }} />
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
          <button 
            type="button"
            onClick={() => navigate('/')} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', marginBottom: '2rem', fontWeight: 500, padding: 0 }}
          >
            <ArrowLeft size={18} /> Back to Home
          </button>

          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>Access your supply chain dashboard</p>
          </div>



          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Account Type</label>
              <div style={{ display: 'flex', background: 'var(--color-background)', borderRadius: '8px', padding: '0.25rem' }}>
                {['Customer', 'Supplier'].map(r => (
                  <button 
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      borderRadius: '6px',
                      fontWeight: 500,
                      background: role === r ? 'white' : 'transparent',
                      boxShadow: role === r ? 'var(--shadow-sm)' : 'none',
                      color: role === r ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Email Address</label>
              <input 
                type="email" 
                className="input-field" 
                placeholder="name@freshlync.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-primary)', textDecoration: 'none' }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="input-field" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {error && (
              <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.875rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}
            <button type="submit" className="btn-primary" style={{ width: '100%', marginBottom: '2rem', opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? 'Signing in...' : 'Login to Portal'}
            </button>
          </form>

          {/* Dummy Credentials Panel */}
          <div style={{ 
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0f9ff 100%)', 
            borderRadius: '12px', 
            padding: '1.25rem', 
            marginBottom: '1.5rem',
            border: '1px dashed var(--color-primary)',
          }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', textAlign: 'center' }}>
              🔑 Demo Credentials — Click to auto-fill
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {DUMMY_CREDENTIALS.map((cred) => {
                const Icon = cred.icon;
                return (
                  <button
                    key={cred.role}
                    type="button"
                    onClick={() => handleAutoFill(cred)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.625rem 0.875rem',
                      borderRadius: '8px',
                      background: role === cred.role ? 'white' : 'rgba(255,255,255,0.6)',
                      border: role === cred.role ? `2px solid ${cred.color}` : '1px solid rgba(0,0,0,0.06)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: role === cred.role ? `0 2px 8px ${cred.color}22` : 'none',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: `${cred.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon size={16} style={{ color: cred.color }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: cred.color, marginBottom: '0.125rem' }}>{cred.role}</div>
                      <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{cred.email} / {cred.password}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ textAlign: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              New to Freshlync? <Link to="/register" style={{ fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>Request Access</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
