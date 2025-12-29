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

import { createSemester, updateSemester } from "../../api/routes/semester.api.js";
import { getAcademicYears } from "../../api/routes/academic-year.api.js";

import { validateSemester } from "../../utils/validate-semester.js";
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

export default function UpsertSemesterModal({
    open,
    onClose,
    mode = "create", // "create" | "edit"
    data = null, // semestre pour edit
    onSuccess, // callback refresh
}) {
    const isEdit = mode === "edit";
    const [serverError, setServerError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [academicYears, setAcademicYears] = useState([]);

    const id = data?._id || data?.id;

    // Charger les années académiques (pour select)
    useEffect(() => {
        const fetchAcademicYears = async () => {
            try {
                const result = await getAcademicYears();
                setAcademicYears(result);
            } catch (e) {
                console.error("Erreur chargement academicYears:", e);
            }
        };
        fetchAcademicYears();
    }, []);

    // Valeurs initiales
    const initialValues = useMemo(
        () => ({
            // important: on force l'id même si data.academicYear est un objet
            academicYear: data?.academicYear?._id || data?.academicYear?.id || data?.academicYear || "",
            name: data?.name || "",
            startDate: toDateInputValue(data?.startDate),
            endDate: toDateInputValue(data?.endDate),
            isActive: typeof data?.isActive === "boolean" ? data.isActive : false,
        }),
        [data]
    );

    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validate: validateSemester,
        onSubmit: async (values) => {
            setServerError("");
            setIsSubmitting(true);

            try {
                const academicYearId =
                    typeof values.academicYear === "object"
                        ? values.academicYear?._id
                        : values.academicYear;

                const payload = {
                    academicYear: academicYearId,
                    name: values.name,
                    startDate: toISOStartOfDay(values.startDate),
                    endDate: toISOEndOfDay(values.endDate),
                    isActive: values.isActive,
                };


                if (isEdit) await updateSemester(id, payload);
                else await createSemester(payload);

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
                    <FormField formik={formik} name="name" label="Nom" select>
                        <MenuItem value="S1">S1</MenuItem>
                        <MenuItem value="S2">S2</MenuItem>
                    </FormField>

                    {/*  Dates */}
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
                        label={<span style={{ color: "white" }}>Semestre actif</span>}
                        control={
                            <Checkbox
                                sx={checkboxSx}
                                checked={formik.values.isActive}
                                onChange={(e) =>
                                    formik.setFieldValue("isActive", e.target.checked)
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
