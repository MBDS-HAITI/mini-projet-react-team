/**
 * Valider le changement de mot de passe
 * @param {Object} form - { oldPassword, newPassword, confirmPassword }
 * @returns {Object} - { isValid: boolean, error?: string }
 */
export function validatePasswordForm(form) {
  const { oldPassword, newPassword, confirmPassword } = form;

  if (!oldPassword || !oldPassword.trim()) {
    return { isValid: false, error: "Veuillez entrer votre mot de passe actuel" };
  }

  if (!newPassword || !newPassword.trim()) {
    return { isValid: false, error: "Veuillez entrer un nouveau mot de passe" };
  }

  if (newPassword.length < 8) {
    return { isValid: false, error: "Le mot de passe doit contenir au moins 8 caractères" };
  }

  if (!confirmPassword || !confirmPassword.trim()) {
    return { isValid: false, error: "Veuillez confirmer votre nouveau mot de passe" };
  }

  if (newPassword !== confirmPassword) {
    return { isValid: false, error: "Les mots de passe ne correspondent pas" };
  }

  if (oldPassword === newPassword) {
    return { isValid: false, error: "Le nouveau mot de passe doit être différent de l'ancien" };
  }

  return { isValid: true };
}
