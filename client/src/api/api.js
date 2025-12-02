import axios from "axios";

const port = process.env.REACT_APP_API_PORT || 5001;

const API = axios.create({
  baseURL: `http://localhost:${port}/api`,
  timeout: 1000, // 1 second timeout when backend is down
});

// Auth
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Automatically sign out when server is down or token expires
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error = backend unreachable
    if (!error.response) {
      if (window.location.pathname !== "/login") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      return; // stop propagating error
    }

    // Token invalid/expired
    if (error.response.data?.message === "Invalid or expired token") {
      if (window.location.pathname !== "/login") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      return;
    }

    // Let other errors pass through
    return Promise.reject(error);
  }
);

export default API;
