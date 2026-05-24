import { useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import type { AuthUser } from '@my-travelline/shared';

function loadUserFromStorage(): AuthUser | null {
  const stored = localStorage.getItem('user');
  const token = localStorage.getItem('accessToken');
  if (stored && token) {
    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadUserFromStorage);

  const login = (accessToken: string, refreshToken: string, userData: AuthUser) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
