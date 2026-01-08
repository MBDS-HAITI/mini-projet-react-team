// src/components/dashboards/StudentDashboard.jsx

import { useNavigate } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import StatCard from "../widgets/StatCard";

import {
  GraduationCap,
  BookOpen,
  AlertTriangle,
  CalendarDays,
  UserCheck,
} from "lucide-react";
import { ActionButton } from "../ActionButton";

export default function StudentDashboard() {
  const navigate = useNavigate();


  // INFOS ÉTUDIANT
  
  const student = {
    name: "Sachy Edvaelle Barreau",
    matricule: "STD-2025-001",
    level: "L2",
    program: "Informatique",
    academicYear: "2024 - 2025",
    status: "Actif",
  };

  
  // KPI

  const kpis = [
    {
      key: "average",
      title: "Moyenne",
      value: "14.2",
      subtitle: "/20",
      icon: <GraduationCap />,
      valueColor: "text-green-400",
    },
    {
      key: "validated",
      title: "Matières",
      value: "6/8",
      subtitle: "Validées",
      icon: <BookOpen />,
      valueColor: "text-cyan-400",
    },
    {
      key: "failures",
      title: "Échecs",
      value: 1,
      subtitle: "Matière(s)",
      icon: <AlertTriangle />,
      valueColor: "text-red-400",
    },
  ];

  // DERNIÈRES NOTES
  
  const recentGrades = [
    {
      id: 1,
      subject: "Mathématiques",
      grade: 15,
      coef: 20,
      date: "12/11/2025",
      status: "Validé",
    },
    {
      id: 2,
      subject: "Physique",
      grade: 9,
      coef: 20,
      date: "08/11/2025",
      status: "Échec",
    },
    {
      id: 3,
      subject: "Informatique",
      grade: 16,
      coef: 20,
      date: "05/11/2025",
      status: "Validé",
    },
  ];


  // ALERTES PERSONNELLES
 
  const alerts = [
    "⚠️ 1 matière en échec (Physique)",
    
    "📅 Semestre bientôt clôturé",
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
      {/* HEADER */}
      <DashboardHeader
        title="Dashboard Étudiant"
        description="Vue globale & actions rapides"
        level="STUDENT"
      />

      {/* PROFIL */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">{student.name}</h2>
          <p className="text-sm text-white/70">
            Matricule :{" "}
            <span className="font-semibold">{student.matricule}</span>
          </p>
          <p className="text-sm text-white/70">
            {student.level} • {student.program} • {student.academicYear}
          </p>
        </div>

        <div className="text-sm text-white/70">
          Statut :{" "}
          <span className="font-semibold text-green-400">{student.status}</span>
        </div>
      </div>

      {/* KPI + ALERTES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((item) => (
          <StatCard
            key={item.key}
            title={item.title}
            value={item.value}
            subtitle={item.subtitle}
            icon={item.icon}
            valueColor={item.valueColor}
          />
        ))}

        {/* ALERTES EN CARTE KPI */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="text-red-400" />
            <h3 className="font-semibold text-white">Alertes</h3>
          </div>

          <ul className="text-sm text-white/70 space-y-2">
            {alerts.map((a, index) => (
              <li
                key={index}
                className="rounded-lg bg-white/10 p-2"
              >
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="space-y-6">
       
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Dernières notes</h3>
          </div>

          <table className="w-full text-sm text-white/80">
            <thead className="border-b border-white/10">
              <tr>
                <th className="text-left py-2">Matière</th>
                <th className="text-center">Note</th>
                <th className="text-center">Coef</th>
                <th className="text-center">Date</th>
                <th className="text-center">Statut</th>
              </tr>
            </thead>

            <tbody>
              {recentGrades.map((g) => (
                <tr key={g.id} className="border-b border-white/5">
                  <td className="py-2">{g.subject}</td>
                  <td className="text-center font-semibold">{g.grade}</td>
                  <td className="text-center">{g.coef}</td>
                  <td className="text-center">{g.date}</td>
                  <td
                    className={`text-center font-semibold ${
                      g.status === "Validé"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {g.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ACTIONS RAPIDES */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Actions rapides
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <ActionButton
              icon={<BookOpen />}
              label="Mes notes"
              onClick={() => navigate("/grades")}
            />

            <ActionButton
              icon={<UserCheck />}
              label="Mon profil"
              onClick={() => navigate("/profile")}
            />

            <ActionButton
              icon={<CalendarDays />}
              label="Inscriptions"
              onClick={() => navigate("/enrollments")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
