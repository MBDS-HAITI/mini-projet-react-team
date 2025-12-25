// src/api/routes/course.api.js
import { apiClient } from "../client";

/**
 * Base: /api/v1/courses
 * CRUD Course
 */

/**
 * POST /api/v1/courses
 * Body: { name, code, credits? }
 * Protected: scolariteAuthorize
 * Response: Course
 */
export async function createCourse(payload) {
  const res = await apiClient.post("/courses", payload);
  return res.data;
}

/**
 * GET /api/v1/courses
 * Public (selon ton route)
 * Response: Course[]
 */
export async function getCourses() {
  const res = await apiClient.get("/courses");
  return res.data;
}

/**
 * GET /api/v1/courses/:id
 * Response: Course
 */
export async function getCourseById(id) {
  if (!id) throw new Error("getCourseById: id requis");
  const res = await apiClient.get(`/courses/${id}`);
  return res.data;
}

/**
 * PUT /api/v1/courses/:id
 * Body: { name?, code?, credits? }
 * Protected: scolariteAuthorize
 * Response: Course
 */
export async function updateCourse(id, payload) {
  if (!id) throw new Error("updateCourse: id requis");
  const res = await apiClient.put(`/courses/${id}`, payload);
  return res.data;
}

/**
 * DELETE /api/v1/courses/:id
 * Protected: scolariteAuthorize
 * Response: (selon backend: 200 json ou 204)
 */
export async function deleteCourse(id) {
  if (!id) throw new Error("deleteCourse: id requis");
  const res = await apiClient.delete(`/courses/${id}`);
  return res.data;
}
