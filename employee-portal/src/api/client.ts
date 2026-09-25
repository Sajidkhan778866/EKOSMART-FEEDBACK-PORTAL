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
  const token = localStorage.getItem('ekosmart_emp_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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


