import http from "./http";

const MENU_API = "/menu";

export const menuApi = {
  // ==========================
  // ADD MENU
  // ==========================
  add: async (payload) => {
    const { data } = await http.post(
      MENU_API,
      payload
    );
    return data;
  },

  // ==========================
  // GET ALL MENUS
  // ==========================
  getAll: async () => {
    const { data } = await http.get(
      MENU_API
    );
    return data?.data ?? [];
  },

  // ==========================
  // DELETE MENU
  // ==========================
  delete: async (menuId) => {
    await http.delete(
      `${MENU_API}/${menuId}`
    );
  },

  // ==========================
  // UPDATE MENU
  // ==========================
  update: async (menuId, payload) => {
    const { data } = await http.put(
      `${MENU_API}/${menuId}`,
      payload
    );
    return data;
  },
};