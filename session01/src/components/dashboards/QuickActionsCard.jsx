
import * as React from "react";
import { Paper, Box, Typography } from "@mui/material";


export default function QuickActionsCard({
  title = "Actions rapides",
  surfaceCardSx,
  actions,
  ActionButtonComponent,
}) {
  return (
    <Paper elevation={0} sx={surfaceCardSx}>
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 800,
          color: "text.primary",
          mb: 1,
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
          gap: 1.5,
        }}
      >
        {actions.map((a, idx) => (
          <ActionButtonComponent
            key={a.key ?? `${a.label}-${idx}`}
            icon={a.icon}
            label={a.label}
            onClick={a.onClick}
          />
        ))}
      </Box>
    </Paper>
  );
}
