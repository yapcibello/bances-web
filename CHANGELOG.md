# Changelog — bances-web

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
