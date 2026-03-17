// src/api/siteApi.js

import http from "./http";

const SITE_API = "/site";

export const siteApi = {
  // ==================================================
  // ✅ ADD SITE
  // POST /api/site
  // ==================================================
  addSite: async (payload) => {
    if (!payload) {
      throw new Error("Site payload is required");
    }

    const { data } = await http.post(SITE_API, payload);
    return data?.data ?? [];
  },
  
  // ==================================================
  // ✅ GET SITES BY ORGANIZATION
  // GET /api/site/getSite?organizationId=xxx
  // ==================================================
  getSites: async (organizationId) => {
    if (!organizationId) {
      return []; // prevent crash
    }

    const { data } = await http.get(`${SITE_API}/getSite`, {
      params: { organizationId },
    });

    return data?.data ?? [];
  },

  // ==================================================
  // ✅ GET ALL SITES (no filtering)
  // GET /api/site
  // ==================================================
  getAll: async () => {
    const { data } = await http.get(SITE_API);
    return data?.data ?? [];
  },

  // ==================================================
  // ✅ GET SITE BY ID
  // GET /api/site/getSite?siteId=xxx
  // ==================================================
// add this if not present
getById: async (siteId) => {
  const { data } = await http.get(`/site/getSite?siteId=${siteId}`);
  return data?.data?.[0] ?? null;
},

  // ==================================================
  // ✅ UPDATE SITE
  // PUT /api/site/{siteId}
  // ==================================================
  updateSite: async (siteId, payload) => {
    if (!siteId) {
      throw new Error("siteId is required");
    }

    const { data } = await http.put(
      `${SITE_API}/${siteId}`,
      payload
    );

    return data?.data ?? null;
  },

  // ==================================================
  // ✅ UPDATE STATUS
  // PUT /api/site/{siteId}
  // ==================================================
  updateSiteStatus: async (siteId, isActive) => {
    if (!siteId) {
      throw new Error("siteId is required");
    }

    const { data } = await http.put(
      `${SITE_API}/${siteId}`,
      { isActive }
    );

    return data?.data ?? null;
  },

  // ==================================================
  // ✅ DELETE SITE
  // DELETE /api/site/{siteId}
  // ==================================================
  deleteSite: async (siteId) => {
    if (!siteId) {
      throw new Error("siteId is required");
    }

    const { data } = await http.delete(
      `${SITE_API}/${siteId}`
    );

    return data?.data ?? null;
  },
};