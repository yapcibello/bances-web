# Estructura — init-web-astro — bances-web — 2026-06-12

## Resumen

Monorepo pnpm creado replicando el patrón logopedajessica-web, adaptado a las decisiones del discovery (app única `apps/www`, namespace `@bances/*`, puerto dev 4320). Ejecutado en dos pasadas de implementer (la primera agotó turnos tras crear el grueso del scaffolding; la segunda completó README raíz, verificación, install/build y git).

## Archivos creados (36 versionados)

### Raíz
- `package.json` — scripts dev:www (--port 4320), build:www, deploy:www (placeholder), verify:* (placeholders), test; packageManager pnpm@9.15.0
- `pnpm-workspace.yaml` — apps/* + packages/* con catalog (astro ^5.16.8, tailwind ^3.4.17, typescript ^5.7.3, @astrojs/*)
- `.npmrc` (strict-peer-dependencies), `.nvmrc` (v20), `.gitignore`, `README.md` (con firma SMedialab)
- `CLAUDE.md` — preexistente (regla URLs inmutables), NO modificado ✓

### apps/www (@bances/www)
- `astro.config.mjs` — site https://clinicadentalbances.com, trailingSlash 'always', sitemap, tailwind
- `src/layouts/Layout.astro` — GTM placeholder env, JSON-LD Organization con datos reales (C. Juan Pablo II nº26, 38004 S/C Tenerife, +34 922 243 555), OG/Twitter, canonical, lang="es", skip link AAA
- `src/components/{Header,Footer,Navbar}.astro` — esqueleto AAA (el diseño 1:1 llega en migración)
- `src/content.config.ts` — colecciones `tratamientos` y `posts` con schema Zod (incl. campo `urlOriginal` para preservación de URLs)
- `src/utils/siteConfig.ts` — marca, contacto y navegación REAL del WP origen
- `tailwind.config.mjs` (preset @bances/config), `tsconfig.json` (strict), `.env.example` (PUBLIC_GTM_ID), `public/favicon.svg`, `src/styles/global.css`, `src/env.d.ts`, `src/pages/index.astro`

### packages/config (@bances/config)
- `tailwind.preset.cjs` — paleta PROVISIONAL azul marino/blanco (se sustituirá por la extraída del CSS real del WP en fase migración) + `tailwind-preset.cjs` re-export + `src/siteConfig.ts` + `tokens/index.ts`

### packages/seo (@bances/seo)
- `src/index.ts` vacío + README (poblar cuando una app consuma del shared)

### Blueprint (auto-creado por hook check-blueprint vía ypc project init)
- `PENDIENTES.md`, `CHANGELOG.md`, `COMPLETADO.md`, `proyecto/{stack,arquitectura,despliegue,api,runbook}.md`, `docs/deviations.md`, `planes/` — con placeholders {{}}; la fase blueprint los rellenará con contenido real.

## Verificaciones

| Check | Resultado |
|---|---|
| `pnpm install` | ✅ exit 0 (428 paquetes, 4 workspace projects) |
| `pnpm build:www` | ✅ exit 0 — 1 página (`/index.html`) + sitemap-index.xml |
| `git init -b main` + commit | ✅ `b1c1596`, working tree limpio, remote origin configurado, SIN push |
| Boundaries (tokens solo en preset, workspace:*, deps explícitas) | ✅ verificado |

## Notas para el verifier

1. `@bances/seo` aparece en `vite.optimizeDeps.exclude` pero no es dependencia declarada de www (benigno; añadir `workspace:*` cuando se consuma).
2. WARN glob-loader "No files found" en tratamientos/posts — esperado (solo .gitkeep); desaparecerá en migración.
3. `Layout.astro` referencia `/og-default.jpg` que aún no existe en `public/` — pendiente de fase migración/assets.
4. Los archivos del blueprint auto-creados por el hook quedaron FUERA del commit `b1c1596` (se generaron después) — commitear tras la fase blueprint.

---

## Skills consultados
- gestion/project-blueprint: estructura raíz y boundaries replicados según el patrón del workflow.
- Referencia logopedajessica-web (astro.config, Layout, preset tailwind): plantilla estructural directa.

## Skills no relevantes
- gestion/markdown-github: README simple, no requirió técnicas GFM avanzadas más allá de tablas.
