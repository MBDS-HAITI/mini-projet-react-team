// src/api/routes/grades.api.js
import { apiClient } from "../client";

/**
 * GET /api/v1/grades
 * Récupérer toutes les notes
 */
export async function getAllGrades() {
  const res = await apiClient.get("/grades");
  return res.data;
}

/**
 * GET /api/v1/grades
 * Variante avec params (si ton backend supporte filtres/pagination)
 * Ex: /grades?page=1&pageSize=10&sortBy=createdAt&asc=true&search=
 */
export async function getGrades(params = {}) {
  const res = await apiClient.get("/grades", { params });
  return res.data;
}

/**
 * GET /api/v1/grades/:id
 * Récupérer une note par ID
 */
export async function getGradeById(id) {
  if (!id) throw new Error("getGradeById: id is required");
  const res = await apiClient.get(`/grades/${id}`);
  return res.data;
}

/**
 * GET /api/v1/grades/semester/:semesterId
 * Récupérer toutes les notes par semestre
 */
export async function getGradesBySemesterId(semesterId) {
  if (!semesterId) throw new Error("getGradesBySemesterId: semesterId is required");
  const res = await apiClient.get(`/grades/semester/${semesterId}`);
  return res.data;
}

/**
 * GET /api/v1/grades/student/:studentId
 * Récupérer toutes les notes par étudiant
 */
export async function getGradesByStudentId(studentId) {
  if (!studentId) throw new Error("getGradesByStudentId: studentId is required");
  const res = await apiClient.get(`/grades/student/${studentId}`);
  return res.data;
}

/**
 * POST /api/v1/grades
 * Créer une note
 * payload: { enrollment, value, gradedAt?, gradedByUserId? }
 */
export async function createGrade(payload) {
  if (!payload) throw new Error("createGrade: payload is required");
  const res = await apiClient.post("/grades", payload);
  return res.data;
}

/**
 * PUT /api/v1/grades/:id
 * Mettre à jour une note
 * payload: { value?, gradedAt? }
 */
export async function updateGrade(id, payload) {
  if (!id) throw new Error("updateGrade: id is required");
  if (!payload) throw new Error("updateGrade: payload is required");
  const res = await apiClient.put(`/grades/${id}`, payload);
  return res.data;
}

/**
 * DELETE /api/v1/grades/:id
 * Supprimer une note
 */
export async function deleteGrade(id) {
  if (!id) throw new Error("deleteGrade: id is required");
  const res = await apiClient.delete(`/grades/${id}`);
  return res.data;
}
