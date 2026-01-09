import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import { useState } from "react";

export default function RecentActivity({
  surfaceCardSx,
}) {
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
    <Paper elevation={0} sx={surfaceCardSx}>
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 800,
          color: "text.primary",
          mb: 2,
        }}
      >
        Activités récentes
      </Typography>

      <List
        disablePadding
        sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
      >
        {activities.map((a) => (
          <ListItem
            key={a.id}
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid",
              borderBottomColor: "divider",
              pb: 1,
            }}
          >
            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
              {a.action}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "text.muted" }}>
              {a.user} • {a.date}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
