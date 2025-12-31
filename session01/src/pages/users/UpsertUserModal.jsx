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

import { createUser, updateUser } from "../../api/routes/user.api.js";
import { getAllStudents } from "../../api/routes/student.api.js";

import {
  dialogPaperSx,
  titleSx,
  sectionSx,
  checkboxSx,
  btnCancelSx,
  btnSaveSx,
} from "../../utils/fieldStylesSx.js";

import { FormField } from "../../components/widgets/CustomFormField.jsx";
import { validateUser } from "../../utils/validate-user.js";


export default function UpsertUserModal({
  open,
  onClose,
  mode = "create", // "create" | "edit"
  data = null,     // user pour edit
  onSuccess,       // callback refresh
}) {
  const isEdit = mode === "edit";
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [students, setStudents] = useState([]);

  const id = data?._id || data?.id;

  // Charger les étudiants pour le select (si role=STUDENT)
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const result = await getAllStudents();
        setStudents(result || []);
      } catch (e) {
        console.error("Erreur chargement students:", e);
      }
    };
    fetchStudents();
  }, []);

  const initialValues = useMemo(
    () => ({
      email: data?.email || "",
      username: data?.username || "",
      password: "", // create uniquement
      role: data?.role || "STUDENT",
      student:
        data?.student?._id ||
        data?.student?.id ||
        (typeof data?.student === "string" ? data.student : "") ||
        "",
      isActive: typeof data?.isActive === "boolean" ? data.isActive : true,
    }),
    [data]
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validate: (values) => validateUser(values, { isEdit }),
    onSubmit: async (values) => {
      setServerError("");
      setIsSubmitting(true);

      try {
        const studentId =
          typeof values.student === "object" ? values.student?._id : values.student;

        // payload commun
        const payload = {
          email: values.email?.trim(),
          username: values.username?.trim() || undefined,
          role: values.role,
          student: values.role === "STUDENT" ? (studentId || null) : null,
          isActive: values.isActive,
        };

        if (!isEdit) {
          payload.password = values.password; // obligatoire en create
          await createUser(payload);
        } else {
          await updateUser(id, payload);
        }

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

  // reset à la fermeture
  useEffect(() => {
    if (!open) {
      setServerError("");
      formik.resetForm();
    }
  }, [open]);

  // Quand role change: si pas STUDENT => vider student
  useEffect(() => {
    if (formik.values.role !== "STUDENT" && formik.values.student) {
      formik.setFieldValue("student", "");
    }
  }, [formik.values.role]);

  const title = isEdit ? "Modifier un utilisateur" : "Ajouter un utilisateur";

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
          {/* Email */}
          <FormField
            formik={formik}
            name="email"
            label="Email"
            type="email"
          />

          {/* Username */}
          <FormField formik={formik} name="username" label="Username (optionnel)" />

          {/* Password (create seulement) */}
          {!isEdit && (
            <FormField
              formik={formik}
              name="password"
              label="Mot de passe"
              type="password"
            />
          )}

          {/* Role */}
          <FormField formik={formik} name="role" label="Rôle" select>
            <MenuItem value="ADMIN">ADMIN</MenuItem>
            <MenuItem value="SCOLARITE">SCOLARITE</MenuItem>
            <MenuItem value="STUDENT">STUDENT</MenuItem>
          </FormField>

          {/* Student (si role STUDENT) */}
          {formik.values.role === "STUDENT" && (
            <FormField formik={formik} name="student" label="Étudiant" select>
              {students.map((s) => (
                <MenuItem key={s._id} value={s._id}>
                  {s.studentCode ? `${s.studentCode} - ` : ""}
                  {s.firstName} {s.lastName}
                </MenuItem>
              ))}
            </FormField>
          )}

          <FormControlLabel
            label={<span style={{ color: "white" }}>Utilisateur actif</span>}
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
