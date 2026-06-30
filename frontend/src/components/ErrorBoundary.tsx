import React, { Component, ErrorInfo } from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#000', color: '#fff', fontFamily: 'monospace', padding: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', color: '#ff4444', marginBottom: '1rem' }}>⚠ SYSTEM ERROR</h1>
          <p style={{ color: '#888', marginBottom: '2rem' }}>{this.state.error?.message || 'An unexpected error occurred'}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ background: '#00ff88', color: '#000', border: 'none', padding: '0.75rem 2rem', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '1rem' }}
          >
            RETRY
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
