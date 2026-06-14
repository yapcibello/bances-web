# Migración WordPress → Astro — bances-web — informe de fase

Run: `init-web-astro-20260612-194329` · Origen: https://clinicadentalbances.com/ (WordPress + Elementor) · Estrategia: reconstrucción NATIVA a componentes Astro+Tailwind (decisión del operario).

## Resultado: TODAS las URLs migradas ✅

`pnpm build:www` → **84 páginas, exit 0**. Paridad contra `docs/url-map.md`: **0 URLs faltan**.

| Grupo | Cantidad | Ruta Astro |
|---|---|---|
| Home | 1 | `pages/index.astro` (11 secciones nativas) |
| Páginas estáticas | 8 | quienes somos, tratamientos (índice), seguros-dentales, instalaciones (galería 32 fotos), aviso-legal, cookies, privacidad, índice blog |
| Posts blog | 46 | `pages/[categoria]/[slug].astro` (URL 1:1 desde `urlOriginal`) |
| Listados de categoría | 17 | `pages/[categoria]/index.astro` |
| Listados de tag | 12 | `pages/tag/[tag]/index.astro` |

## Componentes y assets

- **Chrome**: Header, Navbar (menú + submenú accesible AAA, móvil con foco atrapado), Footer (datos, legales, redes Facebook/Instagram). Layout con skip link, JSON-LD, canonical, OG, GTM env.
- **Home**: 11 componentes en `components/home/` + primitivos `components/ui/`.
- **Blog**: `components/blog/PostCard.astro` + `utils/blog.ts` (parseo de permalinks).
- **Infra**: `@astrojs/mdx` + fuentes Inter/Heebo self-hosted (Fontsource).
- **Identidad**: paleta naranja #EF7723 (Kit Elementor) + Inter/Heebo en `tailwind.preset.cjs`.
- **Imágenes**: 171 (blog) + galería instalaciones (32) + assets de páginas, todas bajo `/wp-content/uploads/` con ruta preservada.
- **Formulario**: `public/api/contacto.php` (PHPMailer, $_POST + JSON, honeypot, rate limit) + `config.local.example.php` (secreto SMTP gitignored).

## Decisiones

- `sin-categoria` y 5 categorías sin posts (invisalign, odontologia-digital, protesis-dentales, seguro-dental-asisa, seguro-dental-mapfre) se generan como listados VACÍOS porque devuelven HTTP 200 en origen — preservación de URLs inmutables.
- URL de cada post derivada del `urlOriginal` exacto (no recalculada desde categories[0]).
- Autor por defecto "Clínica Dental Bances" (REST API /users bloqueada 401).

## Pendiente (no bloquea la paridad de URLs)

- **Pulido visual fino**: la home y algunas páginas no son 100% pixel-perfect aún (el agente de pulido agotó turnos). Requiere iteración comparando capturas.
- 24 imágenes con 404 real en el WP origen (huérfanas) — dejadas igual que el origen, en `docs/migracion-blog/ambiguedades.tsv`.
- Leads de taxonomía placeholder (29) — revisión editorial en `docs/migracion-blog/taxonomia-revisar.tsv`.
- Backend SMTP: credenciales reales en `config.local.php` (servidor).
- Fases siguientes del workflow: seo/geo/a11y/gtm/deploy baselines + verificación + plan-f0.

---

## Skills consultados
- gestion/agentes-write-once: aplicada en la importación masiva de posts (Read+Write 1-shot).
- Referencia logopedajessica-web: pipeline import WP (scripts/import-blog-wp.mjs) y endpoint PHP de contacto.

## Skills no relevantes
- gestion/markdown-github: no se editaron .md de documentación en la reconstrucción de componentes.
