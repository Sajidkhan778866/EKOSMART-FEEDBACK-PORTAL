// Centralized API Base URL Configuration for Vercel / Production / Local
export const API_HOST =
  import.meta.env.VITE_API_HOST ||
  (import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/api\/v1\/?$/, '')
    : 'http://localhost:5000');

export const API_BASE =
  import.meta.env.VITE_API_URL || `${API_HOST}/api/v1`;
