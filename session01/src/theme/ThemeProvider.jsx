import React from "react";

const ThemeContext = React.createContext(null);

const THEMES = ["glass", "light", "dark"];

export function ThemeProvider({ children }) {
  // glass par défaut si rien en storage
  const [theme, setTheme] = React.useState(() => {
    return localStorage.getItem("theme") || "glass";
  });

  React.useEffect(() => {
    // On applique le thème via data-theme
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const value = React.useMemo(
    () => ({ theme, setTheme, themes: THEMES }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
