import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function MyAccount() {
  const { logout } = useAuth();
  const navigate = useNavigate();

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
        // garde ton style Tailwind
        className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium
                   bg-white/10 hover:bg-white/15 active:bg-white/20
                   border border-white/15 hover:border-white/25
                   transition text-white"
      >
        Mon compte
      </Button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        // pour que le menu colle mieux au bouton (optionnel)
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 200,
              borderRadius: 2,
              // glass theme
              backgroundColor: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
              color: "white",
              overflow: "hidden",
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
            color: "rgba(255,255,255,0.92)",
            px: 2,
            py: 1.2,
            "&:hover": { backgroundColor: "rgba(255,255,255,0.10)" },
          }}
        >
          Profil
        </MenuItem>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.12)", my: 0.2 }} />

        <MenuItem
          onClick={() => {
            handleClose();
            logout();
          }}
          sx={{
            fontSize: 14,
            color: "rgba(248,113,113,0.95)", // rouge doux (logout)
            px: 2,
            py: 1.2,
            "&:hover": { backgroundColor: "rgba(248,113,113,0.12)" },
          }}
        >
          Se déconnecter
        </MenuItem>
      </Menu>
    </div>
  );
}
