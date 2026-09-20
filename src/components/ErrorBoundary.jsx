import React from 'react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled React Error Boundary Catch:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: '2rem',
          background: '#F8FAFC', fontFamily: 'var(--font-sans)', textAlign: 'center'
        }}>
          <div style={{
            background: 'white', padding: '2.5rem', borderRadius: 16,
            maxWidth: 480, width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center'
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: '#FEF2F2',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem'
            }}>
              <AlertTriangle size={28} style={{ color: '#EF4444' }} />
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
              Something went wrong
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              The application encountered a transient error during rendering. Reloading usually resolves this.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
              <button
                onClick={this.handleReload}
                style={{
                  flex: 1, padding: '0.75rem', borderRadius: 8, background: '#047857',
                  color: 'white', border: 'none', fontWeight: 700, fontSize: '0.875rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
                }}
              >
                <RefreshCw size={16} /> Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                style={{
                  padding: '0.75rem 1rem', borderRadius: 8, background: '#F1F5F9',
                  color: '#334155', border: '1px solid #CBD5E1', fontWeight: 600, fontSize: '0.875rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
                }}
              >
                <Home size={16} /> Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
