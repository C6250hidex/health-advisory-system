import axios from "axios";

const api = axios.create({
  // If we are on a deployed site, use the real backend URL, otherwise use localhost
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// CRITICAL: This part adds the token to the header of EVERY request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
