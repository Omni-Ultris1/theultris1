import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface Message {
  id: string;
  user: string;
  tier: string;
  text: string;
  timestamp: Date;
}

const s: Record<string, React.CSSProperties> = {
  page: { background: '#000', color: '#fff', fontFamily: '"Courier New", monospace', height: '100vh', display: 'flex', flexDirection: 'column' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderBottom: '1px solid #0d0d0d', flexShrink: 0 },
  back: { background: 'transparent', color: '#444', border: '1px solid #1a1a1a', padding: '0.4rem 1rem', fontFamily: '"Courier New", monospace', fontSize: '0.75rem', cursor: 'pointer' },
  title: { fontSize: '1rem', fontWeight: 900, color: '#00ff88', letterSpacing: '0.1em' },
  onlineCount: { color: '#333', fontSize: '0.75rem' },
  messagesArea: { flex: 1, overflowY: 'auto', padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  message: { display: 'flex', gap: '1rem', alignItems: 'flex-start' },
  msgMeta: { minWidth: '120px', flexShrink: 0 },
  msgUser: { fontSize: '0.75rem', fontWeight: 'bold', color: '#00ff88' },
  msgTier: { fontSize: '0.6rem', color: '#333', letterSpacing: '0.05em' },
  msgTime: { fontSize: '0.6rem', color: '#222' },
  msgText: { color: '#888', fontSize: '0.85rem', lineHeight: 1.5, paddingTop: '0.1rem' },
  inputArea: { borderTop: '1px solid #0d0d0d', padding: '1rem 2rem', display: 'flex', gap: '1rem', flexShrink: 0 },
  input: { flex: 1, background: '#050505', border: '1px solid #111', color: '#fff', padding: '0.75rem 1rem', fontFamily: '"Courier New", monospace', fontSize: '0.9rem', outline: 'none' },
  sendBtn: { background: '#00ff88', color: '#000', border: 'none', padding: '0.75rem 1.5rem', fontFamily: '"Courier New", monospace', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', letterSpacing: '0.05em', whiteSpace: 'nowrap' },
};

const SEED_MESSAGES: Message[] = [
  { id: '1', user: 'OMNI', tier: 'FOUNDER', text: 'Welcome to ULTRICOM 1//. This is where operators connect.', timestamp: new Date(Date.now() - 3600000) },
  { id: '2', user: 'AXIOM_X', tier: 'ELITE', text: 'Running XAVIER for market research right now. Results are insane.', timestamp: new Date(Date.now() - 1800000) },
  { id: '3', user: 'NOVA_7', tier: 'COSS', text: 'QUANTUS model just predicted Q1 numbers within 2% margin. 🔥', timestamp: new Date(Date.now() - 900000) },
  { id: '4', user: 'FORGE_OPS', tier: 'ELITE', text: 'Anyone using VANGUARD for strategic planning? Drop your workflow.', timestamp: new Date(Date.now() - 300000) },
];

const TIER_COLORS: Record<string, string> = {
  FOUNDER: '#ffaa00',
  ELITE: '#00ff88',
  COSS: '#00ccff',
  FREE: '#555',
};

const UltricomPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !user) return;
    const msg: Message = {
      id: Date.now().toString(),
      user: user.username.toUpperCase(),
      tier: user.tier.toUpperCase(),
      text: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, msg]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <button style={s.back} onClick={() => navigate('/dashboard')}>← SYSTEM</button>
        <div style={s.title}>ULTRICOM 1//</div>
        <div style={s.onlineCount}>⚡ {Math.floor(Math.random() * 20) + 10} operators online</div>
      </nav>

      <div style={s.messagesArea}>
        {messages.map((msg) => (
          <div key={msg.id} style={s.message}>
            <div style={s.msgMeta}>
              <div style={{ ...s.msgUser, color: TIER_COLORS[msg.tier] || '#555' }}>{msg.user}</div>
              <div style={s.msgTier}>{msg.tier}</div>
              <div style={s.msgTime}>{formatTime(msg.timestamp)}</div>
            </div>
            <div style={s.msgText}>{msg.text}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={s.inputArea}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={s.input}
          placeholder="Send a message to the crew..."
          maxLength={500}
        />
        <button style={s.sendBtn} onClick={handleSend} disabled={!input.trim()}>
          SEND →
        </button>
      </div>
    </div>
  );
};

export default UltricomPage;
