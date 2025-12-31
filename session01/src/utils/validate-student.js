export const validateStudent = (values) => {
  const errors = {};
  if (!values.firstName) {
    errors.firstName = "Le prénom est requis";
  }else if (values.firstName.length < 3) {
    errors.firstName = "Le prénom doit contenir au moins 3 caractères";
  }

  if (!values.lastName) {
    errors.lastName = "Le nom est requis";
  }else if (values.lastName.length < 3) {
    errors.lastName = "Le nom doit contenir au moins 3 caractères";
  }

  if (!values.studentCode) {
    errors.studentCode = "Le code étudiant est requis";
  }else if (!/^STD-\d{4}-\d{4}$/.test(values.studentCode)) {
    errors.studentCode = "Le code étudiant doit être au format STD-YYYY-NNNN";  
  }
  if (!values.dateOfBirth) {
    errors.dateOfBirth = "La date de naissance est requise";
  }
  if (!values.phone) {
    errors.phone = "Le numéro de téléphone est requis";
  }else if (values.phone && (values.phone.length < 8 || values.phone.length > 15)) {
    errors.phone = "Le numéro de téléphone doit contenir entre 8 et 15 caractères";
  }

  if (!values.address) {
    errors.address = "L'adresse est requise";
  }else if (values.address.length < 5) {
    errors.address = "L'adresse doit contenir au moins 5 caractères";
  }

  if (!values.sex) {
    errors.sex = "Le sexe est requis";
  }
  return errors;
};