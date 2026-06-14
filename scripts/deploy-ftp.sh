#!/bin/bash
# Deploy a producción (Hestia) vía FTP — extractTo() + manifest cleanup (sin huérfanos).
# Portado de smedialab-web / vitali-web (procedimiento battle-tested) y adaptado al
# monorepo de bances: app única `apps/www`, build con pnpm --filter, dist en apps/www/dist.
#
# Uso: bash scripts/deploy-ftp.sh [--build]
#   --build   ejecuta el build de apps/www antes de desplegar
#
# Credenciales: SOLO desde .env (nunca hardcodeadas). Copia .env.example → .env y rellénalo.
#   Variables requeridas: FTP_HOST, FTP_USER, FTP_PASS, FTP_PATH
#   Opcionales: DEPLOY_BASE_URL, DEPLOY_SMOKE_JSON, DEPLOY_PRESERVE_JSON
#
# Por qué NO swap atómico (verificado en proyectos hermanos): el rename de public_html
# falla en Hestia cuando el target es el docroot configurado. Por eso manifest cleanup:
# extractTo() directo + diff de manifest pre/post + borrado explícito de huérfanos.
# No es atómico (ventana ~5-10s) pero garantiza cero huérfanos acumulados sin downtime estricto.
#
# Endurecimiento (mantenido de los hermanos):
#   - Nombre aleatorio del PHP trigger: deploy-<16 hex>.php (no predecible)
#   - Token aleatorio de 32 hex verificado con hash_equals() (timing-safe) en el PHP
#   - Auto-delete del PHP al iniciar + fallback FTP rm si la ejecución falla
#   - config.local.php (contraseña SMTP) en PRESERVE_LIST: nunca se borra ni se sube en el ZIP

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$PROJECT_DIR/.env"
DIST_DIR="$PROJECT_DIR/apps/www/dist"
PHP_TEMPLATE="$SCRIPT_DIR/deploy-swap.php.template"
PNPM_FILTER="@bances/www"

# URL base para los smoke tests (loopback en el servidor + verificación externa).
BASE_URL="${DEPLOY_BASE_URL:-https://clinicadentalbances.com}"

# Smoke URLs (4 checks: home + grep marca, contacto, tratamientos, sitemap).
# El check de /sitemap.xml con grep "urlset" verifica que la FASE B del extract
# (sitemap al final) se completó. Personalizable vía DEPLOY_SMOKE_JSON.
# NO usar ${VAR:-default}: bash interpreta el primer '}' del default como cierre y trunca el JSON.
if [ -z "${DEPLOY_SMOKE_JSON:-}" ]; then
  SMOKE_JSON='[{"url":"/","grep":"Bances"},{"url":"/tratamientos-dentales-en-santa-cruz-de-tenerife/"},{"url":"/recomendaciones-y-consejos-dentales/"},{"url":"/sitemap.xml","grep":"urlset"}]'
else
  SMOKE_JSON="$DEPLOY_SMOKE_JSON"
fi

# Smoke externo (verificación cruzada desde local). Formato "path|patrón" (patrón opcional).
SMOKE_EXT="/|Bances /tratamientos-dentales-en-santa-cruz-de-tenerife/| /recomendaciones-y-consejos-dentales/| /sitemap.xml|urlset"

# Archivos a preservar del cleanup de huérfanos (paths relativos al docroot).
# api/config.local.php es la contraseña SMTP del servidor — NUNCA borrar.
if [ -z "${DEPLOY_PRESERVE_JSON:-}" ]; then
  PRESERVE_JSON='["api/config.local.php"]'
else
  PRESERVE_JSON="$DEPLOY_PRESERVE_JSON"
fi

# --- Cargar credenciales FTP de .env (sin source: evita problemas con caracteres especiales) ---
if [ ! -f "$ENV_FILE" ]; then
  echo "Error: no existe .env — copia .env.example y rellena las credenciales"
  exit 1
fi

FTP_HOST=$(grep '^FTP_HOST=' "$ENV_FILE" | cut -d= -f2)
FTP_USER=$(grep '^FTP_USER=' "$ENV_FILE" | cut -d= -f2)
FTP_PASS=$(grep '^FTP_PASS=' "$ENV_FILE" | cut -d= -f2-)
FTP_REMOTE_DIR=$(grep '^FTP_PATH=' "$ENV_FILE" | cut -d= -f2)

for var in FTP_HOST FTP_USER FTP_PASS FTP_REMOTE_DIR; do
  if [ -z "${!var:-}" ]; then
    echo "Error: variable FTP requerida vacía o ausente en .env (FTP_HOST, FTP_USER, FTP_PASS, FTP_PATH)"
    exit 1
  fi
done

# Normalizar FTP_PATH para que termine en '/' (el resto del script asume directorio).
case "$FTP_REMOTE_DIR" in
  */) ;;
  *) FTP_REMOTE_DIR="${FTP_REMOTE_DIR}/" ;;
esac

if [ ! -f "$PHP_TEMPLATE" ]; then
  echo "Error: plantilla PHP no encontrada: $PHP_TEMPLATE"
  exit 1
fi

# --- Build opcional ---
if [ "${1:-}" = "--build" ]; then
  echo "=== Build de $PNPM_FILTER ==="
  ( cd "$PROJECT_DIR" && pnpm --filter "$PNPM_FILTER" build )
  echo ""
fi

if [ ! -d "$DIST_DIR" ]; then
  echo "Error: no existe $DIST_DIR — ejecuta el build primero: bash scripts/deploy-ftp.sh --build"
  exit 1
fi

TOTAL_FILES=$(find "$DIST_DIR" -type f | wc -l)
echo "=== Deploy de bances con manifest cleanup: $TOTAL_FILES archivos ==="
echo "Destino: ftp://$FTP_HOST$FTP_REMOTE_DIR"
echo "Base URL smoke: $BASE_URL"
echo "Preserve list: $PRESERVE_JSON"
echo ""

# --- Identificadores únicos del deploy ---
TS="$(date +%Y%m%d_%H%M%S)"
ZIP_NAME="dist-deploy-${TS}.zip"
ZIP_FILE="$PROJECT_DIR/$ZIP_NAME"
TRIGGER_NAME="deploy-$(openssl rand -hex 8).php"
TRIGGER_TOKEN="$(openssl rand -hex 16)"
TRIGGER_URL="${BASE_URL%/}/${TRIGGER_NAME}"

cleanup_local() {
  rm -f "$ZIP_FILE" 2>/dev/null || true
}
trap cleanup_local EXIT

# --- Paso 1: Crear ZIP ---
# Se excluye api/config.local.php por si quedara en dist (no debería: vive solo en servidor).
echo "[1/5] Creando ZIP local..."
( cd "$DIST_DIR" && zip -rq "$ZIP_FILE" . -x "*.DS_Store" -x "Thumbs.db" -x "api/config.local.php" )
echo "  → $ZIP_FILE ($(du -h "$ZIP_FILE" | cut -f1))"

# --- Paso 2: Subir ZIP por FTP ---
echo ""
echo "[2/5] Subiendo ZIP al servidor..."
lftp -u "$FTP_USER","$FTP_PASS" "$FTP_HOST" -e "
set ssl:verify-certificate no
set net:timeout 120
set net:max-retries 5
put $ZIP_FILE -o ${FTP_REMOTE_DIR}${ZIP_NAME}
quit
"
echo "  → ZIP subido como ${ZIP_NAME}"

# --- Paso 3: Generar y subir el trigger PHP (placeholders inyectados) ---
echo ""
echo "[3/5] Subiendo trigger PHP de extract..."
PHP_LOCAL=$(mktemp /tmp/deploy-bances-XXXX.php)

# Escapado: token/zip/base con sed (delimitador |); JSON en base64 para evitar
# problemas de comillas dobles en sed.
TOKEN_ESC=$(printf '%s' "$TRIGGER_TOKEN" | sed 's:[\\/&|]:\\&:g')
ZIP_ESC=$(printf '%s' "$ZIP_NAME" | sed 's:[\\/&|]:\\&:g')
BASE_ESC=$(printf '%s' "$BASE_URL" | sed 's:[\\/&|]:\\&:g')
SMOKE_B64=$(printf '%s' "$SMOKE_JSON" | base64 -w0)
PRESERVE_B64=$(printf '%s' "$PRESERVE_JSON" | base64 -w0)

sed \
  -e "s|__TOKEN__|${TOKEN_ESC}|g" \
  -e "s|__ZIP_FILENAME__|${ZIP_ESC}|g" \
  -e "s|__SMOKE_URLS_B64__|${SMOKE_B64}|g" \
  -e "s|__BASE_URL__|${BASE_ESC}|g" \
  -e "s|__PRESERVE_B64__|${PRESERVE_B64}|g" \
  "$PHP_TEMPLATE" > "$PHP_LOCAL"

# Sanity: verificar que los 5 placesholders fueron reemplazados (no usar regex genérica
# __[A-Z_]+__ porque matchea __FILE__/__DIR__ legítimos de PHP).
RESIDUAL=$(grep -oE '__(TOKEN|ZIP_FILENAME|SMOKE_URLS_B64|BASE_URL|PRESERVE_B64)__' "$PHP_LOCAL" || true)
if [ -n "$RESIDUAL" ]; then
  echo "  → ERROR: placeholders sin sustituir en el PHP generado:"
  echo "$RESIDUAL" | sort -u
  rm -f "$PHP_LOCAL"
  exit 1
fi

lftp -u "$FTP_USER","$FTP_PASS" "$FTP_HOST" -e "
set ssl:verify-certificate no
put $PHP_LOCAL -o ${FTP_REMOTE_DIR}${TRIGGER_NAME}
quit
"
rm -f "$PHP_LOCAL"
echo "  → PHP subido como ${TRIGGER_NAME}"

# --- Paso 4: Trigger extract + manifest cleanup + smoke loopback ---
echo ""
echo "[4/5] Ejecutando extract + manifest cleanup + smoke loopback..."
RESULT=$(curl -sS --max-time 90 "${TRIGGER_URL}?token=${TRIGGER_TOKEN}" || echo "ERROR:curl-failed")

# Fallback: si el PHP no se auto-eliminó, borrarlo por FTP (mantiene el endurecimiento).
lftp -u "$FTP_USER","$FTP_PASS" "$FTP_HOST" -e "
set ssl:verify-certificate no
rm -f ${FTP_REMOTE_DIR}${TRIGGER_NAME}
quit
" >/dev/null 2>&1 || true

echo "  → Respuesta servidor: $RESULT"

if [[ "$RESULT" == FAIL:* ]]; then
  echo ""
  echo "  ✗ Deploy ejecutado pero SMOKE LOOPBACK FALLÓ tras el cleanup."
  echo "    El sitio puede tener páginas rotas. NO hay rollback automático."
  echo "    Recovery: git revert <commit> && bash scripts/deploy-ftp.sh --build (o restaurar backup Hestia)."
  exit 1
fi
if [[ "$RESULT" != OK:* ]]; then
  echo ""
  echo "  ✗ ERROR en deploy: $RESULT"
  echo "    Estado del servidor desconocido. Revisar manualmente vía Hestia FileManager."
  exit 1
fi

# Parse: OK:extracted=<N>:cleaned=<N>:failed=<N>:emptydirs=<N>:smoke=...
EXTRACTED=$(echo "$RESULT" | grep -oE 'extracted=[0-9]+' | head -1 | cut -d= -f2)
CLEANED=$(echo "$RESULT" | grep -oE 'cleaned=[0-9]+' | head -1 | cut -d= -f2)
FAILED_DEL=$(echo "$RESULT" | grep -oE 'failed=[0-9]+' | head -1 | cut -d= -f2)
EMPTYDIRS=$(echo "$RESULT" | grep -oE 'emptydirs=[0-9]+' | head -1 | cut -d= -f2)
echo "  → $EXTRACTED extraídos · $CLEANED huérfanos limpiados (failed: ${FAILED_DEL:-0}) · $EMPTYDIRS dirs vacíos"

# --- Paso 5: Smoke externo de verificación cruzada ---
echo ""
echo "[5/5] Smoke externo (verificación cruzada desde local)..."
SMOKE_FAIL=0
for pg in $SMOKE_EXT; do
  path="${pg%%|*}"
  pattern="${pg#*|}"
  url="${BASE_URL%/}${path}"
  CODE=$(curl -s -o /tmp/smoke-bances.$$ -w "%{http_code}" --max-time 15 "$url" || echo "000")
  if [ "$CODE" != "200" ]; then
    echo "  ✗ $url → HTTP $CODE"
    SMOKE_FAIL=1
  elif [ -n "$pattern" ] && ! grep -q "$pattern" /tmp/smoke-bances.$$ 2>/dev/null; then
    echo "  ✗ $url → 200 OK pero falta patrón '$pattern'"
    SMOKE_FAIL=1
  else
    echo "  ✓ $url → 200 OK${pattern:+ + patrón '$pattern'}"
  fi
  rm -f /tmp/smoke-bances.$$
done

echo ""
if [ "$SMOKE_FAIL" -eq 1 ]; then
  echo "⚠ Smoke externo con incidencias (el loopback del servidor sí pasó)."
  echo "  Posibles causas: caché CDN, DNS local, intermitencia. Verifica: curl -I $BASE_URL/"
  exit 2
fi

echo "✓ Deploy de bances completado — $EXTRACTED archivos, $CLEANED huérfanos eliminados."
echo "  Sin rollback automático: bug post-deploy → git revert + redeploy, o restaurar backup Hestia."
