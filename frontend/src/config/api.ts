const getDynamicHost = () => {
  if (import.meta.env.VITE_API_HOST) return import.meta.env.VITE_API_HOST;
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/api\/v1\/?$/, '').replace(/\/api\/?$/, '');
  }
  if (typeof window !== 'undefined' && window.location) {
    const { hostname, protocol, origin, port } = window.location;
    if (hostname.endsWith('.vercel.app') || (!port && hostname !== 'localhost' && hostname !== '127.0.0.1')) {
      return origin;
    }
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `${protocol}//${hostname}:5000`;
    }
  }
  return 'http://localhost:5000';
};

export const API_HOST = getDynamicHost();

export const API_BASE =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.port
    ? `${window.location.origin}/api/v1`
    : `${API_HOST}/api/v1`);

export const ADMIN_PORTAL_URL =
  import.meta.env.VITE_ADMIN_PORTAL_URL ||
  (typeof window !== 'undefined' &&
  window.location.hostname &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1'
    ? `${window.location.protocol}//${window.location.hostname}:5001`
    : 'http://localhost:5001');

export const EMPLOYEE_PORTAL_URL =
  import.meta.env.VITE_EMPLOYEE_PORTAL_URL ||
  (typeof window !== 'undefined' &&
  window.location.hostname &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1'
    ? `${window.location.protocol}//${window.location.hostname}:5002`
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
