// routes/user.route.js
import express from "express";
import {
  changePassword,
  me,
  refreshAccessToken,
  signIn,
  signOut
} from "../controllers/auth.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();


/**
 * @openapi
 * components:
 *   schemas:
 *     SignInRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: "stanley"
 *         password:
 *           type: string
 *           format: password
 *           example: "Test123#"
 *
 *     SignInResponse:
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
 *           $ref: "#/components/schemas/User"
 */

/**
 * @openapi
 * /api/v1/auths/signin:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/SignInRequest"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SignInResponse"
 *       400:
 *         description: Données invalides (username/password manquants)
 *       401:
 *         description: Identifiants invalides
 *       500:
 *         description: Erreur serveur
 */
router.post("/signin", signIn);

/**
 * @openapi
 * /api/v1/auths/refresh:
 *   post:
 *     summary: Récupérer un nouveau token JWT
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200:
 *         description: Token JWT mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */
router.post("/refresh",  refreshAccessToken);


/**
 * @openapi
 * /api/v1/auths/signout:
 *   post:
 *     summary: Déconnexion utilisateur
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
router.post("/signout", signOut);

/**
 * @openapi
 * /api/v1/auths/changepassword:
 *   post:
 *     summary: Changer son mot de passe
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ChangePasswordRequest"
 *     responses:
 *       200:
 *         description: Mot de passe modifié avec succès
 *       401:
 *         description: Non autorisé / ancien mot de passe incorrect
 */
router.post("/changepassword", authorize, changePassword);

/**
 * @openapi
 * /api/v1/auths/me:
 *   get:
 *     summary: Récupérer les informations de l'utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur
 */
router.get("/me", authorize, me);

export default router;
