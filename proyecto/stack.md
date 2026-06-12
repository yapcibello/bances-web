# Stack tecnológico — bances-web

## Lenguajes

| Lenguaje | Versión | Uso |
|----------|---------|-----|
| TypeScript | 5.7.x (catalog ^5.7.3) | Código principal (componentes Astro, config, schemas Zod) |
| PHP | 8.x | Endpoint del formulario de citas (PHPMailer) — pendiente de fase migración |

## Frameworks y librerías principales

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| astro | ^5.16.8 (catalog) | Framework principal — SSG |
| @astrojs/sitemap | catalog | Generación de sitemap-index.xml |
| @astrojs/tailwind | ^5.1.5 (catalog) | Integración Tailwind |
| tailwindcss | ^3.4.17 (catalog) | Estilos utilitarios (preset en @bances/config) |
| @tailwindcss/typography | ^0.5.19 (catalog) | Prosa de posts del blog |
| @astrojs/check | ^0.9.6 (catalog) | Type-check de componentes Astro |

## Servicios externos

| Servicio | Propósito | Credenciales |
|----------|-----------|-------------|
| GTM/GA4 | Analítica (container pendiente de fase gtm-baseline) | `.env` (`PUBLIC_GTM_ID`) |
| Hosting Hestia (FTP) | Producción — deploy ZIP + PHP extractTo() | Fuera del repo (plan F0) |

## Herramientas de desarrollo

| Herramienta | Propósito |
|-------------|-----------|
| pnpm 9.15.0 | Gestor de paquetes del monorepo (corepack, catalog, workspace:*) |
| Node ≥20 (.nvmrc v20) | Runtime de desarrollo y build |
| git | Control de versiones — remote: github.com/yapcibello/bances-web |
