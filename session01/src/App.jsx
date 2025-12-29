import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Navigation from "./Navigation";
import { useLocation } from "react-router-dom";


function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      <Header />
      {!isLoginPage && <Menu />}
      <main className="w-full flex flex-col items-center mb-8 p-2">
        <Navigation />
        <div className="w-auto mx-auto"></div>
      </main>
      <Footer />
    </>
  );
}

export default App;
