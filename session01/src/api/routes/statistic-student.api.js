
import { apiClient } from "../client";

/**
 * GET /api/v1/grades/me/dashboard
 * Données dashboard étudiant (KPI + dernières notes)
 */
export async function getMyDashboardGrades() {
  const res = await apiClient.get("studentdashboard");
  return res.data;
}
