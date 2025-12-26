// src/components/dashboards/StudentDashboard.jsx

import { useNavigate } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";

export default function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
      {/* Title */}
      <DashboardHeader title={"Dashboard Etudiant"} description={"Vue globale & actions rapides"} level={"STUDENT"} />
    </div>
  );
}
