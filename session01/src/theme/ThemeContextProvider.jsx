// src/theme/Theme.ContextProvider.jsx

import { createContext, useContext } from "react";
import { useColorTheme } from "./use-color-theme.jsx";

const ThemeContext = createContext(null);

export const ThemeContextProvider = ({ children }) => {
  const value = useColorTheme();
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext must be used within ThemeContextProvider");
  return ctx;
};
