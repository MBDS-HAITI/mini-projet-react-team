import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import { AlertTriangle } from "lucide-react";

export default function AlertSystem({ surfaceCardSx, theme }) {
  return (
    <Paper elevation={0} sx={surfaceCardSx}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
        <AlertTriangle size={18} color={theme.palette.error.main} />
        <Typography sx={{ fontWeight: 800, color: "text.primary" }}>
          Alertes système
        </Typography>
      </Stack>

      <List
        disablePadding
        sx={{ display: "flex", flexDirection: "column", gap: 1 }}
      >
        <ListItem disableGutters sx={{ color: "text.secondary" }}>
          • 3 comptes bloqués
        </ListItem>
        <ListItem disableGutters sx={{ color: "text.secondary" }}>
          • Connexions suspectes détectées
        </ListItem>
        <ListItem disableGutters sx={{ color: "text.secondary" }}>
          • Sauvegarde système recommandée
        </ListItem>
      </List>
    </Paper>
  );
}
