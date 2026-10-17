import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  LayoutTemplate,
  CreditCard,
  FileText,
  Shield,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Phone,
  Building2,
  List,
  Image as ImageIcon,
  Upload,
  RotateCcw,
  Sparkles,
  Copy,
  Tag,
  Filter,
  CheckCircle2,
  Layers,
  Zap,
  Battery,
  Bike,
  Store,
  Settings,
  Search,
  ShieldCheck,
  ShieldAlert,
  Truck,
  Wrench,
  HelpCircle,
  Activity,
  Package,
  X,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageSquare,
  UserCheck,
  MapPin,
  Clock,
  Edit3,
  Coins,
  Gift,
  Award,
  Palette,
  Home,
  User,
  Smartphone,
  Monitor,
  Sliders,
  Receipt,
} from 'lucide-react';
import { contentApi, customerApi, API_BASE_URL, resolveImageUrl } from '../api/client';

const FRONTEND_URL =
  import.meta.env.VITE_FRONTEND_URL ||
  (typeof window !== 'undefined' &&
  window.location.hostname &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1'
    ? 'https://ekosmartcustomersite.vercel.app'
    : 'http://localhost:5003');

interface IServiceCard {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  section?: string;
  badge?: string;
  features?: string[];
  linkUrl: string;
  buttonText: string;
  color: string;
  icon: string;
  iconType?: 'icon' | 'image';
  iconImage?: string;
  bgType?: 'color' | 'image';
  bgImage?: string;
  bgOverlayOpacity?: number;
  isVisible: boolean;
  order: number;
}

export interface IDivisionContact {
  id?: string;
  name: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  inCharge?: string;
  officeHours?: string;
  address?: string;
}

export interface IQuickActionItem {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  icon: string;
  iconType?: 'icon' | 'image';
  iconImage?: string;
  color: string;
  customColor?: string;
  customBg?: string;
  customTextColor?: string;
  isVisible: boolean;
  order: number;
  target?: '_self' | '_blank';
  showExternalIcon?: boolean;
  badge?: string;
  badgeColor?: string;
}

export interface IQuickActionsConfig {
  isVisible?: boolean;
  sectionBadge?: string;
  showSectionBadge?: boolean;
  sectionTitle?: string;
  sectionSubtitle?: string;
  showSectionHeader?: boolean;
  bgType?: 'color' | 'gradient' | 'image' | 'transparent';
  bgColor?: string;
  bgGradientStart?: string;
  bgGradientEnd?: string;
  bgGradientDirection?: string;
  bgImage?: string;
  bgOverlayOpacity?: number;
  bgOverlayColor?: string;
  bgPosition?: string;
  bgSize?: string;
  bgBlur?: number;
  cardBgColor?: string;
  cardBorderColor?: string;
  cardBorderRadius?: string;
  cardShadow?: string;
  showDividers?: boolean;
  dividerColor?: string;
  textColor?: string;
  subtitleColor?: string;
  layoutStyle?: 'horizontal' | 'grid';
}

export interface IBatteryBanner {
  isVisible?: boolean;
  badgeText: string;
  badgeIcon?: string;
  showBadge?: boolean;
  badgeBgColor?: string;
  badgeTextColor?: string;
  badgeBorderColor?: string;
  heading: string;
  headingColor?: string;
  subheading: string;
  subheadingColor?: string;
  highlight1: string;
  highlight1Icon?: string;
  highlight1Color?: string;
  highlight2: string;
  highlight2Icon?: string;
  highlight2Color?: string;
  highlight3?: string;
  highlight3Icon?: string;
  highlight3Color?: string;
  highlight4?: string;
  highlight4Icon?: string;
  highlight4Color?: string;
  // Background Image Suite
  bgType?: 'gradient' | 'solid' | 'image' | 'transparent';
  bgSolidColor?: string;
  bgGradientStart?: string;
  bgGradientEnd?: string;
  bgGradientDirection?: string;
  bgImage?: string;
  bgOverlayOpacity?: number;
  bgOverlayColor?: string;
  bgPosition?: string;
  bgSize?: string;
  bgBlur?: number;
  cardBorderColor?: string;
  cardBorderRadius?: string;
  cardShadow?: string;
  // Contacts & Assistance Card
  showContactCard?: boolean;
  contactCardTitle?: string;
  contactCardSubtitle?: string;
  contactCardBgColor?: string;
  contactCardBorderColor?: string;
  contactLogoType?: 'preset' | 'text' | 'image';
  contactLogoText?: string;
  contactLogoImage?: string;
  contactLogoBgColor?: string;
  contactLogoTextColor?: string;
  helplinePhone: string;
  helplineBtnText: string;
  helplineBtnBg?: string;
  helplineBtnTextColor?: string;
  plantBtnText: string;
  plantBtnLink: string;
  plantBtnTarget?: '_self' | '_blank';
  plantBtnBg?: string;
  plantBtnTextColor?: string;
  showWhatsappBtn?: boolean;
  whatsappNumber?: string;
  whatsappBtnText?: string;
  whatsappBtnBg?: string;
  whatsappBtnTextColor?: string;
  alternatePhone?: string;
  supportEmail?: string;
}

export interface ITopBarConfig {
  isVisible?: boolean;
  phone?: string;
  phoneLabel?: string;
  showPhone?: boolean;
  officeHours?: string;
  showOfficeHours?: boolean;
  gstin?: string;
  showGstin?: boolean;
  location?: string;
  showLocation?: boolean;
  bgColor?: string;
  textColor?: string;
  accentColor?: string;
}

export interface ICustomNavItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  itemType?: 'link' | 'pill' | 'button';
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  badge?: string;
  badgeColor?: string;
  isVisible?: boolean;
  order?: number;
  isExternal?: boolean;
  children?: Array<{ label: string; href: string; isExternal?: boolean }>;
}

export interface IFooterColumn {
  id?: string;
  title: string;
  links: Array<{ label: string; href: string; isExternal?: boolean }>;
}

export interface IThemeColors {
  primary: string;
  primaryHover: string;
  secondary: string;
  secondaryHover?: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  success?: string;
  warning?: string;
  error?: string;
}

export interface ISectionLayoutStyle {
  width?: string;
  maxWidth?: string;
  paddingTop?: string;
  paddingBottom?: string;
  marginTop?: string;
  marginBottom?: string;
  gap?: string;
  alignment?: 'left' | 'center' | 'right';
  gridColumns?: number;
  borderRadius?: string;
  shadow?: string;
  backgroundColor?: string;
  isVisible?: boolean;
  order?: number;
}

export interface ISectionLayouts {
  hero?: ISectionLayoutStyle;
  quickActions?: ISectionLayoutStyle;
  serviceCards?: ISectionLayoutStyle;
  rewards?: ISectionLayoutStyle;
  batteryBanner?: ISectionLayoutStyle;
  contact?: ISectionLayoutStyle;
  footer?: ISectionLayoutStyle;
}

export interface IHeaderNavConfig {
  brandTitle?: string;
  brandSubtitle?: string;
  logoType?: 'preset' | 'image';
  logoImage?: string;
  logoLink?: string;
  homeLabel?: string;
  showHome?: boolean;
  homeHref?: string;
  homeIcon?: string;
  walletLabel?: string;
  showWallet?: boolean;
  walletHref?: string;
  showWalletBadge?: boolean;
  walletBgColor?: string;
  walletTextColor?: string;
  walletBorderColor?: string;
  walletIcon?: string;
  referLabel?: string;
  showRefer?: boolean;
  referHref?: string;
  showReferBonus?: boolean;
  referBonusAmount?: number;
  referBgColor?: string;
  referTextColor?: string;
  referBorderColor?: string;
  referIcon?: string;
  showShowroomBilling?: boolean;
  showroomBillingLabel?: string;
  showroomBillingHref?: string;
  showroomBillingIcon?: string;
  showWarrantyCheck?: boolean;
  warrantyCheckLabel?: string;
  warrantyCheckHref?: string;
  warrantyCheckIcon?: string;
  showTrackTicket?: boolean;
  trackTicketLabel?: string;
  trackTicketHref?: string;
  trackTicketIcon?: string;
  showSupportTicket?: boolean;
  supportTicketLabel?: string;
  supportTicketHref?: string;
  supportTicketIcon?: string;
  contactLabel?: string;
  showContactDropdown?: boolean;
  contactIcon?: string;
  accountLabel?: string;
  showAccount?: boolean;
  accountHref?: string;
  accountBtnBg?: string;
  accountBtnText?: string;
  accountIcon?: string;
  navBgColor?: string;
  navBorderColor?: string;
  isSticky?: boolean;
  customNavItems?: ICustomNavItem[];
}

interface ICMSContent {
  topBar?: ITopBarConfig;
  headerNav?: IHeaderNavConfig;
  hero: {
    heading: string;
    subheading: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    primaryButtonTarget?: '_self' | '_blank';
    primaryButtonVisible?: boolean;
    primaryButtonBgColor?: string;
    primaryButtonTextColor?: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
    secondaryButtonTarget?: '_self' | '_blank';
    secondaryButtonVisible?: boolean;
    secondaryButtonBgColor?: string;
    secondaryButtonTextColor?: string;
    secondaryButtonBorderColor?: string;
    secondaryButtonShowIcon?: boolean;
    logoType?: 'preset' | 'image';
    logoImage?: string;
    complaintLogoType?: 'preset' | 'image';
    complaintLogoImage?: string;
    bgType?: 'gradient' | 'solid' | 'image';
    bgGradientPreset?: string;
    bgGradientStart?: string;
    bgGradientMiddle?: string;
    bgGradientEnd?: string;
    bgGradientDirection?: string;
    bgSolidColor?: string;
    bgImage?: string;
    bgOverlayOpacity?: number;
    bgOverlayColor?: string;
    bgPosition?: string;
    bgSize?: string;
    bgAttachment?: string;
    bgBlur?: number;
    showHeroLogo?: boolean;
    bgPattern?: string;
    badgeText?: string;
    badgeIcon?: string;
    badgeVisible?: boolean;
    badgeBgColor?: string;
    badgeTextColor?: string;
    badgeBorderColor?: string;
    highlight1Text?: string;
    highlight1Icon?: string;
    highlight1Color?: string;
    highlight1Visible?: boolean;
    highlight2Text?: string;
    highlight2Icon?: string;
    highlight2Color?: string;
    highlight2Visible?: boolean;
    highlight3Text?: string;
    highlight3Icon?: string;
    highlight3Color?: string;
    highlight3Visible?: boolean;
    textColor?: string;
  };
  serviceCards: IServiceCard[];
  batteryBanner?: IBatteryBanner;
  quickActionsConfig?: IQuickActionsConfig;
  quickActions?: IQuickActionItem[];
  footer: {
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
    logoType?: 'preset' | 'image';
    logoImage?: string;
    instagramUrl?: string;
    showInstagram?: boolean;
    facebookUrl?: string;
    showFacebook?: boolean;
    whatsappNumber?: string;
    showWhatsapp?: boolean;
    whatsappText?: string;
    mapUrl?: string;
    showContactDropdown?: boolean;
    contactDropdownTitle?: string;
    columns?: IFooterColumn[];
  };
  themeColors?: IThemeColors;
  sectionLayouts?: ISectionLayouts;
  privacyPolicy: {
    title: string;
    content: string;
    isPublished: boolean;
  };
  termsConditions: {
    title: string;
    content: string;
    isPublished: boolean;
  };
  refundPolicy: {
    title: string;
    content: string;
    isPublished: boolean;
  };
  contactInfo: {
    heading: string;
    subheading: string;
    badgeText: string;
    helplinePhone: string;
    alternatePhone?: string;
    whatsappNumber?: string;
    supportEmail: string;
    salesEmail?: string;
    plantAddress: string;
    officeHours: string;
    gstin: string;
    website: string;
    mapUrl?: string;
    dropdownOptions: string[];
    divisionContacts?: IDivisionContact[];
    isPublished: boolean;
    // Softcoded Contact Cards
    cardHelplineTitle?: string;
    cardHelplineSubtitle?: string;
    cardHelplineCallBtnText?: string;
    cardHelplineWhatsappBtnText?: string;
    cardEmailTitle?: string;
    cardEmailSubtitle?: string;
    cardEmailBtnText?: string;
    cardAddressTitle?: string;
    cardAddressFacility?: string;
    cardAddressBtnText?: string;
    cardHoursTitle?: string;
    cardHoursSubtitle?: string;
    cardHoursNote?: string;
    // Plant Dossier Card
    dossierTitle?: string;
    dossierSubtitle?: string;
    dossierDescription?: string;
    corporateEntity?: string;
    dossierBadgeText?: string;
    // Inquiry Form
    formTitle?: string;
    formSubtitle?: string;
    formQuickSelectLabel?: string;
    formButtonText?: string;
    formSuccessTitle?: string;
    formSuccessMessage?: string;
    // Division Section Directory
    divisionSectionBadge?: string;
    divisionSectionTitle?: string;
    divisionSectionSubtitle?: string;
  };
  customerLoginTimer?: {
    enabled: boolean;
    durationSeconds: number;
    title: string;
    message: string;
  };
}

const AVAILABLE_ICONS = [
  'Store',
  'Bike',
  'Settings',
  'Battery',
  'FileText',
  'Search',
  'ShieldCheck',
  'ShieldAlert',
  'Truck',
  'Wrench',
  'Zap',
  'Package',
  'Phone',
  'Activity',
  'HelpCircle',
];

const AVAILABLE_COLORS = [
  { label: 'Emerald / Green', value: 'emerald' },
  { label: 'Blue', value: 'blue' },
  { label: 'Amber / Orange', value: 'amber' },
  { label: 'Purple / Violet', value: 'purple' },
  { label: 'Indigo', value: 'indigo' },
  { label: 'Teal', value: 'teal' },
  { label: 'Rose / Red', value: 'rose' },
  { label: 'Cyan', value: 'cyan' },
  { label: 'Slate / Dark Gray', value: 'slate' },
];

const STANDARD_SECTIONS = ['Showroom', 'Rental', 'Spare Parts', 'Battery', 'Warranty', 'General'];

const QUICK_LINK_PRESETS = [
  { label: 'Showroom Ticket', url: '/complaint/register?division=Showroom' },
  { label: 'Rental Ticket', url: '/complaint/register?division=Rental' },
  { label: 'Spare Parts Ticket', url: '/complaint/register?division=Spare%20Parts' },
  { label: 'Battery Ticket', url: '/complaint/register?division=Battery' },
  { label: 'Check Warranty', url: '/warranty/check' },
  { label: 'Register Warranty', url: '/warranty/register' },
  { label: 'Track Ticket', url: '/complaint/track' },
  { label: 'Contact Us', url: '/contact' },
];

const defaultFallbackContent: ICMSContent = {
  topBar: {
    isVisible: true,
    phone: '+91 8949049003',
    phoneLabel: 'Helpline:',
    showPhone: true,
    officeHours: '10:00 AM to 6:30 PM (Mon - Sat)',
    showOfficeHours: true,
    gstin: '08DTUPM4205B1Z0',
    showGstin: true,
    location: 'Kota, Rajasthan',
    showLocation: true,
    bgColor: '#0f172a',
    textColor: '#cbd5e1',
    accentColor: '#34d399',
  },
  headerNav: {
    brandTitle: 'EBS EKOSMART',
    brandSubtitle: 'Battery Solution • Li-ion & LFP',
    logoType: 'preset',
    logoImage: '',
    logoLink: '/',
    homeLabel: 'Home',
    showHome: true,
    homeHref: '/',
    homeIcon: 'home',
    walletLabel: 'Wallet & Coins',
    showWallet: true,
    walletHref: '/customer/wallet',
    showWalletBadge: true,
    walletBgColor: '#fef3c7',
    walletTextColor: '#78350f',
    walletBorderColor: '#fde68a',
    walletIcon: 'coins',
    referLabel: 'Refer & Earn',
    showRefer: true,
    referHref: '/customer/referrals',
    showReferBonus: true,
    referBonusAmount: 500,
    referBgColor: '#faf5ff',
    referTextColor: '#581c87',
    referBorderColor: '#e9d5ff',
    referIcon: 'gift',
    showShowroomBilling: true,
    showroomBillingLabel: 'Showroom Bills',
    showroomBillingHref: '/showroom-billing',
    showroomBillingIcon: 'receipt',
    showWarrantyCheck: true,
    warrantyCheckLabel: 'Check Warranty',
    warrantyCheckHref: '/warranty/check',
    warrantyCheckIcon: 'shield',
    showTrackTicket: true,
    trackTicketLabel: 'Track Ticket',
    trackTicketHref: '/complaint/track',
    trackTicketIcon: 'search',
    showSupportTicket: false,
    supportTicketLabel: 'Support Ticket',
    supportTicketHref: '/complaint/register',
    supportTicketIcon: 'file',
    contactLabel: 'Contact & Helpline',
    showContactDropdown: true,
    contactIcon: 'phone',
    accountLabel: 'Account / Login',
    showAccount: true,
    accountHref: '/customer/login',
    accountBtnBg: '#059669',
    accountBtnText: '#ffffff',
    accountIcon: 'user',
    navBgColor: '#ffffff',
    navBorderColor: '#e2e8f0',
    isSticky: true,
    customNavItems: [
      { id: 'nav-showroom', label: 'Showroom Bills', href: '/showroom-billing', itemType: 'link', isVisible: true, order: 1, isExternal: false },
      { id: 'nav-warranty', label: 'Check Warranty', href: '/warranty/check', itemType: 'link', isVisible: true, order: 2, isExternal: false },
      { id: 'nav-track', label: 'Track Ticket', href: '/complaint/track', itemType: 'link', isVisible: true, order: 3, isExternal: false },
      { id: 'nav-contact', label: 'Contact', href: '/contact', itemType: 'link', isVisible: true, order: 4, isExternal: false },
    ],
  },
  hero: {
    heading: 'Ekosmart Battery Solution (EBS)\nHigh Power Lithium-Ion & LFP Battery Packs',
    subheading: 'High Charging Power • Long Life • Low Maintenance. Official customer support portal for EV scooter & E-rickshaw batteries, genuine spare parts, and warranty verification.',
    primaryButtonText: 'Register Complaint',
    primaryButtonLink: '/complaint/register',
    primaryButtonTarget: '_self',
    primaryButtonVisible: true,
    primaryButtonBgColor: '#10b981',
    primaryButtonTextColor: '#020617',
    secondaryButtonText: 'Check Battery Warranty',
    secondaryButtonLink: '/warranty/check',
    secondaryButtonTarget: '_blank',
    secondaryButtonVisible: true,
    secondaryButtonBgColor: 'rgba(255, 255, 255, 0.1)',
    secondaryButtonTextColor: '#ffffff',
    secondaryButtonBorderColor: 'rgba(255, 255, 255, 0.2)',
    secondaryButtonShowIcon: true,
    logoType: 'preset',
    logoImage: '',
    complaintLogoType: 'preset',
    complaintLogoImage: '',
    bgType: 'gradient',
    bgGradientPreset: 'ebs-emerald',
    bgGradientStart: '#022c22',
    bgGradientMiddle: '#064e3b',
    bgGradientEnd: '#115e59',
    bgGradientDirection: 'to-r',
    bgSolidColor: '#064e3b',
    bgImage: '',
    bgOverlayOpacity: 0.8,
    bgOverlayColor: '#000000',
    bgPosition: 'center',
    bgSize: 'cover',
    bgAttachment: 'scroll',
    bgBlur: 0,
    showHeroLogo: false,
    bgPattern: 'mesh',
    badgeText: 'Official EBS Battery Solution Portal • Kota, Rajasthan',
    badgeIcon: 'Sparkles',
    badgeVisible: true,
    badgeBgColor: 'rgba(6, 78, 59, 0.6)',
    badgeTextColor: '#6ee7b7',
    badgeBorderColor: 'rgba(16, 185, 129, 0.4)',
    highlight1Text: 'High Charging Power',
    highlight1Icon: 'Zap',
    highlight1Color: '#facc15',
    highlight1Visible: true,
    highlight2Text: 'Long Life (3 & 1.5 Year Warranty)',
    highlight2Icon: 'Battery',
    highlight2Color: '#4ade80',
    highlight2Visible: true,
    highlight3Text: 'Low Maintenance',
    highlight3Icon: 'Wrench',
    highlight3Color: '#5eead4',
    highlight3Visible: true,
    textColor: '#ffffff',
  },
  serviceCards: [
    {
      id: 'div-showroom',
      title: 'Showroom Support',
      subtitle: 'EV Sales & Dealership Network',
      description: 'Sales, dealership service inquiries, and new EV vehicle delivery assistance',
      section: 'Showroom',
      badge: 'NEW BOOKINGS',
      features: ['EV Vehicle Registration', 'Dealership Franchise Support', 'Test Drive & Delivery Assistance'],
      linkUrl: '/complaint/register?division=Showroom',
      buttonText: 'Select Showroom',
      color: 'emerald',
      icon: 'Store',
      iconType: 'icon',
      iconImage: '',
      isVisible: true,
      order: 1,
    },
    {
      id: 'div-rental',
      title: 'Drive Rental',
      subtitle: 'Daily & Monthly EV Mobility',
      description: 'EV scooter booking assistance, battery swaps, and rider issue reports.',
      section: 'Rental',
      badge: 'FLEXIBLE PLANS',
      features: ['Quick Battery Swap Network', 'Flexible Daily/Monthly Subscriptions', '24/7 Roadside Assistance'],
      linkUrl: '/complaint/register?division=Rental',
      buttonText: 'Select Rental',
      color: 'blue',
      icon: 'Bike',
      iconType: 'icon',
      iconImage: '',
      isVisible: true,
      order: 2,
    },
    {
      id: 'div-spare-parts',
      title: 'Spare Parts',
      subtitle: 'OEM Components & Accessories',
      description: 'Genuine Ekosmart replacement parts and warranty claim ticket logs',
      section: 'Spare Parts',
      badge: 'GENUINE OEM',
      features: ['Aluminium Fast Chargers (67.2V/72V)', 'Smart BMS & Harness Kits', 'Motor, Controller & Throttle Units'],
      linkUrl: '/complaint/register?division=Spare%20Parts',
      buttonText: 'Select Parts',
      color: 'purple',
      icon: 'Settings',
      iconType: 'icon',
      iconImage: '',
      isVisible: true,
      order: 3,
    },
    {
      id: 'div-battery',
      title: 'Lithium Battery',
      subtitle: 'High Performance LFP & Li-Ion',
      description: 'Battery health diagnostics, cell voltage inspection, and AMC requests',
      section: 'Battery',
      badge: '3-YEAR WARRANTY',
      features: ['48V / 60V / 72V Custom Packs', 'State-of-Health (SoH) Diagnostic', 'Kota Plant Rapid Repair / Swap'],
      linkUrl: '/complaint/register?division=Battery',
      buttonText: 'Select Battery',
      color: 'teal',
      icon: 'Battery',
      iconType: 'icon',
      iconImage: '',
      isVisible: true,
      order: 4,
    },
  ],
  footer: {
    companyName: 'Ekosmart Battery Solution (EBS) & EV Spare Parts',
    copyrightText: '2026 Ekosmart Battery Solution. All rights reserved. GSTIN: 08DTUPM4205B1Z0',
    disclaimer: 'Official customer support, complaint tracking & battery warranty verification portal',
    address: 'Rang Talab, Near by Star Kids School, Kota, Rajasthan - 324002',
    phone: '+91 8949049003',
    email: 'Smartdrive5640@gmail.com',
    website: 'www.ekosmartdrive.in',
    gstin: '08DTUPM4205B1Z0',
    officeHours: '10:00 AM - 6:30 PM (Mon - Sat)',
    showPrivacyPolicy: true,
    showTermsConditions: true,
    showRefundPolicy: true,
    logoType: 'preset',
    logoImage: '',
    instagramUrl: 'https://www.instagram.com/ekosmartdrive',
    showInstagram: true,
    facebookUrl: 'https://www.facebook.com/ekosmartdrive',
    showFacebook: true,
    whatsappNumber: '+91 8949049003',
    showWhatsapp: true,
    whatsappText: 'Hello Ekosmart, I would like to inquire about battery service & support.',
    mapUrl: 'https://maps.google.com/?q=Rang+Talab,+Near+by+Star+Kids+School,+Kota,+Rajasthan+324002',
    showContactDropdown: true,
    contactDropdownTitle: 'Quick Department Directory',
    columns: [
      {
        id: 'col-divisions',
        title: 'Our Divisions',
        links: [
          { label: 'Lithium Battery (EBS)', href: '/complaint/register?division=Battery' },
          { label: 'EV Spare Parts', href: '/complaint/register?division=Spare%20Parts' },
          { label: 'Drive Rental Support', href: '/complaint/register?division=Rental' },
          { label: 'Showroom Sales & Dealership', href: '/complaint/register?division=Showroom' },
        ],
      },
      {
        id: 'col-quicklinks',
        title: 'Quick Utilities',
        links: [
          { label: 'Track Support Ticket', href: '/complaint/track' },
          { label: 'Verify Battery Warranty', href: '/warranty/check' },
          { label: 'Showroom Invoice Lookup', href: '/showroom-billing' },
          { label: 'Customer Wallet & Coins', href: '/customer/login' },
        ],
      },
      {
        id: 'col-support',
        title: 'Support & Facility',
        links: [
          { label: 'Kota Plant Directory', href: '/contact' },
          { label: 'Helpline: +91 8949049003', href: 'tel:+918949049003', isExternal: true },
          { label: 'Smartdrive5640@gmail.com', href: 'mailto:Smartdrive5640@gmail.com', isExternal: true },
          { label: 'Kota Plant Google Map', href: 'https://maps.google.com/?q=Kota,Rajasthan', isExternal: true },
        ],
      },
    ],
  },
  privacyPolicy: {
    title: 'Privacy Policy',
    content: 'When you register a service complaint or product warranty on the Ekosmart Platform, we collect necessary personal details including your name, contact mobile number, email address, product serial number, and invoice details. Your information is used strictly to authenticate service requests via Email OTP, schedule inspections with authorized technical engineers, validate warranty validity for Showroom and Plant sales, and provide real-time ticket tracking updates. We implement strict database access controls and industry-standard encryption protocols.',
    isPublished: true,
  },
  termsConditions: {
    title: 'Terms & Conditions',
    content: 'By submitting a complaint or warranty registration on this portal, you confirm that all details provided (serial number, bill number, and issue descriptions) are accurate and authentic. Service complaints are categorized and handled under four designated divisions: Battery, Rental, Showroom, and Spare Parts. Warranty claims for commercial units fall under the Plant category. All registered warranties are subject to physical inspection by our certified engineers.',
    isPublished: true,
  },
  refundPolicy: {
    title: 'Refund & Replacement Policy',
    content: 'Defective battery cells and genuine spare parts verified under valid active warranty will be repaired or replaced free of charge by authorized Ekosmart service engineers within standard SLA timelines. Security deposits for EV rental plans are refunded to the original payment source within 5-7 business days following vehicle return and technical handover clearance.',
    isPublished: true,
  },
  contactInfo: {
    heading: 'We are here to support your green journey',
    subheading: 'Whether you need technical support for battery packs, spare parts dispatch, dealership queries, or rental assistance, our engineering and support teams in Kota are ready to assist you.',
    badgeText: 'GET IN TOUCH WITH US',
    helplinePhone: '+91 8949049003',
    alternatePhone: '+91 9549730483',
    whatsappNumber: '+91 8949049003',
    supportEmail: 'Smartdrive5640@gmail.com',
    salesEmail: 'sales@ekosmartdrive.in',
    plantAddress: 'Rang Talab, Near by Star Kids School, Kota, Rajasthan - 324002',
    officeHours: 'Mon - Sat: 10:00 AM - 6:30 PM',
    gstin: '08DTUPM4205B1Z0',
    website: 'www.ekosmartdrive.in',
    mapUrl: 'https://maps.google.com/?q=Kota,Rajasthan',
    dropdownOptions: [
      'Lithium Battery Solution (EBS)',
      'EV Spare Parts Wholesale/Retail',
      'Drive Rental Assistance',
      'Showroom & Dealership Inquiries',
      'Plant Commercial Warranty Inspection',
      'Accounts / Invoice Query',
      'Other General Inquiry',
    ],
    divisionContacts: [
      {
        id: 'div-con-battery',
        name: 'Lithium Battery Solution (EBS)',
        phone: '+91 8949049003',
        email: 'battery@ekosmartdrive.in',
        whatsapp: '+91 8949049003',
        inCharge: 'Lead Battery Diagnostic Engineer',
        officeHours: '10:00 AM - 6:30 PM (Mon - Sat)',
      },
      {
        id: 'div-con-parts',
        name: 'EV Spare Parts Wholesale/Retail',
        phone: '+91 8949049003',
        email: 'parts@ekosmartdrive.in',
        whatsapp: '+91 8949049003',
        inCharge: 'Parts Logistics Manager',
        officeHours: '10:00 AM - 6:30 PM (Mon - Sat)',
      },
      {
        id: 'div-con-rental',
        name: 'Drive Rental Assistance',
        phone: '+91 8949049003',
        email: 'rental@ekosmartdrive.in',
        whatsapp: '+91 8949049003',
        inCharge: 'Fleet Mobility Lead',
        officeHours: '24/7 Helpline Support',
      },
      {
        id: 'div-con-showroom',
        name: 'Showroom & Dealership Inquiries',
        phone: '+91 8949049003',
        email: 'showroom@ekosmartdrive.in',
        whatsapp: '+91 8949049003',
        inCharge: 'Dealership Franchise Head',
        officeHours: '10:00 AM - 7:00 PM',
      },
      {
        id: 'div-con-warranty',
        name: 'Plant Commercial Warranty Inspection',
        phone: '+91 8949049003',
        email: 'warranty@ekosmartdrive.in',
        whatsapp: '+91 8949049003',
        inCharge: 'Chief Quality Inspector',
        officeHours: '10:00 AM - 6:00 PM',
      },
    ],
    isPublished: true,
    // Softcoded Contact Cards
    cardHelplineTitle: 'Direct Helpline',
    cardHelplineSubtitle: 'Customer support & battery technician hotline',
    cardHelplineCallBtnText: 'Call Now',
    cardHelplineWhatsappBtnText: 'WhatsApp Us',
    cardEmailTitle: 'Official Email',
    cardEmailSubtitle: 'Direct technical query & corporate warranty inbox',
    cardEmailBtnText: 'Send Email',
    cardAddressTitle: 'Manufacturing Plant',
    cardAddressFacility: 'Kota Central Facility',
    cardAddressBtnText: 'View on Map',
    cardHoursTitle: 'Office & Plant Hours',
    cardHoursSubtitle: 'Technical dispatch & customer reception',
    cardHoursNote: 'Mon - Sat (Sun Closed)',
    // Plant Dossier Card
    dossierTitle: 'EBS EKOSMART',
    dossierSubtitle: 'BATTERY SOLUTION • LI-ION & LFP',
    dossierDescription:
      'Ekosmart Battery Solution (EBS) & Ekosmart EV Spare Parts operates a state-of-the-art battery assembly, testing, and laboratory diagnostics facility in Kota, Rajasthan.',
    corporateEntity: 'Ekosmart Battery Solution (EBS)',
    dossierBadgeText:
      'Pan-India technical assistance, battery replacement logistics, and warranty coverage active.',
    // Inquiry Form
    formTitle: 'Send an Official Inquiry',
    formSubtitle:
      'Have questions regarding dealership, bulk battery orders, or spare parts? Fill out the form below.',
    formQuickSelectLabel: 'QUICK SELECT DIVISION / CONCERN:',
    formButtonText: 'SUBMIT INQUIRY TO KOTA PLANT',
    formSuccessTitle: 'Inquiry Received!',
    formSuccessMessage:
      'Thank you. Our customer response team in Kota has received your message and will contact you shortly.',
    // Division Section Directory
    divisionSectionBadge: 'Department & Division Directory',
    divisionSectionTitle: 'Direct Contact Channels by Division',
    divisionSectionSubtitle:
      'Connect directly with our dedicated division engineers, parts managers, and franchise officers in Kota.',
  },
  customerLoginTimer: {
    enabled: true,
    durationSeconds: 20,
    title: 'Login to Continue',
    message: 'Please login with your email to access your customer account, wallet, referrals, bills and personalized services.',
  },
  batteryBanner: {
    isVisible: true,
    badgeText: 'GET HIGH POWER OF LITHIUM',
    badgeIcon: 'Zap',
    showBadge: true,
    badgeBgColor: '#059669',
    badgeTextColor: '#ecfdf5',
    badgeBorderColor: 'rgba(52, 211, 153, 0.4)',
    heading: 'Genuine Li-ion & LFP Batteries For E-Scooter & E-Rickshaw',
    headingColor: '#ffffff',
    subheading:
      'Engineered with advanced Smart BMS, thermal protection, and high energy density cells. Tested at our Kota plant with Pan-India dispatch & replacement support.',
    subheadingColor: '#93c5fd',
    highlight1: '48V Series (3 Year Warranty)',
    highlight1Icon: 'ShieldCheck',
    highlight1Color: '#34d399',
    highlight2: '60V / 72V Series (1.5 Year Warranty)',
    highlight2Icon: 'CheckCircle2',
    highlight2Color: '#38bdf8',
    highlight3: '100% Genuine Cells & Kota Plant Support',
    highlight3Icon: 'Award',
    highlight3Color: '#fbbf24',
    highlight4: 'Pan-India Replacement & Express Dispatch',
    highlight4Icon: 'Truck',
    highlight4Color: '#a78bfa',
    // Background Image Suite
    bgType: 'gradient',
    bgSolidColor: '#0f172a',
    bgGradientStart: '#0f172a',
    bgGradientEnd: '#1e3a8a',
    bgGradientDirection: 'to-br',
    bgImage: '',
    bgOverlayOpacity: 0.85,
    bgOverlayColor: '#090d16',
    bgPosition: 'center',
    bgSize: 'cover',
    bgBlur: 0,
    cardBorderColor: 'rgba(59, 130, 246, 0.3)',
    cardBorderRadius: 'rounded-2xl',
    cardShadow: 'shadow-xl',
    // Contacts & Assistance Card
    showContactCard: true,
    contactCardTitle: 'Need Battery Assistance?',
    contactCardSubtitle: 'Contact our factory technical engineers in Kota, Rajasthan',
    contactCardBgColor: 'rgba(255, 255, 255, 0.08)',
    contactCardBorderColor: 'rgba(255, 255, 255, 0.15)',
    contactLogoType: 'preset',
    contactLogoText: 'EBS KOTA PLANT',
    contactLogoImage: '',
    contactLogoBgColor: '#059669',
    contactLogoTextColor: '#ffffff',
    helplinePhone: '8949049003',
    helplineBtnText: 'Call +91 8949049003',
    helplineBtnBg: '#2563eb',
    helplineBtnTextColor: '#ffffff',
    plantBtnText: 'View Plant Contact Details',
    plantBtnLink: '/contact',
    plantBtnTarget: '_self',
    plantBtnBg: 'rgba(255, 255, 255, 0.12)',
    plantBtnTextColor: '#ffffff',
    showWhatsappBtn: true,
    whatsappNumber: '8949049003',
    whatsappBtnText: 'Chat on WhatsApp',
    whatsappBtnBg: '#25D366',
    whatsappBtnTextColor: '#ffffff',
    alternatePhone: '+91 8949049003',
    supportEmail: 'Smartdrive5640@gmail.com',
  },
  quickActionsConfig: {
    isVisible: true,
    sectionBadge: 'QUICK UTILITIES',
    showSectionBadge: false,
    sectionTitle: 'Quick Access Directory',
    sectionSubtitle: 'Essential customer services and warranty utilities',
    showSectionHeader: false,
    bgType: 'color',
    bgColor: '#ffffff',
    bgGradientStart: '#0f172a',
    bgGradientEnd: '#1e293b',
    bgGradientDirection: 'to-r',
    bgImage: '',
    bgOverlayOpacity: 0.8,
    bgOverlayColor: '#000000',
    bgPosition: 'center',
    bgSize: 'cover',
    bgBlur: 0,
    cardBgColor: '#ffffff',
    cardBorderColor: '#e2e8f0',
    cardBorderRadius: 'rounded-3xl',
    cardShadow: 'shadow-sm',
    showDividers: true,
    dividerColor: '#e2e8f0',
    textColor: '#1e293b',
    subtitleColor: '#64748b',
    layoutStyle: 'horizontal',
  },
  quickActions: [
    {
      id: 'act-track',
      title: 'Track Ticket',
      subtitle: 'Live complaint inspection status',
      url: '/complaint/track',
      icon: 'Search',
      iconType: 'icon',
      iconImage: '',
      color: 'blue',
      customColor: '',
      customBg: '',
      customTextColor: '',
      isVisible: true,
      order: 1,
      target: '_self',
      showExternalIcon: false,
      badge: '',
      badgeColor: '',
    },
    {
      id: 'act-warranty-reg',
      title: 'Warranty Registration',
      subtitle: 'Register new sales & serial number',
      url: '/warranty/register',
      icon: 'ShieldCheck',
      iconType: 'icon',
      iconImage: '',
      color: 'amber',
      customColor: '',
      customBg: '',
      customTextColor: '',
      isVisible: true,
      order: 2,
      target: '_blank',
      showExternalIcon: true,
      badge: '',
      badgeColor: '',
    },
    {
      id: 'act-warranty-check',
      title: 'Check Warranty',
      subtitle: '3-Yr (48V) & 1.5-Yr (60V/72V) status',
      url: '/warranty/check',
      icon: 'ShieldAlert',
      iconType: 'icon',
      iconImage: '',
      color: 'emerald',
      customColor: '',
      customBg: '',
      customTextColor: '',
      isVisible: true,
      order: 3,
      target: '_blank',
      showExternalIcon: true,
      badge: '',
      badgeColor: '',
    },
    {
      id: 'act-contact',
      title: 'Contact Directory',
      subtitle: 'Kota Plant +91 8949049003',
      url: '/contact',
      icon: 'Phone',
      iconType: 'icon',
      iconImage: '',
      color: 'purple',
      customColor: '',
      customBg: '',
      customTextColor: '',
      isVisible: true,
      order: 4,
      target: '_self',
      showExternalIcon: false,
      badge: '',
      badgeColor: '',
    },
  ],
  themeColors: {
    primary: '#059669',
    primaryHover: '#047857',
    secondary: '#0f172a',
    secondaryHover: '#1e293b',
    accent: '#10b981',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#1e293b',
    textMuted: '#64748b',
    border: '#e2e8f0',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  sectionLayouts: {
    hero: { isVisible: true, maxWidth: '1280px', paddingTop: '4rem', paddingBottom: '5rem' },
    quickActions: { isVisible: true, maxWidth: '1280px', paddingTop: '2rem', paddingBottom: '2rem' },
    serviceCards: { isVisible: true, maxWidth: '1280px', paddingTop: '2rem', paddingBottom: '2rem' },
    rewards: { isVisible: true, maxWidth: '1280px', paddingTop: '2rem', paddingBottom: '2rem' },
    batteryBanner: { isVisible: true, maxWidth: '1280px', paddingTop: '2rem', paddingBottom: '3rem' },
    contact: { isVisible: true, maxWidth: '1280px', paddingTop: '2rem', paddingBottom: '3rem' },
    footer: { isVisible: true, maxWidth: '1280px', paddingTop: '3rem', paddingBottom: '3rem' },
  },
};

const renderLivePreviewIcon = (card: IServiceCard) => {
  if (card.iconType === 'image' && card.iconImage) {
    return <img src={card.iconImage} alt={card.title} className="w-8 h-8 object-contain mx-auto" />;
  }
  const iconProps = { className: 'w-7 h-7 mx-auto' };
  switch (card.icon?.toLowerCase()) {
    case 'store':
    case 'showroom':
      return <Store {...iconProps} />;
    case 'bike':
    case 'scooter':
      return <Bike {...iconProps} />;
    case 'settings':
      return <Settings {...iconProps} />;
    case 'battery':
      return <Battery {...iconProps} />;
    case 'wrench':
      return <Wrench {...iconProps} />;
    case 'truck':
      return <Truck {...iconProps} />;
    case 'search':
      return <Search {...iconProps} />;
    case 'shieldcheck':
      return <ShieldCheck {...iconProps} />;
    case 'shieldalert':
      return <ShieldAlert {...iconProps} />;
    case 'zap':
      return <Zap {...iconProps} />;
    case 'package':
      return <Package {...iconProps} />;
    case 'phone':
      return <Phone {...iconProps} />;
    case 'activity':
      return <Activity {...iconProps} />;
    case 'helpcircle':
      return <HelpCircle {...iconProps} />;
    default:
      return <FileText {...iconProps} />;
  }
};

const getCardPreviewTheme = (color: string) => {
  switch (color?.toLowerCase()) {
    case 'emerald':
    case 'green':
      return {
        cardBg: 'bg-[#16a34a]',
        btnText: 'text-[#15803d]',
        badgeBg: 'bg-emerald-900/60 text-emerald-200 border-emerald-400/40',
        iconColor: 'text-[#16a34a]',
      };
    case 'blue':
      return {
        cardBg: 'bg-[#2563eb]',
        btnText: 'text-[#1e40af]',
        badgeBg: 'bg-blue-900/60 text-blue-200 border-blue-400/40',
        iconColor: 'text-[#2563eb]',
      };
    case 'purple':
    case 'violet':
      return {
        cardBg: 'bg-[#7c3aed]',
        btnText: 'text-[#581c87]',
        badgeBg: 'bg-purple-900/60 text-purple-200 border-purple-400/40',
        iconColor: 'text-[#7c3aed]',
      };
    case 'amber':
    case 'orange':
      return {
        cardBg: 'bg-[#d97706]',
        btnText: 'text-[#b45309]',
        badgeBg: 'bg-amber-900/60 text-amber-200 border-amber-400/40',
        iconColor: 'text-[#d97706]',
      };
    case 'teal':
      return {
        cardBg: 'bg-[#0f766e]',
        btnText: 'text-[#115e59]',
        badgeBg: 'bg-teal-900/60 text-teal-200 border-teal-400/40',
        iconColor: 'text-[#0f766e]',
      };
    case 'indigo':
      return {
        cardBg: 'bg-[#4f46e5]',
        btnText: 'text-[#4338ca]',
        badgeBg: 'bg-indigo-900/60 text-indigo-200 border-indigo-400/40',
        iconColor: 'text-[#4f46e5]',
      };
    case 'rose':
    case 'red':
      return {
        cardBg: 'bg-[#e11d48]',
        btnText: 'text-[#be123c]',
        badgeBg: 'bg-rose-900/60 text-rose-200 border-rose-400/40',
        iconColor: 'text-[#e11d48]',
      };
    case 'cyan':
      return {
        cardBg: 'bg-[#0891b2]',
        btnText: 'text-[#0e7490]',
        badgeBg: 'bg-cyan-900/60 text-cyan-200 border-cyan-400/40',
        iconColor: 'text-[#0891b2]',
      };
    case 'slate':
    default:
      return {
        cardBg: 'bg-[#334155]',
        btnText: 'text-[#1e293b]',
        badgeBg: 'bg-slate-900/60 text-slate-200 border-slate-400/40',
        iconColor: 'text-[#334155]',
      };
  }
};

const compressImageFile = (
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<string> => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      const r = new FileReader();
      r.onload = (e) => resolve((e.target?.result as string) || '');
      r.readAsDataURL(file);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const format = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          const dataUrl = canvas.toDataURL(format, quality);
          resolve(dataUrl);
        } else {
          resolve((e.target?.result as string) || '');
        }
      };
      img.onerror = () => resolve((e.target?.result as string) || '');
      img.src = (e.target?.result as string) || '';
    };
    reader.readAsDataURL(file);
  });
};

const ContentManager = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const validTabs = ['cards', 'hero', 'rewards', 'banner', 'policies', 'footer', 'contact', 'loginTimer', 'theme', 'layouts', 'navbar'] as const;
  type TabType = (typeof validTabs)[number];

  const paramTab = searchParams.get('tab');
  const initialTab: TabType = paramTab && (validTabs as readonly string[]).includes(paramTab) ? (paramTab as TabType) : 'cards';

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [contactSubTab, setContactSubTab] = useState<'all' | 'cards' | 'dossier' | 'form' | 'divisions' | 'header' | 'coordinates'>('all');
  const [navPreviewMode, setNavPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && (validTabs as readonly string[]).includes(tabParam)) {
      setActiveTab(tabParam as TabType);
    }
  }, [searchParams]);

  const handleTabChange = (newTab: TabType) => {
    setActiveTab(newTab);
    if (newTab === 'cards') {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('tab');
      setSearchParams(nextParams);
    } else {
      setSearchParams({ tab: newTab });
    }
  };

  const [content, setContent] = useState<ICMSContent>(defaultFallbackContent);
  const [referralSettings, setReferralSettings] = useState<{
    enabled: boolean;
    welcomeRewardCoins: number;
    batteryCoins: number;
    showroomCoins: number;
    referrerReward: number;
    newCustomerReward: number;
    serviceReward: number;
    serviceRedemptionValue: number;
    coinConversionRate: number;
  }>({
    enabled: true,
    welcomeRewardCoins: 0,
    batteryCoins: 500,
    showroomCoins: 250,
    referrerReward: 500,
    newCustomerReward: 500,
    serviceReward: 250,
    serviceRedemptionValue: 200,
    coinConversionRate: 1,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [newDropdownOption, setNewDropdownOption] = useState<string>('');
  const [selectedSectionFilter, setSelectedSectionFilter] = useState<string>('all');
  const [expandedDivision, setExpandedDivision] = useState<string | null>(null);

  // Dedicated Single Modal State for Adding / Editing Cards (Prevents duplicate fields)
  const [cardModalOpen, setCardModalOpen] = useState<boolean>(false);
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);
  const [cardDraft, setCardDraft] = useState<IServiceCard | null>(null);
  const [draftFeatureText, setDraftFeatureText] = useState<string>('');

  // Dedicated Modal & Preview State for Quick Actions
  const [actionModalOpen, setActionModalOpen] = useState<boolean>(false);
  const [editingActionIndex, setEditingActionIndex] = useState<number | null>(null);
  const [actionDraft, setActionDraft] = useState<IQuickActionItem | null>(null);
  const [quickActionPreviewDevice, setQuickActionPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [batteryPreviewDevice, setBatteryPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const getDivisionContact = (optName: string): IDivisionContact => {
    const existing = (content.contactInfo?.divisionContacts || []).find(
      (c) => c.name.trim().toLowerCase() === optName.trim().toLowerCase()
    );
    if (existing) return existing;
    return {
      name: optName,
      phone: content.contactInfo?.helplinePhone || '+91 8949049003',
      email: content.contactInfo?.supportEmail || 'Smartdrive5640@gmail.com',
      whatsapp: content.contactInfo?.whatsappNumber || '+91 8949049003',
      inCharge: 'Department In-Charge',
      officeHours: content.contactInfo?.officeHours || '10:00 AM - 6:30 PM (Mon - Sat)',
    };
  };

  const updateDivisionContact = (optName: string, field: keyof IDivisionContact, value: string) => {
    const currentList = [...(content.contactInfo?.divisionContacts || [])];
    const idx = currentList.findIndex((c) => c.name.trim().toLowerCase() === optName.trim().toLowerCase());
    if (idx >= 0) {
      currentList[idx] = { ...currentList[idx], [field]: value };
    } else {
      currentList.push({
        ...getDivisionContact(optName),
        [field]: value,
      });
    }
    setContent({
      ...content,
      contactInfo: {
        ...content.contactInfo,
        divisionContacts: currentList,
      },
    });
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const normalizeServiceCards = (cards: IServiceCard[]) => {
    const seenIds = new Set<string>();
    return (cards || []).map((card, idx) => {
      let section = card.section;
      if (!section || section === 'General') {
        const lower = `${card.id || ''} ${card.title || ''}`.toLowerCase();
        if (lower.includes('showroom')) section = 'Showroom';
        else if (lower.includes('rental')) section = 'Rental';
        else if (lower.includes('spare') || lower.includes('parts')) section = 'Spare Parts';
        else if (lower.includes('battery')) section = 'Battery';
        else if (lower.includes('warranty')) section = 'Warranty';
        else section = section || 'General';
      }
      let cardId = card.id || `card-${Date.now()}-${idx}`;
      if (seenIds.has(cardId)) {
        cardId = `card-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`;
      }
      seenIds.add(cardId);
      return {
        ...card,
        id: cardId,
        section,
        order: card.order || idx + 1,
        features: Array.isArray(card.features) ? card.features : [],
      };
    });
  };

  const fetchContent = async () => {
    try {
      setLoading(true);
      const [res, refRes] = await Promise.allSettled([
        contentApi.getAdmin(),
        customerApi.getReferralSettings(),
      ]);

      if (res.status === 'fulfilled' && res.value.data.success && res.value.data.data) {
        const d = res.value.data.data;
        setContent({
          ...defaultFallbackContent,
          ...d,
          serviceCards: normalizeServiceCards(d.serviceCards || defaultFallbackContent.serviceCards),
          contactInfo: d.contactInfo ? { ...defaultFallbackContent.contactInfo, ...d.contactInfo } : defaultFallbackContent.contactInfo,
          batteryBanner: d.batteryBanner ? { ...defaultFallbackContent.batteryBanner, ...d.batteryBanner } : defaultFallbackContent.batteryBanner,
          quickActionsConfig: d.quickActionsConfig || defaultFallbackContent.quickActionsConfig,
          quickActions: d.quickActions && d.quickActions.length > 0 ? d.quickActions : defaultFallbackContent.quickActions,
        });
      }

      if (refRes.status === 'fulfilled' && refRes.value.data.success && refRes.value.data.data) {
        setReferralSettings(refRes.value.data.data);
      }
    } catch (err: any) {
      console.warn('Admin content fetch failed, trying public fallback:', err);
      try {
        const pubRes = await fetch(`${API_BASE_URL}/content/public`);
        const pubData = await pubRes.json();
        if (pubData.success && pubData.data) {
          const pd = pubData.data;
          setContent({
            ...defaultFallbackContent,
            ...pd,
            hero: pd.hero || defaultFallbackContent.hero,
            serviceCards: normalizeServiceCards(pd.serviceCards || defaultFallbackContent.serviceCards),
            footer: pd.footer || defaultFallbackContent.footer,
            privacyPolicy: pd.privacyPolicy || defaultFallbackContent.privacyPolicy,
            termsConditions: pd.termsConditions || defaultFallbackContent.termsConditions,
            refundPolicy: pd.refundPolicy || defaultFallbackContent.refundPolicy,
            contactInfo: pd.contactInfo ? { ...defaultFallbackContent.contactInfo, ...pd.contactInfo } : defaultFallbackContent.contactInfo,
            batteryBanner: pd.batteryBanner || defaultFallbackContent.batteryBanner,
            quickActionsConfig: pd.quickActionsConfig || defaultFallbackContent.quickActionsConfig,
            quickActions: pd.quickActions || defaultFallbackContent.quickActions,
          });
          if (pd.referralSettings) {
            setReferralSettings((prev) => ({ ...prev, ...pd.referralSettings }));
          }
        }
      } catch (fallbackErr) {
        console.error('Failed to load fallback CMS content:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    try {
      setSaving(true);
      setNotification(null);
      const [res] = await Promise.all([
        contentApi.updateAdmin(content),
        customerApi.updateReferralSettings(referralSettings).catch((err) => {
          console.warn('Referral settings update warning:', err);
        }),
      ]);
      if (res.data.success) {
        setContent({
          ...defaultFallbackContent,
          ...res.data.data,
          serviceCards: normalizeServiceCards(res.data.data.serviceCards || defaultFallbackContent.serviceCards),
          batteryBanner: res.data.data.batteryBanner || defaultFallbackContent.batteryBanner,
          quickActionsConfig: res.data.data.quickActionsConfig || defaultFallbackContent.quickActionsConfig,
          quickActions: res.data.data.quickActions || defaultFallbackContent.quickActions,
        });
        setNotification({
          type: 'success',
          message: 'Soft-coded CMS content & wallet rewards saved successfully!',
        });
        setTimeout(() => setNotification(null), 4000);
      } else {
        setNotification({
          type: 'error',
          message: res.data.message || 'Failed to save CMS changes',
        });
      }
    } catch (err: any) {
      console.error('Failed to save CMS changes:', err);
      const errorMsg =
        err.response?.data?.message ||
        (err.response?.status === 413
          ? 'Uploaded image files are too large. Please upload smaller images.'
          : err.response?.status === 401
          ? 'Admin session expired. Please log in again.'
          : err.message === 'Network Error'
          ? 'Network Error: Cannot connect to Backend API. Please check backend server status or custom API URL.'
          : err.message || 'Failed to save CMS changes');
      setNotification({
        type: 'error',
        message: errorMsg,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (
      !window.confirm(
        'Are you sure you want to reset all CMS content to previous default data? This will restore the 4 default service cards (Showroom, Rental, Spare Parts, Lithium Battery), previous clean hero text, battery banner, and legal policies.'
      )
    ) {
      return;
    }
    try {
      setSaving(true);
      const res = await contentApi.resetDefaults();
      if (res.data.success) {
        setContent(res.data.data);
        setSelectedSectionFilter('all');
        setNotification({
          type: 'success',
          message: 'CMS content successfully reset to previous default data!',
        });
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err: any) {
      console.error('Reset defaults failed:', err);
      try {
        const updateRes = await contentApi.updateAdmin(defaultFallbackContent);
        if (updateRes.data.success) {
          setContent(updateRes.data.data);
          setSelectedSectionFilter('all');
          setNotification({
            type: 'success',
            message: 'CMS content successfully reset to previous default data!',
          });
          setTimeout(() => setNotification(null), 4000);
        }
      } catch (e: any) {
        setNotification({
          type: 'error',
          message: e.response?.data?.message || 'Failed to reset defaults.',
        });
      }
    } finally {
      setSaving(false);
    }
  };

  // Card Handlers with Single-Instance Modal
  const handleOpenAddCard = (sectionPreset?: string) => {
    if (!content) return;
    const targetSection = sectionPreset && sectionPreset !== 'all' ? sectionPreset : 'General';
    const newCard: IServiceCard = {
      id: `card-${Date.now()}`,
      title: 'New Service Card',
      subtitle: `${targetSection} Support`,
      description: 'Add a helpful description for this customer action or support service.',
      section: targetSection,
      badge: 'NEW',
      features: ['24/7 Dedicated Support', 'Fast SLA Resolution'],
      linkUrl: `/complaint/register?division=${encodeURIComponent(targetSection)}`,
      buttonText: 'Select Service',
      color: targetSection === 'Battery' ? 'teal' : targetSection === 'Rental' ? 'blue' : targetSection === 'Spare Parts' ? 'purple' : targetSection === 'Showroom' ? 'emerald' : 'emerald',
      icon: targetSection === 'Battery' ? 'Battery' : targetSection === 'Rental' ? 'Bike' : targetSection === 'Spare Parts' ? 'Settings' : targetSection === 'Showroom' ? 'Store' : 'FileText',
      iconType: 'icon',
      iconImage: '',
      bgType: 'color',
      bgImage: '',
      bgOverlayOpacity: 70,
      isVisible: true,
      order: (content?.serviceCards?.length || 0) + 1,
    };
    setCardDraft(newCard);
    setEditingCardIndex(null);
    setDraftFeatureText('');
    setCardModalOpen(true);
  };

  const handleOpenEditCard = (index: number) => {
    const cardToEdit = content.serviceCards[index];
    if (!cardToEdit) return;
    setCardDraft({
      ...cardToEdit,
      features: cardToEdit.features ? [...cardToEdit.features] : [],
    });
    setEditingCardIndex(index);
    setDraftFeatureText('');
    setCardModalOpen(true);
  };

  const handleCloseCardModal = () => {
    setCardModalOpen(false);
    setCardDraft(null);
    setEditingCardIndex(null);
    setDraftFeatureText('');
  };

  const handleSaveCardDraft = async () => {
    if (!cardDraft || !content) return;
    const updatedCards = [...content.serviceCards];
    if (editingCardIndex !== null && editingCardIndex >= 0 && editingCardIndex < updatedCards.length) {
      updatedCards[editingCardIndex] = cardDraft;
    } else {
      updatedCards.push({
        ...cardDraft,
        order: updatedCards.length + 1,
      });
    }
    const updatedContent = {
      ...content,
      serviceCards: updatedCards,
    };
    setContent(updatedContent);
    handleCloseCardModal();

    try {
      setSaving(true);
      const res = await contentApi.updateAdmin(updatedContent);
      if (res.data.success) {
        setContent(res.data.data);
        setNotification({
          type: 'success',
          message: `Card "${cardDraft.title}" saved and published live across homepage and divisions!`,
        });
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err: any) {
      console.error('Failed to auto-save card:', err);
      setNotification({
        type: 'error',
        message: 'Draft saved in browser. Please click "Save All Changes" at top to sync with server.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicateCard = async (index: number) => {
    if (!content) return;
    const original = content.serviceCards[index];
    const copyCard: IServiceCard = {
      ...original,
      id: `card-${Date.now()}`,
      title: `${original.title} (Copy)`,
      order: content.serviceCards.length + 1,
      features: original.features ? [...original.features] : [],
    };
    const updatedCards = [...content.serviceCards, copyCard];
    const updatedContent = { ...content, serviceCards: updatedCards };
    setContent(updatedContent);

    try {
      setSaving(true);
      const res = await contentApi.updateAdmin(updatedContent);
      if (res.data.success) {
        setContent(res.data.data);
        setNotification({
          type: 'success',
          message: `Duplicated "${original.title}" and published live!`,
        });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch {
      setNotification({
        type: 'success',
        message: `Duplicated "${original.title}". Click "Save All Changes" to publish.`,
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleCardVisibility = async (index: number) => {
    if (!content) return;
    const updatedCards = [...content.serviceCards];
    updatedCards[index] = {
      ...updatedCards[index],
      isVisible: !updatedCards[index].isVisible,
    };
    const updatedContent = { ...content, serviceCards: updatedCards };
    setContent(updatedContent);

    try {
      setSaving(true);
      const res = await contentApi.updateAdmin(updatedContent);
      if (res.data.success) {
        setContent(res.data.data);
      }
    } catch (err) {
      console.error('Failed to auto-save visibility:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCard = async (index: number) => {
    if (!content) return;
    const cardToDelete = content.serviceCards[index];
    const cardTitle = cardToDelete?.title || cardToDelete?.section || 'this card';

    if (
      !window.confirm(
        `Are you sure you want to permanently delete "${cardTitle}"? It will be removed from the homepage.`
      )
    ) {
      return;
    }

    const updatedCards = content.serviceCards.filter((_, i) => i !== index);
    const updatedContent = { ...content, serviceCards: updatedCards };
    setContent(updatedContent);

    const remainingSections = Array.from(new Set(updatedCards.map((c) => (c.section || '').trim()).filter(Boolean)));
    if (selectedSectionFilter !== 'all' && !remainingSections.some((s) => s.toLowerCase() === selectedSectionFilter.toLowerCase())) {
      setSelectedSectionFilter('all');
    }

    try {
      setSaving(true);
      const res = await contentApi.updateAdmin(updatedContent);
      if (res.data.success) {
        setContent(res.data.data);
        setNotification({
          type: 'success',
          message: `Service card "${cardTitle}" deleted successfully!`,
        });
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err: any) {
      console.error('Failed to auto-save after delete:', err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete card on server.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleMoveCard = async (index: number, direction: 'up' | 'down') => {
    if (!content) return;
    const cards = [...content.serviceCards];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= cards.length) return;

    const temp = cards[index];
    cards[index] = cards[targetIndex];
    cards[targetIndex] = temp;

    const reordered = cards.map((c, idx) => ({ ...c, order: idx + 1 }));
    const updatedContent = { ...content, serviceCards: reordered };
    setContent(updatedContent);

    try {
      setSaving(true);
      const res = await contentApi.updateAdmin(updatedContent);
      if (res.data.success) {
        setContent(res.data.data);
      }
    } catch (err) {
      console.error('Failed to auto-save reorder:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddDraftFeature = () => {
    const text = draftFeatureText.trim();
    if (!text || !cardDraft) return;
    setCardDraft({
      ...cardDraft,
      features: [...(cardDraft.features || []), text],
    });
    setDraftFeatureText('');
  };

  const handleRemoveDraftFeature = (featureIndex: number) => {
    if (!cardDraft) return;
    setCardDraft({
      ...cardDraft,
      features: (cardDraft.features || []).filter((_, fIdx) => fIdx !== featureIndex),
    });
  };

  const handleUpdateDraftFeature = (featureIndex: number, value: string) => {
    if (!cardDraft) return;
    const updatedFeatures = [...(cardDraft.features || [])];
    updatedFeatures[featureIndex] = value;
    setCardDraft({
      ...cardDraft,
      features: updatedFeatures,
    });
  };

  // Quick Actions Management Handlers
  const handleOpenAddAction = () => {
    const nextOrder = (content.quickActions?.length || 0) + 1;
    setActionDraft({
      id: `act-${Date.now()}`,
      title: 'New Quick Utility',
      subtitle: 'Instant access action description',
      url: '/complaint/register',
      icon: 'Zap',
      iconType: 'icon',
      iconImage: '',
      color: 'blue',
      customColor: '',
      customBg: '',
      customTextColor: '',
      isVisible: true,
      order: nextOrder,
      target: '_self',
      showExternalIcon: false,
      badge: '',
      badgeColor: '',
    });
    setEditingActionIndex(null);
    setActionModalOpen(true);
  };

  const handleOpenEditAction = (index: number) => {
    const item = (content.quickActions || defaultFallbackContent.quickActions || [])[index];
    if (!item) return;
    setActionDraft({ ...item });
    setEditingActionIndex(index);
    setActionModalOpen(true);
  };

  const handleSaveActionDraft = () => {
    if (!actionDraft) return;
    const currentActions = [...(content.quickActions || defaultFallbackContent.quickActions || [])];
    if (editingActionIndex !== null && editingActionIndex >= 0 && editingActionIndex < currentActions.length) {
      currentActions[editingActionIndex] = { ...actionDraft };
    } else {
      currentActions.push({ ...actionDraft, order: currentActions.length + 1 });
    }
    setContent({ ...content, quickActions: currentActions });
    setActionModalOpen(false);
    setActionDraft(null);
    setEditingActionIndex(null);
  };

  const handleDeleteAction = (index: number) => {
    const currentActions = [...(content.quickActions || defaultFallbackContent.quickActions || [])];
    currentActions.splice(index, 1);
    const reordered = currentActions.map((a, i) => ({ ...a, order: i + 1 }));
    setContent({ ...content, quickActions: reordered });
  };

  const handleDuplicateAction = (index: number) => {
    const currentActions = [...(content.quickActions || defaultFallbackContent.quickActions || [])];
    const source = currentActions[index];
    if (!source) return;
    const cloned: IQuickActionItem = {
      ...source,
      id: `act-${Date.now()}`,
      title: `${source.title} (Copy)`,
      order: currentActions.length + 1,
    };
    currentActions.splice(index + 1, 0, cloned);
    const reordered = currentActions.map((a, i) => ({ ...a, order: i + 1 }));
    setContent({ ...content, quickActions: reordered });
  };

  const handleMoveAction = (index: number, direction: 'up' | 'down') => {
    const currentActions = [...(content.quickActions || defaultFallbackContent.quickActions || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= currentActions.length) return;
    const temp = currentActions[index];
    currentActions[index] = currentActions[targetIdx];
    currentActions[targetIdx] = temp;
    const reordered = currentActions.map((a, i) => ({ ...a, order: i + 1 }));
    setContent({ ...content, quickActions: reordered });
  };

  const handleResetQuickActions = () => {
    if (window.confirm('Reset Quick Actions section and items to factory default?')) {
      setContent({
        ...content,
        quickActionsConfig: defaultFallbackContent.quickActionsConfig,
        quickActions: defaultFallbackContent.quickActions,
      });
    }
  };

  const renderQuickActionIconPreview = (action: IQuickActionItem) => {
    if (action.iconType === 'image' && action.iconImage) {
      return (
        <img
          src={resolveImageUrl(action.iconImage)}
          alt={action.title}
          className="w-5 h-5 object-contain"
        />
      );
    }
    const iconProps = { size: 20 };
    switch (action.icon?.toLowerCase()) {
      case 'search':
      case 'track':
        return <Search {...iconProps} />;
      case 'shieldcheck':
      case 'shield-check':
      case 'shield':
      case 'warranty':
        return <ShieldCheck {...iconProps} />;
      case 'shieldalert':
      case 'shield-alert':
        return <ShieldAlert {...iconProps} />;
      case 'phone':
      case 'contact':
        return <Phone {...iconProps} />;
      case 'wrench':
      case 'tool':
        return <Wrench {...iconProps} />;
      case 'clock':
        return <Clock {...iconProps} />;
      case 'mappin':
      case 'map':
        return <MapPin {...iconProps} />;
      case 'mail':
        return <Mail {...iconProps} />;
      case 'zap':
        return <Zap {...iconProps} />;
      case 'battery':
        return <Battery {...iconProps} />;
      case 'coins':
        return <Coins {...iconProps} />;
      case 'gift':
        return <Gift {...iconProps} />;
      case 'package':
        return <Package {...iconProps} />;
      case 'settings':
        return <Settings {...iconProps} />;
      case 'activity':
        return <Activity {...iconProps} />;
      case 'helpcircle':
      case 'help':
        return <HelpCircle {...iconProps} />;
      default:
        return <FileText {...iconProps} />;
    }
  };

  const getActionColorStylesAdmin = (color: string, customBg?: string, customColor?: string) => {
    if (customBg || customColor) {
      return {
        bg: '',
        text: '',
        style: {
          backgroundColor: customBg || 'rgba(59, 130, 246, 0.1)',
          color: customColor || '#2563eb',
        },
      };
    }
    switch (color?.toLowerCase()) {
      case 'amber':
      case 'orange':
        return { bg: 'bg-amber-50 text-amber-600', text: 'text-amber-600', style: {} };
      case 'emerald':
      case 'green':
        return { bg: 'bg-emerald-50 text-emerald-600', text: 'text-emerald-600', style: {} };
      case 'purple':
      case 'violet':
        return { bg: 'bg-purple-50 text-purple-600', text: 'text-purple-600', style: {} };
      case 'indigo':
        return { bg: 'bg-indigo-50 text-indigo-600', text: 'text-indigo-600', style: {} };
      case 'rose':
      case 'red':
        return { bg: 'bg-rose-50 text-rose-600', text: 'text-rose-600', style: {} };
      case 'cyan':
        return { bg: 'bg-cyan-50 text-cyan-600', text: 'text-cyan-600', style: {} };
      case 'teal':
        return { bg: 'bg-teal-50 text-teal-600', text: 'text-teal-600', style: {} };
      case 'slate':
      case 'dark':
        return { bg: 'bg-slate-100 text-slate-800', text: 'text-slate-900', style: {} };
      case 'blue':
      default:
        return { bg: 'bg-blue-50 text-blue-600', text: 'text-blue-600', style: {} };
    }
  };

  // Derive unique section list dynamically strictly from existing cards (no ghost sections)
  const dynamicSections = Array.from(
    new Set(
      (content?.serviceCards || [])
        .map((c) => (c.section || '').trim())
        .filter(Boolean)
    )
  );

  useEffect(() => {
    if (
      selectedSectionFilter !== 'all' &&
      !dynamicSections.some((s) => s.toLowerCase() === selectedSectionFilter.toLowerCase())
    ) {
      setSelectedSectionFilter('all');
    }
  }, [content?.serviceCards, selectedSectionFilter]);

  const displayedCards = content.serviceCards
    .map((card, originalIndex) => ({ card, originalIndex }))
    .filter(({ card }) => {
      if (selectedSectionFilter === 'all') return true;
      return (card.section || 'General').toLowerCase() === selectedSectionFilter.toLowerCase();
    });

  const updateThemeColor = (key: keyof IThemeColors, value: string) => {
    const current = content.themeColors || defaultFallbackContent.themeColors || ({} as IThemeColors);
    setContent({
      ...content,
      themeColors: {
        ...current,
        [key]: value,
      },
    });
  };

  const applyThemePreset = (preset: {
    primary: string;
    primaryHover: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
  }) => {
    setContent({
      ...content,
      themeColors: {
        ...(content.themeColors || defaultFallbackContent.themeColors || {}),
        ...preset,
      },
    });
  };

  const updateSectionLayout = (sectionKey: keyof ISectionLayouts, patch: Partial<ISectionLayoutStyle>) => {
    const currentLayouts = content.sectionLayouts || defaultFallbackContent.sectionLayouts || {};
    const currentSection = currentLayouts[sectionKey] || {};
    setContent({
      ...content,
      sectionLayouts: {
        ...currentLayouts,
        [sectionKey]: {
          ...currentSection,
          ...patch,
        },
      },
    });
  };

  const SectionSaveButton = ({
    label = 'Save Changes',
    compact = false,
    className = '',
  }: {
    label?: string;
    compact?: boolean;
    className?: string;
  }) => (
    <button
      type="button"
      onClick={handleSave}
      disabled={saving}
      className={`px-3.5 py-1.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-xl ${
        compact ? 'text-[11px] py-1 px-2.5' : 'text-xs'
      } font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer shrink-0 ${className}`}
    >
      <Save size={compact ? 12 : 13} />
      <span>{saving ? 'Saving...' : label}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <LayoutTemplate className="text-green-600" />
            Soft-Coded Content Manager (CMS)
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Edit live homepage flash cards, section divisions, hero slogans, legal policies, and footer links without modifying code.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            disabled={saving}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            title="Restore original 4 service cards and previous clean default data"
          >
            <RotateCcw size={14} className={saving ? 'animate-spin' : ''} />
            <span>Reset to Previous Default Data</span>
          </button>
          <a
            href={FRONTEND_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-xl text-slate-700 text-xs font-semibold transition"
          >
            <span>Live Frontend</span>
            <ExternalLink size={14} />
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Save size={16} />
            <span>{saving ? 'Saving Changes...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-3 ${
            notification.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-2 overflow-x-auto">
        <button
          onClick={() => handleTabChange('cards')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'cards'
              ? 'border-green-600 text-green-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CreditCard size={18} />
          <span>Flash / Service Cards ({content.serviceCards.length})</span>
        </button>

        <button
          onClick={() => handleTabChange('hero')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'hero'
              ? 'border-green-600 text-green-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutTemplate size={18} />
          <span>Hero & Header</span>
        </button>

        <button
          onClick={() => handleTabChange('rewards')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'rewards'
              ? 'border-green-600 text-green-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Coins size={18} className="text-amber-500" />
          <span>Customer Rewards & Wallet</span>
        </button>

        <button
          onClick={() => handleTabChange('banner')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'banner'
              ? 'border-green-600 text-green-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Battery size={18} className="text-teal-600" />
          <span>Battery Assistance & Quick Actions</span>
        </button>

        <button
          onClick={() => handleTabChange('policies')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'policies'
              ? 'border-green-600 text-green-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield size={18} />
          <span>Policies & Compliance</span>
        </button>

        <button
          onClick={() => handleTabChange('footer')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'footer'
              ? 'border-green-600 text-green-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText size={18} />
          <span>Footer & Branding</span>
        </button>

        <button
          onClick={() => handleTabChange('contact')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'contact'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/60'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Phone size={18} className="text-emerald-600" />
          <span>Contact Us Page (Cards, Dossier, Form)</span>
          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            Softcoded
          </span>
        </button>

        <button
          onClick={() => handleTabChange('loginTimer')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'loginTimer'
              ? 'border-green-600 text-green-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock size={18} />
          <span>Customer Login Timer ({content.customerLoginTimer?.durationSeconds || 20}s)</span>
        </button>

        <button
          onClick={() => handleTabChange('theme')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'theme'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/60'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Palette size={18} className="text-emerald-600" />
          <span>Theme & Custom Colors</span>
          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            Design Tokens
          </span>
        </button>

        <button
          onClick={() => handleTabChange('layouts')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'layouts'
              ? 'border-blue-600 text-blue-800 bg-blue-50/60'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders size={18} className="text-blue-600" />
          <span>Section Layouts</span>
          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
            Soft-Coded
          </span>
        </button>

        <button
          onClick={() => handleTabChange('navbar')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'navbar'
              ? 'border-purple-600 text-purple-800 bg-purple-50/60'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <List size={18} className="text-purple-600" />
          <span>Navigation Bar</span>
        </button>
      </div>

      {/* TAB 1: SERVICE CARDS */}
      {activeTab === 'cards' && (
        <div className="space-y-6">
          {/* Top Control Bar: Header, Section Filter Chips, Add Card */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Layers size={18} className="text-green-600" />
                  <span>Homepage Service Cards & Section Divisions</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure dynamic flash cards across all business sections. Click &ldquo;Edit&rdquo; on any card or &ldquo;Add Card&rdquo; to modify fields in the dedicated card modal.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenAddCard(selectedSectionFilter !== 'all' ? selectedSectionFilter : 'General')}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
                >
                  <Plus size={16} />
                  <span>
                    Add New Card {selectedSectionFilter !== 'all' ? `to ${selectedSectionFilter}` : ''}
                  </span>
                </button>
                <SectionSaveButton label="Save Cards" />
              </div>
            </div>

            {/* Section Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mr-1">
                <Filter size={13} />
                <span>Filter Section:</span>
              </span>

              <button
                type="button"
                onClick={() => setSelectedSectionFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  selectedSectionFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>All Sections</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-current font-bold">
                  {content.serviceCards.length}
                </span>
              </button>

              {dynamicSections.map((sec) => {
                const count = content.serviceCards.filter(
                  (c) => (c.section || 'General').toLowerCase() === sec.toLowerCase()
                ).length;
                const isSelected = selectedSectionFilter.toLowerCase() === sec.toLowerCase();
                return (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setSelectedSectionFilter(sec)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-green-700 text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>{sec}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 font-bold">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards Grid / Dashboard Table */}
          {displayedCards.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300 space-y-3">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <CreditCard size={24} />
              </div>
              <h3 className="font-bold text-slate-700 text-sm">No Service Cards in this Section</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                There are no cards assigned to section &ldquo;{selectedSectionFilter}&rdquo;. Click below to create a new card.
              </p>
              <button
                type="button"
                onClick={() => handleOpenAddCard(selectedSectionFilter !== 'all' ? selectedSectionFilter : 'General')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl shadow cursor-pointer hover:bg-green-700"
              >
                <Plus size={15} />
                <span>Add Card to {selectedSectionFilter}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {displayedCards.map(({ card, originalIndex }) => {
                const previewTheme = getCardPreviewTheme(card.color);
                return (
                  <div
                    key={card.id || originalIndex}
                    className={`bg-white rounded-2xl border transition-all hover:shadow-md flex flex-col justify-between overflow-hidden ${
                      card.isVisible ? 'border-slate-200' : 'border-dashed border-slate-300 opacity-60 bg-slate-50'
                    }`}
                  >
                    {/* Top strip */}
                    <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-6 h-6 bg-slate-800 text-white rounded-full font-bold text-xs flex items-center justify-center shrink-0">
                          {card.order || originalIndex + 1}
                        </span>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 truncate">
                          {card.section || 'General'}
                        </span>
                        {card.badge && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase truncate">
                            {card.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMoveCard(originalIndex, 'up')}
                          disabled={originalIndex === 0}
                          className="p-1 text-slate-400 hover:text-slate-800 hover:bg-white rounded border border-transparent hover:border-slate-200 disabled:opacity-20 transition cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveCard(originalIndex, 'down')}
                          disabled={originalIndex === content.serviceCards.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-800 hover:bg-white rounded border border-transparent hover:border-slate-200 disabled:opacity-20 transition cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Card Content Summary */}
                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2.5">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs ${previewTheme.cardBg}`}
                          >
                            {renderLivePreviewIcon(card)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-sm text-slate-900 leading-snug truncate">
                              {card.title || 'Untitled Card'}
                            </h3>
                            {card.subtitle && (
                              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate mt-0.5">
                                {card.subtitle}
                              </p>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {card.description || 'No description provided.'}
                        </p>

                        {card.features && card.features.length > 0 && (
                          <div className="pt-1 flex flex-wrap gap-1">
                            {card.features.slice(0, 2).map((feat, fIdx) => (
                              <span
                                key={fIdx}
                                className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium truncate max-w-full"
                              >
                                ✓ {feat}
                              </span>
                            ))}
                            {card.features.length > 2 && (
                              <span className="text-[10px] text-slate-400 font-semibold px-1 py-0.5">
                                +{card.features.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Status and Action Buttons */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleCardVisibility(originalIndex)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer ${
                            card.isVisible
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {card.isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                          <span>{card.isVisible ? 'Live on Web' : 'Hidden'}</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDuplicateCard(originalIndex)}
                            className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="Duplicate Card"
                          >
                            <Copy size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditCard(originalIndex)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Edit3 size={13} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCard(originalIndex)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Delete Card"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* DEDICATED SINGLE-INSTANCE CARD MODAL (NO DUPLICATE FIELDS) */}
          {cardModalOpen && cardDraft && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Modal Header */}
                <div className="bg-slate-900 text-white p-5 flex justify-between items-center shrink-0">
                  <div>
                    <h2 className="text-base font-bold flex items-center gap-2">
                      <CreditCard size={18} className="text-green-400" />
                      <span>{editingCardIndex !== null ? `Edit Service Card: ${cardDraft.title}` : 'Add New Homepage Service Card'}</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Configure soft-coded content, links, icons, color theme, and background appearance. Each field renders once.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseCardModal}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Body: 2 Columns */}
                <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* LEFT: Inputs (7 Columns) */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* Section & Badge Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                          <Tag size={13} className="text-green-600" />
                          <span>Section / Category</span>
                        </label>
                        <input
                          type="text"
                          list="modal-section-list"
                          value={cardDraft.section || 'General'}
                          onChange={(e) => setCardDraft({ ...cardDraft, section: e.target.value })}
                          placeholder="e.g. Showroom, Battery, Rental"
                          className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-green-500/20 focus:border-green-600 bg-white"
                        />
                        <datalist id="modal-section-list">
                          {STANDARD_SECTIONS.map((s) => (
                            <option key={s} value={s} />
                          ))}
                        </datalist>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                          <Sparkles size={13} className="text-amber-500" />
                          <span>Card Badge Pill (Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={cardDraft.badge || ''}
                          onChange={(e) => setCardDraft({ ...cardDraft, badge: e.target.value })}
                          placeholder="e.g. 3-YEAR WARRANTY, POPULAR, OEM"
                          className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-green-500/20 focus:border-green-600 uppercase"
                        />
                      </div>
                    </div>

                    {/* Title & Subtitle Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Card Title</label>
                        <input
                          type="text"
                          value={cardDraft.title}
                          onChange={(e) => setCardDraft({ ...cardDraft, title: e.target.value })}
                          placeholder="e.g. Lithium Battery"
                          className="w-full border border-slate-300 rounded-lg p-2 text-xs font-semibold focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Subtitle / Tagline</label>
                        <input
                          type="text"
                          value={cardDraft.subtitle || ''}
                          onChange={(e) => setCardDraft({ ...cardDraft, subtitle: e.target.value })}
                          placeholder="e.g. High Performance LFP & Li-Ion"
                          className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-green-500/20 focus:border-green-600 text-slate-600"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-xs">Description</label>
                      <textarea
                        rows={2}
                        value={cardDraft.description}
                        onChange={(e) => setCardDraft({ ...cardDraft, description: e.target.value })}
                        placeholder="Detailed explanation of services provided..."
                        className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
                      />
                    </div>

                    {/* Key Features Bullet Points Manager */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                      <label className="block font-bold text-slate-800 text-xs flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 size={14} className="text-green-600" />
                          <span>Key Features & Highlights ({cardDraft.features?.length || 0})</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          Rendered as bullet list on card
                        </span>
                      </label>

                      {/* Existing Features List */}
                      {cardDraft.features && cardDraft.features.length > 0 && (
                        <div className="space-y-1.5 max-h-36 overflow-y-auto">
                          {cardDraft.features.map((feature, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-1.5">
                              <span className="text-green-600 text-xs font-bold">✓</span>
                              <input
                                type="text"
                                value={feature}
                                onChange={(e) => handleUpdateDraftFeature(fIdx, e.target.value)}
                                className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1 text-xs bg-white focus:ring-1 focus:ring-green-500"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveDraftFeature(fIdx)}
                                className="p-1 text-slate-400 hover:text-red-600 rounded transition cursor-pointer"
                                title="Remove Bullet"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add New Feature Input */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <input
                          type="text"
                          value={draftFeatureText}
                          onChange={(e) => setDraftFeatureText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddDraftFeature();
                            }
                          }}
                          placeholder="Type a feature and press Enter (e.g. 3-Year Warranty Replacement)..."
                          className="flex-1 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:ring-1 focus:ring-green-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddDraftFeature}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Plus size={13} />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>

                    {/* Target Link URL with Quick Presets */}
                    <div className="space-y-1.5 text-xs">
                      <label className="block font-bold text-slate-700">Target Link URL</label>
                      <input
                        type="text"
                        value={cardDraft.linkUrl}
                        onChange={(e) => setCardDraft({ ...cardDraft, linkUrl: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono focus:ring-1 focus:ring-green-500"
                      />
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-400">Quick Links:</span>
                        {QUICK_LINK_PRESETS.map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => setCardDraft({ ...cardDraft, linkUrl: preset.url })}
                            className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-semibold transition cursor-pointer"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Button Text & Color Palette */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Button Text</label>
                        <input
                          type="text"
                          value={cardDraft.buttonText}
                          onChange={(e) => setCardDraft({ ...cardDraft, buttonText: e.target.value })}
                          placeholder="e.g. Select Battery"
                          className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-green-500 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Color Palette Theme</label>
                        <select
                          value={cardDraft.color}
                          onChange={(e) => setCardDraft({ ...cardDraft, color: e.target.value })}
                          className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-green-500 font-medium bg-white"
                        >
                          {AVAILABLE_COLORS.map((col) => (
                            <option key={col.value} value={col.value}>
                              {col.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Icon Mode Switcher & Configuration */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                          <ImageIcon size={15} className="text-green-600" />
                          <span>Card Icon / Graphic Type</span>
                        </label>

                        <div className="flex bg-slate-200 p-0.5 rounded-lg text-xs self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={() => setCardDraft({ ...cardDraft, iconType: 'icon' })}
                            className={`px-3 py-1 rounded-md font-bold text-[11px] transition cursor-pointer ${
                              (cardDraft.iconType || 'icon') === 'icon'
                                ? 'bg-white text-green-700 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Vector Icon
                          </button>
                          <button
                            type="button"
                            onClick={() => setCardDraft({ ...cardDraft, iconType: 'image' })}
                            className={`px-3 py-1 rounded-md font-bold text-[11px] transition cursor-pointer ${
                              cardDraft.iconType === 'image'
                                ? 'bg-white text-green-700 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Custom Image Icon
                          </button>
                        </div>
                      </div>

                      {(cardDraft.iconType || 'icon') === 'icon' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Choose Built-in Icon
                            </label>
                            <select
                              value={cardDraft.icon}
                              onChange={(e) => setCardDraft({ ...cardDraft, icon: e.target.value })}
                              className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-green-500"
                            >
                              {AVAILABLE_ICONS.map((icon) => (
                                <option key={icon} value={icon}>
                                  {icon}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200">
                            <span className="text-[11px] font-semibold text-slate-500">Selected:</span>
                            <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                              {cardDraft.icon}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                            <div className="sm:col-span-3 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 text-center">
                              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-300 overflow-hidden shadow-xs">
                                {cardDraft.iconImage ? (
                                  <img
                                    src={cardDraft.iconImage}
                                    alt="Card Icon Preview"
                                    className="w-full h-full object-contain p-1"
                                  />
                                ) : (
                                  <ImageIcon size={24} className="text-slate-400" />
                                )}
                              </div>
                              <span className="text-[10px] font-bold text-slate-500 mt-1">Image Preview</span>
                            </div>

                            <div className="sm:col-span-9 space-y-2.5">
                              <div>
                                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                  Upload Image from Computer
                                </label>
                                <div className="flex items-center gap-2">
                                  <label className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs">
                                    <Upload size={14} />
                                    <span>Choose Image File</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          try {
                                            const res = await compressImageFile(file, 400, 400, 0.9);
                                            if (res) {
                                              setCardDraft({ ...cardDraft, iconImage: res });
                                            }
                                          } catch (err) {
                                            console.error('Failed to compress icon image:', err);
                                          }
                                        }
                                      }}
                                    />
                                  </label>
                                  {cardDraft.iconImage && (
                                    <button
                                      type="button"
                                      onClick={() => setCardDraft({ ...cardDraft, iconImage: '' })}
                                      className="px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold border border-red-200 transition cursor-pointer"
                                    >
                                      Clear
                                    </button>
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                  Or Enter Image URL
                                </label>
                                <input
                                  type="text"
                                  placeholder="https://example.com/logo.png or /assets/battery.png"
                                  value={cardDraft.iconImage || ''}
                                  onChange={(e) => setCardDraft({ ...cardDraft, iconImage: e.target.value })}
                                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-green-500 font-mono"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Background Appearance & Image Option */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                          <ImageIcon size={15} className="text-blue-600" />
                          <span>Card Background Appearance</span>
                        </label>

                        <div className="flex bg-slate-200 p-0.5 rounded-lg text-xs self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={() => setCardDraft({ ...cardDraft, bgType: 'color' })}
                            className={`px-3 py-1 rounded-md font-bold text-[11px] transition cursor-pointer ${
                              (cardDraft.bgType || 'color') === 'color'
                                ? 'bg-white text-blue-700 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Solid Color Theme
                          </button>
                          <button
                            type="button"
                            onClick={() => setCardDraft({ ...cardDraft, bgType: 'image' })}
                            className={`px-3 py-1 rounded-md font-bold text-[11px] transition cursor-pointer ${
                              cardDraft.bgType === 'image'
                                ? 'bg-white text-blue-700 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Custom Background Image
                          </button>
                        </div>
                      </div>

                      {cardDraft.bgType === 'image' ? (
                        <div className="space-y-3 pt-1">
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                            <div className="sm:col-span-3 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 text-center">
                              <div className="w-full h-20 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-300 overflow-hidden shadow-xs relative">
                                {cardDraft.bgImage ? (
                                  <>
                                    <img
                                      src={cardDraft.bgImage}
                                      alt="Card Background Preview"
                                      className="w-full h-full object-cover"
                                    />
                                    <div
                                      className="absolute inset-0"
                                      style={{
                                        backgroundColor: `rgba(0,0,0, ${(cardDraft.bgOverlayOpacity ?? 70) / 100})`,
                                      }}
                                    />
                                    <span className="absolute z-10 text-[10px] font-bold text-white uppercase drop-shadow">
                                      Preview
                                    </span>
                                  </>
                                ) : (
                                  <ImageIcon size={24} className="text-slate-400" />
                                )}
                              </div>
                              <span className="text-[10px] font-bold text-slate-500 mt-1">Background Preview</span>
                            </div>

                            <div className="sm:col-span-9 space-y-2.5">
                              <div>
                                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                  Upload Background Image from Device
                                </label>
                                <div className="flex items-center gap-2">
                                  <label className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs">
                                    <Upload size={14} />
                                    <span>Choose Background File</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          try {
                                            const res = await compressImageFile(file, 1600, 1200, 0.8);
                                            if (res) {
                                              setCardDraft({ ...cardDraft, bgImage: res });
                                            }
                                          } catch (err) {
                                            console.error('Failed to compress background image:', err);
                                          }
                                        }
                                      }}
                                    />
                                  </label>
                                  {cardDraft.bgImage && (
                                    <button
                                      type="button"
                                      onClick={() => setCardDraft({ ...cardDraft, bgImage: '' })}
                                      className="px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold border border-red-200 transition cursor-pointer"
                                    >
                                      Clear Image
                                    </button>
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                  Or Enter Background Image URL
                                </label>
                                <input
                                  type="text"
                                  placeholder="https://images.unsplash.com/... or /assets/battery-bg.jpg"
                                  value={cardDraft.bgImage || ''}
                                  onChange={(e) => setCardDraft({ ...cardDraft, bgImage: e.target.value })}
                                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-blue-500 font-mono"
                                />
                              </div>

                              {/* Dark Overlay Opacity Slider */}
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <label className="text-[11px] font-semibold text-slate-700">
                                    Dark Readability Overlay: {cardDraft.bgOverlayOpacity ?? 70}%
                                  </label>
                                  <span className="text-[10px] text-slate-400 font-medium">
                                    (Keeps text & buttons legible)
                                  </span>
                                </div>
                                <input
                                  type="range"
                                  min="20"
                                  max="95"
                                  step="5"
                                  value={cardDraft.bgOverlayOpacity ?? 70}
                                  onChange={(e) =>
                                    setCardDraft({ ...cardDraft, bgOverlayOpacity: Number(e.target.value) })
                                  }
                                  className="w-full accent-blue-600 cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-500">
                          Currently using solid color theme (<span className="font-semibold text-slate-700 capitalize">{cardDraft.color || 'emerald'}</span>). Switch to &ldquo;Custom Background Image&rdquo; to add a photo backdrop.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* RIGHT: Live Real-Time Card Preview (5 Columns) */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-start bg-slate-100/80 p-5 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Eye size={14} className="text-green-600" />
                        <span>Live Homepage Card Preview</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        Section: {cardDraft.section || 'General'}
                      </span>
                    </div>

                    {/* Preview Card Component */}
                    {(() => {
                      const modalPreviewTheme = getCardPreviewTheme(cardDraft.color);
                      return (
                        <div
                          style={
                            cardDraft.bgType === 'image' && cardDraft.bgImage
                              ? {
                                  backgroundImage: `url("${cardDraft.bgImage}")`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                }
                              : undefined
                          }
                          className={`w-full max-w-[290px] relative overflow-hidden ${
                            cardDraft.bgType === 'image' && cardDraft.bgImage ? 'bg-slate-900' : modalPreviewTheme.cardBg
                          } rounded-3xl p-5 text-white text-center flex flex-col justify-between shadow-xl transition duration-200 min-h-[360px]`}
                        >
                          {/* Background Overlay if image is active */}
                          {cardDraft.bgType === 'image' && cardDraft.bgImage && (
                            <div
                              className="absolute inset-0 z-0"
                              style={{
                                backgroundColor: `rgba(15, 23, 42, ${(cardDraft.bgOverlayOpacity ?? 70) / 100})`,
                                backgroundImage:
                                  'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
                              }}
                            />
                          )}

                          <div className="space-y-3 relative z-10">
                            {/* Card Badge if any */}
                            {cardDraft.badge && (
                              <div className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-white/20 text-white border border-white/30 tracking-wider backdrop-blur-xs">
                                {cardDraft.badge}
                              </div>
                            )}

                            {/* Circular Icon */}
                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md mx-auto border-2 border-white/40 overflow-hidden p-2">
                              {renderLivePreviewIcon(cardDraft)}
                            </div>

                            {/* Title & Subtitle */}
                            <div>
                              <h4 className="text-base font-extrabold text-white tracking-wide">
                                {cardDraft.title || 'Untitled Card'}
                              </h4>
                              {cardDraft.subtitle && (
                                <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider mt-0.5">
                                  {cardDraft.subtitle}
                                </p>
                              )}
                            </div>

                            {/* Description */}
                            <p className="text-white/90 text-xs leading-relaxed font-normal line-clamp-3">
                              {cardDraft.description || 'Description goes here...'}
                            </p>

                            {/* Features list in preview */}
                            {cardDraft.features && cardDraft.features.length > 0 && (
                              <ul className="text-left space-y-1 pt-1 text-[11px] text-white/95">
                                {cardDraft.features.slice(0, 3).map((feat, i) => (
                                  <li key={i} className="flex items-center gap-1.5">
                                    <span className="text-white/70 font-bold">✓</span>
                                    <span className="truncate">{feat}</span>
                                  </li>
                                ))}
                                {cardDraft.features.length > 3 && (
                                  <li className="text-[10px] text-white/75 italic">
                                    +{cardDraft.features.length - 3} more feature bullets
                                  </li>
                                )}
                              </ul>
                            )}
                          </div>

                          {/* Button */}
                          <div className="pt-4 relative z-10">
                            <div
                              className={`w-full bg-white ${modalPreviewTheme.btnText} font-bold py-2.5 px-4 rounded-full text-xs shadow-md text-center`}
                            >
                              {cardDraft.buttonText || 'Select Service'}
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    <p className="text-[10px] text-slate-500 text-center leading-tight">
                      This card will render in the {cardDraft.section || 'General'} section grid on the public landing page.
                    </p>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center shrink-0">
                  <button
                    type="button"
                    onClick={handleCloseCardModal}
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveCardDraft}
                    className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-2"
                  >
                    <CheckCircle size={15} />
                    <span>Apply & Save Card Draft</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: HERO & HEADER (100% SOFT-CODED) */}
      {activeTab === 'hero' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <LayoutTemplate size={18} className="text-green-600" />
                <span>Homepage Hero & Header Soft-Coding Suite</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                100% database-driven control for the top helpline bar, brand navbar, titles, hero background, feature badges, and action buttons.
              </p>
            </div>

            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 self-start sm:self-auto"
            >
              <Save size={15} />
              <span>{saving ? 'Saving Changes...' : 'Save Header & Hero'}</span>
            </button>
          </div>

          {/* 1. TOP HELPLINE & BUSINESS INFO BAR (100% SOFT-CODED) */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <label className="font-bold text-slate-800 text-xs flex items-center gap-2">
                  <Phone size={16} className="text-emerald-600" />
                  <span>Top Notification & Business Info Bar</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Controls the top dark strip above the navbar showing phone helpline, office timings, GSTIN number, and plant city location.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                  <input
                    type="checkbox"
                    checked={content.topBar?.isVisible ?? true}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        topBar: { ...(content.topBar || {}), isVisible: e.target.checked },
                      })
                    }
                    className="rounded text-green-600 focus:ring-green-500 h-4 w-4"
                  />
                  <span>Enable Top Bar</span>
                </label>
                <SectionSaveButton label="Save Top Bar" compact />
              </div>
            </div>

            {(content.topBar?.isVisible ?? true) && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {/* Phone Helpline */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-700 text-[11px]">Helpline Phone</label>
                      <label className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={content.topBar?.showPhone ?? true}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              topBar: { ...(content.topBar || {}), showPhone: e.target.checked },
                            })
                          }
                          className="rounded text-green-600 h-3 w-3"
                        />
                        <span>Show</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder="Helpline:"
                      value={content.topBar?.phoneLabel ?? 'Helpline:'}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          topBar: { ...(content.topBar || {}), phoneLabel: e.target.value },
                        })
                      }
                      className="w-full border border-slate-200 rounded-lg p-1.5 text-xs bg-slate-50 mb-1"
                    />
                    <input
                      type="text"
                      placeholder="+91 8949049003"
                      value={content.topBar?.phone ?? '+91 8949049003'}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          topBar: { ...(content.topBar || {}), phone: e.target.value },
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg p-1.5 text-xs font-semibold"
                    />
                  </div>

                  {/* Office Hours */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-700 text-[11px]">Office Hours</label>
                      <label className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={content.topBar?.showOfficeHours ?? true}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              topBar: { ...(content.topBar || {}), showOfficeHours: e.target.checked },
                            })
                          }
                          className="rounded text-green-600 h-3 w-3"
                        />
                        <span>Show</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder="10:00 AM to 6:30 PM (Mon - Sat)"
                      value={content.topBar?.officeHours ?? '10:00 AM to 6:30 PM (Mon - Sat)'}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          topBar: { ...(content.topBar || {}), officeHours: e.target.value },
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg p-1.5 text-xs font-semibold mt-6"
                    />
                  </div>

                  {/* GSTIN Number */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-700 text-[11px]">GSTIN Number</label>
                      <label className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={content.topBar?.showGstin ?? true}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              topBar: { ...(content.topBar || {}), showGstin: e.target.checked },
                            })
                          }
                          className="rounded text-green-600 h-3 w-3"
                        />
                        <span>Show</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder="08DTUPM4205B1Z0"
                      value={content.topBar?.gstin ?? '08DTUPM4205B1Z0'}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          topBar: { ...(content.topBar || {}), gstin: e.target.value },
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg p-1.5 text-xs font-mono uppercase mt-6"
                    />
                  </div>

                  {/* Location City */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-700 text-[11px]">Plant Location</label>
                      <label className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={content.topBar?.showLocation ?? true}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              topBar: { ...(content.topBar || {}), showLocation: e.target.checked },
                            })
                          }
                          className="rounded text-green-600 h-3 w-3"
                        />
                        <span>Show</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder="Kota, Rajasthan"
                      value={content.topBar?.location ?? 'Kota, Rajasthan'}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          topBar: { ...(content.topBar || {}), location: e.target.value },
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg p-1.5 text-xs font-semibold mt-6"
                    />
                  </div>
                </div>

                {/* Top Bar Colors */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white rounded-xl border border-slate-200 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Bar Background Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={content.topBar?.bgColor || '#0f172a'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            topBar: { ...(content.topBar || {}), bgColor: e.target.value },
                          })
                        }
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                      />
                      <input
                        type="text"
                        value={content.topBar?.bgColor || '#0f172a'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            topBar: { ...(content.topBar || {}), bgColor: e.target.value },
                          })
                        }
                        className="w-full border border-slate-300 rounded-lg p-1.5 text-xs font-mono uppercase bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Text Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={content.topBar?.textColor || '#cbd5e1'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            topBar: { ...(content.topBar || {}), textColor: e.target.value },
                          })
                        }
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                      />
                      <input
                        type="text"
                        value={content.topBar?.textColor || '#cbd5e1'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            topBar: { ...(content.topBar || {}), textColor: e.target.value },
                          })
                        }
                        className="w-full border border-slate-300 rounded-lg p-1.5 text-xs font-mono uppercase bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Accent & Phone Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={content.topBar?.accentColor || '#34d399'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            topBar: { ...(content.topBar || {}), accentColor: e.target.value },
                          })
                        }
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                      />
                      <input
                        type="text"
                        value={content.topBar?.accentColor || '#34d399'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            topBar: { ...(content.topBar || {}), accentColor: e.target.value },
                          })
                        }
                        className="w-full border border-slate-300 rounded-lg p-1.5 text-xs font-mono uppercase bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. MAIN HEADER NAVBAR & BRAND IDENTITY (100% SOFT-CODED) */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-5">
            <div>
              <label className="font-bold text-slate-800 text-xs flex items-center gap-2">
                <ImageIcon size={16} className="text-green-600" />
                <span>Main Navigation Bar & Brand Emblem / Title</span>
              </label>
              <p className="text-[11px] text-slate-500">
                Customize the company brand logo, emblem title/subtitle, navbar buttons, colors, and account controls.
              </p>
            </div>

            {/* Brand Title, Subtitle, & Logo Mode Toggle */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <span className="font-bold text-slate-800 text-xs">Brand Emblem & Logo Configuration</span>
                <div className="flex items-center gap-2">
                  <div className="flex bg-slate-200 p-0.5 rounded-lg text-xs self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, logoType: 'preset' },
                          headerNav: { ...(content.headerNav || {}), logoType: 'preset' },
                        })
                      }
                      className={`px-3 py-1 rounded-md font-bold text-[11px] transition cursor-pointer ${
                        ((content.headerNav?.logoType || content.hero.logoType) || 'preset') === 'preset'
                          ? 'bg-white text-green-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Preset SVG Emblem
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, logoType: 'image' },
                          headerNav: { ...(content.headerNav || {}), logoType: 'image' },
                        })
                      }
                      className={`px-3 py-1 rounded-md font-bold text-[11px] transition cursor-pointer ${
                        (content.headerNav?.logoType || content.hero.logoType) === 'image'
                          ? 'bg-white text-green-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Custom Image Logo
                    </button>
                  </div>
                  <SectionSaveButton label="Save Logo" compact />
                </div>
              </div>

              {((content.headerNav?.logoType || content.hero.logoType) || 'preset') === 'preset' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Brand Title (e.g. EBS EKOSMART)</label>
                    <input
                      type="text"
                      value={content.headerNav?.brandTitle ?? 'EBS EKOSMART'}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          headerNav: { ...(content.headerNav || {}), brandTitle: e.target.value },
                        })
                      }
                      placeholder="EBS EKOSMART"
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Brand Subtitle (e.g. Battery Solution • Li-ion & LFP)</label>
                    <input
                      type="text"
                      value={content.headerNav?.brandSubtitle ?? 'Battery Solution • Li-ion & LFP'}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          headerNav: { ...(content.headerNav || {}), brandSubtitle: e.target.value },
                        })
                      }
                      placeholder="Battery Solution • Li-ion & LFP"
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-700 bg-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-3 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 text-center">
                      <div className="w-24 h-16 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-300 overflow-hidden shadow-xs">
                        {content.headerNav?.logoImage || content.hero.logoImage ? (
                          <img
                            src={resolveImageUrl(content.headerNav?.logoImage || content.hero.logoImage || '')}
                            alt="Header Logo Preview"
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <ImageIcon size={28} className="text-slate-400" />
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 mt-1">Logo Preview</span>
                    </div>

                    <div className="sm:col-span-9 space-y-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Upload Custom Logo Image
                        </label>
                        <div className="flex items-center gap-2">
                          <label className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs">
                            <Upload size={14} />
                            <span>Choose Image File</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const res = await compressImageFile(file, 800, 400, 0.9);
                                    if (res) {
                                      setContent({
                                        ...content,
                                        hero: { ...content.hero, logoImage: res },
                                        headerNav: { ...(content.headerNav || {}), logoImage: res },
                                      });
                                    }
                                  } catch (err) {
                                    console.error('Failed to compress logo:', err);
                                  }
                                }
                              }}
                            />
                          </label>
                          {(content.headerNav?.logoImage || content.hero.logoImage) && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  const img = content.hero.logoImage || content.headerNav?.logoImage || '';
                                  setContent({
                                    ...content,
                                    hero: {
                                      ...content.hero,
                                      bgType: 'image',
                                      bgImage: img,
                                      showHeroLogo: false,
                                    },
                                  });
                                  setNotification({
                                    type: 'success',
                                    message: 'Applied image as Hero Background! Scroll to Hero Background below to adjust dark overlay.',
                                  });
                                  setTimeout(() => setNotification(null), 4000);
                                }}
                                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-300 transition cursor-pointer flex items-center gap-1.5"
                                title="Set this photo as the full background of your homepage hero section"
                              >
                                <ImageIcon size={13} />
                                <span>Use as Hero Background Image</span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setContent({
                                    ...content,
                                    hero: { ...content.hero, logoImage: '' },
                                    headerNav: { ...(content.headerNav || {}), logoImage: '' },
                                  })
                                }
                                className="px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold border border-red-200 transition cursor-pointer"
                              >
                                Clear
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Or Enter Logo Image URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://example.com/logo.png"
                          value={content.headerNav?.logoImage || content.hero.logoImage || ''}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              hero: { ...content.hero, logoImage: e.target.value },
                              headerNav: { ...(content.headerNav || {}), logoImage: e.target.value },
                            })
                          }
                          className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white font-mono"
                        />
                      </div>

                      <div className="pt-1">
                        <label className="flex items-center gap-2 text-[11px] text-slate-600 cursor-pointer font-medium hover:text-slate-900">
                          <input
                            type="checkbox"
                            checked={content.hero.showHeroLogo ?? false}
                            onChange={(e) =>
                              setContent({
                                ...content,
                                hero: { ...content.hero, showHeroLogo: e.target.checked },
                              })
                            }
                            className="rounded text-green-600 h-3.5 w-3.5"
                          />
                          <span>Also display this logo emblem inside the Hero Banner (above heading)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navbar Navigation Buttons & Styling */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <span className="font-bold text-slate-800 text-xs block">Navbar Navigation Links & Account Button</span>
                <SectionSaveButton label="Save Nav Links" compact />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. Home Link */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 text-[11px]">Home Link</span>
                    <label className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={content.headerNav?.showHome ?? true}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            headerNav: { ...(content.headerNav || {}), showHome: e.target.checked },
                          })
                        }
                        className="rounded text-green-600 h-3 w-3"
                      />
                      <span>Show</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={content.headerNav?.homeLabel ?? 'Home'}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        headerNav: { ...(content.headerNav || {}), homeLabel: e.target.value },
                      })
                    }
                    placeholder="Home"
                    className="w-full border border-slate-300 rounded-lg p-1.5 text-xs bg-white font-semibold"
                  />
                </div>

                {/* 2. Wallet & Coins */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 text-[11px]">Wallet & Coins</span>
                    <label className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={content.headerNav?.showWallet ?? true}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            headerNav: { ...(content.headerNav || {}), showWallet: e.target.checked },
                          })
                        }
                        className="rounded text-green-600 h-3 w-3"
                      />
                      <span>Show</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={content.headerNav?.walletLabel ?? 'Wallet & Coins'}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        headerNav: { ...(content.headerNav || {}), walletLabel: e.target.value },
                      })
                    }
                    placeholder="Wallet & Coins"
                    className="w-full border border-slate-300 rounded-lg p-1.5 text-xs bg-white font-semibold"
                  />
                  <label className="flex items-center gap-1.5 text-[10px] text-slate-600 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={content.headerNav?.showWalletBadge ?? true}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          headerNav: { ...(content.headerNav || {}), showWalletBadge: e.target.checked },
                        })
                      }
                      className="rounded text-amber-600 h-3 w-3"
                    />
                    <span>Show customer balance badge</span>
                  </label>
                </div>

                {/* 3. Refer & Earn */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 text-[11px]">Refer & Earn</span>
                    <label className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={content.headerNav?.showRefer ?? true}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            headerNav: { ...(content.headerNav || {}), showRefer: e.target.checked },
                          })
                        }
                        className="rounded text-green-600 h-3 w-3"
                      />
                      <span>Show</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={content.headerNav?.referLabel ?? 'Refer & Earn'}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        headerNav: { ...(content.headerNav || {}), referLabel: e.target.value },
                      })
                    }
                    placeholder="Refer & Earn"
                    className="w-full border border-slate-300 rounded-lg p-1.5 text-xs bg-white font-semibold"
                  />
                </div>

                {/* 4. Account / Login Button */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 text-[11px]">Account Button</span>
                    <label className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={content.headerNav?.showAccount ?? true}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            headerNav: { ...(content.headerNav || {}), showAccount: e.target.checked },
                          })
                        }
                        className="rounded text-green-600 h-3 w-3"
                      />
                      <span>Show</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={content.headerNav?.accountLabel ?? 'Account / Login'}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        headerNav: { ...(content.headerNav || {}), accountLabel: e.target.value },
                      })
                    }
                    placeholder="Account / Login"
                    className="w-full border border-slate-300 rounded-lg p-1.5 text-xs bg-white font-semibold"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center gap-1">
                      <input
                        type="color"
                        value={content.headerNav?.accountBtnBg || '#059669'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            headerNav: { ...(content.headerNav || {}), accountBtnBg: e.target.value },
                          })
                        }
                        className="w-6 h-6 rounded cursor-pointer border p-0 bg-white"
                        title="Button Background"
                      />
                      <span className="text-[10px] text-slate-500">Bg</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="color"
                        value={content.headerNav?.accountBtnText || '#ffffff'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            headerNav: { ...(content.headerNav || {}), accountBtnText: e.target.value },
                          })
                        }
                        className="w-6 h-6 rounded cursor-pointer border p-0 bg-white"
                        title="Button Text"
                      />
                      <span className="text-[10px] text-slate-500">Text</span>
                    </div>
                  </div>
                </div>

                {/* 5. Showroom Bills */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 text-[11px]">Showroom Bills</span>
                    <label className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={content.headerNav?.showShowroomBilling ?? true}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            headerNav: { ...(content.headerNav || {}), showShowroomBilling: e.target.checked },
                          })
                        }
                        className="rounded text-green-600 h-3 w-3"
                      />
                      <span>Show</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={content.headerNav?.showroomBillingLabel ?? 'Showroom Bills'}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        headerNav: { ...(content.headerNav || {}), showroomBillingLabel: e.target.value },
                      })
                    }
                    placeholder="Showroom Bills"
                    className="w-full border border-slate-300 rounded-lg p-1.5 text-xs bg-white font-semibold"
                  />
                  <input
                    type="text"
                    value={content.headerNav?.showroomBillingHref ?? '/showroom-billing'}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        headerNav: { ...(content.headerNav || {}), showroomBillingHref: e.target.value },
                      })
                    }
                    placeholder="/showroom-billing"
                    className="w-full border border-slate-300 rounded-lg p-1 text-[11px] bg-white font-mono"
                  />
                </div>

                {/* 6. Check Warranty */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 text-[11px]">Check Warranty</span>
                    <label className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={content.headerNav?.showWarrantyCheck ?? true}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            headerNav: { ...(content.headerNav || {}), showWarrantyCheck: e.target.checked },
                          })
                        }
                        className="rounded text-green-600 h-3 w-3"
                      />
                      <span>Show</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={content.headerNav?.warrantyCheckLabel ?? 'Check Warranty'}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        headerNav: { ...(content.headerNav || {}), warrantyCheckLabel: e.target.value },
                      })
                    }
                    placeholder="Check Warranty"
                    className="w-full border border-slate-300 rounded-lg p-1.5 text-xs bg-white font-semibold"
                  />
                  <input
                    type="text"
                    value={content.headerNav?.warrantyCheckHref ?? '/warranty/check'}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        headerNav: { ...(content.headerNav || {}), warrantyCheckHref: e.target.value },
                      })
                    }
                    placeholder="/warranty/check"
                    className="w-full border border-slate-300 rounded-lg p-1 text-[11px] bg-white font-mono"
                  />
                </div>

                {/* 7. Track Ticket */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 text-[11px]">Track Ticket</span>
                    <label className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={content.headerNav?.showTrackTicket ?? true}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            headerNav: { ...(content.headerNav || {}), showTrackTicket: e.target.checked },
                          })
                        }
                        className="rounded text-green-600 h-3 w-3"
                      />
                      <span>Show</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={content.headerNav?.trackTicketLabel ?? 'Track Ticket'}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        headerNav: { ...(content.headerNav || {}), trackTicketLabel: e.target.value },
                      })
                    }
                    placeholder="Track Ticket"
                    className="w-full border border-slate-300 rounded-lg p-1.5 text-xs bg-white font-semibold"
                  />
                  <input
                    type="text"
                    value={content.headerNav?.trackTicketHref ?? '/complaint/track'}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        headerNav: { ...(content.headerNav || {}), trackTicketHref: e.target.value },
                      })
                    }
                    placeholder="/complaint/track"
                    className="w-full border border-slate-300 rounded-lg p-1 text-[11px] bg-white font-mono"
                  />
                </div>

                {/* 8. Support Ticket */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 text-[11px]">Support Ticket</span>
                    <label className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(content.headerNav?.showSupportTicket)}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            headerNav: { ...(content.headerNav || {}), showSupportTicket: e.target.checked },
                          })
                        }
                        className="rounded text-green-600 h-3 w-3"
                      />
                      <span>Show</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={content.headerNav?.supportTicketLabel ?? 'Support Ticket'}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        headerNav: { ...(content.headerNav || {}), supportTicketLabel: e.target.value },
                      })
                    }
                    placeholder="Support Ticket"
                    className="w-full border border-slate-300 rounded-lg p-1.5 text-xs bg-white font-semibold"
                  />
                  <input
                    type="text"
                    value={content.headerNav?.supportTicketHref ?? '/complaint/register'}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        headerNav: { ...(content.headerNav || {}), supportTicketHref: e.target.value },
                      })
                    }
                    placeholder="/complaint/register"
                    className="w-full border border-slate-300 rounded-lg p-1 text-[11px] bg-white font-mono"
                  />
                </div>

                {/* 9. Contact & Helpline Dropdown */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 text-[11px]">Contact Dropdown</span>
                    <label className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={content.headerNav?.showContactDropdown ?? true}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            headerNav: { ...(content.headerNav || {}), showContactDropdown: e.target.checked },
                          })
                        }
                        className="rounded text-green-600 h-3 w-3"
                      />
                      <span>Show</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={content.headerNav?.contactLabel ?? 'Contact & Helpline'}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        headerNav: { ...(content.headerNav || {}), contactLabel: e.target.value },
                      })
                    }
                    placeholder="Contact & Helpline"
                    className="w-full border border-slate-300 rounded-lg p-1.5 text-xs bg-white font-semibold"
                  />
                  <p className="text-[10px] text-slate-500">Links directly to telephone, whatsapp & concern divisions</p>
                </div>
              </div>

              {/* Navbar Background & Border Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Navbar Background Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={content.headerNav?.navBgColor || '#ffffff'}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          headerNav: { ...(content.headerNav || {}), navBgColor: e.target.value },
                        })
                      }
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={content.headerNav?.navBgColor || '#ffffff'}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          headerNav: { ...(content.headerNav || {}), navBgColor: e.target.value },
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg p-1.5 text-xs font-mono uppercase bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Navbar Bottom Border Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={content.headerNav?.navBorderColor || '#e2e8f0'}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          headerNav: { ...(content.headerNav || {}), navBorderColor: e.target.value },
                        })
                      }
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={content.headerNav?.navBorderColor || '#e2e8f0'}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          headerNav: { ...(content.headerNav || {}), navBorderColor: e.target.value },
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg p-1.5 text-xs font-mono uppercase bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. COMPLAINT REGISTRATION SIDEBAR LOGO */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <ImageIcon size={16} className="text-emerald-700" />
                  <span>Complaint Registration Sidebar Logo (Smart Drive Badge)</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Controls the logo inside the white badge on the dark green sidebar at /complaint/register.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-slate-200 p-0.5 rounded-lg text-xs self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, complaintLogoType: 'preset' },
                      })
                    }
                    className={`px-3 py-1 rounded-md font-bold text-[11px] transition cursor-pointer ${
                      (content.hero.complaintLogoType || 'preset') === 'preset'
                        ? 'bg-white text-emerald-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Preset Smart Drive Emblem
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, complaintLogoType: 'image' },
                      })
                    }
                    className={`px-3 py-1 rounded-md font-bold text-[11px] transition cursor-pointer ${
                      content.hero.complaintLogoType === 'image'
                        ? 'bg-white text-emerald-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Custom Image Logo
                  </button>
                </div>
                <SectionSaveButton label="Save Logo" compact />
              </div>
            </div>

            {(content.hero.complaintLogoType || 'preset') === 'preset' ? (
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 text-xs">
                <div className="w-16 h-10 bg-emerald-950 rounded-xl flex items-center justify-center text-emerald-400 font-black text-xs shadow-xs">
                  SMART DRIVE
                </div>
                <div>
                  <span className="font-bold text-slate-800">Using Official SMART DRIVE Emblem</span>
                  <p className="text-[11px] text-slate-500">
                    Default Smart Drive circular speedometer & road logo badge rendered in the complaint registration sidebar.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-3 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 text-center">
                    <div className="w-24 h-16 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-300 overflow-hidden shadow-xs">
                      {content.hero.complaintLogoImage ? (
                        <img
                          src={resolveImageUrl(content.hero.complaintLogoImage)}
                          alt="Sidebar Logo Preview"
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <ImageIcon size={28} className="text-slate-400" />
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 mt-1">Sidebar Logo Preview</span>
                  </div>

                  <div className="sm:col-span-9 space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Upload Sidebar Logo Image from Computer
                      </label>
                      <div className="flex items-center gap-2">
                        <label className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs">
                          <Upload size={14} />
                          <span>Choose Image File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const res = await compressImageFile(file, 800, 400, 0.9);
                                  if (res) {
                                    setContent({
                                      ...content,
                                      hero: { ...content.hero, complaintLogoImage: res },
                                    });
                                  }
                                } catch (err) {
                                  console.error('Failed to compress complaint logo:', err);
                                }
                              }
                            }}
                          />
                        </label>
                        {content.hero.complaintLogoImage && (
                          <button
                            type="button"
                            onClick={() =>
                              setContent({
                                ...content,
                                hero: { ...content.hero, complaintLogoImage: '' },
                              })
                            }
                            className="px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold border border-red-200 transition cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Or Enter Sidebar Logo Image URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://example.com/smart-drive.png"
                        value={content.hero.complaintLogoImage || ''}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, complaintLogoImage: e.target.value },
                          })
                        }
                        className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. HERO BACKGROUND & VISUAL STYLING SOFT-CODING MANAGER */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-5">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <label className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Palette size={18} className="text-emerald-600" />
                  <span>Hero Background & Visual Styling (100% Soft-Coded)</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Configure the hero background gradient, solid color, background image, overlay opacity, and ambient pattern.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-slate-200 p-1 rounded-xl text-xs self-start sm:self-auto gap-1">
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, bgType: 'gradient' },
                    })
                  }
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                    (content.hero.bgType || 'gradient') === 'gradient'
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles size={13} />
                  <span>Gradient Palettes</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, bgType: 'solid' },
                    })
                  }
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                    content.hero.bgType === 'solid'
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Palette size={13} />
                  <span>Solid Color</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, bgType: 'image' },
                    })
                  }
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 relative ${
                    content.hero.bgType === 'image'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-700 hover:text-emerald-700 bg-white/60'
                  }`}
                >
                  <ImageIcon size={14} />
                  <span>Background Image</span>
                  {content.hero.bgImage && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 animate-pulse" />
                  )}
                </button>
              </div>
              <SectionSaveButton label="Save Hero Style" compact />
            </div>
            </div>

            {/* GRADIENT MODE CONTROLS */}
            {(content.hero.bgType || 'gradient') === 'gradient' && (
              <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-2">
                    Quick Preset Color Palettes:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { name: 'EBS Deep Emerald', start: '#022c22', mid: '#064e3b', end: '#115e59', dir: 'to-r' },
                      { name: 'Midnight Slate', start: '#0f172a', mid: '#1e293b', end: '#0d9488', dir: 'to-r' },
                      { name: 'Electric Blue Tech', start: '#0c1e40', mid: '#1e3a8a', end: '#2563eb', dir: 'to-r' },
                      { name: 'Royal Purple & Indigo', start: '#1e1b4b', mid: '#312e81', end: '#6366f1', dir: 'to-r' },
                      { name: 'Dark Carbon Minimal', start: '#0a0a0a', mid: '#171717', end: '#262626', dir: 'to-r' },
                      { name: 'Forest Green Glow', start: '#052e16', mid: '#14532d', end: '#15803d', dir: 'to-r' },
                      { name: 'Sunset Gold & Amber', start: '#451a03', mid: '#78350f', end: '#b45309', dir: 'to-r' },
                      { name: 'Cyber Teal Radial', start: '#022c22', mid: '#064e3b', end: '#042f2e', dir: 'radial' },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() =>
                          setContent({
                            ...content,
                            hero: {
                              ...content.hero,
                              bgGradientStart: preset.start,
                              bgGradientMiddle: preset.mid,
                              bgGradientEnd: preset.end,
                              bgGradientDirection: preset.dir,
                            },
                          })
                        }
                        className="p-2 rounded-xl border border-slate-200 text-left transition hover:scale-[1.02] flex items-center gap-2 cursor-pointer shadow-2xs group"
                      >
                        <div
                          className="w-6 h-6 rounded-lg shrink-0 border border-white/20 shadow-xs"
                          style={{
                            background: `linear-gradient(135deg, ${preset.start}, ${preset.mid}, ${preset.end})`,
                          }}
                        />
                        <span className="text-[10px] font-bold text-slate-700 truncate group-hover:text-emerald-700">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Start Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={content.hero.bgGradientStart || '#022c22'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, bgGradientStart: e.target.value },
                          })
                        }
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                      />
                      <input
                        type="text"
                        value={content.hero.bgGradientStart || '#022c22'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, bgGradientStart: e.target.value },
                          })
                        }
                        className="w-full border border-slate-300 rounded-lg p-1.5 text-xs font-mono uppercase bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Middle Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={content.hero.bgGradientMiddle || '#064e3b'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, bgGradientMiddle: e.target.value },
                          })
                        }
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                      />
                      <input
                        type="text"
                        value={content.hero.bgGradientMiddle || '#064e3b'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, bgGradientMiddle: e.target.value },
                          })
                        }
                        className="w-full border border-slate-300 rounded-lg p-1.5 text-xs font-mono uppercase bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">End Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={content.hero.bgGradientEnd || '#115e59'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, bgGradientEnd: e.target.value },
                          })
                        }
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                      />
                      <input
                        type="text"
                        value={content.hero.bgGradientEnd || '#115e59'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, bgGradientEnd: e.target.value },
                          })
                        }
                        className="w-full border border-slate-300 rounded-lg p-1.5 text-xs font-mono uppercase bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Flow Direction</label>
                    <select
                      value={content.hero.bgGradientDirection || 'to-r'}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, bgGradientDirection: e.target.value },
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs font-semibold bg-white"
                    >
                      <option value="to-r">Horizontal (Left to Right)</option>
                      <option value="to-b">Vertical (Top to Bottom)</option>
                      <option value="to-br">Diagonal (Top-Left to Bottom-Right)</option>
                      <option value="to-tr">Diagonal (Bottom-Left to Top-Right)</option>
                      <option value="radial">Radial Center Glow</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* SOLID COLOR CONTROLS */}
            {content.hero.bgType === 'solid' && (
              <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Choose Solid Color</label>
                <div className="flex items-center gap-3 max-w-sm">
                  <input
                    type="color"
                    value={content.hero.bgSolidColor || '#064e3b'}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, bgSolidColor: e.target.value },
                      })
                    }
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={content.hero.bgSolidColor || '#064e3b'}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, bgSolidColor: e.target.value },
                      })
                    }
                    className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono uppercase bg-white font-semibold"
                  />
                </div>
              </div>
            )}

            {/* IMAGE BACKGROUND CONTROLS */}
            {content.hero.bgType === 'image' && (
              <div className="space-y-5 bg-white p-5 rounded-xl border border-slate-200">
                {/* 1. Live Banner Preview & Quick Status */}
                <div className="relative rounded-xl overflow-hidden border border-slate-300 h-44 flex items-center justify-center text-center p-4 shadow-inner">
                  {content.hero.bgImage ? (
                    <>
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                        style={{
                          backgroundImage: `url(${resolveImageUrl(content.hero.bgImage)})`,
                          backgroundSize: content.hero.bgSize || 'cover',
                          backgroundPosition: content.hero.bgPosition || 'center',
                          filter: content.hero.bgBlur ? `blur(${content.hero.bgBlur}px)` : undefined,
                        }}
                      />
                      <div
                        className="absolute inset-0 pointer-events-none transition-opacity"
                        style={{
                          backgroundColor: content.hero.bgOverlayColor || '#000000',
                          opacity: content.hero.bgOverlayOpacity ?? 0.75,
                        }}
                      />
                      <div className="relative z-10 text-white space-y-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/80 text-white inline-block">
                          Active Background Image
                        </span>
                        <h4 className="text-base font-black truncate max-w-md">
                          {content.hero.heading?.split('\n')[0] || 'Ekosmart Battery Solution'}
                        </h4>
                        <p className="text-[11px] opacity-80">
                          Dark Overlay: {Math.round((content.hero.bgOverlayOpacity ?? 0.75) * 100)}% • Tint: {content.hero.bgOverlayColor || '#000000'}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-slate-400 flex flex-col items-center gap-1.5">
                      <ImageIcon size={32} className="opacity-50" />
                      <span className="text-xs font-semibold">No Background Image Configured Yet</span>
                      <span className="text-[11px] text-slate-400">Upload a photo below or click one of the pre-tested EV presets</span>
                    </div>
                  )}
                </div>

                {/* If user has an image in logoImage, prompt 1-click migration */}
                {(content.hero.logoImage || content.headerNav?.logoImage) && !content.hero.bgImage && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-amber-900 font-medium">
                      <Sparkles size={16} className="text-amber-600 shrink-0" />
                      <span>Found image in Logo Uploader. Would you like to use it as this hero background?</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const img = content.hero.logoImage || content.headerNav?.logoImage || '';
                        setContent({
                          ...content,
                          hero: {
                            ...content.hero,
                            bgType: 'image',
                            bgImage: img,
                            showHeroLogo: false,
                          },
                        });
                      }}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shrink-0 cursor-pointer shadow-xs"
                    >
                      Use as Background Image
                    </button>
                  </div>
                )}

                {/* Upload & URL Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      Option A: Upload Background Image File
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Upload any high-res wallpaper, plant photo, or product banner (PNG, JPG, WEBP).
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <label className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs">
                        <Upload size={14} />
                        <span>Choose Banner Image File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const res = await compressImageFile(file, 1920, 1080, 0.88);
                                if (res) {
                                  setContent({
                                    ...content,
                                    hero: {
                                      ...content.hero,
                                      bgType: 'image',
                                      bgImage: res,
                                    },
                                  });
                                }
                              } catch (err) {
                                console.error('Failed to compress banner image:', err);
                              }
                            }
                          }}
                        />
                      </label>
                      {content.hero.bgImage && (
                        <button
                          type="button"
                          onClick={() =>
                            setContent({
                              ...content,
                              hero: { ...content.hero, bgImage: '' },
                            })
                          }
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold border border-red-200 transition cursor-pointer"
                        >
                          Remove Image
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      Option B: Or Enter Public Image URL
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Paste a direct HTTPS link from Unsplash, Cloudinary, AWS S3, or your CDN.
                    </p>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={content.hero.bgImage || ''}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: {
                            ...content.hero,
                            bgType: 'image',
                            bgImage: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono bg-white"
                    />
                  </div>
                </div>

                {/* Curated Pre-Tested Background Presets */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800">
                      Option C: One-Click Curated EV & Battery Presets
                    </label>
                    <span className="text-[10px] text-slate-500">Click to apply instantly</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {[
                      {
                        title: 'Lithium Cells',
                        url: 'https://images.unsplash.com/photo-1558441719-8b449c6ff673?auto=format&fit=crop&w=1920&q=80',
                      },
                      {
                        title: 'EV Mobility',
                        url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1920&q=80',
                      },
                      {
                        title: 'High-Tech Circuit',
                        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80',
                      },
                      {
                        title: 'EV Factory Plant',
                        url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80',
                      },
                      {
                        title: 'Emerald Wave',
                        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80',
                      },
                      {
                        title: 'EV Charging Grid',
                        url: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1920&q=80',
                      },
                    ].map((preset) => (
                      <button
                        key={preset.title}
                        type="button"
                        onClick={() =>
                          setContent({
                            ...content,
                            hero: {
                              ...content.hero,
                              bgType: 'image',
                              bgImage: preset.url,
                            },
                          })
                        }
                        className={`group relative rounded-xl overflow-hidden border p-1 text-left transition hover:scale-[1.02] cursor-pointer ${
                          content.hero.bgImage === preset.url
                            ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                            : 'border-slate-200'
                        }`}
                      >
                        <div
                          className="h-14 w-full rounded-lg bg-cover bg-center"
                          style={{ backgroundImage: `url(${preset.url})` }}
                        />
                        <span className="block text-[10px] font-bold text-slate-700 truncate mt-1 group-hover:text-emerald-700">
                          {preset.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Overlay, Tint, Position & Blur Fine-Tuning */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-200 text-xs">
                  {/* Overlay Darkness Slider */}
                  <div>
                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-700 mb-1">
                      <span>Dark Overlay Darkness</span>
                      <span className="text-emerald-700 font-extrabold">
                        {Math.round((content.hero.bgOverlayOpacity ?? 0.75) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={content.hero.bgOverlayOpacity ?? 0.75}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, bgOverlayOpacity: parseFloat(e.target.value) },
                        })
                      }
                      className="w-full accent-emerald-600"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Recommended: 70% - 85% for crystal-clear text contrast</p>
                  </div>

                  {/* Overlay Color Tint */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Overlay Tint Color</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={content.hero.bgOverlayColor || '#000000'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, bgOverlayColor: e.target.value },
                          })
                        }
                        className="w-7 h-7 rounded cursor-pointer border p-0 bg-white shrink-0"
                      />
                      <input
                        type="text"
                        value={content.hero.bgOverlayColor || '#000000'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, bgOverlayColor: e.target.value },
                          })
                        }
                        placeholder="#000000"
                        className="w-full border border-slate-300 rounded-lg p-1.5 text-xs font-mono"
                      />
                    </div>
                    <div className="flex gap-1 mt-1">
                      {[
                        { label: 'Black', val: '#000000' },
                        { label: 'Emerald', val: '#022c22' },
                        { label: 'Navy', val: '#0f172a' },
                      ].map((t) => (
                        <button
                          key={t.label}
                          type="button"
                          onClick={() =>
                            setContent({
                              ...content,
                              hero: { ...content.hero, bgOverlayColor: t.val },
                            })
                          }
                          className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Background Position */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Focal Position</label>
                    <select
                      value={content.hero.bgPosition || 'center'}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, bgPosition: e.target.value },
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white font-medium"
                    >
                      <option value="center">Center (Recommended)</option>
                      <option value="top">Top Focused</option>
                      <option value="bottom">Bottom Focused</option>
                    </select>
                  </div>

                  {/* Parallax / Attachment */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Parallax Scroll</label>
                    <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={content.hero.bgAttachment === 'fixed'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: {
                              ...content.hero,
                              bgAttachment: e.target.checked ? 'fixed' : 'scroll',
                            },
                          })
                        }
                        className="rounded text-green-600 h-4 w-4"
                      />
                      <span className="text-[11px] font-semibold text-slate-700">Fixed Parallax Effect</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Pattern Overlay & Text Color */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Ambient Tech Pattern</label>
                <select
                  value={content.hero.bgPattern || 'mesh'}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, bgPattern: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white font-medium"
                >
                  <option value="mesh">Subtle Tech Dot Matrix Mesh</option>
                  <option value="none">None (Clean Background)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Hero Text & Headings Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={content.hero.textColor || '#ffffff'}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, textColor: e.target.value },
                      })
                    }
                    className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={content.hero.textColor || '#ffffff'}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, textColor: e.target.value },
                      })
                    }
                    className="flex-1 border border-slate-300 rounded-lg p-1.5 text-xs font-mono uppercase bg-white font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 5. TOP PILL BADGE & MAIN SLOGANS (100% SOFT-CODED) */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <label className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                <span>Top Pill Badge, Heading & Welcome Subheading</span>
              </label>
              <SectionSaveButton label="Save Headlines" compact />
            </div>

            {/* Pill Badge */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs">Top Badge Pill</span>
                <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={content.hero.badgeVisible ?? true}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, badgeVisible: e.target.checked },
                      })
                    }
                    className="rounded text-green-600 h-3.5 w-3.5"
                  />
                  <span>Show Badge Pill</span>
                </label>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 text-[11px]">Badge Text</label>
                <input
                  type="text"
                  value={content.hero.badgeText || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, badgeText: e.target.value },
                    })
                  }
                  placeholder="Official EBS Battery Solution Portal • Kota, Rajasthan"
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-slate-600 text-[10px] font-bold mb-1">Badge Background Color</label>
                  <input
                    type="text"
                    value={content.hero.badgeBgColor || 'rgba(6, 78, 59, 0.6)'}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, badgeBgColor: e.target.value },
                      })
                    }
                    placeholder="rgba(6, 78, 59, 0.6) or #064e3b"
                    className="w-full border border-slate-300 rounded-lg p-1.5 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 text-[10px] font-bold mb-1">Badge Text Color</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={content.hero.badgeTextColor || '#6ee7b7'}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, badgeTextColor: e.target.value },
                        })
                      }
                      className="w-7 h-7 rounded cursor-pointer border p-0 bg-white shrink-0"
                    />
                    <input
                      type="text"
                      value={content.hero.badgeTextColor || '#6ee7b7'}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, badgeTextColor: e.target.value },
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg p-1.5 text-xs font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-600 text-[10px] font-bold mb-1">Badge Border Color</label>
                  <input
                    type="text"
                    value={content.hero.badgeBorderColor || 'rgba(16, 185, 129, 0.4)'}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, badgeBorderColor: e.target.value },
                      })
                    }
                    placeholder="rgba(16, 185, 129, 0.4)"
                    className="w-full border border-slate-300 rounded-lg p-1.5 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Main Heading (Line break: press Enter)</label>
              <textarea
                rows={2}
                value={content.hero.heading}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, heading: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-green-500 font-bold bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Subheading Description</label>
              <textarea
                rows={3}
                value={content.hero.subheading}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, subheading: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-green-500 bg-white"
              />
            </div>
          </div>

          {/* 6. 3 CORE FEATURE HIGHLIGHTS (100% SOFT-CODED) */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <label className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Zap size={16} className="text-yellow-500" />
                  <span>3 Feature Highlight Badges (Under Subheading)</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Customize the icon, label, accent color, and visibility for each of the 3 highlights.
                </p>
              </div>
              <SectionSaveButton label="Save Highlights" compact />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Highlight 1 */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs">Highlight 1</span>
                  <label className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.hero.highlight1Visible ?? true}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, highlight1Visible: e.target.checked },
                        })
                      }
                      className="rounded text-green-600 h-3 w-3"
                    />
                    <span>Show</span>
                  </label>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Label Text</label>
                  <input
                    type="text"
                    value={content.hero.highlight1Text || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, highlight1Text: e.target.value },
                      })
                    }
                    placeholder="High Charging Power"
                    className="w-full border border-slate-300 rounded-lg p-1.5 text-xs font-semibold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Icon</label>
                    <select
                      value={content.hero.highlight1Icon || 'Zap'}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, highlight1Icon: e.target.value },
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg p-1.5 text-xs bg-white font-medium"
                    >
                      <option value="Zap">Zap (Lightning)</option>
                      <option value="Battery">Battery</option>
                      <option value="Wrench">Wrench (Tools)</option>
                      <option value="ShieldCheck">Shield Check</option>
                      <option value="Sparkles">Sparkles</option>
                      <option value="CheckCircle2">Check Circle</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Color</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={content.hero.highlight1Color || '#facc15'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, highlight1Color: e.target.value },
                          })
                        }
                        className="w-7 h-7 rounded cursor-pointer border p-0 bg-white shrink-0"
                      />
                      <input
                        type="text"
                        value={content.hero.highlight1Color || '#facc15'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, highlight1Color: e.target.value },
                          })
                        }
                        className="w-full border border-slate-300 rounded-lg p-1 text-[11px] font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Highlight 2 */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs">Highlight 2</span>
                  <label className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.hero.highlight2Visible ?? true}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, highlight2Visible: e.target.checked },
                        })
                      }
                      className="rounded text-green-600 h-3 w-3"
                    />
                    <span>Show</span>
                  </label>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Label Text</label>
                  <input
                    type="text"
                    value={content.hero.highlight2Text || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, highlight2Text: e.target.value },
                      })
                    }
                    placeholder="Long Life (3 & 1.5 Year Warranty)"
                    className="w-full border border-slate-300 rounded-lg p-1.5 text-xs font-semibold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Icon</label>
                    <select
                      value={content.hero.highlight2Icon || 'Battery'}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, highlight2Icon: e.target.value },
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg p-1.5 text-xs bg-white font-medium"
                    >
                      <option value="Battery">Battery</option>
                      <option value="Zap">Zap (Lightning)</option>
                      <option value="Wrench">Wrench (Tools)</option>
                      <option value="ShieldCheck">Shield Check</option>
                      <option value="Sparkles">Sparkles</option>
                      <option value="CheckCircle2">Check Circle</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Color</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={content.hero.highlight2Color || '#4ade80'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, highlight2Color: e.target.value },
                          })
                        }
                        className="w-7 h-7 rounded cursor-pointer border p-0 bg-white shrink-0"
                      />
                      <input
                        type="text"
                        value={content.hero.highlight2Color || '#4ade80'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, highlight2Color: e.target.value },
                          })
                        }
                        className="w-full border border-slate-300 rounded-lg p-1 text-[11px] font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Highlight 3 */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs">Highlight 3</span>
                  <label className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.hero.highlight3Visible ?? true}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, highlight3Visible: e.target.checked },
                        })
                      }
                      className="rounded text-green-600 h-3 w-3"
                    />
                    <span>Show</span>
                  </label>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Label Text</label>
                  <input
                    type="text"
                    value={content.hero.highlight3Text || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, highlight3Text: e.target.value },
                      })
                    }
                    placeholder="Low Maintenance"
                    className="w-full border border-slate-300 rounded-lg p-1.5 text-xs font-semibold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Icon</label>
                    <select
                      value={content.hero.highlight3Icon || 'Wrench'}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, highlight3Icon: e.target.value },
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg p-1.5 text-xs bg-white font-medium"
                    >
                      <option value="Wrench">Wrench (Tools)</option>
                      <option value="Zap">Zap (Lightning)</option>
                      <option value="Battery">Battery</option>
                      <option value="ShieldCheck">Shield Check</option>
                      <option value="Sparkles">Sparkles</option>
                      <option value="CheckCircle2">Check Circle</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Color</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={content.hero.highlight3Color || '#5eead4'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, highlight3Color: e.target.value },
                          })
                        }
                        className="w-7 h-7 rounded cursor-pointer border p-0 bg-white shrink-0"
                      />
                      <input
                        type="text"
                        value={content.hero.highlight3Color || '#5eead4'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, highlight3Color: e.target.value },
                          })
                        }
                        className="w-full border border-slate-300 rounded-lg p-1 text-[11px] font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 7. HERO CTA ACTION BUTTONS (100% SOFT-CODED) */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <label className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span>Hero Call-to-Action (CTA) Action Buttons</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Configure labels, URLs, window target, background colors, text colors, and visibility switches.
                </p>
              </div>
              <SectionSaveButton label="Save CTA Buttons" compact />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Primary CTA Button */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800">Primary CTA Button (e.g. Register Complaint)</span>
                  <label className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.hero.primaryButtonVisible ?? true}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, primaryButtonVisible: e.target.checked },
                        })
                      }
                      className="rounded text-green-600 h-3 w-3"
                    />
                    <span>Show Button</span>
                  </label>
                </div>

                <div>
                  <label className="block text-slate-600 text-[11px] mb-1 font-semibold">Button Label</label>
                  <input
                    type="text"
                    value={content.hero.primaryButtonText}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, primaryButtonText: e.target.value },
                      })
                    }
                    placeholder="Register Complaint"
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1 font-semibold">Target Link URL</label>
                    <input
                      type="text"
                      value={content.hero.primaryButtonLink}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, primaryButtonLink: e.target.value },
                        })
                      }
                      placeholder="/complaint/register"
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1 font-semibold">Open Target</label>
                    <select
                      value={content.hero.primaryButtonTarget || '_self'}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, primaryButtonTarget: e.target.value as any },
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white font-medium"
                    >
                      <option value="_self">Same Tab (_self)</option>
                      <option value="_blank">New Tab / Window (_blank)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Button Background</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={content.hero.primaryButtonBgColor || '#10b981'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, primaryButtonBgColor: e.target.value },
                          })
                        }
                        className="w-7 h-7 rounded cursor-pointer border p-0 bg-white shrink-0"
                      />
                      <input
                        type="text"
                        value={content.hero.primaryButtonBgColor || '#10b981'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, primaryButtonBgColor: e.target.value },
                          })
                        }
                        className="w-full border border-slate-300 rounded-lg p-1 text-[11px] font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Text Color</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={content.hero.primaryButtonTextColor || '#020617'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, primaryButtonTextColor: e.target.value },
                          })
                        }
                        className="w-7 h-7 rounded cursor-pointer border p-0 bg-white shrink-0"
                      />
                      <input
                        type="text"
                        value={content.hero.primaryButtonTextColor || '#020617'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, primaryButtonTextColor: e.target.value },
                          })
                        }
                        className="w-full border border-slate-300 rounded-lg p-1 text-[11px] font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary CTA Button */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800">Secondary CTA Button (e.g. Check Warranty)</span>
                  <label className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.hero.secondaryButtonVisible ?? true}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, secondaryButtonVisible: e.target.checked },
                        })
                      }
                      className="rounded text-green-600 h-3 w-3"
                    />
                    <span>Show Button</span>
                  </label>
                </div>

                <div>
                  <label className="block text-slate-600 text-[11px] mb-1 font-semibold">Button Label</label>
                  <input
                    type="text"
                    value={content.hero.secondaryButtonText}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, secondaryButtonText: e.target.value },
                      })
                    }
                    placeholder="Check Battery Warranty"
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1 font-semibold">Target Link URL</label>
                    <input
                      type="text"
                      value={content.hero.secondaryButtonLink}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, secondaryButtonLink: e.target.value },
                        })
                      }
                      placeholder="/warranty/check"
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1 font-semibold">Open Target</label>
                    <select
                      value={content.hero.secondaryButtonTarget || '_blank'}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, secondaryButtonTarget: e.target.value as any },
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white font-medium"
                    >
                      <option value="_blank">New Tab / Window (_blank)</option>
                      <option value="_self">Same Tab (_self)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Button Background</label>
                    <input
                      type="text"
                      value={content.hero.secondaryButtonBgColor || 'rgba(255, 255, 255, 0.1)'}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, secondaryButtonBgColor: e.target.value },
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg p-1.5 text-[11px] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Text Color</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={content.hero.secondaryButtonTextColor || '#ffffff'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, secondaryButtonTextColor: e.target.value },
                          })
                        }
                        className="w-7 h-7 rounded cursor-pointer border p-0 bg-white shrink-0"
                      />
                      <input
                        type="text"
                        value={content.hero.secondaryButtonTextColor || '#ffffff'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, secondaryButtonTextColor: e.target.value },
                          })
                        }
                        className="w-full border border-slate-300 rounded-lg p-1 text-[11px] font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Border Color</label>
                    <input
                      type="text"
                      value={content.hero.secondaryButtonBorderColor || 'rgba(255, 255, 255, 0.2)'}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, secondaryButtonBorderColor: e.target.value },
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg p-1.5 text-[11px] font-mono"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer pt-1 font-semibold">
                  <input
                    type="checkbox"
                    checked={content.hero.secondaryButtonShowIcon ?? true}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, secondaryButtonShowIcon: e.target.checked },
                      })
                    }
                    className="rounded text-green-600 h-3.5 w-3.5"
                  />
                  <span>Show External Arrow Icon (↗)</span>
                </label>
              </div>
            </div>
          </div>

          {/* 8. REAL-TIME LIVE COMPLETE HEADER & HERO PREVIEW */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <label className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Sparkles size={16} className="text-emerald-600" />
                <span>Real-Time Live Header & Hero Banner Preview</span>
              </label>
              <SectionSaveButton label="Save Hero Settings" compact />
            </div>

            <div className="rounded-2xl border border-slate-300 overflow-hidden shadow-lg">
              {/* Preview Top Bar */}
              {(content.topBar?.isVisible ?? true) && (
                <div
                  style={{
                    backgroundColor: content.topBar?.bgColor || '#0f172a',
                    color: content.topBar?.textColor || '#cbd5e1',
                  }}
                  className="px-4 py-2 text-[10px] flex flex-wrap justify-between items-center gap-2 border-b border-white/10"
                >
                  <div className="flex items-center gap-3">
                    {(content.topBar?.showPhone ?? true) && (
                      <span
                        style={{ color: content.topBar?.accentColor || '#34d399' }}
                        className="flex items-center gap-1 font-semibold"
                      >
                        <Phone size={10} />
                        <span>
                          {content.topBar?.phoneLabel || 'Helpline:'} {content.topBar?.phone || '+91 8949049003'}
                        </span>
                      </span>
                    )}
                    {(content.topBar?.showOfficeHours ?? true) && (
                      <span className="flex items-center gap-1 opacity-80">
                        <Clock size={10} />
                        <span>{content.topBar?.officeHours || '10:00 AM to 6:30 PM (Mon - Sat)'}</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 opacity-80">
                    {(content.topBar?.showGstin ?? true) && (
                      <span className="font-mono">GSTIN: {content.topBar?.gstin || '08DTUPM4205B1Z0'}</span>
                    )}
                    {(content.topBar?.showLocation ?? true) && (
                      <span
                        style={{ color: content.topBar?.accentColor || '#34d399' }}
                        className="flex items-center gap-1 font-semibold opacity-100"
                      >
                        <MapPin size={10} />
                        <span>{content.topBar?.location || 'Kota, Rajasthan'}</span>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Preview Main Navbar */}
              <div
                style={{
                  backgroundColor: content.headerNav?.navBgColor || '#ffffff',
                  borderColor: content.headerNav?.navBorderColor || '#e2e8f0',
                }}
                className="px-4 py-3 flex items-center justify-between border-b"
              >
                <div className="flex items-center gap-2.5">
                  {(content.headerNav?.logoType || content.hero.logoType) === 'image' && (content.headerNav?.logoImage || content.hero.logoImage) ? (
                    <img
                      src={resolveImageUrl(content.headerNav?.logoImage || content.hero.logoImage || '')}
                      alt="Brand Logo"
                      className="h-8 max-w-[120px] object-contain"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-950 flex items-center justify-center text-white text-[11px] font-black border border-emerald-500/40">
                        EBS
                      </div>
                      <div className="text-left leading-tight">
                        <span className="font-black text-xs text-slate-900 tracking-tight block">
                          {content.headerNav?.brandTitle || 'EBS EKOSMART'}
                        </span>
                        <span className="text-[9px] font-bold text-emerald-700 tracking-wider uppercase block">
                          {content.headerNav?.brandSubtitle || 'Battery Solution • Li-ion & LFP'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs font-bold text-slate-800">
                  {(content.headerNav?.showHome ?? true) && (
                    <span className="text-emerald-700 flex items-center gap-1 border-b-2 border-emerald-600 pb-0.5">
                      <Home size={12} />
                      <span>{content.headerNav?.homeLabel || 'Home'}</span>
                    </span>
                  )}
                  {(content.headerNav?.showWallet ?? true) && (
                    <span className="px-2 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1 text-[11px]">
                      <Coins size={12} className="text-amber-600" />
                      <span>{content.headerNav?.walletLabel || 'Wallet & Coins'}</span>
                      {(content.headerNav?.showWalletBadge ?? true) && (
                        <span className="bg-amber-200 text-amber-950 text-[9px] px-1 rounded font-black">500</span>
                      )}
                    </span>
                  )}
                  {(content.headerNav?.showRefer ?? true) && (
                    <span className="px-2 py-1 rounded-lg bg-purple-50 text-purple-900 border border-purple-200 flex items-center gap-1 text-[11px]">
                      <Gift size={12} className="text-purple-600" />
                      <span>{content.headerNav?.referLabel || 'Refer & Earn'} (+500)</span>
                    </span>
                  )}
                  {(content.headerNav?.showAccount ?? true) && (
                    <span
                      style={{
                        backgroundColor: content.headerNav?.accountBtnBg || '#059669',
                        color: content.headerNav?.accountBtnText || '#ffffff',
                      }}
                      className="px-3 py-1 rounded-lg text-[11px] font-bold shadow-xs flex items-center gap-1"
                    >
                      <User size={11} />
                      <span>{content.headerNav?.accountLabel || 'Account / Login'}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Preview Hero Banner */}
              <div
                style={{
                  background:
                    content.hero.bgType === 'solid'
                      ? content.hero.bgSolidColor || '#064e3b'
                      : content.hero.bgGradientDirection === 'radial'
                      ? `radial-gradient(circle at center, ${content.hero.bgGradientMiddle || '#064e3b'} 0%, ${content.hero.bgGradientStart || '#022c22'} 70%, ${content.hero.bgGradientEnd || '#115e59'} 100%)`
                      : `linear-gradient(to right, ${content.hero.bgGradientStart || '#022c22'}, ${content.hero.bgGradientMiddle || '#064e3b'}, ${content.hero.bgGradientEnd || '#115e59'})`,
                  color: content.hero.textColor || '#ffffff',
                }}
                className="p-8 sm:p-12 text-center space-y-5 relative overflow-hidden"
              >
                {/* Full Hero Background Image Layer if image mode or bgImage exists */}
                {(content.hero.bgType === 'image' || Boolean(content.hero.bgImage)) && content.hero.bgImage && (
                  <div
                    className="absolute inset-0 pointer-events-none transition-all duration-300"
                    style={{
                      backgroundImage: `url(${resolveImageUrl(content.hero.bgImage)})`,
                      backgroundSize: content.hero.bgSize || 'cover',
                      backgroundPosition: content.hero.bgPosition || 'center',
                      backgroundRepeat: 'no-repeat',
                      filter: content.hero.bgBlur ? `blur(${content.hero.bgBlur}px)` : undefined,
                    }}
                  />
                )}

                {/* Dark Overlay Tint Layer */}
                {(content.hero.bgType === 'image' || Boolean(content.hero.bgImage)) && content.hero.bgImage && (
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity"
                    style={{
                      backgroundColor: content.hero.bgOverlayColor || '#000000',
                      opacity: content.hero.bgOverlayOpacity ?? 0.75,
                    }}
                  />
                )}

                {content.hero.bgPattern !== 'none' && (
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />
                )}

                <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
                  {/* Optional Emblem/Logo in Hero */}
                  {(content.hero.showHeroLogo ?? false) && content.hero.logoImage && (
                    <div className="flex justify-center mb-2">
                      <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20 inline-block shadow-sm">
                        <img
                          src={resolveImageUrl(content.hero.logoImage)}
                          alt="Hero Logo"
                          className="h-10 max-h-12 w-auto max-w-[180px] object-contain"
                        />
                      </div>
                    </div>
                  )}
                  {(content.hero.badgeVisible ?? true) && (
                    <div
                      style={{
                        backgroundColor: content.hero.badgeBgColor || 'rgba(6, 78, 59, 0.6)',
                        color: content.hero.badgeTextColor || '#6ee7b7',
                        borderColor: content.hero.badgeBorderColor || 'rgba(16, 185, 129, 0.4)',
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border"
                    >
                      <Sparkles size={12} />
                      <span>{content.hero.badgeText || 'Official EBS Battery Solution Portal'}</span>
                    </div>
                  )}

                  <h3 className="text-2xl sm:text-3xl font-black whitespace-pre-line leading-tight">
                    {content.hero.heading}
                  </h3>

                  <p className="text-xs opacity-90 leading-relaxed max-w-xl mx-auto">
                    {content.hero.subheading}
                  </p>

                  {/* Highlights in Preview */}
                  <div className="flex flex-wrap justify-center gap-3 pt-1">
                    {(content.hero.highlight1Visible ?? true) && (
                      <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg border border-white/10 text-[11px] font-bold">
                        <span style={{ color: content.hero.highlight1Color || '#facc15' }}>
                          <Zap size={13} />
                        </span>
                        <span>{content.hero.highlight1Text || 'High Charging Power'}</span>
                      </div>
                    )}
                    {(content.hero.highlight2Visible ?? true) && (
                      <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg border border-white/10 text-[11px] font-bold">
                        <span style={{ color: content.hero.highlight2Color || '#4ade80' }}>
                          <Battery size={13} />
                        </span>
                        <span>{content.hero.highlight2Text || 'Long Life'}</span>
                      </div>
                    )}
                    {(content.hero.highlight3Visible ?? true) && (
                      <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg border border-white/10 text-[11px] font-bold">
                        <span style={{ color: content.hero.highlight3Color || '#5eead4' }}>
                          <Wrench size={13} />
                        </span>
                        <span>{content.hero.highlight3Text || 'Low Maintenance'}</span>
                      </div>
                    )}
                  </div>

                  {/* Buttons in Preview */}
                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    {(content.hero.primaryButtonVisible ?? true) && content.hero.primaryButtonText && (
                      <span
                        style={{
                          backgroundColor: content.hero.primaryButtonBgColor || '#10b981',
                          color: content.hero.primaryButtonTextColor || '#020617',
                        }}
                        className="px-6 py-2.5 font-black rounded-full text-xs shadow-md cursor-default"
                      >
                        {content.hero.primaryButtonText}
                      </span>
                    )}
                    {(content.hero.secondaryButtonVisible ?? true) && content.hero.secondaryButtonText && (
                      <span
                        style={{
                          backgroundColor: content.hero.secondaryButtonBgColor || 'rgba(255, 255, 255, 0.1)',
                          color: content.hero.secondaryButtonTextColor || '#ffffff',
                          borderColor: content.hero.secondaryButtonBorderColor || 'rgba(255, 255, 255, 0.2)',
                        }}
                        className="px-6 py-2.5 font-bold rounded-full text-xs border shadow-sm cursor-default inline-flex items-center gap-1.5"
                      >
                        <span>{content.hero.secondaryButtonText}</span>
                        {(content.hero.secondaryButtonShowIcon ?? true) && (
                          <ExternalLink size={12} className="text-emerald-300" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Save Bar for Hero */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <SectionSaveButton label="Save Hero & Header Suite" />
          </div>
        </div>
      )}

      {/* TAB: CUSTOMER REWARDS & WALLET / REFERRALS */}
      {activeTab === 'rewards' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Coins className="text-amber-500" size={20} />
                  <span>Customer Wallet & Referral Coins Management</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure coin reward rules for battery purchases, showroom billings, friend referrals, and digital wallet store credit conversion.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer self-start sm:self-auto bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200">
                  <input
                    type="checkbox"
                    checked={referralSettings.enabled ?? true}
                    onChange={(e) => setReferralSettings({ ...referralSettings, enabled: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
                  />
                  <span className="font-bold text-amber-900">Enable Rewards & Referral System</span>
                </label>
                <SectionSaveButton label="Save Rewards" compact />
              </div>
            </div>

            {/* Coin Configuration Settings Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 1. Battery Purchase Coins */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Battery size={15} className="text-teal-600" />
                    <span>Battery Purchase Reward</span>
                  </label>
                  <span className="text-[10px] font-extrabold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                    +{referralSettings.batteryCoins || 500} Coins
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={referralSettings.batteryCoins || 0}
                  onChange={(e) =>
                    setReferralSettings({ ...referralSettings, batteryCoins: Number(e.target.value) || 0 })
                  }
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-800"
                />
                <p className="text-[11px] text-slate-500 leading-tight">
                  Coins credited to customer wallet when purchasing an EV Lithium Battery pack.
                </p>
              </div>

              {/* 2. Showroom Billing Coins */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Store size={15} className="text-emerald-600" />
                    <span>Showroom Billing Reward</span>
                  </label>
                  <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    +{referralSettings.showroomCoins || 250} Coins
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={referralSettings.showroomCoins || 0}
                  onChange={(e) =>
                    setReferralSettings({ ...referralSettings, showroomCoins: Number(e.target.value) || 0 })
                  }
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-800"
                />
                <p className="text-[11px] text-slate-500 leading-tight">
                  Coins credited per verified showroom invoice / store billing transaction.
                </p>
              </div>

              {/* 3. Referrer Reward (Friend Referral) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Gift size={15} className="text-purple-600" />
                    <span>Referrer Bonus (Friend Invite)</span>
                  </label>
                  <span className="text-[10px] font-extrabold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                    +{referralSettings.referrerReward || 500} Coins
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={referralSettings.referrerReward || 0}
                  onChange={(e) =>
                    setReferralSettings({ ...referralSettings, referrerReward: Number(e.target.value) || 0 })
                  }
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-800"
                />
                <p className="text-[11px] text-slate-500 leading-tight">
                  Coins credited to existing customer when their invited friend joins using their link.
                </p>
              </div>

              {/* 4. New Customer Welcome Bonus */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles size={15} className="text-amber-500" />
                    <span>New Customer Welcome Bonus</span>
                  </label>
                  <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    +{referralSettings.newCustomerReward || referralSettings.welcomeRewardCoins || 500} Coins
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={referralSettings.newCustomerReward || referralSettings.welcomeRewardCoins || 0}
                  onChange={(e) =>
                    setReferralSettings({
                      ...referralSettings,
                      newCustomerReward: Number(e.target.value) || 0,
                      welcomeRewardCoins: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-800"
                />
                <p className="text-[11px] text-slate-500 leading-tight">
                  Coins instantly awarded upon first customer account login / registration.
                </p>
              </div>

              {/* 5. Service / Complaint Resolution Reward */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Wrench size={15} className="text-blue-600" />
                    <span>Service Resolution Bonus</span>
                  </label>
                  <span className="text-[10px] font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    +{referralSettings.serviceReward || 250} Coins
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={referralSettings.serviceReward || 0}
                  onChange={(e) =>
                    setReferralSettings({ ...referralSettings, serviceReward: Number(e.target.value) || 0 })
                  }
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-800"
                />
                <p className="text-[11px] text-slate-500 leading-tight">
                  Appreciation coins awarded when customer completes feedback after ticket resolution.
                </p>
              </div>

              {/* 6. Coin Conversion Rate */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Award size={15} className="text-indigo-600" />
                    <span>Store Credit Conversion (₹ / Coin)</span>
                  </label>
                  <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                    1 Coin = ₹{referralSettings.coinConversionRate || 1}
                  </span>
                </div>
                <input
                  type="number"
                  min="0.01"
                  step="0.1"
                  value={referralSettings.coinConversionRate || 1}
                  onChange={(e) =>
                    setReferralSettings({ ...referralSettings, coinConversionRate: Number(e.target.value) || 1 })
                  }
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-800"
                />
                <p className="text-[11px] text-slate-500 leading-tight">
                  Rupee value per coin when customer redeems coins on rental or service bookings.
                </p>
              </div>
            </div>

            {/* Live Customer Portal Rewards Banner Preview */}
            <div className="pt-2">
              <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Eye size={14} className="text-amber-500" />
                <span>Live Homepage Customer Rewards Banner Preview</span>
              </span>
              <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 rounded-3xl p-6 border-2 border-amber-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center shadow-lg flex-shrink-0">
                    <Coins size={28} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-200 text-amber-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Customer Rewards
                      </span>
                      <span className="text-xs font-bold text-amber-800">
                        1 Coin = ₹{referralSettings.coinConversionRate || 1} Store Credit
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-amber-950">
                      Ekosmart Digital Wallet & Referral Coins
                    </h3>
                    <p className="text-xs text-amber-900/80 max-w-xl">
                      Earn <strong className="font-bold text-amber-950">+{referralSettings.batteryCoins || 500} Coins</strong> on EV Battery purchases, <strong className="font-bold text-amber-950">+{referralSettings.showroomCoins || 250} Coins</strong> on Showroom billing, and <strong className="font-bold text-amber-950">+{referralSettings.referrerReward || 500} Coins</strong> on friend referrals!
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="px-5 py-2.5 bg-amber-600 text-white font-black rounded-2xl text-xs shadow-md flex items-center justify-center gap-2">
                    <Coins size={15} />
                    <span>Open My Wallet</span>
                  </div>
                  <div className="px-4 py-2.5 bg-white text-amber-900 font-bold rounded-2xl text-xs border border-amber-300 shadow-xs flex items-center justify-center gap-1.5">
                    <Gift size={15} className="text-purple-600" />
                    <span>Refer & Earn (+{referralSettings.referrerReward || 500})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Save Bar */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-lg">
            <div>
              <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                <span>Publish Wallet & Referral Rewards</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Saving will immediately apply coin rewards rules to customer accounts, referrals, and public banner.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition shadow-md disabled:opacity-50 cursor-pointer"
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Rewards & Referral Settings'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB: BATTERY ASSISTANCE & QUICK ACTIONS */}
      {activeTab === 'banner' && (
        <div className="space-y-6">
          {/* Section 1: EBS Factory Battery Assistance Banner - Fully Softcoded Suite */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
            {/* 1.1 Header & Section Visibility Toggle */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Battery className="text-teal-600" size={20} />
                  <span>EBS Factory Battery Assistance Banner Configuration</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fully soft-code background image, solid/gradient styling, custom typography, technical highlights, and technical contacts card with direct WhatsApp chat.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Section Visibility:</span>
                <button
                  type="button"
                  onClick={() => {
                    const current = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                    setContent({
                      ...content,
                      batteryBanner: {
                        ...current,
                        isVisible: current.isVisible === false ? true : false,
                      },
                    });
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    (content.batteryBanner?.isVisible ?? true)
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {(content.batteryBanner?.isVisible ?? true) ? (
                    <>
                      <Eye size={14} />
                      <span>Enabled on Homepage</span>
                    </>
                  ) : (
                    <>
                      <EyeOff size={14} />
                      <span>Hidden on Homepage</span>
                    </>
                  )}
                </button>
                <SectionSaveButton label="Save Banner" compact />
              </div>
            </div>

            {/* 1.2 Container Background & Styling Manager */}
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Palette size={15} className="text-teal-600" />
                  <span>Banner Background Mode & Styling</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-500">
                    Mode: <strong className="text-teal-700 uppercase">{content.batteryBanner?.bgType || 'gradient'}</strong>
                  </span>
                  <SectionSaveButton label="Save Style" compact />
                </div>
              </div>

              {/* Mode Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'gradient', label: 'Linear Gradient' },
                  { id: 'color', label: 'Solid Color' },
                  { id: 'image', label: 'Background Image' },
                  { id: 'transparent', label: 'Transparent' },
                ].map((mode) => {
                  const currentMode = content.batteryBanner?.bgType === 'solid' ? 'color' : (content.batteryBanner?.bgType || 'gradient');
                  const isSelected = currentMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => {
                        const current = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                        setContent({
                          ...content,
                          batteryBanner: {
                            ...current,
                            bgType: mode.id === 'color' ? 'solid' : (mode.id as any),
                          },
                        });
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        isSelected
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {mode.label}
                    </button>
                  );
                })}
              </div>

              {/* Sub-panel: Linear Gradient */}
              {(content.batteryBanner?.bgType === 'gradient' || !content.batteryBanner?.bgType) && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Start Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={content.batteryBanner?.bgGradientStart || '#0f172a'}
                          onChange={(e) => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, bgGradientStart: e.target.value },
                            });
                          }}
                          className="w-8 h-8 rounded cursor-pointer border p-0.5"
                        />
                        <input
                          type="text"
                          value={content.batteryBanner?.bgGradientStart || '#0f172a'}
                          onChange={(e) => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, bgGradientStart: e.target.value },
                            });
                          }}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">End Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={content.batteryBanner?.bgGradientEnd || '#1e3a8a'}
                          onChange={(e) => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, bgGradientEnd: e.target.value },
                            });
                          }}
                          className="w-8 h-8 rounded cursor-pointer border p-0.5"
                        />
                        <input
                          type="text"
                          value={content.batteryBanner?.bgGradientEnd || '#1e3a8a'}
                          onChange={(e) => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, bgGradientEnd: e.target.value },
                            });
                          }}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Direction</label>
                      <select
                        value={content.batteryBanner?.bgGradientDirection || 'to-br'}
                        onChange={(e) => {
                          const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                          setContent({
                            ...content,
                            batteryBanner: { ...cur, bgGradientDirection: e.target.value },
                          });
                        }}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                      >
                        <option value="to-br">Top-Left to Bottom-Right (Diagonal)</option>
                        <option value="to-r">Left to Right (Horizontal)</option>
                        <option value="to-b">Top to Bottom (Vertical)</option>
                        <option value="to-tr">Bottom-Left to Top-Right</option>
                      </select>
                    </div>
                  </div>
                  {/* Preset Swatches */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-[11px]">
                    <span className="font-semibold text-slate-500">Curated Presets:</span>
                    {[
                      { label: 'Deep Blue Night', start: '#0f172a', end: '#1e3a8a' },
                      { label: 'Kota Plant Emerald', start: '#022c22', end: '#064e3b' },
                      { label: 'Dark Carbon', start: '#090d16', end: '#1e293b' },
                      { label: 'High Power Violet', start: '#0f172a', end: '#3b0764' },
                    ].map((sw) => (
                      <button
                        key={sw.label}
                        type="button"
                        onClick={() => {
                          const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                          setContent({
                            ...content,
                            batteryBanner: {
                              ...cur,
                              bgGradientStart: sw.start,
                              bgGradientEnd: sw.end,
                            },
                          });
                        }}
                        className="px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-md font-medium text-slate-700"
                      >
                        {sw.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-panel: Solid Color */}
              {(content.batteryBanner?.bgType === 'solid' || (content.batteryBanner?.bgType as any) === 'color') && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">Solid Background Color</label>
                    <div className="flex items-center gap-2">
                      {[
                        { label: 'Dark Slate', color: '#0f172a' },
                        { label: 'Kota Emerald', color: '#064e3b' },
                        { label: 'Deep Charcoal', color: '#1e293b' },
                        { label: 'Pitch Black', color: '#020617' },
                      ].map((sw) => (
                        <button
                          key={sw.color}
                          type="button"
                          onClick={() => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, bgSolidColor: sw.color },
                            });
                          }}
                          className="px-2 py-1 bg-slate-50 border border-slate-300 rounded text-[10px] font-mono hover:border-teal-400"
                        >
                          {sw.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={content.batteryBanner?.bgSolidColor || '#0f172a'}
                      onChange={(e) => {
                        const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                        setContent({
                          ...content,
                          batteryBanner: { ...cur, bgSolidColor: e.target.value },
                        });
                      }}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                    />
                    <input
                      type="text"
                      value={content.batteryBanner?.bgSolidColor || '#0f172a'}
                      onChange={(e) => {
                        const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                        setContent({
                          ...content,
                          batteryBanner: { ...cur, bgSolidColor: e.target.value },
                        });
                      }}
                      placeholder="#0f172a"
                      className="w-40 bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              )}

              {/* Sub-panel: Background Image Suite */}
              {content.batteryBanner?.bgType === 'image' && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Image Source & Upload */}
                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-slate-800">Background Image Source</label>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-teal-50 border border-teal-200 hover:border-teal-400 rounded-xl text-xs font-bold text-teal-800 transition cursor-pointer shadow-xs">
                          <Upload size={14} className="text-teal-600" />
                          <span>Upload Local Image File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const dataUrl = await compressImageFile(file, 1920, 1080, 0.85);
                                const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                                setContent({
                                  ...content,
                                  batteryBanner: { ...cur, bgImage: dataUrl },
                                });
                              }
                            }}
                          />
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={content.batteryBanner?.bgImage || ''}
                            onChange={(e) => {
                              const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                              setContent({
                                ...content,
                                batteryBanner: { ...cur, bgImage: e.target.value },
                              });
                            }}
                            placeholder="https://... or paste image URL or data:image"
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono"
                          />
                          {content.batteryBanner?.bgImage && (
                            <button
                              type="button"
                              onClick={() => {
                                const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                                setContent({
                                  ...content,
                                  batteryBanner: { ...cur, bgImage: '' },
                                });
                              }}
                              className="px-2.5 py-2 text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded-lg border border-red-200 font-bold"
                              title="Clear image"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Image Preview Thumbnail */}
                      {content.batteryBanner?.bgImage && (
                        <div className="relative h-28 rounded-xl overflow-hidden border border-slate-300 bg-slate-900">
                          <img
                            src={resolveImageUrl(content.batteryBanner.bgImage)}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            style={{
                              filter: content.batteryBanner.bgBlur ? `blur(${content.batteryBanner.bgBlur}px)` : undefined,
                            }}
                          />
                          <div
                            className="absolute inset-0"
                            style={{
                              backgroundColor: content.batteryBanner.bgOverlayColor || '#090d16',
                              opacity: typeof content.batteryBanner.bgOverlayOpacity === 'number' ? content.batteryBanner.bgOverlayOpacity : 0.85,
                            }}
                          />
                          <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                            Active Preview with Tint & Blur
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Image Adjustments (Overlay Tint, Opacity, Blur, Position) */}
                    <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="font-semibold text-slate-700">Dark Overlay Tint Color</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={content.batteryBanner?.bgOverlayColor || '#090d16'}
                            onChange={(e) => {
                              const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                              setContent({
                                ...content,
                                batteryBanner: { ...cur, bgOverlayColor: e.target.value },
                              });
                            }}
                            className="w-8 h-8 rounded cursor-pointer border p-0.5"
                          />
                          <input
                            type="text"
                            value={content.batteryBanner?.bgOverlayColor || '#090d16'}
                            onChange={(e) => {
                              const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                              setContent({
                                ...content,
                                batteryBanner: { ...cur, bgOverlayColor: e.target.value },
                              });
                            }}
                            className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="font-semibold text-slate-700">Overlay Opacity</label>
                          <span className="font-mono text-teal-700 font-bold">
                            {Math.round(((content.batteryBanner?.bgOverlayOpacity ?? 0.85) * 100))}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={content.batteryBanner?.bgOverlayOpacity ?? 0.85}
                          onChange={(e) => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, bgOverlayOpacity: parseFloat(e.target.value) },
                            });
                          }}
                          className="w-full accent-teal-600 cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="font-semibold text-slate-700">Background Blur Filter</label>
                          <span className="font-mono text-teal-700 font-bold">
                            {content.batteryBanner?.bgBlur ?? 0}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          step="1"
                          value={content.batteryBanner?.bgBlur ?? 0}
                          onChange={(e) => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, bgBlur: parseInt(e.target.value, 10) },
                            });
                          }}
                          className="w-full accent-teal-600 cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Image Alignment</label>
                        <select
                          value={content.batteryBanner?.bgPosition || 'center'}
                          onChange={(e) => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, bgPosition: e.target.value },
                            });
                          }}
                          className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs"
                        >
                          <option value="center">Center</option>
                          <option value="top">Top</option>
                          <option value="bottom">Bottom</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 6 Curated Presets Gallery */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Or Choose a Curated Technical Banner Preset:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                      {[
                        {
                          name: 'Battery Lab',
                          url: 'https://images.unsplash.com/photo-1558441719-703350106297?auto=format&fit=crop&w=1920&q=80',
                        },
                        {
                          name: 'Smart Factory',
                          url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80',
                        },
                        {
                          name: 'Lithium Cell',
                          url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1920&q=80',
                        },
                        {
                          name: 'Clean Grid',
                          url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1920&q=80',
                        },
                        {
                          name: 'BMS Circuit',
                          url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80',
                        },
                        {
                          name: 'Kota Workshop',
                          url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=80',
                        },
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: {
                                ...cur,
                                bgType: 'image',
                                bgImage: preset.url,
                                bgOverlayOpacity: 0.85,
                                bgOverlayColor: '#090d16',
                              },
                            });
                          }}
                          className="group relative rounded-lg overflow-hidden border border-slate-300 hover:border-teal-500 h-16 transition text-left cursor-pointer"
                        >
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition flex items-end p-1.5">
                            <span className="text-[10px] font-bold text-white leading-tight">{preset.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Container Borders & Geometry */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Corner Radius</label>
                  <select
                    value={content.batteryBanner?.cardBorderRadius || 'rounded-3xl'}
                    onChange={(e) => {
                      const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                      setContent({
                        ...content,
                        batteryBanner: { ...cur, cardBorderRadius: e.target.value },
                      });
                    }}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                  >
                    <option value="rounded-2xl">Rounded Medium (rounded-2xl)</option>
                    <option value="rounded-3xl">Rounded Large (rounded-3xl - Default)</option>
                    <option value="rounded-xl">Rounded Small (rounded-xl)</option>
                    <option value="rounded-none">Square Corners (no radius)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Container Border Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={content.batteryBanner?.cardBorderColor?.startsWith('#') ? content.batteryBanner.cardBorderColor : '#1e3a8a'}
                      onChange={(e) => {
                        const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                        setContent({
                          ...content,
                          batteryBanner: { ...cur, cardBorderColor: e.target.value },
                        });
                      }}
                      className="w-8 h-8 rounded cursor-pointer border p-0.5"
                    />
                    <input
                      type="text"
                      value={content.batteryBanner?.cardBorderColor || 'rgba(59, 130, 246, 0.3)'}
                      onChange={(e) => {
                        const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                        setContent({
                          ...content,
                          batteryBanner: { ...cur, cardBorderColor: e.target.value },
                        });
                      }}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Box Shadow</label>
                  <select
                    value={content.batteryBanner?.cardShadow || 'shadow-xl'}
                    onChange={(e) => {
                      const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                      setContent({
                        ...content,
                        batteryBanner: { ...cur, cardShadow: e.target.value },
                      });
                    }}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                  >
                    <option value="shadow-xl">Extra Large (shadow-xl)</option>
                    <option value="shadow-2xl">Super Deep (shadow-2xl)</option>
                    <option value="shadow-md">Medium (shadow-md)</option>
                    <option value="shadow-none">None (Flat)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 1.3 Badge Tagline & Typography Configuration */}
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Tag size={15} className="text-teal-600" />
                  <span>Badge Tagline & Section Typography</span>
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.batteryBanner?.showBadge ?? true}
                      onChange={(e) => {
                        const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                        setContent({
                          ...content,
                          batteryBanner: { ...cur, showBadge: e.target.checked },
                        });
                      }}
                      className="rounded text-teal-600 h-3.5 w-3.5"
                    />
                    <span>Show Tagline Badge</span>
                  </label>
                  <SectionSaveButton label="Save Typography" compact />
                </div>
              </div>

              {/* Badge controls */}
              {(content.batteryBanner?.showBadge ?? true) && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">Badge Tagline Text</label>
                      <input
                        type="text"
                        value={content.batteryBanner?.badgeText || ''}
                        onChange={(e) => {
                          const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                          setContent({
                            ...content,
                            batteryBanner: { ...cur, badgeText: e.target.value },
                          });
                        }}
                        placeholder="GET HIGH POWER OF LITHIUM"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Badge Icon</label>
                      <select
                        value={content.batteryBanner?.badgeIcon || 'Zap'}
                        onChange={(e) => {
                          const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                          setContent({
                            ...content,
                            batteryBanner: { ...cur, badgeIcon: e.target.value },
                          });
                        }}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                      >
                        <option value="Zap">Zap (Lightning)</option>
                        <option value="Sparkles">Sparkles</option>
                        <option value="ShieldCheck">Shield Check</option>
                        <option value="Award">Award Trophy</option>
                        <option value="Battery">Battery</option>
                        <option value="Activity">Activity Pulse</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Badge Background Color</label>
                      <input
                        type="text"
                        value={content.batteryBanner?.badgeBgColor || 'rgba(5, 150, 105, 0.2)'}
                        onChange={(e) => {
                          const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                          setContent({
                            ...content,
                            batteryBanner: { ...cur, badgeBgColor: e.target.value },
                          });
                        }}
                        placeholder="rgba(5, 150, 105, 0.2) or #059669"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Badge Text Color</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={content.batteryBanner?.badgeTextColor || '#34d399'}
                          onChange={(e) => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, badgeTextColor: e.target.value },
                            });
                          }}
                          className="w-7 h-7 rounded cursor-pointer border p-0 bg-white shrink-0"
                        />
                        <input
                          type="text"
                          value={content.batteryBanner?.badgeTextColor || '#34d399'}
                          onChange={(e) => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, badgeTextColor: e.target.value },
                            });
                          }}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Badge Border Color</label>
                      <input
                        type="text"
                        value={content.batteryBanner?.badgeBorderColor || 'rgba(52, 211, 153, 0.4)'}
                        onChange={(e) => {
                          const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                          setContent({
                            ...content,
                            batteryBanner: { ...cur, badgeBorderColor: e.target.value },
                          });
                        }}
                        placeholder="rgba(52, 211, 153, 0.4)"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Main Heading & Subheading */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-semibold text-slate-700">Banner Main Heading</label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-500 font-semibold">Heading Color:</span>
                      <input
                        type="color"
                        value={content.batteryBanner?.headingColor || '#ffffff'}
                        onChange={(e) => {
                          const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                          setContent({
                            ...content,
                            batteryBanner: { ...cur, headingColor: e.target.value },
                          });
                        }}
                        className="w-6 h-6 rounded cursor-pointer border p-0 bg-white shrink-0"
                      />
                      <input
                        type="text"
                        value={content.batteryBanner?.headingColor || '#ffffff'}
                        onChange={(e) => {
                          const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                          setContent({
                            ...content,
                            batteryBanner: { ...cur, headingColor: e.target.value },
                          });
                        }}
                        className="w-24 bg-slate-50 border border-slate-300 rounded p-1 text-[11px] font-mono"
                      />
                    </div>
                  </div>
                  <input
                    type="text"
                    value={content.batteryBanner?.heading || ''}
                    onChange={(e) => {
                      const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                      setContent({
                        ...content,
                        batteryBanner: { ...cur, heading: e.target.value },
                      });
                    }}
                    placeholder="Genuine Li-ion & LFP Batteries For E-Scooter & E-Rickshaw"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-xs"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-semibold text-slate-700">Subheading Description</label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-500 font-semibold">Text Color:</span>
                      <input
                        type="color"
                        value={content.batteryBanner?.subheadingColor || '#93c5fd'}
                        onChange={(e) => {
                          const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                          setContent({
                            ...content,
                            batteryBanner: { ...cur, subheadingColor: e.target.value },
                          });
                        }}
                        className="w-6 h-6 rounded cursor-pointer border p-0 bg-white shrink-0"
                      />
                      <input
                        type="text"
                        value={content.batteryBanner?.subheadingColor || '#93c5fd'}
                        onChange={(e) => {
                          const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                          setContent({
                            ...content,
                            batteryBanner: { ...cur, subheadingColor: e.target.value },
                          });
                        }}
                        className="w-24 bg-slate-50 border border-slate-300 rounded p-1 text-[11px] font-mono"
                      />
                    </div>
                  </div>
                  <textarea
                    rows={2}
                    value={content.batteryBanner?.subheading || ''}
                    onChange={(e) => {
                      const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                      setContent({
                        ...content,
                        batteryBanner: { ...cur, subheadingColor: cur.subheadingColor, subheading: e.target.value },
                      });
                    }}
                    placeholder="Engineered with advanced Smart BMS, thermal protection..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* 1.4 Technical Highlights Manager (Up to 4 Highlights) */}
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-teal-600" />
                  <span>Technical Highlights Suite (Up to 4 Bullet Points)</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">Leave text blank to hide a highlight</span>
                  <SectionSaveButton label="Save Highlights" compact />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Highlight 1 */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">Highlight 1</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Point 1</span>
                  </div>
                  <input
                    type="text"
                    value={content.batteryBanner?.highlight1 || ''}
                    onChange={(e) => {
                      const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                      setContent({
                        ...content,
                        batteryBanner: { ...cur, highlight1: e.target.value },
                      });
                    }}
                    placeholder="48V Series (3 Year Warranty)"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-xs font-semibold"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Icon</label>
                      <select
                        value={content.batteryBanner?.highlight1Icon || 'ShieldCheck'}
                        onChange={(e) => {
                          const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                          setContent({
                            ...content,
                            batteryBanner: { ...cur, highlight1Icon: e.target.value },
                          });
                        }}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-1 text-xs"
                      >
                        <option value="ShieldCheck">Shield Check</option>
                        <option value="CheckCircle2">Check Circle</option>
                        <option value="Award">Award Trophy</option>
                        <option value="Zap">Zap (Lightning)</option>
                        <option value="Battery">Battery</option>
                        <option value="Truck">Truck Delivery</option>
                        <option value="Wrench">Wrench Tool</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Color</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={content.batteryBanner?.highlight1Color || '#34d399'}
                          onChange={(e) => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, highlight1Color: e.target.value },
                            });
                          }}
                          className="w-6 h-6 rounded cursor-pointer border p-0 bg-white shrink-0"
                        />
                        <input
                          type="text"
                          value={content.batteryBanner?.highlight1Color || '#34d399'}
                          onChange={(e) => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, highlight1Color: e.target.value },
                            });
                          }}
                          className="w-full bg-slate-50 border border-slate-300 rounded p-1 text-[11px] font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Highlight 2 */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">Highlight 2</span>
                    <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.5 rounded">Point 2</span>
                  </div>
                  <input
                    type="text"
                    value={content.batteryBanner?.highlight2 || ''}
                    onChange={(e) => {
                      const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                      setContent({
                        ...content,
                        batteryBanner: { ...cur, highlight2: e.target.value },
                      });
                    }}
                    placeholder="60V / 72V Series (1.5 Year Warranty)"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-xs font-semibold"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Icon</label>
                      <select
                        value={content.batteryBanner?.highlight2Icon || 'CheckCircle2'}
                        onChange={(e) => {
                          const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                          setContent({
                            ...content,
                            batteryBanner: { ...cur, highlight2Icon: e.target.value },
                          });
                        }}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-1 text-xs"
                      >
                        <option value="CheckCircle2">Check Circle</option>
                        <option value="ShieldCheck">Shield Check</option>
                        <option value="Award">Award Trophy</option>
                        <option value="Zap">Zap (Lightning)</option>
                        <option value="Battery">Battery</option>
                        <option value="Truck">Truck Delivery</option>
                        <option value="Wrench">Wrench Tool</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Color</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={content.batteryBanner?.highlight2Color || '#38bdf8'}
                          onChange={(e) => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, highlight2Color: e.target.value },
                            });
                          }}
                          className="w-6 h-6 rounded cursor-pointer border p-0 bg-white shrink-0"
                        />
                        <input
                          type="text"
                          value={content.batteryBanner?.highlight2Color || '#38bdf8'}
                          onChange={(e) => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, highlight2Color: e.target.value },
                            });
                          }}
                          className="w-full bg-slate-50 border border-slate-300 rounded p-1 text-[11px] font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Highlight 3 */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">Highlight 3</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">Point 3</span>
                  </div>
                  <input
                    type="text"
                    value={content.batteryBanner?.highlight3 || ''}
                    onChange={(e) => {
                      const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                      setContent({
                        ...content,
                        batteryBanner: { ...cur, highlight3: e.target.value },
                      });
                    }}
                    placeholder="100% Genuine Cells & Kota Plant Support"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-xs font-semibold"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Icon</label>
                      <select
                        value={content.batteryBanner?.highlight3Icon || 'Award'}
                        onChange={(e) => {
                          const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                          setContent({
                            ...content,
                            batteryBanner: { ...cur, highlight3Icon: e.target.value },
                          });
                        }}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-1 text-xs"
                      >
                        <option value="Award">Award Trophy</option>
                        <option value="ShieldCheck">Shield Check</option>
                        <option value="CheckCircle2">Check Circle</option>
                        <option value="Zap">Zap (Lightning)</option>
                        <option value="Battery">Battery</option>
                        <option value="Truck">Truck Delivery</option>
                        <option value="Wrench">Wrench Tool</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Color</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={content.batteryBanner?.highlight3Color || '#fbbf24'}
                          onChange={(e) => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, highlight3Color: e.target.value },
                            });
                          }}
                          className="w-6 h-6 rounded cursor-pointer border p-0 bg-white shrink-0"
                        />
                        <input
                          type="text"
                          value={content.batteryBanner?.highlight3Color || '#fbbf24'}
                          onChange={(e) => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, highlight3Color: e.target.value },
                            });
                          }}
                          className="w-full bg-slate-50 border border-slate-300 rounded p-1 text-[11px] font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Highlight 4 */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">Highlight 4</span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded">Point 4</span>
                  </div>
                  <input
                    type="text"
                    value={content.batteryBanner?.highlight4 || ''}
                    onChange={(e) => {
                      const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                      setContent({
                        ...content,
                        batteryBanner: { ...cur, highlight4: e.target.value },
                      });
                    }}
                    placeholder="Pan-India Replacement & Express Dispatch"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-xs font-semibold"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Icon</label>
                      <select
                        value={content.batteryBanner?.highlight4Icon || 'Truck'}
                        onChange={(e) => {
                          const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                          setContent({
                            ...content,
                            batteryBanner: { ...cur, highlight4Icon: e.target.value },
                          });
                        }}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-1 text-xs"
                      >
                        <option value="Truck">Truck Delivery</option>
                        <option value="Award">Award Trophy</option>
                        <option value="ShieldCheck">Shield Check</option>
                        <option value="CheckCircle2">Check Circle</option>
                        <option value="Zap">Zap (Lightning)</option>
                        <option value="Battery">Battery</option>
                        <option value="Wrench">Wrench Tool</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Color</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={content.batteryBanner?.highlight4Color || '#a78bfa'}
                          onChange={(e) => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, highlight4Color: e.target.value },
                            });
                          }}
                          className="w-6 h-6 rounded cursor-pointer border p-0 bg-white shrink-0"
                        />
                        <input
                          type="text"
                          value={content.batteryBanner?.highlight4Color || '#a78bfa'}
                          onChange={(e) => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, highlight4Color: e.target.value },
                            });
                          }}
                          className="w-full bg-slate-50 border border-slate-300 rounded p-1 text-[11px] font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 1.5 Contacts & Assistance Card Suite ("and contacts") */}
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Phone size={15} className="text-teal-600" />
                    <span>Right-Side Contacts Card Suite (Helpline, WhatsApp, Plant)</span>
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Soft-code the direct technical assistance card displayed on the right side of the battery banner.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.batteryBanner?.showContactCard ?? true}
                      onChange={(e) => {
                        const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                        setContent({
                          ...content,
                          batteryBanner: { ...cur, showContactCard: e.target.checked },
                        });
                      }}
                      className="rounded text-teal-600 h-3.5 w-3.5"
                    />
                    <span>Show Contact Card</span>
                  </label>
                  <SectionSaveButton label="Save Contact Card" compact />
                </div>
              </div>

              {(content.batteryBanner?.showContactCard ?? true) && (
                <div className="space-y-4">
                  {/* Card Colors, Logo Style, Titles */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Card Background Color</label>
                        <input
                          type="text"
                          value={content.batteryBanner?.contactCardBgColor || 'rgba(255, 255, 255, 0.08)'}
                          onChange={(e) => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, contactCardBgColor: e.target.value },
                            });
                          }}
                          placeholder="rgba(255, 255, 255, 0.08) or #1e293b"
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Card Border Color</label>
                        <input
                          type="text"
                          value={content.batteryBanner?.contactCardBorderColor || 'rgba(255, 255, 255, 0.15)'}
                          onChange={(e) => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, contactCardBorderColor: e.target.value },
                            });
                          }}
                          placeholder="rgba(255, 255, 255, 0.15)"
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-xs"
                        />
                      </div>
                    </div>

                    {/* Logo Type Selector */}
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">Card Logo Representation</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'preset', label: 'Preset EBS Logo' },
                          { id: 'text', label: 'Custom Text Badge' },
                          { id: 'image', label: 'Uploaded Logo Image' },
                        ].map((lt) => {
                          const isSelected = (content.batteryBanner?.contactLogoType || 'preset') === lt.id;
                          return (
                            <button
                              key={lt.id}
                              type="button"
                              onClick={() => {
                                const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                                setContent({
                                  ...content,
                                  batteryBanner: { ...cur, contactLogoType: lt.id as any },
                                });
                              }}
                              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition border cursor-pointer ${
                                isSelected
                                  ? 'bg-teal-600 text-white border-teal-600'
                                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              {lt.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Text Badge settings */}
                      {content.batteryBanner?.contactLogoType === 'text' && (
                        <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Badge Text</label>
                            <input
                              type="text"
                              value={content.batteryBanner?.contactLogoText || 'EBS KOTA PLANT'}
                              onChange={(e) => {
                                const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                                setContent({
                                  ...content,
                                  batteryBanner: { ...cur, contactLogoText: e.target.value },
                                });
                              }}
                              className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs font-bold uppercase"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Badge Bg Color</label>
                            <input
                              type="color"
                              value={content.batteryBanner?.contactLogoBgColor || '#059669'}
                              onChange={(e) => {
                                const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                                setContent({
                                  ...content,
                                  batteryBanner: { ...cur, contactLogoBgColor: e.target.value },
                                });
                              }}
                              className="w-full h-8 rounded border p-0.5"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Badge Text Color</label>
                            <input
                              type="color"
                              value={content.batteryBanner?.contactLogoTextColor || '#ffffff'}
                              onChange={(e) => {
                                const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                                setContent({
                                  ...content,
                                  batteryBanner: { ...cur, contactLogoTextColor: e.target.value },
                                });
                              }}
                              className="w-full h-8 rounded border p-0.5"
                            />
                          </div>
                        </div>
                      )}

                      {/* Custom Image Logo Upload */}
                      {content.batteryBanner?.contactLogoType === 'image' && (
                        <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                          <label className="block text-[10px] font-semibold text-slate-600">Logo Image File or URL</label>
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-100">
                              <Upload size={13} className="text-teal-600" />
                              <span>Upload</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const dataUrl = await compressImageFile(file, 400, 200, 0.9);
                                    const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                                    setContent({
                                      ...content,
                                      batteryBanner: { ...cur, contactLogoImage: dataUrl },
                                    });
                                  }
                                }}
                              />
                            </label>
                            <input
                              type="text"
                              value={content.batteryBanner?.contactLogoImage || ''}
                              onChange={(e) => {
                                const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                                setContent({
                                  ...content,
                                  batteryBanner: { ...cur, contactLogoImage: e.target.value },
                                });
                              }}
                              placeholder="Image URL or Base64"
                              className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs font-mono"
                            />
                            {content.batteryBanner?.contactLogoImage && (
                              <button
                                type="button"
                                onClick={() => {
                                  const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                                  setContent({
                                    ...content,
                                    batteryBanner: { ...cur, contactLogoImage: '' },
                                  });
                                }}
                                className="p-1.5 bg-red-50 text-red-600 rounded border border-red-200"
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Title & Subtitle */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Contact Box Title</label>
                        <input
                          type="text"
                          value={content.batteryBanner?.contactCardTitle || 'Need Battery Assistance?'}
                          onChange={(e) => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, contactCardTitle: e.target.value },
                            });
                          }}
                          placeholder="Need Battery Assistance?"
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Contact Box Subtitle</label>
                        <input
                          type="text"
                          value={content.batteryBanner?.contactCardSubtitle || 'Contact our factory technical engineers in Kota, Rajasthan'}
                          onChange={(e) => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, contactCardSubtitle: e.target.value },
                            });
                          }}
                          placeholder="Contact our factory technical engineers in Kota, Rajasthan"
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Helpline Phone Button */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                      <Phone size={14} className="text-blue-600" />
                      <span>1. Primary Helpline Call Button</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">Phone Number (Dial)</label>
                        <input
                          type="text"
                          value={content.batteryBanner?.helplinePhone || ''}
                          onChange={(e) => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, helplinePhone: e.target.value },
                            });
                          }}
                          placeholder="8949049003"
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">Button Label</label>
                        <input
                          type="text"
                          value={content.batteryBanner?.helplineBtnText || ''}
                          onChange={(e) => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, helplineBtnText: e.target.value },
                            });
                          }}
                          placeholder="Call +91 8949049003"
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">Button Background</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={content.batteryBanner?.helplineBtnBg || '#2563eb'}
                            onChange={(e) => {
                              const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                              setContent({
                                ...content,
                                batteryBanner: { ...cur, helplineBtnBg: e.target.value },
                              });
                            }}
                            className="w-7 h-7 rounded cursor-pointer border p-0 bg-white shrink-0"
                          />
                          <input
                            type="text"
                            value={content.batteryBanner?.helplineBtnBg || '#2563eb'}
                            onChange={(e) => {
                              const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                              setContent({
                                ...content,
                                batteryBanner: { ...cur, helplineBtnBg: e.target.value },
                              });
                            }}
                            className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 text-[11px] font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">Button Text Color</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={content.batteryBanner?.helplineBtnTextColor || '#ffffff'}
                            onChange={(e) => {
                              const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                              setContent({
                                ...content,
                                batteryBanner: { ...cur, helplineBtnTextColor: e.target.value },
                              });
                            }}
                            className="w-7 h-7 rounded cursor-pointer border p-0 bg-white shrink-0"
                          />
                          <input
                            type="text"
                            value={content.batteryBanner?.helplineBtnTextColor || '#ffffff'}
                            onChange={(e) => {
                              const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                              setContent({
                                ...content,
                                batteryBanner: { ...cur, helplineBtnTextColor: e.target.value },
                              });
                            }}
                            className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 text-[11px] font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Direct Assistance Button */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                        <MessageSquare size={14} className="text-emerald-600" />
                        <span>2. WhatsApp Direct Technical Chat Button</span>
                      </span>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={content.batteryBanner?.showWhatsappBtn ?? true}
                          onChange={(e) => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, showWhatsappBtn: e.target.checked },
                            });
                          }}
                          className="rounded text-emerald-600 h-3.5 w-3.5"
                        />
                        <span>Enable WhatsApp Button</span>
                      </label>
                    </div>

                    {(content.batteryBanner?.showWhatsappBtn ?? true) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">WhatsApp Mobile</label>
                          <input
                            type="text"
                            value={content.batteryBanner?.whatsappNumber || '8949049003'}
                            onChange={(e) => {
                              const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                              setContent({
                                ...content,
                                batteryBanner: { ...cur, whatsappNumber: e.target.value },
                              });
                            }}
                            placeholder="8949049003"
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">Button Label</label>
                          <input
                            type="text"
                            value={content.batteryBanner?.whatsappBtnText || 'Chat on WhatsApp'}
                            onChange={(e) => {
                              const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                              setContent({
                                ...content,
                                batteryBanner: { ...cur, whatsappBtnText: e.target.value },
                              });
                            }}
                            placeholder="Chat on WhatsApp"
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">Button Background</label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="color"
                              value={content.batteryBanner?.whatsappBtnBg || '#25D366'}
                              onChange={(e) => {
                                const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                                setContent({
                                  ...content,
                                  batteryBanner: { ...cur, whatsappBtnBg: e.target.value },
                                });
                              }}
                              className="w-7 h-7 rounded cursor-pointer border p-0 bg-white shrink-0"
                            />
                            <input
                              type="text"
                              value={content.batteryBanner?.whatsappBtnBg || '#25D366'}
                              onChange={(e) => {
                                const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                                setContent({
                                  ...content,
                                  batteryBanner: { ...cur, whatsappBtnBg: e.target.value },
                                });
                              }}
                              className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 text-[11px] font-mono"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">Button Text Color</label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="color"
                              value={content.batteryBanner?.whatsappBtnTextColor || '#ffffff'}
                              onChange={(e) => {
                                const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                                setContent({
                                  ...content,
                                  batteryBanner: { ...cur, whatsappBtnTextColor: e.target.value },
                                });
                              }}
                              className="w-7 h-7 rounded cursor-pointer border p-0 bg-white shrink-0"
                            />
                            <input
                              type="text"
                              value={content.batteryBanner?.whatsappBtnTextColor || '#ffffff'}
                              onChange={(e) => {
                                const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                                setContent({
                                  ...content,
                                  batteryBanner: { ...cur, whatsappBtnTextColor: e.target.value },
                                });
                              }}
                              className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 text-[11px] font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Secondary Plant Details Button */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                      <ExternalLink size={14} className="text-slate-600" />
                      <span>3. Secondary Plant Contact Details Button</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">Button Label</label>
                        <input
                          type="text"
                          value={content.batteryBanner?.plantBtnText || ''}
                          onChange={(e) => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, plantBtnText: e.target.value },
                            });
                          }}
                          placeholder="View Plant Contact Details"
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">Route / Link Target</label>
                        <input
                          type="text"
                          value={content.batteryBanner?.plantBtnLink || ''}
                          onChange={(e) => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, plantBtnLink: e.target.value },
                            });
                          }}
                          placeholder="/contact"
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">Button Background</label>
                        <input
                          type="text"
                          value={content.batteryBanner?.plantBtnBg || 'rgba(255, 255, 255, 0.12)'}
                          onChange={(e) => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, plantBtnBg: e.target.value },
                            });
                          }}
                          placeholder="rgba(255, 255, 255, 0.12)"
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">Link Target</label>
                        <select
                          value={content.batteryBanner?.plantBtnTarget || '_self'}
                          onChange={(e) => {
                            const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                            setContent({
                              ...content,
                              batteryBanner: { ...cur, plantBtnTarget: e.target.value as any },
                            });
                          }}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                        >
                          <option value="_self">Same Tab (_self)</option>
                          <option value="_blank">New Tab (_blank)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Alternate Phone & Email */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Alternate Phone (Footer Note)</label>
                      <input
                        type="text"
                        value={content.batteryBanner?.alternatePhone || ''}
                        onChange={(e) => {
                          const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                          setContent({
                            ...content,
                            batteryBanner: { ...cur, alternatePhone: e.target.value },
                          });
                        }}
                        placeholder="+91 8949049003"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Technical Support Email</label>
                      <input
                        type="email"
                        value={content.batteryBanner?.supportEmail || ''}
                        onChange={(e) => {
                          const cur = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                          setContent({
                            ...content,
                            batteryBanner: { ...cur, supportEmail: e.target.value },
                          });
                        }}
                        placeholder="Smartdrive5640@gmail.com"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 1.6 Real-Time Live Visual Preview with Device Switcher */}
            <div className="pt-2">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye size={15} className="text-teal-600" />
                  <span>Real-Time Battery Banner Live Preview</span>
                </span>
                {/* Device Switcher */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setBatteryPreviewDevice('desktop')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      batteryPreviewDevice === 'desktop'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Monitor size={13} />
                    <span>Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBatteryPreviewDevice('mobile')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      batteryPreviewDevice === 'mobile'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Smartphone size={13} />
                    <span>Mobile Stack</span>
                  </button>
                </div>
              </div>

              {/* Preview Container Container Frame */}
              <div className="p-4 bg-slate-900/5 rounded-2xl border border-slate-200 overflow-x-auto flex justify-center">
                <div
                  className={`w-full transition-all duration-300 ${
                    batteryPreviewDevice === 'mobile' ? 'max-w-sm' : 'max-w-5xl'
                  }`}
                >
                  {(() => {
                    const bb = content.batteryBanner || defaultFallbackContent.batteryBanner!;
                    const hasBgImage = bb.bgType === 'image' && !!bb.bgImage;
                    const containerStyle: React.CSSProperties = {
                      borderColor: bb.cardBorderColor || 'rgba(59, 130, 246, 0.3)',
                    };
                    if (bb.bgType === 'solid') {
                      containerStyle.backgroundColor = bb.bgSolidColor || '#0f172a';
                    } else if (bb.bgType === 'transparent') {
                      containerStyle.backgroundColor = 'transparent';
                    } else if (!hasBgImage) {
                      const dirMap: Record<string, string> = {
                        'to-r': 'to right',
                        'to-br': 'to bottom right',
                        'to-b': 'to bottom',
                        'to-tr': 'to top right',
                      };
                      const dir = dirMap[bb.bgGradientDirection || 'to-br'] || 'to bottom right';
                      containerStyle.backgroundImage = `linear-gradient(${dir}, ${bb.bgGradientStart || '#0f172a'}, ${bb.bgGradientEnd || '#1e3a8a'})`;
                    }

                    const highlights = [
                      { text: bb.highlight1, icon: bb.highlight1Icon, color: bb.highlight1Color || '#34d399' },
                      { text: bb.highlight2, icon: bb.highlight2Icon, color: bb.highlight2Color || '#38bdf8' },
                      { text: bb.highlight3, icon: bb.highlight3Icon, color: bb.highlight3Color || '#fbbf24' },
                      { text: bb.highlight4, icon: bb.highlight4Icon, color: bb.highlight4Color || '#a78bfa' },
                    ].filter((h) => !!h.text);

                    return (
                      <div
                        className={`relative overflow-hidden ${bb.cardBorderRadius || 'rounded-3xl'} p-6 md:p-10 border ${bb.cardShadow || 'shadow-xl'} text-white`}
                        style={containerStyle}
                      >
                        {/* Background Image Layer */}
                        {hasBgImage && (
                          <>
                            <div
                              className="absolute inset-0 bg-cover bg-no-repeat z-0 pointer-events-none"
                              style={{
                                backgroundImage: `url(${resolveImageUrl(bb.bgImage || '')})`,
                                backgroundPosition: bb.bgPosition || 'center',
                                filter: bb.bgBlur ? `blur(${bb.bgBlur}px)` : undefined,
                                transform: bb.bgBlur ? 'scale(1.06)' : undefined,
                              }}
                            />
                            <div
                              className="absolute inset-0 z-0 pointer-events-none"
                              style={{
                                backgroundColor: bb.bgOverlayColor || '#090d16',
                                opacity: typeof bb.bgOverlayOpacity === 'number' ? bb.bgOverlayOpacity : 0.85,
                              }}
                            />
                          </>
                        )}

                        <div
                          className={`relative z-10 flex ${
                            batteryPreviewDevice === 'mobile' ? 'flex-col' : 'flex-col md:flex-row'
                          } items-center justify-between gap-6`}
                        >
                          {/* Left Column: Technical Information */}
                          <div className="space-y-3.5 max-w-lg">
                            {bb.showBadge !== false && bb.badgeText && (
                              <div
                                className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold px-3 py-1 rounded-full border shadow-xs"
                                style={{
                                  backgroundColor: bb.badgeBgColor || 'rgba(5, 150, 105, 0.2)',
                                  color: bb.badgeTextColor || '#34d399',
                                  borderColor: bb.badgeBorderColor || 'rgba(52, 211, 153, 0.4)',
                                }}
                              >
                                <Zap size={12} />
                                <span>{bb.badgeText}</span>
                              </div>
                            )}

                            <h3
                              className="text-xl md:text-2xl font-extrabold leading-tight"
                              style={{ color: bb.headingColor || '#ffffff' }}
                            >
                              {bb.heading || 'Genuine Li-ion & LFP Batteries For E-Scooter & E-Rickshaw'}
                            </h3>

                            <p
                              className="text-xs leading-relaxed"
                              style={{ color: bb.subheadingColor || '#93c5fd' }}
                            >
                              {bb.subheading ||
                                'Engineered with advanced Smart BMS, thermal protection, and high energy density cells. Tested at our Kota plant with Pan-India dispatch & replacement support.'}
                            </p>

                            {highlights.length > 0 && (
                              <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold pt-1">
                                {highlights.map((h, i) => (
                                  <span key={i} className="flex items-center gap-1.5" style={{ color: h.color }}>
                                    <CheckCircle2 size={15} />
                                    <span>{h.text}</span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Right Column: Assistance Contacts Card */}
                          {bb.showContactCard !== false && (
                            <div
                              className="p-5 rounded-2xl border text-center space-y-2.5 flex-shrink-0 w-full md:w-72 backdrop-blur-xs shadow-lg"
                              style={{
                                backgroundColor: bb.contactCardBgColor || 'rgba(255, 255, 255, 0.08)',
                                borderColor: bb.contactCardBorderColor || 'rgba(255, 255, 255, 0.15)',
                              }}
                            >
                              {/* Logo */}
                              {bb.contactLogoType === 'image' && bb.contactLogoImage ? (
                                <img
                                  src={resolveImageUrl(bb.contactLogoImage)}
                                  alt="Logo"
                                  className="h-8 mx-auto object-contain"
                                />
                              ) : bb.contactLogoType === 'text' ? (
                                <div
                                  className="px-2.5 py-0.5 font-bold text-[10px] rounded inline-block uppercase tracking-wider mx-auto"
                                  style={{
                                    backgroundColor: bb.contactLogoBgColor || '#059669',
                                    color: bb.contactLogoTextColor || '#ffffff',
                                  }}
                                >
                                  {bb.contactLogoText || 'EBS KOTA PLANT'}
                                </div>
                              ) : (
                                <div className="w-10 h-10 bg-emerald-900 rounded-xl flex items-center justify-center text-white font-bold text-xs mx-auto shadow">
                                  EBS
                                </div>
                              )}

                              <h4 className="font-bold text-xs text-white">
                                {bb.contactCardTitle || 'Need Battery Assistance?'}
                              </h4>
                              <p className="text-[10px] text-slate-300">
                                {bb.contactCardSubtitle || 'Contact our factory technical engineers in Kota, Rajasthan'}
                              </p>

                              <div className="space-y-1.5 pt-1">
                                <div
                                  className="w-full py-2 font-bold rounded-xl text-xs text-center shadow flex items-center justify-center gap-1.5"
                                  style={{
                                    backgroundColor: bb.helplineBtnBg || '#2563eb',
                                    color: bb.helplineBtnTextColor || '#ffffff',
                                  }}
                                >
                                  <Phone size={13} />
                                  <span>{bb.helplineBtnText || 'Call +91 8949049003'}</span>
                                </div>

                                {bb.showWhatsappBtn !== false && (
                                  <div
                                    className="w-full py-2 font-bold rounded-xl text-xs text-center shadow flex items-center justify-center gap-1.5"
                                    style={{
                                      backgroundColor: bb.whatsappBtnBg || '#25D366',
                                      color: bb.whatsappBtnTextColor || '#ffffff',
                                    }}
                                  >
                                    <MessageSquare size={13} />
                                    <span>{bb.whatsappBtnText || 'Chat on WhatsApp'}</span>
                                  </div>
                                )}

                                <div
                                  className="w-full py-1.5 font-semibold rounded-xl text-xs text-center border flex items-center justify-center gap-1.5"
                                  style={{
                                    backgroundColor: bb.plantBtnBg || 'rgba(255, 255, 255, 0.12)',
                                    color: bb.plantBtnTextColor || '#ffffff',
                                    borderColor: 'rgba(255, 255, 255, 0.2)',
                                  }}
                                >
                                  <span>{bb.plantBtnText || 'View Plant Contact Details'}</span>
                                  <ExternalLink size={11} />
                                </div>
                              </div>

                              {(bb.alternatePhone || bb.supportEmail) && (
                                <div className="pt-1 text-[9px] text-slate-300/80 space-y-0.5 border-t border-white/10">
                                  {bb.alternatePhone && <div>Alt: {bb.alternatePhone}</div>}
                                  {bb.supportEmail && <div>{bb.supportEmail}</div>}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Full Soft-Coded Quick Access Utility Actions Bar */}
          <div className="space-y-6">
            {/* 2.1 Section Styling, Header & Background Manager */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Search className="text-blue-600" size={20} />
                    <span>Quick Access Utility Actions Bar Configuration</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fully customize background image, solid/gradient styling, container borders, header text, and utility action items.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <SectionSaveButton label="Save Bar Style" compact />
                  <span className="text-xs font-semibold text-slate-600">Section Visibility:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                      setContent({
                        ...content,
                        quickActionsConfig: {
                          ...cfg,
                          isVisible: cfg.isVisible === false ? true : false,
                        },
                      });
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      (content.quickActionsConfig?.isVisible ?? true)
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {(content.quickActionsConfig?.isVisible ?? true) ? (
                      <>
                        <Eye size={14} />
                        <span>Enabled on Homepage</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={14} />
                        <span>Hidden on Homepage</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Background Mode Selector */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                    <Palette size={14} className="text-blue-600" />
                    <span>Container Background Mode</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'color', label: 'Solid Color' },
                      { id: 'gradient', label: 'Linear Gradient' },
                      { id: 'image', label: 'Background Image' },
                      { id: 'transparent', label: 'Transparent' },
                    ].map((mode) => {
                      const currentMode = content.quickActionsConfig?.bgType || 'color';
                      const isSelected = currentMode === mode.id;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => {
                            const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                            setContent({
                              ...content,
                              quickActionsConfig: { ...cfg, bgType: mode.id as any },
                            });
                          }}
                          className={`py-2 px-3 rounded-xl border text-xs font-semibold transition cursor-pointer text-center ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {mode.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sub-panel: Solid Color */}
                {(content.quickActionsConfig?.bgType || 'color') === 'color' && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="text-xs font-bold text-slate-700">Container Background Color</label>
                      <div className="flex items-center gap-2">
                        {[
                          { label: 'White', color: '#ffffff' },
                          { label: 'Clean Slate', color: '#f8fafc' },
                          { label: 'Dark Plant', color: '#0f172a' },
                          { label: 'Deep Emerald', color: '#022c22' },
                        ].map((swatch) => (
                          <button
                            key={swatch.color}
                            type="button"
                            onClick={() => {
                              const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                              setContent({
                                ...content,
                                quickActionsConfig: { ...cfg, bgColor: swatch.color, cardBgColor: swatch.color },
                              });
                            }}
                            className="px-2 py-1 bg-white border border-slate-300 rounded text-[10px] font-mono hover:border-blue-400"
                          >
                            {swatch.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={content.quickActionsConfig?.bgColor || '#ffffff'}
                        onChange={(e) => {
                          const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                          setContent({
                            ...content,
                            quickActionsConfig: { ...cfg, bgColor: e.target.value, cardBgColor: e.target.value },
                          });
                        }}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                      />
                      <input
                        type="text"
                        value={content.quickActionsConfig?.bgColor || '#ffffff'}
                        onChange={(e) => {
                          const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                          setContent({
                            ...content,
                            quickActionsConfig: { ...cfg, bgColor: e.target.value, cardBgColor: e.target.value },
                          });
                        }}
                        placeholder="#ffffff"
                        className="w-36 bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold"
                      />
                    </div>
                  </div>
                )}

                {/* Sub-panel: Linear Gradient */}
                {content.quickActionsConfig?.bgType === 'gradient' && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Start Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={content.quickActionsConfig?.bgGradientStart || '#0f172a'}
                            onChange={(e) => {
                              const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                              setContent({
                                ...content,
                                quickActionsConfig: { ...cfg, bgGradientStart: e.target.value },
                              });
                            }}
                            className="w-8 h-8 rounded cursor-pointer border p-0.5"
                          />
                          <input
                            type="text"
                            value={content.quickActionsConfig?.bgGradientStart || '#0f172a'}
                            onChange={(e) => {
                              const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                              setContent({
                                ...content,
                                quickActionsConfig: { ...cfg, bgGradientStart: e.target.value },
                              });
                            }}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">End Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={content.quickActionsConfig?.bgGradientEnd || '#1e293b'}
                            onChange={(e) => {
                              const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                              setContent({
                                ...content,
                                quickActionsConfig: { ...cfg, bgGradientEnd: e.target.value },
                              });
                            }}
                            className="w-8 h-8 rounded cursor-pointer border p-0.5"
                          />
                          <input
                            type="text"
                            value={content.quickActionsConfig?.bgGradientEnd || '#1e293b'}
                            onChange={(e) => {
                              const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                              setContent({
                                ...content,
                                quickActionsConfig: { ...cfg, bgGradientEnd: e.target.value },
                              });
                            }}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Direction</label>
                        <select
                          value={content.quickActionsConfig?.bgGradientDirection || 'to-r'}
                          onChange={(e) => {
                            const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                            setContent({
                              ...content,
                              quickActionsConfig: { ...cfg, bgGradientDirection: e.target.value },
                            });
                          }}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                        >
                          <option value="to-r">Left to Right (Horizontal)</option>
                          <option value="to-br">Top-Left to Bottom-Right (Diagonal)</option>
                          <option value="to-b">Top to Bottom (Vertical)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-panel: Background Image Suite */}
                {content.quickActionsConfig?.bgType === 'image' && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Image Source */}
                      <div className="space-y-3">
                        <label className="block text-xs font-bold text-slate-800">Background Image Source</label>
                        <div className="flex flex-col gap-2">
                          <label className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white border border-slate-300 hover:border-blue-500 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer shadow-xs">
                            <Upload size={14} className="text-blue-600" />
                            <span>Upload Local Image File</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const dataUrl = await compressImageFile(file, 1920, 1080, 0.85);
                                  const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                                  setContent({
                                    ...content,
                                    quickActionsConfig: { ...cfg, bgImage: dataUrl },
                                  });
                                }
                              }}
                            />
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={content.quickActionsConfig?.bgImage || ''}
                              onChange={(e) => {
                                const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                                setContent({
                                  ...content,
                                  quickActionsConfig: { ...cfg, bgImage: e.target.value },
                                });
                              }}
                              placeholder="Or paste image URL (https://...)"
                              className="flex-1 bg-white border border-slate-300 rounded-xl p-2 text-xs font-mono"
                            />
                            {content.quickActionsConfig?.bgImage && (
                              <button
                                type="button"
                                onClick={() => {
                                  const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                                  setContent({
                                    ...content,
                                    quickActionsConfig: { ...cfg, bgImage: '' },
                                  });
                                }}
                                className="px-3 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-semibold hover:bg-rose-100"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Image Controls: Opacity, Blur, Overlay */}
                        <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-slate-700">Dark Overlay</span>
                              <span className="font-mono text-[10px] text-slate-500">
                                {Math.round((content.quickActionsConfig?.bgOverlayOpacity ?? 0.8) * 100)}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.05"
                              value={content.quickActionsConfig?.bgOverlayOpacity ?? 0.8}
                              onChange={(e) => {
                                const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                                setContent({
                                  ...content,
                                  quickActionsConfig: { ...cfg, bgOverlayOpacity: parseFloat(e.target.value) },
                                });
                              }}
                              className="w-full accent-blue-600"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-slate-700">Blur Filter</span>
                              <span className="font-mono text-[10px] text-slate-500">
                                {content.quickActionsConfig?.bgBlur ?? 0}px
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="20"
                              step="1"
                              value={content.quickActionsConfig?.bgBlur ?? 0}
                              onChange={(e) => {
                                const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                                setContent({
                                  ...content,
                                  quickActionsConfig: { ...cfg, bgBlur: parseInt(e.target.value, 10) },
                                });
                              }}
                              className="w-full accent-blue-600"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">Overlay Tint Color</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={content.quickActionsConfig?.bgOverlayColor || '#000000'}
                                onChange={(e) => {
                                  const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                                  setContent({
                                    ...content,
                                    quickActionsConfig: { ...cfg, bgOverlayColor: e.target.value },
                                  });
                                }}
                                className="w-7 h-7 rounded cursor-pointer border p-0.5"
                              />
                              <input
                                type="text"
                                value={content.quickActionsConfig?.bgOverlayColor || '#000000'}
                                onChange={(e) => {
                                  const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                                  setContent({
                                    ...content,
                                    quickActionsConfig: { ...cfg, bgOverlayColor: e.target.value },
                                  });
                                }}
                                className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">Image Position</label>
                            <select
                              value={content.quickActionsConfig?.bgPosition || 'center'}
                              onChange={(e) => {
                                const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                                setContent({
                                  ...content,
                                  quickActionsConfig: { ...cfg, bgPosition: e.target.value },
                                });
                              }}
                              className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs"
                            >
                              <option value="center">Center</option>
                              <option value="top">Top</option>
                              <option value="bottom">Bottom</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Curated Presets */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-800">
                          One-Click Curated EV & Battery Presets
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            {
                              title: 'Lithium Cells',
                              url: 'https://images.unsplash.com/photo-1558441719-8b449c6ff673?auto=format&fit=crop&w=1920&q=80',
                            },
                            {
                              title: 'EV Mobility',
                              url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1920&q=80',
                            },
                            {
                              title: 'High-Tech Circuit',
                              url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80',
                            },
                            {
                              title: 'EV Factory Plant',
                              url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80',
                            },
                            {
                              title: 'Emerald Wave',
                              url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80',
                            },
                            {
                              title: 'EV Charging Grid',
                              url: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1920&q=80',
                            },
                          ].map((preset) => (
                            <button
                              key={preset.title}
                              type="button"
                              onClick={() => {
                                const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                                setContent({
                                  ...content,
                                  quickActionsConfig: { ...cfg, bgImage: preset.url },
                                });
                              }}
                              className={`group relative rounded-xl overflow-hidden border p-1 text-left transition hover:scale-[1.02] cursor-pointer ${
                                content.quickActionsConfig?.bgImage === preset.url
                                  ? 'border-blue-600 ring-2 ring-blue-500/20'
                                  : 'border-slate-200 bg-white hover:border-slate-300'
                              }`}
                            >
                              <div
                                className="h-12 w-full rounded-lg bg-cover bg-center mb-1"
                                style={{ backgroundImage: `url(${preset.url})` }}
                              />
                              <div className="text-[10px] font-semibold text-slate-700 truncate">{preset.title}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Container Card Styling & Header Controls */}
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Settings size={14} className="text-slate-500" />
                  <span>Card Borders, Dividers & Typography</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Border Corner Radius</label>
                    <select
                      value={content.quickActionsConfig?.cardBorderRadius || 'rounded-3xl'}
                      onChange={(e) => {
                        const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                        setContent({
                          ...content,
                          quickActionsConfig: { ...cfg, cardBorderRadius: e.target.value },
                        });
                      }}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                    >
                      <option value="rounded-none">Square (None)</option>
                      <option value="rounded-xl">Subtle (rounded-xl)</option>
                      <option value="rounded-2xl">Medium (rounded-2xl)</option>
                      <option value="rounded-3xl">Pill Curve (rounded-3xl - Default)</option>
                      <option value="rounded-full">Fully Rounded (rounded-full)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Card Border Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={content.quickActionsConfig?.cardBorderColor || '#e2e8f0'}
                        onChange={(e) => {
                          const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                          setContent({
                            ...content,
                            quickActionsConfig: { ...cfg, cardBorderColor: e.target.value },
                          });
                        }}
                        className="w-8 h-8 rounded cursor-pointer border p-0.5"
                      />
                      <input
                        type="text"
                        value={content.quickActionsConfig?.cardBorderColor || '#e2e8f0'}
                        onChange={(e) => {
                          const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                          setContent({
                            ...content,
                            quickActionsConfig: { ...cfg, cardBorderColor: e.target.value },
                          });
                        }}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Vertical Dividers</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                          setContent({
                            ...content,
                            quickActionsConfig: { ...cfg, showDividers: cfg.showDividers === false ? true : false },
                          });
                        }}
                        className={`flex-1 py-2 px-2.5 rounded-lg border text-xs font-semibold ${
                          (content.quickActionsConfig?.showDividers ?? true)
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {(content.quickActionsConfig?.showDividers ?? true) ? 'Visible' : 'Hidden'}
                      </button>
                      <input
                        type="color"
                        value={content.quickActionsConfig?.dividerColor || '#e2e8f0'}
                        onChange={(e) => {
                          const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                          setContent({
                            ...content,
                            quickActionsConfig: { ...cfg, dividerColor: e.target.value },
                          });
                        }}
                        className="w-8 h-8 rounded cursor-pointer border p-0.5"
                        title="Divider Color"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Title Text Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={content.quickActionsConfig?.textColor || '#1e293b'}
                        onChange={(e) => {
                          const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                          setContent({
                            ...content,
                            quickActionsConfig: { ...cfg, textColor: e.target.value },
                          });
                        }}
                        className="w-8 h-8 rounded cursor-pointer border p-0.5"
                      />
                      <input
                        type="text"
                        value={content.quickActionsConfig?.textColor || '#1e293b'}
                        onChange={(e) => {
                          const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                          setContent({
                            ...content,
                            quickActionsConfig: { ...cfg, textColor: e.target.value },
                          });
                        }}
                        placeholder="#1e293b"
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Optional Section Header Fields */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                      <Tag size={14} className="text-blue-600" />
                      <span>Optional Header (Title, Subtitle & Badge Tagline)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                        setContent({
                          ...content,
                          quickActionsConfig: {
                            ...cfg,
                            showSectionHeader: !cfg.showSectionHeader,
                          },
                        });
                      }}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition ${
                        content.quickActionsConfig?.showSectionHeader
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-600 border-slate-300'
                      }`}
                    >
                      {content.quickActionsConfig?.showSectionHeader ? 'Header Shown' : 'Header Hidden (Clean Bar)'}
                    </button>
                  </div>

                  {content.quickActionsConfig?.showSectionHeader && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Badge Tagline</label>
                        <input
                          type="text"
                          value={content.quickActionsConfig?.sectionBadge || ''}
                          onChange={(e) => {
                            const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                            setContent({
                              ...content,
                              quickActionsConfig: { ...cfg, sectionBadge: e.target.value, showSectionBadge: true },
                            });
                          }}
                          placeholder="QUICK UTILITIES"
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Section Title</label>
                        <input
                          type="text"
                          value={content.quickActionsConfig?.sectionTitle || ''}
                          onChange={(e) => {
                            const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                            setContent({
                              ...content,
                              quickActionsConfig: { ...cfg, sectionTitle: e.target.value },
                            });
                          }}
                          placeholder="Quick Access Directory"
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Section Subtitle</label>
                        <input
                          type="text"
                          value={content.quickActionsConfig?.sectionSubtitle || ''}
                          onChange={(e) => {
                            const cfg = content.quickActionsConfig || defaultFallbackContent.quickActionsConfig!;
                            setContent({
                              ...content,
                              quickActionsConfig: { ...cfg, sectionSubtitle: e.target.value },
                            });
                          }}
                          placeholder="Essential customer services and warranty utilities"
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2.2 Action Items Manager */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <List className="text-blue-600" size={20} />
                    <span>Quick Action Items ({(content.quickActions || []).length})</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Add, edit, duplicate, reorder, or toggle individual utility cards.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetQuickActions}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    <RotateCcw size={14} />
                    <span>Factory Reset</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenAddAction}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <Plus size={15} />
                    <span>Add New Action</span>
                  </button>
                  <SectionSaveButton label="Save Actions" />
                </div>
              </div>

              {/* Action Items List */}
              <div className="space-y-3">
                {(content.quickActions || defaultFallbackContent.quickActions || []).map((act, actIdx) => {
                  const colorStyles = getActionColorStylesAdmin(act.color, act.customBg, act.customColor);
                  return (
                    <div
                      key={act.id || actIdx}
                      className="bg-slate-50 hover:bg-slate-100/70 p-4 rounded-2xl border border-slate-200 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      {/* Left: Reorder & Info */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Reorder Buttons */}
                        <div className="flex flex-col items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveAction(actIdx, 'up')}
                            disabled={actIdx === 0}
                            className="p-1 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp size={13} />
                          </button>
                          <span className="text-[10px] font-bold text-slate-400">#{act.order || actIdx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleMoveAction(actIdx, 'down')}
                            disabled={actIdx === (content.quickActions || []).length - 1}
                            className="p-1 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown size={13} />
                          </button>
                        </div>

                        {/* Icon Box */}
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-slate-200 shadow-xs ${colorStyles.bg}`}
                          style={colorStyles.style}
                        >
                          {renderQuickActionIconPreview(act)}
                        </div>

                        {/* Title, Subtitle, Badges */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4
                              className="font-bold text-sm text-slate-800 truncate"
                              style={{ color: act.customTextColor || undefined }}
                            >
                              {act.title}
                            </h4>
                            {act.badge && (
                              <span
                                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: act.badgeColor || '#10b981',
                                  color: '#ffffff',
                                }}
                              >
                                {act.badge}
                              </span>
                            )}
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                              {act.url}
                            </span>
                            {act.target === '_blank' && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                                New Tab ↗
                              </span>
                            )}
                            {act.showExternalIcon && act.target !== '_blank' && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                ↗ icon
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 truncate mt-0.5">{act.subtitle}</p>
                        </div>
                      </div>

                      {/* Right: Controls */}
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        {/* Visibility Switch */}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(content.quickActions || defaultFallbackContent.quickActions!)];
                            updated[actIdx] = { ...updated[actIdx], isVisible: !updated[actIdx].isVisible };
                            setContent({ ...content, quickActions: updated });
                          }}
                          className={`p-2 rounded-xl border transition cursor-pointer ${
                            act.isVisible !== false
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : 'bg-slate-200 text-slate-400 border-slate-300'
                          }`}
                          title={act.isVisible !== false ? 'Card is visible' : 'Card is hidden'}
                        >
                          {act.isVisible !== false ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>

                        {/* Duplicate Button */}
                        <button
                          type="button"
                          onClick={() => handleDuplicateAction(actIdx)}
                          className="p-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                          title="Duplicate Card"
                        >
                          <Copy size={15} />
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditAction(actIdx)}
                          className="flex items-center gap-1 px-3 py-2 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition cursor-pointer"
                        >
                          <Edit3 size={14} />
                          <span>Edit</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteAction(actIdx)}
                          className="p-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                          title="Delete Card"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2.3 Interactive Real-Time Live Preview */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye size={16} className="text-blue-600" />
                  <span>Real-Time Quick Access Live Preview</span>
                </span>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setQuickActionPreviewDevice('desktop')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      quickActionPreviewDevice === 'desktop'
                        ? 'bg-white text-slate-800 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Monitor size={14} />
                    <span>Desktop Bar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickActionPreviewDevice('mobile')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      quickActionPreviewDevice === 'mobile'
                        ? 'bg-white text-slate-800 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Smartphone size={14} />
                    <span>Mobile Stack</span>
                  </button>
                </div>
              </div>

              {/* Live Preview Container Canvas */}
              <div className="bg-slate-100/80 p-4 sm:p-8 rounded-2xl border border-slate-200 flex justify-center overflow-x-auto">
                <div
                  className={`w-full transition-all duration-300 ${
                    quickActionPreviewDevice === 'mobile' ? 'max-w-sm' : 'max-w-5xl'
                  }`}
                >
                  <div
                    className={`relative overflow-hidden transition-all duration-300 ${
                      content.quickActionsConfig?.cardBorderRadius || 'rounded-3xl'
                    } ${content.quickActionsConfig?.cardShadow || 'shadow-sm'}`}
                    style={{
                      backgroundColor:
                        (content.quickActionsConfig?.bgType || 'color') === 'color'
                          ? content.quickActionsConfig?.bgColor || '#ffffff'
                          : undefined,
                      background:
                        content.quickActionsConfig?.bgType === 'gradient'
                          ? `linear-gradient(${
                              content.quickActionsConfig?.bgGradientDirection === 'to-b'
                                ? 'to bottom'
                                : content.quickActionsConfig?.bgGradientDirection === 'to-br'
                                ? 'to bottom right'
                                : 'to right'
                            }, ${content.quickActionsConfig?.bgGradientStart || '#0f172a'}, ${
                              content.quickActionsConfig?.bgGradientEnd || '#1e293b'
                            })`
                          : undefined,
                      borderColor: content.quickActionsConfig?.cardBorderColor || '#e2e8f0',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                    }}
                  >
                    {/* Background Image Layer */}
                    {content.quickActionsConfig?.bgType === 'image' && content.quickActionsConfig?.bgImage && (
                      <div
                        className="absolute inset-0 pointer-events-none transition-all duration-500"
                        style={{
                          backgroundImage: `url(${resolveImageUrl(content.quickActionsConfig.bgImage)})`,
                          backgroundPosition: content.quickActionsConfig.bgPosition || 'center',
                          backgroundSize: content.quickActionsConfig.bgSize || 'cover',
                          filter: content.quickActionsConfig.bgBlur
                            ? `blur(${content.quickActionsConfig.bgBlur}px)`
                            : undefined,
                        }}
                      />
                    )}
                    {/* Background Overlay */}
                    {content.quickActionsConfig?.bgType === 'image' && content.quickActionsConfig?.bgImage && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          backgroundColor: content.quickActionsConfig.bgOverlayColor || '#000000',
                          opacity: content.quickActionsConfig.bgOverlayOpacity ?? 0.8,
                        }}
                      />
                    )}

                    <div className="relative z-10 p-6 md:p-8">
                      {/* Optional Header in Preview */}
                      {content.quickActionsConfig?.showSectionHeader &&
                        (content.quickActionsConfig.sectionTitle || content.quickActionsConfig.sectionBadge) && (
                          <div className="text-center mb-6 space-y-1.5">
                            {content.quickActionsConfig.showSectionBadge && content.quickActionsConfig.sectionBadge && (
                              <span className="inline-block bg-blue-500/10 text-blue-600 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-blue-500/20">
                                {content.quickActionsConfig.sectionBadge}
                              </span>
                            )}
                            {content.quickActionsConfig.sectionTitle && (
                              <h3
                                className="text-lg md:text-xl font-bold tracking-tight"
                                style={{ color: content.quickActionsConfig.textColor || '#1e293b' }}
                              >
                                {content.quickActionsConfig.sectionTitle}
                              </h3>
                            )}
                            {content.quickActionsConfig.sectionSubtitle && (
                              <p
                                className="text-xs max-w-lg mx-auto"
                                style={{ color: content.quickActionsConfig.subtitleColor || '#64748b' }}
                              >
                                {content.quickActionsConfig.sectionSubtitle}
                              </p>
                            )}
                          </div>
                        )}

                      {/* Items Row / Grid */}
                      <div
                        className={
                          quickActionPreviewDevice === 'mobile'
                            ? 'flex flex-col gap-3 text-left'
                            : 'flex flex-wrap items-center justify-around gap-6 text-center'
                        }
                      >
                        {(content.quickActions || defaultFallbackContent.quickActions || [])
                          .filter((act) => act.isVisible !== false)
                          .map((act, idx, arr) => {
                            const styles = getActionColorStylesAdmin(act.color, act.customBg, act.customColor);
                            const target = act.target || '_self';
                            const showExt = typeof act.showExternalIcon === 'boolean' ? act.showExternalIcon : (target === '_blank');

                            return (
                              <div
                                key={act.id || idx}
                                className={`flex items-center gap-6 ${
                                  quickActionPreviewDevice === 'mobile' ? 'w-full' : ''
                                }`}
                              >
                                <div className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50/50 transition cursor-pointer w-full">
                                  <div
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${styles.bg}`}
                                    style={styles.style}
                                  >
                                    {renderQuickActionIconPreview(act)}
                                  </div>
                                  <div className="text-left min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <h4
                                        className="font-bold text-sm text-slate-800 truncate"
                                        style={{
                                          color:
                                            act.customTextColor ||
                                            content.quickActionsConfig?.textColor ||
                                            undefined,
                                        }}
                                      >
                                        {act.title}
                                      </h4>
                                      {act.badge && (
                                        <span
                                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                                          style={{
                                            backgroundColor: act.badgeColor || '#10b981',
                                            color: '#ffffff',
                                          }}
                                        >
                                          {act.badge}
                                        </span>
                                      )}
                                      {showExt && <ExternalLink size={12} className="opacity-60 text-slate-400" />}
                                    </div>
                                    <p
                                      className="text-[11px] truncate"
                                      style={{ color: content.quickActionsConfig?.subtitleColor || '#94a3b8' }}
                                    >
                                      {act.subtitle}
                                    </p>
                                  </div>
                                </div>

                                {content.quickActionsConfig?.showDividers !== false &&
                                  quickActionPreviewDevice !== 'mobile' &&
                                  idx < arr.length - 1 && (
                                    <div
                                      className="hidden md:block w-px h-10"
                                      style={{
                                        backgroundColor: content.quickActionsConfig?.dividerColor || '#e2e8f0',
                                      }}
                                    />
                                  )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal: Add / Edit Quick Action Item */}
            {actionModalOpen && actionDraft && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  {/* Modal Header */}
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        <Edit3 size={18} />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-slate-800">
                          {editingActionIndex !== null ? 'Edit Quick Action Card' : 'Add New Quick Action Card'}
                        </h3>
                        <p className="text-xs text-slate-500">Configure title, subtitle, target URL, icon & custom color palette</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActionModalOpen(false)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
                    {/* Title & Subtitle */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Action Title *</label>
                        <input
                          type="text"
                          value={actionDraft.title}
                          onChange={(e) => setActionDraft({ ...actionDraft, title: e.target.value })}
                          placeholder="e.g. Track Ticket"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Subtitle / Caption *</label>
                        <input
                          type="text"
                          value={actionDraft.subtitle}
                          onChange={(e) => setActionDraft({ ...actionDraft, subtitle: e.target.value })}
                          placeholder="e.g. Live complaint inspection status"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-700 focus:bg-white"
                        />
                      </div>
                    </div>

                    {/* Target URL with Quick Presets */}
                    <div className="space-y-2">
                      <label className="block font-semibold text-slate-700">Target URL / Route *</label>
                      <input
                        type="text"
                        value={actionDraft.url}
                        onChange={(e) => setActionDraft({ ...actionDraft, url: e.target.value })}
                        placeholder="e.g. /complaint/track or https://..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-medium focus:bg-white"
                      />
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-400 font-semibold mr-1">Quick Auto-Fill:</span>
                        {[
                          { label: 'Track Ticket', url: '/complaint/track' },
                          { label: 'Warranty Register', url: '/warranty/register' },
                          { label: 'Check Warranty', url: '/warranty/check' },
                          { label: 'Contact Directory', url: '/contact' },
                          { label: 'Register Complaint', url: '/complaint/register' },
                        ].map((preset) => (
                          <button
                            key={preset.url}
                            type="button"
                            onClick={() => setActionDraft({ ...actionDraft, url: preset.url })}
                            className="px-2 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 border border-slate-200 rounded-lg text-[10px] font-medium transition cursor-pointer"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Window Target, External Icon, Optional Badge */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Window Target</label>
                        <select
                          value={actionDraft.target || '_self'}
                          onChange={(e) =>
                            setActionDraft({
                              ...actionDraft,
                              target: e.target.value as any,
                              showExternalIcon: e.target.value === '_blank' ? true : actionDraft.showExternalIcon,
                            })
                          }
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold"
                        >
                          <option value="_self">Same Window (_self)</option>
                          <option value="_blank">New Tab (_blank)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">External Arrow Icon (↗)</label>
                        <button
                          type="button"
                          onClick={() =>
                            setActionDraft({
                              ...actionDraft,
                              showExternalIcon: !actionDraft.showExternalIcon,
                            })
                          }
                          className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                            actionDraft.showExternalIcon
                              ? 'bg-blue-50 text-blue-700 border-blue-300'
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                        >
                          <ExternalLink size={13} />
                          <span>{actionDraft.showExternalIcon ? 'Arrow Visible' : 'Arrow Hidden'}</span>
                        </button>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Optional Mini Badge</label>
                        <input
                          type="text"
                          value={actionDraft.badge || ''}
                          onChange={(e) => setActionDraft({ ...actionDraft, badge: e.target.value })}
                          placeholder="e.g. LIVE, 3-YR, 24/7"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold"
                        />
                      </div>
                    </div>

                    {/* Icon Selector */}
                    <div className="space-y-2 border-t border-slate-100 pt-3">
                      <div className="flex items-center justify-between">
                        <label className="block font-semibold text-slate-800">Select Icon</label>
                        <span className="text-[10px] text-slate-400">Current: {actionDraft.icon}</span>
                      </div>

                      {/* Icon Grid */}
                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 max-h-40 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                        {[
                          { name: 'Search', label: 'Search' },
                          { name: 'ShieldCheck', label: 'ShieldCheck' },
                          { name: 'ShieldAlert', label: 'ShieldAlert' },
                          { name: 'Phone', label: 'Phone' },
                          { name: 'Wrench', label: 'Wrench' },
                          { name: 'Battery', label: 'Battery' },
                          { name: 'Zap', label: 'Zap' },
                          { name: 'Clock', label: 'Clock' },
                          { name: 'MapPin', label: 'MapPin' },
                          { name: 'Mail', label: 'Mail' },
                          { name: 'CheckCircle2', label: 'Check' },
                          { name: 'Sparkles', label: 'Sparkles' },
                          { name: 'Coins', label: 'Coins' },
                          { name: 'Gift', label: 'Gift' },
                          { name: 'Package', label: 'Package' },
                          { name: 'Settings', label: 'Settings' },
                          { name: 'Activity', label: 'Activity' },
                          { name: 'HelpCircle', label: 'Help' },
                          { name: 'FileText', label: 'FileText' },
                          { name: 'Store', label: 'Store' },
                          { name: 'Bike', label: 'Bike' },
                        ].map((iconItem) => {
                          const isSelected = (actionDraft.icon || '').toLowerCase() === iconItem.name.toLowerCase();
                          return (
                            <button
                              key={iconItem.name}
                              type="button"
                              onClick={() =>
                                setActionDraft({
                                  ...actionDraft,
                                  icon: iconItem.name,
                                  iconType: 'icon',
                                })
                              }
                              className={`flex flex-col items-center justify-center p-2 rounded-xl border text-[10px] font-semibold transition cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <div className="mb-1">
                                {renderQuickActionIconPreview({ ...actionDraft, icon: iconItem.name, iconType: 'icon' })}
                              </div>
                              <span className="truncate max-w-full text-[9px]">{iconItem.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom Icon Image Upload */}
                      <div className="flex items-center gap-2 pt-1">
                        <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-blue-400 rounded-lg text-slate-700 font-semibold cursor-pointer">
                          <Upload size={12} className="text-blue-600" />
                          <span>Upload Custom Icon PNG/SVG</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const dataUrl = await compressImageFile(file, 128, 128, 0.9);
                                setActionDraft({
                                  ...actionDraft,
                                  iconType: 'image',
                                  iconImage: dataUrl,
                                });
                              }
                            }}
                          />
                        </label>
                        {actionDraft.iconType === 'image' && actionDraft.iconImage && (
                          <div className="flex items-center gap-2">
                            <img
                              src={resolveImageUrl(actionDraft.iconImage)}
                              alt="Custom Icon"
                              className="w-6 h-6 object-contain border rounded"
                            />
                            <button
                              type="button"
                              onClick={() => setActionDraft({ ...actionDraft, iconType: 'icon', iconImage: '' })}
                              className="text-rose-600 hover:underline text-[11px]"
                            >
                              Reset to standard icon
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Color Theme & Custom Palette */}
                    <div className="space-y-3 border-t border-slate-100 pt-3">
                      <label className="block font-semibold text-slate-800">Card Color Theme</label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {[
                          { id: 'blue', label: 'Blue Theme', bg: '#eff6ff', border: '#bfdbfe' },
                          { id: 'amber', label: 'Amber / Gold', bg: '#fffbeb', border: '#fde68a' },
                          { id: 'emerald', label: 'Green / Emerald', bg: '#ecfdf5', border: '#a7f3d0' },
                          { id: 'purple', label: 'Purple / Violet', bg: '#faf5ff', border: '#e9d5ff' },
                          { id: 'indigo', label: 'Indigo Theme', bg: '#eef2ff', border: '#c7d2fe' },
                          { id: 'rose', label: 'Rose / Red', bg: '#fff1f2', border: '#fecdd3' },
                          { id: 'cyan', label: 'Cyan / Teal', bg: '#ecfeff', border: '#a5f3fc' },
                          { id: 'teal', label: 'Teal Theme', bg: '#f0fdfa', border: '#99f6e4' },
                          { id: 'slate', label: 'Dark / Slate', bg: '#f1f5f9', border: '#cbd5e1' },
                          { id: 'custom', label: 'Custom Hex', bg: '#ffffff', border: '#3b82f6' },
                        ].map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setActionDraft({ ...actionDraft, color: c.id })}
                            className={`p-2 rounded-xl border text-center font-bold transition cursor-pointer text-[11px] ${
                              actionDraft.color === c.id
                                ? 'ring-2 ring-blue-500 border-blue-500 font-extrabold shadow-xs'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                            style={{ backgroundColor: c.bg }}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>

                      {/* Custom Hex Inputs if color === 'custom' */}
                      {actionDraft.color === 'custom' && (
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Icon Box Background
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={actionDraft.customBg || '#eff6ff'}
                                onChange={(e) => setActionDraft({ ...actionDraft, customBg: e.target.value })}
                                className="w-7 h-7 rounded cursor-pointer border p-0.5"
                              />
                              <input
                                type="text"
                                value={actionDraft.customBg || '#eff6ff'}
                                onChange={(e) => setActionDraft({ ...actionDraft, customBg: e.target.value })}
                                className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-mono"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Icon / Accent Color
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={actionDraft.customColor || '#2563eb'}
                                onChange={(e) => setActionDraft({ ...actionDraft, customColor: e.target.value })}
                                className="w-7 h-7 rounded cursor-pointer border p-0.5"
                              />
                              <input
                                type="text"
                                value={actionDraft.customColor || '#2563eb'}
                                onChange={(e) => setActionDraft({ ...actionDraft, customColor: e.target.value })}
                                className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-mono"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Title Text Color
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={actionDraft.customTextColor || '#1e293b'}
                                onChange={(e) => setActionDraft({ ...actionDraft, customTextColor: e.target.value })}
                                className="w-7 h-7 rounded cursor-pointer border p-0.5"
                              />
                              <input
                                type="text"
                                value={actionDraft.customTextColor || '#1e293b'}
                                onChange={(e) => setActionDraft({ ...actionDraft, customTextColor: e.target.value })}
                                className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
                    <button
                      type="button"
                      onClick={() => setActionModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveActionDraft}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={16} />
                      <span>{editingActionIndex !== null ? 'Save Changes' : 'Add Action Card'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Save Bar */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-lg">
            <div>
              <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                <span>Save Battery Assistance & Quick Actions</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Saving will update the plant assistance banner and quick action utility links on {FRONTEND_URL}.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition shadow-md disabled:opacity-50 cursor-pointer"
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Banner & Quick Actions'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: POLICIES & COMPLIANCE */}
      {activeTab === 'policies' && (
        <div className="space-y-6">
          {/* Privacy Policy */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800">Privacy Policy</h3>
                <p className="text-xs text-slate-500">Rendered at /privacy-policy on the public portal.</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={content.privacyPolicy.isPublished}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        privacyPolicy: { ...content.privacyPolicy, isPublished: e.target.checked },
                      })
                    }
                    className="rounded text-green-600 focus:ring-green-500 h-4 w-4"
                  />
                  <span>Published</span>
                </label>
                <SectionSaveButton label="Save Policy" compact />
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Page Title</label>
                <input
                  type="text"
                  value={content.privacyPolicy.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      privacyPolicy: { ...content.privacyPolicy, title: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Policy Content</label>
                <textarea
                  rows={6}
                  value={content.privacyPolicy.content}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      privacyPolicy: { ...content.privacyPolicy, content: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800">Terms & Conditions</h3>
                <p className="text-xs text-slate-500">Rendered at /terms-conditions on the public portal.</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={content.termsConditions.isPublished}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        termsConditions: { ...content.termsConditions, isPublished: e.target.checked },
                      })
                    }
                    className="rounded text-green-600 focus:ring-green-500 h-4 w-4"
                  />
                  <span>Published</span>
                </label>
                <SectionSaveButton label="Save Terms" compact />
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Page Title</label>
                <input
                  type="text"
                  value={content.termsConditions.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      termsConditions: { ...content.termsConditions, title: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Terms Content</label>
                <textarea
                  rows={6}
                  value={content.termsConditions.content}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      termsConditions: { ...content.termsConditions, content: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Refund Policy */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800">Refund & Replacement Policy</h3>
                <p className="text-xs text-slate-500">Rendered at /refund-policy on the public portal.</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={content.refundPolicy.isPublished}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        refundPolicy: { ...content.refundPolicy, isPublished: e.target.checked },
                      })
                    }
                    className="rounded text-green-600 focus:ring-green-500 h-4 w-4"
                  />
                  <span>Published</span>
                </label>
                <SectionSaveButton label="Save Refund Policy" compact />
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Page Title</label>
                <input
                  type="text"
                  value={content.refundPolicy.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      refundPolicy: { ...content.refundPolicy, title: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Policy Content</label>
                <textarea
                  rows={6}
                  value={content.refundPolicy.content}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      refundPolicy: { ...content.refundPolicy, content: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Bottom Save Bar for Policies */}
          <div className="flex justify-end pt-2">
            <SectionSaveButton label="Save All Legal Policies" />
          </div>
        </div>
      )}

      {/* TAB 4: FOOTER & BRANDING */}
      {activeTab === 'footer' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-800">Global Footer & Branding</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Control the company logo branding, name, copyright line, disclaimer, and policy link visibility in the public footer.
              </p>
            </div>
            <SectionSaveButton label="Save Footer" />
          </div>

          {/* Footer Brand Logo Configuration */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <ImageIcon size={16} className="text-green-600" />
                  <span>Footer Brand Logo / Graphic</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Select whether to display the official preset SVG emblem or upload a custom footer branding logo.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Mode Toggle Button Group */}
                <div className="flex bg-slate-200 p-0.5 rounded-lg text-xs self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() =>
                      setContent({
                        ...content,
                        footer: { ...content.footer, logoType: 'preset' },
                      })
                    }
                    className={`px-3 py-1 rounded-md font-bold text-[11px] transition cursor-pointer ${
                      (content.footer.logoType || 'preset') === 'preset'
                        ? 'bg-white text-green-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Preset SVG Emblem
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setContent({
                        ...content,
                        footer: { ...content.footer, logoType: 'image' },
                      })
                    }
                    className={`px-3 py-1 rounded-md font-bold text-[11px] transition cursor-pointer ${
                      content.footer.logoType === 'image'
                        ? 'bg-white text-green-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Custom Image Logo
                  </button>
                </div>
                <SectionSaveButton label="Save Logo" compact />
              </div>
            </div>

            {(content.footer.logoType || 'preset') === 'preset' ? (
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 text-xs">
                <div className="w-10 h-10 bg-emerald-900 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-xs">
                  EBS
                </div>
                <div>
                  <span className="font-bold text-slate-800">Using Official Ekosmart Battery Solution (EBS) Emblem</span>
                  <p className="text-[11px] text-slate-500">
                    Default SVG branding with Battery & Lightning symbol is active in footer column 1.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* Image Preview Thumbnail */}
                  <div className="sm:col-span-3 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 text-center">
                    <div className="w-24 h-16 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-300 overflow-hidden shadow-xs">
                      {content.footer.logoImage ? (
                        <img
                          src={resolveImageUrl(content.footer.logoImage)}
                          alt="Footer Logo Preview"
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (

                        <ImageIcon size={28} className="text-slate-400" />
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 mt-1">Footer Logo Preview</span>
                  </div>

                  {/* Upload from Computer & URL Input */}
                  <div className="sm:col-span-9 space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Upload Footer Logo Image from Computer
                      </label>
                      <div className="flex items-center gap-2">
                        <label className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs">
                          <Upload size={14} />
                          <span>Choose Image File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const res = await compressImageFile(file, 800, 400, 0.9);
                                  if (res) {
                                    setContent({
                                      ...content,
                                      footer: { ...content.footer, logoImage: res },
                                    });
                                  }
                                } catch (err) {
                                  console.error('Failed to compress footer logo:', err);
                                }
                              }
                            }}
                          />
                        </label>
                        {content.footer.logoImage && (
                          <button
                            type="button"
                            onClick={() =>
                              setContent({
                                ...content,
                                footer: { ...content.footer, logoImage: '' },
                              })
                            }
                            className="px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold border border-red-200 transition cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Or Enter Footer Logo Image URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://example.com/footer-logo.png or /assets/brand-logo.png"
                        value={content.footer.logoImage || ''}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            footer: { ...content.footer, logoImage: e.target.value },
                          })
                        }
                        className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-green-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company / Entity Name</label>
              <input
                type="text"
                value={content.footer.companyName}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { ...content.footer, companyName: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">GSTIN Number</label>
              <input
                type="text"
                value={content.footer.gstin || '08DTUPM4205B1Z0'}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { ...content.footer, gstin: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Plant / Office Address</label>
              <input
                type="text"
                value={content.footer.address || 'Rang Talab, Near by Star Kids School, Kota, Rajasthan - 324002'}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { ...content.footer, address: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Helpline Phone Number</label>
              <input
                type="text"
                value={content.footer.phone || '+91 8949049003'}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { ...content.footer, phone: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Support Email</label>
              <input
                type="text"
                value={content.footer.email || 'Smartdrive5640@gmail.com'}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { ...content.footer, email: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Office Hours</label>
              <input
                type="text"
                value={content.footer.officeHours || '10:00 AM to 6:30 PM (Mon - Sat)'}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { ...content.footer, officeHours: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Copyright Notice</label>
              <input
                type="text"
                value={content.footer.copyrightText}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { ...content.footer, copyrightText: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Disclaimer / Support Note</label>
              <textarea
                rows={2}
                value={content.footer.disclaimer}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { ...content.footer, disclaimer: e.target.value },
                  })
                }
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div className="md:col-span-2 pt-2 border-t border-slate-100">
              <span className="block font-bold text-slate-800 mb-3">Footer Navigation Link Toggles</span>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={content.footer.showPrivacyPolicy}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        footer: { ...content.footer, showPrivacyPolicy: e.target.checked },
                      })
                    }
                    className="rounded text-green-600 focus:ring-green-500 h-4 w-4"
                  />
                  <span>Show Privacy Policy Link</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={content.footer.showTermsConditions}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        footer: { ...content.footer, showTermsConditions: e.target.checked },
                      })
                    }
                    className="rounded text-green-600 focus:ring-green-500 h-4 w-4"
                  />
                  <span>Show Terms & Conditions Link</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={content.footer.showRefundPolicy}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        footer: { ...content.footer, showRefundPolicy: e.target.checked },
                      })
                    }
                    className="rounded text-green-600 focus:ring-green-500 h-4 w-4"
                  />
                  <span>Show Refund Policy Link</span>
                </label>
              </div>
            </div>

            {/* Google Maps Plant Location Navigation */}
            <div className="md:col-span-2 pt-3 border-t border-slate-100">
              <label className="block font-semibold text-slate-700 mb-1">
                Google Maps Plant / Office Location URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://maps.google.com/?q=..."
                  value={content.footer.mapUrl || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footer: { ...content.footer, mapUrl: e.target.value },
                    })
                  }
                  className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
                {content.footer.mapUrl && (
                  <a
                    href={content.footer.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <ExternalLink size={13} />
                    <span>Test Map</span>
                  </a>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Makes the plant address in the footer and contact directory a clickable link that opens directly in Google Maps.
              </p>
            </div>

            {/* Social Media & WhatsApp Suite Section */}
            <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Social Media & WhatsApp Number Suite (100% Soft-Coded)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Manage Instagram, Facebook, and the official WhatsApp chat button with real phone dialing & messaging.
                  </p>
                </div>
                <SectionSaveButton label="Save Socials & WhatsApp" compact />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Instagram Settings */}
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5 text-pink-600">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                      <span>Instagram Link</span>
                    </span>
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={content.footer.showInstagram ?? true}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            footer: { ...content.footer, showInstagram: e.target.checked },
                          })
                        }
                        className="rounded text-pink-600 focus:ring-pink-500 h-3.5 w-3.5"
                      />
                      <span>Visible</span>
                    </label>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="https://www.instagram.com/yourhandle"
                      value={content.footer.instagramUrl || ''}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          footer: { ...content.footer, instagramUrl: e.target.value },
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Facebook Settings */}
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5 text-blue-600">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span>Facebook Link</span>
                    </span>
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={content.footer.showFacebook ?? true}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            footer: { ...content.footer, showFacebook: e.target.checked },
                          })
                        }
                        className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                      />
                      <span>Visible</span>
                    </label>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="https://www.facebook.com/yourpage"
                      value={content.footer.facebookUrl || ''}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          footer: { ...content.footer, facebookUrl: e.target.value },
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* WhatsApp Phone Number & Chat Suite */}
                <div className="md:col-span-2 bg-white p-3.5 rounded-lg border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5 text-emerald-600">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.301-.15-1.776-.876-2.051-.976-.275-.1-.476-.15-.676.15-.2.301-.776.976-.951 1.176-.176.2-.351.226-.652.076-.301-.15-1.272-.469-2.424-1.497-.896-.799-1.502-1.787-1.678-2.088-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.175.201-.301.302-.502.1-.2.05-.376-.025-.526-.075-.15-.677-1.632-.927-2.235-.243-.587-.49-.508-.676-.517-.175-.01-.376-.01-.577-.01-.2 0-.527.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.48 1.078 2.909 1.228 3.11.151.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.634.721.23 1.378.197 1.897.12.578-.087 1.776-.726 2.027-1.428.251-.702.251-1.303.176-1.428-.076-.125-.276-.2-.577-.35zM12.04 2C6.52 2 2.04 6.48 2.04 12c0 1.94.55 3.75 1.51 5.28L2 22l4.86-1.51C8.34 21.39 10.14 22 12.04 22c5.52 0 10-4.48 10-10S17.56 2 12.04 2zm0 18.17c-1.68 0-3.24-.51-4.55-1.39l-.33-.22-2.88.9.92-2.81-.24-.35A8.134 8.134 0 0 1 3.86 12c0-4.51 3.67-8.17 8.18-8.17 4.51 0 8.18 3.66 8.18 8.17 0 4.51-3.67 8.17-8.18 8.17z" />
                      </svg>
                      <span>WhatsApp Number with Official Logo</span>
                    </span>
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={content.footer.showWhatsapp ?? true}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            footer: { ...content.footer, showWhatsapp: e.target.checked },
                          })
                        }
                        className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                      />
                      <span>Show WhatsApp Button & Logo</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        WhatsApp Contact Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="+91 8949049003"
                        value={content.footer.whatsappNumber || ''}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            footer: { ...content.footer, whatsappNumber: e.target.value },
                          })
                        }
                        className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Pre-filled WhatsApp Greeting Message
                      </label>
                      <input
                        type="text"
                        placeholder="Hello Ekosmart, I would like to inquire..."
                        value={content.footer.whatsappText || ''}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            footer: { ...content.footer, whatsappText: e.target.value },
                          })
                        }
                        className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">
                      Renders with official green WhatsApp badge, direct wa.me deep link, and one-click chat.
                    </span>
                    <a
                      href={`https://wa.me/${(content.footer.whatsappNumber || content.footer.phone || '918949049003').replace(/\D/g, '')}?text=${encodeURIComponent(content.footer.whatsappText || 'Hello Ekosmart Support')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-xs"
                    >
                      <ExternalLink size={12} />
                      <span>Test Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Department Directory Dropdown Configuration */}
            <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                    <Phone size={14} className="text-emerald-600" />
                    <span>Contact & Helpline Department Dropdown</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Display an interactive dropdown menu in the footer and desktop navigation where all options are clickable direct links.
                  </p>
                </div>
                <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={content.footer.showContactDropdown ?? true}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        footer: { ...content.footer, showContactDropdown: e.target.checked },
                      })
                    }
                    className="rounded text-green-600 focus:ring-green-500 h-4 w-4"
                  />
                  <span>Enable Contact Dropdown</span>
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Dropdown Trigger Button Title
                </label>
                <input
                  type="text"
                  placeholder="Quick Department Directory"
                  value={content.footer.contactDropdownTitle || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      footer: { ...content.footer, contactDropdownTitle: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="bg-emerald-50/80 p-3 rounded-lg border border-emerald-200 text-[11px] text-emerald-800 space-y-1">
                <div className="font-bold">✓ All Dropdown Items are Clickable Links:</div>
                <ul className="list-disc list-inside space-y-0.5 text-emerald-700">
                  <li><strong>Helpline:</strong> Direct phone call link (<code className="bg-emerald-100 px-1 rounded">tel:{content.footer.phone || '+918949049003'}</code>)</li>
                  <li><strong>WhatsApp:</strong> Direct encrypted chat link (<code className="bg-emerald-100 px-1 rounded">wa.me</code>)</li>
                  <li><strong>Support Email:</strong> Mail client trigger (<code className="bg-emerald-100 px-1 rounded">mailto:{content.footer.email || 'Smartdrive5640@gmail.com'}</code>)</li>
                  <li><strong>Kota Plant Address:</strong> Google Maps navigation link</li>
                  <li><strong>Department Portals:</strong> One-click navigation to Warranty Check, Service Tickets, and Full Directory</li>
                </ul>
              </div>
            </div>

            {/* Softcoded Custom Footer Columns Manager */}
            <div className="md:col-span-2 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                    <List size={16} className="text-emerald-600" />
                    <span>Soft-Coded Footer Custom Columns & Links</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Create custom columns and navigation links to appear in the public website footer.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const currentCols = [...(content.footer.columns || defaultFallbackContent.footer.columns || [])];
                      const newCol: IFooterColumn = {
                        id: `col-${Date.now()}`,
                        title: `New Column ${currentCols.length + 1}`,
                        links: [
                          { label: 'Example Link', href: '/' }
                        ]
                      };
                      setContent({
                        ...content,
                        footer: { ...content.footer, columns: [...currentCols, newCol] }
                      });
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto shadow-xs"
                  >
                    <Plus size={14} />
                    <span>Add Column</span>
                  </button>
                  <SectionSaveButton label="Save Columns" compact />
                </div>
              </div>

              {/* Columns Editor List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(content.footer.columns || defaultFallbackContent.footer.columns || []).map((col, colIdx) => (
                  <div key={col.id || colIdx} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                        <span className="text-[11px] font-bold text-slate-400">Column #{colIdx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const currentCols = [...(content.footer.columns || defaultFallbackContent.footer.columns || [])];
                            currentCols.splice(colIdx, 1);
                            setContent({
                              ...content,
                              footer: { ...content.footer, columns: currentCols }
                            });
                          }}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition cursor-pointer"
                          title="Delete Column"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Column Title</label>
                        <input
                          type="text"
                          value={col.title}
                          onChange={(e) => {
                            const currentCols = [...(content.footer.columns || defaultFallbackContent.footer.columns || [])];
                            currentCols[colIdx] = { ...currentCols[colIdx], title: e.target.value };
                            setContent({
                              ...content,
                              footer: { ...content.footer, columns: currentCols }
                            });
                          }}
                          placeholder="e.g. Services / Quick Links"
                          className="w-full border border-slate-300 rounded-lg p-2 text-xs font-bold"
                        />
                      </div>

                      {/* Links list inside this column */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-600">Links ({col.links?.length || 0})</span>
                          <button
                            type="button"
                            onClick={() => {
                              const currentCols = [...(content.footer.columns || defaultFallbackContent.footer.columns || [])];
                              const links = [...(currentCols[colIdx].links || [])];
                              links.push({ label: 'New Link', href: '/' });
                              currentCols[colIdx] = { ...currentCols[colIdx], links };
                              setContent({
                                ...content,
                                footer: { ...content.footer, columns: currentCols }
                              });
                            }}
                            className="text-[10px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Plus size={11} />
                            <span>Add Link</span>
                          </button>
                        </div>

                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                          {(col.links || []).map((lnk, lnkIdx) => (
                            <div key={lnkIdx} className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs space-y-1.5">
                              <div className="flex items-center justify-between gap-1">
                                <input
                                  type="text"
                                  value={lnk.label}
                                  onChange={(e) => {
                                    const currentCols = [...(content.footer.columns || defaultFallbackContent.footer.columns || [])];
                                    const links = [...(currentCols[colIdx].links || [])];
                                    links[lnkIdx] = { ...links[lnkIdx], label: e.target.value };
                                    currentCols[colIdx] = { ...currentCols[colIdx], links };
                                    setContent({
                                      ...content,
                                      footer: { ...content.footer, columns: currentCols }
                                    });
                                  }}
                                  placeholder="Link Label"
                                  className="w-1/2 border border-slate-300 rounded px-1.5 py-1 text-[11px]"
                                />
                                <input
                                  type="text"
                                  value={lnk.href}
                                  onChange={(e) => {
                                    const currentCols = [...(content.footer.columns || defaultFallbackContent.footer.columns || [])];
                                    const links = [...(currentCols[colIdx].links || [])];
                                    links[lnkIdx] = { ...links[lnkIdx], href: e.target.value };
                                    currentCols[colIdx] = { ...currentCols[colIdx], links };
                                    setContent({
                                      ...content,
                                      footer: { ...content.footer, columns: currentCols }
                                    });
                                  }}
                                  placeholder="/path or url"
                                  className="w-1/2 border border-slate-300 rounded px-1.5 py-1 text-[11px] font-mono"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentCols = [...(content.footer.columns || defaultFallbackContent.footer.columns || [])];
                                    const links = [...(currentCols[colIdx].links || [])];
                                    links.splice(lnkIdx, 1);
                                    currentCols[colIdx] = { ...currentCols[colIdx], links };
                                    setContent({
                                      ...content,
                                      footer: { ...content.footer, columns: currentCols }
                                    });
                                  }}
                                  className="text-red-500 hover:text-red-700 p-0.5"
                                  title="Delete Link"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                              <label className="flex items-center gap-1.5 text-[10px] text-slate-500 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={lnk.isExternal || false}
                                  onChange={(e) => {
                                    const currentCols = [...(content.footer.columns || defaultFallbackContent.footer.columns || [])];
                                    const links = [...(currentCols[colIdx].links || [])];
                                    links[lnkIdx] = { ...links[lnkIdx], isExternal: e.target.checked };
                                    currentCols[colIdx] = { ...currentCols[colIdx], links };
                                    setContent({
                                      ...content,
                                      footer: { ...content.footer, columns: currentCols }
                                    });
                                  }}
                                  className="rounded text-emerald-600 h-3 w-3"
                                />
                                <span>Open in new tab (External)</span>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CONTACT US & DROPDOWN MENU */}
      {activeTab === 'contact' && (
        <div className="space-y-6">
          {/* Quick-Jump Module Navigator */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-2xl p-4 shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-16 z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
                <Phone size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-white tracking-wide">
                    Contact Us Page Management
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    Live Frontend Linked
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click a module below to jump directly to its editor or view all softcoded cards, dossier & inquiry form.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
              {[
                { id: 'all', label: 'All Modules' },
                { id: 'cards', label: 'Top 4 Contact Cards' },
                { id: 'dossier', label: 'Company Dossier' },
                { id: 'form', label: 'Inquiry Form' },
                { id: 'divisions', label: `Concern Divisions (${content.contactInfo?.dropdownOptions?.length || 0})` },
                { id: 'header', label: 'Header Banner' },
                { id: 'coordinates', label: 'Coordinates' },
              ].map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setContactSubTab(sub.id as any)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition cursor-pointer border ${
                    contactSubTab === sub.id
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 1: Dynamic Concern Division Dropdown Options */}
          {(contactSubTab === 'all' || contactSubTab === 'divisions') && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <List className="text-green-600" size={20} />
                  Concern Division / Department Dropdown Menu
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Soft-code the dropdown options displayed in the Contact Us page concern selector. Add, edit, reorder, or customize options.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
                  {content.contactInfo?.dropdownOptions?.length || 0} Active Options
                </span>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition shadow-xs disabled:opacity-50"
                >
                  <Save size={14} />
                  <span>{saving ? 'Saving...' : 'Save Dropdown'}</span>
                </button>
              </div>
            </div>

            {/* Quick Add Preset Options Pill Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-500" />
                  <span>Quick-Add Recommended Divisions</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const defaultOptions = [
                      'Lithium Battery Solution (EBS)',
                      'EV Spare Parts Wholesale/Retail',
                      'Drive Rental Assistance',
                      'Showroom & Dealership Inquiries',
                      'Plant Commercial Warranty Inspection',
                      'Accounts / Invoice Query',
                      'Other General Inquiry',
                    ];
                    setContent({
                      ...content,
                      contactInfo: {
                        ...content.contactInfo,
                        dropdownOptions: defaultOptions,
                      },
                    });
                  }}
                  className="text-[11px] font-semibold text-slate-500 hover:text-green-700 flex items-center gap-1 transition"
                >
                  <RotateCcw size={12} />
                  <span>Reset to Standard Set</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Lithium Battery Solution (EBS)',
                  'EV Spare Parts Wholesale/Retail',
                  'Drive Rental Assistance',
                  'Showroom & Dealership Inquiries',
                  'Plant Commercial Warranty Inspection',
                  'High Voltage BMS Technical Query',
                  'Charger & Power Electronics',
                  'Accounts & Billing Department',
                  'Other General Inquiry',
                ].map((preset) => {
                  const alreadyExists = (content.contactInfo?.dropdownOptions || []).includes(preset);
                  return (
                    <button
                      key={preset}
                      type="button"
                      disabled={alreadyExists}
                      onClick={() => {
                        if (!alreadyExists) {
                          setContent({
                            ...content,
                            contactInfo: {
                              ...content.contactInfo,
                              dropdownOptions: [...(content.contactInfo?.dropdownOptions || []), preset],
                            },
                          });
                        }
                      }}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition font-medium flex items-center gap-1 ${
                        alreadyExists
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-green-500 hover:text-green-700 hover:bg-green-50/50 cursor-pointer shadow-xs'
                      }`}
                    >
                      <span>{alreadyExists ? '✓' : '+'}</span>
                      <span>{preset}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add Custom Option Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type custom division name (e.g. Factory Inspection Department)..."
                value={newDropdownOption}
                onChange={(e) => setNewDropdownOption(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (newDropdownOption.trim()) {
                      setContent({
                        ...content,
                        contactInfo: {
                          ...content.contactInfo,
                          dropdownOptions: [...(content.contactInfo?.dropdownOptions || []), newDropdownOption.trim()],
                        },
                      });
                      setNewDropdownOption('');
                    }
                  }
                }}
                className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 bg-white"
              />
              <button
                type="button"
                onClick={() => {
                  if (newDropdownOption.trim()) {
                    setContent({
                      ...content,
                      contactInfo: {
                        ...content.contactInfo,
                        dropdownOptions: [...(content.contactInfo?.dropdownOptions || []), newDropdownOption.trim()],
                      },
                    });
                    setNewDropdownOption('');
                  }
                }}
                disabled={!newDropdownOption.trim()}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl transition shadow-sm disabled:opacity-40"
              >
                <Plus size={16} />
                <span>Add Custom Option</span>
              </button>
            </div>

            {/* List of Current Options with Dedicated Contact Details */}
            <div className="space-y-3 pt-1">
              {(content.contactInfo?.dropdownOptions || []).map((opt, idx) => {
                const divContact = getDivisionContact(opt);
                const isExpanded = expandedDivision === opt;
                return (
                  <div
                    key={idx}
                    className={`border rounded-2xl transition overflow-hidden ${
                      isExpanded ? 'border-green-400 bg-green-50/20 shadow-sm' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="w-6 h-6 bg-slate-200 text-slate-700 font-bold text-xs rounded-full flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newName = e.target.value;
                            const oldName = opt;
                            const updatedOptions = [...(content.contactInfo?.dropdownOptions || [])];
                            updatedOptions[idx] = newName;
                            
                            // Update divisionContacts if renamed
                            const currentDivList = [...(content.contactInfo?.divisionContacts || [])];
                            const cIdx = currentDivList.findIndex(c => c.name.trim().toLowerCase() === oldName.trim().toLowerCase());
                            if (cIdx >= 0) {
                              currentDivList[cIdx] = { ...currentDivList[cIdx], name: newName };
                            }

                            setContent({
                              ...content,
                              contactInfo: {
                                ...content.contactInfo,
                                dropdownOptions: updatedOptions,
                                divisionContacts: currentDivList,
                              },
                            });
                          }}
                          className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
                        />
                      </div>

                      {/* Summary & Controls */}
                      <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pl-8 sm:pl-0">
                        {/* Quick Contact Summary (Visible when collapsed) */}
                        {!isExpanded && (
                          <div className="hidden md:flex items-center gap-2 text-[11px] bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 shadow-2xs">
                            <span className="font-mono font-bold text-emerald-700">{divContact.phone || content.contactInfo?.helplinePhone}</span>
                            <span className="text-slate-300">|</span>
                            <span className="text-slate-700 font-medium truncate max-w-[130px]">{divContact.inCharge || 'Specialist'}</span>
                            {divContact.email && (
                              <>
                                <span className="text-slate-300">|</span>
                                <span className="text-blue-600 truncate max-w-[130px]">{divContact.email}</span>
                              </>
                            )}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => setExpandedDivision(isExpanded ? null : opt)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                            isExpanded
                              ? 'bg-green-600 text-white border-green-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:border-slate-400'
                          }`}
                        >
                          <Phone size={12} className={isExpanded ? 'text-white' : 'text-green-600'} />
                          <span>{isExpanded ? 'Hide Contact' : 'Edit Contact'}</span>
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>

                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            const updated = [...content.contactInfo.dropdownOptions];
                            const temp = updated[idx];
                            updated[idx] = updated[idx - 1];
                            updated[idx - 1] = temp;
                            setContent({
                              ...content,
                              contactInfo: {
                                ...content.contactInfo,
                                dropdownOptions: updated,
                              },
                            });
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200 transition"
                          title="Move Up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === (content.contactInfo?.dropdownOptions?.length || 0) - 1}
                          onClick={() => {
                            const updated = [...content.contactInfo.dropdownOptions];
                            const temp = updated[idx];
                            updated[idx] = updated[idx + 1];
                            updated[idx + 1] = temp;
                            setContent({
                              ...content,
                              contactInfo: {
                                ...content.contactInfo,
                                dropdownOptions: updated,
                              },
                            });
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200 transition"
                          title="Move Down"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={(content.contactInfo?.dropdownOptions?.length || 0) <= 1}
                          onClick={() => {
                            const updated = content.contactInfo.dropdownOptions.filter((_, i) => i !== idx);
                            const updatedContacts = (content.contactInfo?.divisionContacts || []).filter(
                              (c) => c.name.trim().toLowerCase() !== opt.trim().toLowerCase()
                            );
                            setContent({
                              ...content,
                              contactInfo: {
                                ...content.contactInfo,
                                dropdownOptions: updated,
                                divisionContacts: updatedContacts,
                              },
                            });
                          }}
                          className="p-1.5 text-red-400 hover:text-red-600 disabled:opacity-30 rounded hover:bg-red-50 transition"
                          title="Delete Option"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Expandable Division Contact Coordinates Form */}
                    {isExpanded && (
                      <div className="bg-white border-t border-green-200 p-4 space-y-3 text-xs animate-in fade-in duration-150">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                            <Building2 size={13} className="text-green-600" />
                            <span>Dedicated Coordinates for: <b className="text-green-800">{opt}</b></span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">Displayed dynamically in Contact Directory</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                              <Phone size={11} className="text-green-600" />
                              <span>Department Phone / Helpline</span>
                            </label>
                            <input
                              type="text"
                              placeholder="+91 8949049003"
                              value={divContact.phone || ''}
                              onChange={(e) => updateDivisionContact(opt, 'phone', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono bg-white focus:ring-1 focus:ring-green-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                              <Mail size={11} className="text-blue-600" />
                              <span>Department Support Email</span>
                            </label>
                            <input
                              type="email"
                              placeholder="battery@ekosmartdrive.in"
                              value={divContact.email || ''}
                              onChange={(e) => updateDivisionContact(opt, 'email', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono bg-white focus:ring-1 focus:ring-green-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                              <MessageSquare size={11} className="text-emerald-600" />
                              <span>WhatsApp Direct Contact</span>
                            </label>
                            <input
                              type="text"
                              placeholder="+91 8949049003"
                              value={divContact.whatsapp || ''}
                              onChange={(e) => updateDivisionContact(opt, 'whatsapp', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono bg-white focus:ring-1 focus:ring-green-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                              <UserCheck size={11} className="text-purple-600" />
                              <span>Department In-Charge / Lead</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Lead Battery Diagnostic Engineer"
                              value={divContact.inCharge || ''}
                              onChange={(e) => updateDivisionContact(opt, 'inCharge', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-green-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                              <Clock size={11} className="text-amber-600" />
                              <span>Department Office Hours</span>
                            </label>
                            <input
                              type="text"
                              placeholder="10:00 AM - 6:30 PM (Mon - Sat)"
                              value={divContact.officeHours || ''}
                              onChange={(e) => updateDivisionContact(opt, 'officeHours', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-green-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                              <MapPin size={11} className="text-red-500" />
                              <span>Specific Desk / Facility Area</span>
                            </label>
                            <input
                              type="text"
                              placeholder="Kota Central Plant - Bay 2"
                              value={divContact.address || ''}
                              onChange={(e) => updateDivisionContact(opt, 'address', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-green-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          )}

          {/* Section 2: Contact Page Content & Headings */}
          {(contactSubTab === 'all' || contactSubTab === 'header') && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="text-green-600" size={20} />
                Contact Us Header & Banner Content
              </h3>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={content.contactInfo?.isPublished ?? true}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contactInfo: { ...content.contactInfo, isPublished: e.target.checked },
                      })
                    }
                    className="rounded text-green-600 focus:ring-green-500 h-4 w-4"
                  />
                  <span>Published & Active</span>
                </label>
                <SectionSaveButton label="Save Header" compact />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Badge / Tagline Text</label>
                <input
                  type="text"
                  value={content.contactInfo?.badgeText || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, badgeText: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Main Heading</label>
                <input
                  type="text"
                  value={content.contactInfo?.heading || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, heading: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-medium"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Introductory Subheading</label>
                <textarea
                  rows={2}
                  value={content.contactInfo?.subheading || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, subheading: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-medium"
                />
              </div>
            </div>
          </div>
          )}

          {/* Section 2B: Top 4 Contact Cards Content */}
          {(contactSubTab === 'all' || contactSubTab === 'cards') && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Layers className="text-green-600" size={20} />
                Top 4 Contact Cards Labels & Action Buttons
              </h3>
              <SectionSaveButton label="Save Contact Cards" compact />
            </div>

            {/* Card 1: Direct Helpline Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
                <Phone size={14} className="text-emerald-600" />
                <span>Card 1: Direct Helpline Card</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Card Title</label>
                  <input
                    type="text"
                    value={content.contactInfo?.cardHelplineTitle || ''}
                    placeholder="Direct Helpline"
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contactInfo: { ...content.contactInfo, cardHelplineTitle: e.target.value },
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Card Subtitle / Description</label>
                  <input
                    type="text"
                    value={content.contactInfo?.cardHelplineSubtitle || ''}
                    placeholder="Customer support & battery technician hotline"
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contactInfo: { ...content.contactInfo, cardHelplineSubtitle: e.target.value },
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Call Button Label</label>
                  <input
                    type="text"
                    value={content.contactInfo?.cardHelplineCallBtnText || ''}
                    placeholder="Call Now"
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contactInfo: { ...content.contactInfo, cardHelplineCallBtnText: e.target.value },
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">WhatsApp Button Label</label>
                  <input
                    type="text"
                    value={content.contactInfo?.cardHelplineWhatsappBtnText || ''}
                    placeholder="WhatsApp Us"
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contactInfo: { ...content.contactInfo, cardHelplineWhatsappBtnText: e.target.value },
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Official Email Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
                <Mail size={14} className="text-blue-600" />
                <span>Card 2: Official Email Card</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Card Title</label>
                  <input
                    type="text"
                    value={content.contactInfo?.cardEmailTitle || ''}
                    placeholder="Official Email"
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contactInfo: { ...content.contactInfo, cardEmailTitle: e.target.value },
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Card Subtitle / Description</label>
                  <input
                    type="text"
                    value={content.contactInfo?.cardEmailSubtitle || ''}
                    placeholder="Direct technical query & corporate warranty inbox"
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contactInfo: { ...content.contactInfo, cardEmailSubtitle: e.target.value },
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Send Email Button Label</label>
                  <input
                    type="text"
                    value={content.contactInfo?.cardEmailBtnText || ''}
                    placeholder="Send Email"
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contactInfo: { ...content.contactInfo, cardEmailBtnText: e.target.value },
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Manufacturing Plant Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
                <MapPin size={14} className="text-purple-600" />
                <span>Card 3: Manufacturing Plant Card</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Card Title</label>
                  <input
                    type="text"
                    value={content.contactInfo?.cardAddressTitle || ''}
                    placeholder="Manufacturing Plant"
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contactInfo: { ...content.contactInfo, cardAddressTitle: e.target.value },
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Facility Name / Facility Area</label>
                  <input
                    type="text"
                    value={content.contactInfo?.cardAddressFacility || ''}
                    placeholder="Kota Central Facility"
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contactInfo: { ...content.contactInfo, cardAddressFacility: e.target.value },
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">View Map Button Label</label>
                  <input
                    type="text"
                    value={content.contactInfo?.cardAddressBtnText || ''}
                    placeholder="View on Map"
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contactInfo: { ...content.contactInfo, cardAddressBtnText: e.target.value },
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Card 4: Office & Plant Hours Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
                <Clock size={14} className="text-amber-600" />
                <span>Card 4: Office & Plant Hours Card</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Card Title</label>
                  <input
                    type="text"
                    value={content.contactInfo?.cardHoursTitle || ''}
                    placeholder="Office & Plant Hours"
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contactInfo: { ...content.contactInfo, cardHoursTitle: e.target.value },
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Card Subtitle / Description</label>
                  <input
                    type="text"
                    value={content.contactInfo?.cardHoursSubtitle || ''}
                    placeholder="Technical dispatch & customer reception"
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contactInfo: { ...content.contactInfo, cardHoursSubtitle: e.target.value },
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Working Days / Holiday Note</label>
                  <input
                    type="text"
                    value={content.contactInfo?.cardHoursNote || ''}
                    placeholder="Mon - Sat (Sun Closed)"
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contactInfo: { ...content.contactInfo, cardHoursNote: e.target.value },
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Section 2C: Plant Dossier Card (Left Column) */}
          {(contactSubTab === 'all' || contactSubTab === 'dossier') && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="text-emerald-600" size={20} />
                Company Dossier Card (Plant Credentials & Overview)
              </h3>
              <SectionSaveButton label="Save Dossier" compact />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Brand Title</label>
                <input
                  type="text"
                  value={content.contactInfo?.dossierTitle || ''}
                  placeholder="EBS EKOSMART"
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, dossierTitle: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Brand Subtitle</label>
                <input
                  type="text"
                  value={content.contactInfo?.dossierSubtitle || ''}
                  placeholder="BATTERY SOLUTION • LI-ION & LFP"
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, dossierSubtitle: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Corporate Entity Name</label>
                <input
                  type="text"
                  value={content.contactInfo?.corporateEntity || ''}
                  placeholder="Ekosmart Battery Solution (EBS)"
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, corporateEntity: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pan-India Warranty Badge Text</label>
                <input
                  type="text"
                  value={content.contactInfo?.dossierBadgeText || ''}
                  placeholder="Pan-India technical assistance, battery replacement logistics, and warranty coverage active."
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, dossierBadgeText: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Plant Facility & Diagnostics Overview</label>
                <textarea
                  rows={2}
                  value={content.contactInfo?.dossierDescription || ''}
                  placeholder="Ekosmart Battery Solution (EBS) & Ekosmart EV Spare Parts operates a state-of-the-art battery assembly, testing, and laboratory diagnostics facility in Kota, Rajasthan."
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, dossierDescription: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
            </div>
          </div>
          )}

          {/* Section 2D: Send an Official Inquiry Form Settings */}
          {(contactSubTab === 'all' || contactSubTab === 'form') && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <FileText className="text-blue-600" size={20} />
                Inquiry Form Content & Submission Labels
              </h3>
              <SectionSaveButton label="Save Inquiry Form" compact />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Form Heading</label>
                <input
                  type="text"
                  value={content.contactInfo?.formTitle || ''}
                  placeholder="Send an Official Inquiry"
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, formTitle: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Submit Button Text</label>
                <input
                  type="text"
                  value={content.contactInfo?.formButtonText || ''}
                  placeholder="SUBMIT INQUIRY TO KOTA PLANT"
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, formButtonText: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-bold uppercase tracking-wider"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Form Subtitle / Instructions</label>
                <input
                  type="text"
                  value={content.contactInfo?.formSubtitle || ''}
                  placeholder="Have questions regarding dealership, bulk battery orders, or spare parts? Fill out the form below."
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, formSubtitle: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quick Select Division Label</label>
                <input
                  type="text"
                  value={content.contactInfo?.formQuickSelectLabel || ''}
                  placeholder="QUICK SELECT DIVISION / CONCERN:"
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, formQuickSelectLabel: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Submission Success Heading</label>
                <input
                  type="text"
                  value={content.contactInfo?.formSuccessTitle || ''}
                  placeholder="Inquiry Received!"
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, formSuccessTitle: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
            </div>
          </div>
          )}

          {/* Section 2E: Division Directory Section Settings */}
          {(contactSubTab === 'all' || contactSubTab === 'divisions') && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="text-purple-600" size={20} />
                Department Directory Section Headings
              </h3>
              <SectionSaveButton label="Save Directory Headings" compact />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Section Badge</label>
                <input
                  type="text"
                  value={content.contactInfo?.divisionSectionBadge || ''}
                  placeholder="Department & Division Directory"
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, divisionSectionBadge: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Section Title</label>
                <input
                  type="text"
                  value={content.contactInfo?.divisionSectionTitle || ''}
                  placeholder="Direct Contact Channels by Division"
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, divisionSectionTitle: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-bold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Section Subtitle</label>
                <input
                  type="text"
                  value={content.contactInfo?.divisionSectionSubtitle || ''}
                  placeholder="Connect directly with our dedicated division engineers, parts managers, and franchise officers in Kota."
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, divisionSectionSubtitle: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
            </div>
          </div>
          )}

          {/* Section 3: Official Communication Channels & Address */}
          {(contactSubTab === 'all' || contactSubTab === 'coordinates') && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Phone className="text-green-600" size={20} />
                Official Support Details & Coordinates
              </h3>
              <SectionSaveButton label="Save Coordinates" compact />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Helpline Number</label>
                <input
                  type="text"
                  value={content.contactInfo?.helplinePhone || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, helplinePhone: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alternate / Escalation Phone</label>
                <input
                  type="text"
                  placeholder="+91 9549730483"
                  value={content.contactInfo?.alternatePhone || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, alternatePhone: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Support Email</label>
                <input
                  type="email"
                  value={content.contactInfo?.supportEmail || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, supportEmail: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sales & Bulk Inquiry Email</label>
                <input
                  type="email"
                  placeholder="sales@ekosmartdrive.in"
                  value={content.contactInfo?.salesEmail || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, salesEmail: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official WhatsApp Number</label>
                <input
                  type="text"
                  placeholder="+91 8949049003"
                  value={content.contactInfo?.whatsappNumber || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, whatsappNumber: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Google Maps / Directions URL</label>
                <input
                  type="text"
                  placeholder="https://maps.google.com/?q=Kota,Rajasthan"
                  value={content.contactInfo?.mapUrl || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, mapUrl: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Plant / Corporate Address</label>
                <input
                  type="text"
                  value={content.contactInfo?.plantAddress || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, plantAddress: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Working / Office Hours</label>
                <input
                  type="text"
                  value={content.contactInfo?.officeHours || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, officeHours: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">GSTIN Number</label>
                <input
                  type="text"
                  value={content.contactInfo?.gstin || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, gstin: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Website</label>
                <input
                  type="text"
                  value={content.contactInfo?.website || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactInfo: { ...content.contactInfo, website: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>
            </div>
          </div>
          )}

          {/* Section 4: Bottom Save & Preview Bar */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-lg">
            <div>
              <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                <span>Ready to publish Contact Us & Dropdown updates?</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Saving will update the live Contact Us form dropdown and phone/email coordinates across {FRONTEND_URL}/contact.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href={`${FRONTEND_URL}/contact`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-slate-700 hover:bg-slate-800 rounded-xl text-slate-300 text-xs font-semibold transition"
              >
                <span>Preview Contact Page</span>
                <ExternalLink size={14} />
              </a>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition shadow-md disabled:opacity-50"
              >
                <Save size={16} />
                <span>{saving ? 'Saving Changes...' : 'Save Contact & Dropdown'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CUSTOMER LOGIN TIMER & POPUP */}
      {activeTab === 'loginTimer' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Clock className="text-emerald-600" size={20} />
                  <span>Public Frontend 20-Second Customer Login Timer</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Controls the timed login popup that appears after a visitor browses the public frontend site.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={content.customerLoginTimer?.enabled ?? true}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        customerLoginTimer: {
                          enabled: e.target.checked,
                          durationSeconds: content.customerLoginTimer?.durationSeconds || 20,
                          title: content.customerLoginTimer?.title || 'Welcome to Ekosmart',
                          message:
                            content.customerLoginTimer?.message ||
                            'Login with your email to access your customer wallet, showroom bills, warranty certificates & rewards.',
                        },
                      })
                    }
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-bold text-slate-700">Enable Timed Login Popup</span>
                </label>
                <SectionSaveButton label="Save Timer" compact />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Form Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Popup Delay Duration (Seconds)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="3"
                      max="300"
                      value={content.customerLoginTimer?.durationSeconds ?? 20}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          customerLoginTimer: {
                            enabled: content.customerLoginTimer?.enabled ?? true,
                            durationSeconds: Math.max(3, Number(e.target.value) || 20),
                            title: content.customerLoginTimer?.title || 'Welcome to Ekosmart',
                            message: content.customerLoginTimer?.message || '',
                          },
                        })
                      }
                      className="w-32 border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-center"
                    />
                    <div className="flex gap-1.5">
                      {[10, 20, 30, 60].map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() =>
                            setContent({
                              ...content,
                              customerLoginTimer: {
                                enabled: content.customerLoginTimer?.enabled ?? true,
                                durationSeconds: sec,
                                title: content.customerLoginTimer?.title || 'Welcome to Ekosmart',
                                message: content.customerLoginTimer?.message || '',
                              },
                            })
                          }
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            (content.customerLoginTimer?.durationSeconds ?? 20) === sec
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {sec}s
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    When a guest opens the website, the site remains fully usable. After {content.customerLoginTimer?.durationSeconds ?? 20} seconds, the modal will smoothly prompt them to login.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Popup Heading Title
                  </label>
                  <input
                    type="text"
                    value={content.customerLoginTimer?.title || 'Welcome to Ekosmart'}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        customerLoginTimer: {
                          enabled: content.customerLoginTimer?.enabled ?? true,
                          durationSeconds: content.customerLoginTimer?.durationSeconds || 20,
                          title: e.target.value,
                          message: content.customerLoginTimer?.message || '',
                        },
                      })
                    }
                    placeholder="Welcome to Ekosmart"
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Popup Description Message
                  </label>
                  <textarea
                    rows={3}
                    value={
                      content.customerLoginTimer?.message ||
                      'Login with your email to access your customer wallet, showroom bills, warranty certificates & rewards.'
                    }
                    onChange={(e) =>
                      setContent({
                        ...content,
                        customerLoginTimer: {
                          enabled: content.customerLoginTimer?.enabled ?? true,
                          durationSeconds: content.customerLoginTimer?.durationSeconds || 20,
                          title: content.customerLoginTimer?.title || 'Welcome to Ekosmart',
                          message: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs leading-relaxed"
                  />
                </div>
              </div>

              {/* Right Column: Live Modal Visual Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Customer Live Popup Preview
                </label>
                <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-xl border border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Ekosmart Customer Portal
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      ⏱ Triggers in {content.customerLoginTimer?.durationSeconds ?? 20}s
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-black text-white">
                      {content.customerLoginTimer?.title || 'Welcome to Ekosmart'}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {content.customerLoginTimer?.message ||
                        'Login with your email to access your customer wallet, showroom bills, warranty certificates & rewards.'}
                    </p>
                  </div>

                  <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Mail size={14} className="text-emerald-400" />
                      <span className="text-slate-300">Email Address (e.g. rahul@example.com)</span>
                    </div>
                    <div className="w-full py-2 bg-emerald-600 rounded-xl text-center font-bold text-white text-xs">
                      Continue with Email OTP →
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-emerald-300 pt-1">
                    <div>🪙 +500 Welcome Coins</div>
                    <div>🧾 Showroom Bills Auto-Linked</div>
                    <div>🛡️ 3-Year EV Warranty</div>
                    <div>🎁 500 Coins Referral Bonus</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Bar */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-lg">
            <div>
              <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                <span>Publish Customer Login Timer Settings</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Saving will instantly update the popup trigger delay and message across the public website.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition shadow-md disabled:opacity-50"
              >
                <Save size={16} />
                <span>{saving ? 'Saving Changes...' : 'Save Timer Configuration'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: THEME & CUSTOM DESIGN TOKENS */}
      {activeTab === 'theme' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Palette size={20} className="text-emerald-600" />
                  <span>Design Tokens & Theme Colors (100% Soft-Coded)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure brand primary, secondary, surface, background, and state colors. These tokens apply via CSS variables across all public customer portals.
                </p>
              </div>
              <SectionSaveButton label="Save Theme Tokens" />

              {/* Preset Color Themes */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400">Quick Presets:</span>
                <button
                  type="button"
                  onClick={() =>
                    applyThemePreset({
                      primary: '#059669',
                      primaryHover: '#047857',
                      secondary: '#0f172a',
                      accent: '#10b981',
                      background: '#f8fafc',
                      surface: '#ffffff',
                      text: '#1e293b',
                      textMuted: '#64748b',
                      border: '#e2e8f0',
                    })
                  }
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition cursor-pointer"
                >
                  Ekosmart Emerald
                </button>
                <button
                  type="button"
                  onClick={() =>
                    applyThemePreset({
                      primary: '#2563eb',
                      primaryHover: '#1d4ed8',
                      secondary: '#0f172a',
                      accent: '#38bdf8',
                      background: '#f8fafc',
                      surface: '#ffffff',
                      text: '#1e293b',
                      textMuted: '#64748b',
                      border: '#e2e8f0',
                    })
                  }
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-300 hover:bg-blue-100 transition cursor-pointer"
                >
                  Ocean Sapphire
                </button>
                <button
                  type="button"
                  onClick={() =>
                    applyThemePreset({
                      primary: '#d97706',
                      primaryHover: '#b45309',
                      secondary: '#1c1917',
                      accent: '#f59e0b',
                      background: '#fafaf9',
                      surface: '#ffffff',
                      text: '#1c1917',
                      textMuted: '#78716c',
                      border: '#e7e5e4',
                    })
                  }
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition cursor-pointer"
                >
                  Sunset Amber
                </button>
                <button
                  type="button"
                  onClick={() =>
                    applyThemePreset({
                      primary: '#7c3aed',
                      primaryHover: '#6d28d9',
                      secondary: '#0f172a',
                      accent: '#a855f7',
                      background: '#f8fafc',
                      surface: '#ffffff',
                      text: '#1e293b',
                      textMuted: '#64748b',
                      border: '#e2e8f0',
                    })
                  }
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-300 hover:bg-purple-100 transition cursor-pointer"
                >
                  Cyber Violet
                </button>
                <button
                  type="button"
                  onClick={() =>
                    applyThemePreset({
                      primary: '#0d9488',
                      primaryHover: '#0f766e',
                      secondary: '#042f2e',
                      accent: '#14b8a6',
                      background: '#f0fdfa',
                      surface: '#ffffff',
                      text: '#134e4a',
                      textMuted: '#5eead4',
                      border: '#ccfbf1',
                    })
                  }
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-300 hover:bg-teal-100 transition cursor-pointer"
                >
                  Kota Teal
                </button>
              </div>
            </div>

            {/* Color Pickers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[
                { key: 'primary', label: 'Primary Brand Color', desc: 'Main buttons, CTAs, links' },
                { key: 'primaryHover', label: 'Primary Hover State', desc: 'Hover state for primary action buttons' },
                { key: 'secondary', label: 'Secondary Tone', desc: 'Top bar, dark accents, banners' },
                { key: 'accent', label: 'Brand Accent', desc: 'Highlights, badges, live indicators' },
                { key: 'background', label: 'Page Background', desc: 'Global body background color' },
                { key: 'surface', label: 'Surface / Card Background', desc: 'Cards, modals, dropdown surfaces' },
                { key: 'text', label: 'Primary Text', desc: 'Headings, labels, main body text' },
                { key: 'textMuted', label: 'Muted Text', desc: 'Subtitles, secondary labels, hints' },
                { key: 'border', label: 'Border Color', desc: 'Dividers, card outlines, inputs' },
                { key: 'success', label: 'Success / Active', desc: 'Verified badges, active states' },
                { key: 'warning', label: 'Warning / Caution', desc: 'Pending alerts, notices' },
                { key: 'error', label: 'Error / Alert', desc: 'Rejected badges, destructive actions' },
              ].map(({ key, label, desc }) => {
                const colorVal =
                  (content.themeColors as any)?.[key] ||
                  (defaultFallbackContent.themeColors as any)?.[key] ||
                  '#059669';
                return (
                  <div key={key} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800">{label}</span>
                      <div
                        className="w-5 h-5 rounded-full border border-slate-300 shadow-xs"
                        style={{ backgroundColor: colorVal }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">{desc}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="color"
                        value={colorVal.startsWith('#') ? colorVal : '#059669'}
                        onChange={(e) => updateThemeColor(key as keyof IThemeColors, e.target.value)}
                        className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white shrink-0"
                      />
                      <input
                        type="text"
                        value={colorVal}
                        onChange={(e) => updateThemeColor(key as keyof IThemeColors, e.target.value)}
                        placeholder="#059669"
                        className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Interactive Preview Card */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Eye size={15} className="text-emerald-400" />
                  <span>Real-Time Theme Token Preview</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Live CSS Variables Simulation</span>
              </div>

              <div
                style={{
                  backgroundColor: content.themeColors?.background || '#f8fafc',
                  color: content.themeColors?.text || '#1e293b',
                  borderColor: content.themeColors?.border || '#e2e8f0',
                }}
                className="p-6 rounded-xl border transition-all space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span
                      style={{
                        backgroundColor: `${content.themeColors?.accent || '#10b981'}20`,
                        color: content.themeColors?.primary || '#059669',
                        borderColor: content.themeColors?.accent || '#10b981',
                      }}
                      className="px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider inline-block"
                    >
                      ★ Ekosmart Verified Li-Ion
                    </span>
                    <h3 className="text-lg font-extrabold mt-1">High Power Battery Solution Preview</h3>
                    <p style={{ color: content.themeColors?.textMuted || '#64748b' }} className="text-xs">
                      This simulated card demonstrates how typography, buttons, and surfaces adapt to your custom theme colors.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      style={{
                        backgroundColor: content.themeColors?.primary || '#059669',
                        color: '#ffffff',
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition"
                    >
                      Primary Action Button
                    </button>
                    <button
                      type="button"
                      style={{
                        backgroundColor: content.themeColors?.surface || '#ffffff',
                        color: content.themeColors?.text || '#1e293b',
                        borderColor: content.themeColors?.border || '#e2e8f0',
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold border shadow-xs transition"
                    >
                      Secondary Button
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div
                    style={{
                      backgroundColor: content.themeColors?.surface || '#ffffff',
                      borderColor: content.themeColors?.border || '#e2e8f0',
                    }}
                    className="p-3 rounded-lg border text-xs"
                  >
                    <div style={{ color: content.themeColors?.textMuted || '#64748b' }} className="text-[10px] font-bold uppercase">
                      48V Series Warranty
                    </div>
                    <div className="text-base font-extrabold mt-0.5">3 Years Coverage</div>
                  </div>
                  <div
                    style={{
                      backgroundColor: content.themeColors?.surface || '#ffffff',
                      borderColor: content.themeColors?.border || '#e2e8f0',
                    }}
                    className="p-3 rounded-lg border text-xs"
                  >
                    <div style={{ color: content.themeColors?.textMuted || '#64748b' }} className="text-[10px] font-bold uppercase">
                      Kota Facility SLA
                    </div>
                    <div className="text-base font-extrabold mt-0.5">Fast Turnaround</div>
                  </div>
                  <div
                    style={{
                      backgroundColor: content.themeColors?.surface || '#ffffff',
                      borderColor: content.themeColors?.border || '#e2e8f0',
                    }}
                    className="p-3 rounded-lg border text-xs"
                  >
                    <div style={{ color: content.themeColors?.textMuted || '#64748b' }} className="text-[10px] font-bold uppercase">
                      Quality Standard
                    </div>
                    <div className="text-base font-extrabold mt-0.5">100% Genuine Cells</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Bar */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-lg">
              <div>
                <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-400" />
                  <span>Publish Custom Theme Tokens</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Saving will update the CSS color variables across customer frontend and connected portals instantly.
                </p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      themeColors: defaultFallbackContent.themeColors,
                    })
                  }
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
                >
                  <RotateCcw size={14} />
                  <span>Reset Palette</span>
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition shadow-md disabled:opacity-50"
                >
                  <Save size={16} />
                  <span>{saving ? 'Saving...' : 'Save Theme Tokens'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: SECTION LAYOUTS */}
      {activeTab === 'layouts' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Sliders size={20} className="text-blue-600" />
                  <span>Soft-Coded Section Layouts & Styles</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customize maximum container width, top/bottom padding, background color overrides, border radius, and visibility for every public section.
                </p>
              </div>
              <SectionSaveButton label="Save Layouts" />
            </div>

            {/* Sections Layout List */}
            <div className="space-y-5">
              {[
                { key: 'hero', name: 'Hero & Header Showcase', defaultWidth: '1280px', defaultPadTop: '4rem', defaultPadBottom: '5rem' },
                { key: 'quickActions', name: 'Quick Access Utilities Bar', defaultWidth: '1280px', defaultPadTop: '2rem', defaultPadBottom: '2rem' },
                { key: 'serviceCards', name: 'Homepage Flash / Service Cards Grid', defaultWidth: '1280px', defaultPadTop: '2rem', defaultPadBottom: '2rem' },
                { key: 'rewards', name: 'Customer Rewards & Wallet Banner', defaultWidth: '1280px', defaultPadTop: '2rem', defaultPadBottom: '2rem' },
                { key: 'batteryBanner', name: 'Battery Assistance & Support Banner', defaultWidth: '1280px', defaultPadTop: '2rem', defaultPadBottom: '3rem' },
                { key: 'contact', name: 'Contact Us Directory & Form', defaultWidth: '1280px', defaultPadTop: '2rem', defaultPadBottom: '3rem' },
                { key: 'footer', name: 'Global Website Footer', defaultWidth: '1280px', defaultPadTop: '3rem', defaultPadBottom: '3rem' },
              ].map(({ key, name, defaultWidth, defaultPadTop, defaultPadBottom }) => {
                const layout =
                  (content.sectionLayouts as any)?.[key] ||
                  (defaultFallbackContent.sectionLayouts as any)?.[key] ||
                  {};
                const isVisible = layout.isVisible !== false;

                return (
                  <div
                    key={key}
                    className={`p-5 rounded-2xl border transition-all ${
                      isVisible ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-100/60 border-dashed border-slate-300 opacity-70'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-200/80 pb-3 mb-4">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                          <Sliders size={15} />
                        </span>
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm">{name}</h3>
                          <span className="text-[11px] text-slate-400 font-mono">section: {key}</span>
                        </div>
                      </div>

                      {/* Visibility Toggle & Save */}
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => updateSectionLayout(key as keyof ISectionLayouts, { isVisible: !isVisible })}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                            isVisible
                              ? 'bg-green-100 text-green-800 border border-green-300'
                              : 'bg-slate-200 text-slate-600 border border-slate-300'
                          }`}
                        >
                          {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                          <span>{isVisible ? 'Section Visible' : 'Section Hidden'}</span>
                        </button>
                        <SectionSaveButton label="Save" compact />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Max Width */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Max Container Width</label>
                        <select
                          value={layout.maxWidth || defaultWidth}
                          onChange={(e) => updateSectionLayout(key as keyof ISectionLayouts, { maxWidth: e.target.value })}
                          className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                        >
                          <option value="100%">100% (Full Edge-to-Edge)</option>
                          <option value="1440px">1440px (Wide / max-w-7xl)</option>
                          <option value="1280px">1280px (Standard / max-w-6xl)</option>
                          <option value="1024px">1024px (Compact / max-w-5xl)</option>
                          <option value="800px">800px (Narrow / max-w-3xl)</option>
                        </select>
                      </div>

                      {/* Padding Top */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Padding Top</label>
                        <select
                          value={layout.paddingTop || defaultPadTop}
                          onChange={(e) => updateSectionLayout(key as keyof ISectionLayouts, { paddingTop: e.target.value })}
                          className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                        >
                          <option value="0.5rem">0.5rem (Minimal)</option>
                          <option value="1rem">1rem (Compact)</option>
                          <option value="2rem">2rem (Standard)</option>
                          <option value="3rem">3rem (Comfortable)</option>
                          <option value="4rem">4rem (Spacious)</option>
                          <option value="5rem">5rem (Generous)</option>
                        </select>
                      </div>

                      {/* Padding Bottom */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Padding Bottom</label>
                        <select
                          value={layout.paddingBottom || defaultPadBottom}
                          onChange={(e) => updateSectionLayout(key as keyof ISectionLayouts, { paddingBottom: e.target.value })}
                          className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                        >
                          <option value="0.5rem">0.5rem (Minimal)</option>
                          <option value="1rem">1rem (Compact)</option>
                          <option value="2rem">2rem (Standard)</option>
                          <option value="3rem">3rem (Comfortable)</option>
                          <option value="4rem">4rem (Spacious)</option>
                          <option value="5rem">5rem (Generous)</option>
                        </select>
                      </div>

                      {/* Background Override */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Background Override</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={layout.backgroundColor && layout.backgroundColor.startsWith('#') ? layout.backgroundColor : '#ffffff'}
                            onChange={(e) => updateSectionLayout(key as keyof ISectionLayouts, { backgroundColor: e.target.value })}
                            className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0.5 bg-white shrink-0"
                          />
                          <input
                            type="text"
                            value={layout.backgroundColor || ''}
                            onChange={(e) => updateSectionLayout(key as keyof ISectionLayouts, { backgroundColor: e.target.value })}
                            placeholder="Default / Transparent"
                            className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Save Bar */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-lg">
              <div>
                <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-400" />
                  <span>Publish Section Layout Settings</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Saving updates layout width and padding constraints across the customer website instantly.
                </p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition shadow-md disabled:opacity-50"
                >
                  <Save size={16} />
                  <span>{saving ? 'Saving...' : 'Save Section Layouts'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: NAVIGATION BAR */}
      {activeTab === 'navbar' && (() => {
        const navConf: IHeaderNavConfig = content.headerNav || defaultFallbackContent.headerNav!;
        const topBarConf: ITopBarConfig = content.topBar || defaultFallbackContent.topBar!;
        const customItems: ICustomNavItem[] = navConf.customNavItems || defaultFallbackContent.headerNav?.customNavItems || [];

        const updateNav = (patch: Partial<IHeaderNavConfig>) => {
          setContent({
            ...content,
            headerNav: { ...navConf, ...patch },
          });
        };

        const updateTopBar = (patch: Partial<ITopBarConfig>) => {
          setContent({
            ...content,
            topBar: { ...topBarConf, ...patch },
          });
        };

        const renderPreviewIcon = (iconName?: string, defaultIcon?: React.ReactNode, size = 13) => {
          if (!iconName) return defaultIcon || null;
          const k = iconName.toLowerCase().replace(/[-_\s]/g, '');
          switch (k) {
            case 'home': return <Home size={size} />;
            case 'coins':
            case 'wallet': return <Coins size={size} />;
            case 'gift': return <Gift size={size} />;
            case 'phone': return <Phone size={size} />;
            case 'user': return <User size={size} />;
            case 'battery': return <Battery size={size} />;
            case 'zap': return <Zap size={size} />;
            case 'sparkles': return <Sparkles size={size} />;
            case 'shield': return <ShieldCheck size={size} />;
            case 'file': return <FileText size={size} />;
            case 'search': return <Search size={size} />;
            case 'receipt': return <Receipt size={size} />;
            case 'help': return <HelpCircle size={size} />;
            case 'wrench': return <Wrench size={size} />;
            case 'tag': return <Tag size={size} />;
            case 'message': return <MessageSquare size={size} />;
            default: return defaultIcon || null;
          }
        };

        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <List size={20} className="text-purple-600" />
                    <span>Header Navigation Bar & Top Strip Settings</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure brand header title, helpline bar, default core links (Home, Wallet, Refer, Contact, Account), and add custom navigation items and dropdowns.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setNavPreviewMode('desktop')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        navPreviewMode === 'desktop'
                          ? 'bg-white text-slate-800 shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Monitor size={13} />
                      <span>Desktop</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNavPreviewMode('mobile')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        navPreviewMode === 'mobile'
                          ? 'bg-white text-slate-800 shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Smartphone size={13} />
                      <span>Mobile</span>
                    </button>
                  </div>
                  <SectionSaveButton label="Save Navbar" />
                </div>
              </div>

              {/* LIVE INTERACTIVE NAVBAR MOCKUP PREVIEW */}
              <div className="rounded-2xl border border-slate-200 bg-slate-100/70 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye size={14} className="text-purple-600" />
                    <span>Real-Time Public Navbar Preview ({navPreviewMode === 'desktop' ? 'Desktop' : 'Mobile Drawer'})</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Updates live as you edit below</span>
                </div>

                {navPreviewMode === 'desktop' ? (
                  <div className="rounded-xl overflow-hidden border border-slate-300 shadow-sm bg-white">
                    {/* Top Bar Preview */}
                    {(topBarConf.isVisible ?? true) && (
                      <div
                        style={{
                          backgroundColor: topBarConf.bgColor || '#0f172a',
                          color: topBarConf.textColor || '#cbd5e1',
                        }}
                        className="text-[11px] py-1.5 px-4 flex justify-between items-center"
                      >
                        <div className="flex items-center gap-4">
                          {(topBarConf.showPhone ?? true) && (
                            <span style={{ color: topBarConf.accentColor || '#34d399' }} className="flex items-center gap-1 font-semibold">
                              <Phone size={11} />
                              <span>{topBarConf.phoneLabel || 'Helpline:'} {topBarConf.phone || '+91 8949049003'}</span>
                            </span>
                          )}
                          {(topBarConf.showOfficeHours ?? true) && (
                            <span className="flex items-center gap-1 opacity-80">
                              <Clock size={11} />
                              <span>{topBarConf.officeHours || '10:00 AM to 6:30 PM (Mon - Sat)'}</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 opacity-80">
                          {(topBarConf.showGstin ?? true) && (
                            <span className="font-mono">GSTIN: {topBarConf.gstin || '08DTUPM4205B1Z0'}</span>
                          )}
                          {(topBarConf.showLocation ?? true) && (
                            <span style={{ color: topBarConf.accentColor || '#34d399' }} className="flex items-center gap-1 font-semibold">
                              <MapPin size={11} />
                              <span>{topBarConf.location || 'Kota, Rajasthan'}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Navbar Preview */}
                    <div
                      style={{
                        backgroundColor: navConf.navBgColor || '#ffffff',
                        borderColor: navConf.navBorderColor || '#e2e8f0',
                      }}
                      className="px-4 py-3 border-b flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                          <Battery size={18} />
                        </div>
                        <div>
                          <div className="font-black text-slate-900 text-sm leading-tight">
                            {navConf.brandTitle || 'EBS EKOSMART'}
                          </div>
                          <div className="text-[10px] text-emerald-700 font-semibold leading-tight">
                            {navConf.brandSubtitle || 'Battery Solution • Li-ion & LFP'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-bold">
                        {(navConf.showHome ?? true) && (
                          <span className="text-emerald-700 flex items-center gap-1 border-b-2 border-emerald-600 pb-0.5">
                            {renderPreviewIcon(navConf.homeIcon, <Home size={13} className="text-emerald-600" />)}
                            <span>{navConf.homeLabel || 'Home'}</span>
                          </span>
                        )}

                        {(navConf.showWallet ?? true) && (
                          <span
                            style={{
                              backgroundColor: navConf.walletBgColor || '#fef3c7',
                              color: navConf.walletTextColor || '#78350f',
                              borderColor: navConf.walletBorderColor || '#fde68a',
                            }}
                            className="px-2.5 py-1 rounded-xl flex items-center gap-1 border shadow-xs"
                          >
                            {renderPreviewIcon(navConf.walletIcon, <Coins size={13} className="text-amber-600" />)}
                            <span>{navConf.walletLabel || 'Wallet & Coins'}</span>
                            {(navConf.showWalletBadge ?? true) && (
                              <span className="bg-amber-200 text-amber-950 text-[10px] px-1 py-0.2 rounded font-black">
                                500
                              </span>
                            )}
                          </span>
                        )}

                        {(navConf.showRefer ?? true) && (
                          <span
                            style={{
                              backgroundColor: navConf.referBgColor || '#faf5ff',
                              color: navConf.referTextColor || '#581c87',
                              borderColor: navConf.referBorderColor || '#e9d5ff',
                            }}
                            className="px-2.5 py-1 rounded-xl flex items-center gap-1 border shadow-xs"
                          >
                            {renderPreviewIcon(navConf.referIcon, <Gift size={13} className="text-purple-600" />)}
                            <span>
                              {navConf.referLabel || 'Refer & Earn'}
                              {(navConf.showReferBonus ?? true) && ` (+${navConf.referBonusAmount || 500})`}
                            </span>
                          </span>
                        )}

                        {/* Showroom Billing Preview */}
                        {(navConf.showShowroomBilling ?? true) && (
                          <span className="text-slate-800 flex items-center gap-1 hover:text-emerald-700">
                            {renderPreviewIcon(navConf.showroomBillingIcon, <Receipt size={13} className="text-blue-600" />)}
                            <span>{navConf.showroomBillingLabel || 'Showroom Bills'}</span>
                          </span>
                        )}

                        {/* Check Warranty Preview */}
                        {(navConf.showWarrantyCheck ?? true) && (
                          <span className="text-slate-800 flex items-center gap-1 hover:text-emerald-700">
                            {renderPreviewIcon(navConf.warrantyCheckIcon, <ShieldCheck size={13} className="text-purple-600" />)}
                            <span>{navConf.warrantyCheckLabel || 'Check Warranty'}</span>
                          </span>
                        )}

                        {/* Track Support Ticket Preview */}
                        {(navConf.showTrackTicket ?? true) && (
                          <span className="text-slate-800 flex items-center gap-1 hover:text-emerald-700">
                            {renderPreviewIcon(navConf.trackTicketIcon, <Search size={13} className="text-emerald-600" />)}
                            <span>{navConf.trackTicketLabel || 'Track Ticket'}</span>
                          </span>
                        )}

                        {/* Support Ticket Preview */}
                        {Boolean(navConf.showSupportTicket) && (
                          <span className="text-slate-800 flex items-center gap-1 hover:text-emerald-700">
                            {renderPreviewIcon(navConf.supportTicketIcon, <FileText size={13} className="text-amber-600" />)}
                            <span>{navConf.supportTicketLabel || 'Support Ticket'}</span>
                          </span>
                        )}

                        {/* Custom Nav Items Preview */}
                        {customItems
                          .filter((i) => i && i.isVisible !== false)
                          .map((item) => {
                            const itemType = item.itemType || 'link';
                            let itemStyle: React.CSSProperties = {};
                            let itemClass = 'flex items-center gap-1 transition ';

                            if (itemType === 'button') {
                              itemStyle = {
                                backgroundColor: item.bgColor || '#059669',
                                color: item.textColor || '#ffffff',
                                borderColor: item.borderColor || undefined,
                              };
                              itemClass += 'px-3 py-1 rounded-xl shadow-xs';
                            } else if (itemType === 'pill') {
                              itemStyle = {
                                backgroundColor: item.bgColor || '#f1f5f9',
                                color: item.textColor || '#0f172a',
                                borderColor: item.borderColor || '#cbd5e1',
                              };
                              itemClass += 'px-2.5 py-1 rounded-xl border shadow-xs';
                            } else {
                              itemStyle = { color: item.textColor || '#1e293b' };
                              itemClass += 'hover:text-emerald-700';
                            }

                            return (
                              <span key={item.id} style={itemStyle} className={itemClass}>
                                {renderPreviewIcon(item.icon, null, 13)}
                                <span>{item.label}</span>
                                {item.badge && (
                                  <span
                                    style={{ backgroundColor: item.badgeColor || '#ef4444' }}
                                    className="text-[10px] text-white px-1.5 py-0.2 rounded font-black"
                                  >
                                    {item.badge}
                                  </span>
                                )}
                                {item.isExternal && <ExternalLink size={9} className="opacity-60" />}
                              </span>
                            );
                          })}

                        {(navConf.showContactDropdown ?? true) && (
                          <span className="flex items-center gap-1 text-slate-800">
                            {renderPreviewIcon(navConf.contactIcon, <Phone size={13} className="text-emerald-600" />)}
                            <span>{navConf.contactLabel || 'Contact & Helpline'}</span>
                            <ChevronDown size={11} className="text-slate-500" />
                          </span>
                        )}

                        {(navConf.showAccount ?? true) && (
                          <span
                            style={{
                              backgroundColor: navConf.accountBtnBg || '#059669',
                              color: navConf.accountBtnText || '#ffffff',
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs"
                          >
                            {renderPreviewIcon(navConf.accountIcon, <User size={13} />)}
                            <span>{navConf.accountLabel || 'Account / Login'}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Mobile Preview */
                  <div className="max-w-sm mx-auto rounded-2xl overflow-hidden border border-slate-300 shadow-md bg-slate-900 text-white">
                    <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-emerald-600 flex items-center justify-center text-white">
                          <Battery size={14} />
                        </div>
                        <span className="font-bold text-xs">{navConf.brandTitle || 'EBS EKOSMART'}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono">Mobile Drawer</span>
                    </div>
                    <div className="p-4 space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between">
                        <span>Customer Wallet</span>
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <Coins size={12} />
                          <span>500 Coins</span>
                        </span>
                      </div>
                      <div className="space-y-1 pt-1">
                        {(navConf.showHome ?? true) && (
                          <div className="p-2 rounded-lg bg-emerald-900/40 text-emerald-300 font-bold flex items-center gap-2">
                            {renderPreviewIcon(navConf.homeIcon, <Home size={13} />)}
                            <span>{navConf.homeLabel || 'Home'}</span>
                          </div>
                        )}
                        {(navConf.showWallet ?? true) && (
                          <div className="p-2 rounded-lg bg-slate-800 text-slate-200 font-semibold flex items-center gap-2">
                            {renderPreviewIcon(navConf.walletIcon, <Coins size={13} className="text-amber-400" />)}
                            <span>{navConf.walletLabel || 'My Wallet'} (500 Coins)</span>
                          </div>
                        )}
                        {(navConf.showRefer ?? true) && (
                          <div className="p-2 rounded-lg bg-slate-800 text-slate-200 font-semibold flex items-center gap-2">
                            {renderPreviewIcon(navConf.referIcon, <Gift size={13} className="text-purple-400" />)}
                            <span>{navConf.referLabel || 'My Referrals'} (+{navConf.referBonusAmount || 500})</span>
                          </div>
                        )}
                        {(navConf.showShowroomBilling ?? true) && (
                          <div className="p-2 rounded-lg bg-slate-800 text-slate-200 font-semibold flex items-center gap-2">
                            {renderPreviewIcon(navConf.showroomBillingIcon, <Receipt size={13} className="text-blue-400" />)}
                            <span>{navConf.showroomBillingLabel || 'Showroom Bills'}</span>
                          </div>
                        )}
                        {(navConf.showWarrantyCheck ?? true) && (
                          <div className="p-2 rounded-lg bg-slate-800 text-slate-200 font-semibold flex items-center gap-2">
                            {renderPreviewIcon(navConf.warrantyCheckIcon, <ShieldCheck size={13} className="text-purple-400" />)}
                            <span>{navConf.warrantyCheckLabel || 'Check Battery Warranty'}</span>
                          </div>
                        )}
                        {Boolean(navConf.showSupportTicket) && (
                          <div className="p-2 rounded-lg bg-slate-800 text-slate-200 font-semibold flex items-center gap-2">
                            {renderPreviewIcon(navConf.supportTicketIcon, <FileText size={13} className="text-emerald-400" />)}
                            <span>{navConf.supportTicketLabel || 'Support Ticket'}</span>
                          </div>
                        )}
                        {(navConf.showTrackTicket ?? true) && (
                          <div className="p-2 rounded-lg bg-slate-800 text-slate-200 font-semibold flex items-center gap-2">
                            {renderPreviewIcon(navConf.trackTicketIcon, <Search size={13} className="text-blue-400" />)}
                            <span>{navConf.trackTicketLabel || 'Track Ticket'}</span>
                          </div>
                        )}
                        {customItems
                          .filter((i) => i && i.isVisible !== false)
                          .map((item) => (
                            <div key={item.id} className="p-2 rounded-lg bg-slate-800 text-slate-200 font-semibold flex items-center justify-between">
                              <span className="flex items-center gap-2">
                                {renderPreviewIcon(item.icon, <Tag size={13} className="text-emerald-400" />)}
                                <span>{item.label}</span>
                              </span>
                              {item.badge && (
                                <span
                                  style={{ backgroundColor: item.badgeColor || '#ef4444' }}
                                  className="text-[9px] text-white px-1.5 py-0.2 rounded font-black"
                                >
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          ))}
                        {(navConf.showContactDropdown ?? true) && (
                          <div className="p-2 rounded-lg bg-slate-800 text-slate-200 font-semibold flex items-center gap-2">
                            {renderPreviewIcon(navConf.contactIcon, <Phone size={13} className="text-emerald-400" />)}
                            <span>{navConf.contactLabel || 'Contact Us'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 1: GLOBAL NAVBAR & BRAND SETTINGS */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Sliders size={14} className="text-purple-600" />
                      <span>Global Navbar & Brand Settings</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">Configure sticky behavior, container colors, and brand identity.</p>
                  </div>
                  <SectionSaveButton label="Save Brand" compact />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Brand Main Title</label>
                    <input
                      type="text"
                      value={navConf.brandTitle || ''}
                      onChange={(e) => updateNav({ brandTitle: e.target.value })}
                      placeholder="EBS EKOSMART"
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Brand Subtitle</label>
                    <input
                      type="text"
                      value={navConf.brandSubtitle || ''}
                      onChange={(e) => updateNav({ brandSubtitle: e.target.value })}
                      placeholder="Battery Solution • Li-ion & LFP"
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Brand Logo Destination Link</label>
                    <input
                      type="text"
                      value={navConf.logoLink || '/'}
                      onChange={(e) => updateNav({ logoLink: e.target.value })}
                      placeholder="/"
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Navbar Background Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={navConf.navBgColor || '#ffffff'}
                        onChange={(e) => updateNav({ navBgColor: e.target.value })}
                        className="w-8 h-8 rounded border border-slate-300 p-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={navConf.navBgColor || '#ffffff'}
                        onChange={(e) => updateNav({ navBgColor: e.target.value })}
                        className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Navbar Border Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={navConf.navBorderColor || '#e2e8f0'}
                        onChange={(e) => updateNav({ navBorderColor: e.target.value })}
                        className="w-8 h-8 rounded border border-slate-300 p-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={navConf.navBorderColor || '#e2e8f0'}
                        onChange={(e) => updateNav({ navBorderColor: e.target.value })}
                        className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono"
                        placeholder="#e2e8f0"
                      />
                    </div>
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={navConf.isSticky ?? true}
                        onChange={(e) => updateNav({ isSticky: e.target.checked })}
                        className="rounded text-green-600 h-4 w-4"
                      />
                      <span>Sticky Navbar (Fixed on scroll)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* SECTION 2: TOP HELPLINE HEADER STRIP */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Phone size={14} className="text-emerald-600" />
                      <span>Top Helpline Header Strip</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">Dark informational strip at the very top of all pages</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={topBarConf.isVisible ?? true}
                        onChange={(e) => updateTopBar({ isVisible: e.target.checked })}
                        className="rounded text-green-600 h-4 w-4"
                      />
                      <span>Show Top Bar</span>
                    </label>
                    <SectionSaveButton label="Save Strip" compact />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Helpline Phone</label>
                    <input
                      type="text"
                      value={topBarConf.phone || ''}
                      onChange={(e) => updateTopBar({ phone: e.target.value })}
                      placeholder="+91 8949049003"
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Helpline Label</label>
                    <input
                      type="text"
                      value={topBarConf.phoneLabel || 'Helpline:'}
                      onChange={(e) => updateTopBar({ phoneLabel: e.target.value })}
                      placeholder="Helpline:"
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Office Hours</label>
                    <input
                      type="text"
                      value={topBarConf.officeHours || ''}
                      onChange={(e) => updateTopBar({ officeHours: e.target.value })}
                      placeholder="10:00 AM to 6:30 PM (Mon - Sat)"
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">GSTIN Number</label>
                    <input
                      type="text"
                      value={topBarConf.gstin || ''}
                      onChange={(e) => updateTopBar({ gstin: e.target.value })}
                      placeholder="08DTUPM4205B1Z0"
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Location Label</label>
                    <input
                      type="text"
                      value={topBarConf.location || ''}
                      onChange={(e) => updateTopBar({ location: e.target.value })}
                      placeholder="Kota, Rajasthan"
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Background Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={topBarConf.bgColor || '#0f172a'}
                        onChange={(e) => updateTopBar({ bgColor: e.target.value })}
                        className="w-8 h-8 rounded border border-slate-300 p-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={topBarConf.bgColor || '#0f172a'}
                        onChange={(e) => updateTopBar({ bgColor: e.target.value })}
                        className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Text Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={topBarConf.textColor || '#cbd5e1'}
                        onChange={(e) => updateTopBar({ textColor: e.target.value })}
                        className="w-8 h-8 rounded border border-slate-300 p-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={topBarConf.textColor || '#cbd5e1'}
                        onChange={(e) => updateTopBar({ textColor: e.target.value })}
                        className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Accent Highlight Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={topBarConf.accentColor || '#34d399'}
                        onChange={(e) => updateTopBar({ accentColor: e.target.value })}
                        className="w-8 h-8 rounded border border-slate-300 p-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={topBarConf.accentColor || '#34d399'}
                        onChange={(e) => updateTopBar({ accentColor: e.target.value })}
                        className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: CORE NAVBAR ITEMS SOFTCODING */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle size={14} className="text-emerald-600" />
                      <span>Core Navigation Links (100% Soft-Coded)</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Customize labels, routes, icons, badges, and colors for Home, Wallet, Refer, Contact, and Account.
                    </p>
                  </div>
                  <SectionSaveButton label="Save Core Links" compact />
                </div>

                {/* QUICK PRESETS & 1-CLICK TOGGLES CONTROL CENTER */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-purple-600" />
                      <span>Quick Link Toggles & 1-Click Option Presets</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">Click to toggle visibility or add new options</span>
                  </div>

                  {/* 1-Click Toggles for All 9 Core Links */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Core Navbar Links Status (Click to Toggle)</label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => updateNav({ showHome: !(navConf.showHome ?? true) })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                          (navConf.showHome ?? true)
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                            : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                        }`}
                      >
                        <Home size={12} />
                        <span>Home</span>
                        <span className="text-[10px]">{(navConf.showHome ?? true) ? 'ON' : 'OFF'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateNav({ showWallet: !(navConf.showWallet ?? true) })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                          (navConf.showWallet ?? true)
                            ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-xs'
                            : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                        }`}
                      >
                        <Coins size={12} />
                        <span>Wallet & Coins</span>
                        <span className="text-[10px]">{(navConf.showWallet ?? true) ? 'ON' : 'OFF'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateNav({ showRefer: !(navConf.showRefer ?? true) })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                          (navConf.showRefer ?? true)
                            ? 'bg-purple-50 text-purple-800 border-purple-300 shadow-xs'
                            : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                        }`}
                      >
                        <Gift size={12} />
                        <span>Refer & Earn</span>
                        <span className="text-[10px]">{(navConf.showRefer ?? true) ? 'ON' : 'OFF'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateNav({ showShowroomBilling: !(navConf.showShowroomBilling ?? true) })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                          (navConf.showShowroomBilling ?? true)
                            ? 'bg-blue-50 text-blue-800 border-blue-300 shadow-xs'
                            : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                        }`}
                      >
                        <Receipt size={12} />
                        <span>Showroom Bills</span>
                        <span className="text-[10px]">{(navConf.showShowroomBilling ?? true) ? 'ON' : 'OFF'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateNav({ showWarrantyCheck: !(navConf.showWarrantyCheck ?? true) })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                          (navConf.showWarrantyCheck ?? true)
                            ? 'bg-purple-50 text-purple-800 border-purple-300 shadow-xs'
                            : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                        }`}
                      >
                        <ShieldCheck size={12} />
                        <span>Check Warranty</span>
                        <span className="text-[10px]">{(navConf.showWarrantyCheck ?? true) ? 'ON' : 'OFF'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateNav({ showTrackTicket: !(navConf.showTrackTicket ?? true) })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                          (navConf.showTrackTicket ?? true)
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                            : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                        }`}
                      >
                        <Search size={12} />
                        <span>Track Ticket</span>
                        <span className="text-[10px]">{(navConf.showTrackTicket ?? true) ? 'ON' : 'OFF'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateNav({ showSupportTicket: !Boolean(navConf.showSupportTicket) })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                          Boolean(navConf.showSupportTicket)
                            ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-xs'
                            : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                        }`}
                      >
                        <FileText size={12} />
                        <span>Support Ticket</span>
                        <span className="text-[10px]">{Boolean(navConf.showSupportTicket) ? 'ON' : 'OFF'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateNav({ showContactDropdown: !(navConf.showContactDropdown ?? true) })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                          (navConf.showContactDropdown ?? true)
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                            : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                        }`}
                      >
                        <Phone size={12} />
                        <span>Contact Dropdown</span>
                        <span className="text-[10px]">{(navConf.showContactDropdown ?? true) ? 'ON' : 'OFF'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateNav({ showAccount: !(navConf.showAccount ?? true) })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                          (navConf.showAccount ?? true)
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                            : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                        }`}
                      >
                        <User size={12} />
                        <span>Account CTA</span>
                        <span className="text-[10px]">{(navConf.showAccount ?? true) ? 'ON' : 'OFF'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 1-Click Presets for Adding More Options */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Add More Preset Options (1-Click)</label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const existing = customItems.find((i) => i.href === '/spare-parts' || i.label.toLowerCase().includes('spare'));
                          if (!existing) {
                            const newItem: ICustomNavItem = {
                              id: `nav-spares-${Date.now()}`,
                              label: 'EV Spare Parts',
                              href: '/contact',
                              itemType: 'pill',
                              icon: 'wrench',
                              badge: 'New',
                              badgeColor: '#059669',
                              bgColor: '#ecfdf5',
                              textColor: '#065f46',
                              borderColor: '#a7f3d0',
                              isVisible: true,
                              order: customItems.length + 1,
                              isExternal: false,
                            };
                            updateNav({ customNavItems: [...customItems, newItem] });
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Plus size={12} />
                        <span>+ Add EV Spares Option</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const existing = customItems.find((i) => i.label.toLowerCase().includes('dealership'));
                          if (!existing) {
                            const newItem: ICustomNavItem = {
                              id: `nav-dealer-${Date.now()}`,
                              label: 'Dealership Enquiry',
                              href: '/contact',
                              itemType: 'link',
                              icon: 'building',
                              isVisible: true,
                              order: customItems.length + 1,
                              isExternal: false,
                            };
                            updateNav({ customNavItems: [...customItems, newItem] });
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Plus size={12} />
                        <span>+ Add Dealership Option</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const existing = customItems.find((i) => i.label.toLowerCase().includes('battery care'));
                          if (!existing) {
                            const newItem: ICustomNavItem = {
                              id: `nav-guide-${Date.now()}`,
                              label: 'Battery Care Guide',
                              href: '/battery-care',
                              itemType: 'link',
                              icon: 'battery',
                              isVisible: true,
                              order: customItems.length + 1,
                              isExternal: false,
                            };
                            updateNav({ customNavItems: [...customItems, newItem] });
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Plus size={12} />
                        <span>+ Add Battery Guide Option</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const newItem: ICustomNavItem = {
                            id: `nav-${Date.now()}`,
                            label: `New Option ${customItems.length + 1}`,
                            href: '/',
                            itemType: 'link',
                            icon: 'sparkles',
                            isVisible: true,
                            order: customItems.length + 1,
                            isExternal: false,
                          };
                          updateNav({ customNavItems: [...customItems, newItem] });
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                      >
                        <Plus size={12} />
                        <span>+ Add Custom Option</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1: Home Link */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <Home size={16} className="text-emerald-600" />
                        <span className="font-bold text-xs text-slate-800">Home Link</span>
                      </div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={navConf.showHome ?? true}
                          onChange={(e) => updateNav({ showHome: e.target.checked })}
                          className="rounded text-green-600 h-4 w-4"
                        />
                        <span>Visible</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Label</label>
                        <input
                          type="text"
                          value={navConf.homeLabel || 'Home'}
                          onChange={(e) => updateNav({ homeLabel: e.target.value })}
                          className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-bold"
                          placeholder="Home"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Target Route</label>
                        <input
                          type="text"
                          value={navConf.homeHref || '/'}
                          onChange={(e) => updateNav({ homeHref: e.target.value })}
                          className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono"
                          placeholder="/"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">Icon</label>
                      <select
                        value={navConf.homeIcon || 'home'}
                        onChange={(e) => updateNav({ homeIcon: e.target.value })}
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                      >
                        <option value="home">Home Icon</option>
                        <option value="sparkles">Sparkles Icon</option>
                        <option value="battery">Battery Icon</option>
                        <option value="zap">Zap Icon</option>
                        <option value="shield">Shield Icon</option>
                      </select>
                    </div>
                  </div>

                  {/* Card 2: Wallet & Coins */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <Coins size={16} className="text-amber-600" />
                        <span className="font-bold text-xs text-slate-800">Wallet & Coins Option</span>
                      </div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={navConf.showWallet ?? true}
                          onChange={(e) => updateNav({ showWallet: e.target.checked })}
                          className="rounded text-green-600 h-4 w-4"
                        />
                        <span>Visible</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Label</label>
                        <input
                          type="text"
                          value={navConf.walletLabel || 'Wallet & Coins'}
                          onChange={(e) => updateNav({ walletLabel: e.target.value })}
                          className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-bold"
                          placeholder="Wallet & Coins"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Target Route</label>
                        <input
                          type="text"
                          value={navConf.walletHref || '/customer/wallet'}
                          onChange={(e) => updateNav({ walletHref: e.target.value })}
                          className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono"
                          placeholder="/customer/wallet"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Pill Bg</label>
                        <input
                          type="color"
                          value={navConf.walletBgColor || '#fef3c7'}
                          onChange={(e) => updateNav({ walletBgColor: e.target.value })}
                          className="w-full h-8 rounded border border-slate-300 p-0 cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Text Color</label>
                        <input
                          type="color"
                          value={navConf.walletTextColor || '#78350f'}
                          onChange={(e) => updateNav({ walletTextColor: e.target.value })}
                          className="w-full h-8 rounded border border-slate-300 p-0 cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Border Color</label>
                        <input
                          type="color"
                          value={navConf.walletBorderColor || '#fde68a'}
                          onChange={(e) => updateNav({ walletBorderColor: e.target.value })}
                          className="w-full h-8 rounded border border-slate-300 p-0 cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={navConf.showWalletBadge ?? true}
                          onChange={(e) => updateNav({ showWalletBadge: e.target.checked })}
                          className="rounded text-green-600 h-3.5 w-3.5"
                        />
                        <span>Show Live Balance Badge (Coins)</span>
                      </label>
                    </div>
                  </div>

                  {/* Card 3: Refer & Earn */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <Gift size={16} className="text-purple-600" />
                        <span className="font-bold text-xs text-slate-800">Refer & Earn Option</span>
                      </div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={navConf.showRefer ?? true}
                          onChange={(e) => updateNav({ showRefer: e.target.checked })}
                          className="rounded text-green-600 h-4 w-4"
                        />
                        <span>Visible</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Label</label>
                        <input
                          type="text"
                          value={navConf.referLabel || 'Refer & Earn'}
                          onChange={(e) => updateNav({ referLabel: e.target.value })}
                          className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-bold"
                          placeholder="Refer & Earn"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Bonus Amount (+Coins)</label>
                        <input
                          type="number"
                          value={navConf.referBonusAmount ?? 500}
                          onChange={(e) => updateNav({ referBonusAmount: Number(e.target.value) || 500 })}
                          className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-bold"
                          placeholder="500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Pill Bg</label>
                        <input
                          type="color"
                          value={navConf.referBgColor || '#faf5ff'}
                          onChange={(e) => updateNav({ referBgColor: e.target.value })}
                          className="w-full h-8 rounded border border-slate-300 p-0 cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Text Color</label>
                        <input
                          type="color"
                          value={navConf.referTextColor || '#581c87'}
                          onChange={(e) => updateNav({ referTextColor: e.target.value })}
                          className="w-full h-8 rounded border border-slate-300 p-0 cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Border Color</label>
                        <input
                          type="color"
                          value={navConf.referBorderColor || '#e9d5ff'}
                          onChange={(e) => updateNav({ referBorderColor: e.target.value })}
                          className="w-full h-8 rounded border border-slate-300 p-0 cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={navConf.showReferBonus ?? true}
                          onChange={(e) => updateNav({ showReferBonus: e.target.checked })}
                          className="rounded text-green-600 h-3.5 w-3.5"
                        />
                        <span>Append (+500) Bonus Text to Label</span>
                      </label>
                    </div>
                  </div>

                  {/* Card 4: Showroom Bills Option */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <Receipt size={16} className="text-blue-600" />
                        <span className="font-bold text-xs text-slate-800">Showroom Bills Option</span>
                      </div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={navConf.showShowroomBilling ?? true}
                          onChange={(e) => updateNav({ showShowroomBilling: e.target.checked })}
                          className="rounded text-green-600 h-4 w-4"
                        />
                        <span>Visible</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Label</label>
                        <input
                          type="text"
                          value={navConf.showroomBillingLabel || 'Showroom Bills'}
                          onChange={(e) => updateNav({ showroomBillingLabel: e.target.value })}
                          className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-bold"
                          placeholder="Showroom Bills"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Target Route</label>
                        <input
                          type="text"
                          value={navConf.showroomBillingHref || '/showroom-billing'}
                          onChange={(e) => updateNav({ showroomBillingHref: e.target.value })}
                          className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono"
                          placeholder="/showroom-billing"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">Icon</label>
                      <select
                        value={navConf.showroomBillingIcon || 'receipt'}
                        onChange={(e) => updateNav({ showroomBillingIcon: e.target.value })}
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                      >
                        <option value="receipt">Receipt / Bill Icon</option>
                        <option value="coins">Coins / Payment Icon</option>
                        <option value="file">File / Document Icon</option>
                        <option value="home">Home Icon</option>
                      </select>
                    </div>
                  </div>

                  {/* Card 5: Check Battery Warranty Option */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-purple-600" />
                        <span className="font-bold text-xs text-slate-800">Check Battery Warranty</span>
                      </div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={navConf.showWarrantyCheck ?? true}
                          onChange={(e) => updateNav({ showWarrantyCheck: e.target.checked })}
                          className="rounded text-green-600 h-4 w-4"
                        />
                        <span>Visible</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Label</label>
                        <input
                          type="text"
                          value={navConf.warrantyCheckLabel || 'Check Warranty'}
                          onChange={(e) => updateNav({ warrantyCheckLabel: e.target.value })}
                          className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-bold"
                          placeholder="Check Warranty"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Target Route</label>
                        <input
                          type="text"
                          value={navConf.warrantyCheckHref || '/warranty/check'}
                          onChange={(e) => updateNav({ warrantyCheckHref: e.target.value })}
                          className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono"
                          placeholder="/warranty/check"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">Icon</label>
                      <select
                        value={navConf.warrantyCheckIcon || 'shield'}
                        onChange={(e) => updateNav({ warrantyCheckIcon: e.target.value })}
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                      >
                        <option value="shield">Shield Check Icon</option>
                        <option value="battery">Battery Icon</option>
                        <option value="zap">Zap / Power Icon</option>
                        <option value="search">Search Icon</option>
                      </select>
                    </div>
                  </div>

                  {/* Card 6: Track Support Ticket Option */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <Search size={16} className="text-emerald-600" />
                        <span className="font-bold text-xs text-slate-800">Track Support Ticket</span>
                      </div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={navConf.showTrackTicket ?? true}
                          onChange={(e) => updateNav({ showTrackTicket: e.target.checked })}
                          className="rounded text-green-600 h-4 w-4"
                        />
                        <span>Visible</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Label</label>
                        <input
                          type="text"
                          value={navConf.trackTicketLabel || 'Track Ticket'}
                          onChange={(e) => updateNav({ trackTicketLabel: e.target.value })}
                          className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-bold"
                          placeholder="Track Ticket"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Target Route</label>
                        <input
                          type="text"
                          value={navConf.trackTicketHref || '/complaint/track'}
                          onChange={(e) => updateNav({ trackTicketHref: e.target.value })}
                          className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono"
                          placeholder="/complaint/track"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">Icon</label>
                      <select
                        value={navConf.trackTicketIcon || 'search'}
                        onChange={(e) => updateNav({ trackTicketIcon: e.target.value })}
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                      >
                        <option value="search">Search Magnifier Icon</option>
                        <option value="file">File / Ticket Icon</option>
                        <option value="help">Help / Query Icon</option>
                        <option value="sparkles">Sparkles Icon</option>
                      </select>
                    </div>
                  </div>

                  {/* Card 7: Support / Complaint Ticket Option */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-amber-600" />
                        <span className="font-bold text-xs text-slate-800">Support / Complaint Ticket</span>
                      </div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(navConf.showSupportTicket)}
                          onChange={(e) => updateNav({ showSupportTicket: e.target.checked })}
                          className="rounded text-green-600 h-4 w-4"
                        />
                        <span>Visible</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Label</label>
                        <input
                          type="text"
                          value={navConf.supportTicketLabel || 'Support Ticket'}
                          onChange={(e) => updateNav({ supportTicketLabel: e.target.value })}
                          className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-bold"
                          placeholder="Support Ticket"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Target Route</label>
                        <input
                          type="text"
                          value={navConf.supportTicketHref || '/complaint/register'}
                          onChange={(e) => updateNav({ supportTicketHref: e.target.value })}
                          className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono"
                          placeholder="/complaint/register"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">Icon</label>
                      <select
                        value={navConf.supportTicketIcon || 'file'}
                        onChange={(e) => updateNav({ supportTicketIcon: e.target.value })}
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                      >
                        <option value="file">File / Ticket Icon</option>
                        <option value="phone">Phone Helpline</option>
                        <option value="message">Message Icon</option>
                        <option value="shield">Shield Icon</option>
                      </select>
                    </div>
                  </div>

                  {/* Card 8: Contact & Helpline Dropdown */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-emerald-600" />
                        <span className="font-bold text-xs text-slate-800">Contact & Helpline Dropdown</span>
                      </div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={navConf.showContactDropdown ?? true}
                          onChange={(e) => updateNav({ showContactDropdown: e.target.checked })}
                          className="rounded text-green-600 h-4 w-4"
                        />
                        <span>Visible</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Dropdown Button Label</label>
                        <input
                          type="text"
                          value={navConf.contactLabel || 'Contact & Helpline'}
                          onChange={(e) => updateNav({ contactLabel: e.target.value })}
                          className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-bold"
                          placeholder="Contact & Helpline"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Icon</label>
                        <select
                          value={navConf.contactIcon || 'phone'}
                          onChange={(e) => updateNav({ contactIcon: e.target.value })}
                          className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                        >
                          <option value="phone">Phone Helpline</option>
                          <option value="message">Chat / Message</option>
                          <option value="help">Help Circle</option>
                          <option value="info">Info Icon</option>
                        </select>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-50 text-[11px] text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                      <span>
                        Dropdown automatically links to Helpline Call, WhatsApp Support, Email, Plant Maps, and all active Concern Divisions.
                      </span>
                    </div>
                  </div>

                  {/* Card 9: Account / Login CTA */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs md:col-span-2">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-emerald-600" />
                        <span className="font-bold text-xs text-slate-800">Account / Login CTA Button</span>
                      </div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={navConf.showAccount ?? true}
                          onChange={(e) => updateNav({ showAccount: e.target.checked })}
                          className="rounded text-green-600 h-4 w-4"
                        />
                        <span>Visible</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Button Label</label>
                        <input
                          type="text"
                          value={navConf.accountLabel || 'Account / Login'}
                          onChange={(e) => updateNav({ accountLabel: e.target.value })}
                          className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-bold"
                          placeholder="Account / Login"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Target Route</label>
                        <input
                          type="text"
                          value={navConf.accountHref || '/customer/login'}
                          onChange={(e) => updateNav({ accountHref: e.target.value })}
                          className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono"
                          placeholder="/customer/login"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Button Background</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={navConf.accountBtnBg || '#059669'}
                            onChange={(e) => updateNav({ accountBtnBg: e.target.value })}
                            className="w-8 h-8 rounded border border-slate-300 p-0 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={navConf.accountBtnBg || '#059669'}
                            onChange={(e) => updateNav({ accountBtnBg: e.target.value })}
                            className="flex-1 border border-slate-300 rounded px-2 py-1.5 text-xs font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Button Text Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={navConf.accountBtnText || '#ffffff'}
                            onChange={(e) => updateNav({ accountBtnText: e.target.value })}
                            className="w-8 h-8 rounded border border-slate-300 p-0 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={navConf.accountBtnText || '#ffffff'}
                            onChange={(e) => updateNav({ accountBtnText: e.target.value })}
                            className="flex-1 border border-slate-300 rounded px-2 py-1.5 text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: CUSTOM NAVIGATION MENU ITEMS BUILDER */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <List size={14} className="text-purple-600" />
                      <span>Custom Navigation Items Manager ({customItems.length} Items)</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Add new navigation items as regular links, highlight pills, or CTA buttons with badges, icons, and custom styling.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const newItem: ICustomNavItem = {
                          id: `nav-${Date.now()}`,
                          label: `Custom Item ${customItems.length + 1}`,
                          href: '/',
                          itemType: 'link',
                          icon: 'sparkles',
                          isVisible: true,
                          order: customItems.length + 1,
                          isExternal: false,
                        };
                        updateNav({ customNavItems: [...customItems, newItem] });
                      }}
                      className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      <Plus size={14} />
                      <span>Add Navigation Item</span>
                    </button>
                    <SectionSaveButton label="Save Items" compact />
                  </div>
                </div>

                <div className="space-y-3">
                  {customItems.map((navItem, idx) => {
                    const itemType = navItem.itemType || 'link';
                    return (
                      <div key={navItem.id || idx} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
                        {/* Top row */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-3">
                          <div className="flex items-center gap-2.5 flex-1 w-full sm:w-auto">
                            <span className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 font-black text-xs flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <input
                              type="text"
                              value={navItem.label}
                              onChange={(e) => {
                                const next = [...customItems];
                                next[idx] = { ...next[idx], label: e.target.value };
                                updateNav({ customNavItems: next });
                              }}
                              placeholder="Navigation Label"
                              className="font-bold text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 w-48 focus:border-purple-500"
                            />
                            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200">
                              {(['link', 'pill', 'button'] as const).map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => {
                                    const next = [...customItems];
                                    next[idx] = { ...next[idx], itemType: st };
                                    updateNav({ customNavItems: next });
                                  }}
                                  className={`px-2.5 py-0.5 rounded text-[11px] font-bold capitalize transition cursor-pointer ${
                                    itemType === st
                                      ? 'bg-purple-600 text-white shadow-xs'
                                      : 'text-slate-600 hover:text-slate-900'
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0">
                            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={navItem.isVisible !== false}
                                onChange={(e) => {
                                  const next = [...customItems];
                                  next[idx] = { ...next[idx], isVisible: e.target.checked };
                                  updateNav({ customNavItems: next });
                                }}
                                className="rounded text-purple-600 h-4 w-4"
                              />
                              <span>Visible</span>
                            </label>

                            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={navItem.isExternal || false}
                                onChange={(e) => {
                                  const next = [...customItems];
                                  next[idx] = { ...next[idx], isExternal: e.target.checked };
                                  updateNav({ customNavItems: next });
                                }}
                                className="rounded text-purple-600 h-4 w-4"
                              />
                              <span>External Tab</span>
                            </label>

                            {/* Move Up/Down */}
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                const next = [...customItems];
                                const temp = next[idx];
                                next[idx] = next[idx - 1];
                                next[idx - 1] = temp;
                                updateNav({ customNavItems: next });
                              }}
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg disabled:opacity-20 cursor-pointer"
                              title="Move Up"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              disabled={idx === customItems.length - 1}
                              onClick={() => {
                                const next = [...customItems];
                                const temp = next[idx];
                                next[idx] = next[idx + 1];
                                next[idx + 1] = temp;
                                updateNav({ customNavItems: next });
                              }}
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg disabled:opacity-20 cursor-pointer"
                              title="Move Down"
                            >
                              <ArrowDown size={14} />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const next = [...customItems];
                                next.splice(idx, 1);
                                updateNav({ customNavItems: next });
                              }}
                              className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Controls Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-1">Route / Link URL</label>
                            <input
                              type="text"
                              value={navItem.href}
                              onChange={(e) => {
                                const next = [...customItems];
                                next[idx] = { ...next[idx], href: e.target.value };
                                updateNav({ customNavItems: next });
                              }}
                              placeholder="/path or https://..."
                              className="w-full text-xs font-mono border border-slate-300 rounded-lg px-2.5 py-1.5"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-1">Item Icon</label>
                            <select
                              value={navItem.icon || ''}
                              onChange={(e) => {
                                const next = [...customItems];
                                next[idx] = { ...next[idx], icon: e.target.value };
                                updateNav({ customNavItems: next });
                              }}
                              className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                            >
                              <option value="">No Icon</option>
                              <option value="home">Home</option>
                              <option value="sparkles">Sparkles</option>
                              <option value="coins">Coins / Wallet</option>
                              <option value="gift">Gift / Bonus</option>
                              <option value="phone">Phone</option>
                              <option value="user">User</option>
                              <option value="battery">Battery</option>
                              <option value="zap">Zap Power</option>
                              <option value="shield">Shield Warranty</option>
                              <option value="file">File / Ticket</option>
                              <option value="search">Search</option>
                              <option value="help">Help / FAQ</option>
                              <option value="wrench">Wrench Service</option>
                              <option value="tag">Tag Offer</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-1">Badge Text (Optional)</label>
                            <input
                              type="text"
                              value={navItem.badge || ''}
                              onChange={(e) => {
                                const next = [...customItems];
                                next[idx] = { ...next[idx], badge: e.target.value };
                                updateNav({ customNavItems: next });
                              }}
                              placeholder="e.g. NEW, HOT, 500"
                              className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-1">Badge Color</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={navItem.badgeColor || '#ef4444'}
                                onChange={(e) => {
                                  const next = [...customItems];
                                  next[idx] = { ...next[idx], badgeColor: e.target.value };
                                  updateNav({ customNavItems: next });
                                }}
                                className="w-8 h-8 rounded border border-slate-300 p-0 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={navItem.badgeColor || '#ef4444'}
                                onChange={(e) => {
                                  const next = [...customItems];
                                  next[idx] = { ...next[idx], badgeColor: e.target.value };
                                  updateNav({ customNavItems: next });
                                }}
                                className="flex-1 border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-mono"
                                placeholder="#ef4444"
                              />
                            </div>
                          </div>

                          {/* Extra styling if pill or button */}
                          {(itemType === 'pill' || itemType === 'button') && (
                            <>
                              <div>
                                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Background Color</label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={navItem.bgColor || (itemType === 'button' ? '#059669' : '#f1f5f9')}
                                    onChange={(e) => {
                                      const next = [...customItems];
                                      next[idx] = { ...next[idx], bgColor: e.target.value };
                                      updateNav({ customNavItems: next });
                                    }}
                                    className="w-8 h-8 rounded border border-slate-300 p-0 cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={navItem.bgColor || (itemType === 'button' ? '#059669' : '#f1f5f9')}
                                    onChange={(e) => {
                                      const next = [...customItems];
                                      next[idx] = { ...next[idx], bgColor: e.target.value };
                                      updateNav({ customNavItems: next });
                                    }}
                                    className="flex-1 border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-mono"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Text Color</label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={navItem.textColor || (itemType === 'button' ? '#ffffff' : '#0f172a')}
                                    onChange={(e) => {
                                      const next = [...customItems];
                                      next[idx] = { ...next[idx], textColor: e.target.value };
                                      updateNav({ customNavItems: next });
                                    }}
                                    className="w-8 h-8 rounded border border-slate-300 p-0 cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={navItem.textColor || (itemType === 'button' ? '#ffffff' : '#0f172a')}
                                    onChange={(e) => {
                                      const next = [...customItems];
                                      next[idx] = { ...next[idx], textColor: e.target.value };
                                      updateNav({ customNavItems: next });
                                    }}
                                    className="flex-1 border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-mono"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Border Color</label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={navItem.borderColor || '#cbd5e1'}
                                    onChange={(e) => {
                                      const next = [...customItems];
                                      next[idx] = { ...next[idx], borderColor: e.target.value };
                                      updateNav({ customNavItems: next });
                                    }}
                                    className="w-8 h-8 rounded border border-slate-300 p-0 cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={navItem.borderColor || '#cbd5e1'}
                                    onChange={(e) => {
                                      const next = [...customItems];
                                      next[idx] = { ...next[idx], borderColor: e.target.value };
                                      updateNav({ customNavItems: next });
                                    }}
                                    className="flex-1 border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-mono"
                                  />
                                </div>
                              </div>

                              <div className="flex items-end">
                                <div className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                                  <span className="text-[10px] text-slate-500 font-semibold">Live Item Preview:</span>
                                  <span
                                    style={{
                                      backgroundColor: navItem.bgColor || (itemType === 'button' ? '#059669' : '#f1f5f9'),
                                      color: navItem.textColor || (itemType === 'button' ? '#ffffff' : '#0f172a'),
                                      borderColor: navItem.borderColor || '#cbd5e1',
                                    }}
                                    className="px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center gap-1 shadow-xs"
                                  >
                                    {renderPreviewIcon(navItem.icon, null, 12)}
                                    <span>{navItem.label}</span>
                                    {navItem.badge && (
                                      <span
                                        style={{ backgroundColor: navItem.badgeColor || '#ef4444' }}
                                        className="text-[9px] text-white px-1 py-0.2 rounded font-black"
                                      >
                                        {navItem.badge}
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SAVE BAR */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-lg">
                <div>
                  <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-400" />
                    <span>Publish Navigation Bar Configuration</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Saving updates top bar strip, brand headers, core navbar items, and all custom navigation links across desktop & mobile.
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition shadow-md disabled:opacity-50"
                  >
                    <Save size={16} />
                    <span>{saving ? 'Saving...' : 'Save Navigation Settings'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Floating Quick Save Button (Always Accessible while scrolling) */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-2xl text-xs font-bold transition shadow-2xl border-2 border-white/90 hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
          title="Save all content changes"
        >
          <Save size={16} />
          <span>{saving ? 'Saving Changes...' : 'Save All Changes'}</span>
        </button>
      </div>

      {/* Fixed Floating Notification Toast (Visible from anywhere on the page) */}
      {notification && (
        <div
          className={`fixed bottom-20 right-6 z-50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 border text-sm max-w-md transition-all ${
            notification.type === 'success'
              ? 'bg-green-600 text-white border-green-500'
              : 'bg-red-600 text-white border-red-500'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle size={20} className="shrink-0" /> : <AlertCircle size={20} className="shrink-0" />}
          <span className="font-semibold text-xs leading-snug">{notification.message}</span>
        </div>
      )}
    </div>
  );
};

export default ContentManager;
