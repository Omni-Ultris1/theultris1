import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import type { AxiosError } from 'axios';

interface ApiError {
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}

const s: Record<string, React.CSSProperties> = {
  page: { background: '#000', color: '#fff', fontFamily: '"Courier New", monospace', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  card: { background: '#050505', border: '1px solid #1a1a1a', padding: '3rem', width: '100%', maxWidth: '420px' },
  logo: { textAlign: 'center', marginBottom: '2rem' },
  logoText: { fontSize: '1.8rem', fontWeight: 900, color: '#00ff88', letterSpacing: '0.1em' },
  title: { textAlign: 'center', fontSize: '1.1rem', color: '#888', marginBottom: '2.5rem', letterSpacing: '0.05em' },
  label: { display: 'block', fontSize: '0.75rem', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' },
  input: { width: '100%', background: '#0a0a0a', border: '1px solid #1a1a1a', color: '#fff', padding: '0.85rem 1rem', fontFamily: '"Courier New", monospace', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', marginBottom: '1.5rem', transition: 'border-color 0.2s' },
  btn: { width: '100%', background: '#00ff88', color: '#000', border: 'none', padding: '1rem', fontFamily: '"Courier New", monospace', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', letterSpacing: '0.1em', marginTop: '0.5rem' },
  footer: { textAlign: 'center', marginTop: '2rem', color: '#333', fontSize: '0.85rem' },
  footerLink: { color: '#00ff88', textDecoration: 'none' },
  error: { background: '#1a0000', border: '1px solid #440000', color: '#ff6666', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.85rem' },
  hint: { fontSize: '0.75rem', color: '#333', marginTop: '-1rem', marginBottom: '1.5rem' },
};

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      await register(form.username, form.email, form.password);
      toast.success('Account created! Welcome to ULTRIS 1.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      const apiError = axiosErr.response?.data;
      if (apiError?.errors?.length) {
        setError(apiError.errors.map((e) => e.message).join('. '));
      } else {
        setError(apiError?.message || 'Registration failed. Please try again.');
      }
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
        <div style={s.title}>// REQUEST ACCESS</div>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={s.label}>USERNAME</label>
          <input
            type="text"
            value={form.username}
            onChange={update('username')}
            style={s.input}
            placeholder="operator_handle"
            required
            minLength={3}
            maxLength={30}
            pattern="[a-zA-Z0-9_]+"
            autoComplete="username"
          />

          <label style={s.label}>EMAIL</label>
          <input
            type="email"
            value={form.email}
            onChange={update('email')}
            style={s.input}
            placeholder="operator@domain.com"
            required
            autoComplete="email"
          />

          <label style={s.label}>PASSWORD</label>
          <input
            type="password"
            value={form.password}
            onChange={update('password')}
            style={s.input}
            placeholder="Min 8 chars, upper/lower/number"
            required
            minLength={8}
            autoComplete="new-password"
          />

          <label style={s.label}>CONFIRM PASSWORD</label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={update('confirmPassword')}
            style={s.input}
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />

          <button type="submit" style={s.btn} disabled={isLoading}>
            {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT →'}
          </button>
        </form>

        <div style={s.footer}>
          Already have access?{' '}
          <Link to="/login" style={s.footerLink}>LOG IN</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
