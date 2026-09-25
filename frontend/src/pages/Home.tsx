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

interface HeroContent {
  heading: string;
  subheading: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  logoType?: 'preset' | 'image';
  logoImage?: string;
}

const defaultHero: HeroContent = {
  heading: 'Ekosmart Battery Solution (EBS)\nHigh Power Lithium-Ion & LFP Battery Packs',
  subheading: 'High Charging Power • Long Life • Low Maintenance. Official customer support portal for EV scooter & E-rickshaw batteries, genuine spare parts, and warranty verification.',
  primaryButtonText: 'Register Complaint',
  primaryButtonLink: '/complaint/register',
  secondaryButtonText: 'Check Battery Warranty',
  secondaryButtonLink: '/warranty/check',
  logoType: 'preset',
  logoImage: '',
};

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

const Home = () => {
  const [hero, setHero] = useState<HeroContent>(defaultHero);
  const [cards, setCards] = useState<ServiceCard[]>(defaultCards);
  const [selectedSection, setSelectedSection] = useState<string>('all');

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
        }
      })
      .catch((err) => {
        console.warn('Failed to load dynamic CMS content, using defaults:', err);
      });
  }, []);

  const uniqueSections = Array.from(new Set(cards.map((c) => c.section || 'General')));
  const filteredCards =
    selectedSection === 'all'
      ? cards
      : cards.filter((c) => (c.section || 'General').toLowerCase() === selectedSection.toLowerCase());

  return (
    <div className="space-y-12 -mt-8">
      {/* Dynamic Hero Section with EBS Lithium-Ion Theme */}
      <section className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-800 text-white py-16 md:py-20 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10">
          {hero.logoType === 'image' && hero.logoImage ? (
            <div className="flex flex-col items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 inline-block shadow-lg">
                <img
                  src={resolveImageUrl(hero.logoImage)}
                  alt="Brand Logo"
                  className="h-14 max-h-16 w-auto max-w-[240px] object-contain"
                />
              </div>

              <div className="inline-flex items-center gap-2 bg-emerald-800/60 border border-emerald-500/40 px-4 py-1.5 rounded-full text-emerald-300 text-xs font-bold tracking-widest uppercase">
                <Sparkles size={14} />
                <span>Official EBS Battery Solution Portal • Kota, Rajasthan</span>
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-emerald-800/60 border border-emerald-500/40 px-4 py-1.5 rounded-full text-emerald-300 text-xs font-bold tracking-widest uppercase">
              <Sparkles size={14} />
              <span>Official EBS Battery Solution Portal • Kota, Rajasthan</span>
            </div>
          )}

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight whitespace-pre-line leading-tight">
            {hero.heading}
          </h1>

          <p className="text-lg md:text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            {hero.subheading}
          </p>

          {/* 3 Core Highlights from Official Brochure */}
          <div className="flex flex-wrap justify-center gap-6 pt-2 pb-2">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/10 text-xs font-bold">
              <Zap className="text-yellow-400" size={16} />
              <span>High Charging Power</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/10 text-xs font-bold">
              <Battery className="text-green-400" size={16} />
              <span>Long Life (3 & 1.5 Year Warranty)</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/10 text-xs font-bold">
              <Wrench className="text-teal-300" size={16} />
              <span>Low Maintenance</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {hero.primaryButtonText && (
              <Link
                to={hero.primaryButtonLink || '/complaint/register'}
                className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-full transition shadow-xl hover:shadow-emerald-500/30 text-sm tracking-wide"
              >
                {hero.primaryButtonText}
              </Link>
            )}
            {hero.secondaryButtonText && (
              <a
                href={hero.secondaryButtonLink || '/warranty/check'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border border-white/20 transition shadow-lg text-sm inline-flex items-center gap-2"
              >
                <span>{hero.secondaryButtonText}</span>
                <ExternalLink size={14} className="text-emerald-300" />
              </a>
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
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
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
                  {card.linkUrl.includes('warranty') || card.linkUrl.startsWith('http') ? (
                    <a
                      href={card.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full bg-white ${styles.btnText} font-bold py-3 px-5 rounded-full text-xs transition shadow-md flex items-center justify-center gap-1.5`}
                    >
                      <span>{card.buttonText || 'Select Division'}</span>
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <Link
                      to={card.linkUrl}
                      className={`block w-full bg-white ${styles.btnText} font-bold py-3 px-5 rounded-full text-xs transition shadow-md text-center`}
                    >
                      {card.buttonText || 'Select Division'}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Access Utility Actions Bar */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-wrap items-center justify-around gap-6 text-center">
          <Link
            to="/complaint/track"
            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
              <Search size={22} />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition">Track Ticket</h4>
              <p className="text-[11px] text-slate-400">Live complaint inspection status</p>
            </div>
          </Link>

          <div className="hidden md:block w-px h-10 bg-slate-200"></div>

          <a
            href="/warranty/register"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition">
              <ShieldCheck size={22} />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm text-slate-800 group-hover:text-amber-600 transition">Warranty Registration</h4>
                <ExternalLink size={12} className="text-slate-400 group-hover:text-amber-600" />
              </div>
              <p className="text-[11px] text-slate-400">Register new sales & serial number</p>
            </div>
          </a>

          <div className="hidden md:block w-px h-10 bg-slate-200"></div>

          <a
            href="/warranty/check"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
              <ShieldAlert size={22} />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm text-slate-800 group-hover:text-emerald-600 transition">Check Warranty</h4>
                <ExternalLink size={12} className="text-slate-400 group-hover:text-emerald-600" />
              </div>
              <p className="text-[11px] text-slate-400">3-Yr (48V) & 1.5-Yr (60V/72V) status</p>
            </div>
          </a>

          <div className="hidden md:block w-px h-10 bg-slate-200"></div>

          <Link
            to="/contact"
            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition group"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition">
              <Phone size={22} />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-sm text-slate-800 group-hover:text-purple-600 transition">Contact Directory</h4>
              <p className="text-[11px] text-slate-400">Kota Plant +91 8949049003</p>
            </div>
          </Link>
        </div>
      </section>

      {/* EBS Battery Technical Highlights Banner */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 md:p-12 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-block bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
              GET HIGH POWER OF LITHIUM
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold leading-tight">
              Genuine Li-ion & LFP Batteries For E-Scooter & E-Rickshaw
            </h3>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              Engineered with advanced Smart BMS, thermal protection, and high energy density cells. Tested at our Kota plant with Pan-India dispatch & replacement support.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-300 pt-2">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 size={16} />
                <span>48V Series (3 Year Warranty)</span>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 size={16} />
                <span>60V / 72V Series (1.5 Year Warranty)</span>
              </span>
            </div>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 text-center space-y-3 flex-shrink-0 w-full md:w-72">
            <EbsLogo variant="battery" size="lg" showText={false} className="justify-center" />
            <h4 className="font-bold text-sm text-white">Need Battery Assistance?</h4>
            <p className="text-[11px] text-slate-400">Contact our factory technical engineers in Kota, Rajasthan</p>
            <div className="space-y-2 pt-1">
              <a
                href="tel:8949049003"
                className="inline-block w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow"
              >
                Call +91 8949049003
              </a>
              <Link
                to="/contact"
                className="inline-block w-full py-2 bg-white/10 hover:bg-white/20 text-slate-200 font-semibold rounded-xl text-xs transition border border-white/20"
              >
                View Plant Contact Details
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
