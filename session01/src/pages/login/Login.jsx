// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Loading from "../../components/common/Loading";
import { useAuth } from "../../auth/AuthProvider";
import { API_BASE_URL } from "../../config/env";
import ThemeModeToggle from "../../components/ThemeModeToggle";
import {KeyRound} from "lucide-react"

import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Stack,
  TextField,
  Divider,
  Alert,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

export default function LoginPage() {
  const theme = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/home";

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      window.location.href = `${API_BASE_URL}/oauths/google/login`;
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Erreur de connexion Google");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Loading
        fullScreen
        title="Connexion sécurisée"
        subtitle="Vérification de vos identifiants…"
      />
    );
  }

  const glassBg =
    theme.palette.background.paperGlass ?? alpha(theme.palette.background.paper, 0.75);

  const accentGradient =
    theme.palette.gradients?.accent ??
    `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`;

  const containerShadow =
    theme.palette.effects?.containerShadow ?? theme.shadows[12];

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 6,
        bgcolor: "background.default",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 980, position: "relative" }}>
        {/* glow blobs */}
        <Box
          sx={{
            position: "absolute",
            top: -56,
            left: -40,
            width: 300,
            height: 300,
            borderRadius: "50%",
            bgcolor: alpha(theme.palette.primary.main, 0.22),
            filter: "blur(48px)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -64,
            right: -48,
            width: 300,
            height: 300,
            borderRadius: "50%",
            bgcolor: alpha(theme.palette.secondary.main, 0.18),
            filter: "blur(48px)",
            pointerEvents: "none",
          }}
        />

        {/* card */}
        <Paper
          elevation={0}
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: glassBg,
            backdropFilter: "blur(14px)",
            boxShadow: containerShadow,
          }}
        >
          <Box sx={{ p: { xs: 3, sm: 5 } }}>
            {/* header row */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 3,
                alignItems: { sm: "flex-start" },
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 900,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: "text.secondary",
                  }}
                >
                  Espace sécurisé
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    fontSize: { xs: 28, sm: 38 },
                    fontWeight: 900,
                    color: "text.primary",
                    lineHeight: 1.1,
                  }}
                >
                  Connexion{" "}
                  <Box
                    component="span"
                    sx={{
                      background: accentGradient,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    Student Management
                  </Box>
                </Typography>

                <Typography sx={{ mt: 1.5, color: "text.secondary", maxWidth: 680, lineHeight: 1.7 }}>
                  Connecte-toi pour accéder à la gestion des étudiants, matières et notes.
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
                  <Chip
                    label="Auth: JWT + Refresh"
                    variant="outlined"
                    sx={{ borderColor: "divider", color: "text.primary", fontWeight: 800 }}
                  />
                  <Chip
                    label="UI: Glass + Gradient + Tailwind"
                    variant="outlined"
                    sx={{ borderColor: "divider", color: "text.primary", fontWeight: 800 }}
                  />
                </Stack>
              </Box>

              {/* icon bubble */}
              <Box sx={{ flexShrink: 0 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    border: "0px solid",
                    borderColor: "divider",
                    backgroundColor: alpha(theme.palette.background.paper, 0.6),
                    display: "flex",
                    placeItems: "center",
                  }}
                >
                  
                  <Typography sx={{ fontSize: 22 }}><ThemeModeToggle/></Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3, borderColor: "divider" }} />

            {/* Error */}
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: alpha(theme.palette.error.main, 0.35),
                  backgroundColor: alpha(theme.palette.error.main, 0.10),
                }}
              >
                {error}
              </Alert>
            )}

            {/* Google button */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Button
                type="button"
                onClick={handleGoogleLogin}
                variant="outlined"
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  borderRadius: 2,
                  px: 2.5,
                  py: 1,
                  textTransform: "none",
                  fontWeight: 900,
                  borderColor: "divider",
                  color: "text.primary",
                  backgroundColor: alpha(theme.palette.background.paper, 0.55),
                  backdropFilter: "blur(12px)",
                  "&:hover": {
                    borderColor: "divider",
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
                startIcon={
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: 1.5,
                      bgcolor: theme.palette.common.white,
                      display: "grid",
                      placeItems: "center",
                      overflow: "hidden",
                    }}
                  >
                    <img src="/google-logo.png" alt="Google" style={{ width: 18, height: 18 }} />
                  </Box>
                }
              >
                Se connecter avec Google
              </Button>

              <Typography sx={{ mt: 1.5, color: "text.secondary" }}>
                Ou utilise tes identifiants ci-dessous.
              </Typography>
            </Box>

            {/* Form */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                mt: 2,
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <TextField
                name="username"
                label="Nom d’utilisateur"
                placeholder="ex: stanley"
                required
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                fullWidth
                InputLabelProps={{ sx: { color: "text.secondary" } }}
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: 2.5,
                    backgroundColor: alpha(theme.palette.background.paper, 0.45),
                    backdropFilter: "blur(12px)",
                  },
                }}
              />

              <TextField
                name="password"
                type="password"
                label="Mot de passe"
                placeholder="••••••••"
                required
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                fullWidth
                InputLabelProps={{ sx: { color: "text.secondary" } }}
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: 2.5,
                    backgroundColor: alpha(theme.palette.background.paper, 0.45),
                    backdropFilter: "blur(12px)",
                  },
                }}
              />

              {/* helper */}
              <Box sx={{ gridColumn: { sm: "1 / -1" } }}>
                <Typography sx={{ color: theme.palette.text.muted ?? "text.secondary" }}>
                  Astuce: utilise ton compte{" "}
                  <Box component="span" sx={{ color: "text.primary", fontWeight: 900 }}>
                    admin
                  </Box>{" "}
                  pour tester.
                </Typography>
              </Box>

              {/* actions */}
              <Box
                sx={{
                  gridColumn: { sm: "1 / -1" },
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 1.5,
                  alignItems: { sm: "center" },
                  justifyContent: { sm: "flex-end" },
                  mt: 0.5,
                }}
              >
                <Button
                  type="button"
                  onClick={() => navigate(-1)}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 900,
                    borderColor: "divider",
                    color: "text.primary",
                    backgroundColor: alpha(theme.palette.background.paper, 0.45),
                    "&:hover": {
                      borderColor: "divider",
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  ← Retour
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 900,
                    color: "#fff",
                    px: 2.5,
                    background: accentGradient,
                    boxShadow: "none",
                    display: "flex",
                    gap:1,
                    "&:hover": {
                      opacity: 0.92,
                      boxShadow: "none",
                      background: accentGradient,
                    },
                  }}
                >
                  <KeyRound/> Se connecter
                </Button>
              </Box>
            </Box>
          </Box>

          {/* bottom gradient line */}
          <Box sx={{ height: 4, background: accentGradient, opacity: 0.75 }} />
        </Paper>
      </Box>
    </Box>
  );
}
