import http from "./http";

const MENU_API = "/menu";
const ADDMENU_API = "/menu-service";
export const menuApi = {
  // ✅ ADD MENU (FIXED)
  add: async (payload) => {
    const { data } = await http.post(ADDMENU_API, payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return data;
  },

  // GET ALL
  getAll: async () => {
    const { data } = await http.get(MENU_API);
    return data?.data ?? data;
  },

  delete: async (menuId) => {
    await http.delete(`${MENU_API}/${menuId}`);
  },
};
