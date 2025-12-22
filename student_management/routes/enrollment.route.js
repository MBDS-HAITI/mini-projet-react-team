// routes/enrollment.route.js
import express from "express";
import {
  postEnrollment,
  getAllEnrollments,
  getEnrollment,
  putEnrollment,
  deleteEnrollment,
  getAllEnrollmentsByStudentId,
  getAllEnrollmentsBySemesterId,
  getAllEnrollmentsByAcademicYearId,
} from "../controllers/enrollment.controller.js";
import { scolariteAuthorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Enrollment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         student:
 *           type: string
 *           description: Référence vers l'étudiant (Student)
 *           example: 64f4a6f2b4f3c2a1d9e8c111
 *         course:
 *           type: string
 *           description: Référence vers le cours (Course)
 *           example: 64f4a6f2b4f3c2a1d9e8c222
 *         semester:
 *           type: string
 *           description: Référence vers le semestre (Semester)
 *           example: 64f4a6f2b4f3c2a1d9e8c333
 *         status:
 *           type: string
 *           enum: [ENROLLED, DROPPED, COMPLETED]
 *           example: ENROLLED
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - student
 *         - course
 *         - semester
 *
 *     EnrollmentCreate:
 *       type: object
 *       properties:
 *         student:
 *           type: string
 *           description: ID de l'étudiant (Student)
 *           example: 64f4a6f2b4f3c2a1d9e8c111
 *         course:
 *           type: string
 *           description: ID du cours (Course)
 *           example: 64f4a6f2b4f3c2a1d9e8c222
 *         semester:
 *           type: string
 *           description: ID du semestre (Semester)
 *           example: 64f4a6f2b4f3c2a1d9e8c333
 *         status:
 *           type: string
 *           enum: [ENROLLED, DROPPED, COMPLETED]
 *           example: ENROLLED
 *       required:
 *         - student
 *         - course
 *         - semester
 */

/**
 * @openapi
 * /api/v1/enrollments:
 *   post:
 *     summary: Créer une inscription (Enrollment)
 *     tags: [Enrollments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EnrollmentCreate'
 *     responses:
 *       201:
 *         description: Inscription créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
 *       400:
 *         description: Données invalides
 *       409:
 *         description: Conflit (même student + course + semester déjà existant)
 */
router.post("/", scolariteAuthorize, postEnrollment);

/**
 * @openapi
 * /api/v1/enrollments:
 *   get:
 *     summary: Récupérer la liste des inscriptions
 *     tags: [Enrollments]
 *     responses:
 *       200:
 *         description: Liste des inscriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Enrollment'
 */
router.get("/", scolariteAuthorize, getAllEnrollments);

/**
 * @openapi
 * /api/v1/enrollments/semester/{semesterId}:
 *   get:
 *     summary: Récupérer les inscriptions d'un semestre
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: semesterId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du semestre
 *     responses:
 *       200:
 *         description: Liste des inscriptions du semestre
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Enrollment'
 *       400:
 *         description: semesterId invalide
 */
router.get("/semester/:semesterId", scolariteAuthorize, getAllEnrollmentsBySemesterId);

/**
 * @openapi
 * /api/v1/enrollments/academicyear/{academicYearId}:
 *   get:
 *     summary: Récupérer les inscriptions d'une année académique
 *     description: |
 *       Retourne toutes les inscriptions dont le semestre appartient à l'année académique donnée.
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: academicYearId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'année académique
 *     responses:
 *       200:
 *         description: Liste des inscriptions de l'année académique
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Enrollment'
 *       400:
 *         description: academicYearId invalide
 */
router.get("/academicyear/:academicYearId", scolariteAuthorize, getAllEnrollmentsByAcademicYearId);

/**
 * @openapi
 * /api/v1/enrollments/student/{studentId}:
 *   get:
 *     summary: Récupérer les inscriptions d'un semestre
 *     description: |
 *       Retourne toutes les inscriptions du semestre.
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du semestre
 *     responses:
 *       200:
 *         description: Liste des inscriptions du semestre
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Enrollment'
 *       400:
 *         description: studentId invalide
 */
router.get("/student/:studentId",  getAllEnrollmentsByStudentId);


/**
 * @openapi
 * /api/v1/enrollments/{id}:
 *   get:
 *     summary: Récupérer une inscription par ID
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inscription trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
 *       404:
 *         description: Inscription introuvable
 */
router.get("/:id", scolariteAuthorize, getEnrollment);

/**
 * @openapi
 * /api/v1/enrollments/{id}:
 *   put:
 *     summary: Mettre à jour une inscription
 *     tags: [Enrollments]
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
 *             $ref: '#/components/schemas/EnrollmentCreate'
 *     responses:
 *       200:
 *         description: Inscription mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Inscription introuvable
 *       409:
 *         description: Conflit (même student + course + semester déjà existant)
 */
router.put("/:id", scolariteAuthorize, putEnrollment);

/**
 * @openapi
 * /api/v1/enrollments/{id}:
 *   delete:
 *     summary: Supprimer une inscription
 *     tags: [Enrollments]
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
 *         description: Inscription introuvable
 */
router.delete("/:id", scolariteAuthorize, deleteEnrollment);

export default router;
