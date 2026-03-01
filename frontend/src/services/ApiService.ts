import axios from 'axios';

import authService from './AuthService';

const getBaseUrl = () => {
  if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  return '/api';
};

const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});

/**
 * Resuelve una URL de recurso estático (p. ej. /uploads/xyz) a una URL accesible.
 * - Si la ruta ya es absoluta (http/https), se devuelve tal cual.
 * - Si REACT_APP_API_URL es absoluta (http://host:port/api), se quita el sufijo /api
 *   y se antepone el host a la ruta relativa, resultando en http://host:port/uploads/xyz.
 * - Si la base es relativa (/api), se devuelve la ruta como está (CRA proxy la reenviará en dev).
 */
export const resolveMediaUrl = (path?: string): string => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const base = getBaseUrl();
  if (/^https?:\/\//i.test(base)) {
    const root = base.replace(/\/api\/?$/i, '');
    return `${root}${path}`;
  }
  return path;
};

axiosInstance.interceptors.request.use((config) => {
  return config;
});

/* Auto refreshes the token if expired */
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    const isLoginRequest = originalRequest.url?.includes('/auth/login');
    const isLogoutRequest = originalRequest.url?.includes('/auth/logout');
    const isRefreshRequest = originalRequest.url?.includes('/auth/refresh');

    if (
      error.response.status === 403 &&
      error.response.data?.message === 'Account is disabled' &&
      !isLogoutRequest &&
      !isLoginRequest &&
      !isRefreshRequest
    ) {
      try {
        await authService.logout();
      } catch (logoutError) {
        apiService.defaults.headers.Authorization = null;
      }
      window.location.href = '/login?error=account_disabled';
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry && !isLoginRequest) {
      originalRequest._retry = true;

      try {
        const { token } = await authService.refresh();
        error.response.config.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(error.response.config);
      } catch (error) {
        //window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

const apiService = axiosInstance;
export default apiService;
