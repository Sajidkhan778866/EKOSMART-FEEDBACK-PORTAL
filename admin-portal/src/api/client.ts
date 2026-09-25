import axios from 'axios';

export const API_HOST =
  import.meta.env.VITE_API_HOST ||
  (import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/api\/v1\/?$/, '')
    : 'http://localhost:5000');

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || `${API_HOST}/api/v1`;

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


