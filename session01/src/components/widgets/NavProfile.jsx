// src/components/widgets/MyAccount.jsx
import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { alpha, useTheme } from "@mui/material/styles";
import { useAuth } from "../../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function MyAccount() {
  const theme = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const goToProfile = () => {
    handleClose();
    navigate("/profile");
  };


  const triggerSx = {
    borderRadius: 2,
    px: 1.5,
    py: 0.4,
    fontSize: 13,
    fontWeight: 900,
    textTransform: "none",
    border: "1px solid",
    borderColor: "divider",
    color: "text.primary",
    backgroundColor: alpha(theme.palette.background.paper, 0.3),
    backdropFilter: "blur(12px)",
    boxShadow: "none",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      boxShadow: "none",
    },
    "&:active": {
      backgroundColor: alpha(theme.palette.background.paper, 0.75),
    },
  };

  const menuPaperSx = {
    mt: 1,
    minWidth: 220,
    borderRadius: 2,
    border: "1px solid",
    borderColor: "divider",
    backgroundColor: alpha(theme.palette.background.paper, 0.72),
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    boxShadow: theme.shadows[12],
    color: theme.palette.text.primary,
    overflow: "hidden",
  };

  const itemSx = {
    fontSize: 14,
    px: 2,
    py: 1,
    color: "text.primary",
    "&:hover": { backgroundColor: "action.hover" },
  };

  return (
    <div>
      <Button
        id="my-account-button"
        aria-controls={open ? "my-account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={triggerSx}
      >
        Mon compte
      </Button>

      <Menu
        id="my-account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: { sx: menuPaperSx },
        }}
        MenuListProps={{
          "aria-labelledby": "my-account-button",
          sx: { py: 0.5 },
        }}
      >
        <MenuItem onClick={goToProfile} sx={itemSx}>
          Profil
        </MenuItem>

        <Divider sx={{ borderColor: "divider", my: 0.25 }} />

        <MenuItem
          onClick={() => {
            handleClose();
            logout();
          }}
          sx={{
            ...itemSx,
            color: "error.main",
            "&:hover": {
              backgroundColor: alpha(theme.palette.error.main, 0.12),
            },
          }}
        >
          Se déconnecter
        </MenuItem>
      </Menu>
    </div>
  );
}
