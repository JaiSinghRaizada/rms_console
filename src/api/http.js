import axios from "axios";

const http = axios.create({
  baseURL: "http://127.0.0.1:8088/api",
});

// 🔥 IMPORTANT: interceptor must return config
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // ✅ correct key

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default http;