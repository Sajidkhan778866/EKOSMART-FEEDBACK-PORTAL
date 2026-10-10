import React from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  Save,
  Send,
  History,
  Palette,
  Eye,
  Plus,
  ChevronDown,
} from 'lucide-react';
import type { IPage, ViewportMode } from './types';

interface TopToolbarProps {
  pages: IPage[];
  activePage: IPage | null;
  onSelectPage: (page: IPage) => void;
  viewport: ViewportMode;
  onSelectViewport: (v: ViewportMode) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  isSaving: boolean;
  isPublishing: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
  onOpenRevisions: () => void;
  onOpenThemeDrawer: () => void;
  onOpenNewPageModal: () => void;
  previewMode: boolean;
  onTogglePreview: () => void;
  hasUnsavedChanges: boolean;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({
  pages,
  activePage,
  onSelectPage,
  viewport,
  onSelectViewport,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  isSaving,
  isPublishing,
  onSaveDraft,
  onPublish,
  onOpenRevisions,
  onOpenThemeDrawer,
  onOpenNewPageModal,
  previewMode,
  onTogglePreview,
  hasUnsavedChanges,
}) => {
  return (
    <header className="h-14 bg-slate-900 text-white border-b border-slate-800 px-4 flex items-center justify-between shrink-0 select-none z-30 shadow-md">
      {/* Left: Brand & Page Switcher */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 pr-3 border-r border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-sm shadow-sm">
            ⚡
          </div>
          <div>
            <span className="font-black text-xs text-white tracking-wide uppercase block leading-none">
              Frontend Studio
            </span>
            <span className="text-[10px] text-emerald-400 font-mono leading-none">100% Soft-Coded</span>
          </div>
        </div>

        {/* Page Selector Dropdown */}
        <div className="relative flex items-center gap-2">
          <div className="relative">
            <select
              value={activePage?.pageId || ''}
              onChange={(e) => {
                const target = pages.find((p) => p.pageId === e.target.value);
                if (target) onSelectPage(target);
              }}
              className="appearance-none bg-slate-800 hover:bg-slate-700/80 text-white text-xs font-bold pl-3 pr-8 py-1.5 rounded-xl border border-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {pages.map((p) => (
                <option key={p.pageId} value={p.pageId}>
                  {p.isHome ? '🏠 ' : '📄 '}
                  {p.title} ({p.slug})
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-2 text-slate-400 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={onOpenNewPageModal}
            title="Create New Dynamic Page"
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1 transition"
          >
            <Plus size={13} />
            <span className="hidden sm:inline">New Page</span>
          </button>

          {/* Status & Version Pill */}
          {activePage && (
            <div className="hidden lg:flex items-center gap-1.5 ml-1">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activePage.status === 'published'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                v{activePage.currentVersion || 1} • {activePage.status.toUpperCase()}
              </span>

              {hasUnsavedChanges && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
                  Draft Modified
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Center: Viewport Switcher & Undo/Redo */}
      <div className="flex items-center gap-3">
        {/* Viewport switcher */}
        <div className="bg-slate-800/90 p-0.5 rounded-xl border border-slate-700/80 flex items-center">
          <button
            type="button"
            onClick={() => onSelectViewport('desktop')}
            title="Desktop View (100%)"
            className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              viewport === 'desktop' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor size={14} />
            <span className="hidden md:inline text-[11px]">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectViewport('tablet')}
            title="Tablet View (768px)"
            className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              viewport === 'tablet' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tablet size={14} />
            <span className="hidden md:inline text-[11px]">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectViewport('mobile')}
            title="Mobile View (390px)"
            className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              viewport === 'mobile' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone size={14} />
            <span className="hidden md:inline text-[11px]">Mobile</span>
          </button>
        </div>

        {/* History controls */}
        <div className="hidden sm:flex items-center bg-slate-800/80 p-0.5 rounded-xl border border-slate-700/80">
          <button
            type="button"
            disabled={!canUndo}
            onClick={onUndo}
            title="Undo"
            className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 rounded-lg transition"
          >
            <Undo2 size={14} />
          </button>
          <button
            type="button"
            disabled={!canRedo}
            onClick={onRedo}
            title="Redo"
            className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 rounded-lg transition"
          >
            <Redo2 size={14} />
          </button>
        </div>
      </div>

      {/* Right: Actions (Theme, Revisions, Preview, Save Draft, Publish) */}
      <div className="flex items-center gap-2">
        {/* Global Design Tokens & Theme */}
        <button
          type="button"
          onClick={onOpenThemeDrawer}
          title="Configure Global Design Tokens, Colors & Navigation"
          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition shadow-xs"
        >
          <Palette size={14} className="text-amber-400" />
          <span className="hidden md:inline">Theme Tokens</span>
        </button>

        {/* Revisions & Rollback */}
        <button
          type="button"
          onClick={onOpenRevisions}
          title="Revision History & Rollback"
          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition"
        >
          <History size={14} className="text-sky-400" />
          <span className="hidden xl:inline">Revisions</span>
        </button>

        {/* Preview Toggle */}
        <button
          type="button"
          onClick={onTogglePreview}
          title={previewMode ? 'Exit Preview' : 'Interactive Full Preview'}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition ${
            previewMode
              ? 'bg-amber-500 text-slate-950 border-amber-400'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
        >
          <Eye size={14} />
          <span className="hidden sm:inline">{previewMode ? 'Edit Mode' : 'Preview'}</span>
        </button>

        {/* Save Draft */}
        <button
          type="button"
          disabled={isSaving}
          onClick={onSaveDraft}
          title="Save draft without modifying live site"
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition disabled:opacity-50"
        >
          <Save size={14} className="text-emerald-400" />
          <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
        </button>

        {/* Publish Live */}
        <button
          type="button"
          disabled={isPublishing}
          onClick={onPublish}
          title="Deploy and publish live to public frontend"
          className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-sm hover:shadow-emerald-500/20 disabled:opacity-50"
        >
          <Send size={13} />
          <span>{isPublishing ? 'Publishing...' : '🚀 Publish Live'}</span>
        </button>
      </div>
    </header>
  );
};
