import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: string }>) => {
    const status = error.response?.status;
    const message = error.response?.data?.detail ?? error.message;

    if (status === 404) {
      console.warn(`[API] Not found: ${error.config?.url}`);
    } else if (status === 409) {
      console.warn(`[API] Conflict: ${message}`);
    } else if (status && status >= 500) {
      console.error(`[API] Server error ${status}: ${message}`);
    } else if (error.code === "ECONNABORTED") {
      console.error("[API] Request timeout");
    } else if (!error.response) {
      console.error("[API] Network error — backend may be down");
    }

    return Promise.reject(error);
  },
);

export default api;
