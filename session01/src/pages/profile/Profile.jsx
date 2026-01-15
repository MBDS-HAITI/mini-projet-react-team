// src/pages/profile/ProfilePage.jsx
import * as React from "react";
import { useMemo } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { formatDate } from "../../utils/fdate";
import { API_BASE_URL } from "../../config/env";

import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Chip,
  Divider,
  Skeleton,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

function SurfaceCard({ sx, children }) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: "blur(12px)",
        boxShadow: theme.shadows[2],
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
}

function InfoTile({ label, value, valueColor }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: alpha(theme.palette.background.paper, 0.55),
        p: 1.5,
      }}
    >
      <Typography sx={{ fontSize: 12, fontWeight: 800, color: "text.secondary" }}>
        {label}
      </Typography>
      <Typography
        sx={{
          mt: 0.5,
          fontSize: 14,
          fontWeight: 900,
          color: valueColor || "text.primary",
          lineHeight: 1.2,
          wordBreak: "break-word",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function ProfilePage() {
  const theme = useTheme();
  const { user, loading } = useAuth();

  const pageShellSx = {
    px: { xs: 2, md: 4 },
    py: { xs: 3, md: 4 },
  };

  const mainCardSx = {
    mx: "auto",
    maxWidth: 1100,
    p: { xs: 2.5, md: 3 },
    boxShadow: theme.palette.effects?.containerShadow ?? theme.shadows[10],
  };

  const meta = useMemo(() => {
    if (!user) return null;

    const providerNames = user.providers?.length
      ? user.providers.map((p) => p.provider || p.name || p).join(", ")
      : "Aucun";

    const hasGoogle = (user.providers || []).some((p) => p?.type === "google");

    return {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive ? "Actif" : "Inactif",
      mailVerified: user.mailVerified ? "Vérifié" : "Non vérifié",
      lastLoginAt: user.lastLoginAt ? formatDate(user.lastLoginAt) : "Jamais",
      createdAt: user.createdAt ? formatDate(user.createdAt) : "-",
      updatedAt: user.updatedAt ? formatDate(user.updatedAt) : "-",
      providers: providerNames,
      hasGoogle,
    };
  }, [user]);

  // Actions (tu peux brancher tes vraies fonctions)
  const handleEditEmail = () => console.log("Edit email (autorisé)");
  const handleToggleActive = () => console.log("Toggle active (admin?)");
  const handleVerifyEmail = () => console.log("Send verify email");
  const handleResetPassword = () => console.log("Reset password");
  const handleLinkGoogle = () => {
    window.location.href = `${API_BASE_URL}/oauths/google/link`;
  };
  const handleUnlinkGoogle = () => console.log("Unlink Google provider");

  if (loading) {
    return (
      <Box sx={pageShellSx}>
        <SurfaceCard sx={mainCardSx}>
          <Stack spacing={2}>
            <Box>
              <Skeleton variant="text" width={220} height={34} />
              <Skeleton variant="text" width={420} height={20} />
            </Box>
            <Skeleton variant="rounded" height={220} />
            <Skeleton variant="rounded" height={160} />
          </Stack>
        </SurfaceCard>
      </Box>
    );
  }

  if (!user || !meta) {
    return (
      <Box sx={pageShellSx}>
        <SurfaceCard sx={mainCardSx}>
          <Typography sx={{ fontSize: 26, fontWeight: 900, color: "text.primary" }}>
            Profil
          </Typography>
          <Typography sx={{ mt: 1, color: "text.secondary" }}>
            Aucun utilisateur connecté.
          </Typography>
        </SurfaceCard>
      </Box>
    );
  }

  const initial = (meta.username?.[0] || meta.email?.[0] || "U").toUpperCase();

  return (
    <Box sx={pageShellSx}>
      <SurfaceCard sx={mainCardSx}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { md: "center" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: { xs: 24, md: 30 }, fontWeight: 950, color: "text.primary" }}>
              Mon profil
            </Typography>
            <Typography sx={{ mt: 0.5, fontSize: 14, color: "text.secondary" }}>
              Gérez vos informations et vos méthodes de connexion.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            <Button
              onClick={handleResetPassword}
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 900,
                borderColor: "divider",
                color: "text.primary",
                backgroundColor: alpha(theme.palette.background.paper, 0.55),
                backdropFilter: "blur(12px)",
                "&:hover": { backgroundColor: theme.palette.action.hover, borderColor: "divider" },
              }}
            >
              Changer mot de passe
            </Button>

            <Button
              onClick={handleVerifyEmail}
              variant="contained"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 950,
                color: "#fff",
                boxShadow: "none",
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                "&:hover": {
                  opacity: 0.92,
                  boxShadow: "none",
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                },
              }}
            >
              Vérifier email
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 2.5, borderColor: "divider" }} />

        {/* Content */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 2fr" },
            gap: 2,
            alignItems: "start",
          }}
        >
          {/* Left column */}
          <Stack spacing={2}>
            {/* Identity */}
            <SurfaceCard sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    height: 48,
                    width: 48,
                    borderRadius: 2.5,
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 950,
                    color: "#fff",
                    border: "1px solid",
                    borderColor: alpha(theme.palette.common.white, 0.18),
                    background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.75)}, ${alpha(
                      theme.palette.secondary.main,
                      0.75
                    )})`,
                  }}
                >
                  {initial}
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 950, color: "text.primary" }} noWrap>
                    {meta.username}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }} noWrap>
                    {meta.email}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  mt: 2,
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 1.2,
                }}
              >
                <InfoTile label="Rôle" value={meta.role} />
                <InfoTile
                  label="Statut"
                  value={meta.isActive}
                  valueColor={meta.isActive === "Actif" ? "success.main" : "text.primary"}
                />
                <InfoTile
                  label="Email"
                  value={meta.mailVerified}
                  valueColor={meta.mailVerified === "Vérifié" ? "success.main" : "warning.main"}
                />
                <InfoTile label="Dernière connexion" value={meta.lastLoginAt} />
              </Box>

              <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
                <Button
                  onClick={handleEditEmail}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 900,
                    borderColor: "divider",
                    color: "text.primary",
                    backgroundColor: alpha(theme.palette.background.paper, 0.55),
                    backdropFilter: "blur(12px)",
                    "&:hover": { backgroundColor: theme.palette.action.hover, borderColor: "divider" },
                  }}
                >
                  Modifier email
                </Button>
              </Stack>
            </SurfaceCard>

            {/* Audit */}
            <SurfaceCard sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 950, color: "text.primary" }}>
                Informations
              </Typography>

              <Stack spacing={1.2} sx={{ mt: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }}>Créé le</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 800, color: "text.primary" }}>
                    {meta.createdAt}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }}>Modifié le</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 800, color: "text.primary" }}>
                    {meta.updatedAt}
                  </Typography>
                </Box>
              </Stack>
            </SurfaceCard>
          </Stack>

          {/* Right column */}
          <Stack spacing={2}>
            {/* Providers */}
            <SurfaceCard sx={{ p: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: { md: "flex-start" },
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: 18, fontWeight: 950, color: "text.primary" }}>
                    Méthodes de connexion
                  </Typography>
                  <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
                    Ajoutez Google pour vous connecter plus facilement.
                  </Typography>
                </Box>

                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                  Providers: <Box component="span" sx={{ color: "text.primary", fontWeight: 900 }}>{meta.providers}</Box>
                </Typography>
              </Box>

              <Box
                sx={{
                  mt: 2,
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 1.5,
                }}
              >
                {/* Google */}
                <SurfaceCard sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 950, color: "text.primary" }}>Google</Typography>
                      <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                        {meta.hasGoogle ? "Connecté" : "Non connecté"}
                      </Typography>
                    </Box>

                    <Chip
                      size="small"
                      label={meta.hasGoogle ? "Actif" : "Inactif"}
                      variant="outlined"
                      sx={{
                        fontWeight: 950,
                        color: meta.hasGoogle ? "success.main" : "text.secondary",
                        borderColor: meta.hasGoogle
                          ? alpha(theme.palette.success.main, 0.35)
                          : "divider",
                        backgroundColor: meta.hasGoogle
                          ? alpha(theme.palette.success.main, 0.10)
                          : alpha(theme.palette.background.paper, 0.25),
                      }}
                    />
                  </Box>

                  <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
                    {!meta.hasGoogle ? (
                      <Button
                        onClick={handleLinkGoogle}
                        variant="contained"
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 950,
                          color: "#fff",
                          boxShadow: "none",
                          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          "&:hover": {
                            opacity: 0.92,
                            boxShadow: "none",
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          },
                        }}
                      >
                        + Ajouter Google
                      </Button>
                    ) : (
                      <Button
                        onClick={handleUnlinkGoogle}
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 900,
                          borderColor: "divider",
                          color: "text.primary",
                          backgroundColor: alpha(theme.palette.background.paper, 0.55),
                          backdropFilter: "blur(12px)",
                          "&:hover": { backgroundColor: theme.palette.action.hover, borderColor: "divider" },
                        }}
                      >
                        Retirer Google
                      </Button>
                    )}
                  </Stack>

                  <Typography sx={{ mt: 1.5, fontSize: 12, color: "text.secondary" }}>
                    Clique sur “Ajouter Google” pour lier ton compte via OAuth (redirection backend).
                  </Typography>
                </SurfaceCard>

                {/* Email / password */}
                <SurfaceCard sx={{ p: 2 }}>
                  <Typography sx={{ fontWeight: 950, color: "text.primary" }}>
                    Email & mot de passe
                  </Typography>
                  <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
                    Gérez votre mot de passe et la vérification email.
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
                    <Button
                      onClick={handleResetPassword}
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 900,
                        borderColor: "divider",
                        color: "text.primary",
                        backgroundColor: alpha(theme.palette.background.paper, 0.55),
                        backdropFilter: "blur(12px)",
                        "&:hover": { backgroundColor: theme.palette.action.hover, borderColor: "divider" },
                      }}
                    >
                      Changer mot de passe
                    </Button>

                    <Button
                      onClick={handleVerifyEmail}
                      variant="contained"
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 950,
                        color: "#fff",
                        boxShadow: "none",
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        "&:hover": {
                          opacity: 0.92,
                          boxShadow: "none",
                          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        },
                      }}
                    >
                      Vérifier email
                    </Button>
                  </Stack>

                  <Typography sx={{ mt: 1.5, fontSize: 12, color: "text.secondary" }}>
                    Une fois l’email vérifié, tu peux renforcer la sécurité et récupérer ton compte plus facilement.
                  </Typography>
                </SurfaceCard>
              </Box>
            </SurfaceCard>

            {/* Editable fields */}
            <SurfaceCard sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 18, fontWeight: 950, color: "text.primary" }}>
                Modifier le profil
              </Typography>
              <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
                Actions autorisées (selon ton backend : username non modifiable).
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 1.5,
                }}
              >
                <SurfaceCard sx={{ p: 2 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 800, color: "text.secondary" }}>
                    Email
                  </Typography>
                  <Typography sx={{ mt: 0.5, fontWeight: 950, color: "text.primary" }}>
                    {meta.email}
                  </Typography>

                  <Button
                    onClick={handleEditEmail}
                    variant="outlined"
                    sx={{
                      mt: 1.5,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 900,
                      borderColor: "divider",
                      color: "text.primary",
                      backgroundColor: alpha(theme.palette.background.paper, 0.55),
                      backdropFilter: "blur(12px)",
                      "&:hover": { backgroundColor: theme.palette.action.hover, borderColor: "divider" },
                    }}
                  >
                    Modifier email
                  </Button>
                </SurfaceCard>

                <SurfaceCard sx={{ p: 2 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 800, color: "text.secondary" }}>
                    Compte
                  </Typography>

                  <Typography sx={{ mt: 0.8, fontSize: 13, color: "text.secondary" }}>
                    Username:{" "}
                    <Box component="span" sx={{ color: "text.primary", fontWeight: 950 }}>
                      {meta.username}
                    </Box>{" "}
                    (non modifiable)
                  </Typography>

                  <Typography sx={{ mt: 0.8, fontSize: 13, color: "text.secondary" }}>
                    Statut:{" "}
                    <Box component="span" sx={{ color: "text.primary", fontWeight: 950 }}>
                      {meta.isActive}
                    </Box>
                  </Typography>

                  {meta.role === "ADMIN" ? (
                    <Button
                      onClick={handleToggleActive}
                      variant="outlined"
                      sx={{
                        mt: 1.5,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 900,
                        borderColor: "divider",
                        color: "text.primary",
                        backgroundColor: alpha(theme.palette.background.paper, 0.55),
                        backdropFilter: "blur(12px)",
                        "&:hover": { backgroundColor: theme.palette.action.hover, borderColor: "divider" },
                      }}
                    >
                      Activer/Désactiver
                    </Button>
                  ) : (
                    <Typography sx={{ mt: 1.6, fontSize: 12, color: "text.secondary" }}>
                      Seul un admin peut activer/désactiver un compte.
                    </Typography>
                  )}
                </SurfaceCard>
              </Box>
            </SurfaceCard>
          </Stack>
        </Box>
      </SurfaceCard>
    </Box>
  );
}
