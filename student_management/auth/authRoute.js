// auth/authRoute.js
import express from "express";
import { googleAuth, googleCallback, authFail, logout, authGoogle, test, createUser } from "./authController.js";
import { requireLogin } from "./auth.js";

const router = express.Router();

router.get("/google", googleAuth);
router.get("/google/callback", googleCallback,authGoogle);
router.get("/fail", authFail);
router.get("/authenticated", requireLogin, authGoogle);
router.post("/logout", requireLogin, logout);
router.get("/testauth", requireLogin, test);
router.post('/google',createUser);

export default router;
