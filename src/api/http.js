import axios from "axios";

const http = axios.create({
  baseURL: "http://127.0.0.1:8088/api",
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or accessToken

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default http;
