import axios from "axios";

// Always attach /api to the backend URL
const base =
  process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL + "/api"
    : "http://localhost:5000/api";

console.log("📡 Axios Base URL:", base);

const API = axios.create({
  baseURL: base,
  withCredentials: true,
});

export default API;
