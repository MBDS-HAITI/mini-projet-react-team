import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
} from "@mui/material";

import {
  createEnrollment,
  updateEnrollment,
} from "../../api/routes/enrollment.api.js";

import { validateEnrollment } from "../../utils/validate-enrollment.js";

import {
  dialogPaperSx,
  titleSx,
  sectionSx,
  btnCancelSx,
  btnSaveSx,
} from "../../utils/fieldStylesSx.js";

import { FormField } from "../../components/widgets/CustomFormField.jsx";
import { getAcademicYears } from "../../api/routes/academic-year.api.js";
import { getSemesters } from "../../api/routes/semester.api.js";
import { getCourses } from "../../api/routes/course.api.js";
import { getAllStudents } from "../../api/routes/student.api.js";

export default function UpsertEnrollmentModal({
  open,
  onClose,
  mode = "create", // "create" | "edit"
  data = null, // semestre pour edit
  onSuccess, // callback refresh
}) {
  const isEdit = mode === "edit";
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dependencies for select fields
  const [academicYears, setAcademicYears] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const id = data?._id || data?.id;

  const fetchAcademicYears = async () => {
    const result = await getAcademicYears();
    setAcademicYears(result);
  };

  const fetchSemesters = async () => {
    const result = await getSemesters();
    setSemesters(result);
  };
  const fetchCourses = async () => {
    const result = await getCourses();
    setCourses(result);
  };

  const fetchStudents = async () => {
    const result = await getAllStudents();
    setStudents(result);
  };

  // Charger les dépendances
  useEffect(() => {
    fetchAcademicYears();
    fetchSemesters();
    fetchCourses();
    fetchStudents();
  }, []);



  // Valeurs initiales
  const initialValues = useMemo(
    () => ({
      academicYear: data?.semester?.academicYear?._id || "",
      semester: data?.semester?._id || "",
      course: data?.course?._id || "",
      student: data?.student?._id || "",
      status: data?.status || "ENROLLED",
    }),
    [data]
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validate: validateEnrollment,
    onSubmit: async (values) => {
      setServerError("");
      setIsSubmitting(true);

      try {
        const academicYearId =
          typeof values.academicYear === "object"
            ? values.academicYear?._id
            : values.academicYear;

        const payload = {
          semester: values.semester,
          course: values.course,
          student: values.student,
          status: values.status,
        };

        if (isEdit) await updateEnrollment(id, payload);
        else await createEnrollment(payload);

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

    const filteredSemesters = useMemo(() => {
    const ayId = formik.values.academicYear;
    if (!ayId) return [];
    return semesters.filter((s) => {
      const sAyId =
        typeof s.academicYear === "object"
          ? s.academicYear?._id
          : s.academicYear;
      return sAyId === ayId;
    });
  }, [semesters, formik.values.academicYear]);

  useEffect(() => {
    // quand academicYear change, on vide semester
    formik.setFieldValue("semester", "");
  }, [formik.values.academicYear]);

  //  Reset quand on ferme le modal
  useEffect(() => {
    if (!open) {
      setServerError("");
      formik.resetForm();
    }
  }, [open]);

  const title = isEdit ? "Modifier une Inscription" : "Ajouter une Inscription";

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
            name="academicYear"
            label="Année Académique"
            select
          >
            {academicYears.map((ay) => (
              <MenuItem key={ay._id} value={ay._id}>
                {ay.name}
              </MenuItem>
            ))}
          </FormField>

          {/*  Nom : recommandé en select car backend enum S1 / S2 */}
          <FormField formik={formik} name="semester" label="Semestre" select>
            {filteredSemesters.map((sem) => (
              <MenuItem key={sem._id} value={sem._id}>
                {sem.name}
              </MenuItem>
            ))}
          </FormField>

          {/*  Dates */}
          <FormField formik={formik} name="course" label="Cours" select>
            {courses.map((course) => (
              <MenuItem key={course._id} value={course._id}>
                {course.name}
              </MenuItem>
            ))}
          </FormField>

          <FormField formik={formik} name="student" label="Étudiant" select>
            {students.map((student) => (
              <MenuItem key={student._id} value={student._id}>
                {student.firstName} {student.lastName}
              </MenuItem>
            ))}
          </FormField>
          <FormField formik={formik} name="status" label="Statut" select>
            <MenuItem value="ENROLLED">Inscrit</MenuItem>
            <MenuItem value="COMPLETED">Complété</MenuItem>
            <MenuItem value="DROPPED">Abandonné</MenuItem>
          </FormField>
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
