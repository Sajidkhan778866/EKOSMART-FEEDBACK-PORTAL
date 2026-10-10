import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { API_BASE } from '../../config/api';
import { DynamicComponentRegistry } from './ComponentRegistry';
import { Loader2, AlertCircle, Home, RefreshCw } from 'lucide-react';

interface ComponentConfig {
  id: string;
  type: string;
  name: string;
  props: Record<string, any>;
  colSpan?: number;
}

interface SectionConfig {
  id: string;
  name: string;
  containerWidth: 'boxed' | 'narrow' | 'full';
  backgroundColor?: string;
  paddingTop?: string;
  paddingBottom?: string;
  customCssClass?: string;
  columns?: number;
  components: ComponentConfig[];
}

interface PageData {
  title: string;
  slug: string;
  isPublished: boolean;
  sections: SectionConfig[];
  seoMetadata?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
}

interface DynamicPageRendererProps {
  slug?: string;
  fallback?: React.ReactNode;
}

export const DynamicPageRenderer: React.FC<DynamicPageRendererProps> = ({ slug: explicitSlug, fallback }) => {
  const params = useParams();
  const location = useLocation();

  // Determine slug: explicit prop > route param > current pathname
  const derivedSlug = (
    explicitSlug ||
    params.slug ||
    (location.pathname === '/' ? 'home' : location.pathname.replace(/^\/+|\/+$/g, ''))
  ).toLowerCase();

  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE}/frontend-builder/public/page/${derivedSlug}`);
        if (!res.ok) {
          throw new Error(`Page not found (${res.status})`);
        }
        const json = await res.json();

        if (isMounted) {
          if (json.success && json.data) {
            setPage(json.data);

            // Apply SEO dynamic title & description
            if (json.data.seoMetadata?.metaTitle) {
              document.title = `${json.data.seoMetadata.metaTitle} | Ekosmart`;
            } else if (json.data.title) {
              document.title = `${json.data.title} | Ekosmart Battery Solution`;
            }
          } else {
            throw new Error(json.message || 'Page configuration unavailable');
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to load page config');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPage();

    return () => {
      isMounted = false;
    };
  }, [derivedSlug]);

  if (loading && !fallback) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
          </div>
        </div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Rendering dynamic layout...
        </p>
      </div>
    );
  }

  // If page not found in CMS database or still fetching with a fallback, use the fallback JSX
  if (error || !page || !page.sections || page.sections.length === 0) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
          <AlertCircle size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Page Schema Not Found</h2>
          <p className="text-sm text-slate-600">
            The requested page <span className="font-mono font-bold text-slate-800">"/{derivedSlug}"</span> has not been published in the Admin Frontend Studio yet.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition"
          >
            <Home size={14} />
            <span>Return to Homepage</span>
          </Link>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl flex items-center gap-2 transition cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dynamic-page-wrapper w-full">
      {page.sections.map((section) => {
        const containerClass =
          section.containerWidth === 'narrow'
            ? 'container mx-auto max-w-4xl px-4'
            : section.containerWidth === 'full'
            ? 'w-full px-4 sm:px-6 lg:px-8'
            : 'container mx-auto max-w-7xl px-4';

        const customStyle: React.CSSProperties = {};
        if (section.backgroundColor) customStyle.backgroundColor = section.backgroundColor;
        if (section.paddingTop) customStyle.paddingTop = section.paddingTop;
        if (section.paddingBottom) customStyle.paddingBottom = section.paddingBottom;

        const gridCols =
          section.columns === 2
            ? 'grid-cols-1 md:grid-cols-2'
            : section.columns === 3
            ? 'grid-cols-1 md:grid-cols-3'
            : section.columns === 4
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            : 'grid-cols-1';

        return (
          <section
            key={section.id}
            id={section.id}
            style={customStyle}
            className={`w-full relative transition-colors ${section.customCssClass || ''}`}
          >
            <div className={containerClass}>
              <div className={`grid ${gridCols} gap-6 items-stretch`}>
                {section.components?.map((comp) => {
                  const colSpanClass =
                    comp.colSpan === 2
                      ? 'md:col-span-2'
                      : comp.colSpan === 3
                      ? 'lg:col-span-3'
                      : comp.colSpan === 4
                      ? 'lg:col-span-4'
                      : 'col-span-1';

                  return (
                    <div key={comp.id} id={comp.id} className={`${colSpanClass} w-full`}>
                      <DynamicComponentRegistry type={comp.type} props={comp.props} />
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};
