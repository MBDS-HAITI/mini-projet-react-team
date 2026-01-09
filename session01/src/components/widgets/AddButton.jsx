// src/components/widgets/AddButton.jsx
import * as React from "react";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import { Plus } from "lucide-react";

export default function AddButton({ onAdd }) {
  const theme = useTheme();

  return (
    <Button
      onClick={onAdd}
      variant="contained"
      startIcon={<Plus size={18} />}
      sx={{
        textTransform: "none",
        fontWeight: 800,
        borderRadius: 2, // rounded-lg
        px: { xs: 1, md: 2 }, // px-2 -> md:px-4
        py: { xs: 0.5, md: 1 }, // py-1 -> md:py-2
        color: "#fff",
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark || "#4338CA"})`,
        boxShadow: "none",
        "&:hover": {
          opacity: 0.92, // hover:opacity-90
          boxShadow: "none",
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark || "#4338CA"})`,
        },
      }}
    >
      Ajouter
    </Button>
  );
}
