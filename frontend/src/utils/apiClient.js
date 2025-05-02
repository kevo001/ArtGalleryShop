// src/utils/apiClient.js
import axios from 'axios';

// Build baseURL = ORIGIN + "/api", falling back to "/api" in dev
// VITE_API_URL should be just the origin (e.g. "https://galleri-edwin.onrender.com")
// If it’s unset (dev), we use "/api" so Vite’s proxy kicks in.
const origin  = import.meta.env.VITE_API_URL || '';
const baseURL = `${origin}/api`;

const apiClient = axios.create({ baseURL });

// 1️⃣ Attach Authorization header on every request
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2️⃣ Automatically try to refresh on 401 responses
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalReq = error.config;
    if (error.response?.status === 401 && !originalReq._retry) {
      originalReq._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          // baseURL already ends in "/api"
          const refreshUrl = `${origin}/api/auth/refresh`;
          const { data } = await axios.post(refreshUrl, { refreshToken });

          // store new tokens
          localStorage.setItem('accessToken',  data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);

          // retry original request with new token
          originalReq.headers.Authorization = `Bearer ${data.accessToken}`;
          return apiClient(originalReq);
        } catch (refreshErr) {
          console.error('Token refresh failed:', refreshErr);
          // optionally clear tokens or redirect to login here
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
