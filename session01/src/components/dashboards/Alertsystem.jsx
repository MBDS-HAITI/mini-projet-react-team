import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

export default function AlertSystem({ surfaceCardSx, alerts = [], theme }) {
  if (!Array.isArray(alerts) || alerts.length === 0) return null;

  const iconByType = {
    warning: AlertTriangle,
    danger: AlertCircle,
    info: Info,
  };

  const colorByType = {
    warning: theme.palette.warning.main,
    danger: theme.palette.error.main,
    info: theme.palette.info.main,
  };

  return (
    <Paper elevation={0} sx={surfaceCardSx}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
        <AlertTriangle size={18} color={theme.palette.error.main} />
        <Typography sx={{ fontWeight: 800 }}>
          Alertes système
        </Typography>
      </Stack>

      <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {alerts.map((alert, index) => {
          const Icon = iconByType[alert.type] || Info;

          return (
            <ListItem
              key={index}
              disableGutters
              sx={{ color: colorByType[alert.type] }}
            >
              <Icon size={14} style={{ marginRight: 6 }} />
              {alert.message}
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
}
