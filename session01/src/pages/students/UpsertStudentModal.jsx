import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { validateStudent } from "../../utils/validate-student";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  MenuItem,
} from "@mui/material";
import {
  btnCancelSx,
  btnSaveSx,
  checkboxSx,
  dialogPaperSx,
  sectionSx,
  titleSx,
} from "../../utils/fieldStylesSx";
import { toDateInputValue, toISOStartOfDay } from "../../utils/helpers";
import { FormField } from "../../components/widgets/CustomFormField";
import { createStudent, updateStudent } from "../../api/routes/student.api";

export default function UpsertStudentModal({
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
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      studentCode: data?.studentCode || "",
      dateOfBirth: toDateInputValue(data?.dateOfBirth),
      phone: data?.phone || "",
      address: data?.address || "",
      sex: data?.sex || "",
      haveAccount:
        typeof data?.haveAccount === "boolean" ? data.haveAccount : false,
    }),
    [data]
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validate: validateStudent,
    onSubmit: async (values) => {
      setServerError("");
      setIsSubmitting(true);
      try {
        const payload = {
          firstName: values.firstName,
          lastName: values.lastName,
          studentCode: values.studentCode,
          dateOfBirth: toISOStartOfDay(values.dateOfBirth),
          phone: values.phone,
          address: values.address,
          sex: values.sex,
          haveAccount: values.haveAccount,
        };

        if (isEdit) await updateStudent(id, payload);
        else await createStudent(payload);
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

  const title = isEdit ? "Modifier un Étudiant" : "Ajouter un Étudiant";

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
          <FormField
            formik={formik}
            name="firstName"
            label="Prénom"
            shrinkLabel
          />
          <FormField formik={formik} name="lastName" label="Nom" shrinkLabel />
          <FormField
            formik={formik}
            name="studentCode"
            label="Code Étudiant"
            shrinkLabel
          />
          <FormField
            formik={formik}
            name="dateOfBirth"
            label="Date de Naissance"
            type="date"
            shrinkLabel
          />
          <FormField
            formik={formik}
            name="phone"
            label="Téléphone"
            shrinkLabel
          />
          <FormField
            formik={formik}
            name="address"
            label="Adresse"
            shrinkLabel
          />
          <FormField formik={formik} name="sex" label="Sexe" select>
            <MenuItem value="M">Masculin</MenuItem>
            <MenuItem value="F">Féminin</MenuItem>
          </FormField>
          <FormControlLabel
            label={<span style={{ color: "white" }}>Possède un compte</span>}
            control={
              <Checkbox
                sx={checkboxSx}
                checked={formik.values.haveAccount}
                onChange={(e) =>
                  formik.setFieldValue("haveAccount", e.target.checked)
                }
                disabled
              />
            }
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" sx={btnCancelSx}>
          Annuler
        </Button>
        <Button
          onClick={formik.handleSubmit}
          disabled={isSubmitting}
          variant="contained"
          sx={btnSaveSx}
        >
          {isEdit ? "Mettre à jour" : "Ajouter"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
