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
} from 'lucide-react';
import { API_BASE, ADMIN_PORTAL_URL, EMPLOYEE_PORTAL_URL, resolveImageUrl } from '../config/api';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import CustomerLoginModal from './CustomerLoginModal';

interface HeaderLogoContent {
  logoType?: 'preset' | 'image';
  logoImage?: string;
}

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
}

const defaultFooter: FooterContent = {
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
};

const Layout = () => {
  const { customer, isAuthenticated, logout } = useCustomerAuth();
  const [footer, setFooter] = useState<FooterContent>(defaultFooter);
  const [headerLogo, setHeaderLogo] = useState<HeaderLogoContent>({ logoType: 'preset', logoImage: '' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
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

  // Close drawers & dropdowns on route transition
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Load public CMS branding & login timer configurations
  useEffect(() => {
    fetch(`${API_BASE}/content/public`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          if (data.data.footer) {
            setFooter({ ...defaultFooter, ...data.data.footer });
          }
          if (data.data.hero) {
            setHeaderLogo({
              logoType: data.data.hero.logoType || 'preset',
              logoImage: data.data.hero.logoImage || '',
            });
          }
          if (data.data.customerLoginTimer) {
            setLoginTimerConfig((prev) => ({
              ...prev,
              ...data.data.customerLoginTimer,
            }));
          }
        }
      })
      .catch((err) => {
        console.warn('Failed to load dynamic CMS footer/header branding, using defaults:', err);
      });
  }, []);

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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Notification Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 border-b border-slate-800">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Phone size={12} />
              <span>Helpline: {footer.phone || '+91 8949049003'}</span>
            </span>
            <span className="hidden sm:flex items-center gap-1 text-slate-400">
              <Clock size={12} />
              <span>{footer.officeHours || '10:00 AM to 6:30 PM'}</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hidden md:inline font-mono">GSTIN: {footer.gstin || '08DTUPM4205B1Z0'}</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <MapPin size={12} />
              <span>Kota, Rajasthan</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Header with Official EBS Logo, Navigation & Customer Wallet */}
      <header className="bg-white shadow-xs border-b border-slate-200 sticky top-0 z-30">
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
              {headerLogo.logoType === 'image' && headerLogo.logoImage ? (
                <img
                  src={resolveImageUrl(headerLogo.logoImage)}
                  alt="Ekosmart Logo"
                  className="h-11 max-h-13 w-auto max-w-[200px] object-contain"
                />
              ) : (
                <EbsLogo variant="battery" size="md" />
              )}
            </NavLink>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-5 text-xs font-bold text-slate-800">
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
                  <span>Home</span>
                </NavLink>
              </li>

              {/* Customer Wallet Option */}
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
                  <span>Wallet & Coins</span>
                  {isAuthenticated && (
                    <span className="bg-amber-200 text-amber-950 text-[10px] px-1.5 py-0.5 rounded-md font-black">
                      {customer?.walletBalance ?? 0}
                    </span>
                  )}
                </NavLink>
              </li>

              {/* Refer & Earn (+500 Coins) Option */}
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
                  <span>Refer & Earn (+500)</span>
                </NavLink>
              </li>

              {/* Customer Account / Login Profile if authenticated */}
              {isAuthenticated && customer ? (
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
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                  >
                    <User size={13} />
                    <span>Account / Login</span>
                  </Link>
                </li>
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
              <EbsLogo variant="battery" size="sm" showText={true} />
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
                    <p className="text-[10px] text-emerald-300">+500 Welcome Coins on Signup</p>
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
                      <span>Home</span>
                    </span>
                    <ChevronRight size={14} className="text-slate-600" />
                  </NavLink>

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
                      <span>My Wallet ({customer?.walletBalance || 0} Coins)</span>
                    </span>
                    <ChevronRight size={14} className="text-slate-600" />
                  </NavLink>

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
                      <span>My Referrals ({customer?.referralCode || 'Referral Code'})</span>
                    </span>
                    <ChevronRight size={14} className="text-slate-600" />
                  </NavLink>

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

              {/* Helpline Quick Contact */}
              <div className="p-3.5 bg-emerald-950/60 border border-emerald-800/50 rounded-2xl text-xs space-y-1.5">
                <div className="font-bold text-emerald-300">Customer Support Helpline</div>
                <div className="text-slate-300 font-mono text-[11px]">{footer.phone || '+91 8949049003'}</div>
                <div className="text-slate-400 text-[10px]">{footer.officeHours || '10:00 AM - 6:30 PM (Mon-Sat)'}</div>
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
            </div>

            {/* Column 2: Plant & Contact Details */}
            <div className="space-y-2 text-xs">
              <h4 className="text-slate-200 font-bold text-sm tracking-wide mb-3">Headquarters & Plant</h4>
              <div className="flex items-start gap-2.5 text-slate-400">
                <MapPin size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{footer.address || 'Plot No. 14, Electronic Complex, Road No. 1, IPIA, Kota, Rajasthan - 324005'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <Phone size={15} className="text-emerald-400 flex-shrink-0" />
                <span>Helpline: {footer.phone || '+91 8949049003'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <Mail size={15} className="text-emerald-400 flex-shrink-0" />
                <span>{footer.email || 'support@ekosmartdrive.in'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <Clock size={15} className="text-emerald-400 flex-shrink-0" />
                <span>Office Hours: {footer.officeHours || '10:00 AM to 6:30 PM (Mon - Sat)'}</span>
              </div>
            </div>

            {/* Column 3: Customer Support & Services */}
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
