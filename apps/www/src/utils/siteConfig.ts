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
  /** Submenú desplegable (réplica del menú Elementor del WP). */
  children?: NavItem[];
}

/**
 * Navegación principal — slugs reales del WordPress actual (orden y submenú 1:1).
 * NO modificar ningún href existente (URLs inmutables).
 */
export const mainNav: NavItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Quienes Somos', href: '/dentista-en-santa-cruz-de-tenerife/' },
  {
    label: 'Tratamientos dentales',
    href: '/tratamientos-dentales-en-santa-cruz-de-tenerife/',
    children: [
      { label: 'Blanqueamiento Dental', href: '/blanqueamiento-dental/' },
      { label: 'Cirugía oral', href: '/cirugia-oral/' },
      { label: 'Endodoncias', href: '/endodoncias/' },
      { label: 'Implantes dentales', href: '/implantes-dentales/' },
      { label: 'Odontología Conservadora', href: '/odontologia-conservadora/' },
      { label: 'Odontopediatría', href: '/odontopediatria/' },
      { label: 'Ortodoncia', href: '/ortodoncia/' },
      { label: 'Ortodoncia Invisible', href: '/ortodoncia/invisalign-la-ortodoncia-invisible/' },
      { label: 'Odontología Digital', href: '/odontologia-digital/' },
      { label: 'Periodoncia', href: '/periodoncia/' },
      { label: 'Prótesis Dentales', href: '/protesis-dentales/' },
      { label: 'Radiología Dental 3D', href: '/radiologia-dental-3d/' },
    ],
  },
  { label: 'Seguros Dentales', href: '/seguros-dentales/' },
  { label: 'Instalaciones', href: '/instalaciones/' },
  { label: 'Blog', href: '/recomendaciones-y-consejos-dentales/' },
];

/** Enlace de contacto y CTA del header (ancla en la home, como el WP). */
export const contactoHref = '/#Contacto';
export const ctaPedirCita = { label: 'Pedir Cita', href: '/#Contacto' };

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
