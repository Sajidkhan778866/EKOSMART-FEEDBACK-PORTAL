import mongoose, { Schema, Document } from 'mongoose';

export interface INavItemConfig {
  id: string;
  label: string;
  url: string;
  icon?: string;
  order: number;
  isVisible: boolean;
  isExternal?: boolean;
  highlightBadge?: string;
  dropdownItems?: Array<{
    id: string;
    label: string;
    url: string;
    icon?: string;
    description?: string;
  }>;
}

export interface IFooterColumn {
  title: string;
  links: Array<{
    label: string;
    url: string;
    isExternal?: boolean;
  }>;
}

export interface IThemeConfig extends Document {
  key: string;
  name: string;
  tokens: {
    colors: {
      primary: string;
      primaryHover: string;
      primaryGradient: string;
      secondary: string;
      secondaryHover: string;
      accent: string;
      background: string;
      surface: string;
      surfaceBorder: string;
      text: string;
      textMuted: string;
      textInverted: string;
      success: string;
      warning: string;
      danger: string;
      info: string;
      headerBg: string;
      footerBg: string;
    };
    typography: {
      fontFamily: string;
      headingFont: string;
      baseFontSize: string;
      headingScaleRatio: number;
      fontWeights: {
        normal: number;
        medium: number;
        bold: number;
        black: number;
      };
      lineHeight: string;
    };
    spacing: {
      containerMaxWidth: string;
      radiusDefault: string;
      radiusCard: string;
      radiusButton: string;
      spacingScale: number;
      shadowLevel: string;
    };
    effects: {
      enableAnimations: boolean;
      transitionDuration: string;
      hoverScale: string;
      entranceAnimation: string;
    };
  };
  header: {
    logoType: 'preset' | 'image';
    logoUrl?: string;
    siteTitle: string;
    tagline: string;
    height: string;
    isSticky: boolean;
    isTransparent: boolean;
    showCustomerLoginButton: boolean;
    ctaButton?: {
      label: string;
      url: string;
      isVisible: boolean;
      color: string;
    };
    navItems: INavItemConfig[];
  };
  footer: {
    companyName: string;
    tagline: string;
    copyrightText: string;
    disclaimer: string;
    address: string;
    phone: string;
    email: string;
    officeHours: string;
    gstin: string;
    website: string;
    showPrivacyPolicy: boolean;
    showTermsConditions: boolean;
    showRefundPolicy: boolean;
    columns: IFooterColumn[];
    socialLinks: Array<{
      platform: string;
      url: string;
      icon: string;
    }>;
  };
  loginPromptTimer: {
    enabled: boolean;
    durationSeconds: number;
    title: string;
    message: string;
  };
  updatedAt: Date;
}

const navItemSchema = new Schema<INavItemConfig>(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String, default: '' },
    order: { type: Number, default: 1 },
    isVisible: { type: Boolean, default: true },
    isExternal: { type: Boolean, default: false },
    highlightBadge: { type: String, default: '' },
    dropdownItems: [
      {
        id: { type: String, required: true },
        label: { type: String, required: true },
        url: { type: String, required: true },
        icon: { type: String, default: '' },
        description: { type: String, default: '' },
      },
    ],
  },
  { _id: false }
);

const footerColumnSchema = new Schema<IFooterColumn>(
  {
    title: { type: String, required: true },
    links: [
      {
        label: { type: String, required: true },
        url: { type: String, required: true },
        isExternal: { type: Boolean, default: false },
      },
    ],
  },
  { _id: false }
);

const themeConfigSchema = new Schema<IThemeConfig>(
  {
    key: { type: String, default: 'global_theme', unique: true },
    name: { type: String, default: 'Ekosmart Official Clean Theme' },
    tokens: {
      colors: {
        primary: { type: String, default: '#059669' }, // Emerald-600
        primaryHover: { type: String, default: '#047857' }, // Emerald-700
        primaryGradient: { type: String, default: 'linear-gradient(135deg, #059669 0%, #047857 100%)' },
        secondary: { type: String, default: '#0284c7' }, // Sky-600
        secondaryHover: { type: String, default: '#0369a1' },
        accent: { type: String, default: '#d97706' }, // Amber-600
        background: { type: String, default: '#f8fafc' }, // Slate-50
        surface: { type: String, default: '#ffffff' },
        surfaceBorder: { type: String, default: '#e2e8f0' },
        text: { type: String, default: '#0f172a' }, // Slate-900
        textMuted: { type: String, default: '#64748b' }, // Slate-500
        textInverted: { type: String, default: '#ffffff' },
        success: { type: String, default: '#10b981' },
        warning: { type: String, default: '#f59e0b' },
        danger: { type: String, default: '#ef4444' },
        info: { type: String, default: '#3b82f6' },
        headerBg: { type: String, default: '#ffffff' },
        footerBg: { type: String, default: '#0f172a' },
      },
      typography: {
        fontFamily: { type: String, default: 'Inter, system-ui, sans-serif' },
        headingFont: { type: String, default: 'Inter, system-ui, sans-serif' },
        baseFontSize: { type: String, default: '16px' },
        headingScaleRatio: { type: Number, default: 1.25 },
        fontWeights: {
          normal: { type: Number, default: 400 },
          medium: { type: Number, default: 500 },
          bold: { type: Number, default: 700 },
          black: { type: Number, default: 900 },
        },
        lineHeight: { type: String, default: '1.6' },
      },
      spacing: {
        containerMaxWidth: { type: String, default: '1280px' },
        radiusDefault: { type: String, default: '12px' },
        radiusCard: { type: String, default: '16px' },
        radiusButton: { type: String, default: '12px' },
        spacingScale: { type: Number, default: 1 },
        shadowLevel: { type: String, default: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
      },
      effects: {
        enableAnimations: { type: Boolean, default: true },
        transitionDuration: { type: String, default: '200ms' },
        hoverScale: { type: String, default: '1.02' },
        entranceAnimation: { type: String, default: 'fade-up' },
      },
    },
    header: {
      logoType: { type: String, enum: ['preset', 'image'], default: 'preset' },
      logoUrl: { type: String, default: '' },
      siteTitle: { type: String, default: 'EKOSMART EV BATTERY SOLUTION' },
      tagline: { type: String, default: 'Clean Energy & Smart Electric Mobility' },
      height: { type: String, default: '72px' },
      isSticky: { type: Boolean, default: true },
      isTransparent: { type: Boolean, default: false },
      showCustomerLoginButton: { type: Boolean, default: true },
      ctaButton: {
        label: { type: String, default: 'Register Complaint' },
        url: { type: String, default: '/complaint/register' },
        isVisible: { type: Boolean, default: true },
        color: { type: String, default: 'emerald' },
      },
      navItems: [navItemSchema],
    },
    footer: {
      companyName: { type: String, default: 'Ekosmart Battery Solution (EBS) & EV Mobility' },
      tagline: { type: String, default: 'High Power Lithium-Ion & LFP Battery Technologies' },
      copyrightText: { type: String, default: '© 2026 Ekosmart Battery Solution. All rights reserved. GSTIN: 08DTUPM4205B1Z0' },
      disclaimer: { type: String, default: 'Official customer support, service ticket resolution & warranty check portal.' },
      address: { type: String, default: 'Plot No. 14, Electronic Complex, Road No. 1, IPIA, Kota, Rajasthan - 324005' },
      phone: { type: String, default: '+91 8949049003 / +91 9549730483' },
      email: { type: String, default: 'support@ekosmartdrive.in' },
      officeHours: { type: String, default: '10:00 AM to 6:30 PM (Mon - Sat)' },
      gstin: { type: String, default: '08DTUPM4205B1Z0' },
      website: { type: String, default: 'www.ekosmartdrive.in' },
      showPrivacyPolicy: { type: Boolean, default: true },
      showTermsConditions: { type: Boolean, default: true },
      showRefundPolicy: { type: Boolean, default: true },
      columns: [footerColumnSchema],
      socialLinks: [
        {
          platform: { type: String, default: 'WhatsApp' },
          url: { type: String, default: 'https://wa.me/918949049003' },
          icon: { type: String, default: 'MessageSquare' },
        },
      ],
    },
    loginPromptTimer: {
      enabled: { type: Boolean, default: true },
      durationSeconds: { type: Number, default: 20 },
      title: { type: String, default: 'Login to Continue' },
      message: {
        type: String,
        default: 'Please login with your email to access your customer account, wallet, referrals, bills and personalized services.',
      },
    },
  },
  { timestamps: true }
);

export const ThemeConfig = mongoose.model<IThemeConfig>('ThemeConfig', themeConfigSchema);
