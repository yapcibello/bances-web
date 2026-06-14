# Pendientes — bances-web

## Prioritario

- [ ] **Pulido visual fino**: la home ya es responsive-fiel a producción (móvil/tablet/escritorio) con hero en vídeo; faltan espaciados/colores exactos de algunos bloques. Pulir también las 8 páginas estáticas y los listados de blog comparando con producción
- [ ] **Mejoras SEO/GEO/AAA** (auditorías previas se cortaron): robots.txt, llms.txt, schema LocalBusiness/Dentist + BreadcrumbList + Article, titles/descriptions por página, página `/accesibilidad/`, verificación de contrastes
- [ ] Continuar workflow init-web-astro: fases gtm/deploy baselines → verificación → plan-f0. Run `init-web-astro-20260612-194329`

## Mejoras

- [ ] Sustituir paleta provisional de `packages/config/tailwind.preset.cjs` por la extraída del CSS real del WP
- [ ] Crear `public/og-default.jpg` (referenciado en Layout.astro, aún inexistente)

## Ideas

- [ ] Valorar colecciones GEO adicionales (glosario dental, FAQ) como AMPLIACIÓN de URLs — nunca modificando las existentes

## Deuda técnica

- [ ] `@bances/seo` referenciado en `vite.optimizeDeps.exclude` sin ser dependencia declarada de www — añadir `workspace:*` cuando se consuma
