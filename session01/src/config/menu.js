// src/config/menu.js
export const MENU_ITEMS = [
  { label: "Accueil", to: "/", roles: ["ADMIN", "STUDENT", "SCOLARITE"] },

  // ADMIN
  { label: "Utilisateurs", to: "/users", roles: ["ADMIN"] },
  { label: "Paramètres", to: "/settings", roles: ["ADMIN"] },

  // SCOLARITE
  { label: "Étudiants", to: "/students", roles: ["ADMIN", "SCOLARITE"] },
  { label: "Cours", to: "/courses", roles: ["ADMIN", "SCOLARITE"] },
  { label: "Notes", to: "/grades", roles: ["ADMIN", "SCOLARITE"] },

  // STUDENT
  { label: "Mes notes", to: "/my-grades", roles: ["STUDENT"] },
  { label: "Mon profil", to: "/profile", roles: ["STUDENT", "ADMIN", "SCOLARITE"] },
];
