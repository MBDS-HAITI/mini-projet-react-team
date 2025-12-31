export const validateCourse = (values) => {
  const errors = {};

  // name
  if (!values.name) {
    errors.name = "Le nom est requis (ex: JavaScript 101)";
  } else if (values.name.length < 3) {
    errors.name = "Le nom doit contenir au moins 3 caractères";
  }

  // credits
  if (!values.credits) errors.credits = "Le nombre de crédits est requis";
  if (values.credits && (isNaN(values.credits) || values.credits <= 0)) {
    errors.credits = "Le nombre de crédits doit être un nombre positif";
  }

  // Code
  if (!values.code) {
    errors.code = "Le code du cours est requis (ex: JS101)";
  } else if (values.code.length < 2) {
    errors.code = "Le code du cours doit contenir au moins 2 caractères";
  }

  return errors;
};
