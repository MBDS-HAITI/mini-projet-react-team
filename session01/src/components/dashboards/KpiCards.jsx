// src/components/pages/AdminDashboard.jsx (ou ton chemin)

import StatCard from "../widgets/StatCard";

import Box from "@mui/material/Box";





export default function KpiCards({ dashboards }) {
  const total = dashboards?.length ?? 0;

  return (
    <Box
      sx={{
        display: "grid",
        width: "100%",
        gap: 2,
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          sm: total <= 2 ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
        },
      }}
    >
      {dashboards.map((item) => (
        <StatCard
          key={item.key}
          title={item.title}
          value={item.value}
          subtitle={item.subtitle}
          hint={item.hint}
          icon={item.icon}
          // icon={typeof item.icon === "function" ? item.icon : null}
          valueColor={item.valueColor}
        />
      ))}
    </Box>
  );
}

