# Discovery — init-web-astro — bances-web — 2026-06-12

## Método

Las 9 decisiones del workflow se capturaron en el hilo principal vía AskUserQuestion (4 preguntas: hosting, estructura de apps, formulario, confirmación del resto), fundamentadas con análisis previo de la web origen (WebFetch a https://clinicadentalbances.com/). El operario añadió además una regla crítica de URLs inmutables por mensaje directo.

## Análisis de la web origen

- **Navegación**: Inicio `/`, Quienes Somos `/dentista-en-santa-cruz-de-tenerife/`, Tratamientos `/tratamientos-dentales-en-santa-cruz-de-tenerife/` (submenú: Blanqueamiento, Cirugía Oral, Endodoncias, Implantes, Odontología Conservadora, Odontopediatría, Ortodoncia, Ortodoncia Invisible, Odontología Digital, Periodoncia, Prótesis Dentales, Radiología 3D), Seguros Dentales `/seguros-dentales/`, Instalaciones `/instalaciones/`, Blog `/recomendaciones-y-consejos-dentales/`, Contacto `#Contacto`.
- **Blog**: en el MISMO dominio como ruta (no subdominio) — determinante para la decisión de apps.
- **Idioma**: solo español.
- **Contacto**: C. Juan Pablo II nº26, 38004 Santa Cruz de Tenerife · 922 243 555 / 636 001 450 · info@clinicadentalbances.com · formulario con campo de tratamiento + RGPD · WhatsApp.
- **Marca**: azul marino + blanco.

## Las 9 decisiones (discovery.json)

| # | Decisión | Valor | Origen |
|---|---|---|---|
| 1 | slug | `bances` | confirmado por operario |
| 2 | marca | Clínica Dental Bances | confirmado |
| 3 | subdominios | **solo-www** — blog como ruta `/recomendaciones-y-consejos-dentales/` | elegido por operario (preserva URLs 1:1) |
| 4 | referencia-diseño | réplica 1:1 del WP actual; patrones estructurales de logopedajessica-web y villena-web | brief del operario |
| 5 | paleta | personalizada — extraer del CSS del WP en fase migración (azul marino + blanco) | confirmado |
| 6 | tipo-negocio | servicios-profesionales + colección `posts` | confirmado |
| 7 | hosting | **FTP: ZIP + PHP extractTo() a Hestia — como vitali-web y smedialab-web** | elegido por operario |
| 8 | idiomas | solo-es | confirmado |
| 9 | migración | wordpress desde https://clinicadentalbances.com/ — textos e imágenes sin cambios | brief del operario |

**Extras acordados**: formulario = PHP + PHPMailer (patrón logopeda/smedialab) · namespace `@bances/*` · puerto dev 4320 · repo https://github.com/yapcibello/bances-web

## ⚠️ Regla crítica añadida por el operario: URLs inmutables

> NINGUNA URL existente en producción se modifica — ni cambios de slug, ni redirects 301 como solución. Solo se permite AÑADIR URLs nuevas. Cualquier modificación de URL requiere confirmación humana explícita ANTES de aplicarla.

Registrada en `discovery.json` (clave `urls_inmutables`) y en `CLAUDE.md` (callout CAUTION + Boundaries). Implicación para fases posteriores: la fase migración debe generar `docs/url-map.md` con el inventario completo de URLs del WP y la fase verificación debe comprobar paridad 1:1 sin redirects.

## Artefactos producidos

- `.ypc/runs/init-web-astro-20260612-194329/discovery.json` — shape completo
- `CLAUDE.md` (raíz del proyecto) — creado anticipadamente con la regla de URLs inmutables (la fase blueprint lo completará sin eliminar ese boundary)

---

## Skills consultados
- gestion/project-blueprint: estructura de CLAUDE.md (Stack/Comandos/Convenciones/Boundaries) aplicada al crear el archivo anticipado.

## Skills no relevantes
- gestion/planificacion-asistida: las decisiones ya estaban acotadas por el YAML del workflow; no hizo falta protocolo extendido de planificación.
