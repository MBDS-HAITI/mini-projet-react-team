import { CssBaseline, ThemeProvider } from "@mui/material";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Navigation from "./Navigation";
import { useLocation } from "react-router-dom";
import { useThemeContext } from "./theme/ThemeContextProvider";

function App() {
  const { theme } = useThemeContext();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!isLoginPage && <Header />}
      {!isLoginPage && <Menu />}
      <main className="w-full flex flex-col items-center mb-8 p-2">
        <Navigation />
        <div className="w-auto mx-auto"></div>
      </main>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
