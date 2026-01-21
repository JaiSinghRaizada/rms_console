// src/api/apiClient.js
import axios from "axios";
import { errorHandler } from "./errorHandler";

// Create base API instance
const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8088/api",
  timeout: 10000,
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    // Paths that should NOT include token
    const noAuthPaths = ["/auth/login", "/auth/admin", "/auth/refresh-token"];
    
    if (token && !noAuthPaths.some((path) => config.url.includes(path))) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle token expiration and refresh logic
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    
    return Promise.reject(error);
  }
);

/**
 * Generic API request handler
 * @param {string} method - HTTP method (get, post, put, delete)
 * @param {string} url - API endpoint
 * @param {object} data - Request data (for POST/PUT)
 * @param {object} config - Additional axios config
 * @returns {Promise} API response data
 */
export const makeRequest = async (
  method,
  url,
  data = null,
  config = {}
) => {
  try {
    let response;

    switch (method.toLowerCase()) {
      case "get":
        response = await apiClient.get(url, config);
        break;
      case "post":
        response = await apiClient.post(url, data, config);
        break;
      case "put":
        response = await apiClient.put(url, data, config);
        break;
      case "patch":
        response = await apiClient.patch(url, data, config);
        break;
      case "delete":
        response = await apiClient.delete(url, config);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return response.data;
  } catch (error) {
    throw errorHandler(error);
  }
};

export default apiClient;
