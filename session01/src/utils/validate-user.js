export const validateUser = (values, { isEdit } = {}) => {
  const errors = {};

  if (!values.email) errors.email = "Email requis";
  else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = "Email invalide";

  if (!isEdit) {
    if (!values.password) errors.password = "Mot de passe requis";
    else if (values.password.length < 6) errors.password = "Minimum 6 caractères";
  }

  if (!values.role) errors.role = "Rôle requis";

  if (values.role === "STUDENT" && !values.student) {
    errors.student = "Sélectionnez un étudiant";
  }

  if(!values.username){
    errors.username = "Username requis";
  }else if(values.username.length < 3){
    errors.username = "Minimum 3 caractères";
  }

  return errors;
};
