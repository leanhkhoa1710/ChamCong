import axios from "axios";
import { getAuth, clearAuth } from "../auth/auth";
import { API_BASE_URL } from "./apiConfig";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Đính kèm token khi đã đăng nhập (lưu trong marixa_auth)
axiosClient.interceptors.request.use((config) => {
    const token = getAuth()?.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401 && !["/login", "/kich-hoat"].includes(window.location.pathname)) {
        clearAuth();
        window.location.replace("/login");
    }
    return Promise.reject(error);
});

export default axiosClient;
