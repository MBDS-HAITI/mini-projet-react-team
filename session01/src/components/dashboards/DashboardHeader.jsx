// src/components/DashboardHeader.jsx
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";

export default function DashboardHeader({ title, description, level }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: theme.palette.text.primary,
            fontSize: { xs: 24, md: 32 }, // text-2xl -> md:text-3xl
            lineHeight: 1.15,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            color: theme.palette.text.secondary,
            fontSize: 14,
          }}
        >
          {description}
        </Typography>
      </Box>

      {/* Pill (hidden on xs like "hidden sm:flex") */}
      <Paper
        elevation={0}
        sx={{
          display: { xs: "none", sm: "inline-flex" },
          alignItems: "center",
          gap: 1,
          px: 1.5,
          py: 0.75,
          borderRadius: 999,
          border: "1px solid",
          borderColor: theme.palette.divider,
          // effet "glass" proche du tailwind: light = blanc, dark = blanc très faible + blur
          backgroundColor: isDark
            ? alpha(theme.palette.common.white, 0.06)
            : theme.palette.background.paper,
          color: isDark
            ? alpha(theme.palette.common.white, 0.70)
            : theme.palette.text.secondary,
          boxShadow: isDark ? "none" : "0 1px 2px rgba(0,0,0,0.06)",
          backdropFilter: isDark ? "blur(14px)" : "none",
        }}
      >
        <Box
          sx={{
            height: 8,
            width: 8,
            borderRadius: "50%",
            background: "linear-gradient(90deg, #d946ef, #22d3ee)", // fuchsia -> cyan
            flex: "0 0 auto",
          }}
        />
        <Typography
          sx={{
            fontSize: 12,
            lineHeight: 1,
            fontWeight: 600,
          }}
        >
          {level}
        </Typography>
      </Paper>
    </Box>
  );
}
