// src/components/ActionButton.jsx
import * as React from "react";
import { Paper, Typography, Box, alpha, useTheme } from "@mui/material";

export function ActionButton({ icon, label, onClick }) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
      sx={{
        cursor: "pointer",
        borderRadius: 3,
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: "blur(12px)",
        boxShadow: theme.shadows[2],
        transition: "all 0.25s ease",
        display: "flex",
        alignItems: "center",
        gap: 1.5,

        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: theme.shadows[10],
          borderColor: "secondary.main",
        },

        "&:active": {
          transform: "translateY(-1px)",
        },

        "&:focus-visible": {
          outline: "none",
          boxShadow: `${theme.shadows[10]}, 0 0 0 3px ${alpha(
            theme.palette.primary.main,
            0.35
          )}`,
        },
      }}
    >
      <Box
        sx={{
          height: 38,
          width: 38,
          borderRadius: 2,
          display: "grid",
          placeItems: "center",
          backgroundColor: alpha(theme.palette.secondary.main, 0.12),
          color: "secondary.main",
          flex: "0 0 auto",
        }}
      >
        {icon}
      </Box>

      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 800,
          color: "text.primary",
          lineHeight: 1.1,
        }}
      >
        {label}
      </Typography>
    </Paper>
  );
}
