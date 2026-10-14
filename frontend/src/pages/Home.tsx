import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  ShieldCheck,
  ShieldAlert,
  Truck,
  Wrench,
  Phone,
  Settings,
  HelpCircle,
  Activity,
  Zap,
  Battery,
  Package,
  Store,
  Bike,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Coins,
  Gift,
  Clock,
  MapPin,
  Headphones,
  LifeBuoy,
  AlertTriangle,
  Mail,
} from 'lucide-react';
import { EbsLogo } from '../components/EbsLogo';
import { API_BASE, resolveImageUrl } from '../config/api';

interface ServiceCard {
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

interface QuickActionItem {
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
  isVisible?: boolean;
  order?: number;
  target?: '_self' | '_blank';
  showExternalIcon?: boolean;
  badge?: string;
  badgeColor?: string;
}

interface QuickActionsConfig {
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

interface BatteryBannerContent {
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

interface HeroContent {
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
}

const defaultHero: HeroContent = {
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
};

const defaultBatteryBanner: BatteryBannerContent = {
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
};

const defaultQuickActionsConfig: QuickActionsConfig = {
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
};

const defaultQuickActions: QuickActionItem[] = [
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
];

const defaultCards: ServiceCard[] = [
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
];

// Helper icon mapper for division cards
const renderDivisionIcon = (iconName: string, iconColorClass: string) => {
  const iconProps = { className: `h-8 w-8 ${iconColorClass}` };
  switch (iconName?.toLowerCase()) {
    case 'store':
    case 'showroom':
    case 'building':
      return <Store {...iconProps} />;
    case 'bike':
    case 'motorcycle':
    case 'scooter':
      return <Bike {...iconProps} />;
    case 'settings':
    case 'gears':
    case 'cog':
      return <Settings {...iconProps} />;
    case 'wrench':
    case 'tool':
      return <Wrench {...iconProps} />;
    case 'battery':
      return <Battery {...iconProps} />;
    case 'truck':
      return <Truck {...iconProps} />;
    case 'search':
      return <Search {...iconProps} />;
    case 'shieldcheck':
    case 'shield-check':
      return <ShieldCheck {...iconProps} />;
    case 'shieldalert':
    case 'shield-alert':
      return <ShieldAlert {...iconProps} />;
    case 'zap':
      return <Zap {...iconProps} />;
    case 'package':
      return <Package {...iconProps} />;
    case 'activity':
      return <Activity {...iconProps} />;
    case 'phone':
      return <Phone {...iconProps} />;
    case 'help':
    case 'helpcircle':
      return <HelpCircle {...iconProps} />;
    case 'filetext':
    default:
      return <FileText {...iconProps} />;
  }
};

const renderCardIcon = (card: ServiceCard, iconColorClass: string) => {
  if (card.iconType === 'image' && card.iconImage) {
    return (
      <img
        src={resolveImageUrl(card.iconImage)}
        alt={card.title}
        className="w-10 h-10 object-contain mx-auto"
      />
    );
  }
  if (card.icon && (card.icon.startsWith('data:image') || card.icon.startsWith('http') || card.icon.startsWith('/') || card.icon.startsWith('uploads/'))) {
    return (
      <img
        src={resolveImageUrl(card.icon)}
        alt={card.title}
        className="w-10 h-10 object-contain mx-auto"
      />
    );
  }
  return renderDivisionIcon(card.icon, iconColorClass);
};


const getDivisionCardStyles = (color: string) => {
  switch (color?.toLowerCase()) {
    case 'emerald':
    case 'green':
      return {
        cardBg: 'bg-[#16a34a]',
        iconColor: 'text-[#16a34a]',
        btnText: 'text-[#15803d] hover:bg-emerald-50',
        shadow: 'shadow-emerald-600/25',
        badgeBg: 'bg-emerald-950/40 text-emerald-200 border-emerald-300/30',
      };
    case 'blue':
      return {
        cardBg: 'bg-[#2563eb]',
        iconColor: 'text-[#2563eb]',
        btnText: 'text-[#1d4ed8] hover:bg-blue-50',
        shadow: 'shadow-blue-600/25',
        badgeBg: 'bg-blue-950/40 text-blue-200 border-blue-300/30',
      };
    case 'purple':
    case 'violet':
      return {
        cardBg: 'bg-[#7c3aed]',
        iconColor: 'text-[#7c3aed]',
        btnText: 'text-[#6d28d9] hover:bg-purple-50',
        shadow: 'shadow-purple-600/25',
        badgeBg: 'bg-purple-950/40 text-purple-200 border-purple-300/30',
      };
    case 'amber':
    case 'orange':
      return {
        cardBg: 'bg-[#d97706]',
        iconColor: 'text-[#d97706]',
        btnText: 'text-[#b45309] hover:bg-amber-50',
        shadow: 'shadow-amber-600/25',
        badgeBg: 'bg-amber-950/40 text-amber-200 border-amber-300/30',
      };
    case 'indigo':
      return {
        cardBg: 'bg-[#4f46e5]',
        iconColor: 'text-[#4f46e5]',
        btnText: 'text-[#4338ca] hover:bg-indigo-50',
        shadow: 'shadow-indigo-600/25',
        badgeBg: 'bg-indigo-950/40 text-indigo-200 border-indigo-300/30',
      };
    case 'rose':
    case 'red':
      return {
        cardBg: 'bg-[#e11d48]',
        iconColor: 'text-[#e11d48]',
        btnText: 'text-[#be123c] hover:bg-rose-50',
        shadow: 'shadow-rose-600/25',
        badgeBg: 'bg-rose-950/40 text-rose-200 border-rose-300/30',
      };
    case 'cyan':
      return {
        cardBg: 'bg-[#0891b2]',
        iconColor: 'text-[#0891b2]',
        btnText: 'text-[#0e7490] hover:bg-cyan-50',
        shadow: 'shadow-cyan-600/25',
        badgeBg: 'bg-cyan-950/40 text-cyan-200 border-cyan-300/30',
      };
    case 'slate':
      return {
        cardBg: 'bg-[#334155]',
        iconColor: 'text-[#334155]',
        btnText: 'text-[#1e293b] hover:bg-slate-100',
        shadow: 'shadow-slate-600/25',
        badgeBg: 'bg-slate-950/40 text-slate-200 border-slate-300/30',
      };
    case 'teal':
    default:
      return {
        cardBg: 'bg-[#0f766e]',
        iconColor: 'text-[#0f766e]',
        btnText: 'text-[#115e59] hover:bg-teal-50',
        shadow: 'shadow-teal-600/25',
        badgeBg: 'bg-teal-950/40 text-teal-200 border-teal-300/30',
      };
  }
};

const renderQuickActionIcon = (action: QuickActionItem) => {
  if (action.iconType === 'image' && action.iconImage) {
    return (
      <img
        src={resolveImageUrl(action.iconImage)}
        alt={action.title}
        className="w-6 h-6 object-contain"
      />
    );
  }
  const iconName = action.icon;
  if (iconName && (iconName.startsWith('data:image') || iconName.startsWith('http') || iconName.startsWith('/') || iconName.startsWith('uploads/'))) {
    return (
      <img
        src={resolveImageUrl(iconName)}
        alt={action.title}
        className="w-6 h-6 object-contain"
      />
    );
  }
  const iconProps = { size: 22 };
  switch (iconName?.toLowerCase()) {
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
    case 'service':
      return <Wrench {...iconProps} />;
    case 'clock':
    case 'time':
      return <Clock {...iconProps} />;
    case 'mappin':
    case 'map-pin':
    case 'map':
    case 'location':
      return <MapPin {...iconProps} />;
    case 'headphones':
    case 'headset':
    case 'support':
      return <Headphones {...iconProps} />;
    case 'lifebuoy':
    case 'helpdesk':
      return <LifeBuoy {...iconProps} />;
    case 'alerttriangle':
    case 'alert-triangle':
    case 'warning':
      return <AlertTriangle {...iconProps} />;
    case 'mail':
    case 'email':
      return <Mail {...iconProps} />;
    case 'sparkles':
      return <Sparkles {...iconProps} />;
    case 'check':
    case 'checkcircle':
    case 'check-circle':
      return <CheckCircle2 {...iconProps} />;
    case 'coins':
      return <Coins {...iconProps} />;
    case 'gift':
      return <Gift {...iconProps} />;
    case 'zap':
      return <Zap {...iconProps} />;
    case 'battery':
      return <Battery {...iconProps} />;
    case 'package':
      return <Package {...iconProps} />;
    case 'settings':
      return <Settings {...iconProps} />;
    case 'activity':
      return <Activity {...iconProps} />;
    case 'help':
    case 'helpcircle':
      return <HelpCircle {...iconProps} />;
    default:
      return <FileText {...iconProps} />;
  }
};

const getQuickActionColorStyles = (color: string, customBg?: string, customColor?: string) => {
  if (customBg || customColor) {
    return {
      bg: '',
      text: '',
      customStyle: {
        backgroundColor: customBg || 'rgba(59, 130, 246, 0.1)',
        color: customColor || '#2563eb',
      },
      customTextHoverColor: customColor,
    };
  }
  switch (color?.toLowerCase()) {
    case 'amber':
    case 'orange':
      return {
        bg: 'bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white',
        text: 'group-hover:text-amber-600',
      };
    case 'emerald':
    case 'green':
      return {
        bg: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
        text: 'group-hover:text-emerald-600',
      };
    case 'purple':
    case 'violet':
      return {
        bg: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
        text: 'group-hover:text-purple-600',
      };
    case 'indigo':
      return {
        bg: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
        text: 'group-hover:text-indigo-600',
      };
    case 'rose':
    case 'red':
      return {
        bg: 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white',
        text: 'group-hover:text-rose-600',
      };
    case 'cyan':
      return {
        bg: 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white',
        text: 'group-hover:text-cyan-600',
      };
    case 'teal':
      return {
        bg: 'bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white',
        text: 'group-hover:text-teal-600',
      };
    case 'slate':
    case 'dark':
      return {
        bg: 'bg-slate-100 text-slate-700 group-hover:bg-slate-800 group-hover:text-white',
        text: 'group-hover:text-slate-900',
      };
    case 'blue':
    default:
      return {
        bg: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
        text: 'group-hover:text-blue-600',
      };
  }
};

const Home = () => {
  const [hero, setHero] = useState<HeroContent>(defaultHero);
  const [cards, setCards] = useState<ServiceCard[]>(defaultCards);
  const [batteryBanner, setBatteryBanner] = useState<BatteryBannerContent>(defaultBatteryBanner);
  const [quickActionsConfig, setQuickActionsConfig] = useState<QuickActionsConfig>(defaultQuickActionsConfig);
  const [quickActions, setQuickActions] = useState<QuickActionItem[]>(defaultQuickActions);
  const [selectedSection, setSelectedSection] = useState<string>('all');
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

  useEffect(() => {
    fetch(`${API_BASE}/content/public`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          if (data.data.hero) {
            setHero(data.data.hero);
          }
          if (data.data.serviceCards && Array.isArray(data.data.serviceCards)) {
            setCards(data.data.serviceCards);
          }
          if (data.data.batteryBanner) {
            setBatteryBanner((prev) => ({
              ...prev,
              ...data.data.batteryBanner,
            }));
          }
          if (data.data.quickActionsConfig) {
            setQuickActionsConfig((prev) => ({
              ...prev,
              ...data.data.quickActionsConfig,
            }));
          }
          if (data.data.quickActions && Array.isArray(data.data.quickActions) && data.data.quickActions.length > 0) {
            setQuickActions(data.data.quickActions);
          }
          if (data.data.referralSettings) {
            setReferralSettings((prev) => ({
              ...prev,
              ...data.data.referralSettings,
            }));
          }
        }
      })
      .catch((err) => {
        console.warn('Failed to load dynamic CMS content, using defaults:', err);
      });
  }, []);

  // Deduplicate and sort cards by order, showing only visible ones
  const visibleCards = cards
    .filter((c) => c.isVisible !== false)
    .filter((card, index, self) => index === self.findIndex((t) => (t.id && card.id ? t.id === card.id : t.title.toLowerCase() === card.title.toLowerCase())))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const uniqueSections = Array.from(new Set(visibleCards.map((c) => c.section || 'General')));
  const filteredCards =
    selectedSection === 'all'
      ? visibleCards
      : visibleCards.filter((c) => (c.section || 'General').toLowerCase() === selectedSection.toLowerCase());

  const getHeroBackgroundStyle = (): React.CSSProperties => {
    if (hero.bgType === 'solid') {
      return { backgroundColor: hero.bgSolidColor || '#064e3b' };
    }
    const dirMap: Record<string, string> = {
      'to-r': 'to right',
      'to-b': 'to bottom',
      'to-br': 'to bottom right',
      'to-tr': 'to top right',
      'to-l': 'to left',
    };
    const direction = dirMap[hero.bgGradientDirection || 'to-r'] || 'to right';
    const start = hero.bgGradientStart || '#022c22';
    const mid = hero.bgGradientMiddle || '#064e3b';
    const end = hero.bgGradientEnd || '#115e59';

    if (hero.bgGradientDirection === 'radial') {
      return { background: `radial-gradient(circle at center, ${mid} 0%, ${start} 70%, ${end} 100%)` };
    }
    return { background: `linear-gradient(${direction}, ${start}, ${mid}, ${end})` };
  };

  const renderHighlightIcon = (iconName?: string) => {
    switch ((iconName || '').toLowerCase()) {
      case 'zap':
      case 'lightning':
      case 'power':
        return <Zap className="text-yellow-400" size={16} />;
      case 'battery':
      case 'battery-charging':
        return <Battery className="text-green-400" size={16} />;
      case 'wrench':
      case 'tools':
      case 'maintenance':
        return <Wrench className="text-teal-300" size={16} />;
      case 'shield':
      case 'shieldcheck':
        return <ShieldCheck className="text-emerald-400" size={16} />;
      case 'sparkles':
      case 'sparkle':
        return <Sparkles className="text-amber-300" size={16} />;
      case 'check':
      case 'checkcircle':
        return <CheckCircle2 className="text-green-400" size={16} />;
      default:
        return <Zap className="text-yellow-400" size={16} />;
    }
  };

  return (
    <div className="space-y-12 -mt-8">
      {/* 100% Soft-Coded Hero Section */}
      <section
        style={{
          ...getHeroBackgroundStyle(),
          color: hero.textColor || '#ffffff',
        }}
        className="text-white py-16 md:py-20 px-4 relative overflow-hidden transition-all duration-300 shadow-inner"
      >
        {/* Full Hero Background Image Layer (Active if bgType === 'image' OR if hero.bgImage exists) */}
        {(hero.bgType === 'image' || Boolean(hero.bgImage)) && hero.bgImage && (
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-500 bg-cover"
            style={{
              backgroundImage: `url(${resolveImageUrl(hero.bgImage)})`,
              backgroundSize: hero.bgSize || 'cover',
              backgroundPosition: hero.bgPosition || 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: hero.bgAttachment === 'fixed' ? 'fixed' : 'scroll',
              filter: hero.bgBlur ? `blur(${hero.bgBlur}px)` : undefined,
              transform: hero.bgBlur ? 'scale(1.05)' : undefined,
            }}
          />
        )}

        {/* Dynamic Dark Overlay Layer for Text Readability */}
        {(hero.bgType === 'image' || Boolean(hero.bgImage)) && hero.bgImage && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              backgroundColor: hero.bgOverlayColor || '#000000',
              opacity: hero.bgOverlayOpacity ?? 0.75,
            }}
          />
        )}

        {/* Ambient Grid / Mesh Pattern */}
        {hero.bgPattern !== 'none' && (
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        )}

        <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10">
          {/* Optional Hero Brand Emblem/Logo inside Hero (Only shown if showHeroLogo is true) */}
          {(hero.showHeroLogo ?? false) && hero.logoImage && (
            <div className="flex flex-col items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 inline-block shadow-lg">
                <img
                  src={resolveImageUrl(hero.logoImage)}
                  alt="Brand Logo"
                  className="h-14 max-h-16 w-auto max-w-[240px] object-contain"
                />
              </div>
            </div>
          )}

          {/* Top Pill Badge */}
          {(hero.badgeVisible ?? true) && (
            <div>
              <div
                style={{
                  backgroundColor: hero.badgeBgColor || 'rgba(6, 78, 59, 0.6)',
                  color: hero.badgeTextColor || '#6ee7b7',
                  borderColor: hero.badgeBorderColor || 'rgba(16, 185, 129, 0.4)',
                }}
                className="inline-flex items-center gap-2 border px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase transition-colors"
              >
                <Sparkles size={14} />
                <span>{hero.badgeText || 'Official EBS Battery Solution Portal • Kota, Rajasthan'}</span>
              </div>
            </div>
          )}

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight whitespace-pre-line leading-tight">
            {hero.heading}
          </h1>

          <p className="text-lg md:text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed opacity-90">
            {hero.subheading}
          </p>

          {/* 3 Core Highlights (Fully Soft-Coded) */}
          <div className="flex flex-wrap justify-center gap-6 pt-2 pb-2">
            {(hero.highlight1Visible ?? true) && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/10 text-xs font-bold">
                <span style={{ color: hero.highlight1Color || '#facc15' }}>
                  {renderHighlightIcon(hero.highlight1Icon || 'Zap')}
                </span>
                <span>{hero.highlight1Text || 'High Charging Power'}</span>
              </div>
            )}
            {(hero.highlight2Visible ?? true) && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/10 text-xs font-bold">
                <span style={{ color: hero.highlight2Color || '#4ade80' }}>
                  {renderHighlightIcon(hero.highlight2Icon || 'Battery')}
                </span>
                <span>{hero.highlight2Text || 'Long Life (3 & 1.5 Year Warranty)'}</span>
              </div>
            )}
            {(hero.highlight3Visible ?? true) && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/10 text-xs font-bold">
                <span style={{ color: hero.highlight3Color || '#5eead4' }}>
                  {renderHighlightIcon(hero.highlight3Icon || 'Wrench')}
                </span>
                <span>{hero.highlight3Text || 'Low Maintenance'}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {(hero.primaryButtonVisible ?? true) && hero.primaryButtonText && (
              (hero.primaryButtonTarget === '_blank' || (hero.primaryButtonLink && hero.primaryButtonLink.startsWith('http'))) ? (
                <a
                  href={hero.primaryButtonLink || '/complaint/register'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: hero.primaryButtonBgColor || '#10b981',
                    color: hero.primaryButtonTextColor || '#020617',
                  }}
                  className="px-8 py-3.5 font-black rounded-full transition shadow-xl hover:opacity-90 text-sm tracking-wide"
                >
                  {hero.primaryButtonText}
                </a>
              ) : (
                <Link
                  to={hero.primaryButtonLink || '/complaint/register'}
                  style={{
                    backgroundColor: hero.primaryButtonBgColor || '#10b981',
                    color: hero.primaryButtonTextColor || '#020617',
                  }}
                  className="px-8 py-3.5 font-black rounded-full transition shadow-xl hover:opacity-90 text-sm tracking-wide"
                >
                  {hero.primaryButtonText}
                </Link>
              )
            )}
            {(hero.secondaryButtonVisible ?? true) && hero.secondaryButtonText && (
              (hero.secondaryButtonTarget === '_self' && hero.secondaryButtonLink && !hero.secondaryButtonLink.startsWith('http')) ? (
                <Link
                  to={hero.secondaryButtonLink || '/warranty/check'}
                  style={{
                    backgroundColor: hero.secondaryButtonBgColor || 'rgba(255, 255, 255, 0.1)',
                    color: hero.secondaryButtonTextColor || '#ffffff',
                    borderColor: hero.secondaryButtonBorderColor || 'rgba(255, 255, 255, 0.2)',
                  }}
                  className="px-8 py-3.5 font-bold rounded-full border transition shadow-lg text-sm inline-flex items-center gap-2 hover:bg-white/20"
                >
                  <span>{hero.secondaryButtonText}</span>
                  {(hero.secondaryButtonShowIcon ?? true) && (
                    <ExternalLink size={14} className="text-emerald-300" />
                  )}
                </Link>
              ) : (
                <a
                  href={hero.secondaryButtonLink || '/warranty/check'}
                  target={hero.secondaryButtonTarget || '_blank'}
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: hero.secondaryButtonBgColor || 'rgba(255, 255, 255, 0.1)',
                    color: hero.secondaryButtonTextColor || '#ffffff',
                    borderColor: hero.secondaryButtonBorderColor || 'rgba(255, 255, 255, 0.2)',
                  }}
                  className="px-8 py-3.5 font-bold rounded-full border transition shadow-lg text-sm inline-flex items-center gap-2 hover:bg-white/20"
                >
                  <span>{hero.secondaryButtonText}</span>
                  {(hero.secondaryButtonShowIcon ?? true) && (
                    <ExternalLink size={14} className="text-emerald-300" />
                  )}
                </a>
              )
            )}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* OFFICIAL COMPLAINT DIVISION SELECTOR SECTION (MATCHING UI)   */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-4">
        {/* Section Header & Subtitle */}
        <div className="text-center space-y-4 mb-8">
          <p className="text-slate-600 font-medium text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
            Select your division below to register complaints, verify warranty coverage, or request engineering service tickets
          </p>

          {/* Centered Pill Badge Header */}
          <div className="inline-flex items-center justify-center gap-1.5 bg-white text-slate-800 font-bold px-6 py-2.5 rounded-full shadow-md border border-slate-200 text-xs md:text-sm">
            <span>Select Complaint Division</span>
            <ChevronDown size={16} className="text-slate-600" />
          </div>
        </div>

        {/* Dynamic Section Filtering Tabs if more than 1 section exists */}
        {uniqueSections.length > 1 && (
          <div className="flex justify-center items-center gap-2 flex-wrap mb-8">
            <button
              onClick={() => setSelectedSection('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition shadow-xs cursor-pointer ${
                selectedSection === 'all'
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Divisions ({cards.length})
            </button>
            {uniqueSections.map((sec) => {
              const count = cards.filter((c) => (c.section || 'General').toLowerCase() === sec.toLowerCase()).length;
              const isSelected = selectedSection.toLowerCase() === sec.toLowerCase();
              return (
                <button
                  key={sec}
                  onClick={() => setSelectedSection(sec)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition shadow-xs cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {sec} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Dynamic Division Flash Cards Grid */}
        <div
          className={`grid gap-6 ${
            filteredCards.length === 1
              ? 'grid-cols-1 max-w-md mx-auto'
              : filteredCards.length === 2
              ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto'
              : filteredCards.length === 3
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          }`}
        >
          {filteredCards.map((card) => {
            const styles = getDivisionCardStyles(card.color);
            const hasBgImage = card.bgType === 'image' && !!card.bgImage;
            const overlayOpacity = typeof card.bgOverlayOpacity === 'number' ? card.bgOverlayOpacity / 100 : 0.7;

            return (
              <div
                key={card.id || card.title}
                style={
                  hasBgImage
                    ? {
                        backgroundImage: `url("${resolveImageUrl(card.bgImage)}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }
                    : undefined
                }

                className={`relative overflow-hidden ${
                  hasBgImage ? 'bg-slate-900' : styles.cardBg
                } rounded-3xl p-6 text-white text-center flex flex-col justify-between shadow-xl ${
                  styles.shadow
                } hover:-translate-y-1.5 transition-all duration-300 min-h-[380px]`}
              >
                {/* Dark / Theme Gradient Overlay for Background Image Mode */}
                {hasBgImage && (
                  <div
                    className="absolute inset-0 z-0"
                    style={{
                      backgroundColor: `rgba(15, 23, 42, ${overlayOpacity})`,
                      backgroundImage:
                        'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.75) 100%)',
                    }}
                  />
                )}

                <div className="space-y-3.5 relative z-10">
                  {/* Card Badge if configured */}
                  {card.badge && (
                    <div className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/30 backdrop-blur-xs shadow-xs">
                      {card.badge}
                    </div>
                  )}

                  {/* Top White Circular Icon Badge */}
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto border-2 border-white/40 overflow-hidden p-2">
                    {renderCardIcon(card, styles.iconColor)}
                  </div>

                  {/* Card Title & Subtitle */}
                  <div>
                    <h3 className="text-xl font-extrabold text-white tracking-wide drop-shadow-xs">
                      {card.title}
                    </h3>
                    {card.subtitle && (
                      <p className="text-[11px] font-bold text-white/85 uppercase tracking-wider mt-0.5 drop-shadow-xs">
                        {card.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Card Description */}
                  <p className="text-white/95 text-xs leading-relaxed font-normal px-1 drop-shadow-xs">
                    {card.description}
                  </p>

                  {/* Card Feature Bullets */}
                  {card.features && card.features.length > 0 && (
                    <ul className="text-left space-y-1.5 pt-2 text-xs text-white/95 bg-black/25 backdrop-blur-xs p-3 rounded-2xl border border-white/15">
                      {card.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-1.5">
                          <span className="text-white font-bold leading-none mt-0.5">✓</span>
                          <span className="leading-tight text-[11px]">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Bottom Action Button */}
                <div className="pt-5 relative z-10">
                  {(() => {
                    const finalUrl = card.linkUrl?.trim() || `/complaint/register?division=${encodeURIComponent(card.section || card.title)}`;
                    const isExternal = finalUrl.startsWith('http') || (finalUrl.includes('warranty') && !finalUrl.startsWith('/'));
                    return isExternal ? (
                      <a
                        href={finalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full bg-white ${styles.btnText} font-bold py-3 px-5 rounded-full text-xs transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer`}
                      >
                        <span>{card.buttonText || 'Select Division'}</span>
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <Link
                        to={finalUrl}
                        className={`block w-full bg-white ${styles.btnText} font-bold py-3 px-5 rounded-full text-xs transition shadow-md text-center cursor-pointer`}
                      >
                        {card.buttonText || 'Select Division'}
                      </Link>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Ekosmart Customer Wallet & Referral Rewards Banner */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 rounded-3xl p-6 md:p-8 border-2 border-amber-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center shadow-lg flex-shrink-0">
              <Coins size={28} className="animate-pulse" />
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
            <Link
              to="/customer/wallet"
              className="flex-1 md:flex-initial px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-2xl text-xs transition shadow-md flex items-center justify-center gap-2"
            >
              <Coins size={15} />
              <span>Open My Wallet</span>
            </Link>
            <Link
              to="/customer/referrals"
              className="flex-1 md:flex-initial px-4 py-2.5 bg-white hover:bg-amber-50 text-amber-900 font-bold rounded-2xl text-xs transition border border-amber-300 shadow-xs flex items-center justify-center gap-1.5"
            >
              <Gift size={15} className="text-purple-600" />
              <span>Refer & Earn (+{referralSettings.referrerReward || 500})</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Access Utility Actions Bar */}
      {quickActionsConfig.isVisible !== false && (
        <section className="max-w-6xl mx-auto px-4">
          <div
            className={`relative overflow-hidden transition-all duration-300 ${quickActionsConfig.cardBorderRadius || 'rounded-3xl'} ${quickActionsConfig.cardShadow || 'shadow-sm'}`}
            style={{
              backgroundColor: quickActionsConfig.bgType === 'color' ? (quickActionsConfig.bgColor || quickActionsConfig.cardBgColor || '#ffffff') : undefined,
              background: quickActionsConfig.bgType === 'gradient'
                ? `linear-gradient(${quickActionsConfig.bgGradientDirection === 'to-b' ? 'to bottom' : quickActionsConfig.bgGradientDirection === 'to-br' ? 'to bottom right' : 'to right'}, ${quickActionsConfig.bgGradientStart || '#0f172a'}, ${quickActionsConfig.bgGradientEnd || '#1e293b'})`
                : undefined,
              borderColor: quickActionsConfig.cardBorderColor || '#e2e8f0',
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            {/* Background Image Layer if bgType === 'image' */}
            {quickActionsConfig.bgType === 'image' && quickActionsConfig.bgImage && (
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-500"
                style={{
                  backgroundImage: `url(${resolveImageUrl(quickActionsConfig.bgImage)})`,
                  backgroundPosition: quickActionsConfig.bgPosition || 'center',
                  backgroundSize: quickActionsConfig.bgSize || 'cover',
                  filter: quickActionsConfig.bgBlur ? `blur(${quickActionsConfig.bgBlur}px)` : undefined,
                }}
              />
            )}
            {/* Background Image Dark/Color Overlay */}
            {quickActionsConfig.bgType === 'image' && quickActionsConfig.bgImage && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundColor: quickActionsConfig.bgOverlayColor || '#000000',
                  opacity: typeof quickActionsConfig.bgOverlayOpacity === 'number' ? quickActionsConfig.bgOverlayOpacity : 0.7,
                }}
              />
            )}

            <div className="relative z-10 p-6 md:p-8">
              {/* Optional Section Header */}
              {quickActionsConfig.showSectionHeader && (quickActionsConfig.sectionTitle || quickActionsConfig.sectionBadge) && (
                <div className="text-center mb-6 space-y-1.5">
                  {quickActionsConfig.showSectionBadge && quickActionsConfig.sectionBadge && (
                    <span className="inline-block bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-blue-500/20">
                      {quickActionsConfig.sectionBadge}
                    </span>
                  )}
                  {quickActionsConfig.sectionTitle && (
                    <h3
                      className="text-lg md:text-xl font-bold tracking-tight"
                      style={{ color: quickActionsConfig.textColor || '#1e293b' }}
                    >
                      {quickActionsConfig.sectionTitle}
                    </h3>
                  )}
                  {quickActionsConfig.sectionSubtitle && (
                    <p
                      className="text-xs max-w-lg mx-auto"
                      style={{ color: quickActionsConfig.subtitleColor || '#64748b' }}
                    >
                      {quickActionsConfig.sectionSubtitle}
                    </p>
                  )}
                </div>
              )}

              {/* Action Cards Container */}
              <div
                className={
                  quickActionsConfig.layoutStyle === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
                    : 'flex flex-wrap items-center justify-around gap-6 text-center'
                }
              >
                {quickActions
                  .filter((act) => act.isVisible !== false)
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map((act, idx, arr) => {
                    const styles = getQuickActionColorStyles(act.color, act.customBg, act.customColor);
                    const target = act.target || (act.url.startsWith('http') || act.url.startsWith('/warranty') ? '_blank' : '_self');
                    const showExtIcon = typeof act.showExternalIcon === 'boolean' ? act.showExternalIcon : (target === '_blank');
                    const isRouterLink = !act.url.startsWith('http') && target !== '_blank';

                    const cardInner = (
                      <>
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition shadow-xs shrink-0 ${styles.bg}`}
                          style={styles.customStyle}
                        >
                          {renderQuickActionIcon(act)}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4
                              className={`font-bold text-sm transition ${styles.text}`}
                              style={{ color: act.customTextColor || quickActionsConfig.textColor || undefined }}
                            >
                              {act.title}
                            </h4>
                            {act.badge && (
                              <span
                                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: act.badgeColor || 'rgba(16, 185, 129, 0.15)',
                                  color: act.badgeColor ? '#ffffff' : '#059669',
                                }}
                              >
                                {act.badge}
                              </span>
                            )}
                            {showExtIcon && (
                              <ExternalLink size={12} className={`opacity-60 transition ${styles.text}`} />
                            )}
                          </div>
                          <p
                            className="text-[11px]"
                            style={{ color: quickActionsConfig.subtitleColor || '#94a3b8' }}
                          >
                            {act.subtitle}
                          </p>
                        </div>
                      </>
                    );

                    return (
                      <div key={act.id || idx} className="flex items-center gap-6">
                        {isRouterLink ? (
                          <Link
                            to={act.url}
                            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group cursor-pointer"
                          >
                            {cardInner}
                          </Link>
                        ) : (
                          <a
                            href={act.url}
                            target={target}
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group cursor-pointer"
                          >
                            {cardInner}
                          </a>
                        )}
                        {quickActionsConfig.showDividers !== false && quickActionsConfig.layoutStyle !== 'grid' && idx < arr.length - 1 && (
                          <div
                            className="hidden md:block w-px h-10"
                            style={{ backgroundColor: quickActionsConfig.dividerColor || '#e2e8f0' }}
                          />
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* EBS Battery Technical Highlights Banner */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 md:p-12 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            {batteryBanner.badgeText && (
              <div className="inline-block bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                {batteryBanner.badgeText}
              </div>
            )}
            <h3 className="text-2xl md:text-3xl font-extrabold leading-tight">
              {batteryBanner.heading || 'Genuine Li-ion & LFP Batteries For E-Scooter & E-Rickshaw'}
            </h3>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              {batteryBanner.subheading ||
                'Engineered with advanced Smart BMS, thermal protection, and high energy density cells. Tested at our Kota plant with Pan-India dispatch & replacement support.'}
            </p>
            {(batteryBanner.highlight1 || batteryBanner.highlight2) && (
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-300 pt-2">
                {batteryBanner.highlight1 && (
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 size={16} />
                    <span>{batteryBanner.highlight1}</span>
                  </span>
                )}
                {batteryBanner.highlight2 && (
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 size={16} />
                    <span>{batteryBanner.highlight2}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 text-center space-y-3 flex-shrink-0 w-full md:w-72">
            <EbsLogo variant="battery" size="lg" showText={false} className="justify-center" />
            <h4 className="font-bold text-sm text-white">Need Battery Assistance?</h4>
            <p className="text-[11px] text-slate-400">Contact our factory technical engineers in Kota, Rajasthan</p>
            <div className="space-y-2 pt-1">
              <a
                href={`tel:${(batteryBanner.helplinePhone || '8949049003').replace(/[^0-9]/g, '')}`}
                className="inline-block w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow cursor-pointer"
              >
                {batteryBanner.helplineBtnText || 'Call +91 8949049003'}
              </a>
              {batteryBanner.plantBtnLink?.startsWith('http') ? (
                <a
                  href={batteryBanner.plantBtnLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full py-2 bg-white/10 hover:bg-white/20 text-slate-200 font-semibold rounded-xl text-xs transition border border-white/20 cursor-pointer"
                >
                  {batteryBanner.plantBtnText || 'View Plant Contact Details'}
                </a>
              ) : (
                <Link
                  to={batteryBanner.plantBtnLink || '/contact'}
                  className="inline-block w-full py-2 bg-white/10 hover:bg-white/20 text-slate-200 font-semibold rounded-xl text-xs transition border border-white/20 cursor-pointer"
                >
                  {batteryBanner.plantBtnText || 'View Plant Contact Details'}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
