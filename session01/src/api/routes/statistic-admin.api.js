import { apiClient } from "../client";

/**
 * KPIs administrateur
 * GET /api/v1/dashboard/admin/kpis
 */
export const fetchAdminKpis = async () => {
  const res = await apiClient.get("/dashboard/admin/kpis");
  return res.data;
};

/**
 * Activités récentes
 * GET /api/v1/dashboard/admin/activities
 */
export const fetchAdminActivities = async () => {
  const res = await apiClient.get("/dashboard/admin/activities");
  return res.data;
};

/**
 * État du système
 * GET /api/v1/dashboard/admin/system-status
 */
export const fetchSystemStatus = async () => {
  const res = await apiClient.get("/dashboard/admin/system-status");
  return res.data;
};

/**
 * Configuration du système
 * GET /api/v1/dashboard/admin/configuration
 */
export const fetchSystemConfiguration = async () => {
  const res = await apiClient.get("/dashboard/admin/configuration");
  return res.data;
};

/**
 * Alertes système
 * GET /api/v1/dashboard/admin/alerts
 */
export const fetchSystemAlerts = async () => {
  const res = await apiClient.get("/dashboard/admin/alerts");
  return res.data;
};
