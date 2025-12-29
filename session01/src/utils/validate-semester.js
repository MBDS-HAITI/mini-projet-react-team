export const validateSemester = (values) => {
  const errors = {};

  if (!values.academicYear) errors.academicYear = "Année académique obligatoire";
  if (!values.name) errors.name = "Nom obligatoire";

  // backend enum
  const allowed = ["S1", "S2"];
  if (values.name && !allowed.includes(values.name)) {
    errors.name = "Le nom doit être S1 ou S2";
  }

  if (!values.startDate) errors.startDate = "Date début obligatoire";
  if (!values.endDate) errors.endDate = "Date fin obligatoire";

  if (values.startDate && values.endDate) {
    if (new Date(values.startDate) > new Date(values.endDate)) {
      errors.endDate = "La date de fin doit être après la date de début";
    }
  }

  return errors;
};
