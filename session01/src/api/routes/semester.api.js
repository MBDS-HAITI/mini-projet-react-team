// src/api/routes/semester.api.js
import { apiClient } from "../client";

/**
 * Base: /api/v1/semesters
 * Endpoints:
 *  - POST   /semesters
 *  - GET    /semesters
 *  - GET    /semesters/:id
 *  - PUT    /semesters/:id
 *  - DELETE /semesters/:id
 *  - GET    /semesters/academicyear/:academicYearId
 */

/**
 * POST /api/v1/semesters
 * Body: { academicYear, name, startDate?, endDate?, isActive? }
 * Response: Semester
 */
export async function createSemester(payload) {
  const res = await apiClient.post("/semesters", payload);
  return res.data;
}

/**
 * GET /api/v1/semesters
 * Response: Semester[]
 */
export async function getSemesters() {
  const res = await apiClient.get("/semesters");
  return res.data;
}

/**
 * GET /api/v1/semesters/academicyear/:academicYearId
 * Response: Semester[]
 */
export async function getSemestersByAcademicYearId(academicYearId) {
  if (!academicYearId)
    throw new Error("getSemestersByAcademicYearId: academicYearId requis");
  const res = await apiClient.get(`/semesters/academicyear/${academicYearId}`);
  return res.data;
}

/**
 * GET /api/v1/semesters/:id
 * Response: Semester (avec academicYear populé côté backend)
 */
export async function getSemesterById(id) {
  if (!id) throw new Error("getSemesterById: id requis");
  const res = await apiClient.get(`/semesters/${id}`);
  return res.data;
}

/**
 * PUT /api/v1/semesters/:id
 * Body: { academicYear?, name?, startDate?, endDate?, isActive? }
 * Response: Semester
 */
export async function updateSemester(id, payload) {
  if (!id) throw new Error("updateSemester: id requis");
  const res = await apiClient.put(`/semesters/${id}`, payload);
  return res.data;
}

/**
 * DELETE /api/v1/semesters/:id
 * Response: (selon backend: 200 json ou 204)
 */
export async function deleteSemester(id) {
  if (!id) throw new Error("deleteSemester: id requis");
  const res = await apiClient.delete(`/semesters/${id}`);
  return res.data;
}
