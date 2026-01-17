

import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";

import {
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Configuration({configurations, surfaceCardSx, theme}) {

    const navigate = useNavigate();

    if (!configurations.length) return null;

  return (
    <Paper elevation={0} sx={surfaceCardSx}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 1.5 }}
            >
              <Settings size={18} color={theme.palette.secondary.main} />
              <Typography sx={{ fontWeight: 800, color: "text.primary" }}>
                Configuration
              </Typography>
            </Stack>

            <List
              disablePadding
              sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            >
              {configurations.map((item) => (
                <ListItem
                  key={item.to}
                  disableGutters
                  sx={{
                    cursor: "pointer",
                    color: "text.secondary",
                    "&:hover": { color: "text.primary" },
                  }}
                  onClick={() => navigate(item.to)}
                >
                  • {item.label}
                </ListItem>
              ))}
            </List>
          </Paper>
  )
}
