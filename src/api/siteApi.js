// src/api/siteApi.js

import http from "./http";

const SITE_API = "/site";

export const siteApi = {
  // ============================
  // ✅ ADD SITE
  // ============================
  addSite: async (payload) => {
    const { data } = await http.post(SITE_API, payload);
    return data?.data ?? null;
  },

  // ============================
  // ✅ GET SITES BY ORGANIZATION
  // ============================
  getSites: async (organizationId) => {
    if (!organizationId) return [];

    const { data } = await http.get(`${SITE_API}/getSite`, {
      params: { organizationId },
    });

    return data?.data ?? [];
  },

  // ============================
  // ✅ GET ALL SITES
  // ============================
  getAll: async () => {
    const { data } = await http.get(SITE_API);
    return data?.data ?? [];
  },

  // ============================
  // ✅ GET SITE BY ID (🔥 FIXED)
  // ============================
getById: async (siteId) => {
  const sites = await siteApi.getAll();
  return sites.find((s) => s.siteId === siteId) || null;
},

  // ============================
  // ✅ UPDATE SITE
  // ============================
  updateSite: async (siteId, payload) => {
    const { data } = await http.put(
      `${SITE_API}/${siteId}`,
      payload
    );
    return data?.data ?? null;
  },

  // ============================
  // ✅ DELETE SITE
  // ============================
  deleteSite: async (siteId) => {
    const { data } = await http.delete(
      `${SITE_API}/${siteId}`
    );
    return data?.data ?? null;
  },
};