import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Navigation from "./Navigation";
import { useLocation } from "react-router-dom";
import { useThemeContext } from "./theme/ThemeContextProvider";

function App() {
  const { theme, mode } = useThemeContext(); 
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {!isLoginPage && mode === "light" && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 0,
              background: `
        radial-gradient(circle at 15% 8%, rgba(124,58,237,0.12), transparent 55%),
        radial-gradient(circle at 88% 12%, rgba(14,165,233,0.12), transparent 60%)
      `,
            }}
          />
        )}


        <Box sx={{ position: "relative", zIndex: 1 }}>
          {!isLoginPage && <Header />}
          {!isLoginPage && <Menu />}

          <main className="w-full flex flex-col items-center mb-8 px-3 sm:px-6">
            <div className="w-full max-w-6xl">
              <Navigation />
            </div>
          </main>

          <Footer />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
