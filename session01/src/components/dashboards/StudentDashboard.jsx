// src/components/dashboards/StudentDashboard.jsx

import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import StatCard from "../widgets/StatCard";

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
        Bienvenue, {user?.username}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Accédez à vos informations académiques
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <StatCard title="Mes cours" value="—" subtitle="Ce semestre" />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Mes notes" value="—" subtitle="Moyenne" />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Année académique" value="—" subtitle="Actuelle" />
        </Grid>
      </Grid>

      <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
        Raccourcis
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <Button variant="contained" onClick={() => navigate("/my-courses")}>
          Mes cours
        </Button>
        <Button variant="contained" onClick={() => navigate("/my-grades")}>
          Mes notes
        </Button>
        <Button variant="outlined" onClick={() => navigate("/profile")}>
          Mon profil
        </Button>
      </Stack>
    </Box>
  );
}
