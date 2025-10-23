import axios from "axios";

let logoutHandler = null; // será asignado desde el contexto

export const setLogoutHandler = (handler) => {
  logoutHandler = handler;
};

const axiosInstance = axios.create({
  baseURL: "/api",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && logoutHandler) {
      logoutHandler(); // 🔹 ejecuta logout React sin recargar
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
