import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import type { User } from '../types';
import { authApi } from '../api/auth';

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [isLoading, setIsLoading] = useState(true);
  const logoutRef = useRef<() => Promise<void>>();

  const logout = useCallback(async () => {
    try {
      if (accessToken) await authApi.logout();
    } catch {
      // ignore errors on logout
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setAccessToken(null);
    }
  }, [accessToken]);

  logoutRef.current = logout;

  useEffect(() => {
    const handleAuthLogout = () => {
      logoutRef.current?.();
    };
    window.addEventListener('auth:logout', handleAuthLogout);
    return () => window.removeEventListener('auth:logout', handleAuthLogout);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await authApi.me();
        if (res.data?.user) {
          setUser(res.data.user);
          setAccessToken(token);
        }
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    const { user: u, accessToken: at, refreshToken: rt } = res.data;
    localStorage.setItem('accessToken', at);
    localStorage.setItem('refreshToken', rt);
    setUser(u);
    setAccessToken(at);
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const res = await authApi.register({ username, email, password });
    const { user: u, accessToken: at, refreshToken: rt } = res.data;
    localStorage.setItem('accessToken', at);
    localStorage.setItem('refreshToken', rt);
    setUser(u);
    setAccessToken(at);
  }, []);

  const refreshUser = useCallback(async () => {
    const res = await authApi.me();
    if (res.data?.user) setUser(res.data.user);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
