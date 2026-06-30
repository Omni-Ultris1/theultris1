import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  color = '#00ff88',
  message,
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      style={{ animation: 'spin 0.8s linear infinite' }}
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeDasharray="80 20"
        strokeLinecap="round"
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
    {message && (
      <span style={{ color, fontFamily: 'monospace', fontSize: '0.9rem' }}>{message}</span>
    )}
  </div>
);

export default LoadingSpinner;
