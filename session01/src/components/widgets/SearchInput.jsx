// src/components/widgets/SearchInput.jsx
import * as React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { useTheme } from "@mui/material/styles";
import { Search } from "lucide-react";

export default function SearchInput({
  search,
  setSearch,
  setPage,
  placeholder = "Rechercher par nom...",
}) {
  const theme = useTheme();

  return (
    <TextField
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setPage(0);
      }}
      placeholder={placeholder}
      fullWidth
      size="small"
      sx={{
        width: { xs: "100%", md: 288 }, // md:w-72
        "& .MuiOutlinedInput-root": {
          borderRadius: 2, // rounded-lg
          backgroundColor: theme.palette.background.paperGlass,
          backdropFilter: "blur(14px)",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.borders?.container ?? theme.palette.divider,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.divider,
        },
        "& .MuiOutlinedInput-input": {
          color: theme.palette.text.primary,
          paddingTop: 1,
          paddingBottom: 1,
        },
        "& .MuiInputBase-input::placeholder": {
          color: theme.palette.text.muted,
          opacity: 1,
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
          borderWidth: 2, // focus:ring-2
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                color: theme.palette.text.muted,
              }}
            >
              <Search size={18} />
            </span>
          </InputAdornment>
        ),
      }}
    />
  );
}
