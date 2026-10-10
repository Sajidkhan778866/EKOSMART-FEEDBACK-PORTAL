import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Battery,
  ShieldCheck,
  Wrench,
  Phone,
  Mail,
  MapPin,
  Clock,
  Coins,
  Gift,
  Search,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Send,
  Loader2,
  FileText,
  Zap,
  Star,
  Users,
  Award,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { API_BASE, resolveImageUrl } from '../../config/api';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

// Icon Renderer Helper
export const renderDynamicIcon = (name: string, className: string = 'w-5 h-5') => {
  const map: Record<string, React.ReactElement> = {
    battery: <Battery className={className} />,
    shield: <ShieldCheck className={className} />,
    wrench: <Wrench className={className} />,
    phone: <Phone className={className} />,
    mail: <Mail className={className} />,
    location: <MapPin className={className} />,
    clock: <Clock className={className} />,
    coins: <Coins className={className} />,
    gift: <Gift className={className} />,
    search: <Search className={className} />,
    star: <Star className={className} />,
    users: <Users className={className} />,
    award: <Award className={className} />,
    zap: <Zap className={className} />,
    file: <FileText className={className} />,
    check: <CheckCircle2 className={className} />,
    sparkles: <Sparkles className={className} />,
    shopping: <ShoppingBag className={className} />,
  };
  return map[name?.toLowerCase()] || <Zap className={className} />;
};

/* =========================================================================
   1. HERO BANNER
   ========================================================================= */
export const HeroBanner: React.FC<{ props: any }> = ({ props = {} }) => {
  const {
    badgeText = '⚡ Leading EV Battery Support Ecosystem in Rajasthan',
    title = 'Reliable EV Battery Support &',
    titleHighlight = 'Certified Warranty Management',
    subtitle = 'Register battery warranty, file quick support tickets, earn customer referral coins, and check vehicle service histories in real-time.',
    ctaPrimaryText = 'Register Complaint',
    ctaPrimaryLink = '/complaint/register',
    ctaSecondaryText = 'Check Battery Warranty',
    ctaSecondaryLink = '/warranty/check',
    imageUrl = '',
    showStats = true,
    stats = [
      { number: '15,000+', label: 'Batteries Serviced' },
      { number: '99.4%', label: 'Resolution Rate' },
      { number: '< 24 Hrs', label: 'Response Time' },
    ],
  } = props;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white shadow-2xl p-8 md:p-14 my-4">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          {badgeText && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold tracking-wide">
              <Sparkles size={14} className="text-emerald-400" />
              <span>{badgeText}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            {title}{' '}
            {titleHighlight && (
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-300 bg-clip-text text-transparent">
                {titleHighlight}
              </span>
            )}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl">
            {subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            {ctaPrimaryText && (
              <Link
                to={ctaPrimaryLink}
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-900/30 transition duration-200 transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>{ctaPrimaryText}</span>
                <ArrowRight size={16} />
              </Link>
            )}

            {ctaSecondaryText && (
              <Link
                to={ctaSecondaryLink}
                className="px-6 py-3.5 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-sm rounded-xl border border-slate-700 transition duration-200 flex items-center gap-2"
              >
                <span>{ctaSecondaryText}</span>
                <ShieldCheck size={16} className="text-emerald-400" />
              </Link>
            )}
          </div>

          {showStats && Array.isArray(stats) && stats.length > 0 && (
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4">
              {stats.map((item: any, idx: number) => (
                <div key={idx} className="space-y-0.5">
                  <p className="text-xl sm:text-2xl font-black text-white">{item.number}</p>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 flex justify-center items-center">
          {imageUrl ? (
            <img
              src={resolveImageUrl(imageUrl)}
              alt="Hero Illustration"
              className="w-full max-w-md object-contain rounded-2xl drop-shadow-2xl border border-slate-700/50"
            />
          ) : (
            <div className="w-full max-w-sm bg-slate-800/60 border border-slate-700/60 backdrop-blur-md rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-400">Live Support System</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">24/7 Portal</span>
              </div>
              <div className="space-y-3">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/50 flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Direct Battery Warranty</h4>
                    <p className="text-[10px] text-slate-400">Instant serial verification & e-cards</p>
                  </div>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/50 flex items-center gap-3">
                  <div className="p-2 bg-teal-500/20 text-teal-400 rounded-lg">
                    <Coins size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Showroom Coin Rewards</h4>
                    <p className="text-[10px] text-slate-400">Coins credited on valid purchases</p>
                  </div>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/50 flex items-center gap-3">
                  <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
                    <Wrench size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Automated Ticket Desk</h4>
                    <p className="text-[10px] text-slate-400">Track technician assignment live</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   2. HEADING TEXT
   ========================================================================= */
export const HeadingText: React.FC<{ props: any }> = ({ props = {} }) => {
  const {
    level = 'h2',
    badge = '',
    text = 'Section Title',
    subtitle = '',
    align = 'center',
  } = props;

  const alignClass =
    align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center';

  return (
    <div className={`space-y-2.5 my-6 ${alignClass}`}>
      {badge && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide">
          <Sparkles size={12} className="text-emerald-600" />
          <span>{badge}</span>
        </div>
      )}
      {level === 'h1' && (
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">{text}</h1>
      )}
      {level === 'h2' && (
        <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">{text}</h2>
      )}
      {level === 'h3' && (
        <h3 className="text-xl md:text-2xl font-bold text-slate-900">{text}</h3>
      )}
      {level === 'h4' && (
        <h4 className="text-lg font-bold text-slate-800">{text}</h4>
      )}
      {subtitle && (
        <p className="text-slate-600 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

/* =========================================================================
   3. RICH TEXT BLOCK
   ========================================================================= */
export const RichTextBlock: React.FC<{ props: any }> = ({ props = {} }) => {
  const { content = '<p>Welcome to Ekosmart.</p>', fontSize = 'base', textColor = 'slate-700' } = props;

  return (
    <div
      className={`prose max-w-none text-${textColor} text-${fontSize} my-4 leading-relaxed`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

/* =========================================================================
   4. SERVICE CARD GRID
   ========================================================================= */
export const ServiceCardGrid: React.FC<{ props: any }> = ({ props = {} }) => {
  const {
    columns = 3,
    cards = [
      {
        icon: 'wrench',
        title: 'Register Support Ticket',
        description: 'File service requests for lithium batteries, spare parts, chargers, and electric vehicles with quick turnaround.',
        linkText: 'Open Ticket',
        linkUrl: '/complaint/register',
        badge: 'Priority Desk',
      },
      {
        icon: 'shield',
        title: 'Battery Warranty Verification',
        description: 'Check active warranty coverage, replacement period, and download official warranty digital certificates.',
        linkText: 'Check Warranty',
        linkUrl: '/warranty/check',
        badge: 'Instant Lookup',
      },
      {
        icon: 'search',
        title: 'Track Ticket Progress',
        description: 'Enter your complaint reference number or mobile number to track real-time resolution status and engineer notes.',
        linkText: 'Track Status',
        linkUrl: '/complaint/track',
        badge: 'Live Tracker',
      },
    ],
  } = props;

  const colClass =
    columns === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : columns === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`grid ${colClass} gap-6 my-6`}>
      {cards.map((card: any, idx: number) => (
        <div
          key={idx}
          className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                {renderDynamicIcon(card.icon, 'w-6 h-6')}
              </div>
              {card.badge && (
                <span className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-full">
                  {card.badge}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              {card.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {card.description}
            </p>
          </div>

          {card.linkUrl && (
            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link
                to={card.linkUrl}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 group-hover:gap-2 transition-all"
              >
                <span>{card.linkText || 'Learn More'}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/* =========================================================================
   5. STATS COUNTER
   ========================================================================= */
export const StatsCounter: React.FC<{ props: any }> = ({ props = {} }) => {
  const {
    counters = [
      { number: '15,000+', label: 'EV Batteries Supplied & Serviced', icon: 'battery' },
      { number: '48+', label: 'Authorized Showrooms & Centers', icon: 'users' },
      { number: '99.4%', label: 'Customer Satisfaction Score', icon: 'star' },
      { number: '< 24h', label: 'Average Support Response Time', icon: 'clock' },
    ],
  } = props;

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 my-8 shadow-xl">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 divide-slate-800">
        {counters.map((c: any, idx: number) => (
          <div key={idx} className="flex flex-col items-center text-center pt-4 sm:pt-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              {renderDynamicIcon(c.icon, 'w-5 h-5')}
            </div>
            <p className="text-2xl sm:text-4xl font-black text-white tracking-tight">{c.number}</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   6. CUSTOMER REFERRAL WIDGET
   ========================================================================= */
export const CustomerReferralWidget: React.FC<{ props: any }> = ({ props = {} }) => {
  const { customer, isAuthenticated } = useCustomerAuth();
  const [copied, setCopied] = useState(false);
  const {
    title = 'Earn Referral Coins on Showroom Purchases',
    subtitle = 'Share your unique referral code with EV friends. When they buy from any Ekosmart showroom, you both earn rewards directly to your wallet!',
    rewardAmount = 500,
  } = props;

  const referralCode = customer?.referralCode || 'EKOSMART';

  const copyCode = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 rounded-3xl p-8 md:p-10 text-white shadow-xl my-6">
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white">
            <Gift size={14} />
            <span>Referral Program</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black">{title}</h3>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed max-w-xl">
            {subtitle}
          </p>
          <div className="flex items-center gap-2 pt-2">
            <div className="px-3 py-1 bg-emerald-500/40 rounded-lg text-xs font-mono font-bold">
              🪙 {rewardAmount} Coins per showroom bill
            </div>
          </div>
        </div>

        <div className="md:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 flex flex-col items-center text-center">
          {isAuthenticated ? (
            <>
              <span className="text-[11px] text-emerald-200 font-semibold uppercase tracking-wider">Your Referral Code</span>
              <div className="mt-2 flex items-center justify-between w-full bg-slate-900/80 px-4 py-2.5 rounded-xl border border-white/10 font-mono text-base font-bold text-emerald-400">
                <span>{referralCode}</span>
                <button
                  type="button"
                  onClick={copyCode}
                  className="p-1.5 hover:bg-slate-800 text-white rounded-lg transition"
                  title="Copy code"
                >
                  {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
              </div>
              <Link
                to="/customer/referrals"
                className="mt-3 w-full py-2 bg-white text-emerald-900 text-xs font-bold rounded-xl hover:bg-emerald-50 transition text-center shadow-xs"
              >
                View Referrals & Earnings
              </Link>
            </>
          ) : (
            <>
              <Coins size={36} className="text-amber-300 mb-2" />
              <p className="text-xs font-bold text-white">Log in to view your referral code</p>
              <p className="text-[10px] text-emerald-200 mt-1">Track rewards and wallet balance</p>
              <Link
                to="/customer/login"
                className="mt-3 w-full py-2.5 bg-white text-emerald-900 text-xs font-bold rounded-xl hover:bg-emerald-50 transition text-center shadow-xs"
              >
                Customer Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   7. ACCORDION FAQ
   ========================================================================= */
export const AccordionFaq: React.FC<{ props: any }> = ({ props = {} }) => {
  const {
    title = 'Frequently Asked Questions',
    subtitle = 'Clear answers to standard warranty, complaint filing, battery maintenance, and reward coin queries.',
    items = [
      {
        question: 'How do I register a complaint or service ticket?',
        answer: 'Navigate to the "Register Complaint" page from the top navigation bar. Enter your contact details, select the product type (Lithium Battery / EV Spare Parts), and describe your issue. You will receive an instant Ticket Reference ID for tracking.',
      },
      {
        question: 'How do I verify battery warranty validity?',
        answer: 'Go to the "Check Warranty" page and enter the battery serial number stamped on your EBS battery casing. The portal will show original purchase date, warranty end date, model capacity, and active status.',
      },
      {
        question: 'How are customer coins credited on showroom billing?',
        answer: 'When you purchase batteries or spare parts at an authorized Ekosmart showroom, provide your registered email or phone number. Coins are automatically credited once the showroom billing invoice is generated.',
      },
      {
        question: 'Can I redeem referral coins for service or battery purchases?',
        answer: 'Yes, your accrued customer wallet coins can be redeemed at checkout in authorized Ekosmart showrooms for discount vouchers or direct bill deductions.',
      },
    ],
  } = props;

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto my-10 px-4">
      {title && (
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{title}</h2>
          {subtitle && <p className="text-slate-600 text-sm">{subtitle}</p>}
        </div>
      )}

      <div className="space-y-3">
        {items.map((item: any, idx: number) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left font-bold text-slate-900 hover:text-emerald-700 flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="text-sm sm:text-base">{item.question}</span>
                <span className="text-slate-400 flex-shrink-0">
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* =========================================================================
   8. DYNAMIC FORM BLOCK
   ========================================================================= */
export const DynamicFormBlock: React.FC<{ props: any }> = ({ props = {} }) => {
  const {
    formKey = 'contact_form',
    title = 'Send Us a Message',
    subtitle = 'Fill out the form below and our technical support desk will respond shortly.',
    submitButtonText = 'Submit Form',
  } = props;

  const [schema, setSchema] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loadingSchema, setLoadingSchema] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<{ success: boolean; message: string; data?: any } | null>(null);

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        setLoadingSchema(true);
        const res = await fetch(`${API_BASE}/frontend-builder/public/form/${formKey}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setSchema(json.data);
            return;
          }
        }
      } catch (err) {
        console.warn('Form schema API error:', err);
      } finally {
        setLoadingSchema(false);
      }
    };
    if (formKey) {
      fetchSchema();
    }
  }, [formKey]);

  const handleChange = (fieldKey: string, val: any) => {
    setFormData((prev) => ({ ...prev, [fieldKey]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setResult(null);
      const res = await fetch(`${API_BASE}/frontend-builder/public/form/${formKey}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResult({
          success: true,
          message: data.message || 'Form submitted successfully!',
          data: data.data,
        });
        setFormData({});
      } else {
        setResult({
          success: false,
          message: data.message || 'Failed to submit form. Please check required fields.',
        });
      }
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || 'Network error occurred. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingSchema) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-xs">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
        <p className="text-xs text-slate-500">Loading form schema...</p>
      </div>
    );
  }

  const fields = schema?.fields || [
    { fieldKey: 'name', label: 'Full Name', fieldType: 'text', required: true, placeholder: 'Enter your name' },
    { fieldKey: 'email', label: 'Email Address', fieldType: 'email', required: true, placeholder: 'name@example.com' },
    { fieldKey: 'phone', label: 'Phone Number', fieldType: 'phone', required: true, placeholder: '+91 9876543210' },
    { fieldKey: 'message', label: 'Message / Details', fieldType: 'textarea', required: true, placeholder: 'How can we help you?' },
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-lg my-6">
      <div className="mb-6 space-y-1">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">{schema?.title || title}</h3>
        <p className="text-xs sm:text-sm text-slate-600">{schema?.description || subtitle}</p>
      </div>

      {result && (
        <div
          className={`p-4 rounded-2xl mb-6 text-xs sm:text-sm flex items-start gap-3 ${
            result.success
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {result.success ? (
            <CheckCircle2 size={18} className="text-emerald-600 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle size={18} className="text-rose-600 mt-0.5 flex-shrink-0" />
          )}
          <div>
            <p className="font-bold">{result.message}</p>
            {result.data?.complaintId && (
              <p className="font-mono mt-1 font-semibold text-emerald-900">
                Ticket Reference: #{result.data.complaintId}
              </p>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((field: any) => {
            const isFull = field.fieldType === 'textarea' || field.colSpan === 2;
            return (
              <div key={field.fieldKey} className={`space-y-1 ${isFull ? 'sm:col-span-2' : ''}`}>
                <label className="block text-xs font-bold text-slate-700">
                  {field.label} {field.required && <span className="text-rose-500">*</span>}
                </label>

                {field.fieldType === 'textarea' ? (
                  <textarea
                    rows={field.rows || 4}
                    value={formData[field.fieldKey] || ''}
                    onChange={(e) => handleChange(field.fieldKey, e.target.value)}
                    required={field.required}
                    placeholder={field.placeholder}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition"
                  />
                ) : field.fieldType === 'select' ? (
                  <select
                    value={formData[field.fieldKey] || ''}
                    onChange={(e) => handleChange(field.fieldKey, e.target.value)}
                    required={field.required}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition bg-white"
                  >
                    <option value="">Select an option</option>
                    {(field.options || []).map((opt: any, optIdx: number) => {
                      const val = typeof opt === 'string' ? opt : opt.value;
                      const lbl = typeof opt === 'string' ? opt : opt.label;
                      return (
                        <option key={optIdx} value={val}>
                          {lbl}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <input
                    type={field.fieldType || 'text'}
                    value={formData[field.fieldKey] || ''}
                    onChange={(e) => handleChange(field.fieldKey, e.target.value)}
                    required={field.required}
                    placeholder={field.placeholder}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition"
                  />
                )}

                {field.helpText && <p className="text-[10px] text-slate-500">{field.helpText}</p>}
              </div>
            );
          })}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-4 py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-900/20 transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>{schema?.submitButtonText || submitButtonText}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

/* =========================================================================
   9. COMPLAINT TRACKER BLOCK
   ========================================================================= */
export const ComplaintTrackerBlock: React.FC<{ props: any }> = ({ props = {} }) => {
  const {
    title = 'Track Complaint Status',
    subtitle = 'Enter your 6-digit complaint reference number or registered mobile number to see live status.',
  } = props;

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      setLoading(true);
      setError(null);
      setTicket(null);
      const res = await fetch(`${API_BASE}/complaints/track/${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setTicket(data.data);
      } else {
        setError(data.message || 'No complaint ticket found with the provided reference.');
      }
    } catch (err: any) {
      setError('Could not connect to tracking server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-lg my-6">
      <div className="text-center mb-6 space-y-1.5">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
          <Search size={22} />
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-600">{subtitle}</p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. EKO-2026-9041 or 9876543210"
          required
          className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          <span>Track Now</span>
        </button>
      </form>

      {error && (
        <div className="mt-5 p-4 rounded-xl bg-rose-50 text-rose-800 text-xs font-semibold flex items-center gap-2 border border-rose-200">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {ticket && (
        <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-left">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-[10px] text-slate-400 font-mono">TICKET ID</span>
              <p className="text-sm font-black text-slate-900">#{ticket.complaintId || ticket._id?.slice(-8)}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                ticket.status === 'Resolved' || ticket.status === 'Closed'
                  ? 'bg-emerald-100 text-emerald-800'
                  : ticket.status === 'In Progress'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {ticket.status || 'Pending'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400">Customer:</span>
              <p className="font-semibold text-slate-800">{ticket.customerName || 'N/A'}</p>
            </div>
            <div>
              <span className="text-slate-400">Battery / Product:</span>
              <p className="font-semibold text-slate-800">{ticket.productType || 'Lithium Battery'}</p>
            </div>
          </div>

          {ticket.description && (
            <div className="text-xs pt-2 border-t border-slate-200">
              <span className="text-slate-400">Issue Description:</span>
              <p className="text-slate-700 mt-0.5">{ticket.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   10. WARRANTY CHECK BLOCK
   ========================================================================= */
export const WarrantyCheckBlock: React.FC<{ props: any }> = ({ props = {} }) => {
  const {
    title = 'Verify Battery Warranty Certificate',
    subtitle = 'Scan or type your EBS Lithium Battery serial number to see valid warranty terms.',
  } = props;

  const [serialNumber, setSerialNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [warranty, setWarranty] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serialNumber.trim()) return;
    try {
      setLoading(true);
      setError(null);
      setWarranty(null);
      const res = await fetch(`${API_BASE}/warranties/check/${encodeURIComponent(serialNumber.trim())}`);
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setWarranty(data.data);
      } else {
        setError(data.message || 'No registered battery warranty found with this serial number.');
      }
    } catch (err: any) {
      setError('Could not connect to warranty verification server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-lg my-6">
      <div className="text-center mb-6 space-y-1.5">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
          <ShieldCheck size={24} />
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-600">{subtitle}</p>
      </div>

      <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-2.5">
        <input
          type="text"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
          placeholder="e.g. EBS-60V-2026-XXXX"
          required
          className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden font-mono"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
          <span>Verify Warranty</span>
        </button>
      </form>

      {error && (
        <div className="mt-5 p-4 rounded-xl bg-rose-50 text-rose-800 text-xs font-semibold flex items-center gap-2 border border-rose-200">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {warranty && (
        <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950 text-white shadow-xl space-y-4 text-left">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <Battery className="text-emerald-400" size={20} />
              <span className="font-bold text-sm">Official Battery Certificate</span>
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold rounded-full">
              {warranty.status || 'Active Warranty'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400">Serial Number:</span>
              <p className="font-mono font-bold text-white text-sm">{warranty.serialNumber}</p>
            </div>
            <div>
              <span className="text-slate-400">Model / Spec:</span>
              <p className="font-semibold text-white">{warranty.batteryModel || '60V 30Ah NMC'}</p>
            </div>
            <div>
              <span className="text-slate-400">Purchase Date:</span>
              <p className="font-medium text-slate-200">{warranty.purchaseDate ? new Date(warranty.purchaseDate).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div>
              <span className="text-slate-400">Warranty Expiry:</span>
              <p className="font-bold text-emerald-400">{warranty.warrantyEndDate ? new Date(warranty.warrantyEndDate).toLocaleDateString() : '3 Years Coverage'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   11. CONTACT DIRECTORY BLOCK
   ========================================================================= */
export const ContactDirectoryBlock: React.FC<{ props: any }> = ({ props = {} }) => {
  const {
    title = 'Customer Support & Works Location',
    subtitle = 'Reach out for warranty claims, technical consultations, or dealership queries.',
    phone = '+91 8949049003',
    email = 'support@ekosmartdrive.in',
    address = 'Plot No. 14, Electronic Complex, Road No. 1, IPIA, Kota, Rajasthan - 324005',
    officeHours = '10:00 AM to 6:30 PM (Monday - Saturday)',
  } = props;

  return (
    <div className="max-w-4xl mx-auto my-8 space-y-6">
      {(title || subtitle) && (
        <div className="text-center space-y-1.5">
          {title && <h3 className="text-xl sm:text-2xl font-black text-slate-900">{title}</h3>}
          {subtitle && <p className="text-xs sm:text-sm text-slate-600">{subtitle}</p>}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Phone size={22} />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Direct Phone</h4>
          <p className="text-xs text-slate-500 mt-1">Available during working hours</p>
          <a href={`tel:${phone.replace(/\s+/g, '')}`} className="mt-3 text-xs sm:text-sm font-bold text-emerald-600 hover:underline">
            {phone}
          </a>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
            <Mail size={22} />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Email Support</h4>
          <p className="text-xs text-slate-500 mt-1">Tickets & inquiry response</p>
          <a href={`mailto:${email}`} className="mt-3 text-xs sm:text-sm font-bold text-teal-600 hover:underline">
            {email}
          </a>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
            <MapPin size={22} />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Works & Office</h4>
          <p className="text-xs text-slate-500 mt-1">{officeHours}</p>
          <p className="mt-2 text-xs text-slate-700 leading-tight font-medium">{address}</p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   12. CALL TO ACTION (CTA)
   ========================================================================= */
export const CallToAction: React.FC<{ props: any }> = ({ props = {} }) => {
  const {
    title = 'Need Fast EV Battery Service or Warranty Claim?',
    subtitle = 'Our certified battery engineers in Kota are ready to assist with battery health diagnostics, replacements, and cell balancing.',
    buttonText = 'Register Support Ticket Now',
    buttonLink = '/complaint/register',
    secondaryText = 'Check Showroom Invoices',
    secondaryLink = '/showroom-billing',
  } = props;

  return (
    <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white rounded-3xl p-8 sm:p-12 my-8 shadow-2xl text-center relative overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto space-y-4">
        <h3 className="text-2xl sm:text-4xl font-black">{title}</h3>
        <p className="text-emerald-100 text-xs sm:text-base leading-relaxed">{subtitle}</p>
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
          <Link
            to={buttonLink}
            className="px-6 py-3.5 bg-white text-emerald-900 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg hover:bg-emerald-50 transition transform hover:-translate-y-0.5"
          >
            {buttonText}
          </Link>
          {secondaryText && (
            <Link
              to={secondaryLink}
              className="px-6 py-3.5 bg-emerald-900/60 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 hover:bg-emerald-900/80 transition"
            >
              {secondaryText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   DYNAMIC COMPONENT REGISTRY DISPATCHER
   ========================================================================= */
export const DynamicComponentRegistry: React.FC<{ type: string; props: any }> = ({ type, props }) => {
  switch (type) {
    case 'HeroBanner':
      return <HeroBanner props={props} />;
    case 'HeadingText':
      return <HeadingText props={props} />;
    case 'RichTextBlock':
      return <RichTextBlock props={props} />;
    case 'ServiceCardGrid':
      return <ServiceCardGrid props={props} />;
    case 'StatsCounter':
      return <StatsCounter props={props} />;
    case 'CustomerReferralWidget':
      return <CustomerReferralWidget props={props} />;
    case 'AccordionFaq':
      return <AccordionFaq props={props} />;
    case 'DynamicFormBlock':
      return <DynamicFormBlock props={props} />;
    case 'ComplaintTrackerBlock':
      return <ComplaintTrackerBlock props={props} />;
    case 'WarrantyCheckBlock':
      return <WarrantyCheckBlock props={props} />;
    case 'ContactDirectoryBlock':
      return <ContactDirectoryBlock props={props} />;
    case 'CallToAction':
      return <CallToAction props={props} />;
    default:
      return (
        <div className="p-4 my-2 border border-dashed border-amber-300 bg-amber-50 rounded-xl text-xs text-amber-800">
          <strong>Component [{type}]:</strong> Ready for display.
        </div>
      );
  }
};
