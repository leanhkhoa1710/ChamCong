import axios from "axios";
import { API_BASE_URL } from "./apiConfig";
import { getAuth } from "../auth/auth";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Đính kèm token khi đã đăng nhập
axiosClient.interceptors.request.use((config) => {
  const token = getAuth()?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
