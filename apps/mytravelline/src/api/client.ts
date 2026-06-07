import axios from 'axios';
import i18n from '@/i18n';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const lang = i18n.language ?? 'en';
  config.headers['Accept-Language'] = lang;
  return config;
});

export default apiClient;
