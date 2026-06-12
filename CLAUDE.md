# bances-web

Migración WordPress → Astro de [clinicadentalbances.com](https://clinicadentalbances.com/) (Clínica Dental Bances, Santa Cruz de Tenerife). Réplica visual 1:1 del sitio actual con SEO/GEO/AAA aplicados.

> [!CAUTION]
> **URLs inmutables (regla innegociable)**: NINGUNA URL existente en producción se modifica — ni cambios de slug, ni "arreglos" con redirects 301. Solo se permite **añadir** URLs nuevas. Si cualquier tarea parece requerir modificar una URL existente, **detenerse y pedir confirmación explícita al operario ANTES de tocarla**. El mapa de URLs canónico vive en `docs/url-map.md` (se genera en la fase de migración).

## Stack

- Astro 5.x SSG (catalog ^5.16.8) + Tailwind 3.x + TypeScript 5.x
- Monorepo pnpm 9.15.0, Node ≥20 — namespace `@bances/*`
- App única `apps/www` — el blog vive como ruta `/recomendaciones-y-consejos-dentales/` (igual que en el WP origen)
- Formulario de citas: PHP + PHPMailer (patrón logopedajessica-web / smedialab-web)
- Deploy: ZIP + PHP extractTo() vía FTP a Hestia (patrón vitali-web / smedialab-web)

## Comandos

- `pnpm dev:www` — dev server (puerto 4320)
- `pnpm build:www` — build producción
- `pnpm test` — tests
- Deploy: pendiente de scripts en fase deploy-baseline

## Convenciones

- TODO en español (código, comentarios, commits, docs) con caracteres correctos (á, é, ñ, ¿, ¡)
- Commits: `tipo: descripción` (feat, fix, refactor, docs, style, test, chore)
- Tokens de marca SOLO en `packages/config/tailwind.preset.cjs` — las apps usan el preset, nunca duplican paleta
- Workspace deps con `workspace:*`; deps explícitas en cada `apps/*/package.json` (pnpm strict)
- Contenido migrado: textos e imágenes EXACTOS al WP origen — sin reescrituras

## Boundaries

- **Siempre**: preservar URLs 1:1 con el WP origen; AAA WCAG 2.2 en componentes nuevos; verificar build antes de proponer deploy
- **Preguntar antes**: modificar CUALQUIER URL existente (regla de URLs inmutables); tocar textos o imágenes del contenido migrado; añadir dependencias fuera del catalog
- **Nunca**: redirects 301 para "resolver" cambios de slug; secretos en el repo; deploy sin tests verdes
