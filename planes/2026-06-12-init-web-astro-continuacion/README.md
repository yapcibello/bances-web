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

### 4. migracion — implementer (opus) · SIN gate · EN CURSO
La fase más larga. Réplica 1:1 NATIVA de https://clinicadentalbances.com/ (decisión del operario 2026-06-13: reconstrucción a componentes Astro+Tailwind, NO snapshot Elementor; migrar TODAS las taxonomías).

**Hecho en esta sesión:**
- ✅ Inventario completo de URLs en `docs/url-map.md` (82 del sitemap + `/odontologia-digital/` detectada fuera de sitemap) — contrato de URLs inmutables.
- ✅ Mirror local del WP en `tmp/wp-crawl/clinicadentalbances.com` (61 HTML, 385 imágenes, 25 MB) + CSS Kit en `tmp/wp-crawl/css/`.
- ✅ Paleta y tipografías REALES extraídas del Kit Elementor → `packages/config/tailwind.preset.cjs` (naranja #EF7723, ink #0D0D0D/#7A7A7A, Inter+Heebo). CORRIGE el dato erróneo previo (no era azul marino).
- ✅ `siteConfig` con marca/eslogan/logos reales + navegación 1:1 con submenú de 12 tratamientos + CTA "Pedir Cita".
- ✅ Logos reales copiados a `apps/www/public/wp-content/uploads/2025/05/`.
- ✅ `content.config.ts` ampliado: posts con categories/tags/wpId + colecciones `categorias` y `tags`.
- 🔄 Importación de los 46 posts + 15 categorías + 12 tags vía WP REST API (implementer en background, script estilo logopeda).

**Hecho en la sesión del 2026-06-13/14:**
- ✅ TODAS las URLs migradas: `build:www` genera 84 páginas, 0 faltan vs url-map. Posts, taxonomías, páginas estáticas, home, formulario PHP.
- ✅ Hero de la home con VÍDEO de fondo (`Clinica-Dental-Bances-Sanz-...mp4`, 4,2 MB) + póster + fallback `prefers-reduced-motion` — réplica del Elementor background video de producción.
- ✅ Pulido base de la home (tarjetas, fondos, degradado hero). Estructura responsive FIEL a producción en móvil/tablet/escritorio.
- ⚠️ Auditores SEO/GEO/AAA lanzados pero cortados por techo de turnos — sin informe recuperable. Mejoras pendientes de aplicar con criterio.

**Hecho antes (sesión bootstrap):**
- ✅ Chrome nativo 1:1: `Header.astro`, `Navbar.astro` (menú + submenú accesible AAA, móvil con foco atrapado), `Footer.astro` (datos, legales, redes reales Facebook/Instagram). Integrados en `Layout.astro` con skip link.
- ✅ Infra: `@astrojs/mdx` + fuentes Inter/Heebo self-hosted (Fontsource) en apps/www.
- ✅ HOME nativa ensamblada: 11 componentes en `apps/www/src/components/home/` (Hero, Features, Intro, Servicios, PrimeraVisita, Pagos, Seguros, Colaboradores, Opiniones, BlogDestacados, Contacto) + `ui/` (Boton, Seccion). `index.astro` ensamblado. `build:www` exit 0.

**Pendiente de la fase migración (el grueso restante):**
- ⏳ **PULIDO VISUAL de la home** (prioritario): la home tiene estructura + textos 1:1 pero NO es pixel-perfect aún. Comparar `tmp/wp-crawl/home-astro.png` vs `home-full.png` y ajustar: hero (imagen `video_background.webp` no luce), grids de features/tarjetas, espaciado, colores de bloques. Iterar con dev server + capturas.
- ⏳ Reconstruir 8 páginas restantes: quienes somos, tratamientos (índice), seguros dentales, instalaciones, 3 legales.
- ⏳ Páginas de categoría/tratamiento (contenido de cada `/cirugia-oral/`, etc.) — reconstruir desde el HTML del mirror.
- ⏳ Rutas dinámicas: `[categoria]/[slug].astro` (46 posts) + `[categoria]/index.astro` (listados de las 17 categorías) + `/tag/[slug]/` (12 tags) + índice blog `/recomendaciones-y-consejos-dentales/`. CUIDADO: colisión categoría vs página estática; `sin-categoria` (default WP) — verificar si debe generar URL.
- ⏳ Backend formulario PHP+PHPMailer (`/api/contacto.php`) — el formulario visual ya está en Contacto.astro.
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
