import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

// ─── Request Interceptor ─────────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor (Token Refresh) ────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

const shouldAttemptRefresh = (error: AxiosError) => {
  const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
  const method = originalRequest?.method?.toUpperCase();
  const url = originalRequest?.url || '';
  const hasRefreshToken = !!localStorage.getItem('refreshToken');

  if (error.response?.status !== 401 || originalRequest?._retry || !hasRefreshToken) {
    return false;
  }

  if (url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh')) {
    return false;
  }

  if (!method || ['GET', 'HEAD'].includes(method)) {
    return true;
  }

  const errorData = error.response?.data as { code?: string; message?: string } | undefined;
  return errorData?.code === 'TOKEN_EXPIRED' || errorData?.message === 'Token expired';
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (shouldAttemptRefresh(error)) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const response = await axios.post(
          `${BASE_URL}/auth/refresh`,
          { refreshToken },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
            },
          },
        );
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        apiClient.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
        originalRequest.headers.Authorization = 'Bearer ' + accessToken;

        processQueue(null, accessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
