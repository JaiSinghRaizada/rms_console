import http from "./http";

export const menuCategoryApi = {
  // =========================================
  // GET categories by menuId
  // =========================================
  getByMenuId: async (menuId) => {
    if (!menuId) throw new Error("menuId is required");

    const { data } = await http.get(
      `/menu-categories/getByMenuCategory`,
      {
        params: { menuId },
      }
    );

    return data?.data || [];
  },

  // =========================================
  // GET single category by categoryId
  // =========================================
  getByCategoryId: async (categoryId) => {
    if (!categoryId) throw new Error("categoryId is required");

    const { data } = await http.get(
      `/menu-categories/getByMenuCategory`,
      {
        params: { categoryId },
      }
    );

    return data?.data || null;
  },

  // =========================================
  // ADD category
  // =========================================
  add: async (payload) => {
    const { data } = await http.post(
      `/menu-categories`,
      payload
    );
    return data;
  },

  // =========================================
  // DELETE category
  // =========================================
  delete: async (categoryId) => {
  if (!categoryId) throw new Error("categoryId is required");

  await http.delete(`/menu-categories/${categoryId}`);
},
};
