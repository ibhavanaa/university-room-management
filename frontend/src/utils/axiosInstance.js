import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: false, // keep false since you're using JWT not cookies
});

//  Attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//  Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized - Token missing/expired");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    if (error.response?.status === 403) {
      console.error("Forbidden - Admin access required");
    }
    return Promise.reject(error);
  }
);

export default api;
