// src/components/ActionButton.jsx
import * as React from "react";
import { Paper, Typography, Box, alpha, useTheme } from "@mui/material";

export function ActionButton({ icon, label, onClick, color = "primary",}) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        width: "100%",
        cursor: "pointer",
        borderRadius: 3, // rounded-xl
        p: 2, // p-4
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1, // gap-2 approximatif
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: "blur(12px)",
        boxShadow: theme.shadows[2],
        transition: "all 0.25s ease",
        color: "text.primary",
        textAlign: "center",

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
          color: "secondary.main", // remplace text-cyan-400, adaptatif
          display: "grid",
          placeItems: "center",
        }}
      >
        {icon}
      </Box>

      <Typography
        sx={{
          fontSize: 13, // text-sm
          fontWeight: 800, // font-semibold (un peu +)
          color: "text.primary",
        }}
      >
        {label}
      </Typography>
    </Paper>
  );
}
