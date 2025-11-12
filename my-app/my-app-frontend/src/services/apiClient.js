import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001";

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

apiClient.interceptors.request.use((config) => {
  const stored = localStorage.getItem("digitalLibraryAuth");
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default apiClient;
