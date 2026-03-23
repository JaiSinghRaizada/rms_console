import http from "./http";

export const organizationApi = {
  getOrganizations: async () => {
    const { data } = await http.get("/organization");
    return data?.data ?? [];
  },

  getOrganizationById: async (id) => {
    const { data } = await http.get(`/organization/${id}`);
    return data?.data ?? null;
  },

  addOrganization: async (payload) => {
    const { data } = await http.post("/organization", payload);
    return data?.data ?? null;
  },

  getAllSites: async () => {
    const { data } = await http.get("/site");
    return data?.data ?? [];
  },

  // 🔥 👉 REPLACE THIS FUNCTION ONLY
 getSiteById: async (siteId) => {
  const { data } = await http.get(
    `/site/getSite?siteId=${siteId}` // ✅ FINAL CORRECT
  );
  return data?.data ?? null;
}
};