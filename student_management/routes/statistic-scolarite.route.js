// routes/scolariteDashboard.route.js

import express from "express";
import { getScolariteDashboard } from "../controllers/statistic-scolarite.controller.js";

const router = express.Router();

/**
 * GET /api/v1/scolariteDashboard/scolarite
 * Dashboard scolarité – statistiques globales
 */
router.get("/",
//   authorize,
//   scolariteAuthorize,
  getScolariteDashboard
);

export default router;
