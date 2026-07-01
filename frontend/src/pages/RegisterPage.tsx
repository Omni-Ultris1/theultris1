import React, { useMemo, useState } from 'react';
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
  card: { background: '#050505', border: '1px solid #1a1a1a', padding: '3rem', width: '100%', maxWidth: '460px' },
  logo: { textAlign: 'center', marginBottom: '2rem' },
  logoText: { fontSize: '1.8rem', fontWeight: 900, color: '#00ff88', letterSpacing: '0.1em' },
  title: { textAlign: 'center', fontSize: '1.1rem', color: '#888', marginBottom: '2.5rem', letterSpacing: '0.05em' },
  label: { display: 'block', fontSize: '0.75rem', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' },
  input: { width: '100%', background: '#0a0a0a', border: '1px solid #1a1a1a', color: '#fff', padding: '0.85rem 1rem', fontFamily: '"Courier New", monospace', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', marginBottom: '0.75rem', transition: 'border-color 0.2s' },
  inputError: { borderColor: '#7a1717' },
  btn: { width: '100%', background: '#00ff88', color: '#000', border: 'none', padding: '1rem', fontFamily: '"Courier New", monospace', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', letterSpacing: '0.1em', marginTop: '0.75rem' },
  btnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  footer: { textAlign: 'center', marginTop: '2rem', color: '#333', fontSize: '0.85rem' },
  footerLink: { color: '#00ff88', textDecoration: 'none' },
  error: { background: '#1a0000', border: '1px solid #440000', color: '#ff6666', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.85rem', whiteSpace: 'pre-line' },
  hint: { fontSize: '0.75rem', color: '#4d4d4d', marginTop: '0', marginBottom: '1rem', lineHeight: 1.5 },
  fieldError: { color: '#ff6666', fontSize: '0.72rem', marginBottom: '1rem' },
  successHint: { color: '#00ff88', fontSize: '0.72rem', marginBottom: '1rem' },
};

const USERNAME_RE = /^[a-zA-Z0-9_]+$/;
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const markTouched = (field: string) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const fieldErrors = useMemo(() => {
    const errors: Record<string, string> = {};

    const username = form.username.trim();
    if (!username) errors.username = 'Username is required.';
    else if (username.length < 3 || username.length > 30) errors.username = 'Username must be 3–30 characters.';
    else if (!USERNAME_RE.test(username)) errors.username = 'Use letters, numbers, or underscores only. No spaces.';

    if (!form.email.trim()) errors.email = 'Email is required.';

    if (!form.password) errors.password = 'Password is required.';
    else if (!PASSWORD_RE.test(form.password)) errors.password = 'Password must be 8+ chars and include uppercase, lowercase, and a number.';

    if (!form.confirmPassword) errors.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match.';

    return errors;
  }, [form]);

  const canSubmit = Object.keys(fieldErrors).length === 0 && !isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setTouched({ username: true, email: true, password: true, confirmPassword: true });

    if (Object.keys(fieldErrors).length > 0) {
      setError('Fix the highlighted fields and try again.');
      return;
    }

    setIsLoading(true);
    try {
      await register(form.username.trim(), form.email.trim(), form.password);
      toast.success('Account created! Welcome to ULTRIS 1.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      const apiError = axiosErr.response?.data;
      if (apiError?.errors?.length) {
        setError(apiError.errors.map((e) => e.message).join('\n'));
      } else {
        setError(apiError?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = (field: keyof typeof fieldErrors) => (
    touched[field] && fieldErrors[field] ? { ...s.input, ...s.inputError } : s.input
  );

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

        <form onSubmit={handleSubmit} noValidate>
          <label style={s.label}>USERNAME</label>
          <input
            type="text"
            value={form.username}
            onChange={update('username')}
            onBlur={markTouched('username')}
            style={inputStyle('username')}
            placeholder="operator_handle"
            required
            minLength={3}
            maxLength={30}
            pattern="[a-zA-Z0-9_]+"
            autoComplete="username"
            aria-invalid={!!(touched.username && fieldErrors.username)}
          />
          {touched.username && fieldErrors.username ? (
            <div style={s.fieldError}>{fieldErrors.username}</div>
          ) : (
            <div style={s.hint}>Use letters, numbers, or underscores only. Example: omni_ultris1</div>
          )}

          <label style={s.label}>EMAIL</label>
          <input
            type="email"
            value={form.email}
            onChange={update('email')}
            onBlur={markTouched('email')}
            style={inputStyle('email')}
            placeholder="operator@domain.com"
            required
            autoComplete="email"
            aria-invalid={!!(touched.email && fieldErrors.email)}
          />
          {touched.email && fieldErrors.email && <div style={s.fieldError}>{fieldErrors.email}</div>}

          <label style={s.label}>PASSWORD</label>
          <input
            type="password"
            value={form.password}
            onChange={update('password')}
            onBlur={markTouched('password')}
            style={inputStyle('password')}
            placeholder="Min 8 chars, upper/lower/number"
            required
            minLength={8}
            autoComplete="new-password"
            aria-invalid={!!(touched.password && fieldErrors.password)}
          />
          {touched.password && fieldErrors.password ? (
            <div style={s.fieldError}>{fieldErrors.password}</div>
          ) : (
            <div style={s.hint}>Must include at least 1 uppercase letter, 1 lowercase letter, and 1 number.</div>
          )}

          <label style={s.label}>CONFIRM PASSWORD</label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={update('confirmPassword')}
            onBlur={markTouched('confirmPassword')}
            style={inputStyle('confirmPassword')}
            placeholder="••••••••"
            required
            autoComplete="new-password"
            aria-invalid={!!(touched.confirmPassword && fieldErrors.confirmPassword)}
          />
          {touched.confirmPassword && fieldErrors.confirmPassword ? (
            <div style={s.fieldError}>{fieldErrors.confirmPassword}</div>
          ) : form.confirmPassword && form.password === form.confirmPassword ? (
            <div style={s.successHint}>Passwords match.</div>
          ) : null}

          <button type="submit" style={canSubmit ? s.btn : { ...s.btn, ...s.btnDisabled }} disabled={!canSubmit}>
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
