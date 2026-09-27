import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
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
} from 'lucide-react';
import { API_BASE, ADMIN_PORTAL_URL, EMPLOYEE_PORTAL_URL, resolveImageUrl } from '../config/api';

interface HeaderLogoContent {
  logoType?: 'preset' | 'image';
  logoImage?: string;
}

interface INavItem {
  id: string;
  label: string;
  url: string;
  icon?: string;
  isVisible: boolean;
  order: number;
  isExternal?: boolean;
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
};

const defaultNavItems: INavItem[] = [
  { id: 'home', label: 'Home', url: '/', isVisible: true, order: 1 },
  { id: 'support', label: 'Support Ticket', url: '/complaint/register', isVisible: true, order: 2 },
  { id: 'track', label: 'Track Ticket', url: '/complaint/track', isVisible: true, order: 3 },
  { id: 'warranty-check', label: 'Check Warranty', url: '/warranty/check', isVisible: true, order: 4 },
  { id: 'warranty-reg', label: 'Register Warranty', url: '/warranty/register', isVisible: true, order: 5 },
  { id: 'contact', label: 'Contact Us', url: '/contact', isVisible: true, order: 6 },
];

const Layout = () => {
  const [footer, setFooter] = useState<FooterContent>(defaultFooter);
  const [headerLogo, setHeaderLogo] = useState<HeaderLogoContent>({ logoType: 'preset', logoImage: '' });
  const [navItems, setNavItems] = useState<INavItem[]>(defaultNavItems);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile drawer on route transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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
          if (data.data.navigation && Array.isArray(data.data.navigation) && data.data.navigation.length > 0) {
            const activeNav = data.data.navigation.filter((n: INavItem) => n.isVisible !== false);
            if (activeNav.length > 0) {
              setNavItems(activeNav.sort((a: INavItem, b: INavItem) => (a.order || 0) - (b.order || 0)));
            }
          }
        }
      })
      .catch((err) => {
        console.warn('Failed to load dynamic CMS footer/header branding, using defaults:', err);
      });
  }, []);

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

      {/* Main Header with Official EBS Logo / Custom Dynamic Logo & Left 3-Dot Menu */}
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
            <ul className="flex items-center space-x-6 text-xs lg:text-sm font-bold text-slate-800">
              {navItems.slice(0, 5).map((item) => (
                <li key={item.id || item.url}>
                  {item.isExternal ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-emerald-700 flex items-center gap-1.5 transition"
                    >
                      <span>{item.label}</span>
                      <ExternalLink size={12} className="text-slate-400" />
                    </a>
                  ) : (
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? 'text-emerald-700 flex items-center gap-1.5 border-b-2 border-emerald-600 pb-1'
                          : 'hover:text-emerald-700 flex items-center gap-1.5 transition'
                      }
                    >
                      {item.url.includes('complaint') && <FileText className="h-4 w-4 text-emerald-600" />}
                      {item.url.includes('warranty') && <ShieldCheck className="h-4 w-4 text-emerald-600" />}
                      {item.url.includes('contact') && <Phone className="h-4 w-4 text-emerald-600" />}
                      <span>{item.label}</span>
                    </NavLink>
                  )}
                </li>
              ))}

              {/* Staff Portal Shortcut */}
              <li>
                <a
                  href={ADMIN_PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  <Lock size={12} className="text-emerald-400" />
                  <span>Admin</span>
                </a>
              </li>
            </ul>
          </nav>

          {/* Right Mobile Support Button */}
          <div className="md:hidden flex items-center gap-2">
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
              {/* Dynamic Navigation Links */}
              <div>
                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles size={12} />
                  <span>Portal Navigation</span>
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.id || item.url}
                      to={item.url}
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
                        {item.url === '/' && <Home size={15} className="text-emerald-400" />}
                        {item.url.includes('complaint/register') && <FileText size={15} className="text-emerald-400" />}
                        {item.url.includes('complaint/track') && <Search size={15} className="text-blue-400" />}
                        {item.url.includes('warranty') && <ShieldCheck size={15} className="text-purple-400" />}
                        {item.url.includes('contact') && <Phone size={15} className="text-amber-400" />}
                        <span>{item.label}</span>
                      </span>
                      <ChevronRight size={14} className="text-slate-600" />
                    </NavLink>
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
                      <span>Employee & Technician Portal</span>
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
                <span>{footer.address || 'Rang Talab, Near by Star Kids School, Kota, Rajasthan - 324002'}</span>
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
                  <NavLink to="/warranty/check" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition flex items-center gap-2">
                    <ShieldCheck size={13} className="text-purple-400" />
                    <span>Check Battery Warranty</span>
                    <ExternalLink size={11} className="text-slate-500" />
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/warranty/register" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition flex items-center gap-2">
                    <ShieldCheck size={13} className="text-amber-400" />
                    <span>Register Product / Warranty</span>
                    <ExternalLink size={11} className="text-slate-500" />
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/contact" className="hover:text-emerald-400 transition flex items-center gap-2">
                    <Phone size={13} className="text-emerald-400" />
                    <span>Contact Us & Helpline</span>
                  </NavLink>
                </li>
                <li className="pt-1.5 border-t border-slate-800/80">
                  <a
                    href={ADMIN_PORTAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-400 transition flex items-center gap-2 text-slate-400 hover:text-emerald-300"
                  >
                    <Lock size={13} className="text-emerald-400" />
                    <span>Admin Portal</span>
                    <ExternalLink size={11} className="text-slate-500" />
                  </a>
                </li>
                <li>
                  <a
                    href={EMPLOYEE_PORTAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition flex items-center gap-2 text-slate-400 hover:text-blue-300"
                  >
                    <UserCheck size={13} className="text-blue-400" />
                    <span>Employee Portal</span>
                    <ExternalLink size={11} className="text-slate-500" />
                  </a>
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
                      <span>Employee & Technician Portal</span>
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
    </div>
  );
};

export default Layout;
