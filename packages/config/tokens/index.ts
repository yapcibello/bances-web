/**
 * Design tokens iniciales — fuente única de verdad para valores de diseño
 * consumibles desde TS/JS (el preset Tailwind los replica para utilidades CSS).
 *
 * PROVISIONAL — colores y fuentes se sustituirán por los extraídos del CSS
 * real del WordPress (clinicadentalbances.com) en la fase migración.
 */

export const colors = {
  // Azul marino del logo (aprox.) — PROVISIONAL.
  primary: '#1B3A5C',
  primaryDark: '#122842',
  primaryLight: '#2C5680',
  primaryPale: '#E8EFF6',
  secondary: '#2D2D2D',
  white: '#FFFFFF',
} as const;

export const fonts = {
  // PROVISIONAL — fuentes reales pendientes de extracción.
  sans: 'system-ui, sans-serif',
  heading: 'system-ui, sans-serif',
} as const;

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
} as const;

export const tokens = { colors, fonts, spacing } as const;

export type Tokens = typeof tokens;
