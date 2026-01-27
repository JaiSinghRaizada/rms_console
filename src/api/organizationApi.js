import http from "./http";

// REST-style base path (matches your Postman)
const ORG_BASE = "/organization-service/organization";

export const organizationApi = {
  // GET organizations for logged-in user
  getOrganizations: async () => {
    const { data } = await http.get(ORG_BASE);
    return data;
  },

  // GET organization by ID (when you already have ID)
  getOrganizationById: async (id) => {
    const { data } = await http.get(`${ORG_BASE}/${id}`);
    return data;
  },

  // ADD organization (onboarding)
  addOrganization: async (payload) => {
    const { data } = await http.post(ORG_BASE, payload);
    return data;
  },
};
