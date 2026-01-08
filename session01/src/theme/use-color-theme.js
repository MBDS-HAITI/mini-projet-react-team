import { createTheme } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import { getDesignTokens } from "./theme";

export const useColorTheme = () => {
  const getInitialMode = () => {
    const saved = localStorage.getItem("mode");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const [mode, setMode] = useState(getInitialMode);

  const toggleColorMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    localStorage.setItem("mode", mode);
    document.documentElement.classList.toggle("dark", mode === "dark");
    // Indique au navigateur les styles natifs (inputs, scrollbar, etc.)
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return { theme, mode, toggleColorMode };
};
