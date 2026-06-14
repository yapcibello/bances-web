# Informe de verificación — init-web-astro — bances-web

> Fase 13 (verificacion · gate). Run `init-web-astro-20260612-194329`. Fecha: 2026-06-14.

## Resultado global: APTO

La migración WordPress → Astro de clinicadentalbances.com está funcionalmente completa, con paridad de URLs 1:1, build verde y los baselines SEO/GEO/AAA/GTM/deploy aplicados. Las tareas restantes requieren credenciales/decisiones humanas y se detallan en el plan F0 (`planes/2026-06-14-f0-bootstrap-bances/`).

## Smoke técnico

| Check | Resultado |
|---|---|
| `pnpm build:www` | ✅ Verde — 85 páginas + `sitemap-index.xml` en 2,7 s |
| Paridad de URLs vs `docs/url-map.md` | ✅ 84/84 URLs de contenido generadas, 0 modificadas |
| URL nueva añadida (permitida) | ✅ `/accesibilidad/` (declaración de accesibilidad) |
| Redirects 301 | ✅ Ninguno (regla de URLs inmutables respetada) |
| JSON-LD válido | ✅ `Dentist`, `BreadcrumbList`, `BlogPosting` parsean como JSON |
| Responsive home (chrome-devtools) | ✅ Móvil 390 / Escritorio 1280 verificados; barra de cita apila correctamente |
| `robots.txt` + `sitemap-index.xml` | ✅ Presentes, sitemap referenciado |
| `bash -n scripts/deploy-ftp.sh` | ✅ Sin errores de sintaxis |
| Secretos en repo | ✅ Ninguno; `.env*` ignorados salvo `.env.example` |

## Paridad de URLs

`docs/url-map.md` declara 84 URLs de contenido. `apps/www/dist` genera las 84 (home + 8 páginas estáticas + 3 legales + posts en `/{categoria}/{slug}/` + listados de categoría + `/tag/{slug}/`), más `/accesibilidad/` como **adición** (no sustituye ninguna). Verificado por script: los 2 "faltantes" detectados inicialmente (`/tag/`, `/listado-de-seguros/`) eran falsos positivos del regex (un encabezado y un substring de `/seguro-dental-adeslas-segurcaixa/listado-de-seguros/`, que sí existe).

## Baselines aplicados

- **SEO**: JSON-LD `Dentist` con geo/areaServed/sameAs/logo; `BreadcrumbList` y `BlogPosting` (wireado en posts); `robots.txt`; `og-default.jpg` 1200×630; canonical/hreflang/OG/Twitter ya presentes.
- **GEO**: `llms.txt` + `llms-full.txt`; componentes `BloqueCita.astro` (NAP citable) y `Faq.astro` (FAQPage JSON-LD) creados, **pendientes de wirear** con contenido real.
- **AAA**: página `/accesibilidad/`; `:focus-visible` reforzado (doble anillo sobre fondos de marca); `prefers-reduced-motion`; `scroll-margin` en anclas; token de texto de cuerpo `ink-soft` subido a #595959 (7:1).
- **GTM/GA4**: `dataLayer` + evento `lead_form_submit`; `.env.example` con `PUBLIC_GTM_ID` y SMTP.
- **Deploy**: `scripts/deploy-ftp.sh` + `deploy-swap.php.template`; backend `public/api/contacto.php` (PHPMailer) verificado y alineado con el formulario.

## Hallazgos abiertos (→ plan F0)

1. **Imágenes de cuerpo de posts antiguos rotas (26)**: posts de 2016-2020 referencian imágenes que dan 404 **también en producción**. Se mantienen 1:1 con el origen; corregirlas (re-mapear o eliminar) altera contenido migrado → decisión del operario.
2. **Contraste de acento/enlaces**: `primary` #EF7723 (2,86:1) y enlaces en prosa #D2641A (3,76:1) no alcanzan AA como texto. Recomendación documentada (subrayado redundante o token de enlace más oscuro); no aplicado para preservar fidelidad cromática.
3. **Wiring GEO**: `Faq.astro`/`BloqueCita.astro` requieren preguntas/datos reales para activarse en páginas.
4. **Credenciales**: FTP Hestia, SMTP real y `PUBLIC_GTM_ID` — pendientes (nunca en el repo).
5. **Pulido visual fino restante**: matices de la home (bloque Seguros menos saturado que producción, fotos de equipo en "Opiniones") y revisión página-a-página de las 8 estáticas.

## Verificación pendiente (requiere PHP/servidor)

- `php -l` sobre `contacto.php` y `deploy-swap.php.template` (PHP no instalado en el entorno de desarrollo).
- Envío real del formulario (requiere SMTP configurado).
