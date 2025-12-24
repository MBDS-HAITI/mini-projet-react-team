// src/api/endpoints/routes/auth.api.js
import { apiClient } from "../client";

/**
 * POST /api/v1/auths/signin
 * Body: { username, password }
 * Response: { data: { token, user } } 
 * + Set-Cookie refreshToken (HttpOnly) côté serveur
 */
export async function signIn({ username, password }) {
  const res = await apiClient.post("/auths/signin", { username, password });
  return res.data;
}

/**
 * POST /api/v1/auths/refresh
 * Pas de body. Le refresh token est envoyé automatiquement via cookie HttpOnly
 * Response: { token }
 */
export async function refreshAccessToken() {
  const res = await apiClient.post("/auths/refresh");
  
  return res.data;
}

/**
 * POST /api/v1/auths/signout
 * Supprime le cookie refresh côté serveur
 */
export async function signOut() {
  const res = await apiClient.post("/auths/signout");
  return res.data;
}

/**
 * OPTIONNEL si tu as un endpoint /me ou /profile
 * Ex: GET /api/v1/users/me
 */
export async function getMe() {
  const res = await apiClient.get("/auths/me");
  return res.data;
}

/**
 * OPTIONNEL si tu exposes un endpoint change password
 * POST /api/v1/auths/changepassword
 * Body: { oldPassword, newPassword }
 */
export async function changePassword({ oldPassword, newPassword }) {
  const res = await apiClient.post("/auths/changepassword", {
    oldPassword,
    newPassword,
  });
  return res.data;
}
