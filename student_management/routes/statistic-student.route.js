// routes/grade.route.js
import { Router } from "express";
import {
  getMyDashboardGrades, 
} from "../controllers/statistic-student.controller.js";




const router = Router();
router.get("/", getMyDashboardGrades);

export default router;