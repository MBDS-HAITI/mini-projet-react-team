// src/api/routes/academicYear.api.js
import { apiClient } from "../client";

/**
 * Base: /api/v1/academicyears
 * CRUD AcademicYear
 */

/**
 * POST /api/v1/academicyears
 * Body: { name, startDate, endDate?, isActive? }
 * Response: AcademicYear
 */
export async function createAcademicYear(payload) {
  const res = await apiClient.post("/academicyears", payload);
  return res.data;
}

/**
 * GET /api/v1/academicyears
 * Response: AcademicYear[]
 */
export async function getAcademicYears() {
  const res = await apiClient.get("/academicyears");
  return res.data;
}

/**
 * GET /api/v1/academicyears/:id
 * Response: AcademicYear
 */
export async function getAcademicYearById(id) {
  if (!id) throw new Error("getAcademicYearById: id requis");
  const res = await apiClient.get(`/academicyears/${id}`);
  return res.data;
}

/**
 * PUT /api/v1/academicyears/:id
 * Body: { name?, startDate?, endDate?, isActive? }
 * Response: AcademicYear
 */
export async function updateAcademicYear(id, payload) {
  if (!id) throw new Error("updateAcademicYear: id requis");
  const res = await apiClient.put(`/academicyears/${id}`, payload);
  return res.data;
}

/**
 * DELETE /api/v1/academicyears/:id
 * Response: (selon ton backend: 200 json ou 204)
 */
export async function deleteAcademicYear(id) {
  if (!id) throw new Error("deleteAcademicYear: id requis");
  const res = await apiClient.delete(`/academicyears/${id}`);
  return res.data;
}
