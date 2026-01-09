// src/components/pages/AdminDashboard.jsx (ou ton chemin)
import { useMemo } from "react";

import StatCard from "../widgets/StatCard";

import Box from "@mui/material/Box";

import {
  Users,
  GraduationCap,
  Shield,
  UserCog,
} from "lucide-react";



export default function KpiCards() {
  const dashboards = useMemo(
    () => [
      {
        key: "users",
        title: "Utilisateurs",
        value: 412,
        subtitle: "Total",
        icon: <Users size={18} />,
        valueColor: "info.main",
      },
      {
        key: "students",
        title: "Étudiants",
        value: 342,
        subtitle: "Actifs",
        icon: <GraduationCap size={18} />,
        valueColor: "success.main",
      },
      {
        key: "scolarite",
        title: "Scolarité",
        value: 4,
        subtitle: "Comptes",
        icon: <UserCog size={18} />,
        valueColor: "primary.main",
      },
      {
        key: "admins",
        title: "Admins",
        value: 2,
        subtitle: "Actifs",
        icon: <Shield size={18} />,
        valueColor: "secondary.main",
      },
    ],
    []
  );

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", xl: "repeat(4, 1fr)" },
        gap: 2,
      }}
    >
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
    </Box>
  );
}
