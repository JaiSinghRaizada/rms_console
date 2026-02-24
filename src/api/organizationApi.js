import http from "./http";

const ORG_BASE = "/organization";

export const organizationApi = {
  getOrganizations: async () => {
    const { data } = await http.get(ORG_BASE);
    return data?.data ?? [];
  },

  getOrganizationById: async (id) => {
    const { data } = await http.get(`${ORG_BASE}/${id}`);
    return data?.data ?? null;
  },

  addOrganization: async (payload) => {
    const { data } = await http.post(ORG_BASE, payload);
    return data?.data ?? null;
  },
};