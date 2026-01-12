// src/components/SummaryItem.jsx
import * as React from "react";
import { Paper, Typography, Box, alpha, useTheme } from "@mui/material";

export function SummaryItem({ label, value, color = "text.primary" }) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: "blur(12px)",
        boxShadow: theme.shadows[2],
      }}
    >
      <Typography
        variant="caption"
        sx={{
          display: "block",
          fontSize: 14,
          color: "text.secondary",
          mb: 0.5,
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          fontSize: 20,
          fontWeight: 900,
          lineHeight: 1.1,
          color, // ex: "success.main" | "error.main" | "warning.main" | "primary.main"
        }}
      >
        {value}
      </Box>
    </Paper>
  );
}
