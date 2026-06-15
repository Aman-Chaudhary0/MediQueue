import axios from "axios";
import {
  clearStoredSession,
  getStoredAccessToken,
  getStoredRefreshToken,
  updateStoredAccessToken,
} from "./tokenStorage.js";

// Create axios instance
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
let refreshPromise = null;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important: send cookies with requests
  timeout: 10000,
});

export const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${API_BASE_URL}/auth/refresh-token`,
        {},
        { 
          withCredentials: true, 
          timeout: 10000,
          headers: {
            "Authorization": `Bearer ${getStoredRefreshToken()}`
          }
        }
      )
      .then((response) => {
        const newAccessToken = response.data?.accessToken || "";
        updateStoredAccessToken(newAccessToken);
        return newAccessToken;
      })
      .catch((error) => {
        console.error("Refresh token error:", error.response?.data || error.message);
        clearStoredSession();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

api.interceptors.request.use((config) => {
  const accessToken = getStoredAccessToken();

  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
