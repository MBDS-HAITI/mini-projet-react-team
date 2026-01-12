// src/components/pages/AdminDashboard.jsx (ou ton chemin)
import { useMemo } from "react";

import StatCard from "../widgets/StatCard";

import Box from "@mui/material/Box";





export default function KpiCards({dashboards}) {

  return (
    <Box
      sx={{
        display: "grid",
        width:"100%",
        gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" },
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
