// routes/grade.route.js
import { Router } from "express";
import {
  postGrade,
  getAllGrades,
  getAllGradesBySemesterId,
  getAllGradesByStudentId,
  getGrade,
  putGrade,
  deleteGrade,
} from "../controllers/grade.controller.js";
import { scolariteAuthorize } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Grades
 *   description: Gestion des notes (Grade) liées aux inscriptions (Enrollment)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Grade:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6765cfe6b0d9d0f7c4b7a123"
 *         enrollment:
 *           oneOf:
 *             - type: string
 *               description: ObjectId de l'inscription
 *               example: "6765cfe6b0d9d0f7c4b7a999"
 *             - type: object
 *               description: Enrollment peuplé
 *         value:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           example: 85
 *         gradedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-12-20T10:15:30.000Z"
 *         gradedByUserId:
 *           type: string
 *           example: "6765cfe6b0d9d0f7c4b7a777"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     GradeCreate:
 *       type: object
 *       required:
 *         - enrollment
 *         - value
 *       properties:
 *         enrollment:
 *           type: string
 *           example: "6765cfe6b0d9d0f7c4b7a999"
 *         value:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           example: 90
 *         gradedAt:
 *           type: string
 *           format: date-time
 *           description: Optionnel (par défaut Date.now)
 *           example: "2025-12-20T10:15:30.000Z"
 *         gradedByUserId:
 *           type: string
 *           example: "6765cfe6b0d9d0f7c4b7a777"
 *
 *     GradeUpdate:
 *       type: object
 *       properties:
 *         value:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           example: 95
 *         gradedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-12-20T10:15:30.000Z"
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/v1/grades:
 *   post:
 *     summary: Créer une note
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GradeCreate'
 *     responses:
 *       201:
 *         description: Note ajoutée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grade'
 *       500:
 *         description: Erreur serveur
 */
router.post("/", scolariteAuthorize, postGrade);

/**
 * @swagger
 * /api/v1/grades:
 *   get:
 *     summary: Récupérer toutes les notes (populate enrollment->student/course/semester->academicYear)
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Grade'
 *       500:
 *         description: Erreur serveur
 */
router.get("/", scolariteAuthorize, getAllGrades);

/**
 * @swagger
 * /api/v1/grades/semester/{semesterId}:
 *   get:
 *     summary: Récupérer toutes les notes par semestre
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: semesterId
 *         required: true
 *         schema:
 *           type: string
 *         example: "6765cfe6b0d9d0f7c4b70001"
 *     responses:
 *       200:
 *         description: Notes du semestre
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Grade'
 *       400:
 *         description: semesterId invalide
 *       500:
 *         description: Erreur serveur
 */
router.get("/semester/:semesterId", scolariteAuthorize, getAllGradesBySemesterId);

/**
 * @swagger
 * /api/v1/grades/student/{studentId}:
 *   get:
 *     summary: Récupérer toutes les notes par étudiant
 *     description: |
 *       Si l'utilisateur connecté a role=STUDENT, il ne peut accéder qu'à ses propres notes.
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         example: "6765cfe6b0d9d0f7c4b70002"
 *     responses:
 *       200:
 *         description: Notes de l'étudiant
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Grade'
 *       400:
 *         description: studentId invalide
 *       401:
 *         description: UnscolariteAuthorizeorized
 *       500:
 *         description: Erreur serveur
 */
router.get("/student/:studentId", getAllGradesByStudentId);

/**
 * @swagger
 * /api/v1/grades/{id}:
 *   get:
 *     summary: Récupérer une note par ID
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "6765cfe6b0d9d0f7c4b7a123"
 *     responses:
 *       200:
 *         description: Note trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grade'
 *       404:
 *         description: Grade not found
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id", scolariteAuthorize, getGrade);

/**
 * @swagger
 * /api/v1/grades/{id}:
 *   put:
 *     summary: Mettre à jour une note
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "6765cfe6b0d9d0f7c4b7a123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GradeUpdate'
 *     responses:
 *       200:
 *         description: Note mise à jour (retourne la note peuplée)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grade'
 *       404:
 *         description: Grade not found
 *       500:
 *         description: Erreur serveur
 */
router.put("/:id", scolariteAuthorize, putGrade);

/**
 * @swagger
 * /api/v1/grades/{id}:
 *   delete:
 *     summary: Supprimer une note
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "6765cfe6b0d9d0f7c4b7a123"
 *     responses:
 *       200:
 *         description: Note supprimée
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id", scolariteAuthorize, deleteGrade);

export default router;