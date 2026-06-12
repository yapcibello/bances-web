# Plan de continuación — workflow init-web-astro — bances-web

> **Estado al cierre de sesión (2026-06-12)**: fases 1-3 completadas y aprobadas. El workflow quedó pausado en el gate de la fase 3, justo ANTES de lanzar la fase 4 (migración). Run-id: `init-web-astro-20260612-194329`.

## Cómo retomar en una sesión nueva

1. Leer este plan completo + `CLAUDE.md` (regla de URLs inmutables) + memoria persistente (`mem_context` proyecto `bances-web`).
2. Leer los artefactos del run: `.ypc/runs/init-web-astro-20260612-194329/artifacts/` (preflight_report.md, discovery_json.md, structure_created.md) y `discovery.json`.
3. Continuar el run existente:
   ```bash
   ypc agents continue init-web-astro-20260612-194329
   # o consultar estado:
   ypc agents run-phase init-web-astro-20260612-194329 start migracion
   ```
4. Ejecutar cada fase delegando a su sub-agente con Task (orquestador delegate-only) y reportar con el formato estándar de fase.

## Fases completadas ✅

| # | Fase | Resultado |
|---|---|---|
| 1 | preflight | APTO CON AVISOS — CWD virgen, node 26/pnpm 9.15/git OK, gh ausente (no bloqueante), repo GitHub existe y está vacío |
| 2 | discovery | discovery.json aprobado (9 decisiones + regla URLs inmutables) |
| 3 | estructura | Monorepo @bances/* creado; install+build verdes; commit `b1c1596` local |

## Fases pendientes ⏳ (en orden)

### 4. migracion — implementer (opus) · SIN gate
La fase más larga. Réplica 1:1 de https://clinicadentalbances.com/:
- Crawl completo del WP (sitemap + navegación): 6 páginas principales + 12 tratamientos + posts del blog en `/recomendaciones-y-consejos-dentales/`
- Generar `docs/url-map.md` con TODAS las URLs del WP → **contrato de URLs inmutables: prohibido modificar slugs, prohibido 301; solo añadir** (confirmar con el operario ante cualquier duda)
- Descargar imágenes originales a `apps/www/public/` preservando rutas `/wp-content/uploads/` (usar `decode-wp-paths.mjs` de logopedajessica si hay URLs encoded)
- Extraer paleta y tipografías reales del CSS del WP → sustituir placeholder de `packages/config/tailwind.preset.cjs`
- Textos e imágenes EXACTOS — sin reescrituras
- Posts → colección `posts`; tratamientos → colección `tratamientos` (con `urlOriginal`)
- Protocolo agentes-write-once (Read completo + Write 1-shot por archivo)
- Artefacto: `artifacts/migration_report.md`

### 5. blueprint — implementer · SIN gate
Rellenar con contenido REAL: `proyecto/arquitectura.md`, `proyecto/runbook.md`, `proyecto/api.md` (los 3 aún con placeholders {{}}), revisar README/CHANGELOG/COMPLETADO. `stack.md`, `despliegue.md`, `PENDIENTES.md`, `docs/deviations.md` ya están rellenos (Guardian PASSED). Artefacto: `artifacts/blueprint_populated.md`.

### 6. skills — skills-analyzer · GATE
Instalar symlinks a skills relevantes (tipo_negocio servicios-profesionales + Astro). Artefacto: `artifacts/skills_installed.md`.

### 7. astro-baseline — implementer
Layout AAA definitivo + componentes UI según diseño real extraído en migración. Artefacto: `artifacts/astro_baseline.md`.

### 8. seo-baseline — seo-auditor
Sitemap+images, robots, canonical strict, JSON-LD (LocalBusiness/Dentist, BreadcrumbList...). Artefacto: `artifacts/seo_baseline.md`.

### 9. geo-baseline — geo-auditor
Citabilidad LLMs: BloqueCitaRapida, FAQAccesible, AutoridadDeclarada, llms.txt. **Solo URLs nuevas — no tocar existentes.** Artefacto: `artifacts/geo_baseline.md`.

### 10. a11y-baseline — accesibilidad-auditor
AAA declarado: `src/pages/accesibilidad.astro` (URL nueva, permitida), tokens contrastados 7:1, focus visible, tap targets. Artefacto: `artifacts/a11y_baseline.md`.

### 11. gtm-baseline — implementer
.env, dataLayer, eventos preconfigurados, plan creación container GTM/GA4. Artefacto: `artifacts/gtm_baseline.md`.

### 12. deploy-baseline — implementer
Scripts deploy FTP ZIP + PHP extractTo() a Hestia (patrón vitali-web/smedialab-web — leer sus scripts como referencia). Secrets fuera del repo. Artefacto: `artifacts/deploy_baseline.md`.

### 13. verificacion — verifier · GATE
Smoke: install + dev + build + lighthouse + **html-diff contra el WP origen** + **paridad de URLs 1:1 sin redirects** + checklist. Artefacto: `artifacts/verification_report.md`.

### 14. plan-f0 — spec-writer · GATE
`planes/<fecha>-f0-bootstrap-bances/README.md` con tareas humanas para llegar a producción (credenciales FTP, GTM container, DNS/corte WP→Astro). Artefacto: `artifacts/f0_plan.md`.

Al completar todas: escribir `artifacts/telemetria.json` (gates + umbrales aceptados).

## Decisiones vigentes (resumen del discovery.json)

- slug `bances` · marca Clínica Dental Bances · app única `apps/www` (blog como ruta original) · solo-es
- Hosting FTP ZIP+PHP a Hestia · formulario PHP+PHPMailer · namespace `@bances/*` · puerto dev 4320
- **URLs inmutables**: jamás modificar URLs existentes ni usar 301; solo ampliar; confirmación humana ante cualquier cambio
- Contenido 1:1: textos e imágenes exactos al WP

## Riesgos abiertos

- `/og-default.jpg` referenciado en Layout pero inexistente (resolver en migración/assets)
- `@bances/seo` en `vite.optimizeDeps.exclude` sin ser dep declarada (añadir `workspace:*` al consumirlo)
- Credenciales FTP pendientes (plan F0 — nunca en el repo)

## Orquestación

- Workflow: `init-web-astro` (run existente `init-web-astro-20260612-194329` — continuar, NO crear run nuevo)
- Invocación por fase: `Task(subagent_type='<agente de la fase>', prompt='<system prompt + pautas + artefactos predecesores inline>')` + `ypc agents run-phase <run-id> start|done <fase>`

## Skills

- Consultados: gestion/project-blueprint (blueprint), regla global agentes-write-once (aplicar en migración)
- A evaluar en fase 6: skills seo/*, accesibilidad/wcag-aa-aaa, testing/chrome-devtools-a11y-seo
