# Despliegue — bances-web

## Entorno de producción

- **Plataforma**: Hosting Hestia con acceso FTP — patrón ZIP + PHP `extractTo()` (como vitali-web y smedialab-web)
- **URL**: https://clinicadentalbances.com/
- **Rama de deploy**: `main`

## Requisitos previos

- Credenciales FTP del hosting Hestia (fuera del repo — ver plan F0)
- Build verde: `pnpm build:www` sin errores
- Verificación de paridad de URLs 1:1 con el WP origen (regla URLs inmutables de CLAUDE.md)

## Pasos de despliegue

```bash
# Scripts definitivos pendientes de la fase deploy-baseline del workflow init-web-astro.
# Patrón previsto (vitali/smedialab): empaquetar dist/ en ZIP, subir por FTP
# junto a un extract.php temporal, invocarlo por HTTP y eliminarlo.
pnpm build:www
pnpm deploy:www   # TODO: se implementa en fase deploy-baseline
```

## Variables de entorno

| Variable | Descripción | Origen |
|----------|-------------|--------|
| PUBLIC_GTM_ID | Container de Google Tag Manager (GTM-XXXXXX) | .env |

## Verificación post-deploy

- [ ] Home responde 200 en https://clinicadentalbances.com/
- [ ] Muestreo de URLs antiguas del WP responde 200 sin redirects (regla URLs inmutables)
- [ ] Sitemap accesible y válido
- [ ] Formulario de citas envía email correctamente
