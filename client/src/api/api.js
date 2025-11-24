import axios from "axios";

const port = process.env.REACT_APP_API_PORT || 3001;

const API = axios.create({
  baseURL: `http://localhost:${port}/api`,
});

console.log("API base URL:", `http://localhost:${port}/api`);

export default API;
