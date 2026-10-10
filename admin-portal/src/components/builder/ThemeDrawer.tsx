import React, { useState } from 'react';
import {
  X,
  Palette,
  Type,
  Navigation,
  Globe,
  Plus,
  Trash2,
  Save,
  Clock,
} from 'lucide-react';
import type { IThemeConfig } from './types';

interface ThemeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: IThemeConfig | null;
  onSaveTheme: (theme: IThemeConfig) => Promise<void>;
}

type ThemeTab = 'colors' | 'typography' | 'header' | 'footer' | 'timer';

export const ThemeDrawer: React.FC<ThemeDrawerProps> = ({
  isOpen,
  onClose,
  theme,
  onSaveTheme,
}) => {
  const [activeTab, setActiveTab] = useState<ThemeTab>('colors');
  const [formData, setFormData] = useState<IThemeConfig | null>(theme);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  React.useEffect(() => {
    if (theme) {
      setFormData(JSON.parse(JSON.stringify(theme)));
    }
  }, [theme, isOpen]);

  if (!isOpen || !formData) return null;

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSaveTheme(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      // error handled in parent
    } finally {
      setSaving(false);
    }
  };

  const updateColor = (key: string, val: string) => {
    setFormData({
      ...formData,
      tokens: {
        ...formData.tokens,
        colors: {
          ...formData.tokens.colors,
          [key]: val,
        },
      },
    });
  };

  const updateTypography = (key: string, val: any) => {
    setFormData({
      ...formData,
      tokens: {
        ...formData.tokens,
        typography: {
          ...formData.tokens.typography,
          [key]: val,
        },
      },
    });
  };

  const updateHeader = (key: string, val: any) => {
    setFormData({
      ...formData,
      header: {
        ...formData.header,
        [key]: val,
      },
    });
  };

  const updateFooter = (key: string, val: any) => {
    setFormData({
      ...formData,
      footer: {
        ...formData.footer,
        [key]: val,
      },
    });
  };

  const updateTimer = (key: string, val: any) => {
    setFormData({
      ...formData,
      loginPromptTimer: {
        ...formData.loginPromptTimer,
        [key]: val,
      },
    });
  };

  // Nav items management
  const addNavItem = () => {
    const newItems = [
      ...(formData.header.navItems || []),
      {
        id: `nav-${Date.now()}`,
        label: 'New Link',
        url: '/new-page',
        order: (formData.header.navItems || []).length + 1,
        isVisible: true,
      },
    ];
    updateHeader('navItems', newItems);
  };

  const updateNavItem = (index: number, key: string, val: any) => {
    const updated = [...(formData.header.navItems || [])];
    updated[index] = { ...updated[index], [key]: val };
    updateHeader('navItems', updated);
  };

  const removeNavItem = (index: number) => {
    const updated = (formData.header.navItems || []).filter((_, i) => i !== index);
    updateHeader('navItems', updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Palette size={18} />
            </div>
            <div>
              <h3 className="font-black text-sm text-white">Global Design Tokens & Layout</h3>
              <p className="text-[10px] text-slate-400">100% Admin Configurable Colors, Fonts, Header & Footer</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-2 pt-2 gap-1 overflow-x-auto text-xs">
          {[
            { key: 'colors' as ThemeTab, label: 'Color Tokens', icon: Palette },
            { key: 'typography' as ThemeTab, label: 'Typography', icon: Type },
            { key: 'header' as ThemeTab, label: 'Header & Menu', icon: Navigation },
            { key: 'footer' as ThemeTab, label: 'Footer Links', icon: Globe },
            { key: 'timer' as ThemeTab, label: 'Login Timer', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-2 text-xs font-bold rounded-t-xl transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-white text-emerald-800 border-t-2 border-l border-r border-slate-200 shadow-2xs font-black'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-emerald-600' : 'text-slate-400'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* TAB 1: COLORS */}
          {activeTab === 'colors' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                <span className="font-bold block text-xs">Live CSS Variables Injection</span>
                <span className="text-[11px] text-emerald-700">
                  Changes here apply instantly across all buttons, headers, accents and cards.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'primary', label: 'Primary Brand Color', default: '#059669' },
                  { key: 'primaryHover', label: 'Primary Hover State', default: '#047857' },
                  { key: 'secondary', label: 'Secondary Accent', default: '#0284c7' },
                  { key: 'accent', label: 'Highlight Accent (Coins)', default: '#d97706' },
                  { key: 'background', label: 'Page Background', default: '#f8fafc' },
                  { key: 'surface', label: 'Card Surface Color', default: '#ffffff' },
                  { key: 'text', label: 'Body Text Color', default: '#0f172a' },
                  { key: 'textMuted', label: 'Muted Text Color', default: '#64748b' },
                  { key: 'headerBg', label: 'Header Background', default: '#ffffff' },
                  { key: 'footerBg', label: 'Footer Background', default: '#0f172a' },
                ].map((clr) => (
                  <div key={clr.key} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <label className="block font-bold text-slate-700 text-[11px]">{clr.label}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={(formData.tokens.colors as any)[clr.key] || clr.default}
                        onChange={(e) => updateColor(clr.key, e.target.value)}
                        className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={(formData.tokens.colors as any)[clr.key] || clr.default}
                        onChange={(e) => updateColor(clr.key, e.target.value)}
                        className="flex-1 p-1.5 bg-white border border-slate-200 rounded-lg font-mono text-xs font-bold"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: TYPOGRAPHY */}
          {activeTab === 'typography' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Body Font Family</label>
                <select
                  value={formData.tokens.typography.fontFamily}
                  onChange={(e) => updateTypography('fontFamily', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="Inter, system-ui, sans-serif">Inter (Modern Clean Sans)</option>
                  <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans</option>
                  <option value="'Roboto', sans-serif">Roboto</option>
                  <option value="'Poppins', sans-serif">Poppins</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Heading Font Family</label>
                <select
                  value={formData.tokens.typography.headingFont}
                  onChange={(e) => updateTypography('headingFont', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="Inter, system-ui, sans-serif">Inter</option>
                  <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans</option>
                  <option value="'Montserrat', sans-serif">Montserrat</option>
                  <option value="'Outfit', sans-serif">Outfit</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Base Font Size</label>
                  <input
                    type="text"
                    value={formData.tokens.typography.baseFontSize}
                    onChange={(e) => updateTypography('baseFontSize', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Heading Scale Ratio</label>
                  <input
                    type="number"
                    step="0.05"
                    value={formData.tokens.typography.headingScaleRatio}
                    onChange={(e) => updateTypography('headingScaleRatio', Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HEADER & NAVIGATION */}
          {activeTab === 'header' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand Title</label>
                  <input
                    type="text"
                    value={formData.header.siteTitle}
                    onChange={(e) => updateHeader('siteTitle', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={formData.header.tagline}
                    onChange={(e) => updateHeader('tagline', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.header.isSticky}
                    onChange={(e) => updateHeader('isSticky', e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span className="font-bold text-slate-800">Sticky Navbar</span>
                </label>
                <label className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.header.showCustomerLoginButton}
                    onChange={(e) => updateHeader('showCustomerLoginButton', e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span className="font-bold text-slate-800">Customer Login CTA</span>
                </label>
              </div>

              {/* Navigation Items Manager */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-xs text-slate-900">Navigation Menu Items</h4>
                  <button
                    type="button"
                    onClick={addNavItem}
                    className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[11px] font-bold flex items-center gap-1"
                  >
                    <Plus size={12} />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(formData.header.navItems || []).map((nav, idx) => (
                    <div
                      key={nav.id || idx}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={nav.label}
                        onChange={(e) => updateNavItem(idx, 'label', e.target.value)}
                        placeholder="Label"
                        className="w-1/3 p-1.5 bg-white border border-slate-200 rounded-lg font-bold text-xs"
                      />
                      <input
                        type="text"
                        value={nav.url}
                        onChange={(e) => updateNavItem(idx, 'url', e.target.value)}
                        placeholder="/route"
                        className="flex-1 p-1.5 bg-white border border-slate-200 rounded-lg font-mono text-[11px]"
                      />
                      <button
                        type="button"
                        onClick={() => removeNavItem(idx)}
                        className="p-1 text-rose-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FOOTER */}
          {activeTab === 'footer' && (
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={formData.footer.companyName}
                  onChange={(e) => updateFooter('companyName', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kota Plant Address</label>
                <input
                  type="text"
                  value={formData.footer.address}
                  onChange={(e) => updateFooter('address', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Helpline Phone</label>
                  <input
                    type="text"
                    value={formData.footer.phone}
                    onChange={(e) => updateFooter('phone', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Support Email</label>
                  <input
                    type="text"
                    value={formData.footer.email}
                    onChange={(e) => updateFooter('email', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LOGIN PROMPT TIMER */}
          {activeTab === 'timer' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-950">
                    <input
                      type="checkbox"
                      checked={formData.loginPromptTimer?.enabled}
                      onChange={(e) => updateTimer('enabled', e.target.checked)}
                      className="rounded text-amber-600"
                    />
                    <span>Enable Customer Login Modal Timer</span>
                  </label>
                  <span className="text-[10px] font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">
                    Soft-Coded
                  </span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  Opens the frontend normally for visitors. After the configured seconds, asks them to log in to access wallet coins, referrals, and bills.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Timer Duration (Seconds)</label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={formData.loginPromptTimer?.durationSeconds || 20}
                  onChange={(e) => updateTimer('durationSeconds', Number(e.target.value) || 20)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Modal Heading Title</label>
                <input
                  type="text"
                  value={formData.loginPromptTimer?.title || ''}
                  onChange={(e) => updateTimer('title', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Modal Message Body</label>
                <textarea
                  rows={3}
                  value={formData.loginPromptTimer?.message || ''}
                  onChange={(e) => updateTimer('message', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] font-bold text-emerald-700">
            {saveSuccess ? '✓ Design Tokens Saved Live!' : ''}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Save size={13} />
              <span>{saving ? 'Saving Tokens...' : 'Save Global Tokens'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
