// routes/user.route.js
import express from "express";
import {
  signIn
} from "../controllers/auth.controller.js";
import { authorize } from "../middleware/auth.middleware.js";

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



export default router;
