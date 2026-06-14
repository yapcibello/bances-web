# Changelog — bances-web

## [2026-06-14] — Pulido visual responsive de la home

- feat: hero de la home con vídeo de fondo (réplica del Elementor background video de producción) + póster e imagen fallback para `prefers-reduced-motion` (AAA 2.3.3)
- feat: pulido base de secciones de la home (tarjetas, fondos alternos, degradado del hero localizado)
- chore: comparación responsive con producción (móvil 390 / tablet 768 / escritorio 1280) vía chrome-devtools — capturas de referencia en `tmp/wp-crawl/`
- nota: auditorías SEO/GEO/AAA lanzadas pero cortadas por límite de turnos de los subagentes; mejoras pendientes

## [2026-06-13] — Fase migración: todas las URLs migradas (WordPress → Astro)

- feat: migración completa de las 84 URLs de clinicadentalbances.com — `pnpm build:www` genera 84 páginas, 0 faltan vs `docs/url-map.md`
- feat: 46 posts del blog importados a MDX vía WP REST API (`scripts/import-blog-wp.mjs`) + 17 categorías + 12 tags + 171 imágenes (rutas `/wp-content/uploads/` preservadas)
- feat: chrome nativo 1:1 (Header/Navbar con submenú accesible AAA, Footer) + `@astrojs/mdx` + fuentes Inter/Heebo self-hosted
- feat: home nativa (11 componentes de sección) + 8 páginas estáticas (quienes somos, tratamientos, seguros, instalaciones con galería de 32 fotos, 3 legales, índice blog)
- feat: rutas dinámicas `[categoria]/[slug]` (posts), `[categoria]/index` (listados), `tag/[tag]` (tags)
- feat: backend formulario `public/api/contacto.php` (PHPMailer, $_POST + JSON, honeypot, rate limit)
- feat: identidad visual real extraída del Kit Elementor (naranja #EF7723, Inter+Heebo) en `packages/config/tailwind.preset.cjs`
- docs: `docs/url-map.md` (contrato de URLs inmutables, 83 URLs) + logs de migración en `docs/migracion-blog/`

## [2026-06-12] — Bootstrap: fases 1-3 del workflow init-web-astro

- feat: scaffolding monorepo pnpm — `apps/www` (@bances/www, Astro 5 SSG, puerto dev 4320), `packages/config` (@bances/config, preset Tailwind provisional), `packages/seo` (@bances/seo) — commit `b1c1596`
- feat: Layout AAA con JSON-LD Organization (datos reales de la clínica), canonical, OG/Twitter, GTM por env, skip link
- feat: Content Collections `tratamientos` y `posts` con campo `urlOriginal` para auditar preservación de URLs
- docs: CLAUDE.md con regla innegociable de URLs inmutables (sin cambios de slug, sin 301; solo ampliar)
- docs: blueprint completo rellenado con contenido real (stack, arquitectura, despliegue, runbook, api "no aplica", deviations)
- docs: plan de continuación `planes/2026-06-12-init-web-astro-continuacion/` con las fases 4-14 pendientes
- chore: discovery del workflow aprobado (run `init-web-astro-20260612-194329`) — app única con blog como ruta, hosting FTP Hestia, formulario PHP+PHPMailer

## [2026-06-12] — Inicio del proyecto

- Configuración inicial del proyecto
- Estructura de documentación con blueprint
