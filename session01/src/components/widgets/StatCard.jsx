// src/components/widgets/StatCard.jsx
import * as React from "react";
import { Box, Paper, Typography, alpha, useTheme } from "@mui/material";

export default function StatCard({
  title,
  value = 100,
  subtitle,
  icon,
  hint,
  valueColor, // Si non défini, utilisera la couleur primaire du thème
}) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        m: 1,
        borderRadius: 3,
        overflow: "hidden",
        maxWidth: { md: 448 },
        transition: "all 0.3s ease-in-out",
        border: "1px solid",
        // Utilisation de la couleur 'divider' automatique du thème
        borderColor: "divider", 
        // Utilisation de 'background.paper' avec une légère opacité pour l'effet verre
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: "blur(12px)",
        boxShadow: theme.shadows[2],
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[10],
          borderColor: "secondary.main",
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid",
            borderColor: "divider",
            pb: 1.5,
            mb: 2,
          }}
        >
          <Typography
            variant="overline"
            sx={{
              fontWeight: 800,
              color: "text.secondary", // Couleur grise adaptative
              letterSpacing: 1.2,
            }}
          >
            {title}
          </Typography>

          {icon && (
            <Box
              sx={{
                height: 40,
                width: 40,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                color: "secondary.main",
              }}
            >
              {icon}
            </Box>
          )}
        </Box>

        {/* Value Area */}
        <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              // Utilise valueColor si fourni, sinon la couleur primaire du thème
              color: valueColor || "primary.main",
            }}
          >
            {value}
          </Typography>

          {(subtitle || hint) && (
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
              {hint && (
                <Typography variant="caption" sx={{ color: "success.main", fontWeight: "bold" }}>
                  {hint}
                </Typography>
              )}
            </Box>
          )}
        </Box>

        {/* Progress bar décorative */}
        <Box sx={{ mt: 3, display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              height: 4,
              flexGrow: 1,
              borderRadius: 1,
              bgcolor: "action.hover", // Couleur neutre automatique
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: "45%",
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              }}
            />
          </Box>
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: 9 }}>
            STATS
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}