import http from "./http";

const SITE_API = import.meta.env.VITE_SITE_API;

export const siteApi = {
  addSite: async (payload) => {
    const { data } = await http.post(
      SITE_API,
      payload
    );
    return data;
  },

  getSites: async (organizationId) => {
    const { data } = await http.get(
      SITE_API,
      { params: { organizationId } }
    );
    return data;
  },

  updateSiteStatus: async (id, isActive) => {
    await http.put(
      `${SITE_API}/${id}`,
      { isActive }
    );
  },

  deleteSite: async (id) => {
    await http.delete(`${SITE_API}/${id}`);
  
  },
};
