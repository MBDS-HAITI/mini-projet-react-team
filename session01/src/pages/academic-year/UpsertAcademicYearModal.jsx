import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import {
  createAcademicYear,
  updateAcademicYear,
} from "../../api/routes/academic-year.api.js";
import { validateAcademicYear } from "../../utils/validate-academic-year.js";
import {
  toDateInputValue,
  toISOEndOfDay,
  toISOStartOfDay,
} from "../../utils/helpers";
import { dialogPaperSx, titleSx, sectionSx, checkboxSx, btnCancelSx, btnSaveSx } from "../../utils/fieldStylesSx.js";
import { FormField } from "../../components/widgets/CustomFormField.jsx";


export default function UpsertAcademicYearModal({
  open,
  onClose,
  mode = "create", // "create" | "edit"
  data = null, // row pour edit
  onSuccess, // callback après save (refresh liste)
}) {
  const isEdit = mode === "edit";
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const id = data?._id || data?.id;

  const initialValues = useMemo(
    () => ({
      name: data?.name || "",
      startDate: toDateInputValue(data?.startDate),
      endDate: toDateInputValue(data?.endDate),
      isActive: typeof data?.isActive === "boolean" ? data.isActive : true,
    }),
    [data]
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validate: validateAcademicYear,
    onSubmit: async (values) => {
      setServerError("");
      setIsSubmitting(true);
      try {
        const payload = {
          name: values.name,
          startDate: toISOStartOfDay(values.startDate),
          endDate: toISOEndOfDay(values.endDate),
          isActive: values.isActive,
        };

        if (isEdit) await updateAcademicYear(id, payload);
        else await createAcademicYear(payload);

        onSuccess?.();
        onClose();
      } catch (e) {
        setServerError(e?.message || "Erreur lors de l’enregistrement");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (!open) {
      setServerError("");
      formik.resetForm();
    }
  }, [open]);

  const title = isEdit
    ? "Modifier une Année Académique"
    : "Ajouter une Année Académique";

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
        {serverError && <p className="text-red-400 text-sm mt-2">{serverError}</p>}

        <div className="flex flex-col gap-4 mt-4">
          <FormField
            formik={formik}
            name="name"
            label="Nom (ex: 2025-2026)"
          />
          <FormField
            formik={formik}
            name="startDate"
            label="Date de début"
            type="date"
            shrinkLabel
          />
          <FormField
            formik={formik}
            name="endDate"
            label="Date de fin"
            type="date"
            shrinkLabel
          />

          <FormControlLabel
            label={<span style={{ color: "white" }}>Année active</span>}
            control={
              <Checkbox
                sx={checkboxSx}
                checked={formik.values.isActive}
                onChange={(e) => formik.setFieldValue("isActive", e.target.checked)}
              />
            }
          />
        </div>
      </DialogContent>

      <DialogActions sx={sectionSx}>
        <Button onClick={onClose} variant="contained" sx={btnCancelSx}>
          Annuler
        </Button>
        <Button
          onClick={formik.handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          sx={btnSaveSx}
        >
          {isEdit ? "Mettre à jour" : "Ajouter"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
