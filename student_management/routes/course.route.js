import express from "express";
import {
  postCourse,
  getAllCourses,
  getCourse,
  putCourse,
  deleteCourse
} from "../controllers/course.controller.js";

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *       required:
 *         - name
 *     CourseCreate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *       required:
 *         - name
 */

/**
 * @openapi
 * /api/v1/courses:
 *   post:
 *     summary: Créer un cours
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseCreate'
 *     responses:
 *       201:
 *         description: Cours créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 */
router.post("/", postCourse);

/**
 * @openapi
 * /api/v1/courses:
 *   get:
 *     summary: Récupérer la liste des cours
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Liste des cours
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
router.get("/", getAllCourses);

/**
 * @openapi
 * /api/v1/courses/{id}:
 *   get:
 *     summary: Récupérer un cours par ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cours trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Cours introuvable
 */
router.get("/:id", getCourse);

/**
 * @openapi
 * /api/v1/courses/{id}:
 *   put:
 *     summary: Mettre à jour un cours
 *     tags: [Courses]
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
 *             $ref: '#/components/schemas/CourseCreate'
 *     responses:
 *       200:
 *         description: Cours mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Cours introuvable
 */
router.put("/:id", putCourse);

/**
 * @openapi
 * /api/v1/courses/{id}:
 *   delete:
 *     summary: Supprimer un cours
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cours supprimé
 *       404:
 *         description: Cours introuvable
 */
router.delete("/:id", deleteCourse);

export default router;
