// src/components/dashboards/AdminDashboard.jsx
import { useNavigate } from "react-router-dom";
import StatCard from "../widgets/StatCard";
import DashboardHeader from "./DashboardHeader";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Container */}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
        {/* Title */}
        <DashboardHeader title={"Dashboard Admin"} description={"Vue globale & actions rapides"} level={"ADMIN"} />

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Utilisateurs" value="100" subtitle="Total" />
          <StatCard title="Étudiants" value="75" subtitle="Inscrits" valueColor="text-fuchsia-300" />
          <StatCard title="Cours" value="12" subtitle="Actifs" valueColor="text-white" />
        </div>

        {/* Quick actions */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-2xl shadow-black/30">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Actions rapides</h2>
            <span className="text-xs text-white/50">Gestion & création</span>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => navigate("/users")}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-white
                         bg-gradient-to-r from-fuchsia-500 to-cyan-400
                         hover:opacity-95 transition shadow-lg shadow-black/25"
            >
              Gérer les utilisateurs
            </button>

            <button
              onClick={() => navigate("/students/add")}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-white
                         border border-white/15 bg-[#140524]/70
                         hover:bg-white/10 transition"
            >
              Ajouter un étudiant
            </button>

            <button
              onClick={() => navigate("/courses/add")}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-white
                         border border-white/15 bg-[#140524]/70
                         hover:bg-white/10 transition"
            >
              Ajouter un cours
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
