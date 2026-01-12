// routes/grade.route.js
import { Router } from "express";
import {
  getMyDashboardGrades, 
} from "../controllers/grade.controller.js";




const router = Router();
router.get("/", getMyDashboardGrades);

export default router;