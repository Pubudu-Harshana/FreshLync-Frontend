import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  MapPinned,
  Package2,
  ShieldCheck,
  Users,
} from 'lucide-react';
import SEO from '../components/SEO';

const featureItems = [
  {
    icon: Package2,
    title: 'Live inventory control',
    description: 'Track stock, batches, and order readiness in one clean workspace.',
  },
  {
    icon: ShieldCheck,
    title: 'Cold-chain confidence',
    description: 'Keep quality visible from dispatch to doorstep with monitored handoffs.',
  },
  {
    icon: BarChart3,
    title: 'Smarter decisions',
    description: 'Turn daily movement data into forecasting, planning, and better margins.',
  },
];

const processItems = [
  {
    title: 'Order',
    description: 'Suppliers and buyers stay aligned through a simple, transparent order flow.',
  },
  {
    title: 'Dispatch',
    description: 'Lorries and routes are coordinated with clear timing and live updates.',
  },
  {
    title: 'Deliver',
    description: 'Every stop is visible so fresh products arrive on time and in peak condition.',
  },
];

const trustPoints = ['Fresh produce', 'Meat & seafood', 'Route visibility', 'Team access'];

export default function Landing() {
  const navigate = useNavigate();

  const handleJumpTo = (targetId) => (event) => {
    event.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="landing-page">
      <SEO title="Home" />
      <header className="landing-header">
        <nav className="landing-nav">
          <a className="brand-mark" href="#top" onClick={handleJumpTo('top')}>
            <img src="/newlogo.png" alt="FreshLync" className="brand-logo" />
          </a>
          <div className="landing-nav-links">
            <a href="#top" onClick={handleJumpTo('top')}>Home</a>
            <a href="#about" onClick={handleJumpTo('about')}>About</a>
            <a href="#contact" onClick={handleJumpTo('contact')}>Contact</a>
          </div>
          <button className="nav-login-button" onClick={() => navigate('/login')}>
            Login
          </button>
        </nav>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              Smart distribution. Fresh connection.
            </div>
            <h1>
              Move fresh goods with a brand that feels fast, clean, and dependable.
            </h1>
            <p className="hero-description">
              FreshLync keeps suppliers, intermediaries, and buyers aligned with a modern
              distribution flow built around live routing, inventory visibility, and a brand
              palette inspired by the new logo.
            </p>

            <div className="hero-actions">
              <button className="primary-action" onClick={() => navigate('/login')}>
                Get started
                <ArrowRight size={18} />
              </button>
              <a className="secondary-action" href="#about" onClick={handleJumpTo('about')}>
                Explore the platform
              </a>
            </div>

            <div className="trust-row" aria-label="Platform highlights">
              {trustPoints.map((item) => (
                <span key={item} className="trust-pill">
                  <CheckCircle2 size={14} />
                  {item}
                </span>
              ))}
            </div>

            <div className="hero-stats">
              <article>
                <strong>Live</strong>
                <span>dispatch visibility</span>
              </article>
              <article>
                <strong>24/7</strong>
                <span>shipment tracking</span>
              </article>
              <article>
                <strong>Faster</strong>
                <span>route coordination</span>
              </article>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="brand-panel">
              <div className="brand-panel-top">
                <img src="/newlogo.png" alt="FreshLync logo" />
              </div>

              <div className="lorry-scene">
                <div className="lorry-cloud lorry-cloud-one" />
                <div className="lorry-cloud lorry-cloud-two" />
                <div className="lorry-road" />
                <div className="lorry-track-line lorry-track-line-one" />
                <div className="lorry-track-line lorry-track-line-two" />
                <div className="lorry-track-line lorry-track-line-three" />

                <div className="lorry-wrap">
                  <div className="lorry-motion-lines">
                    <span />
                    <span />
                    <span />
                  </div>

                  <div className="lorry-body">
                    <div className="lorry-cargo">
                      <span className="cargo-badge cargo-badge-green">
                        <Package2 size={14} />
                      </span>
                      <span className="cargo-badge cargo-badge-slate">
                        <Users size={14} />
                      </span>
                      <span className="cargo-badge cargo-badge-coral">
                        <ShieldCheck size={14} />
                      </span>
                    </div>

                    <div className="lorry-cab">
                      <div className="lorry-window" />
                      <div className="lorry-door-line" />
                      <div className="lorry-headlight" />
                    </div>

                    <div className="lorry-hitch" />
                    <div className="lorry-wheels">
                      <span className="wheel wheel-left" />
                      <span className="wheel wheel-right" />
                    </div>
                  </div>

                  <div className="lorry-route-card lorry-route-card-top">
                    <Clock3 size={16} />
                    <span>Live ETA sync</span>
                  </div>
                  <div className="lorry-route-card lorry-route-card-bottom">
                    <MapPinned size={16} />
                    <span>Fresh route updates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section landing-section-muted" id="about">
          <div className="section-heading">
            <span className="section-kicker">Why it works</span>
            <h2>Designed for a distribution business that needs clarity, speed, and trust.</h2>
            <p>
              The interface uses the logo’s navy, green, and coral palette to create a clean
              distribution brand that feels modern without becoming busy.
            </p>
          </div>

          <div className="feature-grid">
            {featureItems.map(({ icon: Icon, title, description }) => (
              <article key={title} className="feature-card">
                <div className="feature-icon">
                  <Icon size={22} />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section">
          <div className="split-content">
            <div className="split-copy">
              <span className="section-kicker">Flow</span>
              <h2>Simple order movement from supplier to delivery lorry.</h2>
              <p>
                Keep the experience focused: one brand story, one clear route, and a visual system
                that makes the movement of goods easy to understand at a glance.
              </p>
            </div>

            <div className="process-list">
              {processItems.map((item, index) => (
                <article key={item.title} className="process-item">
                  <div className="process-step">0{index + 1}</div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <footer className="landing-footer" id="contact">
          <div className="landing-footer-brand">
            <img src="/newlogo.png" alt="FreshLync" className="footer-logo" />
            <p>
              Smart distribution. Fresh connection. Built for teams that want clearer delivery
              flow, stronger visibility, and a cleaner brand presence.
            </p>
          </div>

          <div className="landing-footer-links" aria-label="Footer navigation">
            <a href="#top" onClick={handleJumpTo('top')}>Home</a>
            <a href="#about" onClick={handleJumpTo('about')}>About</a>
            <button type="button" onClick={() => navigate('/login')}>Login</button>
          </div>

          <div className="landing-footer-meta">
            <span>FreshLync</span>
            <span>Smart distribution for fresh supply chains</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
