import { SummaryItem } from "../SummaryItem";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useState } from "react";

  
export default function SectionSytemState({surfaceCardSx}) {

  
  const [systemStats, setSystemStats] = useState({
    activeUsers: 398,
    blockedAccounts: 3,
    failedLogins: 7,
    academicYear: "2024 - 2025",
  });

  return (
    <Paper elevation={0} sx={surfaceCardSx}>
      <Typography
        sx={{ fontSize: 18, fontWeight: 800, color: "text.primary", mb: 2 }}
      >
        État du système
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
          gap: 2,
          textAlign: "center",
        }}
      >
        <SummaryItem
          label="Utilisateurs actifs"
          value={systemStats.activeUsers}
          color="success.main"
        />
        <SummaryItem
          label="Comptes bloqués"
          value={systemStats.blockedAccounts}
          color="error.main"
        />
        <SummaryItem
          label="Connexions échouées"
          value={systemStats.failedLogins}
          color="warning.main"
        />
        <SummaryItem
          label="Année académique"
          value={systemStats.academicYear}
        />
      </Box>
    </Paper>
  );
}
