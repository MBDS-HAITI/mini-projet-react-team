
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
import { useThemeContext } from "../../theme/ThemeContextProvider";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { mode } = useThemeContext();
  const isLight = mode === "light";

  const student = {
    name: "Sachy Edvaelle Barreau",
    matricule: "STD-2025-001",
    level: "L2",
    program: "Informatique",
    academicYear: "2024 - 2025",
    status: "Actif",
  };

  const kpis = [
    {
      key: "average",
      title: "Moyenne",
      value: "14.2",
      subtitle: "/20",
      icon: <GraduationCap />,
      valueColor: isLight ? "text-green-500" : "text-green-400",
    },
    {
      key: "validated",
      title: "Matières",
      value: "6/8",
      subtitle: "Validées",
      icon: <BookOpen />,
      valueColor: isLight ? "text-cyan-500" : "text-cyan-400",
    },
    {
      key: "failures",
      title: "Échecs",
      value: 1,
      subtitle: "Matière(s)",
      icon: <AlertTriangle />,
      valueColor: isLight ? "text-red-500" : "text-red-400",
    },
  ];

  const recentGrades = [
    { id: 1, subject: "Mathématiques", grade: 15, coef: 20, date: "12/11/2025", status: "Validé" },
    { id: 2, subject: "Physique", grade: 9, coef: 20, date: "08/11/2025", status: "Échec" },
    { id: 3, subject: "Informatique", grade: 16, coef: 20, date: "05/11/2025", status: "Validé" },
  ];

  const alerts = ["⚠️ 1 matière en échec (Physique)", "📅 Semestre bientôt clôturé"];

  const card = isLight
    ? "rounded-xl border border-slate-200 bg-white shadow-sm p-6"
    : "rounded-xl border border-white/10 bg-white/5 p-6";

  const title = isLight ? "text-slate-900" : "text-white";
  const subText = isLight ? "text-slate-600" : "text-white/70";
  const tableText = isLight ? "text-slate-700" : "text-white/80";
  const headText = isLight ? "text-slate-500" : "text-white/50";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">

      <DashboardHeader
        title="Dashboard Étudiant"
        description="Vue globale & actions rapides"
        level="STUDENT"
      />

      <div className={`${card} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`}>
        <div className="space-y-1">
          <h2 className={`text-xl font-bold ${title}`}>{student.name}</h2>
          <p className={`text-sm ${subText}`}>
            Matricule : <span className="font-semibold">{student.matricule}</span>
          </p>
          <p className={`text-sm ${subText}`}>
            {student.level} • {student.program} • {student.academicYear}
          </p>
        </div>

        <div className={`text-sm ${subText}`}>
          Statut :{" "}
          <span className={`font-semibold ${isLight ? "text-green-500" : "text-green-400"}`}>
            {student.status}
          </span>
        </div>
      </div>

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

        <div className={card}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className={isLight ? "text-red-500" : "text-red-400"} />
            <h3 className={`font-semibold ${title}`}>Alertes</h3>
          </div>

          <ul className={`text-sm space-y-2 ${subText}`}>
            {alerts.map((a, index) => (
              <li
                key={index}
                className={
                  isLight
                    ? "rounded-lg bg-slate-50 border border-slate-200 p-2 text-slate-700"
                    : "rounded-lg bg-white/10 p-2"
                }
              >
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={card}>
        <h3 className={`text-lg font-semibold ${title} mb-4`}>Dernières notes</h3>

        <table className={`w-full text-sm ${tableText}`}>
          <thead className={isLight ? "border-b border-slate-200" : "border-b border-white/10"}>
            <tr className={headText}>
              <th className="text-left py-2 font-semibold">Matière</th>
              <th className="text-center font-semibold">Note</th>
              <th className="text-center font-semibold">Coef</th>
              <th className="text-center font-semibold">Date</th>
              <th className="text-center font-semibold">Statut</th>
            </tr>
          </thead>

          <tbody>
            {recentGrades.map((g) => (
              <tr key={g.id} className={isLight ? "border-b border-slate-100" : "border-b border-white/5"}>
                <td className="py-2">{g.subject}</td>
                <td className={`text-center font-semibold ${isLight ? "text-slate-900" : "text-white"}`}>{g.grade}</td>
                <td className="text-center">{g.coef}</td>
                <td className="text-center">{g.date}</td>
                <td className={`text-center font-semibold ${
                  g.status === "Validé"
                    ? (isLight ? "text-green-500" : "text-green-400")
                    : (isLight ? "text-red-500" : "text-red-400")
                }`}>
                  {g.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={card}>
        <h3 className={`text-lg font-semibold ${title} mb-4`}>Actions rapides</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <ActionButton icon={<BookOpen />} label="Mes notes" onClick={() => navigate("/grades")} />
          <ActionButton icon={<UserCheck />} label="Mon profil" onClick={() => navigate("/profile")} />
          <ActionButton icon={<CalendarDays />} label="Inscriptions" onClick={() => navigate("/enrollments")} />
        </div>
      </div>
    </div>
  );
}
