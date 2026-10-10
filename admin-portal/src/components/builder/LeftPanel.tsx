import React, { useState } from 'react';
import {
  FileCode,
  Layers,
  Component,
  LayoutTemplate,
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Search,
  Zap,
  ShieldCheck,
  Phone,
  FileText,
  Coins,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Columns,
  Image,
  MousePointer,
  Home,
  CheckCircle2,
} from 'lucide-react';
import type { IPage, ISectionConfig } from './types';

interface LeftPanelProps {
  pages: IPage[];
  activePage: IPage | null;
  onSelectPage: (page: IPage) => void;
  onDeletePage: (pageId: string) => void;
  onDuplicatePage: (pageId: string) => void;
  onOpenNewPageModal: () => void;
  sections: ISectionConfig[];
  activeSectionId: string | null;
  activeComponentId: string | null;
  onSelectSection: (sectionId: string) => void;
  onSelectComponent: (componentId: string, sectionId: string) => void;
  onAddSection: () => void;
  onMoveSection: (index: number, direction: 'up' | 'down') => void;
  onDuplicateSection: (index: number) => void;
  onDeleteSection: (index: number) => void;
  onToggleSectionVisibility: (index: number) => void;
  onAddComponent: (type: string, sectionId?: string) => void;
  onApplyTemplate: (templateType: string) => void;
  onOpenFormBuilder: () => void;
  onOpenMediaLibrary: () => void;
}

type TabKey = 'pages' | 'layers' | 'components' | 'templates' | 'media';

export const COMPONENT_CATALOG = [
  {
    category: 'Banners & Hero',
    items: [
      { type: 'HeroBanner', name: 'Hero Banner', icon: Zap, desc: 'High-impact hero with badges, headings & CTA buttons' },
      { type: 'AlertBanner', name: 'Announcement Bar', icon: AlertCircle, desc: 'Top alert ribbon for notifications and updates' },
    ],
  },
  {
    category: 'Content & Typography',
    items: [
      { type: 'HeadingText', name: 'Heading & Subtitle', icon: FileText, desc: 'Configurable H1-H6 headers with decorative styling' },
      { type: 'RichTextBlock', name: 'Rich Text Paragraph', icon: FileCode, desc: 'Formatted markdown or rich paragraphs' },
      { type: 'FeatureList', name: 'Icon Feature Bullets', icon: CheckCircle2, desc: 'Highlight product features with icons' },
      { type: 'Divider', name: 'Styled Divider & Gap', icon: Columns, desc: 'Horizontal rule, spacing gap or section divider' },
    ],
  },
  {
    category: 'Cards & Grids',
    items: [
      { type: 'ServiceCardGrid', name: 'Service Cards Grid', icon: LayoutTemplate, desc: 'Interactive cards for Battery, Spare Parts, Rentals' },
      { type: 'StatsCounter', name: 'Metric Counters', icon: BarChart3, desc: 'Showcase numbers: 50,000+ Packs, 3 Years Warranty' },
      { type: 'CustomerReferralWidget', name: 'Referral Coins Card', icon: Coins, desc: 'Highlight +500 Coins referral rewards banner' },
    ],
  },
  {
    category: 'Interactive Support & Forms',
    items: [
      { type: 'DynamicFormBlock', name: 'Dynamic Form Block', icon: Component, desc: 'Embed customizable forms (Complaint, Inquiry, Warranty)' },
      { type: 'ComplaintTrackerBlock', name: 'Ticket Status Tracker', icon: Search, desc: 'Live ticket search and interactive progress timeline' },
      { type: 'WarrantyCheckBlock', name: 'Warranty Lookup Block', icon: ShieldCheck, desc: 'Serial verification and digital warranty card' },
      { type: 'ContactDirectoryBlock', name: 'Plant Directory & Map', icon: Phone, desc: 'Kota Central Plant address, helplines and contacts' },
    ],
  },
  {
    category: 'Accordions, Tabs & Media',
    items: [
      { type: 'AccordionFaq', name: 'Accordion FAQs', icon: HelpCircle, desc: 'Collapsible Q&A items with search' },
      { type: 'ImageBlock', name: 'Image with Caption', icon: Image, desc: 'Responsive image with aspect ratio and shadow' },
      { type: 'Button', name: 'Action Button / Link', icon: MousePointer, desc: 'Standalone CTA button with modal or link action' },
    ],
  },
];

export const LeftPanel: React.FC<LeftPanelProps> = ({
  pages,
  activePage,
  onSelectPage,
  onDeletePage,
  onDuplicatePage,
  onOpenNewPageModal,
  sections,
  activeSectionId,
  activeComponentId,
  onSelectSection,
  onSelectComponent,
  onAddSection,
  onMoveSection,
  onDuplicateSection,
  onDeleteSection,
  onToggleSectionVisibility,
  onAddComponent,
  onApplyTemplate,
  onOpenFormBuilder,
  onOpenMediaLibrary,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('layers');
  const [pageSearch, setPageSearch] = useState('');
  const [compSearch, setCompSearch] = useState('');

  const filteredPages = pages.filter(
    (p) =>
      p.title.toLowerCase().includes(pageSearch.toLowerCase()) ||
      p.slug.toLowerCase().includes(pageSearch.toLowerCase())
  );

  return (
    <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 select-none overflow-hidden shadow-xs z-10">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 bg-slate-50/80 p-1">
        {[
          { key: 'layers' as TabKey, label: 'Layers', icon: Layers },
          { key: 'components' as TabKey, label: 'Components', icon: Component },
          { key: 'pages' as TabKey, label: 'Pages', icon: FileCode },
          { key: 'templates' as TabKey, label: 'Templates', icon: LayoutTemplate },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 flex flex-col items-center gap-1 rounded-xl text-[10px] font-black transition cursor-pointer ${
                isActive
                  ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-emerald-600' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* TAB 1: LAYERS & SECTION TREE */}
        {activeTab === 'layers' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Layers size={14} className="text-emerald-600" />
                  <span>Section Hierarchy</span>
                </h3>
                <p className="text-[10px] text-slate-400">Manage order, sections & elements</p>
              </div>
              <button
                type="button"
                onClick={onAddSection}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition shadow-xs cursor-pointer"
              >
                <Plus size={12} />
                <span>Add Section</span>
              </button>
            </div>

            {sections.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-2">
                <LayoutTemplate size={24} className="mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-600">No sections added yet</p>
                <button
                  type="button"
                  onClick={onAddSection}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  + Add First Section
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {sections.map((section, sIdx) => {
                  const isSelected = activeSectionId === section.id && !activeComponentId;
                  return (
                    <div
                      key={section.id || sIdx}
                      className={`rounded-2xl border transition-all overflow-hidden ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-400'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {/* Section Header Row */}
                      <div
                        onClick={() => onSelectSection(section.id)}
                        className="p-2.5 flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {sIdx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-800 truncate">{section.name || `Section ${sIdx + 1}`}</span>
                          {!section.isVisible && (
                            <span className="text-[9px] font-bold bg-slate-100 text-slate-400 px-1.5 rounded">Hidden</span>
                          )}
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => onToggleSectionVisibility(sIdx)}
                            title={section.isVisible ? 'Hide Section' : 'Show Section'}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
                          >
                            {section.isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                          </button>
                          <button
                            type="button"
                            disabled={sIdx === 0}
                            onClick={() => onMoveSection(sIdx, 'up')}
                            title="Move Up"
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            type="button"
                            disabled={sIdx === sections.length - 1}
                            onClick={() => onMoveSection(sIdx, 'down')}
                            title="Move Down"
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          >
                            <ArrowDown size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDuplicateSection(sIdx)}
                            title="Duplicate Section"
                            className="p-1 text-slate-400 hover:text-slate-700"
                          >
                            <Copy size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteSection(sIdx)}
                            title="Delete Section"
                            className="p-1 text-rose-400 hover:text-rose-600"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Components inside section */}
                      {section.components && section.components.length > 0 && (
                        <div className="px-2 pb-2 pt-0 space-y-1">
                          {section.components.map((cmp, cIdx) => {
                            const isCmpSelected = activeComponentId === cmp.id;
                            return (
                              <div
                                key={cmp.id || cIdx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectComponent(cmp.id, section.id);
                                }}
                                className={`pl-6 pr-2 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition ${
                                  isCmpSelected
                                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center gap-1.5 truncate">
                                  <Component size={12} className={isCmpSelected ? 'text-emerald-200' : 'text-slate-400'} />
                                  <span className="truncate">{cmp.name || cmp.type}</span>
                                </div>
                                <span className={`text-[9px] font-mono px-1 rounded ${isCmpSelected ? 'bg-emerald-700 text-white' : 'text-slate-400 bg-white'}`}>
                                  {cmp.type}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COMPONENT PALETTE */}
        {activeTab === 'components' && (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search components..."
                value={compSearch}
                onChange={(e) => setCompSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
            </div>

            <div className="space-y-4">
              {COMPONENT_CATALOG.map((cat) => {
                const items = cat.items.filter(
                  (it) =>
                    it.name.toLowerCase().includes(compSearch.toLowerCase()) ||
                    it.desc.toLowerCase().includes(compSearch.toLowerCase())
                );
                if (items.length === 0) return null;

                return (
                  <div key={cat.category} className="space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                      {cat.category}
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.type}
                            type="button"
                            onClick={() => onAddComponent(item.type, activeSectionId || undefined)}
                            className="p-2.5 bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 rounded-2xl text-left transition flex items-start gap-2.5 shadow-2xs group cursor-pointer"
                          >
                            <div className="p-2 bg-slate-100 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-700 rounded-xl shrink-0 transition">
                              <Icon size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-xs text-slate-800 group-hover:text-emerald-950 flex items-center justify-between">
                                <span>{item.name}</span>
                                <Plus size={12} className="text-slate-300 group-hover:text-emerald-600" />
                              </div>
                              <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: PAGES & ROUTES */}
        {activeTab === 'pages' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black text-slate-900">All Site Pages</h3>
                <p className="text-[10px] text-slate-400">Select page to edit or manage routes</p>
              </div>
              <button
                type="button"
                onClick={onOpenNewPageModal}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition shadow-xs cursor-pointer"
              >
                <Plus size={12} />
                <span>New Page</span>
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Filter pages..."
                value={pageSearch}
                onChange={(e) => setPageSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
            </div>

            <div className="space-y-1.5">
              {filteredPages.map((p) => {
                const isActive = activePage?.pageId === p.pageId;
                return (
                  <div
                    key={p.pageId}
                    onClick={() => onSelectPage(p)}
                    className={`p-2.5 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-emerald-50/70 border-emerald-500 ring-1 ring-emerald-400'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        {p.isHome && <Home size={12} className="text-amber-500 shrink-0" />}
                        <span className="text-xs font-bold text-slate-800 truncate">{p.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <code className="text-[10px] font-mono text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded">
                          {p.slug}
                        </code>
                        <span className="text-[9px] text-slate-400">v{p.currentVersion || 1}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => onDuplicatePage(p.pageId)}
                        title="Duplicate Page"
                        className="p-1 text-slate-400 hover:text-slate-700"
                      >
                        <Copy size={12} />
                      </button>
                      {!p.isHome && (
                        <button
                          type="button"
                          onClick={() => onDeletePage(p.pageId)}
                          title="Delete Page"
                          className="p-1 text-rose-400 hover:text-rose-600"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: PAGE TEMPLATES */}
        {activeTab === 'templates' && (
          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-black text-slate-900">Pre-Built Page Layouts</h3>
              <p className="text-[10px] text-slate-400">Insert complete multi-section layout with 1 click</p>
            </div>

            <div className="space-y-2">
              {[
                { key: 'landing', name: 'Hero Landing Page', desc: 'Hero banner, stats counters, feature grids & FAQ' },
                { key: 'support', name: 'Customer Support Portal', desc: 'Service tickets, complaints form, and live tracking' },
                { key: 'warranty', name: 'Warranty Hub & Registration', desc: 'Serial verification lookup & registration form' },
                { key: 'contact', name: 'Plant Directory & Helpline', desc: 'Kota Central address, helplines & department cards' },
                { key: 'policy', name: 'Official Terms & Policy', desc: 'Legal documentation, headings and rich typography' },
              ].map((tpl) => (
                <div
                  key={tpl.key}
                  className="p-3 bg-white border border-slate-200 rounded-2xl space-y-2 hover:border-emerald-300 transition"
                >
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">{tpl.name}</h4>
                    <p className="text-[10px] text-slate-400">{tpl.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onApplyTemplate(tpl.key)}
                    className="w-full py-1.5 bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 font-bold rounded-xl text-[11px] transition cursor-pointer"
                  >
                    Insert Template Layout
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Quick Links (Form Builder & Media Library) */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-1.5">
        <button
          type="button"
          onClick={onOpenFormBuilder}
          className="w-full py-1.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-between transition cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Component size={13} className="text-emerald-600" />
            <span>Dynamic Form Schemas</span>
          </span>
          <span className="text-[10px] text-slate-400">⚙️</span>
        </button>
        <button
          type="button"
          onClick={onOpenMediaLibrary}
          className="w-full py-1.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-between transition cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Image size={13} className="text-blue-600" />
            <span>Media & Asset Library</span>
          </span>
          <span className="text-[10px] text-slate-400">🖼️</span>
        </button>
      </div>
    </aside>
  );
};
