import express from 'express'
import { passport, requireLogin } from "../auths/auth.js";
import { authenticaton_base } from '../server.js';

const router = express.Router()

router.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/fail" }),
  (req, res) => res.redirect(`/${authenticaton_base}/authenticated`)
);

router.get("/auth/fail", (req, res) => res.status(401).send("Auth failed"));

router.get("/authenticated", requireLogin, (req, res) => res.json({ user: req.user }));

export default router;