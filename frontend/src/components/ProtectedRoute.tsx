import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { UserTier } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredTier?: UserTier;
}

const TIER_ORDER: UserTier[] = ['free', 'coss', 'elite', 'founder'];

const LoadingScreen: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#000' }}>
    <div style={{ color: '#00ff88', fontFamily: 'monospace', fontSize: '1.2rem' }}>
      ⚡ LOADING...
    </div>
  </div>
);

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredTier }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredTier && user) {
    const userTierIndex = TIER_ORDER.indexOf(user.tier);
    const requiredTierIndex = TIER_ORDER.indexOf(requiredTier);
    if (userTierIndex < requiredTierIndex) {
      return <Navigate to="/dashboard?upgrade=true" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
