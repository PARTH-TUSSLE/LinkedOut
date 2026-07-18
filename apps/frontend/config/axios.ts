import axios from "axios";
import { API_BASE_URL, STORAGE_KEYS } from "./constants";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = token;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 ||
      error.response?.data?.msg === "Unauthorized!"
    ) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = "/signin";
      }
    }
    return Promise.reject(error);
  }
);

export const getFileUrl = (filename: string | null | undefined) => {
  if (!filename || filename === "default.jpeg") return null;
  return `${API_BASE_URL.replace("/api/v1", "")}/${filename}`;
};
