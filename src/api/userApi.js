import http from "./http";

export const userApi = {
  // userSub == username in backend
  getByUserSub: async (userSub) => {
    if (!userSub) {
      throw new Error("userSub is missing");
    }

    const response = await http.get(
      `/user/getbyUserName/${userSub}`
    );

    // backend response:
    // { status, message, data }
    return response.data.data;
  },
};
