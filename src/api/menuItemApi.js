import http from "./http";

const MENU_ITEM_API = "/menu-items";

export const menuItemApi = {
  getAll: async () => {
    const { data } = await http.get(MENU_ITEM_API);
    return data.data;
  },

  add: async (payload) => {
    const { data } = await http.post(MENU_ITEM_API, payload);
    return data;
  },
};
