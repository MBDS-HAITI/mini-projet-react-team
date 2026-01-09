// src/components/layout/Container.jsx
import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import SearchInput from "../widgets/SearchInput";
import SortButton from "../widgets/SortButton";
import AddButton from "../widgets/AddButton";

export default function Container({
  children,
  title,
  search,
  setSearch,
  sortAsc,
  setSortAsc,
  onAdd,
  setPage,
  canManage = true,
}) {
  const theme = useTheme();

  return (
    <Box sx={{ my: 1, mx: { xs: 0, md: 2 } }}>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: { xs: 480, md: "100%" }, // max-w-sm -> md:max-w-screen
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          borderRadius: 3, // rounded-2xl
          p: { xs: 1, md: 3 }, // p-2 -> md:p-6
          backdropFilter: "blur(16px)",
          backgroundColor: theme.palette.background.paperGlass,
          border: "1px solid",
          borderColor: theme.palette.borders.container,
          boxShadow: theme.palette.effects.containerShadow,
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontWeight: 800,
            textAlign: "center",
            p: 1,
            mb: { xs: 0, md: 3 },
            fontSize: { xs: 18, md: 24 },
            color: "text.primary",
          }}
        >
          {title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: { xs: "flex-end", md: "space-between" },
            gap: 2,
            mb: { xs: 1, md: 3 },
          }}
        >
          <SearchInput
            placeholder="Recherche code, nom, sexe, adr..."
            search={search}
            setSearch={setSearch}
            setPage={setPage}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <SortButton sortAsc={sortAsc} setSortAsc={setSortAsc} />
            {canManage && <AddButton onAdd={onAdd} />}
          </Box>
        </Box>

        {children}
      </Paper>
    </Box>
  );
}
