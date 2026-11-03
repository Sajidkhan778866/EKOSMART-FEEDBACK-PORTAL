import React, { useEffect, useState } from 'react';
import { getApiBaseUrl, resolveImageUrl } from '../api/client';

interface EbsLogoProps {
  variant?: 'battery' | 'spare-parts' | 'header' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  customTitle?: string;
  customSubtitle?: string;
  logoType?: 'preset' | 'image';
  logoImage?: string;
  lightText?: boolean;
}

export interface PortalBrandingData {
  brandTitle: string;
  brandSubtitle: string;
  logoType: 'preset' | 'image';
  logoImage: string;
  faviconType: 'preset' | 'image';
  faviconImage: string;
  tabTitle: string;
}

const DEFAULT_ADMIN_BRANDING: PortalBrandingData = {
  brandTitle: 'EBS EKOSMART',
  brandSubtitle: 'Battery Solution • Li-ion & LFP',
  logoType: 'preset',
  logoImage: '',
  faviconType: 'preset',
  faviconImage: '',
  tabTitle: 'EBS Ekosmart | Admin Portal',
};

let cachedBranding: PortalBrandingData | null = null;

const applyDocumentBranding = (branding: PortalBrandingData) => {
  if (typeof document === 'undefined') return;
  if (branding.tabTitle) {
    document.title = branding.tabTitle;
  }
  const resolvedFavicon =
    branding.faviconType === 'image' && branding.faviconImage
      ? resolveImageUrl(branding.faviconImage)
      : branding.logoType === 'image' && branding.logoImage
        ? resolveImageUrl(branding.logoImage)
        : `${import.meta.env.BASE_URL || '/'}favicon.svg`.replace(/\/+/g, '/');

  let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  if (link.href !== resolvedFavicon) {
    link.href = resolvedFavicon;
  }
};

export const usePortalBranding = (): PortalBrandingData => {
  const [branding, setBranding] = useState<PortalBrandingData>(() => {
    if (cachedBranding) return cachedBranding;
    try {
      const saved = sessionStorage.getItem('ekosmart_admin_branding');
      if (saved) {
        const parsed = JSON.parse(saved);
        const next: PortalBrandingData = { ...DEFAULT_ADMIN_BRANDING, ...parsed };
        cachedBranding = next;
        return next;
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_ADMIN_BRANDING;
  });

  useEffect(() => {
    let mounted = true;

    const loadBranding = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/content/public`);
        const json = await res.json();
        if (json?.success && json.data) {
          const nav = json.data.headerNav || {};
          const hero = json.data.hero || {};

          const effectiveLogoType: 'preset' | 'image' =
            nav.adminLogoType === 'image'
              ? 'image'
              : nav.adminLogoType === 'preset'
                ? 'preset'
                : (nav.logoType || hero.logoType || 'preset');

          const effectiveLogoImage: string =
            nav.adminLogoType === 'image' && nav.adminLogoImage
              ? nav.adminLogoImage
              : nav.logoImage || hero.logoImage || '';

          const nextBranding: PortalBrandingData = {
            brandTitle: nav.adminBrandTitle || nav.brandTitle || 'EBS EKOSMART',
            brandSubtitle: nav.adminBrandSubtitle || nav.brandSubtitle || 'Battery Solution • Li-ion & LFP',
            logoType: effectiveLogoType,
            logoImage: effectiveLogoImage,
            faviconType: nav.faviconType || 'preset',
            faviconImage: nav.faviconImage || '',
            tabTitle:
              nav.adminTabTitle ||
              `${nav.adminBrandTitle || nav.brandTitle || 'EBS Ekosmart'} | Admin Portal`,
          };

          cachedBranding = nextBranding;
          try {
            sessionStorage.setItem('ekosmart_admin_branding', JSON.stringify(nextBranding));
          } catch {
            // ignore
          }
          applyDocumentBranding(nextBranding);
          if (mounted) setBranding(nextBranding);
        }
      } catch {
        applyDocumentBranding(branding);
      }
    };

    applyDocumentBranding(branding);
    loadBranding();

    const handleRefresh = () => {
      loadBranding();
    };
    window.addEventListener('cms-branding-updated', handleRefresh);
    return () => {
      mounted = false;
      window.removeEventListener('cms-branding-updated', handleRefresh);
    };
  }, []);

  return branding;
};

export const EbsLogo: React.FC<EbsLogoProps> = ({
  variant = 'header',
  size = 'md',
  showText = true,
  className = '',
  customTitle,
  customSubtitle,
  logoType,
  logoImage,
  lightText = true,
}) => {
  const branding = usePortalBranding();

  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-xs', sub: 'text-[9px]' },
    md: { icon: 'w-10 h-10', text: 'text-sm', sub: 'text-[10px]' },
    lg: { icon: 'w-14 h-14', text: 'text-lg', sub: 'text-xs' },
    xl: { icon: 'w-20 h-20', text: 'text-2xl', sub: 'text-sm' },
  };

  const { icon, text, sub } = sizeMap[size];

  const activeLogoType = logoType || branding.logoType || 'preset';
  const activeLogoImage = logoImage ?? branding.logoImage;
  const activeTitle = customTitle || branding.brandTitle || 'EBS EKOSMART';
  const activeSubtitle = customSubtitle || branding.brandSubtitle || 'Battery Solution • Li-ion & LFP';

  if (variant === 'spare-parts') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className={`${icon} rounded-xl bg-gradient-to-tr from-emerald-800 via-emerald-600 to-teal-400 p-0.5 shadow-md flex items-center justify-center flex-shrink-0`}>
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
              <defs>
                <linearGradient id="adminEsGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="50%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#15803d" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="44" stroke="url(#adminEsGreenGrad)" strokeWidth="6" strokeDasharray="180 50" />
              <path d="M 85 45 L 95 52 L 80 58 Z" fill="#4ade80" />
              <text x="50" y="62" textAnchor="middle" fill="url(#adminEsGreenGrad)" fontWeight="900" fontSize="34" fontFamily="Impact, Arial Black, sans-serif" letterSpacing="-1">
                ES
              </text>
            </svg>
          </div>
        </div>
        {showText && (
          <div>
            <div className={`font-black tracking-wider ${lightText ? 'text-white' : 'text-slate-900'} leading-none ${text} flex items-center gap-1`}>
              <span>EKOSMART</span>
              <span className="text-emerald-400">EV SPARE PARTS</span>
            </div>
            <span className={`text-slate-400 font-semibold tracking-wide block mt-0.5 ${sub}`}>
              Wholesale & Retail Genuine Parts
            </span>
          </div>
        )}
      </div>
    );
  }

  const titleParts = activeTitle.trim().split(' ');

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {activeLogoType === 'image' && activeLogoImage ? (
        <div className={`${icon} rounded-xl bg-white/95 p-0.5 shadow-md flex items-center justify-center flex-shrink-0 overflow-hidden border border-emerald-500/30`}>
          <img
            src={resolveImageUrl(activeLogoImage)}
            alt={activeTitle}
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <div className={`${icon} rounded-xl bg-gradient-to-tr from-emerald-700 via-green-500 to-teal-300 p-0.5 shadow-md flex items-center justify-center flex-shrink-0`}>
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
              <defs>
                <linearGradient id="adminEbsGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#86efac" />
                  <stop offset="50%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#166534" />
                </linearGradient>
              </defs>
              <path d="M 18 42 C 28 16, 72 16, 82 42" stroke="url(#adminEbsGreenGrad)" strokeWidth="7" strokeLinecap="round" />
              <polygon points="80,30 94,40 76,46" fill="#86efac" />
              <text x="50" y="68" textAnchor="middle" fill="url(#adminEbsGreenGrad)" fontWeight="900" fontSize="30" fontFamily="Impact, Arial Black, sans-serif" letterSpacing="-0.5">
                EBS
              </text>
            </svg>
          </div>
        </div>
      )}
      {showText && (
        <div>
          <div className={`font-black tracking-wider ${lightText ? 'text-white' : 'text-slate-900'} leading-tight ${text} flex items-center gap-1.5`}>
            {titleParts.length > 1 ? (
              <>
                <span className="text-emerald-400 font-black">{titleParts[0]}</span>
                <span className={lightText ? 'text-slate-100' : 'text-slate-800'}>{titleParts.slice(1).join(' ')}</span>
              </>
            ) : (
              <span className={lightText ? 'text-slate-100' : 'text-slate-800'}>{activeTitle}</span>
            )}
          </div>
          <span className={`text-emerald-400 font-bold uppercase tracking-wider block ${sub}`}>
            {activeSubtitle}
          </span>
        </div>
      )}
    </div>
  );
};

export default EbsLogo;
