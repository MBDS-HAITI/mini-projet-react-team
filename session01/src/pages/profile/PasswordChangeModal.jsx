import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Stack,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { changePassword } from "../../api/routes/auth.api";
import { validatePasswordForm } from "../../utils/validatePassword";

export default function PasswordChangeModal({ open, onClose }) {
  const theme = useTheme();
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handlePasswordChange = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    setPasswordError("");
    setSuccessMessage("");
  };

  const handleSubmitPassword = async () => {
    // Validation
    const validation = validatePasswordForm(passwordForm);
    if (!validation.isValid) {
      setPasswordError(validation.error);
      return;
    }

    setPasswordLoading(true);
    setPasswordError("");
    setSuccessMessage("");

    try {
      await changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });

      setSuccessMessage("Mot de passe changé avec succès!");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });

      // Fermer la modale après 2 secondes
      setTimeout(() => {
        onClose();
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Une erreur s'est produite lors du changement du mot de passe";
      setPasswordError(errorMessage);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleClose = () => {
    if (!passwordLoading) {
      onClose();
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordError("");
      setSuccessMessage("");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: alpha(theme.palette.background.paper, 0.95),
          backdropFilter: "blur(12px)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: 20,
          fontWeight: 950,
          color: "text.primary",
          pb: 1,
        }}
      >
        Changer mon mot de passe
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 2 }}>
          {passwordError && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {passwordError}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ borderRadius: 2 }}>
              {successMessage}
            </Alert>
          )}

          <TextField
            fullWidth
            type="password"
            label="Mot de passe actuel"
            placeholder="Entrez votre mot de passe actuel"
            value={passwordForm.oldPassword}
            onChange={(e) => handlePasswordChange("oldPassword", e.target.value)}
            disabled={passwordLoading}
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.4),
                "&:hover fieldset": { borderColor: "divider" },
              },
            }}
          />

          <TextField
            fullWidth
            type="password"
            label="Nouveau mot de passe"
            placeholder="Minimum 8 caractères"
            value={passwordForm.newPassword}
            onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
            disabled={passwordLoading}
            variant="outlined"
            size="small"
            helperText="Min. 8 caractères"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.4),
                "&:hover fieldset": { borderColor: "divider" },
              },
            }}
          />

          <TextField
            fullWidth
            type="password"
            label="Confirmer le mot de passe"
            placeholder="Répétez votre nouveau mot de passe"
            value={passwordForm.confirmPassword}
            onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
            disabled={passwordLoading}
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.4),
                "&:hover fieldset": { borderColor: "divider" },
              },
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={handleClose}
          disabled={passwordLoading}
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 900,
            borderColor: "divider",
            color: "text.primary",
            backgroundColor: alpha(theme.palette.background.paper, 0.55),
            backdropFilter: "blur(12px)",
            "&:hover": { backgroundColor: theme.palette.action.hover, borderColor: "divider" },
          }}
        >
          Annuler
        </Button>

        <Button
          onClick={handleSubmitPassword}
          disabled={passwordLoading}
          variant="contained"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 950,
            color: "#fff",
            boxShadow: "none",
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            "&:hover": {
              opacity: 0.92,
              boxShadow: "none",
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            },
            "&:disabled": {
              opacity: 0.6,
            },
          }}
        >
          {passwordLoading ? "Changement en cours..." : "Changer le mot de passe"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
