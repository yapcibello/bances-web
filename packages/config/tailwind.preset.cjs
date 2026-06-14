// Preset Tailwind compartido entre todas las apps (apps/www).
// Boundary del proyecto: los tokens de marca viven SOLO en este archivo.
//
// Paleta y tipografías EXTRAÍDAS del Kit de Elementor del WP origen
// (clinicadentalbances.com → wp-content/uploads/elementor/css/post-13.css)
// y confirmadas con captura de la home. Réplica visual 1:1.

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        // Naranja de marca — acento real del sitio (botones, iconos, líneas).
        // Elementor: --e-global-color-accent / --e-global-color-secondary.
        primary: {
          DEFAULT: '#EF7723', // naranja Bances — acento principal / CTAs
          dark: '#D2641A',    // variante oscura para hover/active (contraste AA sobre blanco)
          light: '#EFA068',   // naranja claro (--e-global-color-18457cd)
          pale: '#F1C1A0',    // naranja muy claro decorativo (--e-global-color-6e0fe5d)
        },
        // Texto e interfaz neutra.
        ink: {
          DEFAULT: '#0D0D0D', // casi negro — títulos (--e-global-color-primary)
          soft: '#595959',    // gris cuerpo — ajustado de #7A7A7A (4.29:1, no llega a AA) a #595959 (7:1, AAA) por accesibilidad; revertir a #7A7A7A si se prioriza fidelidad cromática exacta
        },
        // Alias semánticos de Elementor para mapear 1:1 al diseño origen.
        accent: '#EF7723',
      },
      fontFamily: {
        // Tipografías reales del Kit Elementor.
        sans: ['Heebo', 'system-ui', 'sans-serif'],      // cuerpo (--e-global-typography-text)
        heading: ['Inter', 'system-ui', 'sans-serif'],   // titulares (--e-global-typography-primary)
      },
    },
  },
  plugins: [],
};
