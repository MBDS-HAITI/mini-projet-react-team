import { useState } from "react";
import "./App.css";
import MaintContent from "./components/MaintContent";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Navigation from "./Navigation";

function App() {
  // const [activePage, setActivePage] = useState("home");

  return (
    <>
      <Header />
      <Menu />
      <main className="w-full flex flex-col items-center mb-8 p-2">
        <Navigation />
        <div className="w-auto mx-auto"></div>
      </main>
      <Footer />
    </>
  );
}

export default App;
