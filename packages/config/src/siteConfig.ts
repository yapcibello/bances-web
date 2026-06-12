/**
 * Configuración base del sitio (re-exportable cross-app).
 * Datos reales extraídos de clinicadentalbances.com.
 *
 * Datos sensibles (GTM_ID, secretos) se leen del `.env` de cada app que
 * importe este paquete, NO se hardcodean aquí.
 */

export const siteConfig = {
  name: 'Clínica Dental Bances',
  legalName: 'Clínica Dental Bances',
  title: 'Clínica Dental Bances — Santa Cruz de Tenerife',
  description:
    'Clínica Dental Bances en Santa Cruz de Tenerife. Tratamientos dentales, seguros dentales y atención odontológica personalizada.',

  url: 'https://clinicadentalbances.com',

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
} as const;

export type SiteConfig = typeof siteConfig;
