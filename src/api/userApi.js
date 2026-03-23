import http from "./http";

export const userApi = {
  getByUserSub: async (userSub) => {
    const res = await http.get(`/user/getbyUserName/${userSub}`);
    return res.data.data;
  },

  getAll: async () => {
    const res = await http.get(`/user`);
    return res.data.data ?? [];
  },

  // ✅ FINAL FILTER
  getByOrganizationId: async (organizationId) => {
    const users = await userApi.getAll();

    if (!organizationId) return users;

    const siteRes = await http.get(`/site/getSite`, {
      params: { organizationId },
    });

    const sites = siteRes.data.data ?? [];
    const siteIds = sites.map((s) => s.siteId);

    return users.filter((u) => {
      const belongs = siteIds.includes(u.siteId);

      const isSuper = u.role
        ?.toUpperCase()
        .includes("SUPER");

      return belongs && !isSuper;
    });
  },

  delete: async (userId) => {
    await http.delete(`/user/${userId}`);
  },
};