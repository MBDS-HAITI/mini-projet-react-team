// src/api/routes/enrollment.api.js
import { apiClient } from "../client";

/**
 * Base: /api/v1/enrollments
 * Endpoints:
 *  - POST   /enrollments
 *  - GET    /enrollments
 *  - GET    /enrollments/:id
 *  - PUT    /enrollments/:id
 *  - DELETE /enrollments/:id
 *  - GET    /enrollments/semester/:semesterId
 *  - GET    /enrollments/academicyear/:academicYearId
 *  - GET    /enrollments/student/:studentId
 */

/**
 * POST /api/v1/enrollments
 * Body: { student, course, semester, status? }
 * Protected: scolariteAuthorize
 * Response: Enrollment
 */
export async function createEnrollment(payload) {
  const res = await apiClient.post("/enrollments", payload);
  return res.data;
}

/**
 * GET /api/v1/enrollments
 * Protected: scolariteAuthorize
 * Response: Enrollment[]
 */
export async function getEnrollments() {
  const res = await apiClient.get("/enrollments");
  return res.data;
}

/**
 * GET /api/v1/enrollments/:id
 * Protected: scolariteAuthorize
 * Response: Enrollment
 */
export async function getEnrollmentById(id) {
  if (!id) throw new Error("getEnrollmentById: id requis");
  const res = await apiClient.get(`/enrollments/${id}`);
  return res.data;
}

/**
 * PUT /api/v1/enrollments/:id
 * Body: { student?, course?, semester?, status? }
 * Protected: scolariteAuthorize
 * Response: Enrollment
 */
export async function updateEnrollment(id, payload) {
  if (!id) throw new Error("updateEnrollment: id requis");
  const res = await apiClient.put(`/enrollments/${id}`, payload);
  return res.data;
}

/**
 * DELETE /api/v1/enrollments/:id
 * Protected: scolariteAuthorize
 * Response: (selon backend: 200 json ou 204)
 */
export async function deleteEnrollment(id) {
  if (!id) throw new Error("deleteEnrollment: id requis");
  const res = await apiClient.delete(`/enrollments/${id}`);
  return res.data;
}

/**
 * GET /api/v1/enrollments/semester/:semesterId
 * Protected: scolariteAuthorize
 * Response: Enrollment[]
 */
export async function getEnrollmentsBySemesterId(semesterId) {
  if (!semesterId) throw new Error("getEnrollmentsBySemesterId: semesterId requis");
  const res = await apiClient.get(`/enrollments/semester/${semesterId}`);
  return res.data;
}

/**
 * GET /api/v1/enrollments/academicyear/:academicYearId
 * Protected: scolariteAuthorize
 * Response: Enrollment[]
 */
export async function getEnrollmentsByAcademicYearId(academicYearId) {
  if (!academicYearId) throw new Error("getEnrollmentsByAcademicYearId: academicYearId requis");
  const res = await apiClient.get(`/enrollments/academicyear/${academicYearId}`);
  return res.data;
}

/**
 * GET /api/v1/enrollments/student/:studentId
 * Protected: (dans ton code: pas de scolariteAuthorize sur la route)
 * Response: Enrollment[]
 */
export async function getEnrollmentsByStudentId(studentId) {
  if (!studentId) throw new Error("getEnrollmentsByStudentId: studentId requis");
  const res = await apiClient.get(`/enrollments/student/${studentId}`);
  return res.data;
}
