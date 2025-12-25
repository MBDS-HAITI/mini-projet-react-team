// src/components/dashboards/ScolariteDashboard.jsx

import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StatCard from "../widgets/StatCard";

export default function ScolariteDashboard() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        Dashboard Scolarité
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <StatCard title="Étudiants" value="—" subtitle="Total" />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Enrollments" value="—" subtitle="Ce semestre" />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Notes" value="—" subtitle="Enregistrées" />
        </Grid>
      </Grid>

      <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
        Actions rapides
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <Button variant="contained" onClick={() => navigate("/students")}>
          Étudiants
        </Button>
        <Button variant="contained" onClick={() => navigate("/courses")}>
          Cours
        </Button>
        <Button variant="contained" onClick={() => navigate("/grades")}>
          Notes
        </Button>
      </Stack>
    </Box>
  );
}
