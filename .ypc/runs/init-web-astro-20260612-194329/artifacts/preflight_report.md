# Preflight — init-web-astro — bances-web — 2026-06-12

## Veredicto: APTO CON AVISOS

El directorio de trabajo `/home/yapci/Programacion/bances-web` está virgen (solo metadatos `.ypc/` de este workflow). No hay proyecto existente, no hay `.git`, no hay `package.json`, no hay `wp-content`. Apto para scaffolding Astro.

---

## CWD: estado del directorio

**Ruta**: `/home/yapci/Programacion/bances-web`

Único contenido: `.ypc/runs/init-web-astro-20260612-194329/` (metadatos del workflow).

No existe ninguno de los indicadores de proyecto existente:
- `package.json` → NO existe
- `astro.config.*` → NO existe
- `pnpm-workspace.yaml` → NO existe
- `.git/` → NO existe
- `wp-content/` → NO existe
- `CLAUDE.md` / `README.md` → NO existen

**Conclusión CWD**: directorio virgen, apto para inicialización de proyecto nuevo.

---

## Herramientas (verificado por el orquestador)

| Herramienta | Estado | Nota |
|---|---|---|
| `node` | ✅ v26.1.0 | cumple ≥20 |
| `pnpm` | ✅ 9.15.0 | coincide con `packageManager` de los proyectos de referencia |
| `git` | ✅ 2.54.0 | OK |
| `gh` (GitHub CLI) | ⚠️ NO instalada | no bloqueante: el repo se verificó con `git ls-remote` y el push se hará con git estándar |

---

## Repo GitHub destino

**URL**: `https://github.com/yapcibello/bances-web`
**Estado**: ✅ EXISTE y está VACÍO (sin refs — `git ls-remote` exit 0 sin output). Listo para el primer push.

---

## Referencias: proyectos previos SMedialab

### logopedajessica-web (referencia base principal — producción)
Monorepo pnpm: `apps/www`, `apps/blog` (migración WP→Astro cerrada), `apps/app`, 2 microsites; `packages/config` (@lj/config), `packages/seo` (@lj/seo), `packages/ui` (@lj/ui). Catalog: astro ^5.16.8, tailwind ^3.4.17, typescript ^5.7.3. Node ≥20, pnpm 9.15.0. Deploy Docker+nginx NUC MACVLAN (10.0.12.80). PHP para formulario de contacto. SEO con 9 schemas JSON-LD, WCAG 2.2 AAA, gates de build (contraste, sitemap, enlaces).

### villena-web (referencia MÁS directa — clínica dental, migración WP→Astro, en scaffolding)
Mismo catalog que logopedajessica-web. `apps/www` + `apps/blog`, `packages/config` (@vd/config), `packages/ui` (@vd/ui: Layout, Header, Footer, Hero, FAQ, CTA). Tiene `docs/url-map.md` (preservación de URLs WP), paleta dental, tipografías Cormorant Garamond + DM Sans. Convención de puerto dev fijo 4310-4319.

### smedialab-web (Astro SSG monoapp — producción)
Sin monorepo. Deploy ZIP+PHP vía FTP a Hestia (NO usar este patrón para bances). Auditorías `auditoria-astro-produccion` como referencia de QA.

### vitali-web (monorepo multidominio — 14 dominios en producción)
Catalog astro ^5.7.0 (más antiguo). Patrón `.deploy-backups/` con imágenes WP originales preservadas — útil para la migración de assets.

---

## Web origen

**URL**: `https://clinicadentalbances.com/` — WordPress. Verificación HTTP y crawl delegados a fase discovery/migracion.

---

## Riesgos

1. **gh CLI no instalada** — push inicial vía git estándar con credenciales existentes; si se necesita crear PRs/issues habrá que instalarla.
2. **Namespace de packages sin acordar** — sugerencia: `@cdb/*` o `@bances/*` (decisión en discovery).
3. **Puerto dev sin asignar** — convención SMedialab de rango fijo; elegir rango libre que no colisione (logopeda/villena ocupan otros).
4. **villena-web en scaffolding parcial** — es la referencia más similar (clínica dental) pero incompleta; fallback estructural: logopedajessica-web.
5. **Formulario de citas WP** — decidir PHP+PHPMailer (patrón logopedajessica) o servicio externo (fase discovery).
6. **Catalog astro** — usar ^5.16.8 como baseline (logopeda/villena), no ^5.7.0 (vitali).

---

## Skills consultados
- ninguno: exploración read-only de sistema de archivos local; no se requirió lectura de skills.

## Skills no relevantes
- ninguno: `.claude/skills/` del proyecto no existe aún (CWD vacío).
