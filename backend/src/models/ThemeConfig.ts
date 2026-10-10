import mongoose, { Schema, Document } from 'mongoose';

export interface INavDropdownItem {
  label: string;
  url: string;
  icon?: string;
  isExternal?: boolean;
}

export interface INavItemConfig {
  id: string;
  label: string;
  url: string;
  icon?: string;
  isVisible: boolean;
  order: number;
  isExternal?: boolean;
  isButton?: boolean;
  buttonVariant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  children?: INavDropdownItem[];
}

export interface IFooterColumn {
  title: string;
  links: { label: string; url: string; isExternal?: boolean }[];
}

export interface IGlobalColors {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryHover: string;
  secondaryLight: string;
  accent: string;
  accentHover: string;
  accentLight: string;
  neutral: string;
  surface: string;
  background: string;
  surfaceDark: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface IGlobalTypography {
  fontFamilySans: string;
  fontFamilyHeading: string;
  fontFamilyMono: string;
  h1Size: string;
  h2Size: string;
  h3Size: string;
  h4Size: string;
  bodySize: string;
  captionSize: string;
  baseLineHeight: string;
  headingLineHeight: string;
}

export interface IGlobalDimensions {
  containerMaxWidth: string;
  spacingScale: string;
  borderRadius: string;
  buttonRadius: string;
  buttonPadding: string;
  inputRadius: string;
  inputHeight: string;
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
}

export interface IGlobalEffects {
  enableTransitions: boolean;
  enableHoverAnimations: boolean;
  enableEntranceAnimations: boolean;
  transitionSpeed: string;
}

export interface IHeaderConfig {
  logoUrl?: string;
  logoText: string;
  logoSubtitle?: string;
  logoType: 'preset' | 'image';
  height: string;
  backgroundColor: string;
  textColor: string;
  isSticky: boolean;
  isTransparent: boolean;
  navItems: INavItemConfig[];
  ctaButton: {
    text: string;
    link: string;
    isVisible: boolean;
    variant: 'primary' | 'secondary' | 'accent' | 'outline';
  };
  showEmergencyCall: boolean;
  emergencyPhone: string;
}

export interface IFooterConfig {
  showFooter: boolean;
  backgroundColor: string;
  textColor: string;
  copyrightText: string;
  columns: IFooterColumn[];
  socialLinks: { platform: string; url: string; isVisible: boolean }[];
  badges: { title: string; subtitle: string; icon: string }[];
}

export interface IThemeRevision {
  revisionId: string;
  publishedAt: Date;
  publishedBy: string;
  colors: IGlobalColors;
  typography: IGlobalTypography;
  dimensions: IGlobalDimensions;
  effects: IGlobalEffects;
  header: IHeaderConfig;
  footer: IFooterConfig;
  note?: string;
}

export interface IThemeConfig extends Document {
  key: string;
  colors: IGlobalColors;
  typography: IGlobalTypography;
  dimensions: IGlobalDimensions;
  effects: IGlobalEffects;
  header: IHeaderConfig;
  footer: IFooterConfig;
  draftConfig?: {
    colors: IGlobalColors;
    typography: IGlobalTypography;
    dimensions: IGlobalDimensions;
    effects: IGlobalEffects;
    header: IHeaderConfig;
    footer: IFooterConfig;
  };
  revisions: IThemeRevision[];
  customGlobalCss?: string;
  lastPublishedAt?: Date;
  lastEditedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const defaultColors: IGlobalColors = {
  primary: '#059669',
  primaryHover: '#047857',
  primaryLight: '#d1fae5',
  primaryDark: '#064e3b',
  secondary: '#0284c7',
  secondaryHover: '#0369a1',
  secondaryLight: '#e0f2fe',
  accent: '#f59e0b',
  accentHover: '#d97706',
  accentLight: '#fef3c7',
  neutral: '#64748b',
  surface: '#ffffff',
  background: '#f8fafc',
  surfaceDark: '#0f172a',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#94a3b8',
  border: '#e2e8f0',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

const defaultTypography: IGlobalTypography = {
  fontFamilySans: 'Inter, system-ui, -apple-system, sans-serif',
  fontFamilyHeading: 'Inter, system-ui, -apple-system, sans-serif',
  fontFamilyMono: 'Consolas, Menlo, monospace',
  h1Size: '2.25rem',
  h2Size: '1.75rem',
  h3Size: '1.375rem',
  h4Size: '1.125rem',
  bodySize: '0.9375rem',
  captionSize: '0.8125rem',
  baseLineHeight: '1.5',
  headingLineHeight: '1.2',
};

const defaultDimensions: IGlobalDimensions = {
  containerMaxWidth: '1280px',
  spacingScale: '1rem',
  borderRadius: '0.75rem',
  buttonRadius: '0.75rem',
  buttonPadding: '0.625rem 1.25rem',
  inputRadius: '0.625rem',
  inputHeight: '2.625rem',
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
};

const defaultEffects: IGlobalEffects = {
  enableTransitions: true,
  enableHoverAnimations: true,
  enableEntranceAnimations: true,
  transitionSpeed: '200ms',
};

const defaultHeader: IHeaderConfig = {
  logoText: 'EKOSMART',
  logoSubtitle: 'EV Battery Solution & Spare Parts',
  logoType: 'preset',
  height: '72px',
  backgroundColor: '#ffffff',
  textColor: '#0f172a',
  isSticky: true,
  isTransparent: false,
  navItems: [
    { id: 'nav-1', label: 'Home', url: '/', icon: 'Home', isVisible: true, order: 1 },
    { id: 'nav-2', label: 'Services', url: '/services', icon: 'BatteryCharging', isVisible: true, order: 2 },
    { id: 'nav-3', label: 'Book Complaint', url: '/complaint/register', icon: 'Wrench', isVisible: true, order: 3 },
    { id: 'nav-4', label: 'Track Ticket', url: '/complaint/track', icon: 'Search', isVisible: true, order: 4 },
    { id: 'nav-5', label: 'Warranty Check', url: '/warranty/check', icon: 'ShieldCheck', isVisible: true, order: 5 },
    { id: 'nav-6', label: 'Contact', url: '/contact', icon: 'Phone', isVisible: true, order: 6 },
  ],
  ctaButton: {
    text: 'Register Complaint',
    link: '/complaint/register',
    isVisible: true,
    variant: 'primary',
  },
  showEmergencyCall: true,
  emergencyPhone: '+91 8949049003',
};

const defaultFooter: IFooterConfig = {
  showFooter: true,
  backgroundColor: '#0f172a',
  textColor: '#f8fafc',
  copyrightText: '© 2026 Ekosmart EV Battery Solution & Spare Parts. All Rights Reserved.',
  columns: [
    {
      title: 'EV Battery Services',
      links: [
        { label: 'Lithium Battery Diagnostics', url: '/services' },
        { label: 'BMS Testing & Balancing', url: '/services' },
        { label: 'Drive Rental Fleet Support', url: '/services' },
        { label: 'OEM Spare Parts Catalog', url: '/services' },
      ],
    },
    {
      title: 'Customer Support',
      links: [
        { label: 'Register Grievance', url: '/complaint/register' },
        { label: 'Track Service Ticket', url: '/complaint/track' },
        { label: 'Warranty Coverage Check', url: '/warranty/check' },
        { label: 'Self Warranty Registration', url: '/warranty/register' },
      ],
    },
    {
      title: 'Company & Compliance',
      links: [
        { label: 'About Ekosmart', url: '/about' },
        { label: 'Privacy Policy', url: '/privacy-policy' },
        { label: 'Terms & Conditions', url: '/terms-conditions' },
        { label: 'Refund & Warranty SLA', url: '/refund-policy' },
      ],
    },
  ],
  socialLinks: [
    { platform: 'whatsapp', url: 'https://wa.me/918949049003', isVisible: true },
    { platform: 'phone', url: 'tel:+918949049003', isVisible: true },
    { platform: 'mail', url: 'mailto:support@ekosmartdrive.in', isVisible: true },
  ],
  badges: [
    { title: 'ISO 9001:2015', subtitle: 'Certified Manufacturing & Servicing', icon: 'Award' },
    { title: 'AIS-156 & AIS-038', subtitle: 'EV Battery Safety Compliant', icon: 'ShieldCheck' },
    { title: '100% Genuine Cells', subtitle: 'Grade-A Tested Lithium Packs', icon: 'CheckCircle' },
  ],
};

const ThemeConfigSchema = new Schema<IThemeConfig>(
  {
    key: { type: String, required: true, unique: true, default: 'global_theme' },
    colors: { type: Schema.Types.Mixed, default: defaultColors },
    typography: { type: Schema.Types.Mixed, default: defaultTypography },
    dimensions: { type: Schema.Types.Mixed, default: defaultDimensions },
    effects: { type: Schema.Types.Mixed, default: defaultEffects },
    header: { type: Schema.Types.Mixed, default: defaultHeader },
    footer: { type: Schema.Types.Mixed, default: defaultFooter },
    draftConfig: { type: Schema.Types.Mixed, default: null },
    revisions: [Schema.Types.Mixed],
    customGlobalCss: { type: String, default: '' },
    lastPublishedAt: { type: Date },
    lastEditedBy: { type: String, default: 'Admin' },
  },
  { timestamps: true }
);

export { defaultColors, defaultTypography, defaultDimensions, defaultEffects, defaultHeader, defaultFooter };

const ThemeConfig: mongoose.Model<IThemeConfig> =
  (mongoose.models.ThemeConfig as mongoose.Model<IThemeConfig>) ||
  mongoose.model<IThemeConfig>('ThemeConfig', ThemeConfigSchema);
export { ThemeConfig };
export default ThemeConfig;
