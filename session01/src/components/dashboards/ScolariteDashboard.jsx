// src/components/dashboards/ScolariteDashboard.jsx
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  alpha,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import DashboardHeader from "./DashboardHeader";
import KpiCards from "./KpiCards";
import { ActionButton } from "../ActionButton";
import { SummaryItem } from "../SummaryItem";
import SimpleCalendar from "../Calendar/SimpleCalendar";


import {
  GraduationCap,
  ClipboardList,
  BookOpen,
  FileText,
  AlertTriangle,
  CalendarDays,
  CheckCircle,
  Edit,
  FileWarning,
  Lock,
  Users,
} from "lucide-react";
import { useEffect } from "react";
import { fetchScolariteDashboard } from "../../api/routes/statistic-scolarite.api";
import {formatDate}  from "../../utils/fdate";

const iconMap = {
  GraduationCap,
  ClipboardList,
  BookOpen,
  FileText,
  Users,
};

export default function ScolariteDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();

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


  //  ================= States ================= 
  const [dashboards, setDashboards] = useState([]);
  const [stats, setStats] = useState({
    academicYear: "",
    semester: "",
    pendingNotes: 0,
    entryRate: "",
  });
  const [recentNotes, setRecentNotes] = useState([]);
  const [alerts, setAlerts] = useState([]);


  useEffect(() => {
    const loadDashboard = async () => {
      const data = await fetchScolariteDashboard();

      setDashboards(
        (data.kpis || []).map((kpi) => ({
          ...kpi,
          icon: iconMap[kpi.icon] || GraduationCap,
        }))
      );

      setStats(data.summary || {
        academicYear: "",
        semester: "",
        pendingNotes: 0,
        entryRate: "",
      });


      setRecentNotes(data.recentNotes || []);

      setAlerts(data.alerts || []);
    };

    loadDashboard();
  }, []);


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
      {/* ================= HEADER ================= */}
      <DashboardHeader
        title="Dashboard Scolarité"
        description="Vue globale et suivi académique"
        level="SCOLARITÉ"
      />

      {/* ================= KPI CARDS ================= */}
      <KpiCards dashboards={dashboards} />

      {/* ================= CONTENU CENTRAL ================= */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
          gap: 2,
          alignItems: "start",
        }}
      >
        {/* ======== COLONNE PRINCIPALE ======== */}
        <Stack spacing={2}>
          {/* Résumé académique */}
          <Paper elevation={0} sx={{ ...surfaceCardSx, p: 2.5 }}>
            <Typography sx={{ fontSize: 18, fontWeight: 900, color: "text.primary", mb: 1.5 }}>
              Résumé académique
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
                gap: 1.5,
                textAlign: "center",
              }}
            >
              <SummaryItem label="Année" value={stats.academicYear} />
              <SummaryItem label="Semestre" value={stats.semester} />
              <SummaryItem label="Notes en attente" value={stats.pendingNotes} color="error.main" />
              <SummaryItem label="Taux de saisie" value={stats.entryRate} color="success.main" />
            </Box>
          </Paper>

          {/* Dernières notes */}
          <Paper elevation={0} sx={{ ...surfaceCardSx, p: 2.5 }}>
            <Typography sx={{ fontSize: 18, fontWeight: 900, color: "text.primary", mb: 1.5 }}>
              Dernières notes saisies
            </Typography>

            <TableContainer sx={{ borderRadius: 2 }}>
              <Table sx={{ minWidth: 680 }}>
                <TableHead>
                  <TableRow>
                    {["Étudiant", "Matière", "Statut", "Dernière Modification"].map((h) => (
                      <TableCell
                        key={h}
                        sx={{
                          fontWeight: 900,
                          color: "text.secondary",
                          borderBottom: "1px solid",
                          borderColor: "divider",
                          whiteSpace: "nowrap",
                        }}
                        align={h === "Étudiant" ? "left" : "center"}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {recentNotes.map((n) => {
                    const pending = n.status === "En attente";
                    return (
                      <TableRow
                        key={n.id}
                        hover
                        sx={{
                          "&:hover": { backgroundColor: "action.hover" },
                          ...(pending && {
                            backgroundColor: alpha(theme.palette.warning.main, 0.08),
                          }),
                        }}
                      >
                        <TableCell sx={{ color: "text.primary", borderColor: "divider" }}>
                          {n.student}
                        </TableCell>

                        <TableCell align="center" sx={{ color: "text.secondary", borderColor: "divider" }}>
                          {n.subject}
                        </TableCell>

                        <TableCell align="center" sx={{ borderColor: "divider" }}>
                          <Chip
                            size="small"
                            label={n.status}
                            variant="outlined"
                            sx={{
                              fontWeight: 900,
                              color: pending ? "warning.main" : "success.main",
                              borderColor: alpha(
                                pending ? theme.palette.warning.main : theme.palette.success.main,
                                0.35
                              ),
                              backgroundColor: alpha(
                                pending ? theme.palette.warning.main : theme.palette.success.main,
                                0.10
                              ),
                            }}
                          />
                        </TableCell>

                        <TableCell align="center" sx={{ color: "text.secondary", borderColor: "divider" }}>
                          {formatDate(n.dateModif, true)}
                        </TableCell>

                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Actions rapides */}
          <Paper elevation={0} sx={{ ...surfaceCardSx, p: 2.5 }}>
            <Typography sx={{ fontSize: 18, fontWeight: 900, color: "text.primary", mb: 1.5 }}>
              Actions rapides
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
                gap: 1.5,
              }}
            >
                      <ActionButton
                icon={<CheckCircle size={18} />}
                label="Inscriptions"
                color="success"
                onClick={() => navigate("/enrollments")}
              />

              <ActionButton
                icon={<Edit size={18} />}
                label="Saisie des notes"
                color="primary"
                onClick={() => navigate("/grades")}
              />

              <ActionButton
                icon={<FileWarning size={18} />}
                label="Notes manquantes"
                color="warning"
                onClick={() => navigate("/grades/missing")}
              />

              <ActionButton
                icon={<Lock size={18} />}
                label="Clôture semestre"
                color="error"
                onClick={() => navigate("/semester")}
              />
            </Box>
          </Paper>
        </Stack>

        {/* ======== ASIDE DROIT ======== */}
        <Stack spacing={2}>
          {/* Calendrier */}
          <Paper elevation={0} sx={{ ...surfaceCardSx, p: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <CalendarDays size={18} color={theme.palette.secondary.main} />
              <Typography sx={{ fontWeight: 900, color: "text.primary" }}>Calendrier</Typography>
            </Box>

            {/* <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
              Examens, rattrapages et clôtures
            </Typography> */}
            <Box sx={{ mt: 2 }}>
              <SimpleCalendar />
            </Box>

          </Paper>

          {/* Alertes */}
          <Paper elevation={0} sx={{ ...surfaceCardSx, p: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <AlertTriangle size={18} color={theme.palette.error.main} />
              <Typography sx={{ fontWeight: 900, color: "text.primary" }}>Alertes</Typography>
            </Box>

            <Stack spacing={1}>
              {alerts.map((alert, i) => (
                <Box
                  key={i}
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
                    • {alert}
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
