import React, { useState } from 'react';
import {
  Sliders,
  Type,
  Palette,
  Maximize2,
  Smartphone,
  MousePointer,
  Layers,
  Component as ComponentIcon,
  X,
} from 'lucide-react';
import type { ISectionConfig, IComponentConfig } from './types';

interface PropertyInspectorProps {
  selectedSection: ISectionConfig | null;
  selectedComponent: IComponentConfig | null;
  onUpdateSection: (section: ISectionConfig) => void;
  onUpdateComponent: (component: IComponentConfig) => void;
  onDeselect: () => void;
  onOpenFormBuilder?: () => void;
  onOpenMediaLibrary?: () => void;
}

type InspectorTab = 'content' | 'style' | 'layout' | 'responsive' | 'action';

export const PropertyInspector: React.FC<PropertyInspectorProps> = ({
  selectedSection,
  selectedComponent,
  onUpdateSection,
  onUpdateComponent,
  onDeselect,
  onOpenFormBuilder,
}) => {
  const [activeTab, setActiveTab] = useState<InspectorTab>('content');

  if (!selectedSection && !selectedComponent) {
    return (
      <aside className="w-80 bg-white border-l border-slate-200 p-6 flex flex-col items-center justify-center text-center text-slate-400 select-none shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
          <Sliders size={20} className="text-slate-400" />
        </div>
        <h4 className="text-xs font-bold text-slate-700">No Element Selected</h4>
        <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
          Click on any section or component on the canvas to inspect and edit its properties.
        </p>
      </aside>
    );
  }

  // Handle Section Updates
  const updateSectionContainer = (key: string, val: any) => {
    if (!selectedSection) return;
    onUpdateSection({
      ...selectedSection,
      container: {
        ...selectedSection.container,
        [key]: val,
      },
    });
  };

  const updateSectionLayout = (key: string, val: any) => {
    if (!selectedSection) return;
    onUpdateSection({
      ...selectedSection,
      layout: {
        ...selectedSection.layout,
        [key]: val,
      },
    });
  };

  const updateSectionResponsive = (key: string, val: any) => {
    if (!selectedSection) return;
    onUpdateSection({
      ...selectedSection,
      responsive: {
        ...selectedSection.responsive,
        [key]: val,
      },
    });
  };

  // Handle Component Updates
  const updateComponentProp = (key: string, val: any) => {
    if (!selectedComponent) return;
    onUpdateComponent({
      ...selectedComponent,
      props: {
        ...selectedComponent.props,
        [key]: val,
      },
    });
  };

  const updateComponentAction = (key: string, val: any) => {
    if (!selectedComponent) return;
    onUpdateComponent({
      ...selectedComponent,
      action: {
        type: selectedComponent.action?.type || 'none',
        ...selectedComponent.action,
        [key]: val,
      },
    });
  };

  return (
    <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 select-none overflow-hidden shadow-xs z-10">
      {/* Inspector Header */}
      <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
            {selectedComponent ? <ComponentIcon size={14} /> : <Layers size={14} />}
          </div>
          <div className="min-w-0">
            <span className="text-xs font-black text-slate-900 truncate block">
              {selectedComponent ? selectedComponent.type : selectedSection?.name || 'Section'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {selectedComponent ? `ID: ${selectedComponent.id.slice(-6)}` : `ID: ${selectedSection?.id.slice(-6)}`}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onDeselect}
          className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-2 pt-1 gap-1">
        {[
          { key: 'content' as InspectorTab, label: 'Content', icon: Type },
          { key: 'style' as InspectorTab, label: 'Design', icon: Palette },
          { key: 'layout' as InspectorTab, label: 'Layout', icon: Maximize2 },
          { key: 'responsive' as InspectorTab, label: 'Mobile', icon: Smartphone },
          { key: 'action' as InspectorTab, label: 'Action', icon: MousePointer },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 py-1.5 text-[10px] font-bold border-b-2 transition flex flex-col items-center gap-0.5 cursor-pointer ${
                isActive
                  ? 'border-emerald-600 text-emerald-700 font-black'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <Icon size={12} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Property Controls Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* COMPONENT CONTENT TAB */}
        {selectedComponent && activeTab === 'content' && (
          <div className="space-y-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Component Name (Internal)</label>
              <input
                type="text"
                value={selectedComponent.name || ''}
                onChange={(e) => onUpdateComponent({ ...selectedComponent, name: e.target.value })}
                placeholder="e.g. Main Hero Section"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
              />
            </div>

            {/* Dynamic props based on component type */}
            {(selectedComponent.type === 'HeroBanner' || selectedComponent.type === 'hero_banner') && (
              <>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Badge Ribbon Text</label>
                  <input
                    type="text"
                    value={selectedComponent.props?.badgeText || selectedComponent.props?.badge || ''}
                    onChange={(e) => {
                      updateComponentProp('badgeText', e.target.value);
                      updateComponentProp('badge', e.target.value);
                    }}
                    placeholder="⚡ OFFICIAL EKOSMART PORTAL"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Main Heading</label>
                  <textarea
                    rows={2}
                    value={selectedComponent.props?.heading || selectedComponent.props?.title || ''}
                    onChange={(e) => {
                      updateComponentProp('heading', e.target.value);
                      updateComponentProp('title', e.target.value);
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Subheading Description</label>
                  <textarea
                    rows={3}
                    value={selectedComponent.props?.subheading || selectedComponent.props?.subtitle || ''}
                    onChange={(e) => {
                      updateComponentProp('subheading', e.target.value);
                      updateComponentProp('subtitle', e.target.value);
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Primary Button</label>
                    <input
                      type="text"
                      value={selectedComponent.props?.primaryButtonText || ''}
                      onChange={(e) => updateComponentProp('primaryButtonText', e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Link URL</label>
                    <input
                      type="text"
                      value={selectedComponent.props?.primaryButtonLink || ''}
                      onChange={(e) => updateComponentProp('primaryButtonLink', e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Secondary Button</label>
                    <input
                      type="text"
                      value={selectedComponent.props?.secondaryButtonText || ''}
                      onChange={(e) => updateComponentProp('secondaryButtonText', e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Link URL</label>
                    <input
                      type="text"
                      value={selectedComponent.props?.secondaryButtonLink || ''}
                      onChange={(e) => updateComponentProp('secondaryButtonLink', e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Warranty Check Button Text</label>
                  <input
                    type="text"
                    value={selectedComponent.props?.warrantyButtonText || ''}
                    onChange={(e) => updateComponentProp('warrantyButtonText', e.target.value)}
                    placeholder="Check Battery Warranty"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </>
            )}

            {(selectedComponent.type === 'HeadingText' || selectedComponent.type === 'text_heading') && (
              <>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Badge Ribbon</label>
                  <input
                    type="text"
                    value={selectedComponent.props?.badge || ''}
                    onChange={(e) => updateComponentProp('badge', e.target.value)}
                    placeholder="Our Specialized Divisions"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Title Text</label>
                  <input
                    type="text"
                    value={selectedComponent.props?.title || selectedComponent.props?.heading || ''}
                    onChange={(e) => {
                      updateComponentProp('title', e.target.value);
                      updateComponentProp('heading', e.target.value);
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Subtitle Text</label>
                  <textarea
                    rows={2}
                    value={selectedComponent.props?.subtitle || ''}
                    onChange={(e) => updateComponentProp('subtitle', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Alignment</label>
                  <select
                    value={selectedComponent.props?.align || 'left'}
                    onChange={(e) => updateComponentProp('align', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="left">Left Aligned</option>
                    <option value="center">Centered</option>
                    <option value="right">Right Aligned</option>
                  </select>
                </div>
              </>
            )}

            {(selectedComponent.type === 'StatsCounter' || selectedComponent.type === 'stats_counter') && (
              <>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Metric Number / Value</label>
                  <input
                    type="text"
                    value={selectedComponent.props?.value || selectedComponent.props?.number || ''}
                    onChange={(e) => {
                      updateComponentProp('value', e.target.value);
                      updateComponentProp('number', e.target.value);
                    }}
                    placeholder="12,500+"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Label</label>
                  <input
                    type="text"
                    value={selectedComponent.props?.label || ''}
                    onChange={(e) => updateComponentProp('label', e.target.value)}
                    placeholder="Battery Packs Tested"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Trend Badge</label>
                  <input
                    type="text"
                    value={selectedComponent.props?.trend || ''}
                    onChange={(e) => updateComponentProp('trend', e.target.value)}
                    placeholder="Fast-Track SLA"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </>
            )}

            {(selectedComponent.type === 'ServiceCardGrid' || selectedComponent.type === 'service_cards_grid') && (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs">
                  <strong>⚡ Dynamic Division Cards Active:</strong> Renders all active service divisions (Showroom, Rental, Spare Parts, Lithium Battery, etc.) directly from MongoDB.
                </div>
              </div>
            )}

            {(selectedComponent.type === 'ComplaintTrackerBlock' || selectedComponent.type === 'ticket_tracker') && (
              <div className="space-y-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Widget Title</label>
                  <input
                    type="text"
                    value={selectedComponent.props?.title || ''}
                    onChange={(e) => updateComponentProp('title', e.target.value)}
                    placeholder="Track Service Ticket"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Subtitle</label>
                  <textarea
                    rows={2}
                    value={selectedComponent.props?.subtitle || ''}
                    onChange={(e) => updateComponentProp('subtitle', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            )}

            {(selectedComponent.type === 'WarrantyCheckBlock' || selectedComponent.type === 'warranty_checker') && (
              <div className="space-y-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Widget Title</label>
                  <input
                    type="text"
                    value={selectedComponent.props?.title || ''}
                    onChange={(e) => updateComponentProp('title', e.target.value)}
                    placeholder="Verify Warranty Coverage"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Subtitle</label>
                  <textarea
                    rows={2}
                    value={selectedComponent.props?.subtitle || ''}
                    onChange={(e) => updateComponentProp('subtitle', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            )}

            {(selectedComponent.type === 'RichTextBlock' || selectedComponent.type === 'rich_text') && (
              <div>
                <label className="block text-slate-700 font-bold mb-1">Content Body</label>
                <textarea
                  rows={8}
                  value={selectedComponent.props?.content || selectedComponent.props?.text || ''}
                  onChange={(e) => {
                    updateComponentProp('content', e.target.value);
                    updateComponentProp('text', e.target.value);
                  }}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-sans"
                />
              </div>
            )}

            {(selectedComponent.type === 'DynamicFormBlock' || selectedComponent.type === 'dynamic_form') && (
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Select Form Schema</label>
                  <select
                    value={selectedComponent.props?.formKey || 'contact_form'}
                    onChange={(e) => updateComponentProp('formKey', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="contact_form">Customer Inquiry & Helpline Form (contact_form)</option>
                    <option value="complaint_form">Technical Service Complaint Form (complaint_form)</option>
                    <option value="warranty_register_form">Official Warranty Registration (warranty_register_form)</option>
                  </select>
                </div>
                {onOpenFormBuilder && (
                  <button
                    type="button"
                    onClick={onOpenFormBuilder}
                    className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl border border-emerald-200 transition cursor-pointer"
                  >
                    ⚙️ Edit Form Fields Schema
                  </button>
                )}
              </div>
            )}

            {(selectedComponent.type === 'CustomerReferralWidget' || selectedComponent.type === 'customer_wallet_card' || selectedComponent.type === 'customer_referral_widget') && (
              <>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Banner Title</label>
                  <input
                    type="text"
                    value={selectedComponent.props?.title || ''}
                    onChange={(e) => updateComponentProp('title', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Battery Coins (🪙)</label>
                    <input
                      type="number"
                      value={selectedComponent.props?.batteryCoins || 500}
                      onChange={(e) => updateComponentProp('batteryCoins', Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Referrer Reward (🪙)</label>
                    <input
                      type="number"
                      value={selectedComponent.props?.referrerReward || 500}
                      onChange={(e) => updateComponentProp('referrerReward', Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* SECTION CONTENT TAB */}
        {selectedSection && !selectedComponent && activeTab === 'content' && (
          <div className="space-y-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Section Title / Name</label>
              <input
                type="text"
                value={selectedSection.name || ''}
                onChange={(e) => onUpdateSection({ ...selectedSection, name: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={selectedSection.isVisible}
                  onChange={(e) => onUpdateSection({ ...selectedSection, isVisible: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-bold text-slate-800">Section Visible to Visitors</span>
              </label>
            </div>
          </div>
        )}

        {/* DESIGN & STYLE TAB */}
        {activeTab === 'style' && (
          <div className="space-y-3">
            {selectedSection && (
              <>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Background Type</label>
                  <select
                    value={selectedSection.container?.bgType || 'transparent'}
                    onChange={(e) => updateSectionContainer('bgType', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="transparent">Transparent</option>
                    <option value="solid">Solid Color</option>
                    <option value="gradient">Gradient</option>
                    <option value="image">Background Image</option>
                  </select>
                </div>

                {selectedSection.container?.bgType === 'solid' && (
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Background Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={selectedSection.container?.bgColor || '#ffffff'}
                        onChange={(e) => updateSectionContainer('bgColor', e.target.value)}
                        className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={selectedSection.container?.bgColor || ''}
                        onChange={(e) => updateSectionContainer('bgColor', e.target.value)}
                        placeholder="#ffffff"
                        className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                      />
                    </div>
                  </div>
                )}

                {selectedSection.container?.bgType === 'gradient' && (
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">CSS Gradient String</label>
                    <input
                      type="text"
                      value={selectedSection.container?.bgGradient || ''}
                      onChange={(e) => updateSectionContainer('bgGradient', e.target.value)}
                      placeholder="linear-gradient(135deg, #0f172a 0%, #064e3b 100%)"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                    />
                  </div>
                )}

                {selectedSection.container?.bgType === 'image' && (
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Image URL</label>
                    <input
                      type="text"
                      value={selectedSection.container?.bgImage || ''}
                      onChange={(e) => updateSectionContainer('bgImage', e.target.value)}
                      placeholder="https://..."
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Border Radius</label>
                  <select
                    value={selectedSection.container?.borderRadius || 'none'}
                    onChange={(e) => updateSectionContainer('borderRadius', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="none">None (0px)</option>
                    <option value="sm">Small (8px)</option>
                    <option value="md">Medium (12px)</option>
                    <option value="lg">Large (16px)</option>
                    <option value="xl">Extra Large (20px)</option>
                    <option value="2xl">2XL (24px)</option>
                    <option value="3xl">3XL (32px)</option>
                  </select>
                </div>
              </>
            )}
          </div>
        )}

        {/* LAYOUT & SPACING TAB */}
        {activeTab === 'layout' && selectedSection && (
          <div className="space-y-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Max Container Width</label>
              <select
                value={selectedSection.container?.maxWidth || '7xl'}
                onChange={(e) => updateSectionContainer('maxWidth', e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="full">Full Width (100%)</option>
                <option value="7xl">Extra Wide (1280px / 7xl)</option>
                <option value="5xl">Standard (1024px / 5xl)</option>
                <option value="4xl">Medium Boxed (896px / 4xl)</option>
                <option value="3xl">Narrow Boxed (768px / 3xl)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Vertical Padding</label>
                <select
                  value={selectedSection.container?.paddingY || 'md'}
                  onChange={(e) => updateSectionContainer('paddingY', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="none">None (0)</option>
                  <option value="xs">XS (8px)</option>
                  <option value="sm">SM (16px)</option>
                  <option value="md">MD (32px)</option>
                  <option value="lg">LG (48px)</option>
                  <option value="xl">XL (64px)</option>
                  <option value="2xl">2XL (96px)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Horizontal Padding</label>
                <select
                  value={selectedSection.container?.paddingX || 'md'}
                  onChange={(e) => updateSectionContainer('paddingX', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="none">None (0)</option>
                  <option value="sm">SM (16px)</option>
                  <option value="md">MD (24px)</option>
                  <option value="lg">LG (32px)</option>
                  <option value="xl">XL (48px)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Display Structure</label>
              <select
                value={selectedSection.layout?.display || 'block'}
                onChange={(e) => updateSectionLayout('display', e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="block">Stacked Block (Vertical Flow)</option>
                <option value="grid">Grid Columns Matrix</option>
              </select>
            </div>

            {selectedSection.layout?.display === 'grid' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Desktop Grid Cols</label>
                  <select
                    value={selectedSection.layout?.gridCols || 1}
                    onChange={(e) => updateSectionLayout('gridCols', Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value={1}>1 Column</option>
                    <option value={2}>2 Columns</option>
                    <option value={3}>3 Columns</option>
                    <option value={4}>4 Columns</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Grid Gap</label>
                  <select
                    value={selectedSection.layout?.gridGap || 'md'}
                    onChange={(e) => updateSectionLayout('gridGap', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="xs">XS (8px)</option>
                    <option value="sm">SM (12px)</option>
                    <option value="md">MD (20px)</option>
                    <option value="lg">LG (32px)</option>
                    <option value="xl">XL (48px)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* RESPONSIVE OVERRIDES TAB */}
        {activeTab === 'responsive' && selectedSection && (
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800">Mobile & Tablet Rules</h4>
            <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(selectedSection.responsive?.hideDesktop)}
                  onChange={(e) => updateSectionResponsive('hideDesktop', e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span className="font-semibold text-slate-700">Hide on Desktop</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(selectedSection.responsive?.hideTablet)}
                  onChange={(e) => updateSectionResponsive('hideTablet', e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span className="font-semibold text-slate-700">Hide on Tablet</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(selectedSection.responsive?.hideMobile)}
                  onChange={(e) => updateSectionResponsive('hideMobile', e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span className="font-semibold text-slate-700">Hide on Mobile</span>
              </label>
            </div>

            {selectedSection.layout?.display === 'grid' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Mobile Columns</label>
                  <select
                    value={selectedSection.responsive?.mobileCols || 1}
                    onChange={(e) => updateSectionResponsive('mobileCols', Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value={1}>1 Col (Stacked)</option>
                    <option value={2}>2 Cols (Side-by-side)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tablet Columns</label>
                  <select
                    value={selectedSection.responsive?.tabletCols || 2}
                    onChange={(e) => updateSectionResponsive('tabletCols', Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value={1}>1 Column</option>
                    <option value={2}>2 Columns</option>
                    <option value={3}>3 Columns</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ACTION / INTERACTION TAB */}
        {activeTab === 'action' && selectedComponent && (
          <div className="space-y-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Click Interaction Action</label>
              <select
                value={selectedComponent.action?.type || 'none'}
                onChange={(e) => updateComponentAction('type', e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="none">No Action (Static)</option>
                <option value="navigate">Navigate to Page Route</option>
                <option value="external_link">Open External Website URL</option>
                <option value="scroll">Scroll to Page Anchor</option>
              </select>
            </div>

            {selectedComponent.action?.type !== 'none' && (
              <div>
                <label className="block text-slate-700 font-bold mb-1">Target Destination</label>
                <input
                  type="text"
                  value={selectedComponent.action?.target || ''}
                  onChange={(e) => updateComponentAction('target', e.target.value)}
                  placeholder="e.g. /complaint/register or #services"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
