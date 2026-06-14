# Plan F0 — Bootstrap a producción — bances-web

> Tareas que requieren **intervención humana** (credenciales, accesos externos, decisiones de contenido) para llevar la migración WordPress → Astro de clinicadentalbances.com a producción. Generado al cierre del workflow `init-web-astro` (run `init-web-astro-20260612-194329`), 2026-06-14.

> [!CAUTION]
> **Regla innegociable vigente**: ninguna URL existente en producción se modifica (sin cambios de slug, sin 301; solo añadir). Antes del corte WP→Astro, verificar paridad 1:1 con `docs/url-map.md`.

## Estado del proyecto

Migración funcionalmente completa: 84 URLs migradas 1:1, build verde (85 páginas con `/accesibilidad/` añadida), baselines SEO/GEO/AAA/GTM/deploy aplicados. Lo que sigue NO lo puede hacer la IA porque depende de credenciales y decisiones del negocio.

## F0.1 — Credenciales y secretos (bloqueante para deploy)

- [ ] **FTP Hestia**: rellenar en `.env` (a partir de `.env.example`): `FTP_HOST`, `FTP_USER`, `FTP_PASS`, `FTP_PATH`. Nunca commitear el `.env`.
- [ ] **SMTP del formulario**: crear `apps/www/public/api/config.local.php` en el servidor (a partir de `config.local.example.php`) con la contraseña SMTP real. Confirmar `SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`: actualmente heredados del relay de smedialab (`mail.dev-smedialab.com`) — decidir si bances usa buzón propio (`info@clinicadentalbances.com`).
- [ ] **Verificar PHP**: ejecutar `php -l apps/www/public/api/contacto.php` y `php -l scripts/deploy-swap.php.template` en una máquina con PHP antes del primer deploy.
- [ ] Actualizar el script `deploy:www` del `package.json` raíz (hoy es un placeholder `echo`) para invocar `bash scripts/deploy-ftp.sh --build`.

## F0.2 — Analítica (GTM / GA4)

- [ ] Crear contenedor GTM y propiedad GA4 de la clínica; obtener el `GTM-XXXX`.
- [ ] Definir `PUBLIC_GTM_ID` en el entorno de build (no en el repo).
- [ ] En GTM, configurar el disparador sobre el evento `lead_form_submit` (ya se empuja al `dataLayer` al enviar los formularios de cita) y la etiqueta de conversión GA4. Consent Mode v2 si aplica (skill `analytics/gtm-ga4-eventos`).

## F0.3 — Decisiones de contenido (operario)

- [x] **Imágenes rotas en posts antiguos (26)** (resuelto 2026-06-14): repuntadas a un placeholder de marca (`placeholder-bances.webp`). Si prefieres las imágenes reales originales, hay que re-subirlas al hosting y re-apuntar los MDX (dan 404 también en producción).
- [x] **Bloques GEO** (resuelto 2026-06-14): FAQ general (7 Q&A) en la home + 32 FAQ reales por tratamiento (10 tratamientos) extraídas de producción + `BloqueCita` con horario real en "Quiénes Somos"; `openingHoursSpecification` en el schema `Dentist`. Todas las páginas de tratamiento emiten FAQPage. **Confirmar que el horario y las respuestas siguen vigentes** (el contenido es de la web actual).
- [ ] **Pulido visual fino restante** (opcional): matices de la home (saturación del bloque Seguros, sección "Opiniones"). Las 8 estáticas ya se verificaron sólidas (2026-06-14).

## F0.4 — Corte DNS y publicación

- [ ] Primer deploy a un subdominio/staging de Hestia y smoke manual (formulario, navegación, móvil).
- [ ] Verificación final de paridad de URLs 1:1 (sin 301) contra el WP origen.
- [ ] Corte de DNS WP → Astro cuando el cliente lo apruebe.
- [ ] Post-deploy: enviar `sitemap-index.xml` a Google Search Console (skill `seo/google-search-console`); validar JSON-LD con Rich Results Test; revisar CrUX/PSI tras unos días.

## F0.5 — Accesibilidad (decisión opcional)

- [ ] Valorar mejora de contraste de enlaces en prosa (#D2641A, 3,76:1) y acento (#EF7723) — subrayado redundante o token más oscuro — frente a fidelidad cromática exacta. Documentado en `proyecto/` y en el informe de verificación.

## Referencias

- Informe de verificación: `.ypc/runs/init-web-astro-20260612-194329/artifacts/verification_report.md`
- Mapa de URLs (contrato inmutable): `docs/url-map.md`
- Despliegue: `proyecto/despliegue.md` · API formulario: `proyecto/api.md`
