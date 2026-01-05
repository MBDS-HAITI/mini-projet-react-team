// routes/auth.route.js
import express from "express";
import { googleCallback, googleLinkStart, googleLoginCallback, googleLoginStart } from "../controllers/oauth.controller.js";

const router = express.Router();



// user connecté seulement (link provider)
router.get("/google/link", googleLinkStart);

// callback Google (pas besoin requireAuth car on utilise un cookie state + uid)
router.get("/google/link/callback", googleCallback);

router.get("/google/login", googleLoginStart);

router.get("/google/callback", googleLoginCallback);

export default router;