import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const TOOL_DATA: Record<string, { name: string; desc: string; color: string; content: string }> = {
  xavier: { name: 'XAVIER', desc: 'AI Research Engine', color: '#00ff88', content: 'Advanced AI-powered research synthesis engine. Analyze, synthesize, and extract insights from vast data sources.' },
  panthre: { name: 'PANTHRE', desc: 'Competitive Analysis', color: '#00ccff', content: 'Deep competitive intelligence platform. Track competitors, analyze positioning, and identify market gaps.' },
  soko: { name: 'SOKO', desc: 'Market Intelligence', color: '#ffcc00', content: 'Real-time market intelligence and trend analysis. Monitor emerging opportunities and market shifts.' },
  script: { name: 'SCRIPT', desc: 'Content Generator', color: '#ff88cc', content: 'AI-driven content generation engine. Create high-converting copy, scripts, and content at scale.' },
  quantus: { name: 'QUANTUS', desc: 'Financial Modeling', color: '#88ff00', content: 'Quantitative financial modeling and analysis. Build models, run scenarios, and forecast outcomes.' },
  nexus: { name: 'NEXUS', desc: 'Network Connector', color: '#ff8800', content: 'Network mapping and connection intelligence. Identify key connections and relationship pathways.' },
  cipher: { name: 'CIPHER', desc: 'Data Encryption', color: '#aa88ff', content: 'Enterprise-grade data encryption and security protocols. Protect sensitive information with military-grade security.' },
  oracle: { name: 'ORACLE', desc: 'Predictive Analytics', color: '#00ffcc', content: 'Predictive analytics engine powered by machine learning. Forecast trends and anticipate market movements.' },
  matrix: { name: 'MATRIX', desc: 'Data Visualization', color: '#ff4488', content: 'Advanced data visualization and dashboarding. Transform raw data into actionable visual insights.' },
  forge: { name: 'FORGE', desc: 'Product Builder', color: '#ffaa00', content: 'Product development and iteration framework. Build, test, and launch products with precision.' },
  vanguard: { name: 'VANGUARD', desc: 'Strategy Planner', color: '#00ff44', content: 'Strategic planning and execution framework. Map objectives, allocate resources, and drive outcomes.' },
  axiom: { name: 'AXIOM', desc: 'Logic Framework', color: '#cc00ff', content: 'Systematic logic and decision framework. Build rigorous decision trees and analytical structures.' },
  pulse: { name: 'PULSE', desc: 'Social Monitor', color: '#ff0088', content: 'Real-time social monitoring and sentiment analysis. Track brand mentions, trends, and audience signals.' },
  nova: { name: 'NOVA', desc: 'Launch Engine', color: '#00aaff', content: 'Product and campaign launch orchestration. Plan, coordinate, and execute high-impact launches.' },
};

const s: Record<string, React.CSSProperties> = {
  page: { background: '#000', color: '#fff', fontFamily: '"Courier New", monospace', minHeight: '100vh' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderBottom: '1px solid #0d0d0d' },
  back: { background: 'transparent', color: '#444', border: '1px solid #1a1a1a', padding: '0.5rem 1.25rem', fontFamily: '"Courier New", monospace', fontSize: '0.8rem', cursor: 'pointer' },
  logo: { fontSize: '1rem', fontWeight: 900, color: '#00ff88', letterSpacing: '0.1em' },
  hero: { padding: '4rem 2.5rem 2rem', maxWidth: '900px' },
  toolBadge: { fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' },
  toolTitle: { fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.5rem' },
  toolDesc: { color: '#555', fontSize: '1rem', marginBottom: '3rem' },
  interfaceArea: { margin: '0 2.5rem 3rem', border: '1px solid #0d0d0d', background: '#030303', minHeight: '400px', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  interfaceLabel: { color: '#222', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' },
  inputArea: { background: '#060606', border: '1px solid #111', padding: '1rem', minHeight: '120px', color: '#fff', fontFamily: '"Courier New", monospace', fontSize: '0.9rem', outline: 'none', resize: 'vertical', width: '100%', boxSizing: 'border-box' },
  runBtn: { background: '#00ff88', color: '#000', border: 'none', padding: '0.9rem 2.5rem', fontFamily: '"Courier New", monospace', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer', letterSpacing: '0.1em', alignSelf: 'flex-start' },
  outputArea: { background: '#060606', border: '1px solid #111', padding: '1.5rem', color: '#00ff88', fontSize: '0.85rem', lineHeight: 1.8, minHeight: '120px', whiteSpace: 'pre-wrap' },
  comingSoon: { color: '#222', fontSize: '0.8rem', letterSpacing: '0.1em', textAlign: 'center', padding: '3rem 0' },
};

const ToolPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [isRunning, setIsRunning] = React.useState(false);

  const tool = slug ? TOOL_DATA[slug.toLowerCase()] : null;

  if (!tool) {
    return (
      <div style={{ ...s.page, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ color: '#ff4444', fontSize: '1.5rem' }}>TOOL NOT FOUND</div>
        <button style={s.back} onClick={() => navigate('/dashboard')}>← BACK</button>
      </div>
    );
  }

  const handleRun = async () => {
    if (!input.trim()) return;
    setIsRunning(true);
    setOutput('');
    // Simulate tool processing (replace with real API call)
    await new Promise((r) => setTimeout(r, 1200));
    setOutput(`// ${tool.name} OUTPUT\n// Operator: ${user?.username}\n// ${new Date().toISOString()}\n\n[Processed input: "${input.slice(0, 50)}${input.length > 50 ? '...' : ''}"]\n\nTool integration pending. Connect your backend API endpoint to enable full ${tool.name} functionality.\n\n> Status: READY\n> Engine: v1.0.0`);
    setIsRunning(false);
  };

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <button style={s.back} onClick={() => navigate('/dashboard')}>← SYSTEM</button>
        <div style={s.logo}>ULTRIS 1</div>
        <span style={{ color: '#222', fontSize: '0.75rem' }}>{user?.username}</span>
      </nav>

      <div style={s.hero}>
        <div style={{ ...s.toolBadge, color: tool.color }}>// {tool.desc.toUpperCase()}</div>
        <div style={{ ...s.toolTitle, color: tool.color }}>{tool.name}</div>
        <div style={s.toolDesc}>{tool.content}</div>
      </div>

      <div style={s.interfaceArea}>
        <div>
          <div style={s.interfaceLabel}>// INPUT</div>
          <textarea
            style={s.inputArea}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Enter your query for ${tool.name}...`}
            rows={5}
          />
        </div>

        <button style={s.runBtn} onClick={handleRun} disabled={isRunning || !input.trim()}>
          {isRunning ? 'PROCESSING...' : `RUN ${tool.name} →`}
        </button>

        {output && (
          <div>
            <div style={s.interfaceLabel}>// OUTPUT</div>
            <div style={s.outputArea}>{output}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolPage;
