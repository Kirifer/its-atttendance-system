import axios from "axios";

const port = process.env.REACT_APP_API_PORT || 5001;

const API = axios.create({
  baseURL: `http://localhost:${port}/api`,
  timeout: 180000, // unit is in ms = seconds
});

// force logout const
const forceLogout = () => {
  if (window.location.pathname !== "/") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  }
};

// Auth
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// logout when token expires or server shut down
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || !error.response) {
      forceLogout();
    }

    return Promise.reject(error);
  }
);

export default API;

// ping logic updated
export const pingServer = async () => {
  await API.get("/ping");
};