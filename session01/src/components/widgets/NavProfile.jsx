import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

export default function MyAccount() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const isLight = theme.palette.mode === "light";

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const goToProfile = () => {
    handleClose();
    navigate("/profile");
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition"
        sx={{
          fontWeight: "bold",

          color: isLight ? "#0F172A" : "#fff",
          backgroundColor: isLight ? "#FFFFFF" : "rgba(255,255,255,0.10)",
          border: isLight
            ? "1px solid rgba(15,23,42,0.10)"
            : "1px solid rgba(255,255,255,0.15)",
          boxShadow: isLight ? "0 10px 25px rgba(15,23,42,0.06)" : "none",

          "&:hover": {
            backgroundColor: isLight ? "#FFFFFF" : "rgba(255,255,255,0.15)",
            border: isLight
              ? "1px solid rgba(15,23,42,0.18)"
              : "1px solid rgba(255,255,255,0.25)",
          },
        }}
      >
        Mon compte
      </Button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 200,
              borderRadius: 2,
              overflow: "hidden",

              backgroundColor: isLight
                ? "#FFFFFF"
                : "rgba(255,255,255,0.08)",

              color: isLight ? "#0F172A" : "white",

              border: isLight
                ? "1px solid rgba(15,23,42,0.10)"
                : "1px solid rgba(255,255,255,0.18)",

              boxShadow: isLight
                ? "0 18px 45px rgba(15,23,42,0.12)"
                : "0 16px 40px rgba(0,0,0,0.35)",

              backdropFilter: isLight ? "none" : "blur(14px)",
              WebkitBackdropFilter: isLight ? "none" : "blur(14px)",
            },
          },
        }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
          sx: {
            py: 0.5,
          },
        }}
      >
        <MenuItem
          onClick={goToProfile}
          sx={{
            fontSize: 14,
            px: 2,
            py: 1.2,

            color: isLight
              ? "rgba(15,23,42,0.88)"
              : "rgba(255,255,255,0.92)",

            "&:hover": {
              backgroundColor: isLight
                ? "rgba(15,23,42,0.06)"
                : "rgba(255,255,255,0.10)",
            },
          }}
        >
          Profil
        </MenuItem>

        <Divider
          sx={{
            my: 0.2,
            borderColor: isLight
              ? "rgba(15,23,42,0.10)"
              : "rgba(255,255,255,0.12)",
          }}
        />

        <MenuItem
          onClick={() => {
            handleClose();
            logout();
          }}
          sx={{
            fontSize: 14,
            px: 2,
            py: 1.2,

            color: isLight
              ? "rgba(239,68,68,0.95)"
              : "rgba(248,113,113,0.95)",

            "&:hover": {
              backgroundColor: isLight
                ? "rgba(239,68,68,0.10)"
                : "rgba(248,113,113,0.12)",
            },
          }}
        >
          Se déconnecter
        </MenuItem>
      </Menu>
    </div>
  );
}
