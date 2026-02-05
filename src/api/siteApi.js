import http from "./http";

const SITE_API = "/site"; // ❗ NO /api here

export const siteApi = {
  // ✅ ADD SITE
  addSite: async (payload) => {
    const { data } = await http.post(SITE_API, payload);
    return data;
  },

  // ✅ GET SITES BY ORGANIZATION
  getSites: async (organizationId) => {
    if (!organizationId) {
      throw new Error("organizationId is required");
    }

    const { data } = await http.get(SITE_API, {
      params: { organizationId },
    });

    return data?.data ?? data;
  },

  // ✅ UPDATE STATUS
  updateSiteStatus: async (siteId, isActive) => {
    if (!siteId) throw new Error("siteId is required");

    await http.put(`${SITE_API}/${siteId}`, {
      isActive,
    });
  },

  // ✅ DELETE SITE
  deleteSite: async (siteId) => {
    if (!siteId) throw new Error("siteId is required");

    await http.delete(`${SITE_API}/${siteId}`);
  },
};
