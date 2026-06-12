# Pendientes — bances-web

## Prioritario

- [ ] Continuar workflow init-web-astro en fase 4 (migración) — plan completo en `planes/2026-06-12-init-web-astro-continuacion/README.md`, run `init-web-astro-20260612-194329`
- [ ] Fase migración: crawl del WP, `docs/url-map.md`, descarga de imágenes, extracción de paleta real y réplica 1:1 de páginas/posts

## Mejoras

- [ ] Sustituir paleta provisional de `packages/config/tailwind.preset.cjs` por la extraída del CSS real del WP
- [ ] Crear `public/og-default.jpg` (referenciado en Layout.astro, aún inexistente)

## Ideas

- [ ] Valorar colecciones GEO adicionales (glosario dental, FAQ) como AMPLIACIÓN de URLs — nunca modificando las existentes

## Deuda técnica

- [ ] `@bances/seo` referenciado en `vite.optimizeDeps.exclude` sin ser dependencia declarada de www — añadir `workspace:*` cuando se consuma
