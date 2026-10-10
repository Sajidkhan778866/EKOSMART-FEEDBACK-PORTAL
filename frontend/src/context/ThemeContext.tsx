import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_BASE } from '../config/api';

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
}

export interface ThemeTypography {
  fontHeading: string;
  fontBody: string;
  baseSize: string;
}

export interface ThemeRadii {
  button: string;
  card: string;
  input: string;
}

export interface HeaderNavLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface HeaderConfig {
  logoText: string;
  logoType: 'preset' | 'image';
  logoImage?: string;
  sticky: boolean;
  navLinks: HeaderNavLink[];
  ctaButton?: {
    enabled: boolean;
    label: string;
    href: string;
  };
}

export interface FooterConfig {
  companyName: string;
  copyrightText: string;
  disclaimer: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  gstin?: string;
  officeHours?: string;
  showPrivacyPolicy: boolean;
  showTermsConditions: boolean;
  showRefundPolicy: boolean;
  logoType: 'preset' | 'image';
  logoImage?: string;
  socialLinks?: Array<{ platform: string; url: string }>;
  columns?: Array<{ title: string; links: Array<{ label: string; href: string }> }>;
}

export interface LoginTimerConfig {
  enabled: boolean;
  durationSeconds: number;
  title: string;
  message: string;
}

export interface IThemeConfig {
  themeName: string;
  isDefault: boolean;
  tokens: {
    colors: ThemeColors;
    typography: ThemeTypography;
    radii: ThemeRadii;
  };
  header: HeaderConfig;
  footer: FooterConfig;
  customerLoginTimer: LoginTimerConfig;
}

const defaultTheme: IThemeConfig = {
  themeName: 'Default Ekosmart Clean',
  isDefault: true,
  tokens: {
    colors: {
      primary: '#059669',
      primaryHover: '#047857',
      secondary: '#0f172a',
      accent: '#10b981',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#1e293b',
      textMuted: '#64748b',
      border: '#e2e8f0',
    },
    typography: {
      fontHeading: 'Inter, sans-serif',
      fontBody: 'Inter, sans-serif',
      baseSize: '16px',
    },
    radii: {
      button: '0.75rem',
      card: '1.25rem',
      input: '0.75rem',
    },
  },
  header: {
    logoText: 'Ekosmart',
    logoType: 'preset',
    sticky: true,
    navLinks: [
      { label: 'Home', href: '/' },
      { label: 'Register Complaint', href: '/complaint/register' },
      { label: 'Track Ticket', href: '/complaint/track' },
      { label: 'Check Warranty', href: '/warranty/check' },
      { label: 'Showroom Bills', href: '/showroom-billing' },
      { label: 'Contact', href: '/contact' },
    ],
    ctaButton: {
      enabled: true,
      label: 'Customer Login',
      href: '/customer/login',
    },
  },
  footer: {
    companyName: 'Ekosmart Battery Solution (EBS) & EV Spare Parts',
    copyrightText: '2026 Ekosmart Battery Solution. All rights reserved. GSTIN: 08DTUPM4205B1Z0',
    disclaimer: 'Official customer support, complaint tracking & battery warranty verification portal',
    address: 'Plot No. 14, Electronic Complex, Road No. 1, IPIA, Kota, Rajasthan - 324005',
    phone: '+91 8949049003',
    email: 'support@ekosmartdrive.in',
    website: 'www.ekosmartdrive.in',
    gstin: '08DTUPM4205B1Z0',
    officeHours: '10:00 AM to 6:30 PM (Mon - Sat)',
    showPrivacyPolicy: true,
    showTermsConditions: true,
    showRefundPolicy: true,
    logoType: 'preset',
    logoImage: '',
    socialLinks: [],
    columns: [],
  },
  customerLoginTimer: {
    enabled: true,
    durationSeconds: 20,
    title: 'Welcome to Ekosmart Customer Portal',
    message: 'Login with your email or phone to view your live customer wallet balance, referral earnings, showroom invoices & warranty cards.',
  },
};

interface ThemeContextType {
  theme: IThemeConfig;
  isLoading: boolean;
  refreshTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  isLoading: false,
  refreshTheme: async () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<IThemeConfig>(defaultTheme);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const applyThemeTokensToDOM = (t: IThemeConfig) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const colors = t.tokens?.colors || defaultTheme.tokens.colors;
    const typography = t.tokens?.typography || defaultTheme.tokens.typography;
    const radii = t.tokens?.radii || defaultTheme.tokens.radii;

    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--primary-hover', colors.primaryHover);
    root.style.setProperty('--secondary-color', colors.secondary);
    root.style.setProperty('--accent-color', colors.accent);
    root.style.setProperty('--bg-main', colors.background);
    root.style.setProperty('--surface-card', colors.surface);
    root.style.setProperty('--text-main', colors.text);
    root.style.setProperty('--text-muted', colors.textMuted);
    root.style.setProperty('--border-color', colors.border);

    root.style.setProperty('--radius-btn', radii.button);
    root.style.setProperty('--radius-card', radii.card);
    root.style.setProperty('--radius-input', radii.input);

    if (typography.fontHeading) {
      root.style.setProperty('--font-heading', typography.fontHeading);
    }
    if (typography.fontBody) {
      root.style.setProperty('--font-body', typography.fontBody);
    }
  };

  const fetchTheme = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/frontend-builder/public/theme`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const merged: IThemeConfig = {
            ...defaultTheme,
            ...json.data,
            tokens: {
              colors: { ...defaultTheme.tokens.colors, ...(json.data.tokens?.colors || {}) },
              typography: { ...defaultTheme.tokens.typography, ...(json.data.tokens?.typography || {}) },
              radii: { ...defaultTheme.tokens.radii, ...(json.data.tokens?.radii || {}) },
            },
            header: { ...defaultTheme.header, ...(json.data.header || {}) },
            footer: { ...defaultTheme.footer, ...(json.data.footer || {}) },
            customerLoginTimer: { ...defaultTheme.customerLoginTimer, ...(json.data.customerLoginTimer || {}) },
          };
          setTheme(merged);
          applyThemeTokensToDOM(merged);
          return;
        }
      }
    } catch (err) {
      console.warn('Frontend Builder theme API unavailable, applying default theme:', err);
    } finally {
      setIsLoading(false);
    }
    applyThemeTokensToDOM(defaultTheme);
  };

  useEffect(() => {
    fetchTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, isLoading, refreshTheme: fetchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
