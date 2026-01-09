// src/components/widgets/SortButton.jsx

import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function SortButton({ sortAsc, setSortAsc }) {
  const theme = useTheme();

  return (
    <Button
      onClick={() => setSortAsc(!sortAsc)}
      variant="outlined"
      startIcon={sortAsc ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
      sx={{
        textTransform: "none",
        fontWeight: 700,
        borderRadius: 2, // rounded-lg
        px: { xs: 1, md: 2 }, // px-2 -> md:px-4
        py: { xs: 0.5, md: 1 }, // py-1 -> md:py-2
        backgroundColor: theme.palette.background.paperGlass,
        backdropFilter: "blur(14px)",
        borderColor: theme.palette.borders?.container ?? theme.palette.divider,
        color: theme.palette.text.primary,
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
          borderColor: theme.palette.divider,
        },
      }}
    >
      Trier
    </Button>
  );
}
