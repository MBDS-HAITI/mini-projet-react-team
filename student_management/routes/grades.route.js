import express from "express";
import {
  postGrades,
  getAllgrades,
  getGrades,
  putGrades,
  deleteGrades
} from "../controllers/grades.controller.js";

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Grades:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         student:
 *           type: string
 *           description: ID de l'étudiant
 *         course:
 *           type: string
 *           description: ID du cours
 *         value:
 *           type: number
 *           example: 85
 *       required:
 *         - student
 *         - course
 *         - value
 *
 *     GradesCreate:
 *       type: object
 *       properties:
 *         student:
 *           type: string
 *         course:
 *           type: string
 *         value:
 *           type: number
 *       required:
 *         - student
 *         - course
 *         - value
 */

/**
 * @openapi
 * /api/v1/grades:
 *   post:
 *     summary: Créer une note
 *     tags: [Grades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GradesCreate'
 *     responses:
 *       201:
 *         description: Note créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grades'
 *       500:
 *         description: Erreur serveur
 */
router.post("/", postGrades);

/**
 * @openapi
 * /api/v1/grades:
 *   get:
 *     summary: Récupérer toutes les notes
 *     tags: [Grades]
 *     responses:
 *       200:
 *         description: Liste des notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Grades'
 *       500:
 *         description: Erreur serveur
 */
router.get("/", getAllgrades);

/**
 * @openapi
 * /api/v1/grades/{id}:
 *   get:
 *     summary: Récupérer une note par ID
 *     tags: [Grades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grades'
 *       404:
 *         description: Note introuvable
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id", getGrades);

/**
 * @openapi
 * /api/v1/grades/{id}:
 *   put:
 *     summary: Mettre à jour une note
 *     tags: [Grades]
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
 *             $ref: '#/components/schemas/GradesCreate'
 *     responses:
 *       200:
 *         description: Note mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grades'
 *       404:
 *         description: Note introuvable
 *       500:
 *         description: Erreur serveur
 */
router.put("/:id", putGrades);

/**
 * @openapi
 * /api/v1/grades/{id}:
 *   delete:
 *     summary: Supprimer une note
 *     tags: [Grades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note supprimée
 *       404:
 *         description: Note introuvable
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id", deleteGrades);

export default router;
