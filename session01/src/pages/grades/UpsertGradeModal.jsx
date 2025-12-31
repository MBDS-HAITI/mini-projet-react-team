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
  MenuItem,
} from "@mui/material";

import { createGrade, updateGrade } from "../../api/routes/grade.api.js";
import { getEnrollments } from "../../api/routes/enrollment.api.js";

import { validateGrade } from "../../utils/validate-grade.js";

import {
  dialogPaperSx,
  titleSx,
  sectionSx,
  checkboxSx,
  btnCancelSx,
  btnSaveSx,
} from "../../utils/fieldStylesSx.js";

import { FormField } from "../../components/widgets/CustomFormField.jsx";

export default function UpsertGradeModal({
  open,
  onClose,
  mode = "create", // "create" | "edit"
  data = null, // semestre pour edit
  onSuccess, // callback refresh
}) {
  const isEdit = mode === "edit";
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enrollments, setEnrollments] = useState([]);

  const id = data?._id || data?.id;

  const fetchEnrollments = async () => {
    try {
      const result = await getEnrollments();
      
      setEnrollments(result);
    } catch (e) {
      console.error("Erreur chargement enrollments:", e);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  // Valeurs initiales
  const initialValues = useMemo(
    () => ({
      enrollment:
        data?.enrollment?._id || data?.enrollment?.id || data?.enrollment || "",
      value: data?.value || "",
      isPublished:
        typeof data?.isPublished === "boolean" ? data.isPublished : false,
    }),
    [data]
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validate: validateGrade,
    onSubmit: async (values) => {
      setServerError("");
      setIsSubmitting(true);

      try {
        const enrollment =
          typeof values.enrollment === "object"
            ? values.enrollment?._id
            : values.enrollment;

        const payload = {
          enrollment: enrollment,
          name: values.name,
          value: Number(values.value),
          isPublished: values.isPublished,
        };

        if (isEdit) await updateGrade(id, payload);
        else await createGrade(payload);

        onSuccess?.();
        onClose();
      } catch (e) {
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "Erreur lors de l’enregistrement";

        setServerError(msg);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  //  Reset quand on ferme le modal
  useEffect(() => {
    if (!open) {
      setServerError("");
      formik.resetForm();
    }
  }, [open]);

  const title = isEdit ? "Modifier un Semestre" : "Ajouter un Semestre";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: dialogPaperSx }}
      slotProps={{
        backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.65)" } },
      }}
    >
      <DialogTitle sx={titleSx}>{title}</DialogTitle>

      <DialogContent sx={sectionSx}>
        {serverError && (
          <p className="text-red-400 text-sm mt-2">{serverError}</p>
        )}

        <div className="flex flex-col gap-4 mt-4">
          {/*  Année académique */}
          <FormField
            formik={formik}
            name="enrollment"
            label="Inscription"
            select
          >
            {enrollments.map((enrollment) => (
              <MenuItem key={enrollment._id} value={enrollment._id}>
                {enrollment.student?.lastName?.toUpperCase()} {enrollment.student?.firstName} - {enrollment.course?.name} ({enrollment.semester?.name}-{enrollment.semester?.academicYear?.name})
              </MenuItem>
            ))}
          </FormField>

          {/*  Nom : recommandé en select car backend enum S1 / S2 */}
          <FormField formik={formik} name="value" label="Note" shrinkLabel type="number" />

          {/*  Dates */}

          <FormField
            formik={formik}
            name="gradeAt"
            label="Date de la note"
            type="date"
            shrinkLabel
          />

          <FormControlLabel
            label={<span style={{ color: "white" }}>Publiée</span>}
            control={
              <Checkbox
                sx={checkboxSx}
                checked={formik.values.isPublished}
                onChange={(e) =>
                  formik.setFieldValue("isPublished", e.target.checked)
                }
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
