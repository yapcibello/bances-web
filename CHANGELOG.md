# Changelog — bances-web

## [2026-06-15] — Matiz visual home + landings de tratamiento

- style(home): la sección "Opiniones de nuestros clientes" pasa a fondo peach `#F1C1A0` (token `primary.pale`) con tarjetas blancas, igual que producción (antes fondo blanco). Verificado que el bloque "Seguros" ya coincidía en blanco con el origen


- feat: las 11 páginas de tratamiento (`/implantes-dentales/`, `/blanqueamiento-dental/`, `/ortodoncia/`, `/endodoncias/`, `/periodoncia/`, `/cirugia-oral/`, `/odontologia-conservadora/`, `/odontopediatria/`, `/odontologia-digital/`, `/protesis-dentales/`, `/radiologia-dental-3d/`) pasan de listado de categoría a **landing completa** con el contenido REAL de producción: hero + intro + secciones (texto, listas e imágenes) + artículos relacionados
- feat: contenido en `apps/www/src/data/tratamientos.ts` (41 secciones, extraídas del mirror) + componente `components/paginas/TratamientoLanding.astro` + 33 imágenes de tratamiento descargadas a `public/`
- feat: `[categoria]/index.astro` bifurca — landing si el slug es un tratamiento con contenido, listado de categoría en caso contrario; breadcrumbs (Inicio › Tratamientos › X) + JSON-LD FAQPage por landing
- nota: `/ortodoncia/invisalign-la-ortodoncia-invisible/` ya era un post con contenido (no listado fino), se mantiene

## [2026-06-14] — FAQ por tratamiento (32 Q&A reales extraídas de producción)

- feat(geo): 32 preguntas frecuentes REALES extraídas del contenido de las páginas de tratamiento de producción (mirror) y wireadas por tratamiento en `[categoria]/index.astro` — 10 tratamientos (blanqueamiento, cirugía oral, endodoncias, implantes, odontología conservadora, odontopediatría, ortodoncia, odontología digital, periodoncia, radiología 3D)
- feat(geo): cada página de tratamiento emite ahora su propio JSON-LD FAQPage; datos en `apps/www/src/data/faqsTratamientos.ts` (curados: sin excerpts de blog, recorte a frases completas, limpieza de espaciado)

## [2026-06-14] — Imágenes de relleno + wiring GEO (FAQ y horario reales)

- fix(blog): 26 imágenes de cuerpo rotas (404 también en producción) repuntadas a un placeholder de marca (`placeholder-bances.webp`, logo sobre fondo pale) en 8 posts — ya no se ven rotas
- feat(geo): sección "Preguntas frecuentes" en la home (antes de Contacto) con 7 Q&A basadas en datos REALES del sitio (horario, ubicación, legado desde 1970, seguros, financiación, tratamientos, cómo pedir cita) + JSON-LD FAQPage
- feat(geo): `BloqueCita` wireado en "Quiénes Somos" con el horario real de atención (NAP + horario citable)
- feat(seo): horario real (L/X/J 9-20, M 11-20, V 9-15) añadido a `siteConfig.openingHours` y al JSON-LD `Dentist` (`openingHoursSpecification`) — antes omitido por falta de dato

## [2026-06-14] — Cierre fases 5-14 init-web-astro: pulido home + SEO/GEO/AAA + deploy

- feat(home): hero rehecho 1:1 con producción — vídeo a sangre completa, eslogan abajo-izquierda y barra de cita horizontal debajo (Nombre, Email, Teléfono, Tratamiento) en vez del formulario flotante previo
- fix(home): la sección intro mostraba un QR de Instagram en lugar de foto; sustituida por la foto real de la clínica (`CLINICA-NUEVA-1.1-38.webp`)
- fix(form): el formulario rápido del hero daba 422 (el backend exige `mensaje`); añadido `mensaje` oculto por defecto + microcopia de política de privacidad
- feat(seo): JSON-LD `Dentist` enriquecido (geo, areaServed, sameAs, logo) + props `breadcrumbs`/`article` en Layout + `BlogPosting` wireado en posts + `robots.txt` + `og-default.jpg` (1200×630)
- feat(geo): `llms.txt` y `llms-full.txt` + componentes citables `BloqueCita.astro` y `Faq.astro` (FAQPage JSON-LD), listos para wirear con contenido real
- feat(a11y): página `/accesibilidad/` (declaración W3C/UNE-EN 301549) + `:focus-visible` reforzado + `prefers-reduced-motion` + `ink-soft` #7A7A7A→#595959 (4.29:1 → 7:1, AAA en texto de cuerpo)
- feat(gtm): `dataLayer` inicializado + evento `lead_form_submit` en envío de formularios de cita + `.env.example` (deploy + SMTP)
- feat(deploy): `scripts/deploy-ftp.sh` (ZIP + lftp a Hestia) + `scripts/deploy-swap.php.template` (extract atómico) — credenciales solo por entorno
- docs: blueprint `proyecto/arquitectura.md`, `runbook.md`, `api.md` rellenados con contenido real; plan F0 en `planes/2026-06-14-f0-bootstrap-bances/`
- chore: 13 skills del ecosistema instalados en `.claude/skills/` (migración WP→Astro, SEO local/GEO/AAA, GTM/GA4, monorepo, megamenú ARIA)
- nota: 26 imágenes de cuerpo de posts antiguos (2016-2020) están rotas también en producción (404); se mantienen 1:1 — su corrección queda a decisión del operario (plan F0)

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
