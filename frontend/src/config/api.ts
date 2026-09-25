// Centralized API Base URL Configuration for Vercel / Production / Local
export const API_HOST =
  import.meta.env.VITE_API_HOST ||
  (import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/api\/v1\/?$/, '')
    : 'http://localhost:5000');

export const API_BASE =
  import.meta.env.VITE_API_URL || `${API_HOST}/api/v1`;

export const ADMIN_PORTAL_URL =
  import.meta.env.VITE_ADMIN_PORTAL_URL || 'http://localhost:5001';

export const EMPLOYEE_PORTAL_URL =
  import.meta.env.VITE_EMPLOYEE_PORTAL_URL || 'http://localhost:5002';
