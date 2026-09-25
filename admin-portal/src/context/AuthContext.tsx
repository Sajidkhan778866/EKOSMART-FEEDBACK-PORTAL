import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../api/client';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ekosmart_admin_token'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ekosmart_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('ekosmart_admin_token', newToken);
    localStorage.setItem('ekosmart_admin_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ekosmart_admin_token');
    localStorage.removeItem('ekosmart_admin_user');
  };

  useEffect(() => {
    // If token is empty or mock_admin_token, get a real backend token
    if (!token || token === 'mock_admin_token') {
      fetch(`${API_BASE_URL}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@ekosmart.com', password: 'admin123' }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data?.token) {
            login(data.data.token, data.data);
          }
        })
        .catch((err) => {
          console.warn('Auto auth login check:', err);
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
