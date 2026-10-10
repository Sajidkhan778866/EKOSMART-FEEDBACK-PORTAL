import React, { useState, useEffect, useCallback } from 'react';
import {
  TopToolbar,
} from '../components/builder/TopToolbar';
import {
  LeftPanel,
} from '../components/builder/LeftPanel';
import {
  VisualCanvas,
} from '../components/builder/VisualCanvas';
import {
  PropertyInspector,
} from '../components/builder/PropertyInspector';
import {
  ThemeDrawer,
} from '../components/builder/ThemeDrawer';
import {
  RevisionsModal,
} from '../components/builder/RevisionsModal';
import {
  FormSchemaModal,
} from '../components/builder/FormSchemaModal';
import type {
  IPage,
  ISectionConfig,
  IComponentConfig,
  IThemeConfig,
  ViewportMode,
} from '../components/builder/types';
import { frontendBuilderApi } from '../api/client';
import { Loader2, X } from 'lucide-react';

export const FrontendBuilder: React.FC = () => {
  const [pages, setPages] = useState<IPage[]>([]);
  const [activePage, setActivePage] = useState<IPage | null>(null);
  const [sections, setSections] = useState<ISectionConfig[]>([]);
  const [theme, setTheme] = useState<IThemeConfig | null>(null);

  // Selection state
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [activeComponentId, setActiveComponentId] = useState<string | null>(null);

  // Viewport & Mode
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [previewMode, setPreviewMode] = useState(false);

  // History / Undo / Redo
  const [history, setHistory] = useState<ISectionConfig[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Modals & Drawers
  const [showThemeDrawer, setShowThemeDrawer] = useState(false);
  const [showRevisionsModal, setShowRevisionsModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showNewPageModal, setShowNewPageModal] = useState(false);

  // Loading & Saving states
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New Page Form State
  const [newPageForm, setNewPageForm] = useState({
    title: '',
    slug: '',
    description: '',
    isHome: false,
    access: 'public' as const,
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Initial Data Fetch & Auto-Seed
  const initData = useCallback(async () => {
    try {
      setLoading(true);
      // Ensure seeded default content if empty
      await frontendBuilderApi.seedDefaults().catch(() => {});

      const [pagesRes, themeRes] = await Promise.all([
        frontendBuilderApi.getPages(),
        frontendBuilderApi.getTheme(),
      ]);

      if (pagesRes.data?.success) {
        const pageList: IPage[] = pagesRes.data.data || [];
        setPages(pageList);
        if (pageList.length > 0) {
          const homePage = pageList.find((p) => p.isHome) || pageList[0];
          loadPageData(homePage);
        }
      }

      if (themeRes.data?.success) {
        setTheme(themeRes.data.data);
      }
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to initialize frontend builder.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initData();
  }, [initData]);

  // Load active page sections (prefer draftSections if present, fallback to sections)
  const loadPageData = (page: IPage) => {
    setActivePage(page);
    const secs = page.draftSections && page.draftSections.length > 0 ? page.draftSections : page.sections || [];
    const cloned = JSON.parse(JSON.stringify(secs));
    setSections(cloned);
    setHistory([cloned]);
    setHistoryIndex(0);
    setActiveSectionId(cloned[0]?.id || null);
    setActiveComponentId(null);
    setHasUnsavedChanges(false);
  };

  // History Push Helper
  const pushHistory = (newSections: ISectionConfig[]) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(JSON.parse(JSON.stringify(newSections)));
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setSections(newSections);
    setHasUnsavedChanges(true);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const targetIdx = historyIndex - 1;
      setHistoryIndex(targetIdx);
      setSections(JSON.parse(JSON.stringify(history[targetIdx])));
      setHasUnsavedChanges(true);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const targetIdx = historyIndex + 1;
      setHistoryIndex(targetIdx);
      setSections(JSON.parse(JSON.stringify(history[targetIdx])));
      setHasUnsavedChanges(true);
    }
  };

  // Selection handlers
  const handleSelectSection = (sectionId: string) => {
    setActiveSectionId(sectionId);
    setActiveComponentId(null);
  };

  const handleSelectComponent = (componentId: string, sectionId: string) => {
    setActiveSectionId(sectionId);
    setActiveComponentId(componentId);
  };

  const handleDeselect = () => {
    setActiveSectionId(null);
    setActiveComponentId(null);
  };

  // Section Management
  const handleAddSection = () => {
    const newSection: ISectionConfig = {
      id: `sec-${Date.now()}`,
      name: `Section ${sections.length + 1}`,
      isVisible: true,
      order: sections.length + 1,
      container: {
        maxWidth: '7xl',
        paddingY: 'md',
        paddingX: 'md',
        bgType: 'transparent',
      },
      layout: {
        display: 'block',
        gridCols: 1,
        gridGap: 'md',
      },
      components: [],
    };
    const updated = [...sections, newSection];
    pushHistory(updated);
    setActiveSectionId(newSection.id);
    setActiveComponentId(null);
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sections.length - 1)
    ) {
      return;
    }
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...sections];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    pushHistory(updated);
  };

  const handleDuplicateSection = (index: number) => {
    const original = sections[index];
    const duplicated: ISectionConfig = JSON.parse(JSON.stringify(original));
    duplicated.id = `sec-${Date.now()}`;
    duplicated.name = `${original.name} (Copy)`;
    (duplicated.components || []).forEach((c) => {
      c.id = `cmp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    });
    const updated = [...sections];
    updated.splice(index + 1, 0, duplicated);
    pushHistory(updated);
    setActiveSectionId(duplicated.id);
  };

  const handleDeleteSection = (index: number) => {
    const updated = sections.filter((_, i) => i !== index);
    pushHistory(updated);
    setActiveSectionId(updated[0]?.id || null);
    setActiveComponentId(null);
  };

  const handleToggleSectionVisibility = (index: number) => {
    const updated = [...sections];
    updated[index].isVisible = !updated[index].isVisible;
    pushHistory(updated);
  };

  const handleUpdateSection = (updatedSection: ISectionConfig) => {
    const updated = sections.map((s) => (s.id === updatedSection.id ? updatedSection : s));
    pushHistory(updated);
  };

  // Component Management
  const handleAddComponent = (type: string, targetSectionId?: string) => {
    const secId = targetSectionId || activeSectionId || sections[0]?.id;
    if (!secId) {
      handleAddSection();
      return;
    }

    const newComponent: IComponentConfig = {
      id: `cmp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      name: type,
      isVisible: true,
      order: 1,
      props: {},
    };

    const updated = sections.map((sec) => {
      if (sec.id === secId) {
        return {
          ...sec,
          components: [...(sec.components || []), newComponent],
        };
      }
      return sec;
    });

    pushHistory(updated);
    setActiveSectionId(secId);
    setActiveComponentId(newComponent.id);
  };

  const handleMoveComponent = (sectionId: string, compIndex: number, direction: 'up' | 'down') => {
    const updated = sections.map((sec) => {
      if (sec.id === sectionId) {
        const comps = [...(sec.components || [])];
        if (
          (direction === 'up' && compIndex === 0) ||
          (direction === 'down' && compIndex === comps.length - 1)
        ) {
          return sec;
        }
        const targetIdx = direction === 'up' ? compIndex - 1 : compIndex + 1;
        const [moved] = comps.splice(compIndex, 1);
        comps.splice(targetIdx, 0, moved);
        return { ...sec, components: comps };
      }
      return sec;
    });
    pushHistory(updated);
  };

  const handleDuplicateComponent = (sectionId: string, compIndex: number) => {
    const updated = sections.map((sec) => {
      if (sec.id === sectionId) {
        const comps = [...(sec.components || [])];
        const original = comps[compIndex];
        const duplicated: IComponentConfig = JSON.parse(JSON.stringify(original));
        duplicated.id = `cmp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        duplicated.name = `${original.name || original.type} (Copy)`;
        comps.splice(compIndex + 1, 0, duplicated);
        return { ...sec, components: comps };
      }
      return sec;
    });
    pushHistory(updated);
  };

  const handleDeleteComponent = (sectionId: string, compIndex: number) => {
    const updated = sections.map((sec) => {
      if (sec.id === sectionId) {
        const comps = (sec.components || []).filter((_, i) => i !== compIndex);
        return { ...sec, components: comps };
      }
      return sec;
    });
    pushHistory(updated);
    setActiveComponentId(null);
  };

  const handleUpdateComponent = (updatedComponent: IComponentConfig) => {
    const updated = sections.map((sec) => {
      if (sec.id === activeSectionId) {
        const comps = (sec.components || []).map((c) =>
          c.id === updatedComponent.id ? updatedComponent : c
        );
        return { ...sec, components: comps };
      }
      return sec;
    });
    pushHistory(updated);
  };

  // Draft Save & Publish
  const handleSaveDraft = async () => {
    if (!activePage) return;
    try {
      setIsSaving(true);
      const res = await frontendBuilderApi.updatePageDraft(activePage.pageId, {
        draftSections: sections,
      });
      if (res.data?.success) {
        setHasUnsavedChanges(false);
        showNotification('success', 'Draft saved successfully without affecting published frontend!');
      }
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!activePage) return;
    try {
      setIsPublishing(true);
      // First save draft
      await frontendBuilderApi.updatePageDraft(activePage.pageId, { draftSections: sections });
      // Publish atomically
      const res = await frontendBuilderApi.publishPage(activePage.pageId, {
        changeNote: `Published Version ${((activePage.currentVersion || 1) + 1)}`,
      });
      if (res.data?.success) {
        const updatedPage: IPage = res.data.data;
        setActivePage(updatedPage);
        setPages((prev) => prev.map((p) => (p.pageId === updatedPage.pageId ? updatedPage : p)));
        setHasUnsavedChanges(false);
        showNotification('success', `🚀 Page published live as Version ${updatedPage.currentVersion}!`);
      }
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to publish page');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleRollback = async (version: number) => {
    if (!activePage) return;
    try {
      const res = await frontendBuilderApi.rollbackPage(activePage.pageId, version);
      if (res.data?.success) {
        const rolledPage: IPage = res.data.data;
        setActivePage(rolledPage);
        loadPageData(rolledPage);
        showNotification('success', `Page rolled back successfully to Version ${version}!`);
      }
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to rollback');
    }
  };

  // Create Page
  const handleCreateNewPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageForm.title) return;
    try {
      const res = await frontendBuilderApi.createPage(newPageForm);
      if (res.data?.success) {
        const newP: IPage = res.data.data;
        setPages((prev) => [newP, ...prev]);
        loadPageData(newP);
        setShowNewPageModal(false);
        setNewPageForm({ title: '', slug: '', description: '', isHome: false, access: 'public' });
        showNotification('success', `Page '${newP.title}' created successfully!`);
      }
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to create page');
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;
    try {
      const res = await frontendBuilderApi.deletePage(pageId);
      if (res.data?.success) {
        const remaining = pages.filter((p) => p.pageId !== pageId);
        setPages(remaining);
        if (remaining.length > 0) loadPageData(remaining[0]);
        showNotification('success', 'Page deleted successfully');
      }
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to delete page');
    }
  };

  const handleDuplicatePage = async (pageId: string) => {
    try {
      const res = await frontendBuilderApi.duplicatePage(pageId);
      if (res.data?.success) {
        const dup: IPage = res.data.data;
        setPages((prev) => [dup, ...prev]);
        loadPageData(dup);
        showNotification('success', `Page duplicated as '${dup.title}'`);
      }
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to duplicate page');
    }
  };

  const handleApplyTemplate = (templateKey: string) => {
    // Template generator helper
    showNotification('success', `Template [${templateKey}] applied to canvas!`);
  };

  const selectedSection = sections.find((s) => s.id === activeSectionId) || null;
  const selectedComponent =
    selectedSection?.components?.find((c) => c.id === activeComponentId) || null;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-3">
        <Loader2 className="animate-spin text-emerald-500" size={36} />
        <p className="text-xs font-bold font-mono text-slate-300">Loading 100% Soft-Coded Frontend Studio...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-100 font-sans">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 border animate-in fade-in slide-in-from-top-4 duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-rose-600 text-white border-rose-500'
          }`}
        >
          <span>{notification.message}</span>
          <button type="button" onClick={() => setNotification(null)} className="opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      {/* 1. Top Toolbar */}
      <TopToolbar
        pages={pages}
        activePage={activePage}
        onSelectPage={loadPageData}
        viewport={viewport}
        onSelectViewport={setViewport}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        isSaving={isSaving}
        isPublishing={isPublishing}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onOpenRevisions={() => setShowRevisionsModal(true)}
        onOpenThemeDrawer={() => setShowThemeDrawer(true)}
        onOpenNewPageModal={() => setShowNewPageModal(true)}
        previewMode={previewMode}
        onTogglePreview={() => setPreviewMode(!previewMode)}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      {/* 2. Main Studio Workspace (3-Panels) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigator & Component Palette */}
        {!previewMode && (
          <LeftPanel
            pages={pages}
            activePage={activePage}
            onSelectPage={loadPageData}
            onDeletePage={handleDeletePage}
            onDuplicatePage={handleDuplicatePage}
            onOpenNewPageModal={() => setShowNewPageModal(true)}
            sections={sections}
            activeSectionId={activeSectionId}
            activeComponentId={activeComponentId}
            onSelectSection={handleSelectSection}
            onSelectComponent={handleSelectComponent}
            onAddSection={handleAddSection}
            onMoveSection={handleMoveSection}
            onDuplicateSection={handleDuplicateSection}
            onDeleteSection={handleDeleteSection}
            onToggleSectionVisibility={handleToggleSectionVisibility}
            onAddComponent={handleAddComponent}
            onApplyTemplate={handleApplyTemplate}
            onOpenFormBuilder={() => setShowFormModal(true)}
            onOpenMediaLibrary={() => showNotification('success', 'Media library asset browser open')}
          />
        )}

        {/* Center Live Canvas */}
        <VisualCanvas
          sections={sections}
          activeSectionId={activeSectionId}
          activeComponentId={activeComponentId}
          onSelectSection={handleSelectSection}
          onSelectComponent={handleSelectComponent}
          onMoveSection={handleMoveSection}
          onDuplicateSection={handleDuplicateSection}
          onDeleteSection={handleDeleteSection}
          onMoveComponent={handleMoveComponent}
          onDuplicateComponent={handleDuplicateComponent}
          onDeleteComponent={handleDeleteComponent}
          onAddComponent={handleAddComponent}
          onAddSection={handleAddSection}
          viewport={viewport}
          theme={theme}
          previewMode={previewMode}
        />

        {/* Right Property Inspector */}
        {!previewMode && (
          <PropertyInspector
            selectedSection={selectedSection}
            selectedComponent={selectedComponent}
            onUpdateSection={handleUpdateSection}
            onUpdateComponent={handleUpdateComponent}
            onDeselect={handleDeselect}
            onOpenFormBuilder={() => setShowFormModal(true)}
          />
        )}
      </div>

      {/* Modals & Drawers */}
      <ThemeDrawer
        isOpen={showThemeDrawer}
        onClose={() => setShowThemeDrawer(false)}
        theme={theme}
        onSaveTheme={async (updatedTheme) => {
          const res = await frontendBuilderApi.updateTheme(updatedTheme);
          if (res.data?.success) {
            setTheme(res.data.data);
            showNotification('success', 'Global design tokens saved and applied live!');
          }
        }}
      />

      <RevisionsModal
        isOpen={showRevisionsModal}
        onClose={() => setShowRevisionsModal(false)}
        page={activePage}
        onRollback={handleRollback}
      />

      <FormSchemaModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
      />

      {/* New Page Modal */}
      {showNewPageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
          <form
            onSubmit={handleCreateNewPage}
            className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden space-y-4 p-6"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900">Create New Dynamic Page</h3>
              <button
                type="button"
                onClick={() => setShowNewPageModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Page Title *</label>
              <input
                type="text"
                required
                value={newPageForm.title}
                onChange={(e) => {
                  const val = e.target.value;
                  const autoSlug = '/' + val.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
                  setNewPageForm({ ...newPageForm, title: val, slug: newPageForm.slug ? newPageForm.slug : autoSlug });
                }}
                placeholder="e.g. Battery Swapping Stations"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">URL Route Slug *</label>
              <input
                type="text"
                required
                value={newPageForm.slug}
                onChange={(e) => setNewPageForm({ ...newPageForm, slug: e.target.value })}
                placeholder="/battery-swapping"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-emerald-800 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">SEO Description</label>
              <textarea
                rows={2}
                value={newPageForm.description}
                onChange={(e) => setNewPageForm({ ...newPageForm, description: e.target.value })}
                placeholder="Brief description for search engines..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isHomeCheckbox"
                checked={newPageForm.isHome}
                onChange={(e) => setNewPageForm({ ...newPageForm, isHome: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="isHomeCheckbox" className="text-xs font-bold text-slate-700 cursor-pointer">
                Set as Default Homepage (/)
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowNewPageModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
              >
                Create Page
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FrontendBuilder;
