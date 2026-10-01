import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { API_BASE } from '../config/api';

export interface CustomerUser {
  _id: string;
  customerId: string;
  name: string;
  email: string;
  mobile: string;
  address?: string;
  city?: string;
  state?: string;
  customerType?: string;
  referralCode?: string;
  referredBy?: string;
  walletBalance: number;
  totalEarnedCoins: number;
  totalSpentCoins: number;
  stats?: {
    referralCount: number;
    successfulReferrals: number;
    purchaseCount: number;
    warrantyCount: number;
    complaintCount: number;
  };
  createdAt?: string;
}

interface CustomerAuthContextType {
  customer: CustomerUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sendRegisterOtp: (data: { name: string; email: string; mobile: string; referralCode?: string }) => Promise<{ success: boolean; message: string; debugOtp?: string }>;
  verifyRegisterOtp: (data: { email: string; otp: string; name: string; mobile: string; referralCode?: string; address?: string; city?: string; state?: string }) => Promise<{ success: boolean; message: string; data?: any }>;
  sendLoginOtp: (email: string) => Promise<{ success: boolean; message: string; debugOtp?: string; isNew?: boolean }>;
  verifyLoginOtp: (email: string, otp: string) => Promise<{ success: boolean; message: string; data?: any }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [customer, setCustomer] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem('ekosmart_customer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('ekosmart_customer_token');
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync token with axios defaults
  useEffect(() => {
    if (token) {
      localStorage.setItem('ekosmart_customer_token', token);
    } else {
      localStorage.removeItem('ekosmart_customer_token');
    }
  }, [token]);

  useEffect(() => {
    if (customer) {
      localStorage.setItem('ekosmart_customer', JSON.stringify(customer));
    } else {
      localStorage.removeItem('ekosmart_customer');
    }
  }, [customer]);

  const refreshProfile = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE}/customers/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success && res.data.data) {
        setCustomer(res.data.data);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, [token]);

  const sendRegisterOtp = async (data: { name: string; email: string; mobile: string; referralCode?: string }) => {
    const res = await axios.post(`${API_BASE}/customers/auth/send-register-otp`, data);
    return res.data;
  };

  const verifyRegisterOtp = async (data: { email: string; otp: string; name: string; mobile: string; referralCode?: string; address?: string; city?: string; state?: string }) => {
    const res = await axios.post(`${API_BASE}/customers/auth/verify-register-otp`, data);
    if (res.data.success && res.data.token) {
      setToken(res.data.token);
      setCustomer(res.data.data);
    }
    return res.data;
  };

  const sendLoginOtp = async (email: string) => {
    const res = await axios.post(`${API_BASE}/customers/auth/send-login-otp`, { email });
    return res.data;
  };

  const verifyLoginOtp = async (email: string, otp: string) => {
    const res = await axios.post(`${API_BASE}/customers/auth/verify-login-otp`, { email, otp });
    if (res.data.success && res.data.token) {
      setToken(res.data.token);
      setCustomer(res.data.data);
    }
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setCustomer(null);
    localStorage.removeItem('ekosmart_customer_token');
    localStorage.removeItem('ekosmart_customer');
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        token,
        isAuthenticated: !!customer && !!token,
        isLoading,
        sendRegisterOtp,
        verifyRegisterOtp,
        sendLoginOtp,
        verifyLoginOtp,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};
