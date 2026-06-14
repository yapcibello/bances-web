# Pendientes — bances-web

## Prioritario (→ requieren operario, ver `planes/2026-06-14-f0-bootstrap-bances/`)

- [ ] **Credenciales de producción**: FTP Hestia en `.env`, `config.local.php` con SMTP real, `PUBLIC_GTM_ID` del contenedor GTM/GA4. Nunca en el repo
- [ ] **Decidir sobre imágenes rotas de posts antiguos (26)**: están 404 también en producción; mantener 1:1 o re-subir/editar (es contenido migrado → decisión del operario)
- [ ] **Corte WP → Astro**: deploy a staging Hestia + smoke + verificación de paridad 1:1 + DNS cuando el cliente apruebe

## Mejoras

- [ ] **Pulido visual fino restante** (2026-06-14): las 8 estáticas + índice de blog verificadas página a página — sólidas, sin bugs (Quiénes Somos incluso mejora a producción con grid de equipo). Quedan solo matices opcionales de la home: saturación del bloque Seguros y fotos de la sección "Opiniones" frente al layout Elementor de producción
- [ ] **Wirear bloques GEO** (`Faq.astro`, `BloqueCita.astro`) cuando haya FAQ reales y horario confirmado de la clínica
- [ ] **Contraste de enlaces/acento**: valorar subrayado redundante o token de enlace más oscuro (#D2641A → ~#A8501A) frente a fidelidad cromática exacta

## Ideas

- [ ] Valorar colecciones GEO adicionales (glosario dental, FAQ) como AMPLIACIÓN de URLs — nunca modificando las existentes

## Deuda técnica

- [ ] `@bances/seo` referenciado en `vite.optimizeDeps.exclude` sin ser dependencia declarada de www — añadir `workspace:*` cuando se consuma
- [ ] `pnpm test` sigue siendo un placeholder (`echo 'TODO'`) — definir suite mínima (build + paridad URLs + smoke)
