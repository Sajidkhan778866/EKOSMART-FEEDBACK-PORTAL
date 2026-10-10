import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { resolveImageUrl, API_BASE } from '../../config/api';

export interface IComponentConfig {
  id: string;
  type: string;
  name?: string;
  props: Record<string, any>;
  styling?: Record<string, any>;
  responsive?: Record<string, any>;
  animation?: Record<string, any>;
  action?: {
    type?: 'none' | 'navigate' | 'external_link' | 'open_modal' | 'scroll_to' | 'submit_form';
    payload?: string;
    target?: '_self' | '_blank';
  };
  children?: IComponentConfig[];
}

// Helper: Render dynamic icon safely
export const DynamicIcon = ({ name, size = 20, className = '' }: { name?: string; size?: number; className?: string }) => {
  if (!name) return <Icons.Sparkles size={size} className={className} />;
  const IconComponent = (Icons as any)[name] || Icons.HelpCircle;
  return <IconComponent size={size} className={className} />;
};

export const DynamicComponentRenderer: React.FC<{ component: IComponentConfig }> = ({ component }) => {
  const { type, props = {}, styling = {}, action } = component;
  const navigate = useNavigate();

  // Action Click Handler
  const handleActionClick = (e: React.MouseEvent) => {
    if (!action || action.type === 'none') return;
    if (action.type === 'navigate' && action.payload) {
      e.preventDefault();
      navigate(action.payload);
    } else if (action.type === 'external_link' && action.payload) {
      window.open(action.payload, action.target || '_blank');
    } else if (action.type === 'scroll_to' && action.payload) {
      e.preventDefault();
      const el = document.getElementById(action.payload.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 1. HERO BANNER
  if (type === 'hero_banner') {
    return (
      <div
        className="w-full py-12 md:py-16 px-6 md:px-12 rounded-3xl relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl"
        style={{
          background: styling.bgGradient || 'linear-gradient(135deg, #064e3b 0%, #0f172a 100%)',
          color: styling.color || '#ffffff',
        }}
      >
        <div className="max-w-2xl space-y-6 z-10">
          {props.badge && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs md:text-sm font-semibold tracking-wide shadow-sm">
              <Icons.Zap size={15} className="text-amber-400 animate-pulse" />
              <span>{props.badge}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {props.title || 'Ekosmart EV Battery Solution & Diagnostics'}
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
            {props.subtitle || 'Authorized multi-brand EV battery service, computerized cell balancing, BMS firmware configuration.'}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
            {props.primaryButtonText && (
              <Link
                to={props.primaryButtonLink || '/complaint/register'}
                className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Icons.Wrench size={18} />
                <span>{props.primaryButtonText}</span>
              </Link>
            )}

            {props.secondaryButtonText && (
              <Link
                to={props.secondaryButtonLink || '/complaint/track'}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm sm:text-base backdrop-blur-sm transition-all flex items-center gap-2"
              >
                <Icons.Search size={18} />
                <span>{props.secondaryButtonText}</span>
              </Link>
            )}

            {props.warrantyButtonText && (
              <Link
                to={props.warrantyButtonLink || '/warranty/check'}
                className="px-5 py-3.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 font-semibold text-sm transition-all flex items-center gap-2"
              >
                <Icons.ShieldCheck size={18} />
                <span>{props.warrantyButtonText}</span>
              </Link>
            )}
          </div>

          {props.showMetricsPill && (
            <div className="pt-2 flex items-center gap-3 text-xs text-emerald-200/80">
              <Icons.CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
              <span>{props.metricsText || 'Over 10,000+ Battery Diagnostics Completed Successfully'}</span>
            </div>
          )}
        </div>

        {props.heroImage && (
          <div className="relative z-10 w-full md:w-auto flex justify-center">
            <img
              src={resolveImageUrl(props.heroImage)}
              alt="Hero Artwork"
              className="max-h-72 object-contain drop-shadow-2xl rounded-2xl"
            />
          </div>
        )}
      </div>
    );
  }

  // 2. SERVICE CARDS GRID
  if (type === 'service_cards_grid') {
    const [dbCards, setDbCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetch(`${API_BASE}/content/public`)
        .then((r) => r.json())
        .then((res) => {
          if (res.success && res.data?.serviceCards) {
            setDbCards(res.data.serviceCards.filter((c: any) => c.isVisible !== false));
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, []);

    const cardsToRender = props.cards || (dbCards.length > 0 ? dbCards : [
      { id: '1', title: 'Lithium Battery Service', description: 'Cell capacity testing, impedance matching, and BMS replacement.', linkUrl: '/complaint/register?section=Battery', buttonText: 'Book Service', icon: 'BatteryCharging', color: 'emerald' },
      { id: '2', title: 'Drive Rental Support', description: 'Fleet breakdown repair, quick battery swap, and roadside recovery.', linkUrl: '/complaint/register?section=Rental', buttonText: 'Rental Support', icon: 'Bike', color: 'blue' },
      { id: '3', title: 'Showroom Delivery & Care', description: 'New vehicle handover checks, warranty issuance, and accessory fitment.', linkUrl: '/complaint/register?section=Showroom', buttonText: 'Showroom Service', icon: 'Building2', color: 'amber' },
      { id: '4', title: 'OEM Spare Parts', description: 'Genuine chargers, motor controllers, throttles, and wiring harnesses.', linkUrl: '/complaint/register?section=Spare Parts', buttonText: 'Order Parts', icon: 'Wrench', color: 'purple' },
    ]);

    if (loading && dbCards.length === 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-56 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-4">
        {cardsToRender.map((card: any) => (
          <div
            key={card.id || card.title}
            className="group relative bg-white border border-slate-200/80 hover:border-emerald-500/50 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-inner">
                <DynamicIcon name={card.icon || 'BatteryCharging'} size={24} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {card.title}
                </h3>
                {card.subtitle && (
                  <p className="text-xs text-emerald-600 font-semibold mt-0.5">{card.subtitle}</p>
                )}
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {card.features && card.features.length > 0 && (
                <ul className="space-y-1.5 pt-1">
                  {card.features.slice(0, 3).map((f: string, i: number) => (
                    <li key={i} className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Icons.Check size={13} className="text-emerald-600 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="pt-6">
              <Link
                to={card.linkUrl || card.url || '/complaint/register'}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-emerald-600 text-slate-800 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <span>{card.buttonText || 'Book Service'}</span>
                <Icons.ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 3. STATS COUNTER
  if (type === 'stats_counter') {
    return (
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-center flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
          <DynamicIcon name={props.icon || 'BarChart3'} size={20} />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight" style={{ color: styling.color }}>
          {props.value || '10,000+'}
        </div>
        <div className="text-xs font-semibold text-slate-600">{props.label || 'Metric Label'}</div>
        {props.trend && (
          <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            {props.trend}
          </span>
        )}
      </div>
    );
  }

  // 4. TEXT HEADING
  if (type === 'text_heading') {
    const alignClass = props.align === 'center' ? 'text-center' : props.align === 'right' ? 'text-right' : 'text-left';
    return (
      <div className={`space-y-2 py-2 ${alignClass}`} style={styling}>
        {props.badge && (
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase">
            {props.badge}
          </div>
        )}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {props.title || 'Section Heading'}
        </h2>
        {props.subtitle && (
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {props.subtitle}
          </p>
        )}
      </div>
    );
  }

  // 5. RICH TEXT BLOCK
  if (type === 'rich_text') {
    return (
      <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed py-2" style={styling}>
        {props.content ? (
          <div dangerouslySetInnerHTML={{ __html: props.content.replace(/\n/g, '<br/>') }} />
        ) : (
          <p>Rich text content goes here.</p>
        )}
      </div>
    );
  }

  // 6. ACCORDION FAQ
  if (type === 'accordion_faq') {
    const items = props.items || [
      { question: 'What is the diagnostic process for EV batteries?', answer: 'We conduct multi-channel computerized load tests, cell voltage balancing, and smart BMS analysis.' },
      { question: 'How do I claim a warranty repair?', answer: 'Enter your battery serial number on the Warranty Check tool and submit your claim directly online.' },
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
      <div className="space-y-3 py-2">
        {items.map((item: any, idx: number) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span>{item.question}</span>
                <Icons.ChevronDown
                  size={18}
                  className={`text-slate-500 transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? 'rotate-180 text-emerald-600' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // 7. TICKET TRACKER WIDGET
  if (type === 'ticket_tracker') {
    const [query, setQuery] = useState('');
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Icons.Search size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{props.title || 'Track Service Ticket'}</h3>
            <p className="text-xs text-slate-500">{props.subtitle || 'Enter Ticket ID (EBS-YYMM-XXXX) or Mobile #'}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. EBS-2610-0042 or 9876543210"
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
          />
          <Link
            to={`/complaint/track?ticketNumber=${encodeURIComponent(query)}`}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <span>{props.buttonText || 'Track'}</span>
            <Icons.ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  // 8. WARRANTY CHECKER WIDGET
  if (type === 'warranty_checker') {
    const [serial, setSerial] = useState('');
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Icons.ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{props.title || 'Verify Warranty Coverage'}</h3>
            <p className="text-xs text-slate-500">{props.subtitle || 'Enter Battery Laser Serial or Invoice ID'}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            placeholder="e.g. EBS-BAT-6030-8842"
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
          />
          <Link
            to={`/warranty/check?serial=${encodeURIComponent(serial)}`}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <span>{props.buttonText || 'Check'}</span>
            <Icons.ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  // 9. BUTTON / CTA
  if (type === 'button') {
    return (
      <div className="py-2 inline-block">
        <button
          type="button"
          onClick={handleActionClick}
          className="px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
          style={{
            backgroundColor: styling.bgColor || '#059669',
            color: styling.color || '#ffffff',
            borderRadius: styling.borderRadius || '0.75rem',
          }}
        >
          {props.icon && <DynamicIcon name={props.icon} size={16} />}
          <span>{props.label || 'Action Button'}</span>
        </button>
      </div>
    );
  }

  // 10. CONTACT INFO BOX
  if (type === 'contact_info_box') {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
          <Icons.Building2 size={18} className="text-emerald-600" />
          <span>{props.companyName || 'EKOSMART EV BATTERY SOLUTION'}</span>
        </h3>
        <div className="space-y-3 text-xs text-slate-600">
          <div className="flex items-start gap-2.5">
            <Icons.MapPin size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{props.address || 'Electronic Complex, Road No. 1, IPIA, Kota, Rajasthan'}</span>
          </div>
          {props.phones && (
            <div className="flex items-center gap-2.5">
              <Icons.Phone size={16} className="text-emerald-600 flex-shrink-0" />
              <span>{Array.isArray(props.phones) ? props.phones.join(' / ') : props.phones}</span>
            </div>
          )}
          {props.emails && (
            <div className="flex items-center gap-2.5">
              <Icons.Mail size={16} className="text-emerald-600 flex-shrink-0" />
              <span>{Array.isArray(props.emails) ? props.emails.join(' / ') : props.emails}</span>
            </div>
          )}
          {props.workingHours && (
            <div className="flex items-center gap-2.5">
              <Icons.Clock size={16} className="text-emerald-600 flex-shrink-0" />
              <span>{props.workingHours}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 11. CARD GRID / SIMPLE CARDS
  if (type === 'card_grid') {
    const cards = props.cards || [];
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
        {cards.map((c: any, i: number) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DynamicIcon name={c.icon || 'Check'} size={18} />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">{c.title}</h4>
            <p className="text-xs text-slate-600">{c.description}</p>
          </div>
        ))}
      </div>
    );
  }

  // Fallback / Unknown component
  return (
    <div className="p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 text-xs text-slate-500 text-center">
      Component: <strong>{type}</strong> ({props.title || props.label || component.name || 'No Label'})
    </div>
  );
};
