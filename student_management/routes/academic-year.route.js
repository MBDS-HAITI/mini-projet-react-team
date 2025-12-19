// routes/academic-year.route.js
import express from "express";
import {
  postAcademicYear,
  getAllAcademicYears,
  getAcademicYear,
  putAcademicYear,
  deleteAcademicYear,
} from "../controllers/academic-year.controller.js";

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     AcademicYear:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *           example: 2025-2026
 *           description: Format YYYY-YYYY (la 2e année = la 1re + 1)
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: 2025-09-01T00:00:00.000Z
 *         endDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2026-06-30T23:59:59.000Z
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
 *         - name
 *         - startDate
 *
 *     AcademicYearCreate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: 2025-2026
 *           description: Format YYYY-YYYY (la 2e année = la 1re + 1)
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: 2025-09-01T00:00:00.000Z
 *         endDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2026-06-30T23:59:59.000Z
 *         isActive:
 *           type: boolean
 *           example: true
 *       required:
 *         - name
 *         - startDate
 */

/**
 * @openapi
 * /api/v1/academicyears:
 *   post:
 *     summary: Créer une année académique
 *     tags: [AcademicYears]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcademicYearCreate'
 *     responses:
 *       201:
 *         description: Année académique créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicYear'
 */
router.post("/", postAcademicYear);

/**
 * @openapi
 * /api/v1/academicyears:
 *   get:
 *     summary: Récupérer la liste des années académiques
 *     tags: [AcademicYears]
 *     responses:
 *       200:
 *         description: Liste des années académiques
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AcademicYear'
 */
router.get("/", getAllAcademicYears);

/**
 * @openapi
 * /api/v1/academicyears/{id}:
 *   get:
 *     summary: Récupérer une année académique par ID
 *     tags: [AcademicYears]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Année académique trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicYear'
 *       404:
 *         description: Année académique introuvable
 */
router.get("/:id", getAcademicYear);

/**
 * @openapi
 * /api/v1/academicyears/{id}:
 *   put:
 *     summary: Mettre à jour une année académique
 *     tags: [AcademicYears]
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
 *             $ref: '#/components/schemas/AcademicYearCreate'
 *     responses:
 *       200:
 *         description: Année académique mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicYear'
 */
router.put("/:id", putAcademicYear);

/**
 * @openapi
 * /api/v1/academicyears/{id}:
 *   delete:
 *     summary: Supprimer une année académique
 *     tags: [AcademicYears]
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
 *         description: Année académique introuvable
 */
router.delete("/:id", deleteAcademicYear);

export default router;
