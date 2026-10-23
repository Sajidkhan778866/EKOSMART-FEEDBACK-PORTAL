import axios from 'axios';

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

export const setCustomApiUrl = (url: string) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const clean = normalizeApiBaseUrl(url);
    if (clean) {
      localStorage.setItem('ekosmart_api_url', clean);
    }
  }
};

export const clearCustomApiUrl = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('ekosmart_api_url');
  }
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

export const getApiBaseUrl = (): string => {
  const custom = getCustomApiUrl();
  if (custom) {
    return normalizeApiBaseUrl(custom);
  }
  if (import.meta.env.VITE_API_URL) {
    return normalizeApiBaseUrl(import.meta.env.VITE_API_URL);
  }
  if (typeof window !== 'undefined' && window.location) {
    const { hostname, origin, port } = window.location;
    // When running in local development with Vite dev server (e.g. port 5002)
    // Vite proxy forwards /api to backend http://localhost:5000
    if (port && (hostname === 'localhost' || hostname === '127.0.0.1')) {
      return `${origin}/api/v1`;
    }
    // In production on cPanel (e.g. https://www.ekosmartdrive.in)
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return normalizeApiBaseUrl(origin);
    }
  }
  return normalizeApiBaseUrl(getDynamicHost());
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
      const error: any = new Error('Backend API endpoint returned HTML. Please verify backend deployment.');
      error.response = {
        status: 404,
        data: {
          success: false,
          message: 'Backend API returned HTML instead of JSON. Ensure backend server is running.',
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

    // Auto-handle 401 Unauthorized (expired / missing / invalid token)
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        console.warn('[EmployeeAPI] 401 Unauthorized encountered. Clearing invalid token and redirecting to login...');
        localStorage.removeItem('ekosmart_emp_token');
        localStorage.removeItem('ekosmart_emp_user');
        const prefix = window.location.pathname.startsWith('/employee') ? '/employee' : '';
        window.location.href = `${prefix}/login?expired=true`;
      }
    }

    return Promise.reject(error);
  }
);

export const empAuthApi = {
  login: (employeeId: string, password: string) =>
    apiClient.post('/auth/employee/login', { employeeId, password }),
  getDashboard: (employeeId: string, params?: any) =>
    apiClient.get(`/dashboard/employee/${employeeId}`, { params }),
};

export const employeeApi = {
  getMe: () => apiClient.get('/auth/me'),
  getMyPayslips: (params?: any) => apiClient.get('/employees/me/payslips', { params }),
  getMyPayslipById: (id: string) => apiClient.get(`/employees/me/payslips/${id}`),
};

export const complaintApi = {
  getAll: (params?: any) => apiClient.get('/complaints', { params }),
  getById: (id: string) => apiClient.get(`/complaints/${id}`),
  updateStatus: (id: string, status: string, priority?: string, remarks?: any) =>
    apiClient.patch(`/complaints/admin/${id}/status`, { status, priority, ...remarks }),
  export: (params?: any) => apiClient.get('/complaints/export', { params, responseType: 'blob' }),
};

export const leaveApi = {
  calculate: (data: { startDate: string; endDate: string; isHalfDay?: boolean; weeklyOffDay?: number }) =>
    apiClient.post('/leaves/calculate', data),
  apply: (data: any) => apiClient.post('/leaves/apply', data),
  getMyLeaves: (employeeId?: string) => apiClient.get('/leaves/my', { params: { employeeId } }),
  getAll: (params?: any) => apiClient.get('/leaves', { params }),
  updateStatus: (id: string, status: string, remarks?: string, approvedBy?: string) =>
    apiClient.patch(`/leaves/${id}/status`, { status, remarks, approvedBy }),
};

export const contentApi = {
  getPublic: () => apiClient.get('/content/public'),
};

export const stockApi = {
  getConfig: () => apiClient.get('/stock/config'),
  getAll: (params?: any) => apiClient.get('/stock', { params }),
  getById: (id: string) => apiClient.get(`/stock/${id}`),
  getBySerial: (serial: string) => apiClient.get(`/stock/serial/${encodeURIComponent(serial)}`),
  create: (data: any) => apiClient.post('/stock', data),
  update: (id: string, data: any) => apiClient.put(`/stock/${id}`, data),
  recordMovement: (data: any) => apiClient.post('/stock/movement', data),
  getMovements: (params?: any) => apiClient.get('/stock/movements/audit', { params }),
  export: (params?: any) => apiClient.get('/stock/export/csv', { params, responseType: 'blob' }),
};

export const billingApi = {
  getAll: (params?: any) => apiClient.get('/billing', { params }),
  getById: (id: string) => apiClient.get(`/billing/${id}`),
  create: (data: any) => apiClient.post('/billing', data),
  sendEmail: (id: string, data?: any) => apiClient.post(`/billing/${id}/email`, data),
  export: (params?: any) => apiClient.get('/billing/export/csv', { params, responseType: 'blob' }),
};

export const warrantyApi = {
  getAll: (params?: any) => apiClient.get('/warranty', { params }),
  getById: (id: string) => apiClient.get(`/warranty/${id}`),
};

export const customerApi = {
  getAll: (params?: any) => apiClient.get('/customers', { params }),
  create: (data: any) => apiClient.post('/customers', data),
  export: (params?: any) => apiClient.get('/customers/export/csv', { params, responseType: 'blob' }),
};

export const billTemplateApi = {
  getActive: (type?: string) => apiClient.get('/billing/template', { params: { type } }),
};
