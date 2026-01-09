// src/components/pages/AdminDashboard.jsx (ou ton chemin)
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardHeader from "./DashboardHeader";
import { ActionButton } from "../ActionButton";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";

import {
  Users,
  AlertTriangle,
  Lock,
  CheckCircle,
  Edit,
  School,
} from "lucide-react";
import SectionSytemState from "./SectionSytemState";
import KpiCards from "./KpiCards";
import QuickActionsCard from "./QuickActionsCard";
import Configuration from "./Configuration";
import AlertSystem from "./Alertystem";
import RecentActivity from "./recentActivity";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();

  const surfaceCardSx = {
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    backgroundColor: theme.palette.background.paperGlass,
    boxShadow: theme.palette.effects?.containerShadow,
    backdropFilter: "blur(14px)",
    p: 3,
  };

 

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
  const configurations = [
    { label: "Années académiques", to: "/academicyears" },
    { label: "Semestres", to: "/semester" },
    { label: "Liste des Cours", to: "/courses" },
  ];

  return (
    <Box
      sx={{
        maxWidth: 1280,
        mx: "auto",
        px: 2,
        py: 4,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {/* ================= HEADER ================= */}
      <DashboardHeader
        title="Dashboard Administrateur"
        description="Supervision et gestion du système"
        level="ADMIN"
      />

      {/* ================= KPI CARDS ================= */}
      <KpiCards />

      {/* ================= CONTENU CENTRAL ================= */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
          gap: 3,
        }}
      >
        {/* ======== COLONNE PRINCIPALE ======== */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* État du système */}
          <SectionSytemState surfaceCardSx={surfaceCardSx} />

          {/* Activités récentes */}
          <RecentActivity surfaceCardSx={surfaceCardSx}/>

          {/* ================= ACTIONS RAPIDES ================= */}
          <QuickActionsCard
            surfaceCardSx={surfaceCardSx}
            ActionButtonComponent={ActionButton}
            actions={actions}
          />
        </Box>

        {/* ======== ASIDE DROIT ======== */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Configuration */}
          <Configuration configurations={configurations} surfaceCardSx={surfaceCardSx} theme={theme}/>

          {/* Alertes système */}
          <AlertSystem theme={theme} surfaceCardSx={surfaceCardSx}/>
          
        </Box>
      </Box>
    </Box>
  );
}
