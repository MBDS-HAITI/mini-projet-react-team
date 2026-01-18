import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import {formatDate}  from "../../utils/fdate";

export default function RecentActivity({
  surfaceCardSx, recentActivities
})
{
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
        {recentActivities.map((a) => (
          <ListItem
            key={`${a.user}-${a.action}-${a.date}`}
            // disableGutters
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
              {a.user} • {formatDate(a.date)}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
