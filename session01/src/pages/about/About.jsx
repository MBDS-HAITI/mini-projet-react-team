// src/pages/about/About.jsx
import { useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";



function StatCardMini({ title, value, hint }) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: "blur(12px)",
        boxShadow: theme.shadows[2],
      }}
    >
      <Typography variant="overline" sx={{ fontWeight: 800, color: "text.secondary" }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: 20, fontWeight: 900, color: "text.primary", lineHeight: 1.15 }}>
        {value}
      </Typography>
      <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
        {hint}
      </Typography>
    </Paper>
  );
}

function FeatureCard({ title, desc }) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        p: 2.5,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: "blur(12px)",
        boxShadow: theme.shadows[2],
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: theme.shadows[10],
          borderColor: "secondary.main",
        },
      }}
    >
      <Typography sx={{ fontWeight: 900, color: "text.primary", mb: 0.5 }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
        {desc}
      </Typography>
    </Paper>
  );
}

export default function AboutPage() {
  const theme = useTheme();

  const stack = useMemo(
    () => [
      { name: "React", desc: "UI moderne & composants réutilisables" },
      { name: "Vite", desc: "Dev server rapide + build optimisé" },
      { name: "MUI", desc: "UI system + thème light/dark" },
      { name: "MUI DataGrid", desc: "Tables, pagination, tri, sélection" },
      { name: "Node/Express", desc: "API REST pour gérer les données" },
      { name: "MongoDB", desc: "Base NoSQL pour étudiants, notes, matières" },
    ],
    []
  );

  return (
    <Box component="section" sx={{ width: "100%", px: 2, py: { xs: 6, md: 10 } }}>
      {/* Card principale */}
      <Paper
        elevation={0}
        sx={{
          mx: "auto",
          maxWidth: 1100,
          overflow: "hidden",
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: alpha(theme.palette.background.paper, 0.72),
          backdropFilter: "blur(14px)",
          boxShadow: theme.palette.effects?.containerShadow ?? theme.shadows[8],
        }}
      >
        {/* Header */}
        <Box sx={{ position: "relative", px: { xs: 3, md: 5 }, py: { xs: 5, md: 6 } }}>
          {/* glows */}
          <Box
            sx={{
              pointerEvents: "none",
              position: "absolute",
              top: -96,
              right: 40,
              height: 220,
              width: 220,
              borderRadius: "50%",
              backgroundColor: alpha(theme.palette.secondary.main, 0.22),
              filter: "blur(48px)",
            }}
          />
          <Box
            sx={{
              pointerEvents: "none",
              position: "absolute",
              bottom: -96,
              left: 40,
              height: 220,
              width: 220,
              borderRadius: "50%",
              backgroundColor: alpha(theme.palette.primary.main, 0.18),
              filter: "blur(48px)",
            }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              alignItems: { md: "flex-end" },
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 900, letterSpacing: 2, color: "text.secondary" }}>
                À PROPOS
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  fontSize: { xs: 30, md: 40 },
                  fontWeight: 900,
                  color: "text.primary",
                  lineHeight: 1.1,
                }}
              >
                Student Management{" "}
                <Box
                  component="span"
                  sx={{
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  • React App
                </Box>
              </Typography>

              <Typography sx={{ mt: 2, maxWidth: 720, fontSize: 14, color: "text.secondary", lineHeight: 1.7 }}>
                Une application d’apprentissage pour gérer{" "}
                <Box component="span" sx={{ color: "text.primary", fontWeight: 800 }}>
                  étudiants
                </Box>
                ,{" "}
                <Box component="span" sx={{ color: "text.primary", fontWeight: 800 }}>
                  matières
                </Box>{" "}
                et{" "}
                <Box component="span" sx={{ color: "text.primary", fontWeight: 800 }}>
                  notes
                </Box>
                , avec une interface claire, rapide et agréable.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap" }}>
              <Button
                href="#features"
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 800,
                  borderColor: "divider",
                  color: "text.primary",
                  backgroundColor: alpha(theme.palette.background.paper, 0.6),
                  backdropFilter: "blur(12px)",
                  "&:hover": {
                    borderColor: "divider",
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                Fonctionnalités
              </Button>

              <Button
                href="#stack"
                variant="contained"
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 900,
                  color: "#fff",
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  boxShadow: "none",
                  "&:hover": {
                    opacity: 0.92,
                    boxShadow: "none",
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  },
                }}
              >
                Tech stack
              </Button>
            </Stack>
          </Box>

          {/* Stats */}
          <Box sx={{ mt: 4, display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" } }}>
            <StatCardMini title="Rapide" value="Vite" hint="Démarrage & refresh instantanés" />
            <StatCardMini title="Tables" value="MUI DataGrid" hint="Pagination, tri, sélection" />
            <StatCardMini title="API" value="REST" hint="Express + MongoDB (local/cloud)" />
          </Box>
        </Box>

        {/* Body */}
        <Box sx={{ borderTop: "1px solid", borderTopColor: "divider", px: { xs: 3, md: 5 }, py: { xs: 5, md: 6 } }}>
          {/* Features */}
          <Box id="features" sx={{ scrollMarginTop: 120 }}>
            <Typography sx={{ fontSize: 20, fontWeight: 900, color: "text.primary" }}>
              Fonctionnalités
            </Typography>
            <Typography sx={{ mt: 1, fontSize: 14, color: "text.secondary" }}>
              L’objectif : une app simple, lisible, et prête à évoluer.
            </Typography>

            <Box sx={{ mt: 3, display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
              <FeatureCard title="Gestion des notes" desc="Lister, filtrer et parcourir les notes rapidement via DataGrid." />
              <FeatureCard title="Gestion des étudiants" desc="Visualiser les étudiants avec une table responsive et claire." />
              <FeatureCard title="Gestion des matières" desc="Affichage distinct des cours/matières (sans doublons)." />
              <FeatureCard title="Architecture propre" desc="Composants réutilisables + pages lisibles + séparation UI/API." />
            </Box>
          </Box>

          {/* Stack */}
          <Box id="stack" sx={{ mt: 6, scrollMarginTop: 120 }}>
            <Typography sx={{ fontSize: 20, fontWeight: 900, color: "text.primary" }}>
              Tech stack
            </Typography>
            <Typography sx={{ mt: 1, fontSize: 14, color: "text.secondary" }}>
              Les outils utilisés pour construire l’application.
            </Typography>

            <Box sx={{ mt: 3, display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
              {stack.map((s) => (
                <Paper
                  key={s.name}
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    backgroundColor: alpha(theme.palette.background.paper, 0.7),
                    backdropFilter: "blur(12px)",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                      borderColor: "secondary.main",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography sx={{ fontWeight: 900, color: "text.primary" }}>{s.name}</Typography>
                    <Typography sx={{ fontSize: 12, color: "text.secondary" }}>✔</Typography>
                  </Box>
                  <Typography sx={{ mt: 0.5, fontSize: 14, color: "text.secondary" }}>{s.desc}</Typography>
                </Paper>
              ))}
            </Box>
          </Box>

          {/* Footer / Contact */}
          <Paper
            elevation={0}
            sx={{
              mt: 6,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              background: `linear-gradient(90deg, ${alpha(theme.palette.background.paper, 0.65)}, ${alpha(
                theme.palette.background.paper,
                0.25
              )})`,
              backdropFilter: "blur(12px)",
              p: 2.5,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              alignItems: { md: "center" },
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 900, color: "text.primary" }}>
                Auteur
              </Typography>
              <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2, color: "text.secondary", fontSize: 14 }}>
                <li>REACT-TEAM:</li>
                <li>Stanley LAFLEUR</li>
                <li>Mackey Charles</li>
                <li>Dawens H. PIERRE</li>
                <li>Sachy E. BARREAU</li>
              </Box>
            </Box>

            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              <Chip label="UI: MUI" variant="outlined" sx={{ borderColor: "divider", color: "text.primary" }} />
              <Chip label="Tables: DataGrid" variant="outlined" sx={{ borderColor: "divider", color: "text.primary" }} />
              <Chip label="DB: MongoDB" variant="outlined" sx={{ borderColor: "divider", color: "text.primary" }} />
              <Chip label="API: Express" variant="outlined" sx={{ borderColor: "divider", color: "text.primary" }} />
            </Stack>
          </Paper>
        </Box>
      </Paper>
    </Box>
  );
}
