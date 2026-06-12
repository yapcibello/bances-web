// Preset Tailwind compartido entre todas las apps (apps/www).
// Boundary del proyecto: los tokens de marca viven SOLO en este archivo.
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │ PROVISIONAL — se sustituirá por la paleta extraída del CSS real del  │
// │ WordPress (clinicadentalbances.com) en la fase migración.            │
// │ Predominante del logo: azul marino + blanco.                         │
// └─────────────────────────────────────────────────────────────────────┘

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        // Azul marino del logo (aprox.) — PROVISIONAL, pendiente de extracción real.
        primary: {
          DEFAULT: '#1B3A5C', // azul marino — base de marca
          dark: '#122842',    // variante oscura para hover/active
          light: '#2C5680',   // variante clara
          pale: '#E8EFF6',    // fondo decorativo suave
        },
        // Texto principal / grises neutros.
        secondary: {
          DEFAULT: '#2D2D2D',
          dark: '#1a1a1a',
          light: '#4a4a4a',
        },
        accent: '#1B3A5C', // CTAs — PROVISIONAL, se ajustará con la paleta real
      },
      fontFamily: {
        // PROVISIONAL — fuentes reales pendientes de extracción del WP.
        sans: ['system-ui', 'sans-serif'],
        heading: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
