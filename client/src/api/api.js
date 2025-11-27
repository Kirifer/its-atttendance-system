import axios from "axios";

const port = process.env.REACT_APP_API_PORT || 5001;

const API = axios.create({
  baseURL: `http://localhost:${port}/api`,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
