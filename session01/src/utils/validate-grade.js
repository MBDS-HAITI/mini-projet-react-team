export const validateGrade = (values) => {
  const errors = {};   
    // Enrollment
    if (!values.enrollment) {
        errors.enrollment = "L'inscription est requise";
    }
    // Value
    if (values.value === undefined || values.value === null || values.value === "") {
        errors.value = "La note est requise";
    } else if (isNaN(values.value) || values.value < 0 || values.value > 100) {
        errors.value = "La note doit être un nombre entre 0 et 100";
    }
    return errors;
};