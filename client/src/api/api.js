import axios from "axios";

const port = process.env.REACT_APP_API_PORT || 5001;

const API = axios.create({
  baseURL: `http://localhost:${port}/api`,
  timeout: 5000, // 5 second timeout when backend is down
});

// Auth
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle token expiration globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message === "Invalid or expired token") {
      if (window.location.pathname !== "/login") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      return;
    }
    // Other errors pass through
    return Promise.reject(error);
  }
);

export default API;

// Ping
export const pingServer = async () => {
  try {
    const res = await axios.get(`http://localhost:${port}/api/ping`, {
      timeout: 3000,
    });
    console.log("Ping OK:", res.data.message);
  } catch (err) {
    // Force logout if server is unreachable
    if (window.location.pathname !== "/login") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  }
};
