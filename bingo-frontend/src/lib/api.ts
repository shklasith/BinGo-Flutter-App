import axios from 'axios';

import { clearSession, getSession } from './session';

interface ApiErrorResponse {
  message?: string;
}

export const api = axios.create({
  baseURL: 'https://qlony.com',
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const session = getSession();
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession();
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.assign('/login');
      }
    }

    const message = (error.response?.data as ApiErrorResponse | undefined)?.message;
    return Promise.reject(new Error(message ?? error.message ?? 'Request failed'));
  },
);
