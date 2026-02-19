// src/api/menuItemApi.js
import http from "./http";

const MENU_ITEM_API = "/menu-items";

export const menuItemApi = {
  // ✅ Get all items
  getAll: async () => {
    const { data } = await http.get(MENU_ITEM_API);
    return data.data;
  },

  // ✅ Get items by menuId
  getByMenuId: async (menuId) => {
    if (!menuId) throw new Error("menuId is required");

    const { data } = await http.get(MENU_ITEM_API, {
      params: { menuId },
    });

    return data.data;
  },

  // ✅ Add item
  add: async (payload) => {
    const { data } = await http.post(MENU_ITEM_API, payload);
    return data;
  },

  // ✅ DELETE item (THIS WAS MISSING)
  delete: async (menuItemId) => {
    if (!menuItemId) throw new Error("menuItemId is required");

    await http.delete(`${MENU_ITEM_API}/${menuItemId}`);
  },
};
