// src/api/routes/student.api.js
import { apiClient } from "../client";

/**
 * Base: /api/v1/students
 * Endpoints:
 *  - POST   /students
 *  - GET    /students
 *  - GET    /students/filtered?page=&pageSize=&sortBy=&asc=&search=
 *  - GET    /students/:id
 *  - PUT    /students/:id
 *  - DELETE /students/:id
 */

/**
 * POST /api/v1/students
 * Body: { firstName, lastName, dateOfBith?, sex, phone?, address?, studentCode }
 * Response: Student
 */
export async function createStudent(payload) {
  const res = await apiClient.post("/students", payload);
  return res.data;
}

/**
 * GET /api/v1/students
 * Response: Student[]
 */
export async function getAllStudents() {
  const res = await apiClient.get("/students");
  return res.data;
}

/**
 * GET /api/v1/students/filtered
 * Query: page, pageSize, sortBy, asc, search
 * Response: { isSuccess, data, pagination, message }
 */
export async function getStudentsFiltered(params = {}) {
  const {
    page = 1,
    pageSize = 10,
    sortBy = "lastName",
    asc = true,
    search = "",
  } = params;

  const res = await apiClient.get("/students/filtered", {
    params: { page, pageSize, sortBy, asc, search },
  });

  return res.data;
}

/**
 * GET /api/v1/students/:id
 * Response: Student
 */
export async function getStudentById(id) {
  if (!id) throw new Error("getStudentById: id requis");
  const res = await apiClient.get(`/students/${id}`);
  return res.data;
}

/**
 * PUT /api/v1/students/:id
 * Body: { firstName?, lastName?, dateOfBith?, sex?, phone?, address?, studentCode? }
 * Response: Student
 */
export async function updateStudent(id, payload) {
  if (!id) throw new Error("updateStudent: id requis");
  const res = await apiClient.put(`/students/${id}`, payload);
  return res.data;
}

/**
 * DELETE /api/v1/students/:id
 * Response: 204 (souvent vide)
 */
export async function deleteStudent(id) {
  if (!id) throw new Error("deleteStudent: id requis");
  const res = await apiClient.delete(`/students/${id}`);
  return res.data; // peut être vide si 204
}
