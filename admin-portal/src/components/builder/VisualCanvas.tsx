import React from 'react';
import {
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Layers,
  Component as ComponentIcon,
  Zap,
  ShieldCheck,
  Phone,
  Coins,
  CheckCircle2,
  BarChart3,
} from 'lucide-react';
import type { ISectionConfig, IComponentConfig, IThemeConfig, ViewportMode } from './types';

interface VisualCanvasProps {
  sections: ISectionConfig[];
  activeSectionId: string | null;
  activeComponentId: string | null;
  onSelectSection: (sectionId: string) => void;
  onSelectComponent: (componentId: string, sectionId: string) => void;
  onMoveSection: (index: number, direction: 'up' | 'down') => void;
  onDuplicateSection: (index: number) => void;
  onDeleteSection: (index: number) => void;
  onMoveComponent: (sectionId: string, compIndex: number, direction: 'up' | 'down') => void;
  onDuplicateComponent: (sectionId: string, compIndex: number) => void;
  onDeleteComponent: (sectionId: string, compIndex: number) => void;
  onAddComponent: (type: string, sectionId: string) => void;
  onAddSection: () => void;
  viewport: ViewportMode;
  theme: IThemeConfig | null;
  previewMode: boolean;
}

export const VisualCanvas: React.FC<VisualCanvasProps> = ({
  sections,
  activeSectionId,
  activeComponentId,
  onSelectSection,
  onSelectComponent,
  onMoveSection,
  onDuplicateSection,
  onDeleteSection,
  onDuplicateComponent,
  onDeleteComponent,
  onAddComponent,
  onAddSection,
  viewport,
  theme,
  previewMode,
}) => {
  const getContainerWidth = () => {
    switch (viewport) {
      case 'mobile':
        return 'max-w-[390px]';
      case 'tablet':
        return 'max-w-[768px]';
      case 'desktop':
      default:
        return 'w-full max-w-7xl';
    }
  };

  return (
    <main className="flex-1 bg-slate-100/80 overflow-y-auto p-4 md:p-8 flex flex-col items-center select-none transition-all">
      {/* Canvas Viewport Frame */}
      <div
        className={`transition-all duration-300 bg-white min-h-[85vh] rounded-2xl shadow-xl border border-slate-200 overflow-hidden ${getContainerWidth()}`}
      >
        {/* Render Sections */}
        {sections.length === 0 ? (
          <div className="py-24 text-center px-4 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <Layers size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">Your Canvas is Ready</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Add sections or insert pre-built templates from the left panel to begin designing your page.
              </p>
            </div>
            <button
              type="button"
              onClick={onAddSection}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer"
            >
              + Add First Section
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sections.map((section, sIdx) => {
              if (!section.isVisible && previewMode) return null;

              const isSectionSelected = activeSectionId === section.id && !activeComponentId;
              const container = section.container || (section as any).styling || {};
              const styling = (section as any).styling || {};
              const layout = section.layout || {};

              // Padding classes / styles
              const pyClass =
                container.paddingY === 'none'
                  ? 'py-0'
                  : container.paddingY === 'xs'
                  ? 'py-2'
                  : container.paddingY === 'sm'
                  ? 'py-4'
                  : container.paddingY === 'lg'
                  ? 'py-12'
                  : container.paddingY === 'xl'
                  ? 'py-16'
                  : container.paddingY === '2xl'
                  ? 'py-24'
                  : container.paddingY === 'md'
                  ? 'py-8'
                  : '';

              const pxClass =
                container.paddingX === 'none'
                  ? 'px-0'
                  : container.paddingX === 'xs'
                  ? 'px-2'
                  : container.paddingX === 'sm'
                  ? 'px-4'
                  : container.paddingX === 'lg'
                  ? 'px-8'
                  : container.paddingX === 'xl'
                  ? 'px-12'
                  : container.paddingX === 'md'
                  ? 'px-6'
                  : '';

              // Background styling
              const bgStyle: React.CSSProperties = {};
              const bgColor = container.bgColor || styling.bgColor;
              const bgGradient = container.bgGradient || styling.bgGradient;
              const bgImage = container.bgImage || styling.bgImage;

              if (bgGradient) {
                bgStyle.background = bgGradient;
              } else if (bgColor) {
                bgStyle.backgroundColor = bgColor;
              } else if (bgImage) {
                bgStyle.backgroundImage = `url(${bgImage})`;
                bgStyle.backgroundSize = 'cover';
                bgStyle.backgroundPosition = 'center';
              }

              if (styling.paddingY && !pyClass) bgStyle.paddingTop = styling.paddingY;
              if (styling.paddingY && !pyClass) bgStyle.paddingBottom = styling.paddingY;
              if (styling.paddingX && !pxClass) bgStyle.paddingLeft = styling.paddingX;
              if (styling.paddingX && !pxClass) bgStyle.paddingRight = styling.paddingX;
              if (styling.borderRadius) bgStyle.borderRadius = styling.borderRadius;
              if (styling.shadow) bgStyle.boxShadow = styling.shadow;

              return (
                <div
                  key={section.id || sIdx}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!previewMode) onSelectSection(section.id);
                  }}
                  style={bgStyle}
                  className={`relative transition-all ${pyClass || 'py-8'} ${pxClass || 'px-6'} ${
                    !previewMode && isSectionSelected
                      ? 'ring-2 ring-emerald-500 ring-offset-2 z-10'
                      : !previewMode
                      ? 'hover:ring-1 hover:ring-slate-300'
                      : ''
                  }`}
                >
                  {/* Section Floating Toolbar (Edit Mode Only) */}
                  {!previewMode && (
                    <div className="absolute top-2 left-3 z-20 flex items-center gap-1 bg-slate-900/90 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md backdrop-blur-xs opacity-80 hover:opacity-100 transition">
                      <span className="text-emerald-400">§ {section.name || `Section ${sIdx + 1}`}</span>
                      <div className="flex items-center gap-0.5 ml-2 border-l border-slate-700 pl-1.5">
                        <button
                          type="button"
                          disabled={sIdx === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveSection(sIdx, 'up');
                          }}
                          className="p-1 hover:text-emerald-300 disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowUp size={11} />
                        </button>
                        <button
                          type="button"
                          disabled={sIdx === sections.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveSection(sIdx, 'down');
                          }}
                          className="p-1 hover:text-emerald-300 disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowDown size={11} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDuplicateSection(sIdx);
                          }}
                          className="p-1 hover:text-emerald-300 cursor-pointer"
                        >
                          <Copy size={11} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSection(sIdx);
                          }}
                          className="p-1 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Components Container inside Section */}
                  <div
                    className={`mx-auto w-full ${
                      layout.display === 'grid'
                        ? `grid grid-cols-1 ${
                            viewport === 'mobile'
                              ? section.responsive?.mobileCols === 2
                                ? 'grid-cols-2'
                                : 'grid-cols-1'
                              : viewport === 'tablet'
                              ? section.responsive?.tabletCols === 3
                                ? 'grid-cols-3'
                                : section.responsive?.tabletCols === 2
                                ? 'grid-cols-2'
                                : 'grid-cols-1'
                              : layout.gridCols === 4
                              ? 'sm:grid-cols-2 lg:grid-cols-4'
                              : layout.gridCols === 3
                              ? 'sm:grid-cols-2 lg:grid-cols-3'
                              : layout.gridCols === 2
                              ? 'sm:grid-cols-2'
                              : 'grid-cols-1'
                          } ${
                            layout.gridGap === 'xs'
                              ? 'gap-2'
                              : layout.gridGap === 'sm'
                              ? 'gap-3'
                              : layout.gridGap === 'lg'
                              ? 'gap-8'
                              : layout.gridGap === 'xl'
                              ? 'gap-12'
                              : 'gap-5'
                          }`
                        : 'space-y-4'
                    }`}
                  >
                    {(!section.components || section.components.length === 0) && !previewMode ? (
                      <div className="py-8 border-2 border-dashed border-slate-300/80 rounded-2xl text-center p-4 bg-slate-50/50 space-y-2">
                        <ComponentIcon size={20} className="mx-auto text-slate-400" />
                        <span className="text-xs font-bold text-slate-500 block">Empty Section</span>
                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                          {['HeroBanner', 'HeadingText', 'ServiceCardGrid', 'DynamicFormBlock'].map((cType) => (
                            <button
                              key={cType}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddComponent(cType, section.id);
                              }}
                              className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-[11px] font-bold text-slate-700 hover:text-emerald-800 transition"
                            >
                              + {cType}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      (section.components || []).map((cmp, cIdx) => {
                        const isCmpSelected = activeComponentId === cmp.id;
                        return (
                          <div
                            key={cmp.id || cIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!previewMode) onSelectComponent(cmp.id, section.id);
                            }}
                            className={`relative transition-all rounded-xl ${
                              !previewMode && isCmpSelected
                                ? 'ring-2 ring-emerald-500 shadow-md ring-offset-2'
                                : !previewMode
                                ? 'hover:ring-1 hover:ring-slate-300'
                                : ''
                            }`}
                          >
                            {/* Component Floating Badge (Edit Mode) */}
                            {!previewMode && (
                              <div className="absolute top-1 right-1 z-20 flex items-center gap-1 bg-emerald-700 text-white px-2 py-0.5 rounded-md text-[9px] font-mono font-bold shadow-xs">
                                <span>{cmp.type}</span>
                                <div className="flex items-center ml-1 border-l border-emerald-600 pl-1">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDuplicateComponent(section.id, cIdx);
                                    }}
                                    className="hover:text-emerald-200 p-0.5"
                                  >
                                    <Copy size={9} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteComponent(section.id, cIdx);
                                    }}
                                    className="hover:text-rose-200 p-0.5"
                                  >
                                    <Trash2 size={9} />
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Render Mock Component Content */}
                            <RenderComponentPreview cmp={cmp} theme={theme} />
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

// Subcomponent to render preview of individual component
const RenderComponentPreview: React.FC<{ cmp: IComponentConfig; theme: IThemeConfig | null }> = ({
  cmp,
}) => {
  const props = cmp.props || {};

  switch (cmp.type) {
    case 'HeroBanner':
    case 'hero_banner':
      return (
        <div className="p-8 sm:p-12 text-center text-white space-y-4">
          {(props.badgeText || props.badge) && (
            <span className="inline-block px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-xs font-bold tracking-wider uppercase">
              {props.badgeText || props.badge}
            </span>
          )}
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight whitespace-pre-line text-white">
            {props.heading || props.title || 'Ekosmart High Power Lithium Technologies'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {props.subheading || props.subtitle || 'High Charging Power • Long Life • Low Maintenance. Official support & warranty verification portal.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {(props.primaryButtonText || props.primaryText) && (
              <button
                type="button"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer"
              >
                {props.primaryButtonText || props.primaryText || 'Register Complaint'}
              </button>
            )}
            {(props.secondaryButtonText || props.secondaryText) && (
              <button
                type="button"
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs border border-white/20 backdrop-blur-xs transition cursor-pointer"
              >
                {props.secondaryButtonText || props.secondaryText || 'Check Battery Warranty'}
              </button>
            )}
            {props.warrantyButtonText && (
              <button
                type="button"
                className="px-5 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold rounded-xl text-xs border border-amber-400/30 backdrop-blur-xs transition cursor-pointer"
              >
                {props.warrantyButtonText}
              </button>
            )}
          </div>
          {(props.showCoinsBadge || props.showMetricsPill) && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full text-[11px] font-bold mt-2">
              <Coins size={12} className="text-amber-400" />
              <span>{props.coinsBadgeText || props.metricsText || '🪙 Earn 500 Coins on Battery Bills & Friend Referrals'}</span>
            </div>
          )}
        </div>
      );

    case 'HeadingText':
    case 'text_heading':
      return (
        <div className={`space-y-1 ${props.align === 'center' ? 'text-center' : props.align === 'right' ? 'text-right' : 'text-left'}`}>
          {props.badge && (
            <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black uppercase tracking-wider mb-1">
              {props.badge}
            </span>
          )}
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight" style={{ color: props.textColor || undefined }}>
            {props.title || props.heading || 'Section Heading'}
          </h2>
          {props.subtitle && (
            <p className="text-xs text-slate-500 max-w-2xl mx-auto leading-relaxed">{props.subtitle}</p>
          )}
        </div>
      );

    case 'RichTextBlock':
    case 'rich_text':
      return (
        <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/70 p-4 rounded-xl border border-slate-200">
          {props.content || props.text || 'Add rich informative content or policy descriptions here...'}
        </div>
      );

    case 'StatsCounter':
    case 'stats_counter':
      return (
        <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center shadow-xs space-y-1">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
            <BarChart3 size={20} />
          </div>
          <div className="text-xl font-black text-slate-900 tracking-tight">{props.number || props.value || '50,000+'}</div>
          <div className="text-[11px] font-semibold text-slate-500">{props.label || 'Metric Label'}</div>
          {props.trend && <div className="text-[10px] font-bold text-emerald-700">{props.trend}</div>}
        </div>
      );

    case 'ServiceCardGrid':
    case 'service_cards_grid':
      const cards = props.cards || [
        { title: 'EV Showroom Support', desc: 'New vehicle bookings, delivery & sales', badge: 'NEW BOOKINGS', color: 'emerald' },
        { title: 'Drive Rental Support', desc: 'EV scooter booking & quick battery swap', badge: 'FLEXIBLE PLANS', color: 'blue' },
        { title: 'Spare Parts & Chargers', desc: 'OEM Fast Chargers, Smart BMS & kits', badge: 'GENUINE OEM', color: 'purple' },
        { title: 'Lithium Battery Pack', desc: 'Cell balancing, diagnostic & warranty', badge: '3-YR WARRANTY', color: 'teal' },
      ];
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card: any, idx: number) => (
            <div
              key={idx}
              className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition space-y-3"
            >
              <div className="flex justify-between items-start">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Zap size={18} />
                </div>
                {card.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {card.badge}
                  </span>
                )}
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">{card.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{card.description || card.desc}</p>
              </div>
              <button
                type="button"
                className="w-full py-1.5 bg-slate-50 hover:bg-emerald-600 hover:text-white text-slate-700 font-bold rounded-xl text-xs border border-slate-200 transition"
              >
                {card.buttonText || 'Select Division'}
              </button>
            </div>
          ))}
        </div>
      );

    case 'CustomerReferralWidget':
    case 'customer_wallet_card':
    case 'customer_referral_widget':
      return (
        <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl space-y-3 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full font-bold text-xs">
            <Coins size={14} className="text-amber-600" />
            <span>Customer Refer & Earn Digital Coins</span>
          </div>
          <h3 className="text-lg font-black text-amber-950">{props.title || 'Ekosmart Referral & Rewards Program'}</h3>
          <p className="text-xs text-amber-900 max-w-lg mx-auto leading-relaxed">
            {props.subtitle || 'Share your unique referral code with friends and colleagues to earn wallet coins on qualifying showroom purchases.'}
          </p>
          <div className="flex justify-center gap-4 pt-1 font-mono text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-amber-200 shadow-2xs">
              <span className="block text-[10px] text-slate-500 font-sans">Battery Purchase</span>
              <strong className="text-emerald-700">+{props.batteryCoins || 500} Coins</strong>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-amber-200 shadow-2xs">
              <span className="block text-[10px] text-slate-500 font-sans">Friend Referral</span>
              <strong className="text-amber-700">+{props.referrerReward || 500} Coins</strong>
            </div>
          </div>
        </div>
      );

    case 'AccordionFaq':
    case 'accordion_faq':
      const items = props.items || [
        { question: 'How do I register a service complaint?', answer: 'Click on Register Complaint and submit your ticket details.' },
        { question: 'What is the standard warranty period?', answer: '48V LFP packs carry 3-Year replacement warranty.' },
      ];
      return (
        <div className="space-y-2 max-w-3xl mx-auto">
          {items.map((it: any, i: number) => (
            <div key={i} className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1">
              <div className="font-bold text-xs text-slate-900 flex justify-between items-center">
                <span>{it.question}</span>
                <span className="text-slate-400 font-bold">+</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed pt-1 border-t border-slate-100">{it.answer}</p>
            </div>
          ))}
        </div>
      );

    case 'DynamicFormBlock':
    case 'dynamic_form':
      return (
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 max-w-2xl mx-auto space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <ComponentIcon size={16} className="text-emerald-600" />
            <span className="font-bold text-xs text-slate-900">
              Dynamic Form Schema: <code className="text-emerald-700 font-mono">{props.formKey || 'contact_form'}</code>
            </span>
          </div>
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Customer Name *</label>
                <input type="text" disabled placeholder="e.g. John Doe" className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Mobile Number *</label>
                <input type="text" disabled placeholder="9876543210" className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Details / Description *</label>
              <textarea rows={2} disabled placeholder="Describe requirements..." className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs" />
            </div>
            <button type="button" disabled className="w-full py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl opacity-90">
              Submit Form
            </button>
          </div>
        </div>
      );

    case 'ComplaintTrackerBlock':
    case 'ticket_tracker':
      return (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 max-w-2xl mx-auto space-y-4 shadow-xs">
          <div className="flex gap-2">
            <input type="text" disabled placeholder="Enter Complaint ID (e.g. BAT-20261010-0001)" className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold" />
            <button type="button" disabled className="px-4 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl">Track Ticket</button>
          </div>
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
            <span>Sample Status: <strong>In Progress (Inspection)</strong></span>
            <span className="text-[10px] font-mono bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">24h SLA Active</span>
          </div>
        </div>
      );

    case 'WarrantyCheckBlock':
    case 'warranty_checker':
      return (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 max-w-2xl mx-auto space-y-4 shadow-xs">
          <div className="flex gap-2">
            <input type="text" disabled placeholder="Enter Battery Serial Number (e.g. EBS48V32AH9942)" className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold" />
            <button type="button" disabled className="px-4 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl">Verify Warranty</button>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-600" />
            <span>Pan-India 3-Year Official Replacement Warranty on 48V LFP Packs</span>
          </div>
        </div>
      );

    case 'ContactDirectoryBlock':
    case 'contact_info_box':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-2">
            <h4 className="font-bold text-sm text-emerald-400">Kota Central Plant Helpline</h4>
            <p className="text-xs text-slate-300">Plot No. 14, Electronic Complex, Road No. 1, IPIA, Kota - 324005</p>
            <div className="pt-2 text-xs font-mono text-slate-200 space-y-1">
              <p>📞 Phone: +91 8949049003</p>
              <p>✉️ Email: Smartdrive5640@gmail.com</p>
              <p>⏰ Timings: 10:00 AM - 6:30 PM (Mon-Sat)</p>
            </div>
          </div>
          <div className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col justify-center text-center space-y-2">
            <Phone size={24} className="mx-auto text-emerald-600" />
            <div className="font-bold text-xs text-slate-800">Direct WhatsApp Assistance</div>
            <a href="https://wa.me/918949049003" target="_blank" rel="noreferrer" className="inline-block px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs">
              Chat with Engineer
            </a>
          </div>
        </div>
      );

    case 'FeatureList':
    case 'feature_grid':
      const features = props.features || ['Smart Cell Diagnostics', 'BMS Balance Testing', 'Fast Replacement Dispatch'];
      return (
        <div className="space-y-2">
          {features.map((feat: string, idx: number) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-slate-800 font-semibold">
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      );

    default:
      return (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-center justify-between">
          <span className="font-bold">{cmp.name || cmp.type}</span>
          <span className="text-[10px] font-mono text-slate-400">{cmp.type}</span>
        </div>
      );
  }
};
