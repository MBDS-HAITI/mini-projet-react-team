// routes/user.route.js
import express from "express";
import {
  postUser,
  getAllUsers,
  getUsers,
  getUser,
  getUserStudent,
  putUser,
  deleteUser,
  resetUserPassword,
} from "../controllers/user.controller.js";

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Provider:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [google]
 *           example: google
 *         providerId:
 *           type: string
 *           example: "103948572034985720349"
 *         email:
 *           type: string
 *           format: email
 *           example: "stanley@gmail.com"
 *
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6750f2c5a3d0d3b9f2b6c123"
 *         email:
 *           type: string
 *           format: email
 *           example: "stanley@example.com"
 *         mailVerified:
 *           type: boolean
 *           example: false
 *         username:
 *           type: string
 *           nullable: true
 *           example: "stanley"
 *         role:
 *           type: string
 *           enum: [ADMIN, SCOLARITE, STUDENT]
 *           example: "STUDENT"
 *         student:
 *           type: string
 *           nullable: true
 *           description: "Obligatoire si role = STUDENT (ObjectId Student)"
 *           example: "6750f2c5a3d0d3b9f2b6c999"
 *         providers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Provider'
 *         isActive:
 *           type: boolean
 *           example: true
 *         lastLoginAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-12-19T14:33:12.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-12-19T14:33:12.000Z"
 *
 *     UserCreate:
 *       type: object
 *       required:
 *         - email
 *         - role
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "stanley@example.com"
 *         username:
 *           type: string
 *           description: "Unique, en minuscules (optionnel)"
 *           example: "stanley"
 *         password:
 *           type: string
 *           format: password
 *           description: "Min 6 caractères. Si absent, un mot de passe par défaut peut être généré côté serveur."
 *           example: "Test123#"
 *         role:
 *           type: string
 *           enum: [ADMIN, SCOLARITE, STUDENT]
 *           example: "ADMIN"
 *         student:
 *           type: string
 *           nullable: true
 *           description: "Requis si role=STUDENT, sinon doit être null."
 *           example: "6750f2c5a3d0d3b9f2b6c999"
 *
 *     UserUpdate:
 *       type: object
 *       description: "Champs modifiables. username est ignoré côté serveur (delete req.body.username)."
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "newmail@example.com"
 *         role:
 *           type: string
 *           enum: [ADMIN, SCOLARITE, STUDENT]
 *           example: "SCOLARITE"
 *         student:
 *           type: string
 *           nullable: true
 *           example: "6750f2c5a3d0d3b9f2b6c999"
 *         mailVerified:
 *           type: boolean
 *           example: true
 *         isActive:
 *           type: boolean
 *           example: true
 *         lastLoginAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2025-12-19T15:10:00.000Z"
 *
 *     UserCreateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         token:
 *           type: string
 *           description: "JWT"
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         user:
 *           $ref: '#/components/schemas/User'
 *
 *     PaginatedUsersResponse:
 *       type: object
 *       properties:
 *         isSuccess:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *               example: 1
 *             pageSize:
 *               type: integer
 *               example: 10
 *             total:
 *               type: integer
 *               example: 57
 *             totalPages:
 *               type: integer
 *               example: 6
 *         message:
 *           type: string
 *           example: ""
 */

/**
 * @openapi
 * /api/v1/users:
 *   post:
 *     summary: Créer un utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCreateResponse'
 *       400:
 *         description: Données invalides (validation)
 *       409:
 *         description: Conflit (email/username déjà existant)
 *       500:
 *         description: Erreur serveur
 */
router.post("/", postUser);

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs (sans pagination)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Erreur serveur
 */
router.get("/", getAllUsers);

/**
 * @openapi
 * /api/v1/users/filtered:
 *   get:
 *     summary: Récupérer les utilisateurs (avec pagination, tri et recherche)
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Numéro de page (>= 1)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Taille de page (1..100)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: username
 *         description: Champ de tri (username, email, role, createdAt)
 *       - in: query
 *         name: asc
 *         schema:
 *           type: boolean
 *           example: true
 *         description: true => ascendant, false => descendant
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: "stan"
 *         description: Recherche sur username ou email (regex, insensible à la casse)
 *     responses:
 *       200:
 *         description: Résultat paginé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedUsersResponse'
 *       500:
 *         description: Erreur serveur
 */
router.get("/filtered", getUsers);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id", getUser);

/**
 * @openapi
 * /api/v1/users/student/{studentId}:
 *   get:
 *     summary: Récupérer un utilisateur par studentId
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId de Student référencé dans User.student
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Erreur serveur
 */
router.get("/student/:studentId", getUserStudent);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur (username non modifiable)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Données invalides (validation)
 *       404:
 *         description: User not found
 *       500:
 *         description: Erreur serveur
 */
router.put("/:id", putUser);

/**
 * @openapi
 * /api/v1/users/{id}/reset-password:
 *   patch:
 *     summary: Réinitialiser le mot de passe d'un utilisateur (Admin only)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: "TempPass2526"
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       400:
 *         description: Données invalides (id ou newPassword)
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: User not found
 *       500:
 *         description: Erreur serveur
 */
router.patch("/:id/reset-password", resetUserPassword);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       404:
 *         description: User not found
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id", deleteUser);

export default router;
