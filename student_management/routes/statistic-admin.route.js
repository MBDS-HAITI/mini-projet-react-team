import express from "express";
import {
  getAdminKpis,
  getRecentActivities,
  getSystemAlerts,
  getSystemConfiguration,
  getSystemStatus,
} from "../controllers/statistic-admin.controller.js";

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: AdminDashboard
 *     description: Statistiques et supervision administrateur
 */

/**
 * @openapi
 * /api/v1/dashboard/admin/kpis:
 *   get:
 *     summary: Récupérer les KPIs administrateur
 *     tags: [AdminDashboard]
 *     responses:
 *       200:
 *         description: Liste des indicateurs clés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   key:
 *                     type: string
 *                   title:
 *                     type: string
 *                   value:
 *                     type: number
 *                   subtitle:
 *                     type: string
 *                   icon:
 *                     type: string
 */
router.get(
  "/kpis",
  async (req, res, next) => {
    try {
      const data = await getAdminKpis();
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @openapi
 * /api/v1/dashboard/admin/activities:
 *   get:
 *     summary: Récupérer les activités récentes
 *     tags: [AdminDashboard]
 *     responses:
 *       200:
 *         description: Liste des activités récentes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   action:
 *                     type: string
 *                   user:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 */
router.get(
  "/activities",
  async (req, res, next) => {
    try {
      const data = await getRecentActivities();
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @openapi
 * /api/v1/dashboard/admin/system-status:
 *   get:
 *     summary: Récupérer l’état du système
 *     tags: [AdminDashboard]
 *     responses:
 *       200:
 *         description: Statut global du système
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 activeUsers:
 *                   type: number
 *                 failedLogins:
 *                   type: number
 *                 academicYear:
 *                   type: string
 *                 coursesWithoutEnrollment:
 *                   type: number
 */
router.get(
  "/system-status",
  async (req, res, next) => {
    try {
      const data = await getSystemStatus();
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @openapi
 * /api/v1/dashboard/admin/configuration:
 *   get:
 *     summary: Récupérer les données de configuration
 *     tags: [AdminDashboard]
 *     responses:
 *       200:
 *         description: Configuration du système
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 academicYears:
 *                   type: array
 *                   items:
 *                     type: object
 *                 semesters:
 *                   type: array
 *                   items:
 *                     type: object
 *                 courses:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get(
  "/configuration",
  async (req, res, next) => {
    try {
      const data = await getSystemConfiguration();
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @openapi
 * /api/v1/dashboard/admin/alerts:
 *   get:
 *     summary: Récupérer les alertes système
 *     tags: [AdminDashboard]
 *     responses:
 *       200:
 *         description: Liste des alertes système
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     example: warning
 *                   message:
 *                     type: string
 */
router.get(
  "/alerts",
  async (req, res, next) => {
    try {
      const data = await getSystemAlerts();
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
