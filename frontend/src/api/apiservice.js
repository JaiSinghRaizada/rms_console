// src/api/apiService.js
import axios from "axios";

// Base configuration
const api = axios.create({
  baseURL: "http://127.0.0.1:8088/api", // your base_url
});

// ✅ Add token automatically if present (skip for login/register/refresh)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("Token");

  // Paths that should NOT include token
  const noAuthPaths = ["/auth/login", "/auth/admin", "/auth/refresh-token"];

  if (token && !noAuthPaths.some((path) => config.url.includes(path))) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ---------------- AUTH SERVICE ----------------
export const authApi = {
  healthCheck: () => api.post("/auth/healthCheck"),
  admin: (data) => api.post("/auth/admin", data), // no token
  login: (data) => api.post("/auth/login", data),       // no token
  refreshToken: (data) => api.post("/auth/refresh-token", data), // no token
  validate: () => api.get("/auth/validate"),
  checkRoleName: (username) => api.post(`/auth/checkRole/${username}`)        // needs token
};

// ---------------- ORGANIZATION SERVICE ----------------
export const organizationApi = {
  healthCheck: () => api.post("/organization/healthCheck"),
  getAll: () => api.get("/organization"),
  add: (data) => api.post("/organization", data),
  getById: (id) => api.get(`/organization/${id}`),
  update: (id, data) => api.put(`/organization/${id}`, data),
  delete: (id) => api.delete(`/organization/${id}`),
};

// ----

// ---------------- USER SERVICE ----------------
export const userApi = {
  healthCheck: () => api.post("/user/healthCheck"),
  add: (orgId, data) => api.post(`/user/${orgId}`, data),
  getAll: () => api.get("/user"),
  getById: (userId, organizationId) => {
    const params = {};

    if (userId) params.userId = userId;
    if (organizationId) params.organizationId = organizationId;

    return api.get('/user/getUser', { params });
  },
  getByIdOrganization: (organizationId) => {
    const params = {};

    if (organizationId) params.organizationId = organizationId;

    return api.get('/user/getUser', { params });
  },

  update: (id, data) => api.put(`/user/${id}`, data),
  delete: (id) => api.delete(`/user/${id}`),
};

// ---------------- SITE SERVICE ----------------
export const siteApi = {
  healthCheck: () => api.post("/site/healthCheck"),
  add: (data) => api.post("/site", data),
  getAll: () => api.get("/site"),
  getById: (id) => api.get(`/site/${id}`),
  update: (id, data) => api.put(`/site/${id}`, data),
  delete: (id) => api.delete(`/site/${id}`),
};

export const menuApi = {
  healthCheck: () => api.post("/menu/healthCheck"),
  add: (data) => api.post("/menu", data),
  getAll: () => api.get("/menu"),
  getById: (menuId) => {
    const params = {};

    if (menuId) params.menuId = menuId;

    return api.get('/menu/getMenus', { params });
  },
  getBySiteId: (siteId) => {
    const params = {};

    if (siteId) params.siteId = siteId;

    return api.get('/menu/getMenus', { params });
  },
  // getById: (id) => api.get(`/getMenus${id}`),
  update: (id, data) => api.put(`/menu/${id}`, data),
  delete: (id) => api.delete(`/menu/${id}`),
};
export const menuCatApi = {
  healthCheck: () => api.post("/menu/healthCheck"),
  add: (data) => api.post("/menu-categories", data),
  getAll: () => api.get("/menu-categories"),
  getById: (categoryId) => api.get(`/menu-categories/${categoryId}`),
  update: (categoryId, data) => api.put(`/menu-categories/${categoryId}`, data),
  delete: (categoryId) => api.delete(`/menu-categories/${categoryId}`),
};
export const menuitemsApi = {
  healthCheck: () => api.post("/menu-items/healthCheck"),
  add: (data) => api.post("/menu-items", data),
  getAll: () => api.get("/menu-items"),
  getById: (menuItemId) => api.get(`/menu-items/${menuItemId}`),
  update: (menuItemId, data) => api.put(`/menu-items/${menuItemId}`, data),
  delete: (menuItemId) => api.delete(`/menu-items/${menuItemId}`),
};


// ---------------- ORDER SERVICE ----------------
export const orderApi = {
  healthCheck: () => api.post("/order/healthCheck"),
  add: (data) => api.post("/order", data),
  getAll: () => api.get("/order"),
  getById: (id) => api.get(`/order/${id}`),
  update: (id, data) => api.put(`/order/${id}`, data),
  delete: (id) => api.delete(`/order/${id}`),
};

// ---------------- SCHEDULE SERVICE ----------------
export const scheduleApi = {
  healthCheck: () => api.post("/schedule/healthCheck"),
  add: (data) => api.post("/schedule", data),
  getAll: () => api.get("/schedule"),
  getById: (id) => api.get(`/schedule/${id}`),
  update: (id, data) => api.put(`/schedule/${id}`, data),
  delete: (id) => api.delete(`/schedule/${id}`),
};

export default api;
