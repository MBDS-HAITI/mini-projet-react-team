export const validateAcademicYear = (values) => {
  const errors = {};

  // name
  if (!values.name) {
    errors.name = "Le nom est requis (ex: 2025-2026)";
  } else if (!/^\d{4}-\d{4}$/.test(values.name)) {
    errors.name = "Format attendu: YYYY-YYYY (ex: 2025-2026)";
  } else {
    const [y1, y2] = values.name.split("-").map(Number);
    if (y2 !== y1 + 1) errors.name = "L’année suivante doit être +1 (ex: 2025-2026)";
  }

  // dates
  if (!values.startDate) errors.startDate = "La date de début est requise";
  if (!values.endDate) errors.endDate = "La date de fin est requise";

  if (values.startDate && values.endDate) {
    const s = new Date(values.startDate);
    const e = new Date(values.endDate);
    if (Number.isNaN(s.getTime())) errors.startDate = "Date de début invalide";
    if (Number.isNaN(e.getTime())) errors.endDate = "Date de fin invalide";
    if (!errors.startDate && !errors.endDate && e <= s) {
      errors.endDate = "La date de fin doit être après la date de début";
    }
  }

  // isActive
  if (typeof values.isActive !== "boolean") {
    errors.isActive = "Statut invalide";
  }

  return errors;
};
