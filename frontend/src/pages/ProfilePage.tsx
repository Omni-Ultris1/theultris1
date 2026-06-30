import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

const s: Record<string, React.CSSProperties> = {
  page: { background: '#000', color: '#fff', fontFamily: '"Courier New", monospace', minHeight: '100vh', display: 'flex' },
  sidebar: { width: '240px', borderRight: '1px solid #0d0d0d', padding: '1.5rem', flexShrink: 0 },
  sidebarLogo: { fontSize: '1rem', fontWeight: 900, color: '#00ff88', letterSpacing: '0.1em', marginBottom: '2rem' },
  sidebarSection: { marginBottom: '2rem' },
  sidebarLabel: { color: '#222', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' },
  sidebarItem: { color: '#555', fontSize: '0.8rem', padding: '0.4rem 0', cursor: 'pointer', letterSpacing: '0.05em', transition: 'color 0.15s' },
  main: { flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #0a0a0a' },
  title: { fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.01em' },
  section: { marginBottom: '3rem' },
  sectionTitle: { fontSize: '0.7rem', letterSpacing: '0.2em', color: '#333', textTransform: 'uppercase', marginBottom: '1.5rem' },
  formGroup: { marginBottom: '1.5rem' },
  label: { display: 'block', color: '#444', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' },
  input: { width: '100%', maxWidth: '400px', background: '#050505', border: '1px solid #111', color: '#fff', padding: '0.75rem 1rem', fontFamily: '"Courier New", monospace', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' },
  textarea: { width: '100%', maxWidth: '400px', background: '#050505', border: '1px solid #111', color: '#fff', padding: '0.75rem 1rem', fontFamily: '"Courier New", monospace', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', resize: 'vertical', minHeight: '100px' },
  saveBtn: { background: '#00ff88', color: '#000', border: 'none', padding: '0.75rem 2rem', fontFamily: '"Courier New", monospace', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', letterSpacing: '0.1em' },
  infoRow: { display: 'flex', gap: '3rem', marginBottom: '1.5rem' },
  infoKey: { color: '#333', fontSize: '0.75rem', letterSpacing: '0.05em', minWidth: '120px' },
  infoVal: { color: '#888', fontSize: '0.75rem' },
  badge: { background: '#001a0d', border: '1px solid #004422', color: '#00ff88', padding: '0.2rem 0.6rem', fontSize: '0.65rem', letterSpacing: '0.1em', display: 'inline-block' },
  dangerSection: { border: '1px solid #440000', padding: '1.5rem', maxWidth: '500px' },
  dangerTitle: { color: '#ff4444', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' },
  dangerBtn: { background: 'transparent', color: '#ff4444', border: '1px solid #440000', padding: '0.6rem 1.5rem', fontFamily: '"Courier New", monospace', fontSize: '0.8rem', cursor: 'pointer', letterSpacing: '0.05em' },
};

const ProfilePage: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(user?.profile?.displayName || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { usersApi } = await import('../api/users');
      await usersApi.updateProfile({ profile: { displayName, bio } });
      await refreshUser();
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div style={s.page}>
      <div style={s.sidebar}>
        <div style={s.sidebarLogo}>ULTRIS 1</div>
        <div style={s.sidebarSection}>
          <div style={s.sidebarLabel}>NAVIGATION</div>
          <div style={s.sidebarItem} onClick={() => navigate('/dashboard')}>← Dashboard</div>
          <div style={{ ...s.sidebarItem, color: '#00ff88' }}>Profile</div>
        </div>
        <div style={s.sidebarSection}>
          <div style={s.sidebarLabel}>ACCOUNT</div>
          <div style={s.sidebarItem} onClick={handleLogout}>Logout</div>
        </div>
      </div>

      <div style={s.main}>
        <div style={s.header}>
          <div style={s.title}>PROFILE</div>
          <span style={s.badge}>{user?.tier?.toUpperCase()}</span>
        </div>

        <div style={s.section}>
          <div style={s.sectionTitle}>// ACCOUNT INFO</div>
          <div style={s.infoRow}>
            <span style={s.infoKey}>Username</span>
            <span style={s.infoVal}>@{user?.username}</span>
          </div>
          <div style={s.infoRow}>
            <span style={s.infoKey}>Email</span>
            <span style={s.infoVal}>{user?.email}</span>
          </div>
          <div style={s.infoRow}>
            <span style={s.infoKey}>Tier</span>
            <span style={s.infoVal}>{user?.tier?.toUpperCase()}</span>
          </div>
          <div style={s.infoRow}>
            <span style={s.infoKey}>Role</span>
            <span style={s.infoVal}>{user?.role?.toUpperCase()}</span>
          </div>
          <div style={s.infoRow}>
            <span style={s.infoKey}>Member since</span>
            <span style={s.infoVal}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</span>
          </div>
        </div>

        <div style={s.section}>
          <div style={s.sectionTitle}>// EDIT PROFILE</div>
          <div style={s.formGroup}>
            <label style={s.label}>Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              style={s.input}
              placeholder="Your display name"
              maxLength={50}
            />
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={s.textarea}
              placeholder="Tell the crew about yourself..."
              maxLength={500}
            />
          </div>
          <button style={s.saveBtn} onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
          </button>
        </div>

        <div style={s.section}>
          <div style={s.sectionTitle}>// DANGER ZONE</div>
          <div style={s.dangerSection}>
            <div style={s.dangerTitle}>LOGOUT FROM ALL DEVICES</div>
            <p style={{ color: '#444', fontSize: '0.8rem', marginBottom: '1rem', lineHeight: 1.6 }}>
              This will invalidate all active sessions across all devices.
            </p>
            <button style={s.dangerBtn} onClick={handleLogout}>
              LOGOUT ALL DEVICES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
