import axios from 'axios';

const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1']);

const defaultPort = (protocol) => {
  if (protocol === 'https:') return '443';
  if (protocol === 'http:') return '80';
  return '';
};

const resolveBackendUrl = () => {
  const buildTimeUrl = process.env.REACT_APP_BACKEND_URL;

  if (typeof window !== 'undefined' && window.location?.origin) {
    const windowOrigin = window.location.origin;
    const windowIsLocal = LOCAL_HOSTNAMES.has(window.location.hostname);

    if (!buildTimeUrl) {
      return windowOrigin;
    }

    try {
      const parsedUrl = new URL(buildTimeUrl);
      const targetIsLocal = LOCAL_HOSTNAMES.has(parsedUrl.hostname);

      if (targetIsLocal || windowIsLocal) {
        return parsedUrl.origin;
      }

      const targetPort = parsedUrl.port || defaultPort(parsedUrl.protocol);
      const windowPort = window.location.port || defaultPort(window.location.protocol);
      const sameOrigin =
        parsedUrl.protocol === window.location.protocol &&
        parsedUrl.hostname === window.location.hostname &&
        targetPort === windowPort;

      if (sameOrigin) {
        return parsedUrl.origin;
      }

      return windowOrigin;
    } catch (error) {
      return windowOrigin;
    }
  }

  return buildTimeUrl || 'http://localhost:8001';
};

export const BACKEND_URL = resolveBackendUrl().replace(/\/$/, '');
const API_URL = `${BACKEND_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login if we're on an admin page
      if (window.location.pathname.startsWith('/admin')) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
