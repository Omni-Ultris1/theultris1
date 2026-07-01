import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import type { AxiosError } from 'axios';

interface ApiError {
  message?: string;
}

const s: Record<string, React.CSSProperties> = {
  page: { background: '#000', color: '#fff', fontFamily: '"Courier New", monospace', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  card: { background: '#050505', border: '1px solid #1a1a1a', padding: '3rem', width: '100%', maxWidth: '460px' },
  logo: { textAlign: 'center', marginBottom: '2rem' },
  logoText: { fontSize: '1.8rem', fontWeight: 900, color: '#00ff88', letterSpacing: '0.1em' },
  title: { textAlign: 'center', fontSize: '1.1rem', color: '#888', marginBottom: '2.5rem', letterSpacing: '0.05em' },
  label: { display: 'block', fontSize: '0.75rem', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' },
  input: { width: '100%', background: '#0a0a0a', border: '1px solid #1a1a1a', color: '#fff', padding: '0.85rem 1rem', fontFamily: '"Courier New", monospace', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', marginBottom: '0.75rem', transition: 'border-color 0.2s' },
  inputError: { borderColor: '#7a1717' },
  btn: { width: '100%', background: '#00ff88', color: '#000', border: 'none', padding: '1rem', fontFamily: '"Courier New", monospace', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', letterSpacing: '0.1em', marginTop: '0.75rem', transition: 'opacity 0.2s' },
  btnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  footer: { textAlign: 'center', marginTop: '2rem', color: '#333', fontSize: '0.85rem' },
  footerLink: { color: '#00ff88', textDecoration: 'none' },
  error: { background: '#1a0000', border: '1px solid #440000', color: '#ff6666', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.85rem', whiteSpace: 'pre-line' },
  hint: { fontSize: '0.75rem', color: '#4d4d4d', marginTop: '0', marginBottom: '1rem', lineHeight: 1.5 },
  fieldError: { color: '#ff6666', fontSize: '0.72rem', marginBottom: '1rem' },
};

const EMAIL_RE = /^\S+@\S+\.\S+$/;

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const fieldErrors = useMemo(() => {
    const errors: Record<string, string> = {};
    if (!email.trim()) errors.email = 'Email is required.';
    else if (!EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email address.';

    if (!password) errors.password = 'Password is required.';
    return errors;
  }, [email, password]);

  const canSubmit = Object.keys(fieldErrors).length === 0 && !isLoading;

  const markTouched = (field: string) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const inputStyle = (field: keyof typeof fieldErrors) => (
    touched[field] && fieldErrors[field] ? { ...s.input, ...s.inputError } : s.input
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setTouched({ email: true, password: true });

    if (Object.keys(fieldErrors).length > 0) {
      setError('Enter your email and password to continue.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      const message = axiosErr.response?.data?.message;
      if (message === 'Invalid email or password') {
        setError('Access denied. Check your email and password, then try again.');
      } else if (message === 'Account temporarily locked due to too many failed attempts. Try again in 2 hours.') {
        setError('Account locked for security. Try again later.');
      } else if (message === 'Account is deactivated') {
        setError('This account is currently deactivated.');
      } else {
        setError(message || 'Login failed. Please try again.');
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
        <div style={s.title}>// SIGN IN</div>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <label style={s.label}>EMAIL</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={markTouched('email')}
            style={inputStyle('email')}
            placeholder="operator@domain.com"
            required
            autoComplete="email"
            aria-invalid={!!(touched.email && fieldErrors.email)}
          />
          {touched.email && fieldErrors.email ? (
            <div style={s.fieldError}>{fieldErrors.email}</div>
          ) : (
            <div style={s.hint}>Use the email tied to your ULTRIS 1 access.</div>
          )}

          <label style={s.label}>PASSWORD</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={markTouched('password')}
            style={inputStyle('password')}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            aria-invalid={!!(touched.password && fieldErrors.password)}
          />
          {touched.password && fieldErrors.password ? (
            <div style={s.fieldError}>{fieldErrors.password}</div>
          ) : (
            <div style={s.hint}>Your access layer activates after successful sign in.</div>
          )}

          <button type="submit" style={canSubmit ? s.btn : { ...s.btn, ...s.btnDisabled }} disabled={!canSubmit}>
            {isLoading ? 'AUTHENTICATING...' : 'ENTER SYSTEM →'}
          </button>
        </form>

        <div style={s.footer}>
          Need access?{' '}
          <Link to="/register" style={s.footerLink}>REQUEST ACCESS</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
