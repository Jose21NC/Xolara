import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authApi, ApiError } from '../lib/api';

interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'visitor' | 'traveler' | 'guide' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string, role?: string) => Promise<void>;
  signOut: () => void;
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
      // Verify token is still valid
      authApi.me()
        .then(() => setLoading(false))
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

  const signOut = useCallback(() => {
    setUser(null);
    setToken(null);
    clearSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signUp, signOut, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
