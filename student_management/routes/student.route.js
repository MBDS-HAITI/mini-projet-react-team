
import express from 'express'
import {postStudent, getAllStudents, getStudent, putStudent, deleteStudent,getStudents} from '../controllers/student.controller.js';

const router = express.Router();

// Define routes and link to controller functions
/**
 * @openapi
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *       required:
 *         - firstName
 *         - lastName
 *     StudentCreate:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *       required:
 *         - firstName
 *         - lastName
 */

/**
 * @openapi
 * /api/v1/students:
 *   post:
 *     summary: Créer un étudiant
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentCreate'
 *     responses:
 *       201:
 *         description: Étudiant créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 */
router.post("/", postStudent);

/**
 * @openapi
 * /api/v1/students:
 *   get:
 *     summary: Récupérer la liste des étudiants
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: Liste des étudiants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 */
router.get('/', getAllStudents);

/**
 * @openapi
 * /api/v1/students/filtered:
 *   get:
 *     summary: Liste paginée + tri + recherche des étudiants
 *     description: |
 *       Retourne une liste paginée d'étudiants avec tri et recherche (sur firstName/lastName).
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Numéro de page (>= 1)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Nombre d'éléments par page (1..100)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: lastName
 *           enum: [firstName, lastName, email, createdAt, updatedAt]
 *         description: Champ utilisé pour le tri
 *       - in: query
 *         name: asc
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Tri ascendant (true) ou descendant (false)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           default: ""
 *         description: Recherche texte (regex, insensible à la casse) sur firstName/lastName
 *     responses:
 *       200:
 *         description: Liste paginée d'étudiants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Student'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 57
 *                     totalPages:
 *                       type: integer
 *                       example: 6
 *                 message:
 *                   type: string
 *                   example: ""
 *       400:
 *         description: Paramètres invalides
 *       500:
 *         description: Erreur serveur
 */
router.get("/filtered", getStudents);


/**
 * @openapi
 * /api/v1/students/{id}:
 *   get:
 *     summary: Récupérer un étudiant par ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Étudiant trouvé
 *       404:
 *         description: Étudiant introuvable
 */
router.get('/:id', getStudent);

/**
 * @openapi
 * /api/v1/students/{id}:
 *   put:
 *     summary: Mettre à jour un étudiant
 *     tags: [Students]
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
 *             $ref: '#/components/schemas/StudentCreate'
 *     responses:
 *       200:
 *         description: Étudiant mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 */
router.put('/:id', putStudent);

/**
 * @openapi
 * /api/v1/students/{id}:
 *   delete:
 *     summary: Supprimer un étudiant
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Supprimé
 */
router.delete('/:id', deleteStudent);

export default router;