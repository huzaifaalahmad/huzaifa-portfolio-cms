import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access-token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const csrf = localStorage.getItem('csrf-token');

  if (csrf && config.method !== 'get') {
    config.headers['X-CSRF-Token'] = csrf;
  }

  return config;
});

apiClient.interceptors.response.use(
  (res) => {
    const csrf = res.headers['x-csrf-token'];

    if (csrf) {
      localStorage.setItem('csrf-token', csrf);
    }

    return res;
  },
  async (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('access-token');
      localStorage.removeItem('refresh-token');
    }

    return Promise.reject(err);
  }
);