import { createContext, useContext, useState } from 'react';

const API = 'http://localhost:8000';

export interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<User>;
  signup: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  authFetch: (path: string, init?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function persist(user: User, token: string) {
  localStorage.setItem('datapilot_user',  JSON.stringify(user));
  localStorage.setItem('datapilot_token', token);
}

function clear() {
  localStorage.removeItem('datapilot_user');
  localStorage.removeItem('datapilot_token');
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('datapilot_user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('datapilot_token')
  );

  const _setAuth = (rawUser: any, jwt: string): User => {
    const user: User = {
      id:      rawUser.id,
      name:    rawUser.name,
      email:   rawUser.email,
      isAdmin: rawUser.is_admin,
    };
    setUser(user);
    setToken(jwt);
    persist(user, jwt);
    return user;
  };

  const login = async (email: string, password: string): Promise<User> => {
    const res = await fetch(`${API}/api/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail ?? 'Login failed');
    return _setAuth(data.user, data.access_token);
  };

  const signup = async (name: string, email: string, password: string): Promise<User> => {
    const res = await fetch(`${API}/api/auth/signup`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      const msg = Array.isArray(data.detail)
        ? data.detail[0]?.msg ?? 'Signup failed'
        : data.detail ?? 'Signup failed';
      throw new Error(msg);
    }
    return _setAuth(data.user, data.access_token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    clear();
  };

  /** Authenticated fetch — automatically injects Bearer token. */
  const authFetch = (path: string, init: RequestInit = {}): Promise<Response> => {
    return fetch(`${API}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init.headers ?? {}),
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, token, login, signup, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
