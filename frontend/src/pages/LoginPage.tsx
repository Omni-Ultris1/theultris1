import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import type { AxiosError } from 'axios';

interface ApiError {
  message?: string;
}

const s: Record<string, React.CSSProperties> = {
  page: { background: '#000', color: '#fff', fontFamily: '"Courier New", monospace', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  card: { background: '#050505', border: '1px solid #1a1a1a', padding: '3rem', width: '100%', maxWidth: '420px' },
  logo: { textAlign: 'center', marginBottom: '2rem' },
  logoText: { fontSize: '1.8rem', fontWeight: 900, color: '#00ff88', letterSpacing: '0.1em' },
  title: { textAlign: 'center', fontSize: '1.1rem', color: '#888', marginBottom: '2.5rem', letterSpacing: '0.05em' },
  label: { display: 'block', fontSize: '0.75rem', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' },
  input: { width: '100%', background: '#0a0a0a', border: '1px solid #1a1a1a', color: '#fff', padding: '0.85rem 1rem', fontFamily: '"Courier New", monospace', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', marginBottom: '1.5rem', transition: 'border-color 0.2s' },
  btn: { width: '100%', background: '#00ff88', color: '#000', border: 'none', padding: '1rem', fontFamily: '"Courier New", monospace', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', letterSpacing: '0.1em', marginTop: '0.5rem', transition: 'opacity 0.2s' },
  btnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  footer: { textAlign: 'center', marginTop: '2rem', color: '#333', fontSize: '0.85rem' },
  footerLink: { color: '#00ff88', textDecoration: 'none' },
  error: { background: '#1a0000', border: '1px solid #440000', color: '#ff6666', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.85rem' },
};

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      setError(axiosErr.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={s.logoText}>ULTRIS 1</div>
          </Link>
        </div>
        <div style={s.title}>// ACCESS TERMINAL</div>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={s.label}>EMAIL</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={s.input}
            placeholder="operator@domain.com"
            required
            autoComplete="email"
          />

          <label style={s.label}>PASSWORD</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={s.input}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />

          <button
            type="submit"
            style={{ ...s.btn, ...(isLoading ? s.btnDisabled : {}) }}
            disabled={isLoading}
          >
            {isLoading ? 'AUTHENTICATING...' : 'LOG IN →'}
          </button>
        </form>

        <div style={s.footer}>
          No account?{' '}
          <Link to="/register" style={s.footerLink}>
            REQUEST ACCESS
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
