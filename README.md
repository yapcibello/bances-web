# bances-web

Monorepo de la migración del sitio de **Clínica Dental Bances** de WordPress a [Astro](https://astro.build/).

Origen: [https://clinicadentalbances.com/](https://clinicadentalbances.com/)

## Objetivo

Réplica visual **1:1** del WordPress actual sobre una base Astro estática, con:

- **SEO técnico**: meta tags, Open Graph, canonical, sitemap y JSON-LD (`Dentist`).
- **GEO / SEO local**: geo tags (`geo.region`, `geo.position`, `ICBM`) y datos de negocio reales.
- **Accesibilidad AAA**: estructura semántica, skip links y objetivos táctiles mínimos.
- **URLs inmutables**: los slugs de producción se preservan 1:1; ninguna URL existente se modifica sin confirmación humana.

## Requisitos

- **Node.js ≥ 20** (ver `.nvmrc`).
- **pnpm 9.15.0** vía Corepack:

  ```bash
  corepack enable
  ```

  Corepack instala automáticamente la versión de pnpm fijada en `packageManager`.

## Comandos

| Comando | Descripción |
|---|---|
| `pnpm install` | Instala las dependencias de todo el workspace. |
| `pnpm dev:www` | Arranca la web en modo desarrollo (puerto **4320**). |
| `pnpm build:www` | Build de producción de la web (incluye `astro check`). |
| `pnpm test` | Ejecuta la suite de tests. |

## Estructura del monorepo

```
bances-web/
├── apps/
│   └── www/            # Web principal (Astro) — clinicadentalbances.com
├── packages/
│   ├── config/         # Configuración compartida: siteConfig, tokens y preset de Tailwind
│   └── seo/             # Utilidades de SEO compartidas
├── pnpm-workspace.yaml # Workspaces + catalog de versiones compartidas
└── package.json        # Scripts raíz del monorepo
```

Las versiones de las dependencias compartidas (Astro, Tailwind, etc.) se gestionan de forma centralizada con el **catalog** de pnpm (`pnpm-workspace.yaml`); cada paquete las referencia con `catalog:`, y las dependencias internas con `workspace:*`.

---

**Desarrollado con ❤️ por el equipo de SMedialab**
