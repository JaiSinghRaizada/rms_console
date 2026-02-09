import http from "./http";

export const menuCategoryApi = {
  getAll: async () => {
    const { data } = await http.get("/menu-categories");
    return data.data;
  },

  add: async (payload) => {
    const { data } = await http.post("/menu-categories", payload);
    return data;
  },

  delete: async (id) => {
    await http.delete(`/menu-categories/${id}`);
  },
};
