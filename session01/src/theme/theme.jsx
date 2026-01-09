import { deepOrange, indigo } from "@mui/material/colors";

export const getDesignTokens = (mode) => ({
  palette: {
    mode,

    ...(mode === "light"
      ? {
          primary: {
            main: "#7C3AED", // violet premium
          },
          secondary: {
            main: "#06B6D4", // cyan
          },
          divider: "rgba(15, 23, 42, 0.08)",

          background: {
            default: "#F6F8FF", // fond doux
            paper: "#FFFFFF",   // cartes blanches
          },

          text: {
            primary: "#0F172A",
            secondary: "#64748B",
          },
        }
      : {
          primary: indigo,
          secondary: deepOrange,
          divider: "rgba(255,255,255,0.12)",
          background: {
            default: "#0B1020",
            paper: "#111A33",
          },
          text: {
            primary: "#E5E7EB",
            secondary: "#9CA3AF",
          },
        }),
  },

  ...(mode === "light"
    ? {
        shape: {
          borderRadius: 18,
        },

        typography: {
          fontFamily: `"Inter", "Roboto", "Arial", sans-serif`,
          h1: { fontWeight: 800 },
          h2: { fontWeight: 800 },
          h3: { fontWeight: 700 },
          h4: { fontWeight: 700 },
          h5: { fontWeight: 700 },
          h6: { fontWeight: 700 },
          button: { fontWeight: 600, textTransform: "none" },
        },

        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 18,
                border: "1px solid rgba(15, 23, 42, 0.08)",
                boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
              },
            },
          },

          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 18,
                border: "1px solid rgba(15, 23, 42, 0.08)",
                boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
              },
            },
          },

          MuiAppBar: {
            styleOverrides: {
              root: {
                background: "rgba(255,255,255,0.70)",
                color: "#0F172A",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
                boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
              },
            },
          },

          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 14,
                textTransform: "none",
                fontWeight: 600,
                paddingLeft: 18,
                paddingRight: 18,
              },
            },
          },

          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 999,
                background: "rgba(124,58,237,0.10)",
                color: "#4C1D95",
                fontWeight: 600,
              },
            },
          },

          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                borderRadius: 14,
                backgroundColor: "#FFFFFF",
              },
              notchedOutline: {
                borderColor: "rgba(15, 23, 42, 0.10)",
              },
            },
          },

          MuiDivider: {
            styleOverrides: {
              root: {
                borderColor: "rgba(15, 23, 42, 0.08)",
              },
            },
          },

          MuiContainer: {
            defaultProps: {
              maxWidth: "lg",
            },
          },
        },
      }
    : {}),
});
