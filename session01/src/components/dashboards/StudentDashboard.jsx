// src/components/dashboards/StudentDashboard.jsx
import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Stack,
  alpha,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import DashboardHeader from "./DashboardHeader";
import KpiCards from "./KpiCards";
import { ActionButton } from "../ActionButton";

import {
  GraduationCap,
  BookOpen,
  AlertTriangle,
  CalendarDays,
  UserCheck,
} from "lucide-react";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();

  // ✅ même surface "glass" partout
  const surfaceCardSx = React.useMemo(
    () => ({
      borderRadius: 3,
      border: "1px solid",
      borderColor: "divider",
      backgroundColor: alpha(theme.palette.background.paper, 0.8),
      backdropFilter: "blur(12px)",
      boxShadow: theme.shadows[2],
    }),
    [theme]
  );

  // INFOS ÉTUDIANT
  const student = {
    name: "Sachy Edvaelle Barreau",
    matricule: "STD-2025-001",
    level: "L2",
    program: "Informatique",
    academicYear: "2024 - 2025",
    status: "Actif",
  };

  // KPI
  const kpis = [
    {
      key: "average",
      title: "Moyenne",
      value: "14.2",
      subtitle: "/20",
      icon: <GraduationCap />,
      valueColor: "success.main",
    },
    {
      key: "validated",
      title: "Matières",
      value: "6/8",
      subtitle: "Validées",
      icon: <BookOpen />,
      valueColor: "secondary.main",
    },
    {
      key: "failures",
      title: "Échecs",
      value: 1,
      subtitle: "Matière(s)",
      icon: <AlertTriangle />,
      valueColor: "error.main",
    },
  ];

  // DERNIÈRES NOTES
  const recentGrades = [
    { id: 1, subject: "Mathématiques", grade: 15, coef: 20, date: "12/11/2025", status: "Validé" },
    { id: 2, subject: "Physique", grade: 9, coef: 20, date: "08/11/2025", status: "Échec" },
    { id: 3, subject: "Informatique", grade: 16, coef: 20, date: "05/11/2025", status: "Validé" },
  ];

  // ALERTES PERSONNELLES
  const alerts = ["⚠️ 1 matière en échec (Physique)", "📅 Semestre bientôt clôturé"];

  return (
    <Box
      sx={{
        mx: "auto",
        width: "100%",
        maxWidth: 1200,
        px: { xs: 2, sm: 3, lg: 4 },
        py: { xs: 3, md: 4 },
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
      }}
    >
      {/* HEADER */}
      <DashboardHeader
        title="Dashboard Étudiant"
        description="Vue globale & actions rapides"
        level="STUDENT"
      />

      {/* PROFIL */}
      <Paper elevation={0} sx={{ ...surfaceCardSx, p: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: { sm: "center" },
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 20, fontWeight: 900, color: "text.primary" }}>
              {student.name}
            </Typography>

            <Typography sx={{ mt: 0.5, fontSize: 14, color: "text.secondary" }}>
              Matricule :{" "}
              <Box component="span" sx={{ fontWeight: 900, color: "text.primary" }}>
                {student.matricule}
              </Box>
            </Typography>

            <Typography sx={{ mt: 0.25, fontSize: 14, color: "text.secondary" }}>
              {student.level} • {student.program} • {student.academicYear}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>Statut :</Typography>
            <Chip
              label={student.status}
              size="small"
              sx={{
                fontWeight: 900,
                color: "success.main",
                border: "1px solid",
                borderColor: alpha(theme.palette.success.main, 0.35),
                backgroundColor: alpha(theme.palette.success.main, 0.10),
              }}
              variant="outlined"
            />
          </Stack>
        </Box>
      </Paper>

      {/* KPI + ALERTES */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
          gap: 2,
          alignItems: "start",
        }}
      >
        {/* KPI */}
        <Box>
          <KpiCards dashboards={kpis} />
        </Box>

        {/* ALERTES */}
        <Paper elevation={0} sx={{ ...surfaceCardSx, p: 2.5}}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <AlertTriangle size={18} color={theme.palette.error.main} />
            <Typography sx={{ fontWeight: 900, color: "text.primary" }}>Alertes</Typography>
          </Box>

          <Stack spacing={1}>
            {alerts.map((a, index) => (
              <Box
                key={index}
                sx={{
                  borderRadius: 2,
                  px: 1.5,
                  py: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: alpha(theme.palette.background.paper, 0.55),
                }}
              >
                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                  {a}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>

      {/* CONTENU PRINCIPAL */}
      <Stack spacing={2}>
        {/* Dernières notes */}
        <Paper elevation={0} sx={{ ...surfaceCardSx, p: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Typography sx={{ fontSize: 18, fontWeight: 900, color: "text.primary" }}>
              Dernières notes
            </Typography>
          </Box>

          <Box sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 720 }}>
              <TableHead>
                <TableRow>
                  {["Matière", "Note", "Coef", "Date", "Statut"].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        fontWeight: 900,
                        color: "text.secondary",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        whiteSpace: "nowrap",
                      }}
                      align={h === "Matière" ? "left" : "center"}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {recentGrades.map((g) => {
                  const ok = g.status === "Validé";
                  return (
                    <TableRow
                      key={g.id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <TableCell sx={{ color: "text.primary", borderColor: "divider" }}>
                        {g.subject}
                      </TableCell>

                      <TableCell align="center" sx={{ color: "text.primary", fontWeight: 900, borderColor: "divider" }}>
                        {g.grade}
                      </TableCell>

                      <TableCell align="center" sx={{ color: "text.secondary", borderColor: "divider" }}>
                        {g.coef}
                      </TableCell>

                      <TableCell align="center" sx={{ color: "text.secondary", borderColor: "divider" }}>
                        {g.date}
                      </TableCell>

                      <TableCell align="center" sx={{ borderColor: "divider" }}>
                        <Chip
                          size="small"
                          label={g.status}
                          variant="outlined"
                          sx={{
                            fontWeight: 900,
                            color: ok ? "success.main" : "error.main",
                            borderColor: alpha(ok ? theme.palette.success.main : theme.palette.error.main, 0.35),
                            backgroundColor: alpha(ok ? theme.palette.success.main : theme.palette.error.main, 0.10),
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Paper>

        {/* Actions rapides */}
        <Paper elevation={0} sx={{ ...surfaceCardSx, p: 2.5 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 900, color: "text.primary", mb: 1.5 }}>
            Actions rapides
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)" },
              gap: 1.5,
            }}
          >
            <ActionButton
              icon={<BookOpen size={18} />}
              label="Mes notes"
              onClick={() => navigate("/grades")}
            />
            <ActionButton
              icon={<UserCheck size={18} />}
              label="Mon profil"
              onClick={() => navigate("/profile")}
            />
            <ActionButton
              icon={<CalendarDays size={18} />}
              label="Inscriptions"
              onClick={() => navigate("/enrollments")}
            />
          </Box>
        </Paper>
      </Stack>
    </Box>
  );
}
