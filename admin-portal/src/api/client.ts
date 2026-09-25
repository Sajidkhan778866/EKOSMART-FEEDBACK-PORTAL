import axios from 'axios';

const getDynamicHost = () => {
  if (import.meta.env.VITE_API_HOST) return import.meta.env.VITE_API_HOST;
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/api\/v1\/?$/, '');
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
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ekosmart_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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


