import { amber, deepOrange, grey, indigo } from "@mui/material/colors";

export const getDesignTokens = (mode) => ({
  palette: {
    mode,

    ...(mode === "light"
      ? {
          primary: indigo, 
          secondary: deepOrange, 
          divider: grey[200],
          background: {
            default: "#F8FAFC", 
            paper: "#FF23FF",
          },
          text: {
            primary: grey[900],
            secondary: grey[700],
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
});
