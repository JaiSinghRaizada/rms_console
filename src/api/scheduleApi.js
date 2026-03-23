import http from "./http";

export const scheduleApi = {
  getBySite: async (siteId) => {
    const { data } = await http.get(`/shift-requirement/site/${siteId}`);
    return data?.data ?? [];
  },

  create: async (payload) => {
    const { data } = await http.post("/shift-requirement", payload);
    return data;
  },

  delete: async (id) => {
    const { data } = await http.delete(`/shift-requirement/${id}`);
    return data;
  },
};