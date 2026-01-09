// src/api/client.js
import axios from "axios"

import { API_BASE_URL } from "../config/env";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Gestion du rafraîchissement atomique
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // On ne refresh que si erreur 401 et que ce n'est pas une tentative de login
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("/auths/signin")) {

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // On utilise l'instance axios globale pour éviter les intercepteurs sur le refresh
        const res = await axios.post(`${API_BASE_URL}/auths/refresh`, {}, { withCredentials: true });
        const newToken = res.data?.token;

        apiClient.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // On prévient l'application que la session est définitivement morte
        window.dispatchEvent(new Event("auth-session-expired"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);