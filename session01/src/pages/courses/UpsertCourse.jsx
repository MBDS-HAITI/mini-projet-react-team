import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import { createCourse, updateCourse } from "../../api/routes/course.api.js";
import { validateCourse } from "../../utils/validate-course.js";
import {
  toDateInputValue,
  toISOEndOfDay,
  toISOStartOfDay,
} from "../../utils/helpers";
import {
  dialogPaperSx,
  titleSx,
  sectionSx,
  checkboxSx,
  btnCancelSx,
  btnSaveSx,
} from "../../utils/fieldStylesSx.js";
import { FormField } from "../../components/widgets/CustomFormField.jsx";

export default function UpsertCourseModal({
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
      code: data?.code || "",
      credits: data?.credits || "",
    }),
    [data]
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validate: validateCourse,
    onSubmit: async (values) => {
      setServerError("");
      setIsSubmitting(true);
      try {
        const payload = {
          name: values.name,
          code: values.code,
          credits: Number(values.credits),
        };

        if (isEdit) await updateCourse(id, payload);
        else await createCourse(payload);

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

  const title = isEdit ? "Modifier un cours" : "Ajouter un cours";

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
        {serverError && (
          <p className="text-red-400 text-sm mt-2">{serverError}</p>
        )}

        <div className="flex flex-col gap-4 mt-4">
          <FormField formik={formik} name="name" label="Nom Javascript 101" />
          <FormField
            formik={formik}
            name="code"
            label="Code"
            type="text"
            shrinkLabel
          />
          <FormField
            formik={formik}
            name="credits"
            label="Crédits"
            type="number"
            shrinkLabel
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
