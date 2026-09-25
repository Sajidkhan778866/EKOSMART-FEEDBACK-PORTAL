import axios from 'axios';

export const getCustomApiUrl = (): string => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const custom = localStorage.getItem('ekosmart_api_url');
    if (custom && custom.trim()) {
      return custom.trim().replace(/\/+$/, '');
    }
  }
  return '';
};

export const setCustomApiUrl = (url: string) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    let clean = url.trim().replace(/\/+$/, '');
    if (clean && !clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = `https://${clean}`;
    }
    localStorage.setItem('ekosmart_api_url', clean);
  }
};

export const clearCustomApiUrl = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('ekosmart_api_url');
  }
};

export const getDynamicHost = () => {
  const custom = getCustomApiUrl();
  if (custom) {
    return custom.replace(/\/api\/v1\/?$/, '').replace(/\/api\/?$/, '');
  }
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

export const getApiBaseUrl = (): string => {
  const custom = getCustomApiUrl();
  if (custom) {
    return custom.endsWith('/api/v1') ? custom : custom.endsWith('/api') ? `${custom}/v1` : `${custom}/api/v1`;
  }
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.port) {
    return `${window.location.origin}/api/v1`;
  }
  return `${getDynamicHost()}/api/v1`;
};

export const API_HOST = getDynamicHost();
export const API_BASE_URL = getApiBaseUrl();

export const resolveImageUrl = (url?: string): string => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  const currentHost = getDynamicHost();

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    if (
      trimmed.includes('localhost:5000') &&
      typeof window !== 'undefined' &&
      window.location.hostname &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
    ) {
      return trimmed.replace(/http:\/\/localhost:5000/, currentHost);
    }
    return trimmed;
  }

  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/')) {
    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${currentHost}${cleanPath}`;
  }

  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  return `${currentHost}/${trimmed}`;
};

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 20000,
});

apiClient.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl();
  const token = localStorage.getItem('ekosmart_admin_token');
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

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/admin/login', { email, password }),
  getMe: () => apiClient.get('/auth/me'),
};

export const employeeApi = {
  getAll: (params?: any) => apiClient.get('/admin/employees', { params }),
  getById: (id: string) => apiClient.get(`/admin/employees/${id}`),
  getEligible: (division: string) => apiClient.get(`/admin/employees/eligible/${division}`),
  create: (formData: FormData) =>
    apiClient.post('/admin/employees', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, formData: FormData) =>
    apiClient.put(`/admin/employees/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  toggleStatus: (id: string) => apiClient.patch(`/admin/employees/${id}/status`),
  delete: (id: string) => apiClient.delete(`/admin/employees/${id}`),
  export: (params?: any) => apiClient.get('/admin/employees/export', { params, responseType: 'blob' }),
  getTasks: (id: string) => apiClient.get(`/admin/employees/${id}/tasks`),
};

export const complaintTypeApi = {
  getAll: (params?: any) => apiClient.get('/complaint-types', { params }),
  create: (data: any) => apiClient.post('/complaint-types', data),
  update: (id: string, data: any) => apiClient.put(`/complaint-types/${id}`, data),
  delete: (id: string) => apiClient.delete(`/complaint-types/${id}`),
};

export const complaintApi = {
  getAll: (params?: any) => apiClient.get('/complaints/admin', { params }),
  getById: (id: string) => apiClient.get(`/complaints/${id}`),
  assign: (id: string, employeeId: string) =>
    apiClient.post(`/complaints/admin/${id}/assign`, { employeeId }),
  updateStatus: (id: string, status: string, priority?: string, remarks?: any) =>
    apiClient.patch(`/complaints/admin/${id}/status`, { status, priority, ...remarks }),
};

export const warrantyApi = {
  getAll: (params?: any) => apiClient.get('/warranty/admin', { params }),
};

export const formApi = {
  getSections: () => apiClient.get('/forms/public/sections'),
  getComplaintForms: () => apiClient.get('/forms/admin/complaints'),
  saveComplaintForm: (data: any) => apiClient.post('/forms/admin/complaint', data),
  deleteComplaintForm: (division: string) => apiClient.delete(`/forms/admin/complaint/${encodeURIComponent(division)}`),
  getWarrantyForms: () => apiClient.get('/forms/admin/warranties'),
  saveWarrantyForm: (data: any) => apiClient.post('/forms/admin/warranty', data),
  deleteWarrantyForm: (category: string) => apiClient.delete(`/forms/admin/warranty/${encodeURIComponent(category)}`),
};

export const dashboardApi = {
  getStats: () => apiClient.get('/dashboard/admin'),
  getCurrentApplications: (params?: any) => apiClient.get('/dashboard/current-applications', { params }),
};

export const customerApi = {
  getAll: (params?: any) => apiClient.get('/customers', { params }),
  create: (data: any) => apiClient.post('/customers', data),
};

export const contentApi = {
  getAdmin: () => apiClient.get('/content/admin'),
  updateAdmin: (data: any) => apiClient.put('/content/admin', data),
};
