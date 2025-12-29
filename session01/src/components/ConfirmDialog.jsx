// components/ConfirmDialog.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

export default function ConfirmDialog({
  open,
  title = "Confirmation",
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  onClose,
  onConfirm,
  loading = false,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          bgcolor: "rgba(15, 23, 42, 0.92)",
          color: "white",
          borderRadius: 3,
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(10px)",
        },
      }}
      slotProps={{
        backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.65)" } },
      }}
    >
      <DialogTitle sx={{ color: "white", bgcolor: "rgba(0,0,0,0.15)" }}>
        {title}
      </DialogTitle>

      <DialogContent sx={{ bgcolor: "rgba(0,0,0,0.10)" }}>
        <div className="mt-3">{message}</div>
      </DialogContent>

      <DialogActions sx={{ bgcolor: "rgba(0,0,0,0.10)" }}>
        <Button onClick={onClose} variant="contained" sx={{ bgcolor: "#1e3a8a" }}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={loading}
          sx={{ bgcolor: "#dc2626", "&:hover": { bgcolor: "#b91c1c" } }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
