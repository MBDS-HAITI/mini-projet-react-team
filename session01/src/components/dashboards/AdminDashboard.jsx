import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardHeader from "./DashboardHeader";
import StatCard from "../widgets/StatCard";
import { ActionButton } from "../ActionButton";
import { SummaryItem } from "../SummaryItem";

import {
  Users,
  GraduationCap,
  Shield,
  UserCog,
  AlertTriangle,
  Lock,
  Settings,
  CheckCircle,
  Edit,
} from "lucide-react";

export default function AdminDashboard() {

  const [dashboards] = useState([
    {
      key: "users",
      title: "Utilisateurs",
      value: 412,
      subtitle: "Total",
      icon: <Users />,
      valueColor: "text-cyan-400",
    },
    {
      key: "students",
      title: "Étudiants",
      value: 342,
      subtitle: "Actifs",
      icon: <GraduationCap />,
      valueColor: "text-green-400",
    },
    {
      key: "scolarite",
      title: "Scolarité",
      value: 4,
      subtitle: "Comptes",
      icon: <UserCog />,
      valueColor: "text-indigo-400",
    },
    {
      key: "admins",
      title: "Admins",
      value: 2,
      subtitle: "Actifs",
      icon: <Shield />,
      valueColor: "text-fuchsia-400",
    },
  ]);

  /* =======================
     ÉTAT DU SYSTÈME
     ======================= */
  const systemStats = {
    activeUsers: 398,
    blockedAccounts: 3,
    failedLogins: 7,
    academicYear: "2024 - 2025",
  };

  /* =======================
     ACTIVITÉS RÉCENTES
     ======================= */
  const [activities] = useState([
    {
      id: 1,
      action: "Création compte étudiant",
      user: "admin@system",
      date: "12/11/2025",
    },
    {
      id: 2,
      action: "Réinitialisation mot de passe",
      user: "scolarite@system",
      date: "11/11/2025",
    },
    {
      id: 3,
      action: "Blocage compte utilisateur",
      user: "admin@system",
      date: "10/11/2025",
    },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* ================= HEADER ================= */}
      <DashboardHeader
        title="Dashboard Administrateur"
        description="Supervision et gestion du système"
        level="ADMIN"
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
        {/* ======== COLONNE PRINCIPALE ======== */}
        <div className="lg:col-span-2 space-y-6">
          {/* État du système */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              État du système
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <SummaryItem
                label="Utilisateurs actifs"
                value={systemStats.activeUsers}
                color="text-green-400"
              />
              <SummaryItem
                label="Comptes bloqués"
                value={systemStats.blockedAccounts}
                color="text-red-400"
              />
              <SummaryItem
                label="Connexions échouées"
                value={systemStats.failedLogins}
                color="text-amber-400"
              />
              <SummaryItem
                label="Année académique"
                value={systemStats.academicYear}
              />
            </div>
          </div>

          {/* Activités récentes */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Activités récentes
            </h3>

            <ul className="text-sm text-white/70 space-y-3">
              {activities.map((a) => (
                <li
                  key={a.id}
                  className="flex justify-between border-b border-white/5 pb-2"
                >
                  <span>{a.action}</span>
                  <span className="text-white/40">
                    {a.user} • {a.date}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ================= ACTIONS RAPIDES ================= */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Actions rapides
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ActionButton
                icon={<Users />}
                label="Utilisateurs"
                onClick={() => navigate("/users")}
              />
              <ActionButton
                icon={<CheckCircle />}
                label="Inscriptions"
                onClick={() => navigate("/enrollments")}
              />
              <ActionButton
                icon={<Edit />}
                label="Gestion des notes"
                onClick={() => navigate("/grades")}
              />
              <ActionButton
                icon={<Lock />}
                label="Gestion semestres"
                onClick={() => navigate("/semester")}
              />
            </div>
          </div>
        </div>

        {/* ======== ASIDE DROIT ======== */}
        <div className="space-y-6">
          {/* Configuration */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="text-cyan-400" />
              <h3 className="font-semibold text-white">Configuration</h3>
            </div>

            <ul className="text-sm text-white/70 space-y-2">
              <li
                className="cursor-pointer hover:text-white"
                onClick={() => navigate("/settings/academic")}
              >
                • Années et semestres
              </li>
              <li
                className="cursor-pointer hover:text-white"
                onClick={() => navigate("/settings/roles")}
              >
                • Rôles et permissions
              </li>
              <li
                className="cursor-pointer hover:text-white"
                onClick={() => navigate("/settings/system")}
              >
                • Paramètres système
              </li>
            </ul>
          </div>

          {/* Alertes système */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-red-400" />
              <h3 className="font-semibold text-white">Alertes système</h3>
            </div>

            <ul className="text-sm text-white/70 space-y-2">
              <li>• 3 comptes bloqués</li>
              <li>• Connexions suspectes détectées</li>
              <li>• Sauvegarde système recommandée</li>
            </ul>
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
