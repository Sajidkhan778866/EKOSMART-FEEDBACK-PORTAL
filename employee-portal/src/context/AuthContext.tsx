import React, { createContext, useContext, useState } from 'react';

interface EmployeeUser {
  _id: string;
  name: string;
  employeeId: string;
  role: string;
  division?: string[] | string;
}

interface AuthContextType {
  user: EmployeeUser | null;
  token: string | null;
  login: (token: string, userData: EmployeeUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ekosmart_emp_token'));
  const [user, setUser] = useState<EmployeeUser | null>(() => {
    const saved = localStorage.getItem('ekosmart_emp_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (newToken: string, userData: EmployeeUser) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('ekosmart_emp_token', newToken);
    localStorage.setItem('ekosmart_emp_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ekosmart_emp_token');
    localStorage.removeItem('ekosmart_emp_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token && !!user }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
