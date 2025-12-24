// src/api/endpoints/routes/academic-year.api.js
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