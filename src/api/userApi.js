import http from "./http";

export const userApi = {
  // userSub == username in backend
  getByUserSub: async (userSub) => {
    if (!userSub) {
      throw new Error("userSub is missing");
    }

    const response = await http.get(
      `/api/user/getbyUserName/${userSub}`
    );

    // ✅ unwrap once here
    return response.data.data;
  },
};
