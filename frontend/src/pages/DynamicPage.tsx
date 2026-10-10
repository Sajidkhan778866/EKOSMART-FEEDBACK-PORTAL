import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { DynamicPageRenderer, type ISectionConfig } from '../components/renderer/DynamicPageRenderer';
import { API_BASE } from '../config/api';
import * as Icons from 'lucide-react';

interface DynamicPageData {
  id: string;
  slug: string;
  title: string;
  metaDescription?: string;
  sections: ISectionConfig[];
  customCss?: string;
}

export const DynamicPage: React.FC<{ fallbackRoute?: string }> = () => {
  const location = useLocation();
  const [pageData, setPageData] = useState<DynamicPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentPath = location.pathname || '/';

  useEffect(() => {
    setLoading(true);
    setError(null);

    const encodedPath = encodeURIComponent(currentPath);
    fetch(`${API_BASE}/pages/public/by-slug?path=${encodedPath}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Page not found (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.success && data.data) {
          setPageData(data.data);
          if (data.data.title) {
            document.title = `${data.data.title} — Ekosmart EV`;
          }
        } else {
          throw new Error(data.message || 'Failed to load page');
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPath]);

  // Inject custom CSS if defined on page
  useEffect(() => {
    if (pageData?.customCss) {
      const styleTag = document.createElement('style');
      styleTag.id = 'dynamic-page-custom-css';
      styleTag.innerHTML = pageData.customCss;
      document.head.appendChild(styleTag);

      return () => {
        const existing = document.getElementById('dynamic-page-custom-css');
        if (existing) existing.remove();
      };
    }
  }, [pageData]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-8">
        <div className="h-64 bg-slate-100 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-56 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !pageData || pageData.sections.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
          <Icons.AlertCircle size={32} />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Page Not Found or Under Construction</h1>
        <p className="text-slate-600 text-sm max-w-md mx-auto">
          The page at <code className="text-emerald-700 font-mono bg-emerald-50 px-1.5 py-0.5 rounded">{currentPath}</code> has not been published or has no active sections configured yet.
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <Link
            to="/"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors flex items-center gap-2"
          >
            <Icons.Home size={16} />
            <span>Return to Homepage</span>
          </Link>
          <Link
            to="/complaint/register"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm rounded-xl transition-colors"
          >
            Book Complaint
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-12">
      <DynamicPageRenderer sections={pageData.sections} />
    </div>
  );
};

export default DynamicPage;
