// src/api/usersApi.js

import http from "./http";

export const userApi = {
  getAll: async () => {
    const res = await http.get("/user");
    return res.data.data;
  },

  add: async (payload) => {
    const res = await http.post("/user/add", payload);
    return res.data;
  },

  delete: async (userId) => {
    const res = await http.delete(`/user/${userId}`);
    return res.data;
  },
};
