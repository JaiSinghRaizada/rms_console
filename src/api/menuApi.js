import menuHttp from "./menuHttp";

const MENU_API = "/menu-service/menu";

export const menuApi = {
  // GET ALL MENUS
  getAll: async () => {
    const res = await menuHttp.get(MENU_API);
    return res.data?.data ?? [];
  },

  // ADD MENU
  add: async (payload) => {
    const res = await menuHttp.post(MENU_API, payload);
    return res.data?.data;
  },

  // DELETE MENU
  delete: async (menuId) => {
    if (!menuId) throw new Error("menuId required");
    await menuHttp.delete(`${MENU_API}/${menuId}`);
  },
};
