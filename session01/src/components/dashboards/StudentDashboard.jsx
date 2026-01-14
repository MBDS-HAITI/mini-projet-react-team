// src/components/dashboards/StudentDashboard.jsx
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
import { useAuth } from "../../auth/AuthProvider";
import { getMyDashboardGrades } from "../../api/routes/statistic-student.api.js";


import {
  GraduationCap,
  BookOpen,
  AlertTriangle,
  CalendarDays,
  UserCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import SimpleCalendar from "../Calendar/SimpleCalendar.jsx";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  // --- Data states depuis backend ---
  const [stats, setStats] = useState({
    validatedCount: 0,
    totalSubjects: 0,
    failuresCount: 0,
  });
  const [recentGrades, setRecentGrades] = useState([]);
  const [alerts, setAlerts] = useState([]);



  const surfaceCardSx = useMemo(
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
  const student = useMemo(
    () => ({
      name: user?.student ? `${user.student.firstName} ${user.student.lastName}` : "-",
      matricule: user?.student?.studentCode ?? "-",
      status: "Actif",
    }),
    [user]
  );


  // Load dashboard data
  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const data = await getMyDashboardGrades(); // ✅ GET /grades/me/dashboard
        if (cancelled) return;

        setStats(
          data?.stats ?? { validatedCount: 0, totalSubjects: 0, failuresCount: 0 }
        );
        setRecentGrades(Array.isArray(data?.recentGrades) ? data.recentGrades : []);
        setAlerts(Array.isArray(data?.alerts) ? data.alerts : []);
      } catch (e) {
        console.error("getMyDashboardGrades error:", e);
        if (!cancelled) {
          setStats({ validatedCount: 0, totalSubjects: 0, failuresCount: 0 });
          setRecentGrades([]);
          setAlerts([]);
        }
      }
    }

    if (user?.student) loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // KPI (réel)
  const kpis = useMemo(
    () => [
      {
        key: "validated",
        title: "Matières",
        value: stats.totalSubjects
          ? `${stats.validatedCount}/${stats.totalSubjects}`
          : "0/0",
        subtitle: "Validées",
        icon: <BookOpen />,
        valueColor: "secondary.main",
      },
      {
        key: "failures",
        title: "Échecs",
        value: stats.failuresCount ?? 0,
        subtitle: "Matière(s)",
        icon: <AlertTriangle />,
        valueColor: "error.main",
      },
    ],
    [stats]
  );

  // // ALERTES PERSONNELLES
  // const alerts = ["⚠️ 1 matière en échec (Physique)", "📅 Semestre bientôt clôturé"];

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
        {/* ===== GAUCHE ===== */}
        <Stack spacing={2}>
          <KpiCards dashboards={kpis} />
\
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

        {/* ===== DROITE ===== */}
        <Stack spacing={2}>
          {/* Calendrier */}
          <Paper elevation={0} sx={{ ...surfaceCardSx, p: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <CalendarDays size={18} color={theme.palette.secondary.main} />
              <Typography sx={{ fontWeight: 900, color: "text.primary" }}>Calendrier</Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <SimpleCalendar />
            </Box>
          </Paper>

          {/* Alertes */}
          <Paper elevation={0} sx={{ ...surfaceCardSx, p: 2.5 }}>
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
                    • {a}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Stack>
      </Box>

    </Box>
  );
}
