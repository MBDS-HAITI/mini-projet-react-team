// src/pages/about/About.jsx
import { useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

/* =========================
   MINI COMPONENTS
========================= */

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
      }}
    >
      <Typography variant="overline" sx={{ fontWeight: 800, color: "text.secondary" }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: 20, fontWeight: 900, color: "text.primary" }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
        {hint}
      </Typography>
    </Paper>
  );
}

function SectionCard({ title, desc }) {
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
      }}
    >
      <Typography sx={{ fontWeight: 900, color: "text.primary", mb: 0.5 }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: 14, color: "text.secondary", lineHeight: 1.6 }}>
        {desc}
      </Typography>
    </Paper>
  );
}

/* =========================
   PAGE
========================= */

export default function AboutPage() {
  const theme = useTheme();

  const stack = useMemo(
    () => [
      { name: "React + Vite", desc: "Application SPA rapide et modulaire" },
      { name: "MUI", desc: "Design system, thème light/dark, accessibilité" },
      { name: "MUI DataGrid", desc: "Tables avancées avec tri et pagination" },
      { name: "Express.js", desc: "API REST structurée (routes / controllers)" },
      { name: "MongoDB", desc: "Base NoSQL cloud avec Mongoose" },
      { name: "CI/CD", desc: "GitHub Actions → VPS Hostinger" },
    ],
    []
  );

  return (
    <Box component="section" sx={{ px: 2, py: { xs: 6, md: 10 } }}>
      <Paper
        elevation={0}
        sx={{
          mx: "auto",
          maxWidth: 1100,
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: alpha(theme.palette.background.paper, 0.75),
          backdropFilter: "blur(14px)",
        }}
      >
        {/* ================= HEADER ================= */}
        <Box sx={{ px: { xs: 3, md: 5 }, py: { xs: 5, md: 6 }, position: "relative" }}>
          <Typography sx={{ fontSize: 12, fontWeight: 900, letterSpacing: 2, color: "text.secondary" }}>
            À PROPOS
          </Typography>

          <Typography
            sx={{
              mt: 1,
              fontSize: { xs: 28, md: 40 },
              fontWeight: 900,
              color: "text.primary",
            }}
          >
            Student Management{" "}
            <Box
              component="span"
              sx={{
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              • React App
            </Box>
          </Typography>

          <Typography sx={{ mt: 2, maxWidth: 720, color: "text.secondary" }}>
            Mini-projet académique (M2 MBDS) visant à concevoir une application
            complète de gestion académique, en respectant les bonnes pratiques
            modernes du développement web.
          </Typography>

          {/* Stats */}
          <Box sx={{ mt: 4, display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" } }}>
            <StatCardMini title="Objectif" value="Simplicité" hint="Interface claire et lisible" />
            <StatCardMini title="Sécurité" value="JWT + Refresh" hint="Tokens sécurisés" />
            <StatCardMini title="Architecture" value="Full-stack" hint="React + API REST" />
          </Box>
        </Box>

        {/* ================= CONTENT ================= */}
        <Box sx={{ px: { xs: 3, md: 5 }, py: { xs: 5, md: 6 }, borderTop: "1px solid", borderColor: "divider" }}>
          {/* Vision */}
          <SectionCard
            title="Vision & objectifs"
            desc="L’application vise à centraliser la gestion des étudiants, cours, inscriptions et notes, tout en assurant rapidité, traçabilité des données et respect des bonnes pratiques."
          />

          {/* Features */}
          <Box sx={{ mt: 4, display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
            <SectionCard title="Gestion académique" desc="CRUD complet sur étudiants, cours, inscriptions, semestres, années et notes." />
            <SectionCard title="Rôles & permissions" desc="ADMIN, SCOLARITÉ et ÉTUDIANT avec accès différencié aux données." />
            <SectionCard title="Authentification" desc="Access token en mémoire, refresh token en cookie httpOnly, OAuth Google." />
            <SectionCard title="UI moderne" desc="Design glass, thème light/dark, responsive mobile-first." />
          </Box>

          {/* Stack */}
          <Box sx={{ mt: 6 }}>
            <Typography sx={{ fontSize: 20, fontWeight: 900, color: "text.primary" }}>
              Stack technique
            </Typography>

            <Box sx={{ mt: 2, display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
              {stack.map((s) => (
                <Paper
                  key={s.name}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    backgroundColor: alpha(theme.palette.background.paper, 0.7),
                  }}
                >
                  <Typography sx={{ fontWeight: 900 }}>{s.name}</Typography>
                  <Typography sx={{ fontSize: 14, color: "text.secondary" }}>{s.desc}</Typography>
                </Paper>
              ))}
            </Box>
          </Box>

          {/* Footer */}
          <Paper
            elevation={0}
            sx={{
              mt: 6,
              p: 2.5,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 900 }}>Équipe</Typography>
              <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                REACT-TEAM — Stanley Lafleur, Mackey Charles, Dawens H. Pierre, Sachy E. Barreau
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label="React" variant="outlined" />
              <Chip label="MUI" variant="outlined" />
              <Chip label="MongoDB" variant="outlined" />
              <Chip label="Express" variant="outlined" />
            </Stack>
          </Paper>
        </Box>
      </Paper>
    </Box>
  );
}
