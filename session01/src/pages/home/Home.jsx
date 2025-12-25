// src/pages/home/HomePage.jsx

import { Box, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "../../auth/AuthProvider";
import AdminDashboard from "../../components/dashboards/AdminDashboard";
import ScolariteDashboard from "../../components/dashboards/ScolariteDashboard";
import StudentDashboard from "../../components/dashboards/StudentDashboard";
import Loading from "../../components/common/Loading";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Loading />
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Utilisateur introuvable</Typography>
      </Box>
    );
  }

  switch (user.role) {
    case "ADMIN":
      return <AdminDashboard />;
    case "SCOLARITE":
      return <ScolariteDashboard/>;
    case "STUDENT":
      return <StudentDashboard />;
    default:
      return (
        <Box sx={{ p: 4 }}>
          <Typography color="error">Rôle inconnu: {user.role}</Typography>
        </Box>
      );
  }
}
