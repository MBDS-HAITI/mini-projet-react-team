// src/components/dashboards/ScolariteDashboard.jsx

import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import StatCard from "../widgets/StatCard";

import {
  GraduationCap,
  ClipboardList,
  BookOpen,
  FileText,
  AlertTriangle,
  CalendarDays,
} from "lucide-react";

export default function ScolariteDashboard() {
  /* =======================
     KPI DASHBOARD (CARDS)
     ======================= */
  const [dashboards, setDashboards] = useState([
    {
      key: "students",
      title: "Étudiants",
      value: 342,
      subtitle: "Inscrits",
      icon: <GraduationCap />,
      valueColor: "text-green-400",
    },
    {
      key: "newInscriptions",
      title: "Inscriptions",
      value: 58,
      subtitle: "Ce semestre",
      icon: <ClipboardList />,
      valueColor: "text-cyan-400",
    },
    {
      key: "courses",
      title: "Cours actifs",
      value: 24,
      subtitle: "Toutes filières",
      icon: <BookOpen />,
      valueColor: "text-indigo-400",
    },
    {
      key: "notes",
      title: "Notes",
      value: 1280,
      subtitle: "Saisies",
      icon: <FileText />,
      valueColor: "text-fuchsia-400",
    },
  ]);

  /* =======================
     RÉSUMÉ ACADÉMIQUE
     ======================= */
  const stats = {
    pendingNotes: 6,
    semester: "Semestre 1",
    academicYear: "2024 - 2025",
    entryRate: "92 %",
  };

  /* =======================
     DERNIÈRES NOTES
     ======================= */
  const [recentNotes, setRecentNotes] = useState([
    {
      id: 1,
      student: "Jean Pierre",
      subject: "Mathématiques",
      classLevel: "L2",
      status: "Validée",
    },
    {
      id: 2,
      student: "Marie Louis",
      subject: "Physique",
      classLevel: "L1",
      status: "En attente",
    },
    {
      id: 3,
      student: "David Jean",
      subject: "Informatique",
      classLevel: "L3",
      status: "Validée",
    },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* ================= HEADER ================= */}
      <DashboardHeader
        title="Dashboard Scolarité"
        description="Vue globale & suivi académique"
        level="SCOLARITE"
      />

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {dashboards.map((item) => (
          <StatCard
            key={item.key}
            title={item.title}
            value={item.value}
            subtitle={item.subtitle}
            icon={item.icon}
            valueColor={item.valueColor}
          />
        ))}
      </div>

      {/* ================= CONTENU CENTRAL ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ======== CENTRE ======== */}
        <div className="lg:col-span-2 space-y-6">
          {/* Résumé académique */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Résumé académique
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <SummaryItem label="Année active" value={stats.academicYear} />
              <SummaryItem label="Semestre" value={stats.semester} />
              <SummaryItem
                label="Notes en attente"
                value={stats.pendingNotes}
                color="text-red-400"
              />
              <SummaryItem
                label="Taux de saisie"
                value={stats.entryRate}
                color="text-green-400"
              />
            </div>
          </div>

          {/* Table des dernières notes */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Dernières notes saisies
            </h3>

            <table className="w-full text-sm text-white/80">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="text-left py-2">Étudiant</th>
                  <th className="text-center">Matière</th>
                  <th className="text-center">Classe</th>
                  <th className="text-center">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentNotes.map((n) => (
                  <tr key={n.id} className="border-b border-white/5">
                    <td className="py-2">{n.student}</td>
                    <td className="text-center">{n.subject}</td>
                    <td className="text-center">{n.classLevel}</td>
                    <td
                      className={`text-center font-semibold ${
                        n.status === "Validée"
                          ? "text-green-400"
                          : "text-amber-400"
                      }`}
                    >
                      {n.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ======== ASIDE DROIT ======== */}
        <div className="space-y-6">
          {/* Calendrier */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays className="text-cyan-400" />
              <h3 className="font-semibold text-white">Calendrier</h3>
            </div>
            <p className="text-sm text-white/60">
              Examens, rattrapages, clôtures
            </p>
            <div className="mt-4 h-32 rounded-lg bg-white/10 flex items-center justify-center text-white/40">
              📅 (Calendar UI à venir)
            </div>
          </div>

          {/* Alertes */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-red-400" />
              <h3 className="font-semibold text-white">Alertes</h3>
            </div>
            <ul className="text-sm text-white/70 space-y-2">
              <li>• {stats.pendingNotes} notes non validées</li>
              <li>• Semestre bientôt clôturé</li>
              <li>• 3 étudiants sans notes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =================== SOUS-COMPONENT =================== */
function SummaryItem({ label, value, color = "text-white" }) {
  return (
    <div className="rounded-lg bg-white/10 p-4">
      <div className="text-xs text-white/60">{label}</div>
      <div className={`text-lg font-bold ${color}`}>{value}</div>
    </div>
  );
}
