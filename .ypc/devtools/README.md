# Rastreos y pruebas con chrome-devtools

> Carpeta gestionada por `ypc devtools` — generada automáticamente por `ypc project init`.

Este directorio centraliza las **pruebas de frontend** del proyecto **bances-web** realizadas con el MCP `chrome-devtools` desde Claude Code: capturas de pantalla, logs de consola, inventario de requests de red, snapshots DOM y auditorías Lighthouse.

## Concepto: targets

Un **target** es una web (o entorno) que se audita dentro del proyecto. Un proyecto puede tener desde un único target (la propia web del proyecto) hasta decenas (análisis competitivo, benchmarks, auditorías de múltiples clientes). Cada target vive en su propia carpeta con su `target.conf` y sus `reports/` — así los informes nunca se mezclan.

Todo proyecto empieza con un target llamado `principal` creado automáticamente por `ypc devtools init`. Puedes añadir más en cualquier momento con `ypc devtools target add <slug>`.

## Para qué sirve

Cuando le pides a Claude *"prueba la web del proyecto con devtools"*, Claude:

1. Arranca un Chrome dedicado con `ypc devtools chrome on` (puerto 9222).
2. Elige el target (por defecto `principal`, o el que le indiques) y lee su URL de `targets/<slug>/target.conf`.
3. Usa las tools MCP `mcp__chrome-devtools__*` para inspeccionar la página.
4. Crea una carpeta nueva en `targets/<slug>/reports/` con timestamp y etiqueta.
5. Guarda ahí todas las evidencias (capturas, logs, snapshots, JSONs).
6. Genera el **informe legible** final en `docs/devtools/YYYY-MM-DD-<slug>-<etiqueta>.md` o en `planes/` si deriva en acción.

> [!IMPORTANT]
> **Las evidencias crudas viven aquí. Los informes legibles viven en `docs/devtools/` o `planes/`.** Es una separación a propósito: esta carpeta se puede limpiar, los informes no.

## Estructura

```text
.ypc/devtools/
├── README.md                       # este archivo — revisable manualmente
├── config.conf                     # defaults globales (viewport, retención, criterios)
├── .gitignore                      # ignora targets/*/reports/ y perfiles temporales
├── targets/
│   ├── principal/
│   │   ├── target.conf             # nombre, URLs y overrides del target principal
│   │   └── reports/                # raw artifacts del target principal (NO versionado)
│   │       └── 2026-04-10_152233_smoke-home/
│   │           ├── meta.json       # target, URL, viewport, hora, estado
│   │           ├── consola.jsonl   # mensajes de consola del navegador
│   │           ├── red.jsonl       # requests (URL, status, tipo, tamaño)
│   │           ├── snapshot.txt    # snapshot a11y del DOM
│   │           ├── lighthouse.json # informe Lighthouse (si se corrió)
│   │           └── capturas/
│   │               ├── 01-viewport.png
│   │               └── 02-fullpage.png
│   └── competidor-acme/            # ejemplo de target adicional
│       ├── target.conf
│       └── reports/
└── flujos/                         # (futuro v2) guiones YAML reutilizables
```

## Dónde van los informes finales

| Tipo | Destino | Versionado |
| :--- | :--- | :---: |
| **Evidencias crudas** (capturas, logs, snapshots) | `.ypc/devtools/targets/<slug>/reports/` | No |
| **Informe rutinario** (análisis de un rastreo) | `docs/devtools/YYYY-MM-DD-<slug>-<etiqueta>.md` | Sí |
| **Plan de acción** derivado de un hallazgo | `planes/YYYY-MM-DD-<tema>.md` | Sí |

## Comandos habituales

```bash
# Información y estado
ypc devtools info                              # resumen del proyecto + lista de targets + chrome
ypc devtools info --target principal           # detalle de un target concreto
ypc devtools target list                       # solo la lista de targets
ypc devtools target show principal             # config completa del target

# Gestión de targets
ypc devtools target add competidor-acme --url https://acme.com --nombre "Competidor ACME"
ypc devtools target rename viejo-slug nuevo-slug
ypc devtools target remove competidor-acme     # borra target + reports (pide confirmación)

# URL del target
ypc devtools url                               # muestra URL del target por defecto
ypc devtools url --target principal            # muestra URL del target indicado
ypc devtools url --target principal --set https://nueva.url

# Rastreos
ypc devtools chrome on                         # arrancar Chrome dedicado (localhost:9222)
ypc devtools chrome off                        # parar el Chrome dedicado
ypc devtools nuevo smoke-home                  # crea reporte en target por defecto
ypc devtools nuevo --target competidor-acme home
ypc devtools nuevo --target principal --url https://staging.proyecto.com smoke-staging

# Reportes
ypc devtools reportes                          # todos los reportes agrupados por target
ypc devtools reportes --target principal       # solo los del target indicado
ypc devtools reportes --limpiar                # retención por-target (defecto en config.conf)
ypc devtools reportes --target principal --limpiar 5
ypc devtools reportes --target principal --limpiar 14d
```

## Retención

> [!NOTE]
> La retención se aplica **por target**. Si tienes 5 targets y la retención es 10, puedes tener hasta 50 reportes en total (10 por target). La limpieza es **manual** — nunca automática — para no borrar sin querer evidencias de una sesión de análisis en curso.

## Cómo pedirle a Claude que lo use

Ejemplos de peticiones que activan el flujo completo:

- *"Prueba la web del proyecto con devtools y dame el informe."*
- *"Añade un target nuevo para la web de acme.com y haz un smoke test."*
- *"Compara el home de mi proyecto con el de 3 competidores."*
- *"Corre un Lighthouse sobre `/contacto` del target principal y guárdame el informe."*

Claude leerá este README y `config.conf`, listará los targets del proyecto, elegirá o creará el que corresponda, arrancará el Chrome dedicado si no está corriendo, ejecutará el rastreo, guardará las evidencias en `targets/<slug>/reports/<timestamp>_<etiqueta>/` y escribirá el informe en `docs/devtools/`.

## Mantenimiento de este README

Este archivo es una **plantilla inicial**. Revísalo y personalízalo cuando:

- Añadas o elimines **targets significativos** (deja una nota de por qué estás auditando cada uno).
- Cambien los **flujos prioritarios** que sueles querer probar (login, alta, checkout…).
- Añadas **guiones reutilizables** en `flujos/` que valga la pena documentar.
- Cambien los **criterios de aceptación** globales o por target.

El skill `gestion/save` revisará este archivo periódicamente y te sugerirá actualizarlo si detecta que el uso ha evolucionado.
