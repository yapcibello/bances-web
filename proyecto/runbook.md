# Runbook — bances-web

Operativa diaria del proyecto. Comandos siempre desde la raíz del monorepo (`/home/yapci/Programacion/bances-web`), Node ≥20 y pnpm 9.15.0 (`corepack enable`).

## Comandos esenciales

| Acción | Comando | Notas |
|--------|---------|-------|
| Instalar dependencias | `pnpm install` | strict peers; alinear versiones vía catalog, no desactivar el flag |
| Dev server | `pnpm dev:www` | sirve `apps/www` en **http://localhost:4320** (host expuesto en red local) |
| Build producción | `pnpm build:www` | ejecuta `astro check` + `astro build` → `apps/www/dist/` |
| Type-check | `pnpm check` | `astro check` aislado (sin build) |
| Importar blog del WP | `pnpm import:blog` | `scripts/import-blog-wp.mjs` (cheerio + turndown) |
| Tests | `pnpm test` | **pendiente**: aún sin suite (`echo 'TODO'`) |
| Deploy | `pnpm deploy:www` | **pendiente** de la fase deploy-baseline (ver `proyecto/despliegue.md`) |

## Añadir un post al blog

Los posts viven en `apps/www/src/content/posts/*.mdx` y se validan con el schema Zod de `apps/www/src/content.config.ts`.

1. Crea el archivo `apps/www/src/content/posts/{slug}.mdx`. El nombre del archivo es indicativo: **la URL real la fija `urlOriginal`**, no el nombre del fichero.
2. Rellena el frontmatter (campos obligatorios marcados con `*`):

   ```mdx
   ---
   title: Higiene Bucodental                 # *  ≤ 60 chars recomendado
   description: "¿Qué es la Higiene…"          # *  ≤ 160 chars recomendado
   urlOriginal: "/odontologia-conservadora/higiene-bucodental/"  # permalink WP 1:1 (lead + trailing slash)
   pubDate: 2017-03-31T17:06:55.000Z          # *  fecha de publicación (ISO)
   updatedDate: 2025-08-05T23:07:12.000Z      #    opcional
   author: Clínica Dental Bances              #    opcional
   categories:                                #    slugs que EXISTAN en content/categorias/
     - "odontologia-conservadora"
   tags:                                      #    slugs que EXISTAN en content/tags/
     - "estetica-dental"
   heroImage: "/wp-content/uploads/2017/03/Higiene-Bucodental.jpg"  # ruta pública
   wpId: 1154                                 #    trazabilidad de migración
   draft: false                               #    true = excluido del build
   ---

   Cuerpo del post en Markdown/MDX…
   ```

3. **URL inmutable**: `urlOriginal` debe coincidir EXACTO con el permalink del WP (forma `/{categoria}/{slug}/`). El primer segmento define la categoría de la ruta y el último el slug. No inventar ni "mejorar" slugs.
4. Cada slug de `categories` y `tags` debe tener su archivo `.json` en `content/categorias/` o `content/tags/` (si no existe, créalo con el schema de taxonomía: `slug`, `nombre`, `lead`, `wpId`).
5. Verifica en local: `pnpm dev:www` y visita la URL de `urlOriginal`. El post aparece también en `/recomendaciones-y-consejos-dentales/` y en los archivos de su categoría/tag.
6. Antes de subir: `pnpm build:www` en verde (incluye `astro check`, que valida el frontmatter contra Zod).

> Para una carga masiva desde el WordPress se usa `pnpm import:blog` (`scripts/import-blog-wp.mjs`), que descarga el HTML, lo convierte a MDX con turndown y rellena el frontmatter. Para 1 post puntual, edición manual.

## Añadir una página de tratamiento

La colección `tratamientos` (`apps/www/src/content/tratamientos/`) está aún con `.gitkeep` (pendiente de migración). Cuando se rellene: crear `{slug}.mdx` con `title`, `description`, `urlOriginal` (permalink WP exacto), `heroImage`, `orden`. La URL la determina `urlOriginal`; respetar la regla de URLs inmutables.

## Imágenes

Las imágenes migradas del WordPress se sirven con su ruta original preservada bajo `apps/www/public/wp-content/uploads/...` (referenciadas como `/wp-content/uploads/...` en `heroImage`, `siteConfig.logo`, etc.). No se renombran ni se mueven: la ruta es parte del contrato de URLs inmutables.

- **Añadir/regenerar una imagen**: colocar el archivo en la ruta `public/wp-content/uploads/AAAA/MM/` que indique el origen y referenciarla con esa misma ruta.
- **404 en imagen migrada**: causa habitual = ruta URL-encoded (`%20`, acentos). Decodificar la ruta a su forma literal (gotcha heredado de logopedajessica-web, 2026-05-05).

## Despliegue

El procedimiento operativo completo (precondiciones, pasos, verificación, rollback) vive en **`proyecto/despliegue.md`**. Resumen:

```bash
pnpm install
pnpm build:www       # debe terminar en verde
pnpm deploy:www      # TODO: script FTP ZIP + PHP extractTo() — fase deploy-baseline
```

Patrón previsto (igual que vitali-web / smedialab-web): empaquetar `apps/www/dist/` en ZIP, subirlo por FTP a Hestia junto a un `extract.php` temporal, invocarlo por HTTP y eliminarlo. **Excluir siempre** `api/config.local.php` del paquete de deploy (contiene el secreto SMTP).

### Checklist pre-deploy

- [ ] `pnpm build:www` en verde (incluye `astro check` sin errores de tipos ni de frontmatter Zod).
- [ ] **Paridad de URLs 1:1** con el WP origen verificada (regla de URLs inmutables de `CLAUDE.md`): ninguna URL existente modificada, solo añadidas.
- [ ] Sitemap (`sitemap-index.xml`) generado en `dist/`.
- [ ] `config.local.php` presente en el servidor (no en el ZIP) con el secreto SMTP real.
- [ ] Último ZIP bueno conservado para rollback.

### Verificación post-deploy

- [ ] Home responde 200 en https://clinicadentalbances.com/
- [ ] Muestreo de URLs antiguas del WP responde 200 **sin redirects**.
- [ ] Formulario de citas (Hero y Contacto) envía el email correctamente.

## Troubleshooting

| Síntoma | Causa probable | Solución |
|---------|---------------|----------|
| `pnpm install` falla por peers | `strict-peer-dependencies` en `.npmrc` | Alinear versiones vía `catalog:` en `pnpm-workspace.yaml`, no desactivar el flag |
| Build avisa "No files found matching" en `tratamientos` | Colección vacía (solo `.gitkeep`) — esperado hasta la migración | Desaparece al añadir contenido real |
| `astro check` falla en un post | Frontmatter no cumple el schema Zod (falta `pubDate`, `categories`/`tags` mal tipados) | Corregir el frontmatter según el schema de `content.config.ts` |
| Build de MDX falla | Sintaxis MDX inválida (JSX sin cerrar, import roto) | Revisar el `.mdx`; el cuerpo es Markdown salvo expresiones JSX explícitas |
| Post no aparece o da 404 | `draft: true`, o `urlOriginal` ausente/con < 2 segmentos (`parsearPermalink` devuelve null) | Poner `draft: false` y un `urlOriginal` con forma `/{categoria}/{slug}/` |
| Categoría/tag de un post no enlaza | Slug en `categories`/`tags` sin archivo `.json` en su colección | Crear la taxonomía en `content/categorias/` o `content/tags/` |
| Estilos de marca no aplican | App duplicando paleta en vez de usar el preset | Consumir `@bances/config` (`tailwind.preset.cjs`), nunca redefinir colores en la app |
| Hot-reload no refleja cambios en `@bances/config` | Pre-bundling de Vite | Ya excluido en `astro.config.mjs` (`optimizeDeps.exclude`); reiniciar `pnpm dev:www` si persiste |
| 404 en imagen migrada | Ruta `/wp-content/uploads/` URL-encoded | Decodificar la ruta a su forma literal |
| Formulario no envía en producción | Falta `config.local.php` o credenciales SMTP erróneas | Crear `config.local.php` en `public/api/` del servidor con el secreto SMTP (ver `proyecto/api.md`) |

## Rollback

Producción rota tras un deploy (5xx, páginas en blanco, URLs caídas): re-desplegar el ZIP del build anterior (conservar siempre el último ZIP bueno). Detalle definitivo en `proyecto/despliegue.md`.

```bash
git log --oneline           # localizar el último commit bueno
git checkout <commit-bueno> -- .
pnpm build:www && pnpm deploy:www
```

## Backup / Restore

- **Backup**: el código y el contenido migrado viven en git (`github.com/yapcibello/bances-web`). Las imágenes originales del WP se preservan versionadas en `apps/www/public/`. Hacer `git push origin main`. Además, cada deploy conserva el ZIP anterior.
- **Restore**:

  ```bash
  git clone https://github.com/yapcibello/bances-web.git
  cd bances-web && corepack enable && pnpm install && pnpm build:www
  ```
