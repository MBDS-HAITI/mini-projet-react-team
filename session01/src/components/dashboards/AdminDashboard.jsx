// src/components/pages/AdminDashboard.jsx (ou ton chemin)
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import DashboardHeader from "./DashboardHeader";
import { ActionButton } from "../ActionButton";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import {
  Users,
  GraduationCap,
  Shield,
  UserCog,
  ClipboardList,
  BookOpen,
  FileText,
  CheckCircle,
  Edit,
  School,
} from "lucide-react";
import KpiCards from "./KpiCards";
import QuickActionsCard from "./QuickActionsCard";
import SectionSystemState from "./SectionSystemState";
import RecentActivity from "./RecentActivity";
import Configuration from "./Configuration";
import AlertSystem from "./AlertSystem"

import { fetchAdminKpis, 
         fetchSystemStatus,
         fetchAdminActivities,
         fetchSystemConfiguration,
         fetchSystemAlerts,
       } from "../../api/routes/statistic-admin.api";


export default function AdminDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();

  // ============= States ============
   const [kpis, setKpis] = useState([]);
   const [systemStats, setSystemStats] = useState(null);
   const [recentActivities, setRecentActivities] = useState([]);
   const [configurations, setConfigurations] = useState([]);
   const [alerts, setAlerts] = useState([]);

   const surfaceCardSx = {
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    backgroundColor: theme.palette.background.paperGlass,
    boxShadow: theme.palette.effects?.containerShadow,
    backdropFilter: "blur(14px)",
    p: 3,
  };

  const iconMap = {
  GraduationCap,
  ClipboardList,
  BookOpen,
  FileText,
  Users,
};

 useEffect(() => {
  const load = async () => {
    try {
      const [kpisData, 
             stats,
             activitiesData,
             configurationData,
             alertsData,
          ] = await Promise.all([
        fetchAdminKpis(),
        fetchSystemStatus(),
        fetchAdminActivities(),
        fetchSystemConfiguration(),
        fetchSystemAlerts(),
      ]);

      setKpis(
        (kpisData || []).map(kpi => ({
          ...kpi,
          icon: iconMap[kpi.icon] || iconMap.Users,
        }))
      );

      setSystemStats(stats || []);
      setRecentActivities(activitiesData || []);
      setConfigurations(configurationData || []);
      setAlerts(Array.isArray(alertsData) ? alertsData : []);

    } catch (error) {
      console.error("Erreur chargement dashboard admin :", error);
    }
  };

  load();
}, []);

  const actions = [
    {
      key: "users",
      label: "Utilisateurs",
      icon: <Users size={18} />,
      onClick: () => navigate("/users"),
    },
    {
      key: "enroll",
      label: "Inscriptions",
      icon: <CheckCircle size={18} />,
      onClick: () => navigate("/enrollments"),
    },
    {
      key: "grades",
      label: "Gestion des notes",
      icon: <Edit size={18} />,
      onClick: () => navigate("/grades"),
    },
    {
      key: "tudents",
      label: "Gestion des étudiants",
      icon: <School size={18} />,
      onClick: () => navigate("/students"),
    },
  ];

 return (
  <Box sx={{ maxWidth: 1280, mx: "auto", px: 2, py: 4 }}>
    <DashboardHeader
      title="Dashboard Administrateur"
      description="Supervision et gestion du système"
      level="ADMIN"
    />

    {/* ================= KPI ================= */}
    <KpiCards dashboards={kpis} />

    {/* ================= CONTENU CENTRAL ================= */}
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
        gap: 3,
        mt: 3,
      }}
    >
      {/* ======== COLONNE PRINCIPALE ======== */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        
        {/* État du système */}
        <SectionSystemState
          surfaceCardSx={surfaceCardSx}
          systemStats={systemStats}
        />

        {/* Activités récentes */}
        <RecentActivity
          surfaceCardSx={surfaceCardSx}
          recentActivities={recentActivities}
        />

        {/* Actions rapides */}
        <QuickActionsCard
          surfaceCardSx={surfaceCardSx}
          ActionButtonComponent={ActionButton}
          actions={actions}
        />
      </Box>

        {/* ======== ASIDE DROIT ======== */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Configuration */}
          <Configuration configurations={configurations} surfaceCardSx={surfaceCardSx}  theme={theme} />

          {/* Alertes système */}
          <AlertSystem surfaceCardSx={surfaceCardSx} theme={theme} alerts={alerts} />

      </Box>
    </Box>
  </Box>
);
}
