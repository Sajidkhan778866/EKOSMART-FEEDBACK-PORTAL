export const normalizeApiBaseUrl = (rawUrl?: string): string => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let url = rawUrl.trim();
  if (!url) return '';

  // Add protocol if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    if (url.startsWith('localhost') || url.startsWith('127.0.0.1')) {
      url = `http://${url}`;
    } else {
      url = `https://${url}`;
    }
  }

  // Remove trailing slashes
  url = url.replace(/\/+$/, '');

  // Strip off any existing /api/v1, /api, or /v1 suffixes cleanly
  while (url.endsWith('/api/v1') || url.endsWith('/api') || url.endsWith('/v1')) {
    if (url.endsWith('/api/v1')) {
      url = url.slice(0, -7).replace(/\/+$/, '');
    } else if (url.endsWith('/api')) {
      url = url.slice(0, -4).replace(/\/+$/, '');
    } else if (url.endsWith('/v1')) {
      url = url.slice(0, -3).replace(/\/+$/, '');
    }
  }

  return `${url}/api/v1`;
};

export const sanitizeApiUrl = (url: string): string => {
  return normalizeApiBaseUrl(url);
};

export const getCustomApiUrl = (): string => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const custom = localStorage.getItem('ekosmart_api_url');
    if (custom && custom.trim()) {
      const normalized = normalizeApiBaseUrl(custom);
      if (normalized !== custom.trim()) {
        localStorage.setItem('ekosmart_api_url', normalized);
      }
      return normalized;
    }
  }
  return '';
};

export const getDynamicHost = (): string => {
  const custom = getCustomApiUrl();
  if (custom) {
    return normalizeApiBaseUrl(custom).replace(/\/api\/v1\/?$/, '');
  }
  if (import.meta.env.VITE_API_HOST) {
    return import.meta.env.VITE_API_HOST.trim().replace(/\/+$/, '');
  }
  if (import.meta.env.VITE_API_URL) {
    return normalizeApiBaseUrl(import.meta.env.VITE_API_URL).replace(/\/api\/v1\/?$/, '');
  }
  if (typeof window !== 'undefined' && window.location) {
    const { hostname, protocol, origin } = window.location;
    // On local LAN / Wi-Fi IP address or localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${protocol}//${hostname}:5000`;
    }
    // On cPanel or custom production domain (e.g. ekosmartdrive.in)
    return origin;
  }
  return 'http://localhost:5000';
};

export const API_HOST = getDynamicHost();

export const API_BASE = (() => {
  const custom = getCustomApiUrl();
  if (custom) {
    return normalizeApiBaseUrl(custom);
  }
  if (import.meta.env.VITE_API_URL) {
    return normalizeApiBaseUrl(import.meta.env.VITE_API_URL);
  }
  if (typeof window !== 'undefined' && window.location) {
    const { hostname, origin, port } = window.location;
    // When running in local development with Vite dev server (e.g. port 5003)
    if (port && (hostname === 'localhost' || hostname === '127.0.0.1')) {
      return `${origin}/api/v1`;
    }
    // In production on cPanel (e.g. https://www.ekosmartdrive.in)
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return normalizeApiBaseUrl(origin);
    }
  }
  return normalizeApiBaseUrl(getDynamicHost());
})();

export const ADMIN_PORTAL_URL =
  import.meta.env.VITE_ADMIN_PORTAL_URL ||
  (typeof window !== 'undefined' &&
  window.location.hostname &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1'
    ? `${window.location.origin}/admin`
    : 'http://localhost:5001');

export const EMPLOYEE_PORTAL_URL =
  import.meta.env.VITE_EMPLOYEE_PORTAL_URL ||
  (typeof window !== 'undefined' &&
  window.location.hostname &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1'
    ? `${window.location.origin}/employee`
    : 'http://localhost:5002');

/**
 * Universal Image Resolver: Ensures all image URLs (Base64 data URLs, backend uploads,
 * relative paths, external CDNs) resolve correctly across Desktop, Mobile LAN, and Vercel.
 */
export const resolveImageUrl = (url?: string): string => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Data URLs (Base64) or Object Blobs
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // Absolute HTTP / HTTPS URLs
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    if (
      trimmed.includes('localhost:5000') &&
      typeof window !== 'undefined' &&
      window.location.hostname &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
    ) {
      return trimmed.replace(/http:\/\/localhost:5000/, API_HOST);
    }
    return trimmed;
  }

  // Server uploads path (/uploads/... or uploads/...)
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/')) {
    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${API_HOST}${cleanPath}`;
  }

  // Root-relative asset paths (e.g. /assets/... or /favicon.svg)
  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  return `${API_HOST}/${trimmed}`;
};
