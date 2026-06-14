# Completado — bances-web

> Tareas completadas movidas desde PENDIENTES.md con fecha de finalización.

<!-- Formato: [YYYY-MM-DD] - [x] Descripción de la tarea completada -->

[2026-06-12] - [x] Fase 1 preflight del workflow init-web-astro — entorno verificado (node 26, pnpm 9.15, git), repo GitHub confirmado vacío
[2026-06-12] - [x] Fase 2 discovery — 9 decisiones aprobadas + regla URLs inmutables registrada en CLAUDE.md y discovery.json
[2026-06-12] - [x] Fase 3 estructura — monorepo @bances/* creado, pnpm install y build:www en verde, commit inicial b1c1596
[2026-06-12] - [x] Blueprint rellenado con contenido real (stack, arquitectura, despliegue, runbook, api, deviations) — Guardian PASSED
[2026-06-12] - [x] Plan de continuación de fases 4-14 guardado en planes/2026-06-12-init-web-astro-continuacion/
[2026-06-13] - [x] Fase 4 migración: TODAS las URLs migradas (84 páginas, build verde) — posts, taxonomías, chrome, home, páginas estáticas, formulario PHP
[2026-06-13] - [x] WP REST API → 46 posts MDX + 17 categorías + 12 tags + 171 imágenes (scripts/import-blog-wp.mjs)
[2026-06-13] - [x] Chrome nativo AAA (Header/Navbar/Footer) + MDX + fuentes Inter/Heebo
[2026-06-13] - [x] Rutas dinámicas blog ([categoria]/[slug], listados categorías/tags) con paridad 1:1 de URLs
[2026-06-13] - [x] Backend formulario PHP (public/api/contacto.php, PHPMailer)
[2026-06-14] - [x] Pulido home: hero 1:1 (vídeo a sangre completa + barra de cita horizontal) y foto real en intro (sustituido QR de Instagram)
[2026-06-14] - [x] Fix formulario hero: 422 resuelto (mensaje oculto + microcopia de privacidad)
[2026-06-14] - [x] Fase 5 blueprint: arquitectura.md, runbook.md, api.md rellenados con contenido real
[2026-06-14] - [x] Fase 6 skills: 13 skills del ecosistema instalados en .claude/skills/ (Astro/SEO/GEO/AAA/GTM/monorepo)
[2026-06-14] - [x] Fase 7 astro-baseline: Layout AAA + componentes UI confirmados (skip link, focus, JSON-LD)
[2026-06-14] - [x] Fase 8 seo-baseline: JSON-LD Dentist enriquecido + BreadcrumbList/BlogPosting + robots.txt + og-default.jpg
[2026-06-14] - [x] Fase 9 geo-baseline: llms.txt + llms-full.txt + componentes BloqueCita/Faq
[2026-06-14] - [x] Fase 10 a11y-baseline: página /accesibilidad/ + focus/reduced-motion + ink-soft a #595959 (AAA texto cuerpo)
[2026-06-14] - [x] Fase 11 gtm-baseline: dataLayer + evento lead_form_submit + .env.example
[2026-06-14] - [x] Fase 12 deploy-baseline: scripts/deploy-ftp.sh + deploy-swap.php.template (FTP ZIP a Hestia)
[2026-06-14] - [x] Fase 13 verificación: build verde (85 págs), paridad URLs 1:1, smoke responsive — APTO
[2026-06-14] - [x] Fase 14 plan-f0: planes/2026-06-14-f0-bootstrap-bances/ con tareas humanas a producción
