import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authApi, ApiError } from '../lib/api';

interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'visitor' | 'traveler' | 'guide' | 'admin';
  avatarUrl?: string | null;
  subtitle?: string | null;
  location?: string | null;
  bio?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string, role?: string) => Promise<void>;
  signOut: () => void;
  updateUser: (partial: Partial<User>) => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredSession(): { user: User; token: string } | null {
  try {
    const raw = localStorage.getItem('xolara_session_v2');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function storeSession(user: User, token: string) {
  localStorage.setItem('xolara_session_v2', JSON.stringify({ user, token }));
}

function clearSession() {
  localStorage.removeItem('xolara_session_v2');
  localStorage.removeItem('supabase.auth.token');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredSession();
    if (stored) {
      setUser(stored.user);
      setToken(stored.token);
      authApi.me()
        .then((userData) => {
          setUser(prev => prev ? {
            ...prev,
            displayName: userData.display_name,
            role: userData.role as User['role'],
            avatarUrl: userData.avatar_url,
            subtitle: userData.subtitle,
            location: userData.location,
            bio: userData.bio,
          } : prev);
          setLoading(false);
        })
        .catch(() => {
          clearSession();
          setUser(null);
          setToken(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const result = await authApi.signIn({ email, password });
      const userData: User = {
        id: result.user.id,
        email: result.user.email,
        displayName: result.user.displayName,
        role: result.user.role as User['role'],
      };
      setUser(userData);
      setToken(result.token);
      storeSession(userData, result.token);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Error al iniciar sesión';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string, role?: string) => {
    setError(null);
    setLoading(true);
    try {
      const result = await authApi.signUp({ email, password, displayName, role });
      const userData: User = {
        id: result.user.id,
        email: result.user.email,
        displayName: result.user.displayName,
        role: result.user.role as User['role'],
      };
      setUser(userData);
      setToken(result.token);
      storeSession(userData, result.token);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Error al registrarse';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback((partial: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...partial } : null);
    if (partial) {
      try {
        const raw = localStorage.getItem('xolara_session_v2');
        if (raw) {
          const stored = JSON.parse(raw);
          stored.user = { ...stored.user, ...partial };
          localStorage.setItem('xolara_session_v2', JSON.stringify(stored));
        }
      } catch (err) {
        console.warn('[AuthContext] Failed to persist user changes:', err);
      }
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setToken(null);
    clearSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signUp, signOut, updateUser, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
