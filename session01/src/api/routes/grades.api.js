// src/api/endpoints/grades.api.js
import { apiClient } from "../client";

/**
 * GET /api/v1/grades
 * Liste (si ton backend renvoie un array)
 */
export async function getAllGrades() {
  const res = await apiClient.get("/grades");
  return res.data;
}

/**
 * GET /api/v1/grades (paginé/filtré si ton backend le supporte)
 * Ex: /grades?page=1&pageSize=10&sortBy=createdAt&asc=true&search=
 */
export async function getGrades(params = {}) {
  const res = await apiClient.get("/grades", { params });
  return res.data;
}

/**
 * GET /api/v1/grades/:id
 */
export async function getGradeById(id) {
  if (!id) throw new Error("getGradeById: id is required");
  const res = await apiClient.get(`/grades/${id}`);
  return res.data;
}

/**
 * POST /api/v1/grades
 * payload: selon ton modèle Grade
 */
export async function createGrade(payload) {
  const res = await apiClient.post("/grades", payload);
  return res.data;
}

/**
 * PUT /api/v1/grades/:id
 */
export async function updateGrade(id, payload) {
  if (!id) throw new Error("updateGrade: id is required");
  const res = await apiClient.put(`/grades/${id}`, payload);
  return res.data;
}

/**
 * DELETE /api/v1/grades/:id
 */
export async function deleteGrade(id) {
  if (!id) throw new Error("deleteGrade: id is required");
  const res = await apiClient.delete(`/grades/${id}`);
  return res.data;
}
