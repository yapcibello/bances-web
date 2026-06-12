# Runbook — bances-web

> Proyecto en fase de bootstrap — aún sin despliegue operativo. Los procedimientos definitivos se completarán tras la fase deploy-baseline del workflow init-web-astro.

## Deploy

**Síntomas**: hay cambios en `main` verificados que deben llegar a producción.
**Precondiciones**: `pnpm build:www` en verde; paridad de URLs 1:1 con el WP origen verificada (regla URLs inmutables de CLAUDE.md); credenciales FTP disponibles fuera del repo.

### Pasos

```bash
pnpm install
pnpm build:www
pnpm deploy:www   # TODO: script FTP ZIP + PHP extractTo() — se implementa en fase deploy-baseline
```

### Verificación

- [ ] Home responde 200 en https://clinicadentalbances.com/
- [ ] Muestreo de URLs del WP origen responde 200 sin redirects
- [ ] Formulario de citas envía email

## Rollback

**Cuándo activar**: producción rota tras un deploy (errores 5xx, páginas en blanco, URLs caídas).

### Pasos

```bash
# Patrón previsto (igual que vitali/smedialab): re-desplegar el ZIP del build anterior.
# Conservar siempre el último ZIP bueno antes de subir uno nuevo.
# Detalle definitivo en fase deploy-baseline.
git log --oneline           # localizar el último commit bueno
git checkout <commit-bueno> -- .
pnpm build:www && pnpm deploy:www
```

### Verificación post-rollback

- [ ] Home y muestreo de URLs responden 200; contenido coincide con la versión anterior

## Backup / Restore

**Frecuencia**: en cada deploy (ZIP del build anterior) + el repositorio git es el backup del código y contenido.

### Procedimiento de backup

```bash
# El código y el contenido migrado viven en git (github.com/yapcibello/bances-web).
git push origin main
# Las imágenes originales del WP se preservan versionadas en apps/www/public/
```

### Restore

```bash
git clone https://github.com/yapcibello/bances-web.git
cd bances-web && corepack enable && pnpm install && pnpm build:www
```

## Debug — Problemas comunes

| Síntoma | Causa probable | Solución |
|---------|---------------|----------|
| `pnpm install` falla por peers | `strict-peer-dependencies=true` en `.npmrc` | Alinear versiones vía catalog en `pnpm-workspace.yaml`, no desactivar el flag |
| Build avisa "No files found matching" en tratamientos/posts | Colecciones vacías (solo `.gitkeep`) — esperado hasta la migración | Desaparece al añadir contenido real |
| Estilos de marca no aplican | App duplicando paleta en vez de usar el preset | Usar `presets: [@bances/config/tailwind-preset]` en `tailwind.config.mjs` |
| 404 en imagen migrada | Ruta `/wp-content/uploads/` URL-encoded (gotcha logopeda 2026-05-05) | Decodificar con patrón `decode-wp-paths.mjs` |
