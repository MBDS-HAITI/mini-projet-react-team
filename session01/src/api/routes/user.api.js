// src/api/routes/user.api.js
import { apiClient } from "../client";

/**
 * Base: /api/v1/users
 * Endpoints:
 *  - POST   /users
 *  - GET    /users
 *  - GET    /users/filtered?page=&pageSize=&sortBy=&asc=&search=
 *  - GET    /users/:id
 *  - GET    /users/student/:studentId
 *  - PUT    /users/:id
 *  - DELETE /users/:id
 *  - PATCH  /users/:id/reset-password
 */

/**
 * POST /api/v1/users
 * Body: { email, username?, password?, role, student? }
 * Response (selon ton controller): { success: true, user }
 */
export async function createUser(payload) {
  const res = await apiClient.post("/users", payload);
  return res.data;
}

/**
 * GET /api/v1/users
 * Response: User[]
 */
export async function getAllUsers() {
  const res = await apiClient.get("/users");
  return res.data;
}

/**
 * GET /api/v1/users/filtered
 * Query: page, pageSize, sortBy, asc, search
 * Response: { isSuccess, data, pagination, message }
 */
export async function getUsersFiltered(params = {}) {
  const {
    page = 1,
    pageSize = 10,
    sortBy = "username",
    asc = true,
    search = "",
  } = params;

  const res = await apiClient.get("/users/filtered", {
    params: { page, pageSize, sortBy, asc, search },
  });

  return res.data;
}

/**
 * GET /api/v1/users/:id
 * Response: User (password exclu côté backend)
 */
export async function getUserById(id) {
  if (!id) throw new Error("getUserById: id requis");
  const res = await apiClient.get(`/users/${id}`);
  return res.data;
}

/**
 * GET /api/v1/users/student/:studentId
 * Response: User
 */
export async function getUserByStudentId(studentId) {
  if (!studentId) throw new Error("getUserByStudentId: studentId requis");
  const res = await apiClient.get(`/users/student/${studentId}`);
  return res.data;
}

/**
 * PUT /api/v1/users/:id
 * Body: UserUpdate (username ignoré côté serveur)
 * Response: User
 */
export async function updateUser(id, payload) {
  if (!id) throw new Error("updateUser: id requis");
  const res = await apiClient.put(`/users/${id}`, payload);
  return res.data;
}

/**
 * PATCH /api/v1/users/:id/reset-password
 * Body: { newPassword: string }
 * Response: { success: boolean, message: string }
 */
export async function resetUserPassword(id, newPassword) {
  if (!id) throw new Error("resetUserPassword: id requis");
  if (!newPassword) throw new Error("resetUserPassword: new Password requis");

  const res = await apiClient.patch(`/users/${id}/reset-password`, { newPassword });
  return res.data;
}

/**
 * DELETE /api/v1/users/:id
 * Response: (selon backend: 200 json ou 204)
 */
export async function deleteUser(id) {
  if (!id) throw new Error("deleteUser: id requis");
  const res = await apiClient.delete(`/users/${id}`);
  return res.data;
}
