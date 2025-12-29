import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
} from "@mui/material";

import { getSemesterById } from "../../api/routes/semester.api.js";
import { formatDate } from "../../utils/fdate";

import { dialogPaperSx, titleSx, sectionSx, btnCancelSx } from "../../utils/fieldStylesSx.js";
import Loading from "../../components/common/Loading.jsx";

export default function SemesterDetailsModal({
  open,
  onClose,
  semesterId,
}) {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [semester, setSemester] = useState(null);

  useEffect(() => {
    if (!open || !semesterId) return;

    const run = async () => {
      setLoading(true);
      setServerError("");
      try {
        const data = await getSemesterById(semesterId);
        setSemester(data);
      } catch (e) {
        setServerError(e?.message || "Erreur lors du chargement des détails");
        setSemester(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [open, semesterId]);

  useEffect(() => {
    if (!open) {
      setSemester(null);
      setServerError("");
      setLoading(false);
    }
  }, [open]);

  const title = useMemo(() => {
    if (!semester) return "Détails semestre";
    return `Détails — ${semester.name}`;
  }, [semester]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: dialogPaperSx }}
      slotProps={{ backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.65)" } } }}
    >
      <DialogTitle sx={titleSx}>{title}</DialogTitle>

      <DialogContent sx={sectionSx}>
        {loading && <Loading title="Chargement des détails…" subtitle="Merci de patienter." />}

        {serverError && (
          <p className="text-red-400 text-sm mt-3">{serverError}</p>
        )}

        {!loading && semester && (
          <div className="mt-4 space-y-4">
            <div className="flex flex-wrap gap-3">
              <Chip
                label={`Année: ${semester.academicYear?.name || "-"}`}
                sx={{
                  bgcolor: "rgba(255,255,255,0.08)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              />

              <Chip
                label={`Période: ${formatDate(semester.startDate)} → ${formatDate(
                  semester.endDate
                )}`}
                sx={{
                  bgcolor: "rgba(255,255,255,0.08)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              />

              <Chip
                label={semester.isActive ? "Semestre actif" : "Semestre inactif"}
                sx={{
                  bgcolor: semester.isActive
                    ? "rgba(167,139,250,0.22)"
                    : "rgba(255,255,255,0.06)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              />
            </div>

            <div className="text-white text-sm space-y-2 opacity-90">
              <p>
                <b>Créé le :</b> {formatDate(semester.createdAt)}
              </p>
              <p>
                <b>Modifié le :</b> {formatDate(semester.updatedAt)}
              </p>
            </div>
          </div>
        )}
      </DialogContent>

      <DialogActions sx={sectionSx}>
        <Button onClick={onClose} variant="contained" sx={btnCancelSx}>
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
