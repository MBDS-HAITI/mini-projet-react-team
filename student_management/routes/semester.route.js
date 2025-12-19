// routes/semester.route.js
import express from "express";
import {
  postSemester,
  getAllSemesters,
  getSemester,
  putSemester,
  deleteSemester,
  getAllSemestersByAcademicYear,
} from "../controllers/semester.controller.js";

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Semester:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         academicYear:
 *           type: string
 *           description: Référence vers l'année académique (AcademicYear)
 *           example: 64f4a6f2b4f3c2a1d9e8c777
 *         name:
 *           type: string
 *           enum: [S1, S2]
 *           example: S1
 *         startDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2025-09-01T00:00:00.000Z
 *         endDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2026-01-31T23:59:59.000Z
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - academicYear
 *         - name
 *
 *     SemesterCreate:
 *       type: object
 *       properties:
 *         academicYear:
 *           type: string
 *           description: ID de l'année académique (AcademicYear)
 *           example: 64f4a6f2b4f3c2a1d9e8c777
 *         name:
 *           type: string
 *           enum: [S1, S2]
 *           example: S1
 *         startDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2025-09-01T00:00:00.000Z
 *         endDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2026-01-31T23:59:59.000Z
 *         isActive:
 *           type: boolean
 *           example: true
 *       required:
 *         - academicYear
 *         - name
 */

/**
 * @openapi
 * /api/v1/semesters:
 *   post:
 *     summary: Créer un semestre
 *     tags: [Semesters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SemesterCreate'
 *     responses:
 *       201:
 *         description: Semestre créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Semester'
 *       400:
 *         description: Données invalides
 *       409:
 *         description: Conflit (academicYear + name déjà existant)
 */
router.post("/", postSemester);

/**
 * @openapi
 * /api/v1/semesters:
 *   get:
 *     summary: Récupérer la liste des semestres
 *     tags: [Semesters]
 *     responses:
 *       200:
 *         description: Liste des semestres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Semester'
 */
router.get("/", getAllSemesters);

/**
 * @openapi
 * /api/v1/semesters/academicyear/{academicYearId}:
 *   get:
 *     summary: Récupérer les semestres d'une année académique
 *     tags: [Semesters]
 *     parameters:
 *       - in: path
 *         name: academicYearId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'année académique
 *     responses:
 *       200:
 *         description: Liste des semestres de l'année académique
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Semester'
 *       400:
 *         description: academicYearId invalide
 */
router.get("/academicyear/:academicYearId", getAllSemestersByAcademicYear);

/**
 * @openapi
 * /api/v1/semesters/{id}:
 *   get:
 *     summary: Récupérer un semestre par ID
 *     tags: [Semesters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Semestre trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Semester'
 *       404:
 *         description: Semestre introuvable
 */
router.get("/:id", getSemester);

/**
 * @openapi
 * /api/v1/semesters/{id}:
 *   put:
 *     summary: Mettre à jour un semestre
 *     tags: [Semesters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SemesterCreate'
 *     responses:
 *       200:
 *         description: Semestre mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Semester'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Semestre introuvable
 *       409:
 *         description: Conflit (academicYear + name déjà existant)
 */
router.put("/:id", putSemester);

/**
 * @openapi
 * /api/v1/semesters/{id}:
 *   delete:
 *     summary: Supprimer un semestre
 *     tags: [Semesters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Supprimé
 *       404:
 *         description: Semestre introuvable
 */
router.delete("/:id", deleteSemester);

export default router;
