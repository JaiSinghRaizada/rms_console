import http from "./http";

export const authApi = {
  login: async (payload) => {
    const { data } = await http.post("/auth/login", payload);
    return data;
  },
};
