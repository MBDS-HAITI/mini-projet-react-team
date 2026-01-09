// src/theme/theme.jsx

import { deepOrange, indigo } from "@mui/material/colors";

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: { main: "#7C3AED", dark: "#4F46E5" },
          secondary: { main: "#06B6D4" },
          divider: "rgba(15, 23, 42, 0.08)",
          background: {
            default: "#F6F8FF",
            paper: "#DFECED",
            paperGlass: "rgba(223,236,237,0.60)",
          },
          text: {
            primary: "#0F172A",
            secondary: "#64748B",
            muted: "rgba(15, 23, 42, 0.65)",
          },
          gradients: { accent: "linear-gradient(90deg, #d946ef, #22d3ee)" },
          borders: {
            container: "rgba(15, 23, 42, 0.10)",
          },
          effects: {
            containerShadow: "0 20px 40px -16px rgba(0,0,0,0.18)",
          },
          table: {
            headText: "rgba(15, 23, 42, 0.70)",
            rowHover: "rgba(15, 23, 42, 0.04)",
          },
          actions: {
            primary: "#7C3AED", // edit + details
            danger: "#EF4444", // delete
          },
        }
      : {
          primary: indigo,
          secondary: deepOrange,
          divider: "rgba(255,255,255,0.12)",
          background: {
            default: "#0B1020",
            paper: "#111A33",
            paperGlass: "rgba(255,255,255,0.06)",
          },
          text: {
            primary: "#E5E7EB",
            secondary: "#9CA3AF",
            muted: "rgba(229, 231, 235, 0.70)",
          },
          gradients: {
            accent: "linear-gradient(90deg, #d946ef, #22d3ee)",
          },
          borders: {
            container: "rgba(255,255,255,0.20)",
          },
          effects: {
            containerShadow: "0 25px 50px -12px rgba(0,0,0,0.40)",
          },
          table: {
            headText: "rgba(229, 231, 235, 0.75)",
            rowHover: "rgba(255,255,255,0.05)",
          },
          actions: {
            primary: "#A78BFA",
            danger: "#F87171",
          },
        }),
    },
});
