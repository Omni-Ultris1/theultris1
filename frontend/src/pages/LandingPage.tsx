import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const styles: Record<string, React.CSSProperties> = {
  page: { background: '#000', color: '#fff', fontFamily: '"Courier New", monospace', minHeight: '100vh' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 3rem', borderBottom: '1px solid #111' },
  logo: { fontSize: '1.5rem', fontWeight: 'bold', color: '#00ff88', textDecoration: 'none', letterSpacing: '0.1em' },
  navLinks: { display: 'flex', gap: '2rem', alignItems: 'center' },
  navLink: { color: '#888', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '0.05em' },
  hero: { textAlign: 'center', padding: '8rem 2rem 4rem', maxWidth: '900px', margin: '0 auto' },
  badge: { display: 'inline-block', background: '#001a0d', border: '1px solid #00ff88', color: '#00ff88', padding: '0.3rem 1rem', fontSize: '0.75rem', letterSpacing: '0.15em', marginBottom: '2rem', textTransform: 'uppercase' },
  title: { fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, lineHeight: 1.05, marginBottom: '1.5rem', letterSpacing: '-0.02em' },
  titleAccent: { color: '#00ff88' },
  subtitle: { fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.7 },
  ctaRow: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  ctaPrimary: { background: '#00ff88', color: '#000', border: 'none', padding: '1rem 2.5rem', fontFamily: '"Courier New", monospace', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer', letterSpacing: '0.1em', textDecoration: 'none', display: 'inline-block', transition: 'transform 0.1s' },
  ctaSecondary: { background: 'transparent', color: '#00ff88', border: '1px solid #00ff88', padding: '1rem 2.5rem', fontFamily: '"Courier New", monospace', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer', letterSpacing: '0.1em', textDecoration: 'none', display: 'inline-block' },
  section: { padding: '5rem 3rem', maxWidth: '1200px', margin: '0 auto' },
  sectionLabel: { color: '#00ff88', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' },
  sectionTitle: { fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' },
  tiersGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginTop: '3rem' },
  tierCard: { border: '1px solid #1a1a1a', padding: '2rem', background: '#050505', transition: 'border-color 0.2s' },
  tierCardFeatured: { border: '1px solid #00ff88', background: '#001a0d' },
  tierName: { fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' },
  tierPrice: { fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.25rem' },
  tierPriceSub: { color: '#555', fontSize: '0.85rem', marginBottom: '1.5rem' },
  tierFeature: { color: '#888', fontSize: '0.85rem', marginBottom: '0.5rem', paddingLeft: '1.2rem', position: 'relative' },
  toolsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginTop: '2rem' },
  toolCard: { background: '#050505', border: '1px solid #111', padding: '1.5rem', cursor: 'pointer', transition: 'border-color 0.2s' },
  toolName: { fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '0.1em', color: '#00ff88' },
  toolDesc: { fontSize: '0.75rem', color: '#555', marginTop: '0.5rem', lineHeight: 1.5 },
  footer: { borderTop: '1px solid #111', padding: '2rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
  footerText: { color: '#333', fontSize: '0.8rem' },
};

const TIERS = [
  { name: 'FREE', price: '$0', period: '/forever', features: ['Access to 3 core tools', 'Community support', 'Basic analytics'], featured: false },
  { name: 'COSS', price: '$29', period: '/month', features: ['Access to 8 tools', 'Priority support', 'Full analytics', 'API access (100 calls/mo)'], featured: false },
  { name: 'ELITE', price: '$97', period: '/month', features: ['Access to all 14 tools', '24/7 support', 'Advanced analytics', 'API access (1000 calls/mo)', 'ULTRICOM community'], featured: true },
  { name: 'FOUNDER', price: '$497', period: '/lifetime', features: ['Everything in Elite', 'Lifetime access', 'Founder badge', 'Direct team access', 'Early feature access', 'Unlimited API calls'], featured: false },
];

const TOOLS = [
  { name: 'XAVIER', desc: 'AI Research Engine' },
  { name: 'PANTHRE', desc: 'Competitive Analysis' },
  { name: 'SOKO', desc: 'Market Intelligence' },
  { name: 'SCRIPT', desc: 'Content Generator' },
  { name: 'QUANTUS', desc: 'Financial Modeling' },
  { name: 'NEXUS', desc: 'Network Connector' },
  { name: 'CIPHER', desc: 'Data Encryption' },
  { name: 'ORACLE', desc: 'Predictive Analytics' },
  { name: 'MATRIX', desc: 'Data Visualization' },
  { name: 'FORGE', desc: 'Product Builder' },
  { name: 'VANGUARD', desc: 'Strategy Planner' },
  { name: 'AXIOM', desc: 'Logic Framework' },
  { name: 'PULSE', desc: 'Social Monitor' },
  { name: 'NOVA', desc: 'Launch Engine' },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [_hovered, setHovered] = useState<string | null>(null);

  return (
    <div style={styles.page}>
      {/* Nav */}
      <nav style={styles.nav}>
        <Link to="/" style={styles.logo}>ULTRIS 1</Link>
        <div style={styles.navLinks}>
          <Link to="/login" style={styles.navLink}>LOGIN</Link>
          <Link to="/register" style={{ ...styles.ctaPrimary, padding: '0.6rem 1.5rem', fontSize: '0.8rem' }}>GET ACCESS</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.badge}>⚡ Operate at the Edge</div>
        <h1 style={styles.title}>
          The Operating System<br />for <span style={styles.titleAccent}>High-Performance</span><br />Operators
        </h1>
        <p style={styles.subtitle}>
          14 precision tools. One unified system. Built for founders, analysts,
          and operators who move fast and break ceilings.
        </p>
        <div style={styles.ctaRow}>
          <button style={styles.ctaPrimary} onClick={() => navigate('/register')}>
            START FREE →
          </button>
          <button style={styles.ctaSecondary} onClick={() => navigate('/login')}>
            LOG IN
          </button>
        </div>
      </section>

      {/* Tools */}
      <section style={styles.section}>
        <div style={styles.sectionLabel}>// THE ARSENAL</div>
        <h2 style={styles.sectionTitle}>14 Precision Tools</h2>
        <p style={{ color: '#555', fontSize: '0.9rem' }}>Each tool engineered for a specific operational domain.</p>
        <div style={styles.toolsGrid}>
          {TOOLS.map((t) => (
            <div
              key={t.name}
              style={{ ...styles.toolCard, borderColor: _hovered === t.name ? '#00ff88' : '#111' }}
              onMouseEnter={() => setHovered(t.name)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={styles.toolName}>{t.name}</div>
              <div style={styles.toolDesc}>{t.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tiers */}
      <section style={styles.section}>
        <div style={styles.sectionLabel}>// PRICING</div>
        <h2 style={styles.sectionTitle}>Choose Your Level</h2>
        <div style={styles.tiersGrid}>
          {TIERS.map((tier) => (
            <div key={tier.name} style={tier.featured ? { ...styles.tierCard, ...styles.tierCardFeatured } : styles.tierCard}>
              <div style={{ ...styles.tierName, color: tier.featured ? '#00ff88' : '#fff' }}>{tier.name}</div>
              <div style={styles.tierPrice}>{tier.price}</div>
              <div style={styles.tierPriceSub}>{tier.period}</div>
              {tier.features.map((f) => (
                <div key={f} style={styles.tierFeature}>• {f}</div>
              ))}
              <button
                style={{ ...styles.ctaPrimary, width: '100%', marginTop: '1.5rem', textAlign: 'center', background: tier.featured ? '#00ff88' : 'transparent', color: tier.featured ? '#000' : '#00ff88', border: '1px solid #00ff88' }}
                onClick={() => navigate('/register')}
              >
                {tier.name === 'FREE' ? 'START FREE' : `GET ${tier.name}`}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ULTRICOM */}
      <section style={{ ...styles.section, textAlign: 'center', borderTop: '1px solid #0a0a0a' }}>
        <div style={styles.sectionLabel}>// ULTRICOM 1//</div>
        <h2 style={styles.sectionTitle}>The Crew</h2>
        <p style={{ color: '#555', maxWidth: '500px', margin: '0 auto 2rem', fontSize: '0.9rem', lineHeight: 1.7 }}>
          Connect with other high-performance operators. Share insights. Build together. ULTRICOM is the community layer of ULTRIS 1.
        </p>
        <button style={styles.ctaSecondary} onClick={() => navigate('/register')}>
          JOIN THE CREW
        </button>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <span style={styles.footerText}>© 2024 ULTRIS 1. All rights reserved.</span>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a href="#" style={{ ...styles.footerText, textDecoration: 'none' }}>Privacy</a>
          <a href="#" style={{ ...styles.footerText, textDecoration: 'none' }}>Terms</a>
          <a href="mailto:support@ultris1.com" style={{ ...styles.footerText, textDecoration: 'none' }}>Support</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
