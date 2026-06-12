/**
 * Configuración del sitio para la app WWW.
 * Re-exporta la base compartida (@bances/config/site) y añade la navegación
 * REAL del WordPress origen (clinicadentalbances.com).
 *
 * REGLA DE URLS INMUTABLES: ninguna URL existente en producción se modifica.
 * Los `href` de navegación replican 1:1 los slugs del sitio actual. Prohibido
 * cambiar slugs o crear redirects 301 sin confirmación humana explícita previa.
 */

import { siteConfig as baseConfig } from '@bances/config/site';

export interface NavItem {
  label: string;
  href: string;
}

/**
 * Navegación principal — slugs reales del WordPress actual.
 * NO modificar ningún href existente (URLs inmutables).
 */
export const mainNav: NavItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Quienes Somos', href: '/dentista-en-santa-cruz-de-tenerife/' },
  { label: 'Tratamientos', href: '/tratamientos-dentales-en-santa-cruz-de-tenerife/' },
  { label: 'Seguros Dentales', href: '/seguros-dentales/' },
  { label: 'Instalaciones', href: '/instalaciones/' },
  { label: 'Blog', href: '/recomendaciones-y-consejos-dentales/' },
];

export const siteConfig = {
  ...baseConfig,
  // Datos planos de contacto convenientes para componentes.
  marca: baseConfig.name,
  dominio: baseConfig.url,
  direccion: baseConfig.address,
  telefonos: baseConfig.phones,
  email: baseConfig.email,
  nav: mainNav,
};

export type AppSiteConfig = typeof siteConfig;
