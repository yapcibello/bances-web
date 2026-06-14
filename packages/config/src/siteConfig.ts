/**
 * Configuración base del sitio (re-exportable cross-app).
 * Datos reales extraídos de clinicadentalbances.com.
 *
 * Datos sensibles (GTM_ID, secretos) se leen del `.env` de cada app que
 * importe este paquete, NO se hardcodean aquí.
 */

export const siteConfig = {
  name: 'Clínica Dental Bances',
  legalName: 'Clínica Dental Bances Sanz',
  brandName: 'Bances Sanz',
  slogan: 'Desde 1970 cuidando tu sonrisa',
  since: 1970,
  title: 'Clínica Dental Bances — Santa Cruz de Tenerife',
  description:
    'Clínica Dental Bances en Santa Cruz de Tenerife. Tratamientos dentales, seguros dentales y atención odontológica personalizada.',

  url: 'https://clinicadentalbances.com',

  // Logos reales (rutas preservadas del WP).
  logo: {
    horizontal: '/wp-content/uploads/2025/05/logo-horizontal-bances-sanz.webp',
    vertical: '/wp-content/uploads/2025/05/logo-vertical-bances-sanz.webp',
    width: 190,
    height: 85,
  },

  // Dirección real del sitio actual.
  address: {
    street: 'C. Juan Pablo II nº26',
    postalCode: '38004',
    city: 'Santa Cruz de Tenerife',
    region: 'Islas Canarias',
    regionCode: 'ES-CN',
    country: 'ES',
  },

  // Teléfonos reales.
  phones: [
    { label: 'Teléfono', numero: '922 243 555', href: 'tel:+34922243555' },
    { label: 'Móvil', numero: '636 001 450', href: 'tel:+34636001450' },
  ],

  email: 'info@clinicadentalbances.com',

  // Geo por defecto (Santa Cruz de Tenerife).
  geo: {
    region: 'ES-CN',
    placename: 'Santa Cruz de Tenerife',
    latitude: 28.4636,
    longitude: -16.2518,
  },

  // Horario de atención REAL (extraído del sitio origen, 2026-06-14).
  // `days` usa nombres schema.org para el JSON-LD openingHoursSpecification.
  openingHours: [
    { days: ['Monday', 'Wednesday', 'Thursday'], opens: '09:00', closes: '20:00' },
    { days: ['Tuesday'], opens: '11:00', closes: '20:00' },
    { days: ['Friday'], opens: '09:00', closes: '15:00' },
  ],
  // Versión legible para personas (sábado y domingo cerrado).
  horarioTexto:
    'Lunes, miércoles y jueves de 9:00 a 20:00 · Martes de 11:00 a 20:00 · Viernes de 9:00 a 15:00 · Sábado y domingo cerrado',
} as const;

export type SiteConfig = typeof siteConfig;
