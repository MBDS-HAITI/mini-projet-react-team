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
  const navigate = useNavigate();

  /* =======================
     KPI GLOBAUX SYSTÈME
     ======================= */
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
      </div>
    </div>
  );
}
