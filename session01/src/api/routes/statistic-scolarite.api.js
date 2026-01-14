import { apiClient } from "../client";


export async function fetchScolariteDashboard() {
  const res = await apiClient.get(`/dashboard/scolarite`);
   return res.data;
  }
  
