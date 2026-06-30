import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toolsApi } from '../api/tools';
import { toast } from 'react-hot-toast';
import type { Tool } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const s: Record<string, React.CSSProperties> = {
  page: { background: '#000', color: '#fff', fontFamily: '"Courier New", monospace', minHeight: '100vh' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderBottom: '1px solid #0d0d0d', position: 'sticky', top: 0, background: '#000', zIndex: 100 },
  navLeft: { display: 'flex', alignItems: 'center', gap: '2rem' },
  logo: { fontSize: '1.1rem', fontWeight: 900, color: '#00ff88', letterSpacing: '0.1em', textDecoration: 'none' },
  navRight: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
  userInfo: { color: '#555', fontSize: '0.8rem' },
  tierBadge: { background: '#001a0d', border: '1px solid #00ff88', color: '#00ff88', padding: '0.2rem 0.6rem', fontSize: '0.7rem', letterSpacing: '0.1em' },
  logoutBtn: { background: 'transparent', color: '#444', border: '1px solid #222', padding: '0.4rem 1rem', fontFamily: '"Courier New", monospace', fontSize: '0.75rem', cursor: 'pointer', letterSpacing: '0.05em' },
  content: { padding: '2rem 2.5rem', maxWidth: '1400px', margin: '0 auto' },
  greeting: { marginBottom: '2.5rem' },
  greetingLabel: { color: '#333', fontSize: '0.75rem', letterSpacing: '0.1em', marginBottom: '0.5rem' },
  greetingName: { fontSize: '1.8rem', fontWeight: 900 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '3rem' },
  statCard: { background: '#050505', border: '1px solid #0d0d0d', padding: '1.25rem' },
  statLabel: { color: '#333', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' },
  statValue: { fontSize: '1.5rem', fontWeight: 900, color: '#00ff88' },
  sectionTitle: { fontSize: '0.75rem', letterSpacing: '0.2em', color: '#333', textTransform: 'uppercase', marginBottom: '1.25rem' },
  toolsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' },
  toolCard: { background: '#050505', border: '1px solid #0d0d0d', padding: '1.5rem', cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s', position: 'relative', overflow: 'hidden' },
  toolCardLocked: { opacity: 0.4, cursor: 'not-allowed' },
  toolCardAccess: { borderColor: '#0d2010' },
  toolName: { fontSize: '0.9rem', fontWeight: 900, letterSpacing: '0.1em', color: '#00ff88', marginBottom: '0.4rem' },
  toolDesc: { color: '#444', fontSize: '0.75rem', lineHeight: 1.5 },
  toolTier: { position: 'absolute', top: '0.75rem', right: '0.75rem', fontSize: '0.6rem', color: '#222', letterSpacing: '0.05em' },
  lockIcon: { position: 'absolute', bottom: '0.75rem', right: '0.75rem', color: '#222', fontSize: '0.9rem' },
  loadingCenter: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 0' },
  upgradeBar: { background: '#001a0d', border: '1px solid #004422', padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
  upgradeText: { color: '#00ff88', fontSize: '0.85rem' },
  upgradeBtn: { background: '#00ff88', color: '#000', border: 'none', padding: '0.5rem 1.5rem', fontFamily: '"Courier New", monospace', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer', letterSpacing: '0.05em' },
};

const TOOL_DESCRIPTIONS: Record<string, string> = {
  xavier: 'AI Research Engine', panthre: 'Competitive Analysis', soko: 'Market Intelligence',
  script: 'Content Generator', quantus: 'Financial Modeling', nexus: 'Network Connector',
  cipher: 'Data Encryption', oracle: 'Predictive Analytics', matrix: 'Data Visualization',
  forge: 'Product Builder', vanguard: 'Strategy Planner', axiom: 'Logic Framework',
  pulse: 'Social Monitor', nova: 'Launch Engine',
};

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoadingTools, setIsLoadingTools] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const res = await toolsApi.getAll();
        if (res.data?.tools) setTools(res.data.tools);
      } catch {
        // Use fallback tools if API unavailable
        setTools(Object.entries(TOOL_DESCRIPTIONS).map(([slug, desc], i) => ({
          id: slug,
          name: slug.toUpperCase(),
          slug,
          displayName: slug.toUpperCase(),
          description: desc,
          category: 'ai' as const,
          requiredTier: i < 3 ? 'free' : i < 8 ? 'coss' : 'elite',
          isActive: true,
          isFeatured: i < 3,
          version: '1.0.0',
          usageCount: 0,
          avgRating: 0,
          tags: [],
          hasAccess: i < 3,
        })));
      } finally {
        setIsLoadingTools(false);
      }
    };
    fetchTools();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out');
      navigate('/', { replace: true });
    } catch {
      navigate('/', { replace: true });
    }
  };

  const handleToolClick = (tool: Tool) => {
    if (!tool.hasAccess) {
      toast.error(`Upgrade to ${tool.requiredTier.toUpperCase()} to access ${tool.name}`);
      return;
    }
    navigate(`/tool/${tool.slug}`);
  };

  const tierOrder = ['free', 'coss', 'elite', 'founder'];
  const userTierIndex = tierOrder.indexOf(user?.tier || 'free');
  const accessibleTools = tools.filter((t) => tierOrder.indexOf(t.requiredTier) <= userTierIndex);
  const showUpgradeBanner = user?.tier !== 'founder';

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.navLeft}>
          <Link to="/" style={s.logo}>ULTRIS 1</Link>
          <span style={{ color: '#222', fontSize: '0.75rem' }}>// SYSTEM</span>
        </div>
        <div style={s.navRight}>
          <span style={s.userInfo}>{user?.username}</span>
          <span style={s.tierBadge}>{user?.tier?.toUpperCase()}</span>
          <button style={s.logoutBtn} onClick={handleLogout}>LOGOUT</button>
        </div>
      </nav>

      <div style={s.content}>
        <div style={s.greeting}>
          <div style={s.greetingLabel}>// WELCOME BACK</div>
          <div style={s.greetingName}>{user?.profile?.displayName || user?.username}</div>
        </div>

        {showUpgradeBanner && (
          <div style={s.upgradeBar}>
            <span style={s.upgradeText}>⚡ Unlock more tools — upgrade your tier</span>
            <button style={s.upgradeBtn} onClick={() => navigate('/#pricing')}>UPGRADE NOW</button>
          </div>
        )}

        <div style={s.statsRow}>
          <div style={s.statCard}>
            <div style={s.statLabel}>TOOLS AVAILABLE</div>
            <div style={s.statValue}>{accessibleTools.length}/{tools.length}</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statLabel}>CURRENT TIER</div>
            <div style={s.statValue}>{user?.tier?.toUpperCase()}</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statLabel}>MEMBER SINCE</div>
            <div style={{ ...s.statValue, fontSize: '0.95rem' }}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}
            </div>
          </div>
          <div style={s.statCard}>
            <div style={s.statLabel}>ROLE</div>
            <div style={s.statValue}>{user?.role?.toUpperCase()}</div>
          </div>
        </div>

        <div style={s.sectionTitle}>// THE ARSENAL — CHOOSE YOUR WEAPON</div>

        {isLoadingTools ? (
          <div style={s.loadingCenter}>
            <LoadingSpinner message="LOADING ARSENAL..." />
          </div>
        ) : (
          <div style={s.toolsGrid}>
            {tools.map((tool) => (
              <div
                key={tool.id}
                style={{
                  ...s.toolCard,
                  ...(tool.hasAccess ? s.toolCardAccess : s.toolCardLocked),
                }}
                onClick={() => handleToolClick(tool)}
              >
                <div style={s.toolName}>{tool.name}</div>
                <div style={s.toolDesc}>{tool.description || TOOL_DESCRIPTIONS[tool.slug] || ''}</div>
                <div style={s.toolTier}>{tool.requiredTier}</div>
                {!tool.hasAccess && <div style={s.lockIcon}>🔒</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
