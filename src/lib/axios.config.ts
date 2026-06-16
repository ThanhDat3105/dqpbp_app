import axios from "axios";

import { getTokenSync, removeToken } from "@/lib/token-storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";

const createAxiosInstance = (tokenKey: string) => {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 20000,
    headers: { "Content-Type": "application/json" },
  });

  instance.interceptors.request.use(
    (config) => {
      const token = getTokenSync(tokenKey);

      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const customError = {
        message: "Something went wrong",
        status: error.response?.status || "NETWORK_ERROR",
        data: error.response?.data || null,
        originalError: error,
      };

      if (error.response) {
        switch (error.response.status) {
          case 401:
            customError.message =
              "Unauthorized - token hết hạn hoặc không hợp lệ";
            removeToken(tokenKey);
            break;
          case 404:
            customError.message = "Resource not found";
            break;
          case 500:
            customError.message = "Server error";
            break;
          default:
            customError.message =
              error.response.data?.message || "Request failed";
        }
      } else if (error.request) {
        customError.message = "No response from server";
      }

      return Promise.reject(customError);
    },
  );

  return instance;
};

export const axiosInstance = createAxiosInstance("authToken");
export const axiosInstanceAdmin = createAxiosInstance("adminAuthToken");
