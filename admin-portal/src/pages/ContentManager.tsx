import { useState, useEffect } from 'react';
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
  badgeText: string;
  heading: string;
  subheading: string;
  highlight1: string;
  highlight2: string;
  helplinePhone: string;
  helplineBtnText: string;
  plantBtnText: string;
  plantBtnLink: string;
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

export interface IHeaderNavConfig {
  brandTitle?: string;
  brandSubtitle?: string;
  logoType?: 'preset' | 'image';
  logoImage?: string;
  homeLabel?: string;
  showHome?: boolean;
  walletLabel?: string;
  showWallet?: boolean;
  showWalletBadge?: boolean;
  referLabel?: string;
  showRefer?: boolean;
  accountLabel?: string;
  showAccount?: boolean;
  accountBtnBg?: string;
  accountBtnText?: string;
  navBgColor?: string;
  navBorderColor?: string;
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
  };
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
    homeLabel: 'Home',
    showHome: true,
    walletLabel: 'Wallet & Coins',
    showWallet: true,
    showWalletBadge: true,
    referLabel: 'Refer & Earn',
    showRefer: true,
    accountLabel: 'Account / Login',
    showAccount: true,
    accountBtnBg: '#059669',
    accountBtnText: '#ffffff',
    navBgColor: '#ffffff',
    navBorderColor: '#e2e8f0',
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
    email: 'support@ekosmartdrive.in',
    website: 'www.ekosmartdrive.in',
    gstin: '08DTUPM4205B1Z0',
    officeHours: '10:00 AM - 6:30 PM (Mon - Sat)',
    showPrivacyPolicy: true,
    showTermsConditions: true,
    showRefundPolicy: true,
    logoType: 'preset',
    logoImage: '',
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
    supportEmail: 'support@ekosmartdrive.in',
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
  },
  customerLoginTimer: {
    enabled: true,
    durationSeconds: 20,
    title: 'Login to Continue',
    message: 'Please login with your email to access your customer account, wallet, referrals, bills and personalized services.',
  },
  batteryBanner: {
    badgeText: 'GET HIGH POWER OF LITHIUM',
    heading: 'Genuine Li-ion & LFP Batteries For E-Scooter & E-Rickshaw',
    subheading:
      'Engineered with advanced Smart BMS, thermal protection, and high energy density cells. Tested at our Kota plant with Pan-India dispatch & replacement support.',
    highlight1: '48V Series (3 Year Warranty)',
    highlight2: '60V / 72V Series (1.5 Year Warranty)',
    helplinePhone: '8949049003',
    helplineBtnText: 'Call +91 8949049003',
    plantBtnText: 'View Plant Contact Details',
    plantBtnLink: '/contact',
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
  const [activeTab, setActiveTab] = useState<
    'cards' | 'hero' | 'rewards' | 'banner' | 'policies' | 'footer' | 'contact' | 'loginTimer'
  >('cards');
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

  const getDivisionContact = (optName: string): IDivisionContact => {
    const existing = (content.contactInfo?.divisionContacts || []).find(
      (c) => c.name.trim().toLowerCase() === optName.trim().toLowerCase()
    );
    if (existing) return existing;
    return {
      name: optName,
      phone: content.contactInfo?.helplinePhone || '+91 8949049003',
      email: content.contactInfo?.supportEmail || 'support@ekosmartdrive.in',
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
          onClick={() => setActiveTab('cards')}
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
          onClick={() => setActiveTab('hero')}
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
          onClick={() => setActiveTab('rewards')}
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
          onClick={() => setActiveTab('banner')}
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
          onClick={() => setActiveTab('policies')}
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
          onClick={() => setActiveTab('footer')}
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
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'contact'
              ? 'border-green-600 text-green-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Phone size={18} />
          <span>Contact & Dropdowns</span>
        </button>

        <button
          onClick={() => setActiveTab('loginTimer')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'loginTimer'
              ? 'border-green-600 text-green-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock size={18} />
          <span>Customer Login Timer ({content.customerLoginTimer?.durationSeconds || 20}s)</span>
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
              <span className="font-bold text-slate-800 text-xs block">Navbar Navigation Links & Account Button</span>
              
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
            <label className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              <span>Top Pill Badge, Heading & Welcome Subheading</span>
            </label>

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
            <div>
              <label className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Zap size={16} className="text-yellow-500" />
                <span>3 Feature Highlight Badges (Under Subheading)</span>
              </label>
              <p className="text-[11px] text-slate-500">
                Customize the icon, label, accent color, and visibility for each of the 3 highlights.
              </p>
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
            <div>
              <label className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                <span>Hero Call-to-Action (CTA) Action Buttons</span>
              </label>
              <p className="text-[11px] text-slate-500">
                Configure labels, URLs, window target, background colors, text colors, and visibility switches.
              </p>
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
            <label className="block font-bold text-slate-800 text-sm flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-600" />
              <span>Real-Time Live Header & Hero Banner Preview</span>
            </label>

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
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer self-start sm:self-auto bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200">
                <input
                  type="checkbox"
                  checked={referralSettings.enabled ?? true}
                  onChange={(e) => setReferralSettings({ ...referralSettings, enabled: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
                />
                <span className="font-bold text-amber-900">Enable Rewards & Referral System</span>
              </label>
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
          {/* Section 1: Dark Plant Battery Assistance Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Battery className="text-teal-600" size={20} />
                <span>EBS Factory Battery Assistance Banner</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Soft-code the dark Kota plant engineering support banner located at the bottom of the public homepage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Badge Tagline</label>
                <input
                  type="text"
                  value={content.batteryBanner?.badgeText || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      batteryBanner: {
                        ...(content.batteryBanner || defaultFallbackContent.batteryBanner!),
                        badgeText: e.target.value,
                      },
                    })
                  }
                  placeholder="GET HIGH POWER OF LITHIUM"
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Helpline Phone Number</label>
                <input
                  type="text"
                  value={content.batteryBanner?.helplinePhone || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      batteryBanner: {
                        ...(content.batteryBanner || defaultFallbackContent.batteryBanner!),
                        helplinePhone: e.target.value,
                      },
                    })
                  }
                  placeholder="8949049003"
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Banner Main Heading</label>
                <input
                  type="text"
                  value={content.batteryBanner?.heading || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      batteryBanner: {
                        ...(content.batteryBanner || defaultFallbackContent.batteryBanner!),
                        heading: e.target.value,
                      },
                    })
                  }
                  placeholder="Genuine Li-ion & LFP Batteries For E-Scooter & E-Rickshaw"
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-bold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Subheading Description</label>
                <textarea
                  rows={2}
                  value={content.batteryBanner?.subheading || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      batteryBanner: {
                        ...(content.batteryBanner || defaultFallbackContent.batteryBanner!),
                        subheading: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Technical Highlight 1</label>
                <input
                  type="text"
                  value={content.batteryBanner?.highlight1 || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      batteryBanner: {
                        ...(content.batteryBanner || defaultFallbackContent.batteryBanner!),
                        highlight1: e.target.value,
                      },
                    })
                  }
                  placeholder="48V Series (3 Year Warranty)"
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Technical Highlight 2</label>
                <input
                  type="text"
                  value={content.batteryBanner?.highlight2 || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      batteryBanner: {
                        ...(content.batteryBanner || defaultFallbackContent.batteryBanner!),
                        highlight2: e.target.value,
                      },
                    })
                  }
                  placeholder="60V / 72V Series (1.5 Year Warranty)"
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Helpline Button Label</label>
                <input
                  type="text"
                  value={content.batteryBanner?.helplineBtnText || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      batteryBanner: {
                        ...(content.batteryBanner || defaultFallbackContent.batteryBanner!),
                        helplineBtnText: e.target.value,
                      },
                    })
                  }
                  placeholder="Call +91 8949049003"
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Plant Details Button Label & Link</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={content.batteryBanner?.plantBtnText || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        batteryBanner: {
                          ...(content.batteryBanner || defaultFallbackContent.batteryBanner!),
                          plantBtnText: e.target.value,
                        },
                      })
                    }
                    placeholder="View Plant Contact Details"
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                  <input
                    type="text"
                    value={content.batteryBanner?.plantBtnLink || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        batteryBanner: {
                          ...(content.batteryBanner || defaultFallbackContent.batteryBanner!),
                          plantBtnLink: e.target.value,
                        },
                      })
                    }
                    placeholder="/contact"
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Live Visual Preview */}
            <div className="pt-2">
              <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Eye size={14} className="text-teal-600" />
                <span>Live Battery Assistance Banner Preview</span>
              </span>
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 max-w-lg">
                  {content.batteryBanner?.badgeText && (
                    <div className="inline-block bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      {content.batteryBanner.badgeText}
                    </div>
                  )}
                  <h3 className="text-xl md:text-2xl font-extrabold leading-tight">
                    {content.batteryBanner?.heading || 'Genuine Li-ion & LFP Batteries For E-Scooter & E-Rickshaw'}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {content.batteryBanner?.subheading ||
                      'Engineered with advanced Smart BMS, thermal protection, and high energy density cells. Tested at our Kota plant.'}
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-300 pt-1">
                    {content.batteryBanner?.highlight1 && (
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 size={14} />
                        <span>{content.batteryBanner.highlight1}</span>
                      </span>
                    )}
                    {content.batteryBanner?.highlight2 && (
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 size={14} />
                        <span>{content.batteryBanner.highlight2}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 text-center space-y-2.5 flex-shrink-0 w-full md:w-64">
                  <div className="w-10 h-10 bg-emerald-900 rounded-xl flex items-center justify-center text-white font-bold text-xs mx-auto">
                    EBS
                  </div>
                  <h4 className="font-bold text-xs text-white">Need Battery Assistance?</h4>
                  <p className="text-[10px] text-slate-400">Contact our factory technical engineers in Kota, Rajasthan</p>
                  <div className="space-y-1.5 pt-1">
                    <div className="w-full py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs text-center shadow">
                      {content.batteryBanner?.helplineBtnText || 'Call +91 8949049003'}
                    </div>
                    <div className="w-full py-1.5 bg-white/10 text-slate-200 font-semibold rounded-xl text-xs text-center border border-white/20">
                      {content.batteryBanner?.plantBtnText || 'View Plant Contact Details'}
                    </div>
                  </div>
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
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800">Terms & Conditions</h3>
                <p className="text-xs text-slate-500">Rendered at /terms-conditions on the public portal.</p>
              </div>
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
        </div>
      )}

      {/* TAB 4: FOOTER & BRANDING */}
      {activeTab === 'footer' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <div>
            <h2 className="text-base font-bold text-slate-800">Global Footer & Branding</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Control the company logo branding, name, copyright line, disclaimer, and policy link visibility in the public footer.
            </p>
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
                value={content.footer.email || 'support@ekosmartdrive.in'}
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
          </div>
        </div>
      )}

      {/* TAB 5: CONTACT US & DROPDOWN MENU */}
      {activeTab === 'contact' && (
        <div className="space-y-6">
          {/* Section 1: Dynamic Concern Division Dropdown Options */}
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
                      <div className="flex items-center justify-between sm:justify-end gap-1.5 shrink-0 pl-8 sm:pl-0">
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

          {/* Section 2: Contact Page Content & Headings */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="text-green-600" size={20} />
                Contact Us Header & Banner Content
              </h3>
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

          {/* Section 3: Official Communication Channels & Address */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Phone className="text-green-600" size={20} />
              Official Support Details & Coordinates
            </h3>

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
    </div>
  );
};

export default ContentManager;
