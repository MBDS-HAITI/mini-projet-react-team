// src/components/widgets/StatCard.jsx
import React from "react";
import { Box, Paper, Typography, alpha, useTheme } from "@mui/material";

export default function StatCard({
  title,
  value = 0,
  subtitle,
  icon,
  hint,
  valueColor,
}) {
  const theme = useTheme();
  const Icon = icon; // 👈 clé du fix

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        borderRadius: 3,
        overflow: "hidden",
        transition: "all 0.3s ease-in-out",
        border: "1px solid",
        borderColor: "divider",
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
        {/* ================= HEADER ================= */}
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
              color: "text.secondary",
              letterSpacing: 1.2,
            }}
          >
            {title}
          </Typography>

          {/* ===== ICÔNE (FIX DÉFINITIF) ===== */}
          {Icon && (
            <Box
              sx={{
                height: 40,
                width: 40,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                backgroundColor: alpha(theme.palette.secondary.main, 0.12),
                color: "secondary.main",
              }}
            >
              <Icon size={22} strokeWidth={2} />
            </Box>
          )}
        </Box>

        {/* ================= VALUE ================= */}
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              color: valueColor || "primary.main",
            }}
          >
            {value}
          </Typography>

          {(subtitle || hint) && (
            <Box sx={{ textAlign: "right" }}>
              {subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
              {hint && (
                <Typography
                  variant="caption"
                  sx={{ color: "success.main", fontWeight: 700 }}
                >
                  {hint}
                </Typography>
              )}
            </Box>
          )}
        </Box>

        {/* ================= PROGRESS ================= */}
        <Box sx={{ mt: 3, display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              height: 4,
              flexGrow: 1,
              borderRadius: 1,
              bgcolor: "action.hover",
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

          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ fontSize: 9 }}
          >
            STATS
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
