// src/lib/api.ts
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
console.log("👉 API_BASE_URL:", API_BASE_URL); // bunu api.ts içinde test edebilirsin


if (!API_BASE_URL) {
  console.warn("Environment variable 'NEXT_PUBLIC_API_URL' is not defined. Check your .env.local file!");
}

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

// Global response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      console.warn("🚪 Unauthorized request – not authorized (silent).");
    }

    return Promise.reject(error);
  }
);


export default API;
