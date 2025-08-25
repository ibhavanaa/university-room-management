import axios from "axios";
import useAuth from "./useAuth";

const useAxios = () => {
  const { user, logout } = useAuth();

  const instance = axios.create({
    baseURL: "http://localhost:5000/api", // backend base URL
  });

  // Attach token
  instance.interceptors.request.use(
    (config) => {
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Handle 401 (unauthorized) globally
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default useAxios;
