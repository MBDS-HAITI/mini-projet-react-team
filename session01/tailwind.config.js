/** @type {import('tailwindcss').Config} */
export default {
  // 'class' est la clé du succès ici
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Optionnel : tu peux mapper tes couleurs MUI ici pour Tailwind
        dark: {
          bg: '#0B1020',
          paper: '#111A33',
        }
      },
    },
  },
  plugins: [],
}