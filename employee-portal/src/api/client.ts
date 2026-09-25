import axios from 'axios';

const getDynamicHost = () => {
  if (import.meta.env.VITE_API_HOST) return import.meta.env.VITE_API_HOST;
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/api\/v1\/?$/, '').replace(/\/api\/?$/, '');
  }
  if (typeof window !== 'undefined' && window.location) {
    const { hostname, protocol, origin, port } = window.location;
    // On Vercel or cloud deployment without explicit port
    if (hostname.endsWith('.vercel.app') || (!port && hostname !== 'localhost' && hostname !== '127.0.0.1')) {
      return origin;
    }
    // On local LAN / Wi-Fi IP address
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `${protocol}//${hostname}:5000`;
    }
  }
  return 'http://localhost:5000';
};

export const API_HOST = getDynamicHost();

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.port
    ? `${window.location.origin}/api/v1`
    : `${API_HOST}/api/v1`);

export const resolveImageUrl = (url?: string): string => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

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

  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/')) {
    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${API_HOST}${cleanPath}`;
  }

  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  return `${API_HOST}/${trimmed}`;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ekosmart_emp_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    // If response is HTML (happens when a static SPA rewrite intercepts the API route)
    if (typeof response.data === 'string' && response.data.trim().toLowerCase().startsWith('<!doctype html')) {
      const error: any = new Error('Backend API endpoint returned HTML. Please verify backend deployment and VITE_API_URL.');
      error.response = {
        status: 404,
        data: {
          success: false,
          message: 'Backend API returned HTML instead of JSON. Ensure VITE_API_URL is configured in your Vercel project.',
        },
      };
      return Promise.reject(error);
    }
    return response;
  },
  (error) => {
    if (error.response && typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE html')) {
      error.response.data = {
        success: false,
        message: 'Backend API endpoint returned HTML. Please check VITE_API_URL or backend server.',
      };
    }
    return Promise.reject(error);
  }
);

export const empAuthApi = {
  login: (employeeId: string, password: string) =>
    apiClient.post('/auth/employee/login', { employeeId, password }),
  getDashboard: (employeeId: string) =>
    apiClient.get(`/dashboard/employee/${employeeId}`),
};

export const complaintApi = {
  getById: (id: string) => apiClient.get(`/complaints/${id}`),
  updateStatus: (id: string, status: string, priority?: string, remarks?: any) =>
    apiClient.patch(`/complaints/admin/${id}/status`, { status, priority, ...remarks }),
};

export const contentApi = {
  getPublic: () => apiClient.get('/content/public'),
};
