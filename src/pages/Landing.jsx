import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, BarChart2, ShieldCheck, Map, Users } from 'lucide-react';
import SEO from '../components/SEO';

export default function Landing() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    currentTarget.style.setProperty('--mouse-x', `${clientX - left}px`);
    currentTarget.style.setProperty('--mouse-y', `${clientY - top}px`);
  };

  return (
    <div style={{ fontFamily: 'var(--font-sans)', minHeight: '100vh', background: 'var(--color-surface)' }}>
      <SEO title="Home" />
      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 4rem', position: 'absolute', width: '100%', zIndex: 10, color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ background: 'white', color: 'var(--color-primary)', padding: '0.25rem', borderRadius: '4px' }}>
            <Leaf size={24} />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Freshlync</span>
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontWeight: 500 }}>
          <a href="#" style={{ color: 'white' }}>Fish</a>
          <a href="#" style={{ color: 'white' }}>Meat</a>
          <a href="#" style={{ color: 'white' }}>Vegetables</a>
          <button onClick={() => navigate('/login')} style={{ background: 'white', color: 'var(--color-primary)', padding: '0.5rem 1.5rem', borderRadius: '999px', fontWeight: 600 }}>Login</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ height: '100vh', backgroundImage: 'url(https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', display: 'flex', alignItems: 'center', padding: '0 4rem', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(21, 128, 61, 0.9) 0%, rgba(21, 128, 61, 0.4) 100%)' }}></div>
        
        {/* Floating Interactive Food Elements with Parallax */}
        <div style={{ position: 'absolute', top: '5%', right: '5%', zIndex: 2, transform: `translateY(${scrollY * -0.15}px)` }}>
          <div className="floating-element" style={{ width: '300px', height: '300px', animation: 'float-slow 6s ease-in-out infinite' }}>
            <img src="/images/floating/salmon.png" alt="Fresh Salmon" style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))' }} />
          </div>
        </div>
        
        <div style={{ position: 'absolute', top: '30%', right: '25%', zIndex: 2, transform: `translateY(${scrollY * -0.3}px)` }}>
          <div className="floating-element" style={{ width: '220px', height: '220px', animation: 'float-medium 7s ease-in-out infinite 1s' }}>
            <img src="/images/floating/broccoli.png" alt="Fresh Broccoli" style={{ filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.25))' }} />
          </div>
        </div>
        
        <div style={{ position: 'absolute', top: '70%', right: '10%', zIndex: 2, transform: `translateY(${scrollY * -0.25}px)` }}>
          <div className="floating-element" style={{ width: '260px', height: '260px', animation: 'float-fast 8s ease-in-out infinite 0.5s' }}>
            <img src="/images/floating/strawberry.png" alt="Fresh Strawberry" style={{ filter: 'drop-shadow(0 18px 28px rgba(0,0,0,0.3))' }} />
          </div>
        </div>
        
        <div style={{ position: 'absolute', top: '50%', right: '40%', zIndex: 2, transform: `translateY(${scrollY * -0.4}px)` }}>
          <div className="floating-element" style={{ width: '200px', height: '200px', animation: 'float-slow 5s ease-in-out infinite 2s' }}>
            <img src="/images/floating/carrot.png" alt="Fresh Carrot" style={{ filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.2))' }} />
          </div>
        </div>
        
        <div style={{ position: 'absolute', top: '85%', right: '30%', zIndex: 2, transform: `translateY(${scrollY * -0.2}px)` }}>
          <div className="floating-element" style={{ width: '240px', height: '240px', animation: 'float-medium 9s ease-in-out infinite 1.5s' }}>
            <img src="/images/floating/lemon.png" alt="Fresh Lemon" style={{ filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.25))' }} />
          </div>
        </div>
        
        <div style={{ position: 'absolute', top: '5%', right: '45%', zIndex: 2, transform: `translateY(${scrollY * -0.35}px)` }}>
          <div className="floating-element" style={{ width: '180px', height: '180px', animation: 'float-fast 6.5s ease-in-out infinite 0.2s' }}>
            <img src="/images/floating/apple.png" alt="Fresh Apple" style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))' }} />
          </div>
        </div>
        
        <div style={{ position: 'relative', zIndex: 3, color: 'white', maxWidth: '800px' }}>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Smart Distribution,<br/><span style={{ color: '#86efac' }}>Fresh Connection</span>
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '2.5rem', maxWidth: '600px', lineHeight: 1.6 }}>
            Optimizing the journey from farm and sea to table. Synchronized intelligence and sustainable logistics for premium fish, meat, and vegetables.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => navigate('/login')} className="btn-primary" style={{ background: 'white', color: 'var(--color-primary)', padding: '1rem 2rem', fontSize: '1.125rem' }}>Get Started</button>
            <button className="btn-secondary" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '1rem 2rem', fontSize: '1.125rem' }}>View Demo</button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '6rem 4rem', background: 'var(--color-background)' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Synchronized Intelligence</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>Empowering your supply chain with advanced telemetry and predictive analytics.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div className="card spotlight-card" onMouseMove={handleMouseMove} style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <BarChart2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Real-time Analytics</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>Monitor inventory levels and market prices dynamically across all regions.</p>
          </div>
          <div className="card spotlight-card" onMouseMove={handleMouseMove} style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#DBEAFE', color: '#1E40AF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <ShieldCheck size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Temp-Guard Monitoring</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>End-to-end cold chain tracking to ensure your fish, meat, and vegetables arrive at peak freshness.</p>
          </div>
          <div className="card spotlight-card" onMouseMove={handleMouseMove} style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Map size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Smart Logistics</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>AI-driven route optimization reduces fuel consumption and delivery times.</p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ padding: '6rem 4rem', background: 'var(--color-secondary)', color: 'white', textAlign: 'center' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Ready to synchronize your supply chain?</h2>
        <p style={{ fontSize: '1.125rem', opacity: 0.8, marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>Join thousands of suppliers, retailers, and logistics providers already using Freshlync.</p>
        <button onClick={() => navigate('/login')} className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.125rem' }}>Join the Network</button>
      </section>
    </div>
  );
}
