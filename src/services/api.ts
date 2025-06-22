import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api", // Updated from 5000 to 5001
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
