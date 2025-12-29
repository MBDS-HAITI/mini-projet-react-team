import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  CircularProgress,
} from "@mui/material";

import { getAcademicYearDetails } from "../../api/routes/academic-year.api.js";
import { formatDate } from "../../utils/fdate";

// styles factorisés (adapte le chemin)
import { dialogPaperSx, titleSx, sectionSx, btnCancelSx } from "../../utils/fieldStylesSx.js";
import Loading from "../../components/common/Loading.jsx";

export default function AcademicYearDetailsModal({
  open,
  onClose,
  academicYearId,
}) {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [details, setDetails] = useState(null);

  const year = details?.academicYear;
  const semesters = details?.semesters ?? [];
  const totals = details?.totals ?? { enrollments: 0, grades: 0 };

  useEffect(() => {
    if (!open || !academicYearId) return;

    const run = async () => {
      setLoading(true);
      setServerError("");
      try {
        const data = await getAcademicYearDetails(academicYearId);
        setDetails(data);
      } catch (e) {
        setServerError(e?.message || "Erreur lors du chargement des détails");
        setDetails(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [open, academicYearId]);

  useEffect(() => {
    if (!open) {
      setDetails(null);
      setServerError("");
      setLoading(false);
    }
  }, [open]);

  const title = useMemo(() => {
    if (!year) return "Détails année académique";
    return `Détails — ${year.name}`;
  }, [year]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: dialogPaperSx }}
      slotProps={{ backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.65)" } } }}
    >
      <DialogTitle sx={titleSx}>{title}</DialogTitle>

      <DialogContent sx={sectionSx}>
        {loading && <Loading title="Chargement des détails…" subtitle="Merci de patienter." />}


        {serverError && <p className="text-red-400 text-sm mt-3">{serverError}</p>}

        {!loading && year && (
          <div className="mt-4 space-y-4">
            {/* Summary Year */}
            <div className="flex flex-wrap items-center gap-3">
              <Chip
                label={`Période: ${formatDate(year.startDate)} → ${formatDate(year.endDate)}`}
                sx={{
                  bgcolor: "rgba(255,255,255,0.08)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              />
              <Chip
                label={year.isActive ? "Année active" : "Année inactive"}
                sx={{
                  bgcolor: year.isActive ? "rgba(167,139,250,0.22)" : "rgba(255,255,255,0.06)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              />
              <Chip
                label={`Total inscriptions: ${totals.enrollments ?? 0}`}
                sx={{
                  bgcolor: "rgba(255,255,255,0.06)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              />
              <Chip
                label={`Total notes: ${totals.grades ?? 0}`}
                sx={{
                  bgcolor: "rgba(255,255,255,0.06)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              />
            </div>

            {/* Semesters table */}
            <div className="rounded-xl overflow-hidden border border-white/10">
              <Table size="small" sx={{ color: "white" }}>
                <TableHead>
                  <TableRow>
                    {["Semestre", "Début", "Fin", "Inscriptions", "Notes Publiées"].map((h) => (
                      <TableCell
                        key={h}
                        sx={{
                          color: "#cbd5f5",
                          fontWeight: "bold",
                          borderBottom: "1px solid rgba(255,255,255,0.15)",
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {semesters.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ color: "white", opacity: 0.8 }}>
                        Aucun semestre trouvé pour cette année.
                      </TableCell>
                    </TableRow>
                  ) : (
                    semesters.map((s) => (
                      <TableRow
                        key={s._id}
                        hover
                        sx={{
                          "&:hover": { backgroundColor: "rgba(255,255,255,0.05)" },
                        }}
                      >
                        <TableCell sx={{ color: "white" }}>{s.name}</TableCell>
                        <TableCell sx={{ color: "white" }}>{formatDate(s.startDate)}</TableCell>
                        <TableCell sx={{ color: "white" }}>{formatDate(s.endDate)}</TableCell>
                        <TableCell sx={{ color: "white" }}>{s.enrollmentsCount ?? 0}</TableCell>
                        <TableCell sx={{ color: "white" }}>{s.gradesCount ?? 0}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
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
