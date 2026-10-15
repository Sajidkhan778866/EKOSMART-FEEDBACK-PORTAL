import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom';
import { EbsLogo } from './EbsLogo';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  FileText,
  Search,
  ExternalLink,
  Lock,
  UserCheck,
  MoreVertical,
  X,
  Home,
  ChevronRight,
  Sparkles,
  Coins,
  Gift,
  ShoppingBag,
  User,
  LogOut,
  Receipt,
  ChevronDown,
} from 'lucide-react';
import { API_BASE, ADMIN_PORTAL_URL, EMPLOYEE_PORTAL_URL, resolveImageUrl } from '../config/api';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useTheme } from '../context/ThemeContext';
import CustomerLoginModal from './CustomerLoginModal';

const InstagramIcon = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const WhatsAppIcon = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M17.472 14.382c-.301-.15-1.776-.876-2.051-.976-.275-.1-.476-.15-.676.15-.2.301-.776.976-.951 1.176-.176.2-.351.226-.652.076-.301-.15-1.272-.469-2.424-1.497-.896-.799-1.502-1.787-1.678-2.088-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.175.201-.301.302-.502.1-.2.05-.376-.025-.526-.075-.15-.677-1.632-.927-2.235-.243-.587-.49-.508-.676-.517-.175-.01-.376-.01-.577-.01-.2 0-.527.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.48 1.078 2.909 1.228 3.11.151.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.634.721.23 1.378.197 1.897.12.578-.087 1.776-.726 2.027-1.428.251-.702.251-1.303.176-1.428-.076-.125-.276-.2-.577-.35zM12.04 2C6.52 2 2.04 6.48 2.04 12c0 1.94.55 3.75 1.51 5.28L2 22l4.86-1.51C8.34 21.39 10.14 22 12.04 22c5.52 0 10-4.48 10-10S17.56 2 12.04 2zm0 18.17c-1.68 0-3.24-.51-4.55-1.39l-.33-.22-2.88.9.92-2.81-.24-.35A8.134 8.134 0 0 1 3.86 12c0-4.51 3.67-8.17 8.18-8.17 4.51 0 8.18 3.66 8.18 8.17 0 4.51-3.67 8.17-8.18 8.17z" />
  </svg>
);

const getWhatsAppUrl = (phone?: string, text?: string) => {
  const raw = phone || '+91 8949049003';
  const digits = raw.replace(/\D/g, '');
  const phoneFormatted = digits.length === 10 ? `91${digits}` : digits;
  const msg = encodeURIComponent(
    text || 'Hello Ekosmart, I would like to inquire about battery service & support.'
  );
  return `https://wa.me/${phoneFormatted}?text=${msg}`;
};

interface HeaderLogoContent {
  logoType?: 'preset' | 'image';
  logoImage?: string;
  logoText?: string;
}

interface TopBarContent {
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

const defaultTopBar: TopBarContent = {
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
};

interface HeaderNavContent {
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
  customNavItems?: Array<{
    id: string;
    label: string;
    href: string;
    icon?: string;
    isVisible?: boolean;
    order?: number;
    isExternal?: boolean;
    children?: Array<{ label: string; href: string; isExternal?: boolean }>;
  }>;
}

const defaultHeaderNav: HeaderNavContent = {
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
};

interface FooterContent {
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
  socialLinks?: Array<{ platform: string; url: string }>;
  columns?: Array<{ id?: string; title: string; links: Array<{ label: string; href: string; isExternal?: boolean }> }>;
}

const defaultFooter: FooterContent = {
  companyName: 'Ekosmart Battery Solution (EBS) & EV Spare Parts',
  copyrightText: '2026 Ekosmart Battery Solution. All rights reserved. GSTIN: 08DTUPM4205B1Z0',
  disclaimer: 'Official customer support, complaint tracking & battery warranty verification portal',
  address: 'Rang Talab, Near by Star Kids School, Kota, Rajasthan - 324002',
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
};

interface DivisionContactItem {
  id?: string;
  name: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  inCharge?: string;
  officeHours?: string;
  address?: string;
}

interface ContactInfoData {
  helplinePhone?: string;
  whatsappNumber?: string;
  supportEmail?: string;
  plantAddress?: string;
  mapUrl?: string;
  dropdownOptions?: string[];
  divisionContacts?: DivisionContactItem[];
}

const Layout = () => {
  const { customer, isAuthenticated, logout } = useCustomerAuth();
  const { theme } = useTheme();
  const [topBar, setTopBar] = useState<TopBarContent>(defaultTopBar);
  const [headerNav, setHeaderNav] = useState<HeaderNavContent>(defaultHeaderNav);
  const [footer, setFooter] = useState<FooterContent>(defaultFooter);
  const [contactInfo, setContactInfo] = useState<ContactInfoData | null>(null);
  const [headerLogo, setHeaderLogo] = useState<HeaderLogoContent>({ logoType: 'preset', logoImage: '' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [navContactDropdownOpen, setNavContactDropdownOpen] = useState(false);
  const [footerContactDropdownOpen, setFooterContactDropdownOpen] = useState(false);
  const location = useLocation();

  // 20-Second Customer Login Timer & Modal State
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginTimerConfig, setLoginTimerConfig] = useState<{
    enabled: boolean;
    durationSeconds: number;
    title: string;
    message: string;
  }>({
    enabled: true,
    durationSeconds: 20,
    title: 'Welcome to Ekosmart',
    message: 'Login with your email to access your customer wallet, showroom bills, warranty certificates & rewards.',
  });

  const [referrerCoins, setReferrerCoins] = useState<number>(500);

  // Close drawers & dropdowns on route transition
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setNavContactDropdownOpen(false);
    setFooterContactDropdownOpen(false);
  }, [location.pathname]);

  // Sync theme changes into local state
  useEffect(() => {
    if (theme) {
      if (theme.footer) {
        setFooter((prev) => ({ ...prev, ...theme.footer }));
      }
      if (theme.header) {
        setHeaderLogo({
          logoType: theme.header.logoType || 'preset',
          logoImage: theme.header.logoImage || '',
          logoText: theme.header.logoText || 'Ekosmart',
        });
      }
      if (theme.customerLoginTimer) {
        setLoginTimerConfig((prev) => ({
          ...prev,
          ...theme.customerLoginTimer,
        }));
      }
    }
  }, [theme]);

  // Load public CMS branding & referral fallback settings
  useEffect(() => {
    fetch(`${API_BASE}/content/public`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          if (data.data.topBar) {
            setTopBar((prev) => ({ ...prev, ...data.data.topBar }));
          }
          if (data.data.headerNav) {
            setHeaderNav((prev) => ({ ...prev, ...data.data.headerNav }));
          }
          if (data.data.footer) {
            setFooter((prev) => ({ ...prev, ...data.data.footer }));
          }
          if (data.data.contactInfo) {
            setContactInfo(data.data.contactInfo);
          }
          if (data.data.hero && !theme.header) {
            setHeaderLogo({
              logoType: data.data.hero.logoType || 'preset',
              logoImage: data.data.hero.logoImage || '',
            });
          }
          if (data.data.referralSettings?.referrerReward) {
            setReferrerCoins(Number(data.data.referralSettings.referrerReward) || 500);
          }
        }
      })
      .catch((err) => {
        console.warn('CMS content fallback load error:', err);
      });
  }, [theme]);

  // 20-Second Customer Login Prompt Trigger
  useEffect(() => {
    if (isAuthenticated || !loginTimerConfig.enabled) {
      return;
    }

    const isDismissed = sessionStorage.getItem('ekosmart_login_prompt_dismissed') === 'true';
    if (isDismissed) {
      return;
    }

    const seconds = Math.max(3, Number(loginTimerConfig.durationSeconds) || 20);
    const timer = setTimeout(() => {
      const dismissedNow = sessionStorage.getItem('ekosmart_login_prompt_dismissed') === 'true';
      if (!isAuthenticated && !dismissedNow) {
        setLoginModalOpen(true);
      }
    }, seconds * 1000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, loginTimerConfig.enabled, loginTimerConfig.durationSeconds]);

  const handleCloseLoginModal = () => {
    sessionStorage.setItem('ekosmart_login_prompt_dismissed', 'true');
    setLoginModalOpen(false);
  };

  const activeDivisions =
    contactInfo?.dropdownOptions && contactInfo.dropdownOptions.length > 0
      ? contactInfo.dropdownOptions
      : [
          'Lithium Battery Solution (EBS)',
          'EV Spare Parts Wholesale/Retail',
          'Drive Rental Assistance',
          'Showroom & Dealership Inquiries',
          'Plant Commercial Warranty Inspection',
        ];

  const getDivContact = (divName: string): DivisionContactItem => {
    return (
      contactInfo?.divisionContacts?.find(
        (c) => c.name.trim().toLowerCase() === divName.trim().toLowerCase()
      ) ||
      contactInfo?.divisionContacts?.find(
        (c) =>
          divName.toLowerCase().includes(c.name.toLowerCase()) ||
          c.name.toLowerCase().includes(divName.toLowerCase())
      ) || {
        name: divName,
        phone: footer.phone || '+91 8949049003',
        email: footer.email || 'support@ekosmartdrive.in',
        whatsapp: footer.whatsappNumber || footer.phone || '+91 8949049003',
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Notification Bar (100% Soft-Coded) */}
      {(topBar.isVisible ?? true) && (
        <div
          style={{
            backgroundColor: topBar.bgColor || '#0f172a',
            color: topBar.textColor || '#cbd5e1',
          }}
          className="text-[11px] py-1.5 px-4 border-b border-slate-800 transition-colors"
        >
          <div className="container mx-auto flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-4">
              {(topBar.showPhone ?? true) && (
                <span
                  style={{ color: topBar.accentColor || '#34d399' }}
                  className="flex items-center gap-1 font-semibold"
                >
                  <Phone size={12} />
                  <span>
                    {topBar.phoneLabel || 'Helpline:'} {topBar.phone || footer.phone || '+91 8949049003'}
                  </span>
                </span>
              )}
              {(topBar.showOfficeHours ?? true) && (
                <span className="hidden sm:flex items-center gap-1 opacity-80">
                  <Clock size={12} />
                  <span>{topBar.officeHours || footer.officeHours || '10:00 AM to 6:30 PM'}</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 opacity-80">
              {(topBar.showGstin ?? true) && (
                <span className="hidden md:inline font-mono">
                  GSTIN: {topBar.gstin || footer.gstin || '08DTUPM4205B1Z0'}
                </span>
              )}
              {(topBar.showLocation ?? true) && (
                <span
                  style={{ color: topBar.accentColor || '#34d399' }}
                  className="flex items-center gap-1 font-semibold opacity-100"
                >
                  <MapPin size={12} />
                  <span>{topBar.location || 'Kota, Rajasthan'}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Header with Official EBS Logo, Navigation & Customer Wallet (100% Soft-Coded) */}
      <header
        style={{
          backgroundColor: headerNav.navBgColor || '#ffffff',
          borderColor: headerNav.navBorderColor || '#e2e8f0',
        }}
        className="shadow-xs border-b sticky top-0 z-30 transition-colors"
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Three-Dot Left Menu Trigger (⋮) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              className="md:hidden p-2 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-slate-100 transition cursor-pointer border border-slate-200 shadow-xs"
            >
              <MoreVertical size={20} className="text-slate-800" />
            </button>

            <NavLink to="/" className="flex items-center gap-3">
              {(headerNav.logoType === 'image' && headerNav.logoImage) || (headerLogo.logoType === 'image' && headerLogo.logoImage) ? (
                <img
                  src={resolveImageUrl(headerNav.logoImage || headerLogo.logoImage || '')}
                  alt="Ekosmart Logo"
                  className="h-11 max-h-13 w-auto max-w-[200px] object-contain"
                />
              ) : (
                <EbsLogo
                  variant="battery"
                  size="md"
                  customTitle={headerNav.brandTitle}
                  customSubtitle={headerNav.brandSubtitle}
                />
              )}
            </NavLink>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-5 text-xs font-bold text-slate-800">
              {(headerNav.showHome ?? true) && (
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive
                        ? 'text-emerald-700 flex items-center gap-1.5 border-b-2 border-emerald-600 pb-1 font-bold'
                        : 'hover:text-emerald-700 flex items-center gap-1.5 transition font-bold'
                    }
                  >
                    <Home size={15} className="text-emerald-600" />
                    <span>{headerNav.homeLabel || 'Home'}</span>
                  </NavLink>
                </li>
              )}

              {/* Customer Wallet Option */}
              {(headerNav.showWallet ?? true) && (
                <li>
                  <NavLink
                    to="/customer/wallet"
                    className={({ isActive }) =>
                      isActive
                        ? 'text-amber-800 bg-amber-100/80 border border-amber-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold shadow-xs'
                        : 'text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition font-bold shadow-xs'
                    }
                  >
                    <Coins size={15} className="text-amber-600 animate-pulse" />
                    <span>{headerNav.walletLabel || 'Wallet & Coins'}</span>
                    {(headerNav.showWalletBadge ?? true) && isAuthenticated && (
                      <span className="bg-amber-200 text-amber-950 text-[10px] px-1.5 py-0.5 rounded-md font-black">
                        {customer?.walletBalance ?? 0}
                      </span>
                    )}
                  </NavLink>
                </li>
              )}

              {/* Refer & Earn Option */}
              {(headerNav.showRefer ?? true) && (
                <li>
                  <NavLink
                    to="/customer/referrals"
                    className={({ isActive }) =>
                      isActive
                        ? 'text-purple-800 bg-purple-100/80 border border-purple-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold shadow-xs'
                        : 'text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition font-bold shadow-xs'
                    }
                  >
                    <Gift size={15} className="text-purple-600" />
                    <span>
                      {headerNav.referLabel
                        ? `${headerNav.referLabel} (+${referrerCoins})`
                        : `Refer & Earn (+${referrerCoins})`}
                    </span>
                  </NavLink>
                </li>
              )}

              {/* Softcoded Custom Navigation Items */}
              {(headerNav.customNavItems || [])
                .filter((item) => item.isVisible !== false)
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((item) => (
                  <li key={item.id}>
                    {item.isExternal || item.href.startsWith('http') ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-emerald-700 flex items-center gap-1 transition font-bold"
                      >
                        <span>{item.label}</span>
                        <ExternalLink size={10} className="text-slate-400" />
                      </a>
                    ) : (
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          isActive
                            ? 'text-emerald-700 flex items-center gap-1.5 border-b-2 border-emerald-600 pb-1 font-bold'
                            : 'hover:text-emerald-700 flex items-center gap-1.5 transition font-bold'
                        }
                      >
                        <span>{item.label}</span>
                      </NavLink>
                    )}
                  </li>
                ))}

              {/* Contact & Support Dropdown (All items clickable <a> links) */}
              <li className="relative">
                <button
                  type="button"
                  onClick={() => setNavContactDropdownOpen(!navContactDropdownOpen)}
                  className="flex items-center gap-1.5 text-slate-800 hover:text-emerald-700 transition font-bold py-1.5 cursor-pointer"
                  aria-expanded={navContactDropdownOpen}
                >
                  <Phone size={14} className="text-emerald-600" />
                  <span>Contact & Helpline</span>
                  <ChevronDown
                    size={13}
                    className={`text-slate-500 transition-transform ${
                      navContactDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {navContactDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs font-medium animate-in fade-in max-h-[85vh] overflow-y-auto">
                    <div className="px-4 py-2 border-b border-slate-100 bg-slate-50 rounded-t-xl">
                      <p className="font-bold text-slate-900 text-xs">Direct Support & Helplines</p>
                      <p className="text-[11px] text-slate-500">Every option connects you instantly</p>
                    </div>

                    <a
                      href={`tel:${(footer.phone || '+918949049003').replace(/\s+/g, '')}`}
                      onClick={() => setNavContactDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 transition"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Phone size={14} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">Central Helpline</div>
                        <div className="text-[11px] text-emerald-700 font-mono font-semibold">
                          {footer.phone || '+91 8949049003'}
                        </div>
                      </div>
                    </a>

                    {(footer.showWhatsapp ?? true) && (
                      <a
                        href={getWhatsAppUrl(footer.whatsappNumber || footer.phone, footer.whatsappText)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setNavContactDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 transition"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <WhatsAppIcon size={14} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">WhatsApp Chat Support</div>
                          <div className="text-[11px] text-emerald-700 font-mono font-semibold">
                            {footer.whatsappNumber || footer.phone || '+91 8949049003'}
                          </div>
                        </div>
                      </a>
                    )}

                    <a
                      href={`mailto:${footer.email || 'support@ekosmartdrive.in'}`}
                      onClick={() => setNavContactDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 text-slate-700 hover:text-blue-800 transition"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                        <Mail size={14} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">Email Official Support</div>
                        <div className="text-[11px] text-slate-500 font-mono truncate max-w-[180px]">
                          {footer.email || 'support@ekosmartdrive.in'}
                        </div>
                      </div>
                    </a>

                    <a
                      href={footer.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(footer.address || 'Rang Talab, Near by Star Kids School, Kota, Rajasthan - 324002')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setNavContactDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50 text-slate-700 hover:text-amber-800 transition"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <MapPin size={14} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">Kota Plant Location (Maps)</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                          {footer.address || 'Rang Talab, Kota'}
                        </div>
                      </div>
                    </a>

                    {/* Concern Division / Department Contacts Section */}
                    <div className="px-4 pt-2.5 pb-1 border-t border-slate-100 bg-slate-50/60">
                      <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center justify-between">
                        <span>Concern Division Contacts</span>
                        <span className="text-emerald-700 font-mono text-[10px]">({activeDivisions.length} Active)</span>
                      </p>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {activeDivisions.map((opt) => {
                        const divContact = getDivContact(opt);
                        const cleanPhone = (divContact.phone || footer.phone || '+918949049003').replace(/[^0-9+]/g, '');
                        const cleanWa = (divContact.whatsapp || divContact.phone || footer.whatsappNumber || '918949049003').replace(/[^0-9]/g, '');
                        const waUrl = `https://wa.me/${cleanWa.length === 10 ? `91${cleanWa}` : cleanWa}?text=${encodeURIComponent(`Hello Ekosmart ${opt}, I have an inquiry.`)}`;

                        return (
                          <div key={opt} className="px-4 py-2 hover:bg-slate-50 transition">
                            <div className="flex items-center justify-between gap-1">
                              <NavLink
                                to={`/contact?division=${encodeURIComponent(opt)}`}
                                onClick={() => setNavContactDropdownOpen(false)}
                                className="font-bold text-slate-900 text-xs hover:text-emerald-700 transition"
                              >
                                {opt}
                              </NavLink>
                              {divContact.inCharge && (
                                <span className="text-[10px] text-slate-400 truncate max-w-[110px]">
                                  {divContact.inCharge}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-[11px] pt-1">
                              <a
                                href={`tel:${cleanPhone}`}
                                className="font-mono text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                                title="Call Department"
                              >
                                <Phone size={10} />
                                <span>{divContact.phone || footer.phone}</span>
                              </a>
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-600 hover:underline flex items-center gap-1 font-semibold"
                                title="WhatsApp Chat"
                              >
                                <WhatsAppIcon size={11} />
                                <span>WhatsApp</span>
                              </a>
                              {divContact.email && (
                                <a
                                  href={`mailto:${divContact.email}`}
                                  className="text-blue-600 hover:underline flex items-center gap-1 truncate max-w-[90px]"
                                  title="Email"
                                >
                                  <Mail size={10} />
                                  <span>Email</span>
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t border-slate-100 my-1 pt-1">
                      <NavLink
                        to="/contact"
                        onClick={() => setNavContactDropdownOpen(false)}
                        className="flex items-center justify-between px-4 py-2 hover:bg-slate-100 text-slate-700 font-bold text-xs"
                      >
                        <span>View Full Contact Directory</span>
                        <ChevronRight size={13} className="text-slate-400" />
                      </NavLink>
                    </div>
                  </div>
                )}
              </li>

              {/* Customer Account / Login Profile if authenticated */}
              {(headerNav.showAccount ?? true) && (
                isAuthenticated && customer ? (
                  <li className="relative">
                    <button
                      type="button"
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-800 transition cursor-pointer border border-slate-200"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-bold">
                        {customer.name?.[0] || 'C'}
                      </div>
                      <span className="max-w-[120px] truncate">{customer.name}</span>
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs font-medium animate-in fade-in">
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="font-bold text-slate-900 truncate">{customer.name}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{customer.customerId}</p>
                          <p className="text-[11px] text-amber-600 font-bold mt-0.5">
                            {customer.walletBalance || 0} Coins Available
                          </p>
                        </div>
                        <Link
                          to="/customer/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700"
                        >
                          <Home size={14} className="text-emerald-600" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          to="/customer/wallet"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700"
                        >
                          <Coins size={14} className="text-amber-500" />
                          <span>My Wallet ({customer.walletBalance || 0} Coins)</span>
                        </Link>
                        <Link
                          to="/customer/referrals"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700"
                        >
                          <Gift size={14} className="text-purple-500" />
                          <span>My Referrals ({customer.referralCode})</span>
                        </Link>
                        <Link
                          to="/customer/purchases"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700"
                        >
                          <ShoppingBag size={14} className="text-blue-500" />
                          <span>My Purchases & Bills</span>
                        </Link>
                        <Link
                          to="/customer/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700"
                        >
                          <User size={14} className="text-slate-500" />
                          <span>My Profile</span>
                        </Link>
                        <div className="border-t border-slate-100 mt-1 pt-1">
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-left cursor-pointer"
                          >
                            <LogOut size={14} />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ) : (
                  <li>
                    <Link
                      to="/customer/login"
                      style={{
                        backgroundColor: headerNav.accountBtnBg || '#059669',
                        color: headerNav.accountBtnText || '#ffffff',
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs hover:opacity-90"
                    >
                      <User size={13} />
                      <span>{headerNav.accountLabel || 'Account / Login'}</span>
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>

          {/* Right Mobile Support / Wallet Button */}
          <div className="md:hidden flex items-center gap-2">
            <NavLink
              to="/customer/wallet"
              className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1"
            >
              <Coins size={13} className="text-amber-600" />
              <span>{isAuthenticated ? `${customer?.walletBalance || 0}` : 'Wallet'}</span>
            </NavLink>
            <NavLink
              to="/complaint/register"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1"
            >
              <FileText size={13} />
              <span>Support</span>
            </NavLink>
          </div>
        </div>
      </header>

      {/* MOBILE THREE-DOT NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
          />

          {/* Left Drawer */}
          <div className="relative w-4/5 max-w-sm bg-slate-900 text-white min-h-full shadow-2xl flex flex-col z-10 border-r border-slate-800">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <EbsLogo
                variant="battery"
                size="sm"
                showText={true}
                customTitle={headerNav.brandTitle}
                customSubtitle={headerNav.brandSubtitle}
              />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Customer Account Section in Mobile Drawer */}
              {isAuthenticated && customer ? (
                <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-xs">{customer.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{customer.customerId}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                        <Coins size={12} />
                        <span>{customer.walletBalance || 0} Coins</span>
                      </span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-700/80 flex gap-2">
                    <Link
                      to="/customer/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-center text-[11px] font-bold"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-center text-[11px] font-semibold text-red-300"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-900/60 to-emerald-800/40 border border-emerald-700/50 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">Join Ekosmart Rewards</p>
                    <p className="text-[10px] text-emerald-300">Earn Coins on Showroom Purchases</p>
                  </div>
                  <Link
                    to="/customer/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-black"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Dynamic Navigation Links */}
              <div>
                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles size={12} />
                  <span>Portal Navigation</span>
                </div>
                <nav className="space-y-1">
                  {(headerNav.showHome ?? true) && (
                    <NavLink
                      to="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                          isActive
                            ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700/50'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`
                      }
                    >
                      <span className="flex items-center gap-2.5">
                        <Home size={15} className="text-emerald-400" />
                        <span>{headerNav.homeLabel || 'Home'}</span>
                      </span>
                      <ChevronRight size={14} className="text-slate-600" />
                    </NavLink>
                  )}

                  {(headerNav.showWallet ?? true) && (
                    <NavLink
                      to="/customer/wallet"
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                          isActive
                            ? 'bg-amber-900/50 text-amber-400 border border-amber-700/50'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`
                      }
                    >
                      <span className="flex items-center gap-2.5">
                        <Coins size={15} className="text-amber-400" />
                        <span>{headerNav.walletLabel || 'My Wallet'} ({customer?.walletBalance || 0} Coins)</span>
                      </span>
                      <ChevronRight size={14} className="text-slate-600" />
                    </NavLink>
                  )}

                  {(headerNav.showRefer ?? true) && (
                    <NavLink
                      to="/customer/referrals"
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                          isActive
                            ? 'bg-purple-900/50 text-purple-400 border border-purple-700/50'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`
                      }
                    >
                      <span className="flex items-center gap-2.5">
                        <Gift size={15} className="text-purple-400" />
                        <span>{headerNav.referLabel || 'My Referrals'} ({customer?.referralCode || 'Referral Code'})</span>
                      </span>
                      <ChevronRight size={14} className="text-slate-600" />
                    </NavLink>
                  )}

                  <NavLink
                    to="/customer/purchases"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-blue-900/50 text-blue-400 border border-blue-700/50'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <span className="flex items-center gap-2.5">
                      <ShoppingBag size={15} className="text-blue-400" />
                      <span>My Purchases & Bills</span>
                    </span>
                    <ChevronRight size={14} className="text-slate-600" />
                  </NavLink>

                  <NavLink
                    to="/showroom-billing"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-blue-900/50 text-blue-400 border border-blue-700/50'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <span className="flex items-center gap-2.5">
                      <Receipt size={15} className="text-blue-400" />
                      <span>Showroom Billing Counter</span>
                    </span>
                    <ChevronRight size={14} className="text-slate-600" />
                  </NavLink>

                  <NavLink
                    to="/warranty/check"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700/50'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <span className="flex items-center gap-2.5">
                      <ShieldCheck size={15} className="text-purple-400" />
                      <span>Check Battery Warranty</span>
                    </span>
                    <ChevronRight size={14} className="text-slate-600" />
                  </NavLink>

                  <NavLink
                    to="/complaint/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700/50'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <span className="flex items-center gap-2.5">
                      <FileText size={15} className="text-emerald-400" />
                      <span>Support Ticket</span>
                    </span>
                    <ChevronRight size={14} className="text-slate-600" />
                  </NavLink>

                  <NavLink
                    to="/complaint/track"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700/50'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <span className="flex items-center gap-2.5">
                      <Search size={15} className="text-blue-400" />
                      <span>Track Support Ticket</span>
                    </span>
                    <ChevronRight size={14} className="text-slate-600" />
                  </NavLink>

                  <NavLink
                    to="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700/50'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <span className="flex items-center gap-2.5">
                      <Phone size={15} className="text-amber-400" />
                      <span>Contact Us</span>
                    </span>
                    <ChevronRight size={14} className="text-slate-600" />
                  </NavLink>

                  {/* Softcoded Custom Nav Links */}
                  {(headerNav.customNavItems || [])
                    .filter((item) => item.isVisible !== false)
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map((item) => (
                      <div key={item.id}>
                        {item.isExternal || item.href.startsWith('http') ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
                          >
                            <span>{item.label}</span>
                            <ExternalLink size={12} className="text-slate-500" />
                          </a>
                        ) : (
                          <NavLink
                            to={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                                isActive
                                  ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700/50'
                                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                              }`
                            }
                          >
                            <span>{item.label}</span>
                            <ChevronRight size={14} className="text-slate-600" />
                          </NavLink>
                        )}
                      </div>
                    ))}
                </nav>
              </div>

              {/* Staff & Admin Access Section */}
              <div className="pt-4 border-t border-slate-800">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Staff & Management Login
                </div>
                <div className="space-y-2">
                  <a
                    href={ADMIN_PORTAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 transition group"
                  >
                    <span className="flex items-center gap-2 font-bold">
                      <Lock size={15} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span>Admin Management Portal</span>
                    </span>
                    <ExternalLink size={13} className="text-slate-400" />
                  </a>

                  <a
                    href={EMPLOYEE_PORTAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 transition group"
                  >
                    <span className="flex items-center gap-2 font-bold">
                      <UserCheck size={15} className="text-blue-400 group-hover:scale-110 transition-transform" />
                      <span>Employee & Billing Portal</span>
                    </span>
                    <ExternalLink size={13} className="text-slate-400" />
                  </a>
                </div>
              </div>

              {/* Helpline Quick Contact (Clickable Hotline & Links) */}
              <div className="p-3.5 bg-emerald-950/60 border border-emerald-800/50 rounded-2xl text-xs space-y-2.5">
                <div className="font-bold text-emerald-300 flex items-center justify-between">
                  <span>Customer Support Hotline</span>
                  <span className="text-[10px] text-emerald-400/80 font-normal">Tap to Call</span>
                </div>
                <div className="space-y-1.5">
                  <a
                    href={`tel:${(footer.phone || '+918949049003').replace(/\s+/g, '')}`}
                    className="flex items-center gap-2 text-slate-200 hover:text-emerald-400 font-mono text-xs font-bold transition"
                  >
                    <Phone size={13} className="text-emerald-400" />
                    <span>{footer.phone || '+91 8949049003'}</span>
                  </a>

                  {(footer.showWhatsapp ?? true) && (
                    <a
                      href={getWhatsAppUrl(footer.whatsappNumber || footer.phone, footer.whatsappText)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-emerald-300 hover:text-emerald-200 font-semibold text-xs transition"
                    >
                      <WhatsAppIcon size={14} className="text-emerald-400" />
                      <span>WhatsApp: {footer.whatsappNumber || footer.phone || '+91 8949049003'}</span>
                    </a>
                  )}

                  <a
                    href={`mailto:${footer.email || 'support@ekosmartdrive.in'}`}
                    className="flex items-center gap-2 text-slate-400 hover:text-blue-400 text-[11px] font-mono transition"
                  >
                    <Mail size={13} className="text-blue-400" />
                    <span className="truncate">{footer.email || 'support@ekosmartdrive.in'}</span>
                  </a>

                  <a
                    href={footer.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(footer.address || 'Rang Talab, Near by Star Kids School, Kota, Rajasthan - 324002')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-400 hover:text-amber-400 text-[11px] transition"
                  >
                    <MapPin size={13} className="text-amber-400 shrink-0" />
                    <span className="truncate">{footer.address || 'Rang Talab, Kota'}</span>
                  </a>
                </div>

                {/* Mobile Drawer Socials */}
                <div className="pt-2 border-t border-emerald-900/60 flex items-center gap-2">
                  {(footer.showInstagram ?? true) && (
                    <a
                      href={footer.instagramUrl || 'https://www.instagram.com/ekosmartdrive'}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="p-1.5 rounded-lg bg-pink-950/60 border border-pink-800/40 text-pink-400 hover:text-pink-300 transition"
                    >
                      <InstagramIcon size={14} />
                    </a>
                  )}
                  {(footer.showFacebook ?? true) && (
                    <a
                      href={footer.facebookUrl || 'https://www.facebook.com/ekosmartdrive'}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="p-1.5 rounded-lg bg-blue-950/60 border border-blue-800/40 text-blue-400 hover:text-blue-300 transition"
                    >
                      <FacebookIcon size={14} />
                    </a>
                  )}
                  <span className="text-[10px] text-slate-400 ml-auto">{footer.officeHours || '10 AM - 6:30 PM'}</span>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-800 text-center text-[10px] text-slate-500 bg-slate-950">
              Ekosmart Battery Solution (EBS) • 2026
            </div>
          </div>
        </div>
      )}
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Comprehensive Official Footer */}
      <footer className="bg-slate-950 text-slate-400 pt-12 pb-8 mt-auto border-t border-slate-800">
        <div className="container mx-auto px-4 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-800/80">
            {/* Column 1: Brand & Description */}
            <div className="space-y-3">
              {footer.logoType === 'image' && footer.logoImage ? (
                <div className="bg-slate-900/60 p-2 rounded-xl inline-block border border-slate-800">
                  <img
                    src={resolveImageUrl(footer.logoImage)}
                    alt={footer.companyName || 'Ekosmart Logo'}
                    className="h-12 max-h-14 w-auto max-w-[220px] object-contain"
                  />
                </div>
              ) : (
                <EbsLogo variant="battery" size="md" showText={true} />
              )}
              <p className="text-xs text-slate-400 leading-relaxed pt-2">
                High Charging Power • Long Life • Low Maintenance. Official manufacturer & distributor of advanced Lithium-ion and LFP batteries for E-Scooters & E-Rickshaws.
              </p>
              <div className="text-[11px] font-mono text-emerald-400 pt-1">
                GSTIN: {footer.gstin || '08DTUPM4205B1Z0'}
              </div>

              {/* Social Media & WhatsApp Suite (100% Soft-Coded) */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Official Channels & Socials
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {(footer.showInstagram ?? true) && (
                    <a
                      href={footer.instagramUrl || 'https://www.instagram.com/ekosmartdrive'}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Ekosmart on Instagram"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-orange-600/20 hover:from-pink-600/30 hover:via-purple-600/30 hover:to-orange-600/30 text-pink-300 hover:text-pink-200 border border-pink-500/30 transition text-xs font-semibold group shadow-xs"
                      title="Follow us on Instagram"
                    >
                      <InstagramIcon size={14} className="group-hover:scale-110 transition-transform text-pink-400" />
                      <span>Instagram</span>
                    </a>
                  )}

                  {(footer.showFacebook ?? true) && (
                    <a
                      href={footer.facebookUrl || 'https://www.facebook.com/ekosmartdrive'}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Ekosmart on Facebook"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-blue-200 border border-blue-500/30 transition text-xs font-semibold group shadow-xs"
                      title="Connect on Facebook"
                    >
                      <FacebookIcon size={14} className="group-hover:scale-110 transition-transform text-blue-400" />
                      <span>Facebook</span>
                    </a>
                  )}

                  {(footer.showWhatsapp ?? true) && (
                    <a
                      href={getWhatsAppUrl(footer.whatsappNumber || footer.phone, footer.whatsappText)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Chat with Ekosmart on WhatsApp"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-emerald-200 border border-emerald-500/40 transition text-xs font-bold group shadow-xs"
                      title="Direct WhatsApp Support"
                    >
                      <WhatsAppIcon size={15} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span>{footer.whatsappNumber || footer.phone || '+91 8949049003'}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Column 2: Plant & Contact Details (100% Clickable Links) */}
            <div className="space-y-2.5 text-xs">
              <h4 className="text-slate-200 font-bold text-sm tracking-wide mb-3 flex items-center justify-between">
                <span>Headquarters & Plant</span>
              </h4>

              {/* Clickable Map Link */}
              <a
                href={footer.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(footer.address || 'Rang Talab, Near by Star Kids School, Kota, Rajasthan - 324002')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 text-slate-300 hover:text-emerald-400 transition group"
                title="Open Plant in Google Maps"
              >
                <MapPin size={16} className="text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="group-hover:underline underline-offset-2">
                  {footer.address || 'Rang Talab, Near by Star Kids School, Kota, Rajasthan - 324002'}
                </span>
              </a>

              {/* Clickable Helpline Phone */}
              <a
                href={`tel:${(footer.phone || '+918949049003').replace(/\s+/g, '')}`}
                className="flex items-center gap-2.5 text-slate-300 hover:text-emerald-400 transition group"
                title="Click to Call Helpline"
              >
                <Phone size={15} className="text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="font-mono">
                  Helpline: <strong className="text-emerald-400 group-hover:underline">{footer.phone || '+91 8949049003'}</strong>
                </span>
              </a>

              {/* Clickable Email */}
              <a
                href={`mailto:${footer.email || 'support@ekosmartdrive.in'}`}
                className="flex items-center gap-2.5 text-slate-300 hover:text-emerald-400 transition group"
                title="Click to Compose Email"
              >
                <Mail size={15} className="text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="font-mono group-hover:underline">{footer.email || 'support@ekosmartdrive.in'}</span>
              </a>

              {/* Clickable WhatsApp Hotline */}
              {(footer.showWhatsapp ?? true) && (
                <a
                  href={getWhatsAppUrl(footer.whatsappNumber || footer.phone, footer.whatsappText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-emerald-300 hover:text-emerald-200 transition group font-semibold"
                  title="Chat with Technical Team on WhatsApp"
                >
                  <WhatsAppIcon size={15} className="text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-mono">
                    WhatsApp: <strong className="text-emerald-300 group-hover:underline">{footer.whatsappNumber || footer.phone || '+91 8949049003'}</strong>
                  </span>
                </a>
              )}

              {/* Office Hours */}
              <div className="flex items-center gap-2.5 text-slate-400 pt-0.5">
                <Clock size={15} className="text-emerald-400 shrink-0" />
                <span>Office Hours: {footer.officeHours || '10:00 AM to 6:30 PM (Mon - Sat)'}</span>
              </div>

              {/* Contact Department Dropdown (All items clickable <a> links) */}
              {(footer.showContactDropdown ?? true) && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setFooterContactDropdownOpen(!footerContactDropdownOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-700/80 rounded-xl text-xs text-slate-200 transition group shadow-xs cursor-pointer"
                    aria-expanded={footerContactDropdownOpen}
                  >
                    <span className="flex items-center gap-2 font-bold text-emerald-400">
                      <Phone size={13} className="text-emerald-400" />
                      <span>{footer.contactDropdownTitle || 'Quick Department Directory'}</span>
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-slate-400 transition-transform ${
                        footerContactDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {footerContactDropdownOpen && (
                    <div className="mt-2 p-2 bg-slate-900/95 border border-slate-700/80 rounded-xl space-y-1.5 shadow-xl text-[11px] animate-in fade-in max-h-96 overflow-y-auto">
                      <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Direct Department Desks</span>
                        <span className="text-emerald-400 font-mono">({activeDivisions.length} Active)</span>
                      </div>

                      {activeDivisions.map((opt) => {
                        const divContact = getDivContact(opt);
                        const cleanPhone = (divContact.phone || footer.phone || '+918949049003').replace(/[^0-9+]/g, '');
                        const cleanWa = (divContact.whatsapp || divContact.phone || footer.whatsappNumber || '918949049003').replace(/[^0-9]/g, '');
                        const waUrl = `https://wa.me/${cleanWa.length === 10 ? `91${cleanWa}` : cleanWa}?text=${encodeURIComponent(`Hello Ekosmart ${opt}, I have an inquiry.`)}`;

                        return (
                          <div
                            key={opt}
                            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 transition space-y-1"
                          >
                            <div className="flex items-center justify-between gap-1">
                              <NavLink
                                to={`/contact?division=${encodeURIComponent(opt)}`}
                                className="font-semibold text-xs text-slate-100 hover:text-emerald-400 transition"
                              >
                                {opt}
                              </NavLink>
                              {divContact.inCharge && (
                                <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                                  {divContact.inCharge}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-[11px] pt-0.5 border-t border-slate-700/40">
                              <a
                                href={`tel:${cleanPhone}`}
                                className="font-mono text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                                title="Click to call"
                              >
                                <Phone size={10} />
                                <span>{divContact.phone || footer.phone}</span>
                              </a>
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-300 hover:underline flex items-center gap-1 font-semibold"
                                title="Chat on WhatsApp"
                              >
                                <WhatsAppIcon size={11} />
                                <span>WhatsApp</span>
                              </a>
                              {divContact.email && (
                                <a
                                  href={`mailto:${divContact.email}`}
                                  className="text-blue-400 hover:underline flex items-center gap-1 truncate max-w-[110px]"
                                  title="Send email"
                                >
                                  <Mail size={10} />
                                  <span>Email</span>
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      <div className="pt-1 border-t border-slate-800 space-y-1">
                        <a
                          href={footer.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(footer.address || 'Rang Talab, Near by Star Kids School, Kota, Rajasthan - 324002')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-200 hover:text-amber-400 transition"
                        >
                          <span className="font-semibold">🏭 Kota Plant Navigation</span>
                          <span className="text-amber-400 text-[10px]">Google Maps &rarr;</span>
                        </a>
                        <NavLink
                          to="/contact"
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-200 hover:text-emerald-400 transition font-bold"
                        >
                          <span>📞 View Full Contact Directory</span>
                          <ChevronRight size={12} className="text-slate-400" />
                        </NavLink>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Column 3 & Custom Columns: Support, Divisions, or Softcoded Columns */}
            {footer.columns && footer.columns.length > 0 ? (
              footer.columns.map((col, idx) => (
                <div key={col.id || idx} className="space-y-2 text-xs">
                  <h4 className="text-slate-200 font-bold text-sm tracking-wide mb-3">{col.title}</h4>
                  <ul className="space-y-2.5 font-medium">
                    {(col.links || []).map((lnk, lIdx) => (
                      <li key={lIdx}>
                        {lnk.isExternal || lnk.href.startsWith('http') || lnk.href.startsWith('tel:') || lnk.href.startsWith('mailto:') ? (
                          <a
                            href={lnk.href}
                            target={lnk.isExternal ? '_blank' : '_self'}
                            rel="noopener noreferrer"
                            className="hover:text-emerald-400 transition flex items-center gap-1.5"
                          >
                            <span>{lnk.label}</span>
                            {lnk.isExternal && <ExternalLink size={10} className="text-slate-500" />}
                          </a>
                        ) : (
                          <NavLink to={lnk.href} className="hover:text-emerald-400 transition flex items-center gap-1.5">
                            <span>{lnk.label}</span>
                          </NavLink>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <div className="space-y-2 text-xs">
                <h4 className="text-slate-200 font-bold text-sm tracking-wide mb-3">Support & Services</h4>
                <ul className="space-y-2.5 font-medium">
                  <li>
                    <NavLink to="/customer/wallet" className="hover:text-amber-400 transition flex items-center gap-2">
                      <Coins size={13} className="text-amber-400" />
                      <span>Customer Wallet & Coins</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/customer/referrals" className="hover:text-purple-400 transition flex items-center gap-2">
                      <Gift size={13} className="text-purple-400" />
                      <span>Referral Program (+500 Coins)</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/showroom-billing" className="hover:text-blue-400 transition flex items-center gap-2">
                      <Receipt size={13} className="text-blue-400" />
                      <span>Showroom Counter Invoicing</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/complaint/register" className="hover:text-emerald-400 transition flex items-center gap-2">
                      <FileText size={13} className="text-emerald-400" />
                      <span>Support (Register Ticket)</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/complaint/track" className="hover:text-emerald-400 transition flex items-center gap-2">
                      <Search size={13} className="text-blue-400" />
                      <span>Track Ticket Status</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/warranty/check" className="hover:text-emerald-400 transition flex items-center gap-2">
                      <ShieldCheck size={13} className="text-purple-400" />
                      <span>Check Battery Warranty</span>
                    </NavLink>
                  </li>
                </ul>
              </div>
            )}

            {/* Column 4: Official Policies & Legal + Staff Access */}
            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <h4 className="text-slate-200 font-bold text-sm tracking-wide mb-3">Policies & Information</h4>
                <ul className="space-y-2.5 font-medium">
                  {footer.showTermsConditions && (
                    <li>
                      <NavLink to="/terms-conditions" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                        <span>• Terms & Conditions (Battery Policy)</span>
                      </NavLink>
                    </li>
                  )}
                  {footer.showPrivacyPolicy && (
                    <li>
                      <NavLink to="/privacy-policy" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                        <span>• Privacy Policy & Battery Telemetry</span>
                      </NavLink>
                    </li>
                  )}
                  {footer.showRefundPolicy && (
                    <li>
                      <NavLink to="/refund-policy" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                        <span>• Refund & Battery Replacement Terms</span>
                      </NavLink>
                    </li>
                  )}
                </ul>
              </div>

              {/* Staff Portals Quick Launch */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">Staff & Admin Access</span>
                <div className="flex flex-col gap-1.5">
                  <a
                    href={ADMIN_PORTAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between px-2.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 transition group text-[11px]"
                  >
                    <span className="flex items-center gap-1.5">
                      <Lock size={12} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span>Admin Management Portal</span>
                    </span>
                    <ExternalLink size={10} className="text-slate-500 group-hover:text-emerald-400" />
                  </a>
                  <a
                    href={EMPLOYEE_PORTAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between px-2.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-blue-400 border border-slate-800 transition group text-[11px]"
                  >
                    <span className="flex items-center gap-1.5">
                      <UserCheck size={12} className="text-blue-400 group-hover:scale-110 transition-transform" />
                      <span>Employee & Billing Portal</span>
                    </span>
                    <ExternalLink size={10} className="text-slate-500 group-hover:text-blue-400" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-xs space-y-2 text-slate-500">
            {footer.disclaimer && (
              <p className="max-w-2xl mx-auto text-[11px] leading-relaxed">{footer.disclaimer}</p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400 pt-1">
              <span>&copy; {footer.copyrightText || `${new Date().getFullYear()} Ekosmart Battery Solution. All rights reserved.`}</span>
              <span className="text-slate-700 hidden sm:inline">•</span>
              <a href={ADMIN_PORTAL_URL} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition flex items-center gap-1">
                <Lock size={11} className="text-emerald-400" />
                <span>Admin Login</span>
              </a>
              <span className="text-slate-700 hidden sm:inline">•</span>
              <a href={EMPLOYEE_PORTAL_URL} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition flex items-center gap-1">
                <UserCheck size={11} className="text-blue-400" />
                <span>Employee Workspace</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* 20-Second Timed Customer Login Modal */}
      <CustomerLoginModal
        isOpen={loginModalOpen}
        onClose={handleCloseLoginModal}
        title={loginTimerConfig.title}
        message={loginTimerConfig.message}
      />
    </div>
  );
};

export default Layout;
