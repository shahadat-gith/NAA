import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("staff-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error(
        "Interceptor failed to read token from local storage:",
        error,
      );
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;