// src/components/dashboards/AdminDashboard.jsx
// import { useNavigate } from "react-router-dom";
// import StatCard from "../widgets/StatCard";
// import DashboardHeader from "./DashboardHeader";
// import { useState } from "react";

// export default function AdminDashboard() {
//   const [dashboards, setDashboards] = useState([
//     { title: "Utilisateurs", value: 100, subtitle: "Total" },
//     { title: "Étudiants", value: 75, subtitle: "Inscrits" },
//     { title: "Cours", value: 12, subtitle: "Actif" },
//   ]);
//   const navigate = useNavigate();

//   return (
//     <div className="w-full">
//       {/* Container */}
//       <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
//         {/* Title */}
//         <DashboardHeader
//           title={"Dashboard Admin"}
//           description={"Vue globale & actions rapides"}
//           level={"ADMIN"}
//         />

//         {/* Stats grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {dashboards.map((d) => (
//             <StatCard title={d.title} value={d.value} subtitle={d.subtitle} />
//           ))}
//         </div>

//         {/* Quick actions */}
//         <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-2xl shadow-black/30">
//           <div className="flex items-center justify-between gap-3">
//             <h2 className="text-lg font-semibold text-white">
//               Actions rapides
//             </h2>
//             <span className="text-xs text-white/50">Gestion & création</span>
//           </div>

//           <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
//             <button
//               onClick={() => navigate("/users")}
//               className="rounded-xl px-4 py-3 text-sm font-semibold text-white
//                          bg-gradient-to-r from-fuchsia-500 to-cyan-400
//                          hover:opacity-95 transition shadow-lg shadow-black/25"
//             >
//               Gérer les utilisateurs
//             </button>

//             <button
//               onClick={() => navigate("/students/add")}
//               className="rounded-xl px-4 py-3 text-sm font-semibold text-white
//                          border border-white/15 bg-[#140524]/70
//                          hover:bg-white/10 transition"
//             >
//               Ajouter un étudiant
//             </button>

//             <button
//               onClick={() => navigate("/courses/add")}
//               className="rounded-xl px-4 py-3 text-sm font-semibold text-white
//                          border border-white/15 bg-[#140524]/70
//                          hover:bg-white/10 transition"
//             >
//               Ajouter un cours
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React from "react";

// Optionnel: si tu utilises lucide-react
// npm i lucide-react
import {
  Users,
  UserRound,
  CalendarDays,
  Layers,
  BookOpen,
  ClipboardList,
  GraduationCap,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

const StatCard = ({ title, value, subtitle, Icon, trend }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-xl transition hover:bg-white/10">
      {/* glow */}
      <div className="pointer-events-none absolute -inset-24 opacity-0 blur-3xl transition group-hover:opacity-100"
           style={{ background: "radial-gradient(circle at 30% 20%, rgba(168,85,247,0.35), transparent 60%)" }} />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-white/70">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}</p>
          {subtitle ? (
            <p className="mt-2 text-sm text-white/60">{subtitle}</p>
          ) : null}
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
          <Icon className="h-5 w-5 text-white/80" />
        </div>
      </div>

      {trend ? (
        <div className="relative mt-4 flex items-center gap-2 text-xs text-white/60">
          <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-emerald-200 ring-1 ring-emerald-500/25">
            {trend}
          </span>
          <span>vs. semaine passée</span>
        </div>
      ) : null}
    </div>
  );
};

const Panel = ({ title, right, children }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
    <div className="mb-4 flex items-center justify-between gap-3">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      {right}
    </div>
    {children}
  </div>
);

export default function AdminDashboard() {
  // TODO: remplacer par tes vrais stats venant de l’API
  const stats = {
    users: 100,
    students: 75,
    academicYears: 3,
    semesters: 6,
    courses: 12,
    enrollments: 248,
    grades: 180,
    unverifiedUsers: 4,
    unpublishedGrades: 32,
    activeYear: "2025-2026",
    activeSemester: "S1",
  };

  return (
    <div className="bg-[#070A1A] text-white">
      {/* background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(circle at 20% 10%, rgba(99,102,241,0.35), transparent 45%), radial-gradient(circle at 70% 30%, rgba(168,85,247,0.30), transparent 45%), radial-gradient(circle at 50% 90%, rgba(236,72,153,0.18), transparent 55%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
              <ShieldCheck className="h-4 w-4" />
              Admin • Vision globale
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              Dashboard Administrateur
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Année active: <span className="text-white">{stats.activeYear}</span> • Semestre:
              <span className="text-white"> {stats.activeSemester}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 outline-none backdrop-blur-xl">
              <option className="bg-[#0B0F2A]">Année: {stats.activeYear}</option>
              <option className="bg-[#0B0F2A]">2024-2025</option>
              <option className="bg-[#0B0F2A]">2023-2024</option>
            </select>

            <select className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 outline-none backdrop-blur-xl">
              <option className="bg-[#0B0F2A]">Semestre: {stats.activeSemester}</option>
              <option className="bg-[#0B0F2A]">S2</option>
            </select>

            <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-2 text-sm font-medium shadow-lg shadow-fuchsia-500/20 transition hover:opacity-95">
              <Plus className="h-4 w-4" />
              Créer
            </button>
          </div>
        </div>

        {/* Alerts */}
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-amber-100">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5" />
              <div>
                <p className="font-medium">Actions recommandées</p>
                <p className="mt-1 text-sm text-amber-100/80">
                  {stats.unverifiedUsers} comptes email non vérifiés • {stats.unpublishedGrades} notes non publiées.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/70">Aperçu rapide</p>
            <p className="mt-1 text-sm text-white/60">
              Tu peux piloter toutes les entités: Années académiques, Semestres, Cours, Étudiants,
              Utilisateurs, Inscriptions, Notes.
            </p>
          </div>
        </div>

        {/* KPI grid (7 entités) */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Utilisateurs" value={stats.users} subtitle={`${stats.unverifiedUsers} non vérifiés`} Icon={Users} trend="+8%" />
          <StatCard title="Étudiants" value={stats.students} subtitle="Comptes liés: à venir" Icon={UserRound} trend="+3%" />
          <StatCard title="Années académiques" value={stats.academicYears} subtitle={`Active: ${stats.activeYear}`} Icon={CalendarDays} />
          <StatCard title="Semestres" value={stats.semesters} subtitle={`Actif: ${stats.activeSemester}`} Icon={Layers} />
          <StatCard title="Cours" value={stats.courses} subtitle="Crédits totaux: à calculer" Icon={BookOpen} />
          <StatCard title="Inscriptions" value={stats.enrollments} subtitle="ENROLLED / DROPPED / COMPLETED" Icon={ClipboardList} />
          <StatCard title="Notes" value={stats.grades} subtitle={`${stats.unpublishedGrades} non publiées`} Icon={GraduationCap} />
        </div>

        {/* Lower panels */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {/* Quick actions */}
          <Panel
            title="Actions rapides"
            right={<span className="text-xs text-white/50">Gestion & création</span>}
          >
            <div className="grid gap-2">
              {[
                "Créer une année académique",
                "Créer un semestre",
                "Créer un cours",
                "Ajouter un étudiant",
                "Créer un utilisateur (ADMIN/SCOLARITE)",
                "Inscrire un étudiant (Enrollment)",
                "Publier des notes",
              ].map((label) => (
                <button
                  key={label}
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-left text-sm text-white/80 transition hover:bg-white/10"
                >
                  <span>{label}</span>
                  <ArrowUpRight className="h-4 w-4 text-white/50 transition group-hover:text-white/80" />
                </button>
              ))}
            </div>
          </Panel>

          {/* Recent activity */}
          <Panel title="Activité récente" right={<button className="text-xs text-white/60 hover:text-white">Voir tout</button>}>
            <div className="space-y-3">
              {[
                { title: "Nouveau cours créé", meta: "COURSE • il y a 12 min", badge: "OK" },
                { title: "Étudiant inscrit à S1", meta: "ENROLLMENT • il y a 1h", badge: "OK" },
                { title: "Notes ajoutées (non publiées)", meta: "GRADE • il y a 2h", badge: "ATTN" },
              ].map((x, i) => (
                <div key={i} className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                  <div>
                    <p className="text-sm text-white">{x.title}</p>
                    <p className="mt-1 text-xs text-white/50">{x.meta}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[10px] ring-1 ${
                    x.badge === "OK"
                      ? "bg-emerald-500/15 text-emerald-200 ring-emerald-500/25"
                      : "bg-amber-500/15 text-amber-200 ring-amber-500/25"
                  }`}>
                    {x.badge}
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          {/* Entity overview */}
          <Panel title="État du système" right={<span className="text-xs text-white/50">Qualité & sécurité</span>}>
            <div className="space-y-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-sm text-white">Email & comptes</p>
                <p className="mt-1 text-xs text-white/60">
                  {stats.unverifiedUsers} utilisateurs non vérifiés • rôle STUDENT doit avoir `student`
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-sm text-white">Cohérence académique</p>
                <p className="mt-1 text-xs text-white/60">
                  `AcademicYear` format 2025-2026 • `Semester` unique par année (S1/S2)
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-sm text-white">Notes</p>
                <p className="mt-1 text-xs text-white/60">
                  1 note par enrollment • {stats.unpublishedGrades} non publiées
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
