// src/api/apiservice.js
import { makeRequest } from "./apiClient";

/**
 * AUTH SERVICE
 */
export const authApi = {
  healthCheck: () => makeRequest("post", "/auth/healthCheck"),
  admin: (data) => makeRequest("post", "/auth/admin", data),
  login: (data) => makeRequest("post", "/auth/login", data),
  refreshToken: (data) => makeRequest("post", "/auth/refresh-token", data),
  validate: () => makeRequest("get", "/auth/validate"),
  checkRoleName: (username) =>
    makeRequest("post", `/auth/checkRole/${username}`),
};

/**
 * ORGANIZATION SERVICE
 */
export const organizationApi = {
  healthCheck: () => makeRequest("post", "/organization/healthCheck"),
  getAll: () => makeRequest("get", "/organization"),
  add: (data) => makeRequest("post", "/organization", data),
  getById: (id) => makeRequest("get", `/organization/${id}`),
  update: (id, data) => makeRequest("put", `/organization/${id}`, data),
  delete: (id) => makeRequest("delete", `/organization/${id}`),
};

/**
 * USER SERVICE
 */
export const userApi = {
  healthCheck: () => makeRequest("post", "/user/healthCheck"),
  add: (orgId, data) => makeRequest("post", `/user/${orgId}`, data),
  getAll: () => makeRequest("get", "/user"),
  getById: (userId, organizationId) => {
    const params = {};
    if (userId) params.userId = userId;
    if (organizationId) params.organizationId = organizationId;
    return makeRequest("get", "/user/getUser", null, { params });
  },
  getByIdOrganization: (organizationId) => {
    const params = {};
    if (organizationId) params.organizationId = organizationId;
    return makeRequest("get", "/user/getUser", null, { params });
  },
  update: (id, data) => makeRequest("put", `/user/${id}`, data),
  delete: (id) => makeRequest("delete", `/user/${id}`),
  // Password reset endpoints
  generateOtp: (data) => makeRequest("post", "/user/generate-otp", data),
  verifyOtp: (data) => makeRequest("post", "/user/verify-otp", data),
  setPassword: (data) => makeRequest("post", "/user/set-password", data),
};

/**
 * SITE SERVICE
 */
export const siteApi = {
  healthCheck: () => makeRequest("post", "/site/healthCheck"),
  add: (data) => makeRequest("post", "/site", data),
  getAll: () => makeRequest("get", "/site"),
  getById: (id) => makeRequest("get", `/site/${id}`),
  update: (id, data) => makeRequest("put", `/site/${id}`, data),
  delete: (id) => makeRequest("delete", `/site/${id}`),
};

/**
 * MENU SERVICE
 */
export const menuApi = {
  healthCheck: () => makeRequest("post", "/menu/healthCheck"),
  add: (data) => makeRequest("post", "/menu", data),
  getAll: () => makeRequest("get", "/menu"),
  getById: (menuId) => {
    const params = {};
    if (menuId) params.menuId = menuId;
    return makeRequest("get", "/menu/getMenus", null, { params });
  },
  getBySiteId: (siteId) => {
    const params = {};
    if (siteId) params.siteId = siteId;
    return makeRequest("get", "/menu/getMenus", null, { params });
  },
  update: (id, data) => makeRequest("put", `/menu/${id}`, data),
  delete: (id) => makeRequest("delete", `/menu/${id}`),
};

/**
 * MENU CATEGORIES SERVICE
 */
export const menuCatApi = {
  healthCheck: () => makeRequest("post", "/menu/healthCheck"),
  add: (data) => makeRequest("post", "/menu-categories", data),
  getAll: () => makeRequest("get", "/menu-categories"),
  getById: (categoryId) =>
    makeRequest("get", `/menu-categories/${categoryId}`),
  update: (categoryId, data) =>
    makeRequest("put", `/menu-categories/${categoryId}`, data),
  delete: (categoryId) =>
    makeRequest("delete", `/menu-categories/${categoryId}`),
};

/**
 * MENU ITEMS SERVICE
 */
export const menuitemsApi = {
  healthCheck: () => makeRequest("post", "/menu-items/healthCheck"),
  add: (data) => makeRequest("post", "/menu-items", data),
  getAll: () => makeRequest("get", "/menu-items"),
  getById: (menuItemId) =>
    makeRequest("get", `/menu-items/${menuItemId}`),
  update: (menuItemId, data) =>
    makeRequest("put", `/menu-items/${menuItemId}`, data),
  delete: (menuItemId) =>
    makeRequest("delete", `/menu-items/${menuItemId}`),
};

/**
 * ORDER SERVICE
 */
export const orderApi = {
  healthCheck: () => makeRequest("post", "/order/healthCheck"),
  add: (data) => makeRequest("post", "/order", data),
  getAll: () => makeRequest("get", "/order"),
  getById: (id) => makeRequest("get", `/order/${id}`),
  update: (id, data) => makeRequest("put", `/order/${id}`, data),
  delete: (id) => makeRequest("delete", `/order/${id}`),
};

/**
 * SCHEDULE SERVICE
 */
export const scheduleApi = {
  healthCheck: () => makeRequest("post", "/schedule/healthCheck"),
  add: (data) => makeRequest("post", "/schedule", data),
  getAll: () => makeRequest("get", "/schedule"),
  getById: (id) => makeRequest("get", `/schedule/${id}`),
  update: (id, data) => makeRequest("put", `/schedule/${id}`, data),
  delete: (id) => makeRequest("delete", `/schedule/${id}`),
};

export default authApi;
