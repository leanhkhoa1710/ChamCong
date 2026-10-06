export const API_BASE_URL =
  import.meta.env.MODE === "demo"
    ? "/api"
    : import.meta.env.VITE_API_BASE_URL || "https://localhost:7038/api";
